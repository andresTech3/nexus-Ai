import { describe, it, expect } from 'vitest'
import { createAgentSchema, updateAgentSchema, agentQuerySchema } from '@/lib/validation/agents.schemas'

describe('AI Agents Validation Schemas (RF-06)', () => {
  it('validates a valid agent creation payload', () => {
    const validData = {
      name: 'LeadBot Pro',
      role: 'Calificador de Leads CRM',
      model: 'gemini-2.0-flash',
      systemPrompt: 'Eres un asistente especializado en calificar leads y prospectos comerciales.',
      tools: ['crm_create_lead', 'crm_check_contact'],
      temperature: 0.3,
      maxTokens: 1000,
      isActive: true,
    }

    const result = createAgentSchema.safeParse(validData)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.name).toBe('LeadBot Pro')
      expect(result.data.tools).toHaveLength(2)
      expect(result.data.temperature).toBe(0.3)
    }
  })

  it('rejects agent creation with short name or short prompt', () => {
    const invalidData = {
      name: 'A', // demasiado corto (< 2)
      role: 'Bot',
      systemPrompt: 'Corto', // < 10 chars
    }

    const result = createAgentSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      const errorPaths = result.error.issues.map((i) => i.path[0])
      expect(errorPaths).toContain('name')
      expect(errorPaths).toContain('systemPrompt')
    }
  })

  it('rejects invalid temperature (out of bounds 0..1)', () => {
    const invalidTemp = {
      name: 'TempBot',
      role: 'Asistente',
      systemPrompt: 'Instrucciones del sistema válidas para el agente.',
      temperature: 1.5, // > 1
    }

    const result = createAgentSchema.safeParse(invalidTemp)
    expect(result.success).toBe(false)
  })

  it('validates partial updates in updateAgentSchema', () => {
    const partialUpdate = {
      temperature: 0.5,
      isActive: false,
    }

    const result = updateAgentSchema.safeParse(partialUpdate)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.isActive).toBe(false)
      expect(result.data.temperature).toBe(0.5)
    }
  })

  it('parses and defaults agentQuerySchema', () => {
    const defaultQuery = {}
    const result = agentQuerySchema.safeParse(defaultQuery)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.status).toBe('all')
    }

    const filterActive = { status: 'active', search: 'Lead' }
    const resActive = agentQuerySchema.safeParse(filterActive)
    expect(resActive.success).toBe(true)
    if (resActive.success) {
      expect(resActive.data.status).toBe('active')
      expect(resActive.data.search).toBe('Lead')
    }
  })
})
