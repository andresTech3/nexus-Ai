# NexusAI — Plataforma de Agencia IA, Automatización y Marketing

> Plataforma modular y escalable para agencias de inteligencia artificial, marketing y automatización de procesos empresariales.

---

## 🌟 Características Principales

- **Diseño Ultra-Moderno & Responsive:** Glassmorphism, paleta oscura deep purple, micro-animaciones, tipografía Outfit e Inter.
- **Arquitectura Monolito Modular:** Separación limpia de presentación, adaptadores, dominio y persistencia.
- **Base de Datos & Seguridad (Supabase + PostgreSQL):**
  - Esquema multitenant estricto (`organization_id`).
  - Roles RBAC: `admin`, `employee`, `client`.
  - Row Level Security (RLS) habilitada y activa en todas las tablas expuestas.
- **Módulos Integrados (RF-01 a RF-15):**
  - **Identidad & Acceso:** Auth SSR, Server Actions, protección CSRF y redirección segura.
  - **CRM & Clientes:** Gestión de leads y cuentas de clientes.
  - **Proyectos & Tareas:** Tableros de trabajo y flujo de aprobación de entregables.
  - **Catálogo & Cotizaciones:** Cálculo financiero en enteros (céntimos) con moneda explícita.
  - **Agentes IA & Cuotas:** Adaptador de Gemini API con reservas atómicas y control de tokens.
  - **Chatbot & RAG:** Base de conocimiento autorizada con filtrado por organización.
  - **Automatizaciones & Worker:** Cola de jobs persistentes con adquisición atómica e idempotencia.
  - **Finanzas Administrativas:** Órdenes y registro de pagos manuales.
  - **Auditoría:** Registro inmutable de eventos del sistema.

---

## 🛠️ Stack Tecnológico

- **Frontend & Backend:** [Next.js 16](https://nextjs.org/) (App Router, Turbopack, Server Actions)
- **Lenguaje:** [TypeScript 5](https://www.typescriptlang.org/) (Strict Mode)
- **Estilos:** Vanilla CSS con sistema de diseño por tokens (sin dependencias superfluas)
- **Base de Datos:** [Supabase](https://supabase.com/) (PostgreSQL 15 + Auth + RLS)
- **Validación:** [Zod](https://zod.dev/)
- **Testing:** [Vitest](https://vitest.dev/) con soporte de alias `@/*`

---

## 🚀 Inicio Rápido

### 1. Clonar el repositorio
```bash
git clone https://github.com/andresTech3/nexus-Ai.git
cd nexus-Ai
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Variables de Entorno
Copia el archivo de plantilla `.env.example` o configura tu `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://sleisgocuwawjguoxkxy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=TU_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=TU_SERVICE_ROLE_KEY
GEMINI_API_KEY=TU_GEMINI_KEY
GEMINI_MODEL=gemini-2.0-flash
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Ejecutar el servidor de desarrollo
```bash
npm run dev
```
Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### 5. Ejecutar la suite de pruebas
```bash
npm run test
```

---

## 📁 Estructura del Proyecto

```
├── docs/                   # Documentación de control y migraciones
│   ├── migrations/         # Esquema SQL (00000_complete_nexusai_schema.sql)
│   └── progress/           # STATUS, BACKLOG, BUGS, DECISIONS, TEST-RESULTS
├── public/                 # Assets estáticos e imágenes generadas
├── src/
│   ├── app/                # Rutas Next.js (Landing, Auth, Dashboard, API v1)
│   ├── components/         # Componentes UI (Navbar, Footer, Secciones)
│   ├── lib/                # Adaptadores (Supabase, Auth helpers, Zod schemas)
│   ├── tests/              # Suite de pruebas unitarias
│   └── types/              # Definiciones de tipos TypeScript compartidos
```

---

## 📄 Licencia

Privado / Propiedad de NexusAI.
