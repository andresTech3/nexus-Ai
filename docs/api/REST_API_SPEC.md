# ESPECIFICACIÓN TÉCNICA DE API REST — NEXUSAI PLATFORM
**Versión de API:** v1  
**Formato Base:** `https://nexusai.dominio.com/api/v1`  
**Autenticación:** Supabase Session Cookie / Bearer JWT  
**Estándar de Importes:** Unidades monetarias menores (enteros en céntimos) y moneda explícita ISO 4217 (ej. `EUR`, `USD`).  
**Trazabilidad:** Toda respuesta incluye cabecera y payload `requestId: "req_timestamp_random"`.

---

## 1. Estándares Globales de Seguridad

### 1.1 Jerarquía de Roles (RBAC)
- **`admin`**: Máximo privilegio. Acceso a finanzas, facturación, configuración de IA, auditoría y roles.
- **`employee`**: Gestión operativa de proyectos, tareas, clientes CRM y ejecución de agentes. Sin acceso a facturas globales ni auditoría interna.
- **`client`**: Aislamiento total. Solo lectura y acciones sobre recursos asociados a su `client_id` (proyectos asignados, aprobación de entregables, aceptación de cotizaciones).

### 1.2 Formato de Errores Uniforme (RF-14)
En ningún caso se expone la traza del error, sentencias SQL ni variables de entorno.
```json
{
  "error": "UNAUTHORIZED | FORBIDDEN | NOT_FOUND | VALIDATION_ERROR | RATE_LIMITED | INTERNAL_ERROR",
  "message": "Descripción clara en español orientada al usuario",
  "requestId": "req_1729738200_abc123",
  "statusCode": 401
}
```

### 1.3 Formato de Respuestas Paginadas
```json
{
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 45,
    "totalPages": 3
  },
  "requestId": "req_1729738200_abc123"
}
```

---

## 2. Detalle de Endpoints por Módulo

### 2.1 Autenticación y Perfil (`/api/v1/auth`)

#### `GET /api/v1/auth/me`
- **Permisos:** Todos los usuarios autenticados (`admin`, `employee`, `client`).
- **Respuesta (200 OK):**
```json
{
  "data": {
    "userId": "uuid-user",
    "email": "usuario@empresa.com",
    "firstName": "Carlos",
    "lastName": "Mendoza",
    "avatarUrl": "https://...",
    "organization": {
      "id": "uuid-org",
      "name": "Nexus Demo Agency",
      "slug": "nexus-demo",
      "role": "admin"
    }
  }
}
```

#### `PATCH /api/v1/auth/me`
- **Permisos:** Todos los usuarios autenticados.
- **Payload (Zod):**
```json
{
  "firstName": "Carlos",
  "lastName": "Mendoza",
  "avatarUrl": "https://..."
}
```

---

### 2.2 CRM y Gestión de Clientes (`/api/v1/crm/clients`)

#### `GET /api/v1/crm/clients`
- **Permisos:** `admin`, `employee`. (`client` recibe 403 Forbidden).
- **Query Params:** `page`, `pageSize`, `status` (`lead|prospect|active|churned`), `search`.
- **Respuesta (200 OK):** Lista paginada de clientes filtrados por `organization_id`.

#### `POST /api/v1/crm/clients`
- **Permisos:** `admin`, `employee`.
- **Payload:**
```json
{
  "name": "Acme Industries",
  "companyName": "Acme Corp S.L.",
  "email": "contacto@acme.com",
  "phone": "+34600112233",
  "status": "lead",
  "customFields": {
    "industry": "Retail",
    "budgetEstimateCents": 500000
  }
}
```

---

### 2.3 Proyectos y Entregables (`/api/v1/projects`)

#### `GET /api/v1/projects`
- **Permisos:**
  - `admin`, `employee`: Ven todos los proyectos de su organización.
  - `client`: Solo ve proyectos donde `client_id` corresponde a su entidad.
- **Campos devueltos:** `id`, `title`, `description`, `status`, `budgetCents`, `currency`, `startDate`, `dueDate`.

