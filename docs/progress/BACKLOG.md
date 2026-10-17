# BACKLOG — NexusAI Platform

Control de requisitos funcionales (RF-01 a RF-15) y su correspondencia con cada MVP.

Estados posibles:
- `pendiente`
- `en curso`
- `bloqueado`
- `implementado sin verificar`
- `verificado`

---

## Tabla de Requisitos Funcionales

| Código | MVP | Requisito | Estado | Criterio de Aceptación | Implementación | Prueba |
|--------|-----|-----------|--------|------------------------|----------------|--------|
| **RF-00** | MVP-00 | Base técnica y control reproducible | **en curso** | Stack Next.js + TS + Supabase base, scripts de arranque, migraciones y tests | App, configs, landing, dashboard, migraciones | Unit tests + dev server |
| **RF-01** | MVP-01 | Identidad, autenticación y acceso RBAC | **en curso** | Registro, login, roles (admin, employee, client), RLS en tablas, contexto en servidor | Auth routes, middleware, server helpers | Tests de auth y RLS |
| **RF-02** | MVP-02 | Clientes y CRM | `pendiente` | Gestión de clientes/leads con aislamiento multitenant estricto por organization_id | Modulo CRM | Tests aislamiento org |
| **RF-03** | MVP-03 | Proyectos, tareas y panel | `pendiente` | Gestión de proyectos, tareas por estado y visualización en dashboard | Modulo proyectos | Tests CRUD tareas |
| **RF-04** | MVP-04 | Catálogo de servicios y cotizaciones | `pendiente` | Catálogo de servicios, generación de cotizaciones con importes en enteros y moneda explícita | Módulo cotizaciones | Tests cálculos monetarios |
| **RF-05** | MVP-05 | Portal de cliente y colaboración | `pendiente` | Acceso restringido para rol 'client' solo a sus proyectos y aprobaciones | Portal cliente | Tests acceso cruzado |
| **RF-06** | MVP-06 | Integración Gemini API y Agentes | `pendiente` | Adapter Gemini con límites por usuario/org, sin datos confidenciales en free tier | Adapter Gemini | Tests límites de cuota |
| **RF-07** | MVP-07 | Chatbot y base de conocimiento | `pendiente` | Chatbot con conocimiento autorizado filtrado por organization_id | Chatbot service | Tests filtrado RAG |
| **RF-08** | MVP-08 | Automatizaciones y Jobs | `pendiente` | Worker con jobs persistentes, adquisición atómica, outbox e idempotencia | Worker & Outbox | Tests idempotencia |
| **RF-09** | MVP-09 | Campañas y aprobación de contenido | `pendiente` | Flujo de creación de contenido y workflow de aprobación humana | Módulo campañas | Tests estados aprobación |
| **RF-10** | MVP-10 | Órdenes y control financiero | `pendiente` | Registro de órdenes reales y pagos manuales sin cobro falso | Módulo financiero | Tests integridad órdenes |
| **RF-11** | MVP-11 | Informes, auditoría y administración | `pendiente` | Logs de auditoría inmutables y métricas de uso y rendimiento | Módulo auditoría | Tests inmutabilidad logs |
| **RF-12** | MVP-12 | Endurecimiento y piloto | `pendiente` | Auditoría de seguridad, rate limiting, validación de inputs y sanitización | Endurecimiento | Tests penetración E2E |
| **RF-13** | MVP-00..12 | Privacidad y exportación de datos | `pendiente` | Solicitudes de exportación/eliminación conforme a privacidad | Módulo privacidad | Tests borrado seguro |
| **RF-14** | MVP-00..12 | Manejo uniforme de errores | `implementado sin verificar` | Formato API uniforme con requestId, sin filtrar SQL ni secretos | `src/lib/auth/server.ts` | Unit tests error helper |
| **RF-15** | MVP-00..12 | Diseño responsive y accesibilidad | `implementado sin verificar` | WCAG básico, navegación por teclado, responsive móvil/desktop | `index.css`, components | Browser inspection |

---

## Detalle de Requisitos por Iteración

### RF-00: Base Técnica y Control
- **Criterio de Aceptación:** Entorno local reproducible con Next.js 15, TypeScript estricto, configuración de Supabase, schema inicial SQL y suite de pruebas ejecutables.
- **Implementación:** Código base en `src/`, configuración en `next.config.ts`, `.env.local` con fakes claramente marcados, y scripts de validación.
- **Prueba:** Ejecución de dev server, suite de tests y verificación de compilación.
- **Riesgos:** Supabase CLI local requiere Docker activo.

### RF-01: Identidad y Acceso (RBAC)
- **Criterio de Aceptación:**
  1. Identidad gestionada por Supabase Auth.
  2. Roles (admin, employee, client) asignados exclusivamente por membresía (`organization_memberships`), nunca en metadatos editables por el usuario.
  3. El registro público NUNCA asigna rol admin ni employee.
  4. Middleware valida sesión en `/dashboard/*`.
  5. RLS activo en todas las tablas con validación de tenant y rol.
- **Implementación:** `src/lib/auth/server.ts`, `src/middleware.ts`, `src/lib/validation/auth.schemas.ts`, migraciones SQL.
- **Prueba:** Pruebas unitarias de schemas, helpers de roles y pruebas de RLS.
- **Riesgos:** Fallback de base de datos local si Docker no está encendido.
