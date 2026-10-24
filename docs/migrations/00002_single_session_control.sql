-- ============================================================
-- Migration 00002: Single Active Session Enforcement
-- ============================================================
-- Control de concurrencia de sesiones: solo permite 1 sesión
-- activa simultáneamente por cuenta de usuario.
-- Si otro dispositivo intenta acceder mientras hay una sesión activa,
-- la operación es bloqueada e informa al usuario.
-- ============================================================

create table if not exists public.active_user_sessions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  session_token text not null,
  device_info text,
  ip_address text,
  last_active_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.active_user_sessions enable row level security;

-- Políticas de RLS
drop policy if exists "Usuarios pueden ver su propia sesión activa" on public.active_user_sessions;
create policy "Usuarios pueden ver su propia sesión activa"
  on public.active_user_sessions for select
  using (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────
-- Función: check_and_register_session
-- Verifica si ya existe una sesión en otro dispositivo.
-- ─────────────────────────────────────────────────────────────
create or replace function public.check_and_register_session(
  p_user_id uuid,
  p_session_token text,
  p_device_info text default 'Dispositivo desconocido',
  p_ip text default '0.0.0.0',
  p_force boolean default false,
  p_inactivity_minutes integer default 30
)
returns json
language plpgsql
security definer set search_path = public
as $$
declare
  v_existing record;
  v_is_active boolean;
begin
  select * into v_existing
  from public.active_user_sessions
  where user_id = p_user_id;

  if found then
    -- Comprobar si la sesión previa sigue activa (actividad reciente dentro del umbral de inactividad)
    v_is_active := (v_existing.last_active_at > (now() - (p_inactivity_minutes || ' minutes')::interval));

    -- Si sigue activa, es un token distinto y no se ha solicitado cierre forzado:
    if v_is_active and v_existing.session_token <> p_session_token and not p_force then
      return json_build_object(
        'allowed', false,
        'reason', 'already_active',
        'active_device', coalesce(v_existing.device_info, 'Otro dispositivo'),
        'last_active_at', v_existing.last_active_at
      );
    end if;
  end if;

  -- Registrar o renovar la sesión activa para este usuario
  insert into public.active_user_sessions (
    user_id,
    session_token,
    device_info,
    ip_address,
    last_active_at,
    created_at
  )
  values (
    p_user_id,
    p_session_token,
    p_device_info,
    p_ip,
    now(),
    now()
  )
  on conflict (user_id) do update set
    session_token = excluded.session_token,
    device_info = excluded.device_info,
    ip_address = excluded.ip_address,
    last_active_at = now();

  return json_build_object(
    'allowed', true,
    'reason', case when p_force then 'forced_override' else 'session_registered' end
  );
end;
$$;

-- ─────────────────────────────────────────────────────────────
-- Función: touch_user_session
-- Actualiza la marca de tiempo de actividad reciente
-- ─────────────────────────────────────────────────────────────
create or replace function public.touch_user_session(
  p_user_id uuid,
  p_session_token text
)
returns boolean
language plpgsql
security definer set search_path = public
as $$
begin
  update public.active_user_sessions
  set last_active_at = now()
  where user_id = p_user_id and session_token = p_session_token;

  return found;
end;
$$;

-- ─────────────────────────────────────────────────────────────
-- Función: validate_user_session
-- Valida si el token recibido coincide con la sesión autorizada
-- ─────────────────────────────────────────────────────────────
create or replace function public.validate_user_session(
  p_user_id uuid,
  p_session_token text
)
returns boolean
language plpgsql
security definer set search_path = public
as $$
begin
  return exists (
    select 1 
    from public.active_user_sessions
    where user_id = p_user_id and session_token = p_session_token
  );
end;
$$;

-- ─────────────────────────────────────────────────────────────
-- Función: terminate_user_session
-- Elimina la sesión activa al desloguearse
-- ─────────────────────────────────────────────────────────────
create or replace function public.terminate_user_session(
  p_user_id uuid,
  p_session_token text default null
)
returns boolean
language plpgsql
security definer set search_path = public
as $$
begin
  delete from public.active_user_sessions
  where user_id = p_user_id 
    and (p_session_token is null or session_token = p_session_token);

  return found;
end;
$$;
