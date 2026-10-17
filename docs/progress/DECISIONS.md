# DECISIONS — NexusAI Platform

Registro de decisiones arquitectónicas y técnicas aprobadas.

---

## DEC-001 — Stack tecnológico

**Fecha:** 2026-10-17  
**Estado:** aprobado  
**Contexto:** Se requiere elegir stack para plataforma de agencia IA.

**Decisión:**
- **Framework:** Next.js 15 con App Router y TypeScript estricto
- **Base de datos:** Supabase (PostgreSQL + Auth + Storage)
- **Validación:** Zod
- **Estado global:** Zustand (solo cliente cuando sea necesario)
- **Pruebas unitarias:** Vitest
- **Pruebas E2E:** Playwright
- **IA:** Gemini API con adaptador de proveedor intercambiable

**Razón:** Stack moderno, gratuito en desarrollo, con buena integración y documentación oficial verificada.

---

## DEC-002 — Arquitectura monolito modular

**Fecha:** 2026-10-17  
**Estado:** aprobado  
**Contexto:** Evitar complejidad prematura con microservicios.

**Decisión:** Usar un monolito modular con separación clara de:
- `src/app/` — Presentación (páginas y layouts Next.js)
- `src/components/` — Componentes UI reutilizables
- `src/lib/` — Adaptadores, clientes externos, utilidades
- `src/types/` — Tipos TypeScript compartidos
- `docs/` — Documentación de control

**Razón:** Permite evolucionar sin la sobrecarga operativa de microservicios. Se puede extraer módulos cuando haya necesidad medida.

---

## DEC-003 — Diseño visual

**Fecha:** 2026-10-17  
**Estado:** aprobado  
**Contexto:** Se necesita identidad visual premium para agencia IA.

**Decisión:**
- Paleta: púrpura oscuro + violeta + negro profundo
- Estilo: glassmorphism, gradientes neon, partículas
- Tipografía: Outfit (display) + Inter (body) — Google Fonts
- Sin Tailwind: CSS vanilla con sistema de tokens propio

**Razón:** Mayor control sobre el diseño final, sin dependencia de versiones de Tailwind.

---

## DEC-004 — Pagos en presupuesto cero

**Fecha:** 2026-10-17  
**Estado:** aprobado  
**Contexto:** No se puede activar facturación en MVP-00.

**Decisión:**
- Órdenes registradas manualmente por administrador
- Sin pasarela de pago hasta que sea necesario y esté presupuestado
- Si se integra pasarela: solo sandbox en desarrollo

---

## DEC-005 — Roles y seguridad

**Fecha:** 2026-10-17  
**Estado:** aprobado

**Decisión:**
- Roles: `admin`, `employee`, `client`
- El rol pertenece a `organization_memberships`, no a `user_metadata`
- El registro público nunca asigna admin ni employee
- RLS obligatoria en todas las tablas expuestas a usuarios
- No usar `service_role` key para consultas ordinarias
