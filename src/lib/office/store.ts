'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import {
  Office,
  AgentId,
  AgentStatus,
  TrafficMode,
  WorkflowType,
  OfficeLog,
  ProviderQuota,
  CheckpointRecord,
  ProductSnapshot,
} from '@/types/office'
import { eventBus } from './eventBus'
import { generateDeliverablesForOffice } from './mockData'
import { AGENT_DEFINITIONS } from './agents/definitions'

interface OfficeStoreState {
  offices: Record<string, Office>
  activeOfficeId: string
  logs: OfficeLog[]
  selectedAgentId: AgentId | null
  activeCheckpoint: CheckpointRecord | null
  isRunning: boolean
  speed: 0.5 | 1 | 2 | 5
  cameraZone: 'all' | 'dora' | 'producto' | 'marketing' | 'ecommerce' | 'operaciones'
  autoFocusActiveAgent: boolean
  officeLightsOn: boolean
  quotas: Record<string, ProviderQuota>

  // Actions
  setActiveOffice: (id: string) => void
  createOffice: (name: string, product: string, niche: string, trafficMode: TrafficMode, template: 'nubae' | 'empty') => string
  toggleOfficePower: (id: string) => void
  setTrafficMode: (id: string, mode: TrafficMode) => void
  setWorkflow: (id: string, workflow: WorkflowType) => void
  changeProduct: (id: string, newProduct: { name: string; niche: string }) => void
  undoProductChange: (id: string) => void
  duplicateOffice: (id: string) => string
  archiveOffice: (id: string) => void
  deleteOffice: (id: string) => boolean
  updateAgentState: (officeId: string, agentId: AgentId, status: AgentStatus) => void
  setAgentStates: (officeId: string, states: Partial<Record<AgentId, AgentStatus>>) => void
  addLog: (log: Omit<OfficeLog, 'id' | 'timestamp'>) => void
  clearLogs: (officeId?: string) => void
  selectAgent: (agentId: AgentId | null) => void
  openCheckpoint: (checkpoint: CheckpointRecord) => void
  resolveCheckpoint: (checkpointId: string, action: 'APPROVED' | 'APPROVED_WITH_CHANGES' | 'REJECTED', feedback?: string) => void
  saveDeliverable: (officeId: string, key: string, data: any) => void
  setSpeed: (speed: 0.5 | 1 | 2 | 5) => void
  togglePlayPause: () => void
  setCameraZone: (zone: 'all' | 'dora' | 'producto' | 'marketing' | 'ecommerce' | 'operaciones') => void
  toggleAutoFocus: () => void
  toggleOfficeLights: () => void
  updateQuota: (provider: string, requestsDelta: number, tokensDelta: number) => void
  resetDailyQuota: () => void
  setProviderApiKey: (provider: string, key: string) => void
  setProviderModel: (provider: string, model: string) => void
  setProviderHostUrl: (provider: string, hostUrl: string) => void
}

const DEFAULT_AGENT_STATES: Record<AgentId, AgentStatus> = {
  dora: 'IDLE',
  ivan: 'IDLE',
  lucas: 'IDLE',
  eva: 'IDLE',
  sofia: 'IDLE',
  carlos: 'IDLE',
  leo: 'IDLE',
  diego: 'IDLE',
  marco: 'IDLE',
  tomas: 'IDLE',
  marta: 'IDLE',
  nora: 'IDLE',
}

