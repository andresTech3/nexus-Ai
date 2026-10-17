-- ============================================================
-- MIGRACIÓN 00001: Esquema Base, RBAC y Aislamiento Multitenant
-- Plataforma NexusAI
-- Fecha: 2026-10-17
-- ============================================================

-- Habilitar extensión pgcrypto para UUIDs si no está habilitada
create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- 1. TABLA: ORGANIZACIONES (Tenants)
-- ------------------------------------------------------------
create table if not exists public.organizations (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    slug text unique not null,
    logo_url text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 2. TABLA: PERFILES DE USUARIO (Vinculados a auth.users)
-- ------------------------------------------------------------
create table if not exists public.user_profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    first_name text not null,
    last_name text not null,
    avatar_url text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 3. TABLA: MEMBRESÍAS DE ORGANIZACIÓN (Roles estrictos)
-- Roles válidos: 'admin', 'employee', 'client'
-- ------------------------------------------------------------
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

-- Índices para optimizar consultas de autenticación y aislamiento
create index if not exists idx_org_memberships_user on public.organization_memberships(user_id);
create index if not exists idx_org_memberships_org on public.organization_memberships(organization_id);

-- ------------------------------------------------------------
-- 4. HABILITACIÓN DE ROW LEVEL SECURITY (RLS)
-- Obligatorio en todas las tablas expuestas
-- ------------------------------------------------------------
alter table public.organizations enable row level security;
alter table public.user_profiles enable row level security;
alter table public.organization_memberships enable row level security;

-- ------------------------------------------------------------
-- 5. POLÍTICAS RLS: PERFILES DE USUARIO
-- Cada usuario solo puede ver y editar su propio perfil
-- ------------------------------------------------------------
drop policy if exists "Los usuarios pueden ver su propio perfil" on public.user_profiles;
create policy "Los usuarios pueden ver su propio perfil"
    on public.user_profiles
    for select
    using (auth.uid() = id);

drop policy if exists "Los usuarios pueden actualizar su propio perfil" on public.user_profiles;
create policy "Los usuarios pueden actualizar su propio perfil"
    on public.user_profiles
    for update
    using (auth.uid() = id);

drop policy if exists "Los usuarios pueden insertar su propio perfil" on public.user_profiles;
create policy "Los usuarios pueden insertar su propio perfil"
    on public.user_profiles
    for insert
    with check (auth.uid() = id);

-- ------------------------------------------------------------
-- 6. POLÍTICAS RLS: ORGANIZACIONES
-- Solo miembros activos pueden ver su organización
-- ------------------------------------------------------------
drop policy if exists "Miembros pueden ver su organización" on public.organizations;
create policy "Miembros pueden ver su organización"
    on public.organizations
    for select
    using (
        exists (
            select 1 from public.organization_memberships
            where organization_memberships.organization_id = organizations.id
              and organization_memberships.user_id = auth.uid()
              and organization_memberships.status = 'active'
        )
    );

-- ------------------------------------------------------------
-- 7. POLÍTICAS RLS: MEMBRESÍAS DE ORGANIZACIÓN
-- Miembros activos pueden ver los miembros de su propia organización
-- Solo los 'admin' de la organización pueden insertar o modificar membresías
-- ------------------------------------------------------------
drop policy if exists "Miembros pueden ver membresias de su org" on public.organization_memberships;
create policy "Miembros pueden ver membresias de su org"
    on public.organization_memberships
    for select
    using (
        organization_id in (
            select m.organization_id from public.organization_memberships m
            where m.user_id = auth.uid()
              and m.status = 'active'
        )
    );

drop policy if exists "Solo administradores pueden crear membresías" on public.organization_memberships;
create policy "Solo administradores pueden crear membresías"
    on public.organization_memberships
    for insert
    with check (
        exists (
            select 1 from public.organization_memberships m
            where m.organization_id = organization_memberships.organization_id
              and m.user_id = auth.uid()
              and m.role = 'admin'
              and m.status = 'active'
        )
    );

drop policy if exists "Solo administradores pueden modificar membresías" on public.organization_memberships;
create policy "Solo administradores pueden modificar membresías"
    on public.organization_memberships
    for update
    using (
        exists (
            select 1 from public.organization_memberships m
            where m.organization_id = organization_memberships.organization_id
              and m.user_id = auth.uid()
              and m.role = 'admin'
              and m.status = 'active'
        )
    );

-- ------------------------------------------------------------
-- 8. TRIGGER: Actualización automática de updated_at
-- ------------------------------------------------------------
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

drop trigger if exists set_user_profiles_updated_at on public.user_profiles;
create trigger set_user_profiles_updated_at
    before update on public.user_profiles
    for each row execute function public.update_updated_at_column();

drop trigger if exists set_organizations_updated_at on public.organizations;
create trigger set_organizations_updated_at
    before update on public.organizations
    for each row execute function public.update_updated_at_column();
