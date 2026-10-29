/* ============================================================
   TIPOS COMPARTIDOS — NexusAI Platform
   ============================================================ */

/** Roles de miembro dentro de una organización */
export type OrgRole = 'admin' | 'employee' | 'client'

/** Estado de un miembro */
export type MemberStatus = 'active' | 'invited' | 'suspended'

/** Perfil de usuario (tabla pública) */
export interface UserProfile {
  id: string
  firstName: string
  lastName: string
  avatarUrl: string | null
  createdAt: string
  updatedAt: string
}

/** Organización */
export interface Organization {
  id: string
  name: string
  slug: string
  logoUrl: string | null
  createdAt: string
}

/** Membresía de usuario en una organización */
export interface OrgMembership {
  id: string
  userId: string
  organizationId: string
  role: OrgRole
  status: MemberStatus
  createdAt: string
}

/** Contexto de sesión autenticada */
export interface AuthContext {
  userId: string
  organizationId: string
  role: OrgRole
  email: string
}

/** Respuesta de error uniforme de la API */
export interface ApiError {
  error: string
  message: string
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

/** Agente IA Autónomo */
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
  createdAt: string
  updatedAt: string
}