#### `POST /api/v1/projects`
- **Permisos:** `admin`, `employee`.
- **Payload:**
```json
{
  "clientId": "uuid-crm-client",
  "title": "Automatización de Soporte con IA",
  "description": "Despliegue de agente con RAG y conexión a WhatsApp",
  "budgetCents": 350000,
  "currency": "EUR",
  "startDate": "2026-11-01",
  "dueDate": "2026-12-15"
}
```

#### `GET /api/v1/projects/:id/deliverables`
- **Permisos:** Todos los miembros vinculados al proyecto.
- **Respuesta (200 OK):** Lista de entregables con estado (`pending_review`, `approved`, `revision_requested`).

#### `POST /api/v1/projects/:id/deliverables/:delivId/approve`
- **Permisos:** `client` (del proyecto) o `admin`.
- **Efecto:** Cambia el estado a `approved`, registra `reviewed_at = now()`.

#### `POST /api/v1/projects/:id/deliverables/:delivId/request-revision`
- **Permisos:** `client` o `admin`.
- **Payload:**
```json
{
  "feedback": "El diseño de la pantalla principal requiere mayor contraste en el botón de compra."
}
```

---

### 2.4 Catálogo y Cotizaciones (`/api/v1/quotes`)

#### `POST /api/v1/quotes`
- **Permisos:** `admin`, `employee`.
- **Idempotencia:** Requiere cabecera `Idempotency-Key`.
- **Payload:**
```json
{
  "clientId": "uuid-crm-client",
  "validUntil": "2026-11-30",
  "currency": "EUR",
  "items": [
    {
      "serviceId": "uuid-service",
      "description": "Desarrollo de Flujo de Automatización",
      "quantity": 1,
      "unitPriceCents": 120000
    }
  ],
  "notes": "Incluye 30 días de garantía."
}
```

#### `POST /api/v1/quotes/:id/accept`
- **Permisos:** `client` asignado a la cotización o `admin`.
- **Efecto:** Pasa la cotización a `accepted`, genera automáticamente una orden de trabajo (`public.orders`) en estado `pending_payment`.

---

### 2.5 Agentes de Inteligencia Artificial (`/api/v1/ai`)

#### `POST /api/v1/ai/generate`
- **Permisos:** `admin`, `employee`.
- **Cabeceras:** `X-Request-ID`.
- **Seguridad:**
  - Verifica cuota máxima mensual de tokens antes de invocar al proveedor.
  - No envía datos privados o secretos al modelo.
  - Registra atómicamente el consumo real de tokens en `public.ai_usage_logs`.
- **Payload:**
```json
{
  "agentId": "uuid-agent",
  "prompt": "Genera una propuesta de automatización para una clínica dental.",
  "maxTokens": 1000
}
```
- **Respuesta (200 OK):**
```json
{
  "data": {
    "completion": "...",
    "usage": {
      "promptTokens": 120,
      "completionTokens": 380,
      "totalTokens": 500
    }
  },
  "requestId": "req_1729738200_xyz"
}
```

---

### 2.6 Chatbot y Base de Conocimiento RAG (`/api/v1/chatbot`)

#### `POST /api/v1/chatbot/sessions/:id/messages`
- **Permisos:** Todos (incluyendo usuarios autorizados del portal o webhooks).
- **Proceso:**
  1. Filtra los documentos de `public.knowledge_docs` estrictamente por `organization_id` y permisos del cliente.
  2. Inyecta el contexto autorizado en el prompt del sistema.
  3. Registra el mensaje del usuario y la respuesta del bot en `public.chat_messages`.

---

### 2.7 Auditoría Inmutable (`/api/v1/audit-logs`)

#### `GET /api/v1/audit-logs`
- **Permisos:** Exclusivo `admin`.
- **Campos devueltos:** `id`, `action`, `resource`, `resourceId`, `changes`, `ipAddress`, `requestId`, `createdAt`.
- **Garantía:** No permite operaciones `POST`, `PATCH` ni `DELETE` (inmutable a nivel de RLS).
