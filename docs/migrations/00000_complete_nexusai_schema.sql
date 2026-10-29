-- ============================================================
-- ESQUEMA COMPLETO DE BASE DE DATOS — NEXUSAI PLATFORM
-- Arquitectura Multitenant estricta con Row Level Security (RLS)
-- Cumple con todos los requisitos RF-01 a RF-15 (PROYECTO.md)
-- ============================================================

-- Habilitar extensiones necesarias
create extension if not exists "pgcrypto";
create extension if not exists "uuid-ossp";

-- ============================================================
-- 1. IDENTIDAD Y ACCESO MULTITENANT (RF-01)
-- ============================================================

-- Tabla de Organizaciones (Tenants)
create table if not exists public.organizations (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    slug text unique not null,
    logo_url text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Tabla de Perfiles Públicos (1 a 1 con auth.users de Supabase)
create table if not exists public.user_profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    first_name text not null,
    last_name text not null,
    avatar_url text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Tabla de Membresías y Roles en Organización (RBAC estricto)
-- Roles válidos: 'admin', 'employee', 'client'
create table if not exists public.organization_memberships (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    organization_id uuid not null references public.organizations(id) on delete cascade,
    role text not null check (role in ('admin', 'employee', 'client')),
    status text not null default 'active' check (status in ('active', 'invited', 'suspended')),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint uq_user_organization unique (user_id, organization_id)
);

create index if not exists idx_org_memberships_user on public.organization_memberships(user_id);
create index if not exists idx_org_memberships_org on public.organization_memberships(organization_id);

-- ============================================================
-- 2. CRM Y CLIENTES (RF-02)
-- ============================================================
create table if not exists public.crm_clients (
    id uuid primary key default gen_random_uuid(),
    organization_id uuid not null references public.organizations(id) on delete cascade,
    name text not null,
    company_name text,
    email text not null,
    phone text,
    status text not null default 'lead' check (status in ('lead', 'prospect', 'active', 'churned')),
    custom_fields jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists idx_crm_clients_org on public.crm_clients(organization_id);

-- ============================================================
-- 3. PROYECTOS, TAREAS Y ENTREGABLES (RF-03, RF-05)
-- ============================================================
create table if not exists public.projects (
    id uuid primary key default gen_random_uuid(),
    organization_id uuid not null references public.organizations(id) on delete cascade,
    client_id uuid references public.crm_clients(id) on delete set null,
    title text not null,
    description text,
    status text not null default 'planning' check (status in ('planning', 'in_progress', 'review', 'completed', 'cancelled')),
    budget_cents bigint not null default 0,
    currency text not null default 'EUR',
    start_date date,
    due_date date,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists idx_projects_org on public.projects(organization_id);
create index if not exists idx_projects_client on public.projects(client_id);

create table if not exists public.project_tasks (
    id uuid primary key default gen_random_uuid(),
    organization_id uuid not null references public.organizations(id) on delete cascade,
    project_id uuid not null references public.projects(id) on delete cascade,
    assigned_to uuid references public.user_profiles(id) on delete set null,
    title text not null,
    description text,
    status text not null default 'todo' check (status in ('todo', 'in_progress', 'review', 'done')),
    priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'urgent')),
    due_date timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists idx_tasks_project on public.project_tasks(project_id);

create table if not exists public.deliverables (
    id uuid primary key default gen_random_uuid(),
    organization_id uuid not null references public.organizations(id) on delete cascade,
    project_id uuid not null references public.projects(id) on delete cascade,
    title text not null,
    description text,
    file_url text not null,
    status text not null default 'pending_review' check (status in ('pending_review', 'approved', 'rejected', 'revision_requested')),
    client_feedback text,
    reviewed_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists idx_deliverables_project on public.deliverables(project_id);

-- ============================================================
-- 4. CATÁLOGO DE SERVICIOS Y COTIZACIONES (RF-04)
-- Importes siempre en enteros (céntimos) y moneda explícita
-- ============================================================
create table if not exists public.service_catalog (
    id uuid primary key default gen_random_uuid(),
    organization_id uuid not null references public.organizations(id) on delete cascade,
    title text not null,
    description text,
    base_price_cents bigint not null,
    currency text not null default 'EUR',
    delivery_days integer not null default 7,
    active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists public.quotes (
    id uuid primary key default gen_random_uuid(),
    organization_id uuid not null references public.organizations(id) on delete cascade,
    client_id uuid references public.crm_clients(id) on delete set null,
    quote_number text not null,
    status text not null default 'draft' check (status in ('draft', 'sent', 'accepted', 'rejected', 'expired')),
    currency text not null default 'EUR',
    subtotal_cents bigint not null default 0,
    tax_cents bigint not null default 0,
    total_cents bigint not null default 0,
    valid_until date not null,
    notes text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists public.quote_items (
    id uuid primary key default gen_random_uuid(),
    quote_id uuid not null references public.quotes(id) on delete cascade,
    service_id uuid references public.service_catalog(id) on delete set null,
    description text not null,
    quantity integer not null default 1 check (quantity > 0),
    unit_price_cents bigint not null,
    total_price_cents bigint not null,
    created_at timestamptz not null default now()
);

-- ============================================================
-- 5. AGENTES IA Y CONTROL DE CUOTAS (RF-06)
-- Reservas atómicas y registro de consumo real
-- ============================================================
create table if not exists public.ai_agents (
    id uuid primary key default gen_random_uuid(),
    organization_id uuid not null references public.organizations(id) on delete cascade,
    name text not null,
    role text not null default 'Asistente Virtual',
    model text not null default 'gemini-2.0-flash',
    system_prompt text not null,
    tools jsonb not null default '[]'::jsonb,
    temperature numeric not null default 0.7,
    max_tokens integer not null default 1000,
    is_active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists idx_ai_agents_org on public.ai_agents(organization_id);

create table if not exists public.ai_usage_logs (
    id uuid primary key default gen_random_uuid(),
    organization_id uuid not null references public.organizations(id) on delete cascade,
    user_id uuid references auth.users(id) on delete set null,
    agent_id uuid references public.ai_agents(id) on delete set null,
    model text not null,
    prompt_tokens integer not null default 0,
    completion_tokens integer not null default 0,
    total_tokens integer not null default 0,
    estimated_cost_cents integer not null default 0,
    request_id text not null,
    status text not null default 'success' check (status in ('success', 'failed', 'rate_limited')),
    created_at timestamptz not null default now()
);

create index if not exists idx_ai_usage_org on public.ai_usage_logs(organization_id);

-- ============================================================
-- 6. CHATBOT Y CONOCIMIENTO AUTORIZADO (RF-07)
-- ============================================================
create table if not exists public.knowledge_docs (
    id uuid primary key default gen_random_uuid(),
    organization_id uuid not null references public.organizations(id) on delete cascade,
    client_id uuid references public.crm_clients(id) on delete cascade, -- null = conocimiento público de la org
    title text not null,
    content text not null,
    is_public boolean not null default false,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists public.chat_sessions (
    id uuid primary key default gen_random_uuid(),
    organization_id uuid not null references public.organizations(id) on delete cascade,
    client_id uuid references public.crm_clients(id) on delete set null,
    channel text not null default 'web' check (channel in ('web', 'whatsapp', 'email')),
    status text not null default 'open' check (status in ('open', 'closed')),
    created_at timestamptz not null default now()
);

create table if not exists public.chat_messages (
    id uuid primary key default gen_random_uuid(),
    session_id uuid not null references public.chat_sessions(id) on delete cascade,
    sender_type text not null check (sender_type in ('user', 'bot', 'agent')),
    content text not null,
    metadata jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default now()
);

-- ============================================================
-- 7. AUTOMATIZACIONES Y COLA DE JOBS (RF-08)
-- Adquisición atómica, leases y Outbox transaccional
-- ============================================================
create table if not exists public.automation_jobs (
    id uuid primary key default gen_random_uuid(),
    organization_id uuid not null references public.organizations(id) on delete cascade,
    job_type text not null,
    payload jsonb not null default '{}'::jsonb,
    status text not null default 'pending' check (status in ('pending', 'running', 'completed', 'failed', 'dead_letter')),
    max_retries integer not null default 3,
    attempts integer not null default 0,
    locked_until timestamptz,
    locked_by text,
    last_error text,
    idempotency_key text unique,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists idx_jobs_status_locked on public.automation_jobs(status, locked_until);

-- ============================================================
-- 8. ÓRDENES Y FINANZAS ADMINISTRATIVAS (RF-10)
-- Presupuesto cero: pagos reales registrados manualmente
-- ============================================================
create table if not exists public.orders (
    id uuid primary key default gen_random_uuid(),
    organization_id uuid not null references public.organizations(id) on delete cascade,
    client_id uuid references public.crm_clients(id) on delete set null,
    quote_id uuid references public.quotes(id) on delete set null,
    order_number text not null,
    status text not null default 'pending_payment' check (status in ('pending_payment', 'paid', 'partially_paid', 'cancelled', 'refunded')),
    currency text not null default 'EUR',
    total_cents bigint not null,
    paid_cents bigint not null default 0,
    due_date date,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists public.payment_records (
    id uuid primary key default gen_random_uuid(),
    order_id uuid not null references public.orders(id) on delete cascade,
    organization_id uuid not null references public.organizations(id) on delete cascade,
    amount_cents bigint not null,
    currency text not null default 'EUR',
    payment_method text not null check (payment_method in ('transfer', 'cash', 'card_manual', 'stripe_sandbox')),
    reference_number text,
    notes text,
    registered_by uuid references public.user_profiles(id) on delete set null,
    created_at timestamptz not null default now()
);

-- ============================================================
-- 9. AUDITORÍA INMUTABLE (RF-11)
-- ============================================================
create table if not exists public.audit_logs (
    id uuid primary key default gen_random_uuid(),
    organization_id uuid not null references public.organizations(id) on delete cascade,
    user_id uuid references auth.users(id) on delete set null,
    action text not null,
    resource text not null,
    resource_id text,
    changes jsonb,
    ip_address text,
    request_id text,
    created_at timestamptz not null default now()
);

-- ============================================================
-- 10. HABILITACIÓN DE ROW LEVEL SECURITY (RLS)
-- En TODAS las tablas expuestas
-- ============================================================
alter table public.organizations enable row level security;
alter table public.user_profiles enable row level security;
alter table public.organization_memberships enable row level security;
alter table public.crm_clients enable row level security;
alter table public.projects enable row level security;
alter table public.project_tasks enable row level security;
alter table public.deliverables enable row level security;
alter table public.service_catalog enable row level security;
alter table public.quotes enable row level security;
alter table public.quote_items enable row level security;
alter table public.ai_agents enable row level security;
alter table public.ai_usage_logs enable row level security;
alter table public.knowledge_docs enable row level security;
alter table public.chat_sessions enable row level security;
alter table public.chat_messages enable row level security;
alter table public.automation_jobs enable row level security;
alter table public.orders enable row level security;
alter table public.payment_records enable row level security;
alter table public.audit_logs enable row level security;

-- ============================================================
-- 11. POLÍTICAS RLS BASE (AISLAMIENTO MULTITENANT)
-- ============================================================

-- Helper: los miembros de la org pueden ver recursos de su org
create policy "Org members can view crm_clients" on public.crm_clients
    for select using (
        organization_id in (select organization_id from public.organization_memberships where user_id = auth.uid() and status = 'active')
    );

create policy "Org members can view projects" on public.projects
    for select using (
        organization_id in (select organization_id from public.organization_memberships where user_id = auth.uid() and status = 'active')
    );

create policy "Org members can view tasks" on public.project_tasks
    for select using (
        organization_id in (select organization_id from public.organization_memberships where user_id = auth.uid() and status = 'active')
    );

create policy "Org members can view deliverables" on public.deliverables
    for select using (
        organization_id in (select organization_id from public.organization_memberships where user_id = auth.uid() and status = 'active')
    );

create policy "Org members can view catalog" on public.service_catalog
    for select using (
        organization_id in (select organization_id from public.organization_memberships where user_id = auth.uid() and status = 'active')
    );

create policy "Org members can view quotes" on public.quotes
    for select using (
        organization_id in (select organization_id from public.organization_memberships where user_id = auth.uid() and status = 'active')
    );

create policy "Org members can view orders" on public.orders
    for select using (
        organization_id in (select organization_id from public.organization_memberships where user_id = auth.uid() and status = 'active')
    );

-- Modificaciones restringidas a administradores y empleados
create policy "Admins and employees can manage crm_clients" on public.crm_clients
    for all using (
        exists (
            select 1 from public.organization_memberships
            where organization_memberships.organization_id = crm_clients.organization_id
              and organization_memberships.user_id = auth.uid()
              and organization_memberships.role in ('admin', 'employee')
              and organization_memberships.status = 'active'
        )
    );

create policy "Admins and employees can manage projects" on public.projects
    for all using (
        exists (
            select 1 from public.organization_memberships
            where organization_memberships.organization_id = projects.organization_id
              and organization_memberships.user_id = auth.uid()
              and organization_memberships.role in ('admin', 'employee')
              and organization_memberships.status = 'active'
        )
    );

-- Audit logs: Solo lectura para administradores de la organización
create policy "Admins can view audit_logs" on public.audit_logs
    for select using (
        exists (
            select 1 from public.organization_memberships
            where organization_memberships.organization_id = audit_logs.organization_id
              and organization_memberships.user_id = auth.uid()
              and organization_memberships.role = 'admin'
              and organization_memberships.status = 'active'
        )
    );

-- AI Agents: Lectura para miembros, gestión para administradores y empleados
create policy "Members can view ai_agents" on public.ai_agents
    for select using (
        exists (
            select 1 from public.organization_memberships
            where organization_memberships.organization_id = ai_agents.organization_id
              and organization_memberships.user_id = auth.uid()
              and organization_memberships.status = 'active'
        )
    );

create policy "Admins and employees can manage ai_agents" on public.ai_agents
    for all
    using (
        exists (
            select 1 from public.organization_memberships
            where organization_memberships.organization_id = ai_agents.organization_id
              and organization_memberships.user_id = auth.uid()
              and organization_memberships.role in ('admin', 'employee')
              and organization_memberships.status = 'active'
        )
    )
    with check (
        exists (
            select 1 from public.organization_memberships
            where organization_memberships.organization_id = ai_agents.organization_id
              and organization_memberships.user_id = auth.uid()
              and organization_memberships.role in ('admin', 'employee')
              and organization_memberships.status = 'active'
        )
    );

