# STATUS — NexusAI Platform

**Última actualización:** 2026-10-17  
**MVP activo:** MVP-00 — Base técnica y control (Punto de revisión completado)

---

## Resumen General

| MVP | Nombre | Estado |
|-----|--------|--------|
| MVP-00 | Base técnica y control | **verificado** (código, tests y server) / **implementado sin verificar** (daemon Supabase) |
| MVP-01 | Identidad y acceso | **en curso** |
| MVP-02 | Clientes y CRM | `pendiente` |
| MVP-03 | Proyectos, tareas y panel | `pendiente` |
| MVP-04 | Catálogo y cotizaciones | `pendiente` |
| MVP-05 | Colaboración y portal | `pendiente` |
| MVP-06 | Gemini y agentes | `pendiente` |
| MVP-07 | Chatbot | `pendiente` |
| MVP-08 | Automatizaciones | `pendiente` |
| MVP-09 | Marketing | `pendiente` |
| MVP-10 | Órdenes y finanzas | `pendiente` |
| MVP-11 | Informes y administración | `pendiente` |
| MVP-12 | Endurecimiento y piloto | `pendiente` |

---

## MVP-00 — Estado Detallado

### Completado ✓
- [x] Proyecto Next.js 16 + React 19 + TypeScript estricto inicializado y funcional
- [x] Dependencias instaladas: `@supabase/supabase-js`, `@supabase/ssr`, `zod`, `zustand`, `lucide-react`, `vitest`, `vite`
- [x] Estructura monolito modular con separación limpia de capas
- [x] Design system CSS vanilla completo (tokens, glassmorphism, gradientes, animaciones)
- [x] Landing page completa (Hero animado, 6 servicios, portfolio, sobre nosotros, testimonios/stats, CTA final, footer)
- [x] Navbar con efecto blur y scroll reactivo
- [x] Formularios visuales de Auth: Login y Registro
- [x] Dashboard con métricas, tabla de proyectos y estados
- [x] Clientes Supabase browser y server (`src/lib/supabase/client.ts` y `server.ts`)
- [x] Esquema SQL de migraciones versionado: `docs/migrations/00001_initial_schema.sql` (organizaciones, perfiles, membresías, índices, triggers y políticas RLS estrictas)
- [x] Script de datos ficticios seed: `docs/migrations/seed.sql` (aislamiento multi-tenant, sin datos privados reales)
- [x] Suite de pruebas unitarias configurada con Vitest (`npm run test`) con 11/11 tests pasando
- [x] Archivos de control y auditoría completos: `STATUS.md`, `BACKLOG.md`, `BUGS.md`, `DECISIONS.md`, `TEST-RESULTS.md`
- [x] Servidor de desarrollo validado en `http://localhost:3000`

### Estado de Infraestructura Local (Declaración requerida por protocolo)
- **Docker CLI:** Instalado (`v29.8.0`).
- **Docker Daemon:** Inactivo en la máquina Windows del host.
- **Supabase CLI:** Disponible localmente (`v2.121.0`).
- **Declaración formal:** La ejecución en vivo del contenedor de Supabase (`supabase start`) queda catalogada como **implementado sin verificar** debido a la indisponibilidad del daemon de Docker en este momento. Los scripts SQL de migración y seed han sido estructurados para su aplicación inmediata tan pronto como el usuario inicie Docker Desktop o configure un proyecto remoto en Supabase Cloud.

---

## MVP-01 — Identidad y Acceso (En Curso)

### Componentes en Desarrollo:
- [x] Schemas de validación Zod (`loginSchema`, `registerSchema`, `updateProfileSchema`)
- [x] Helper de verificación jerárquica de roles (`hasMinRole`)
- [x] Generador de requestId uniforme (`generateRequestId`)
- [x] Manejo uniforme de errores de API sin fugas (`errorResponse`)
- [x] Middleware de protección de rutas (`src/middleware.ts`)
- [x] Route handlers para Auth:
  - `src/app/api/v1/auth/callback/route.ts`
  - `src/app/api/v1/auth/sign-out/route.ts`
- [ ] Conexión del formulario de Login con Supabase Auth Client
- [ ] Conexión del formulario de Registro con Supabase Auth Client
- [ ] Verificación de flujo login -> redirección -> dashboard
