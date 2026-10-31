export type AgentId =
  | 'dora'
  | 'ivan'
  | 'lucas'
  | 'eva'
  | 'sofia'
  | 'carlos'
  | 'leo'
  | 'diego'
  | 'marco'
  | 'tomas'
  | 'marta'
  | 'nora'

export type Department = 'Dirección' | 'Producto' | 'Marketing' | 'Ecommerce' | 'Operaciones'

export type AgentStatus =
  | 'IDLE'
  | 'ANALYZING'
  | 'GENERATING'
  | 'NEEDS_APPROVAL'
  | 'DONE'
  | 'ERROR'
  | 'WAITING_QUOTA'
  | 'VACANT'

export type TrafficMode = 'ADS' | 'ORGANIC' | 'HYBRID'

export type WorkflowType = 'LAUNCH' | 'MORNING'

export type OfficeStatus =
  | 'ON'
  | 'OFF'
  | 'PAUSED_CHECKPOINT'
  | 'WAITING_QUOTA'
  | 'ERROR'
  | 'ARCHIVED'

export type DataSourceType = 'REAL' | 'SIMULATED' | 'USER_PROVIDED' | 'DEMO' | 'IVAN_SELECTED'

export interface AgentDefinition {
  id: AgentId
  name: string
  role: string
  department: Department
  avatarColor: string
  avatarInitials: string
  deskPosition: [number, number, number] // [x, y, z] in Three.js coordinates
  systemPrompt: string
  skills: string[]
  tools: string[]
  connections: string[]
  qualityGates: string[]
  preferredProvider: 'freellmapi' | 'gemini' | 'groq' | 'cerebras' | 'openrouter' | 'ollama' | 'mock'
  description: string
}

export interface UnitEconomicsInputs {
  costo_producto: number
  costo_envio: number
  costo_packaging: number
  pvp: number
  comision_pct: number // default 0.029 (2.9%)
  comision_fijo: number // default 0.30 EUR/USD
  provision_devoluciones_pct: number // default 0.05 (5%)
  iva_pct: number // default 0.21 (21% IVA en España)
  traffic_mode?: TrafficMode
  creator_sample_cost?: number
  creator_samples_count?: number
}

export interface BundleTier {
  days: number
  units: number
  pvp_total: number
  discount_pct: number
  shipping_cost: number
  packaging_cost: number
  cogs_total: number
  net_profit_before_ads: number
  net_margin_pct: number
  roas_breakeven: number
  max_cpa: number
}

export interface UnitEconomicsResult {
  pvp_con_iva: number
  pvp_sin_iva: number
  cogs_producto_base: number
  comision_pasarela: number
  provision_devoluciones: number
  cogs_total: number
  beneficio_neto_antes_ads: number
  margen_neto_pct: number
  multiplicador_markup: number // pvp_sin_iva / costo_producto
  roas_equilibrio: number
  cpa_maximo_rentable: number
  health_score: 'RED' | 'YELLOW' | 'GREEN'
  health_reason: string
  bundles: {
    bundle_30d: BundleTier
    bundle_60d: BundleTier
    bundle_90d: BundleTier
  }
  sensitivity: {
    cpa_plus_20: { profit: number; margin: number }
    cpa_minus_20: { profit: number; margin: number }
    pvp_minus_10: { multiplier: number; margin: number }
  }
  organic_scenario?: {
    creator_sample_budget: number
    units_to_breakeven_samples: number
    views_needed_at_1pct_cvr: number
  }
}

export interface CheckpointRecord {
  checkpointId: string
  title: string
  agent: string
  timestamp: string
  status: 'PENDING' | 'APPROVED' | 'APPROVED_WITH_CHANGES' | 'REJECTED'
  userFeedback?: string
  discrepancies: string[]
  qualityGatePasses: boolean
}

export interface ProductSnapshot {
  timestamp: string
  product: {
    name: string
    niche: string
    source: DataSourceType
  }
  brand: {
    name: string
    style: string
  }
  deliverablesCount: number
}

export interface Office {
  id: string
  name: string
  status: OfficeStatus
  product: {
    name: string
    niche: string
    source: DataSourceType
    description?: string
  }
  brand: {
    name: string
    style: string
    tagline?: string
  }
  workflow: WorkflowType
  trafficMode: TrafficMode
  currentStep: string
  agentStates: Record<AgentId, AgentStatus>
  deliverables: Record<string, any>
  checkpointHistory: CheckpointRecord[]
  settings: {
    market: 'ES' | 'US' | 'MX' | 'CO'
    currency: 'EUR' | 'USD'
    speed: number
    priority: 'NORMAL' | 'HIGH' | 'LOW'
    maxQuotaPct?: number
    agentOverrides?: Record<string, string>
    trafficMode: TrafficMode
  }
  productHistory: ProductSnapshot[]
  createdAt: string
  updatedAt: string
}

export interface OfficeLog {
  id: string
  officeId: string
  agentId: AgentId
  agentName: string
  timestamp: string
  message: string
  level: 'info' | 'warn' | 'error' | 'success' | 'checkpoint'
  durationMs?: number
  tokensUsed?: number
}

export interface ProviderQuota {
  name: string
  provider: 'freellmapi' | 'gemini' | 'groq' | 'cerebras' | 'openrouter' | 'ollama' | 'claude' | 'openai' | 'deepseek' | 'opensource' | 'mock'
  apiKey: string
  hostUrl?: string
  modelName: string
  requestsToday: number
  maxRequestsDaily: number
  tokensToday: number
  maxTokensDaily: number
  resetTimeUtc: string // e.g. "08:00:00" UTC
  isHealthy: boolean
  lastChecked?: string
}

export interface FreeLLMAPIModelInfo {
  id: string
  name: string
  provider: string
  category: 'auto' | 'google' | 'groq' | 'cerebras' | 'openrouter' | 'mistral' | 'nvidia' | 'cohere' | 'cloudflare' | 'search' | 'custom'
  tag: string
  contextWindow: string
  speed: string
  description: string
  recommendedFor: string[]
}

export interface CheckpointDefinition {
  id: string
  title: string
  requiredAgents: AgentId[]
  description: string
  deliverablesKeys: string[]
  doraGates: Array<{
    name: string
    rule: string
    validate: (deliverables: Record<string, any>, economics?: UnitEconomicsResult) => { pass: boolean; message: string }
  }>
}
