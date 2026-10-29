import { z } from 'zod'

export const createAgentSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
  role: z.string().min(2, 'El rol debe tener al menos 2 caracteres').max(100),
  model: z.string().default('gemini-2.0-flash'),
  systemPrompt: z.string().min(10, 'El prompt de sistema debe tener al menos 10 caracteres').max(5000),
  tools: z.array(z.string()).default([]),
  temperature: z.number().min(0).max(1).default(0.7),
  maxTokens: z.number().int().min(100).max(8192).default(1000),
  isActive: z.boolean().default(true),
})

export const updateAgentSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  role: z.string().min(2).max(100).optional(),
  model: z.string().optional(),
  systemPrompt: z.string().min(10).max(5000).optional(),
  tools: z.array(z.string()).optional(),
  temperature: z.number().min(0).max(1).optional(),
  maxTokens: z.number().int().min(100).max(8192).optional(),
  isActive: z.boolean().optional(),
})

export const agentQuerySchema = z.object({
  search: z.string().optional(),
  status: z.enum(['active', 'paused', 'all']).optional().default('all'),
})

export type CreateAgentInput = z.infer<typeof createAgentSchema>
export type UpdateAgentInput = z.infer<typeof updateAgentSchema>
export type AgentQueryInput = z.infer<typeof agentQuerySchema>
