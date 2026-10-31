/* ============================================================
   TIPOS COMPARTIDOS CON TIPADO ESTRICTO — NexusAI Platform
   ============================================================ */

/** Timestamp en formato estricto ISO 8601 (ej. '2026-10-29T19:30:00.000Z') */
export type ISOTimestamp = string

/** Fecha en formato estricto AAAA-MM-DD (ej. '2026-10-29') */
export type ISODate = string

/** Roles de miembro dentro de una organización */
export type OrgRole = 'admin' | 'employee' | 'client'

/** Estado de un miembro */
export type MemberStatus = 'active' | 'invited' | 'suspended'

/** Estados de clientes en CRM */
export type ClientStatus = 'lead' | 'prospect' | 'active' | 'churned'

/** Estados de proyectos */
export type ProjectStatus = 'planning' | 'in_progress' | 'review' | 'completed' | 'cancelled'

/** Monedas admitidas */
export type CurrencyCode = 'USD' | 'EUR' | 'COP'

/** Perfil de usuario (tabla pública) */
export interface UserProfile {
  id: string
  firstName: string
  lastName: string
  avatarUrl: string | null
  createdAt: ISOTimestamp
  updatedAt: ISOTimestamp
}

/** Organización */
export interface Organization {
  id: string
  name: string
  slug: string
  logoUrl: string | null
  createdAt: ISOTimestamp
}

/** Membresía de usuario en una organización */
export interface OrgMembership {
  id: string
  userId: string
  organizationId: string
  role: OrgRole
  status: MemberStatus
  createdAt: ISOTimestamp
}

/** Contexto de sesión autenticada */
export interface AuthContext {
  userId: string
  organizationId: string
  role: OrgRole
  email: string
}

/** Cliente en CRM con campos tipados */
export interface CrmClient {
  id: string
  organizationId: string
  name: string
  companyName: string | null
  email: string
  phone: string | null
  status: ClientStatus
  customFields: Record<string, unknown>
  createdAt: ISOTimestamp
  updatedAt: ISOTimestamp
}

/** Proyecto con fechas y presupuestos tipados */
export interface Project {
  id: string
  organizationId: string
  clientId: string | null
  title: string
  description: string | null
  status: ProjectStatus
  budgetCents: number
  currency: CurrencyCode
  startDate: ISODate | null
  dueDate: ISODate | null
  createdAt: ISOTimestamp
  updatedAt: ISOTimestamp
}

/** Respuesta de error uniforme de la API con detalle accionable */
export interface ApiError {
  error: string
  message: string
  field?: string
  problem?: string
  actionRequired?: string
  requestId: string
  statusCode: number
}

/** Respuesta paginada */
export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

/** Agente IA Autónomo con tipos estrictos */
export interface AiAgent {
  id: string
  organizationId: string
  name: string
  role: string
  model: string
  systemPrompt: string
  tools: string[]
  temperature: number
  maxTokens: number
  isActive: boolean
  createdAt: ISOTimestamp
  updatedAt: ISOTimestamp
}

/** Estructura de notificación rectangular de problemas / acciones requeridas */
export interface ActionRequiredToast {
  id?: string
  title: string
  problem: string
  actionRequired: string
  type: 'error' | 'warning' | 'info' | 'success'
}

export type ActionToastData = ActionRequiredToast

