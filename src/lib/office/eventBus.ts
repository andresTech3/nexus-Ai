import { AgentId, AgentStatus, OfficeLog, CheckpointRecord, ProviderQuota, OfficeStatus } from '@/types/office'

export type EventMap = {
  'agent:status': { officeId: string; agentId: AgentId; status: AgentStatus; timestamp: string }
  'agent:log': OfficeLog
  'agent:handoff': {
    officeId: string
    sourceAgent: AgentId
    targetAgent: AgentId
    documentName: string
    timestamp: string
  }
  'agent:deliverable': { officeId: string; agentId: AgentId; deliverableKey: string; data: any }
  'checkpoint:open': { officeId: string; checkpoint: CheckpointRecord }
  'checkpoint:resolved': {
    officeId: string
    checkpointId: string
    action: 'APPROVED' | 'APPROVED_WITH_CHANGES' | 'REJECTED'
    feedback?: string
  }
  'quota:update': ProviderQuota[]
  'provider:fallback': { fromProvider: string; toProvider: string; reason: string }
  'office:switched': { officeId: string }
  'office:power': { officeId: string; status: OfficeStatus }
}

type EventCallback<T = any> = (data: T) => void

class OfficeEventBus {
  private listeners: Map<keyof EventMap, Set<EventCallback>> = new Map()

  public on<K extends keyof EventMap>(event: K, callback: (data: EventMap[K]) => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    const bucket = this.listeners.get(event)!
    bucket.add(callback as EventCallback)

    // Return unsubscribe function
    return () => {
      bucket.delete(callback as EventCallback)
    }
  }

  public emit<K extends keyof EventMap>(event: K, data: EventMap[K]): void {
    const bucket = this.listeners.get(event)
    if (bucket) {
      bucket.forEach((cb) => {
        try {
          cb(data)
        } catch (err) {
          console.error(`[EventBus] Error in listener for ${event}:`, err)
        }
      })
    }
  }

  public clear(): void {
    this.listeners.clear()
  }
}

// Singleton global event bus
export const eventBus = new OfficeEventBus()