function createInitialOffice(id: string, name: string, productName: string, niche: string, trafficMode: TrafficMode): Office {
  const office: Office = {
    id,
    name,
    status: 'ON',
    product: {
      name: productName,
      niche,
      source: id === 'off_nubae' ? 'DEMO' : 'USER_PROVIDED',
    },
    brand: {
      name: id === 'off_nubae' ? 'NuBae Paris' : name.replace('Oficina ', ''),
      style: 'Cosmeceútica botánica y bienestar prémium',
    },
    workflow: 'LAUNCH',
    trafficMode,
    currentStep: 'Preparado para lanzar pipeline',
    agentStates: { ...DEFAULT_AGENT_STATES },
    deliverables: {},
    checkpointHistory: [],
    settings: {
      market: 'ES',
      currency: 'EUR',
      speed: 1,
      priority: 'NORMAL',
      trafficMode,
    },
    productHistory: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  // Start with clean empty deliverables for real execution
  office.deliverables = {}
  return office
}

const initialPrimaryOffice = createInitialOffice(
  'off_principal',
  'Mi Marca Dropshipping',
  '',
  '',
  'HYBRID'
)
initialPrimaryOffice.brand.name = ''
initialPrimaryOffice.brand.style = ''
initialPrimaryOffice.currentStep = 'Listo para empezar. Configura tu producto o nicho para activar a los 11 agentes.'

const initialQuotas: Record<string, ProviderQuota> = {
  freellmapi: {
    name: 'FreeLLMAPI (Router Unificado)',
    provider: 'freellmapi',
    apiKey: '', // Protegido: se gestiona internamente en servidor sin exponer al usuario
    hostUrl: 'http://127.0.0.1:31415/v1',
    modelName: 'gpt-4o-mini',
    requestsToday: 0,
    maxRequestsDaily: 999999,
    tokensToday: 0,
    maxTokensDaily: 99999999,
    resetTimeUtc: '00:00:00',
    isHealthy: true,
  },
  claude: {
    name: 'Anthropic Claude',
    provider: 'claude',
    apiKey: '',
    modelName: 'claude-3-7-sonnet-20250219',
    requestsToday: 0,
    maxRequestsDaily: 10000,
    tokensToday: 0,
    maxTokensDaily: 1000000,
    resetTimeUtc: '00:00:00',
    isHealthy: false,
  },
  openai: {
    name: 'OpenAI (ChatGPT)',
    provider: 'openai',
    apiKey: '',
    modelName: 'gpt-4o-mini',
    requestsToday: 0,
    maxRequestsDaily: 10000,
    tokensToday: 0,
    maxTokensDaily: 1000000,
    resetTimeUtc: '00:00:00',
    isHealthy: false,
  },
  deepseek: {
    name: 'DeepSeek AI',
    provider: 'deepseek',
    apiKey: '',
    modelName: 'deepseek-chat',
    requestsToday: 0,
    maxRequestsDaily: 10000,
    tokensToday: 0,
    maxTokensDaily: 1000000,
    resetTimeUtc: '00:00:00',
    isHealthy: false,
  },
  opensource: {
    name: 'IA Código Abierto (Groq / Ollama / OpenRouter)',
    provider: 'ollama',
    apiKey: 'http://localhost:11434',
    modelName: 'qwen2.5:7b',
    requestsToday: 0,
    maxRequestsDaily: 999999,
    tokensToday: 0,
    maxTokensDaily: 99999999,
    resetTimeUtc: '00:00:00',
    isHealthy: false,
  },
}

export const useOfficeStore = create<OfficeStoreState>()(
  persist(
    (set, get) => ({
      offices: {
        off_principal: initialPrimaryOffice,
      },
      activeOfficeId: 'off_principal',
      logs: [
        {
          id: 'log-1',
          officeId: 'off_principal',
          agentId: 'dora',
          agentName: 'Dora (CEO)',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          message: 'Sistema listo. Pipeline multi-agente configurado para modo HÍBRIDO (ADS + Orgánico).',
          level: 'info',
        },
      ],
      selectedAgentId: 'dora',
      activeCheckpoint: null,
      isRunning: false,
      speed: 1,
      cameraZone: 'all',
      autoFocusActiveAgent: true,
      officeLightsOn: true,
      quotas: initialQuotas,

      setActiveOffice: (id) => {
        if (get().offices[id]) {
          set({ activeOfficeId: id })
          eventBus.emit('office:switched', { officeId: id })
        }
      },

      createOffice: (name, product, niche, trafficMode, template) => {
        const id = `off_${Date.now()}`
        const newOffice = createInitialOffice(id, name, product, niche, trafficMode)
        if (template === 'empty') {
          newOffice.deliverables = {}
        }
        set((state) => ({
          offices: { ...state.offices, [id]: newOffice },
          activeOfficeId: id,
        }))
        get().addLog({
          officeId: id,
          agentId: 'dora',
          agentName: 'Dora',
          message: `Oficina "${name}" creada con éxito en modo ${trafficMode}.`,
          level: 'success',
        })
        return id
      },

      toggleOfficePower: (id) => {
        const office = get().offices[id]
        if (!office) return
        const nextStatus = office.status === 'ON' ? 'OFF' : 'ON'
        const updatedAgentStates = { ...office.agentStates }

        // If turning OFF, set idle or sleep
        if (nextStatus === 'OFF') {
          Object.keys(updatedAgentStates).forEach((k) => {
            updatedAgentStates[k as AgentId] = 'IDLE'
          })
        }

        set((state) => ({
          offices: {
            ...state.offices,
            [id]: {
              ...office,
              status: nextStatus,
              agentStates: updatedAgentStates,
              updatedAt: new Date().toISOString(),
            },
          },
        }))

        eventBus.emit('office:power', { officeId: id, status: nextStatus })
        get().addLog({
          officeId: id,
          agentId: 'dora',
          agentName: 'Dora',
          message: `Oficina ${nextStatus === 'ON' ? 'ENCENDIDA' : 'APAGADA (luces tenues, agentes descansando)'}.`,
          level: 'info',
        })
      },

      setTrafficMode: (id, mode) => {
        const office = get().offices[id]
        if (!office) return

        // Update vacant status on agentStates according to mode
        const agentStates = { ...office.agentStates }
        if (mode === 'ADS') {
          agentStates.nora = 'VACANT'
          if (agentStates.tomas === 'VACANT') agentStates.tomas = 'IDLE'
        } else if (mode === 'ORGANIC') {
          agentStates.tomas = 'VACANT'
          if (agentStates.nora === 'VACANT') agentStates.nora = 'IDLE'
        } else {
          // HYBRID: both active
          if (agentStates.tomas === 'VACANT') agentStates.tomas = 'IDLE'
          if (agentStates.nora === 'VACANT') agentStates.nora = 'IDLE'
        }

        set((state) => ({
          offices: {
            ...state.offices,
            [id]: {
              ...office,
              trafficMode: mode,
              agentStates,
              settings: { ...office.settings, trafficMode: mode },
              updatedAt: new Date().toISOString(),
            },
          },
        }))

        get().addLog({
          officeId: id,
          agentId: 'dora',
          agentName: 'Dora',
          message: `Modo de tráfico actualizado a ${mode}.`,
          level: 'info',
        })
      },

      setWorkflow: (id, workflow) => {
        const office = get().offices[id]
        if (!office) return
        set((state) => ({
          offices: {
            ...state.offices,
            [id]: {
              ...office,
              workflow,
              updatedAt: new Date().toISOString(),
            },
          },
        }))
        get().addLog({
          officeId: id,
          agentId: 'dora',
          agentName: 'Dora',
          message: `Flujo establecido a: ${workflow === 'LAUNCH' ? 'Lanzar Marca Completa (DAG)' : 'Rutina de Mañana (1h)'}`,
          level: 'info',
        })
      },

      changeProduct: (id, newProduct) => {
        const office = get().offices[id]
        if (!office) return

        // Create snapshot in productHistory for undo
        const snapshot: ProductSnapshot = {
          timestamp: new Date().toISOString(),
          product: { ...office.product },
          brand: { ...office.brand },
          deliverablesCount: Object.keys(office.deliverables).length,
        }

        const updatedOffice: Office = {
          ...office,
          product: {
            ...office.product,
            name: newProduct.name,
            niche: newProduct.niche,
            source: 'USER_PROVIDED',
          },
          productHistory: [snapshot, ...office.productHistory],
          deliverables: {}, // reset deliverables for new product
          agentStates: { ...DEFAULT_AGENT_STATES },
          currentStep: 'Producto cambiado. Listo para ejecutar pipeline.',
          updatedAt: new Date().toISOString(),
        }

        // Regenerate base deliverables with new product
        updatedOffice.deliverables = generateDeliverablesForOffice(updatedOffice)

        set((state) => ({
          offices: {
            ...state.offices,
            [id]: updatedOffice,
          },
        }))

        get().addLog({
          officeId: id,
          agentId: 'dora',
          agentName: 'Dora',
          message: `Producto actualizado a "${newProduct.name}". Historial guardado para deshacer.`,
          level: 'warn',
        })
      },

      undoProductChange: (id) => {
        const office = get().offices[id]
        if (!office || office.productHistory.length === 0) return

        const [lastSnapshot, ...restHistory] = office.productHistory
        const restoredOffice: Office = {
          ...office,
          product: { ...lastSnapshot.product },
          brand: { ...lastSnapshot.brand },
          productHistory: restHistory,
          updatedAt: new Date().toISOString(),
        }
        restoredOffice.deliverables = generateDeliverablesForOffice(restoredOffice)

        set((state) => ({
          offices: {
            ...state.offices,
            [id]: restoredOffice,
          },
        }))

        get().addLog({
          officeId: id,
          agentId: 'dora',
          agentName: 'Dora',
          message: `Cambio de producto deshecho. Restaurado "${lastSnapshot.product.name}".`,
          level: 'success',
        })
      },

      duplicateOffice: (id) => {
        const office = get().offices[id]
        if (!office) return ''
        const newId = `off_${Date.now()}`
        const copy: Office = {
          ...office,
          id: newId,
          name: `${office.name} (Copia)`,
          status: 'OFF',
          checkpointHistory: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        set((state) => ({
          offices: { ...state.offices, [newId]: copy },
          activeOfficeId: newId,
        }))
        get().addLog({
          officeId: newId,
          agentId: 'dora',
          agentName: 'Dora',
          message: `Oficina duplicada como "${copy.name}". Inicia apagada.`,
          level: 'info',
        })
        return newId
      },

      archiveOffice: (id) => {
        const office = get().offices[id]
        if (!office) return
        set((state) => ({
          offices: {
            ...state.offices,
            [id]: {
              ...office,
              status: 'ARCHIVED',
              updatedAt: new Date().toISOString(),
            },
          },
        }))
      },

      deleteOffice: (id) => {
        const { offices, activeOfficeId } = get()
        if (Object.keys(offices).length <= 1) {
          return false // Never delete last remaining office
        }
        const updated = { ...offices }
        delete updated[id]
        const fallbackId = Object.keys(updated)[0]

        set({
          offices: updated,
          activeOfficeId: activeOfficeId === id ? fallbackId : activeOfficeId,
        })
        return true
      },

      updateAgentState: (officeId, agentId, status) => {
        const office = get().offices[officeId]
        if (!office) return
        set((state) => ({
          offices: {
            ...state.offices,
            [officeId]: {
              ...office,
              agentStates: {
                ...office.agentStates,
                [agentId]: status,
              },
              updatedAt: new Date().toISOString(),
            },
          },
        }))
        eventBus.emit('agent:status', {
          officeId,
          agentId,
          status,
          timestamp: new Date().toISOString(),
        })
      },

      setAgentStates: (officeId, states) => {
        const office = get().offices[officeId]
        if (!office) return
        set((state) => ({
          offices: {
            ...state.offices,
            [officeId]: {
              ...office,
              agentStates: {
                ...office.agentStates,
                ...states,
              },
              updatedAt: new Date().toISOString(),
            },
          },
        }))
      },

      addLog: (log) => {
        const newLog: OfficeLog = {
          ...log,
          id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        }
        set((state) => ({
          logs: [newLog, ...state.logs.slice(0, 79)], // keep last 80 logs
        }))
        eventBus.emit('agent:log', newLog)
      },

      clearLogs: (officeId) => {
        if (!officeId) {
          set({ logs: [] })
        } else {
          set((state) => ({
            logs: state.logs.filter((l) => l.officeId !== officeId),
          }))
        }
      },

      selectAgent: (agentId) => {
        set({ selectedAgentId: agentId })
      },

      openCheckpoint: (checkpoint) => {
        set({
          activeCheckpoint: checkpoint,
          isRunning: false,
        })
        const officeId = get().activeOfficeId
        if (officeId) {
          set((state) => ({
            offices: {
              ...state.offices,
              [officeId]: {
                ...state.offices[officeId],
                status: 'PAUSED_CHECKPOINT',
              },
            },
          }))
        }
        eventBus.emit('checkpoint:open', { officeId, checkpoint })
      },

      resolveCheckpoint: (checkpointId, action, feedback) => {
        const { activeCheckpoint, activeOfficeId, offices } = get()
        if (!activeCheckpoint) return

        const resolvedRecord: CheckpointRecord = {
          ...activeCheckpoint,
          status: action,
          userFeedback: feedback,
        }

        const office = offices[activeOfficeId]
        if (office) {
          const updatedHistory = [resolvedRecord, ...office.checkpointHistory]
          set((state) => ({
            activeCheckpoint: null,
            offices: {
              ...state.offices,
              [activeOfficeId]: {
                ...office,
                status: 'ON',
                checkpointHistory: updatedHistory,
                updatedAt: new Date().toISOString(),
              },
            },
          }))
        } else {
          set({ activeCheckpoint: null })
        }

        eventBus.emit('checkpoint:resolved', {
          officeId: activeOfficeId,
          checkpointId,
          action,
          feedback,
        })

        get().addLog({
          officeId: activeOfficeId,
          agentId: 'dora',
          agentName: 'Dora (CEO)',
          message: `Checkpoint ${checkpointId} resuelto: ${action} ${feedback ? `(Instrucción: "${feedback}")` : ''}`,
          level: action === 'APPROVED' ? 'success' : action === 'APPROVED_WITH_CHANGES' ? 'warn' : 'error',
        })
      },

      saveDeliverable: (officeId, key, data) => {
        const office = get().offices[officeId]
        if (!office) return
        set((state) => ({
          offices: {
            ...state.offices,
            [officeId]: {
              ...office,
              deliverables: {
                ...office.deliverables,
                [key]: data,
              },
              updatedAt: new Date().toISOString(),
            },
          },
        }))
        eventBus.emit('agent:deliverable', {
          officeId,
          agentId: AGENT_DEFINITIONS.dora.id,
          deliverableKey: key,
          data,
        })
      },

      setSpeed: (speed) => set({ speed }),

      togglePlayPause: () => set((state) => ({ isRunning: !state.isRunning })),

      setCameraZone: (zone) => set({ cameraZone: zone }),

      toggleAutoFocus: () => set((state) => ({ autoFocusActiveAgent: !state.autoFocusActiveAgent })),

      toggleOfficeLights: () => set((state) => ({ officeLightsOn: !state.officeLightsOn })),

      updateQuota: (provider, requestsDelta, tokensDelta) => {
        const current = get().quotas[provider]
        if (!current) return
        set((state) => ({
          quotas: {
            ...state.quotas,
            [provider]: {
              ...current,
              requestsToday: current.requestsToday + requestsDelta,
              tokensToday: current.tokensToday + tokensDelta,
            },
          },
        }))
      },

      resetDailyQuota: () => {
        set((state) => {
          const reset: Record<string, ProviderQuota> = {}
          Object.entries(state.quotas).forEach(([k, q]) => {
            reset[k] = { ...q, requestsToday: 0, tokensToday: 0 }
          })
          return { quotas: reset }
        })
      },

      setProviderApiKey: (provider, key) => {
        const current = get().quotas[provider]
        if (!current) return
        set((state) => ({
          quotas: {
            ...state.quotas,
            [provider]: {
              ...current,
              apiKey: key,
              isHealthy: true,
            },
          },
        }))
      },

      setProviderModel: (provider, model) => {
        const current = get().quotas[provider]
        if (!current) return
        set((state) => ({
          quotas: {
            ...state.quotas,
            [provider]: {
              ...current,
              modelName: model,
            },
          },
        }))
      },

      setProviderHostUrl: (provider, hostUrl) => {
        const current = get().quotas[provider]
        if (!current) return
        set((state) => ({
          quotas: {
            ...state.quotas,
            [provider]: {
              ...current,
              hostUrl,
            },
          },
        }))
      },
    }),
    {
      name: 'nexus-autonomous-office-v5-clean',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        offices: state.offices,
        activeOfficeId: state.activeOfficeId,
        quotas: state.quotas,
        officeLightsOn: state.officeLightsOn,
        speed: state.speed,
      }),
    }
  )
)
