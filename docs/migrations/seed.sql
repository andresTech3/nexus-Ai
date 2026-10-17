-- ============================================================
-- SEED: Datos de prueba ficticios para entorno local
-- Plataforma NexusAI
-- Fecha: 2026-10-17
-- NOTA: Datos 100% ficticios. No contiene secretos ni datos reales.
-- ============================================================

-- 1. Crear Organización de prueba
insert into public.organizations (id, name, slug, logo_url)
values (
    '00000000-0000-0000-0000-000000000001',
    'Nexus Demo Agency',
    'nexus-demo',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe'
)
on conflict (id) do nothing;

-- 2. Crear Organización secundaria (para pruebas de aislamiento cruzado)
insert into public.organizations (id, name, slug, logo_url)
values (
    '00000000-0000-0000-0000-000000000002',
    'Acme Rival Corp',
    'acme-rival',
    null
)
on conflict (id) do nothing;

-- Comentario sobre usuarios:
-- En Supabase Auth, los usuarios se insertan mediante auth.users().
-- Para pruebas locales sin el daemon de auth activo, las funciones
-- de prueba unitarias usan mocks tipados y fixtures de sesión.
