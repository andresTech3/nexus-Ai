import { NextResponse } from 'next/server'
import { createApiHandler } from '@/lib/api/handler'
import { createClient } from '@/lib/supabase/server'
import { updateAgentSchema } from '@/lib/validation/agents.schemas'
import { errorResponse } from '@/lib/auth/server'

/**
 * GET /api/v1/ai/agents/[id]
 * Obtiene el detalle de un agente de IA específico.
 */
export const GET = createApiHandler(
  {
    requireAuth: true,
    minRole: 'client',
  },
  async ({ auth, params, requestId }) => {
    const supabase = await createClient()
    const agentId = params.id

    const { data: agent, error } = await supabase
      .from('ai_agents')
      .select('*')
      .eq('id', agentId)
      .eq('organization_id', auth.organizationId)
      .single()

    if (error || !agent) {
      return errorResponse('Agente no encontrado', 404, requestId)
    }

    return NextResponse.json({
      data: {
        id: agent.id,
        organizationId: agent.organization_id,
        name: agent.name,
        role: agent.role,
        model: agent.model,
        systemPrompt: agent.system_prompt,
        tools: agent.tools || [],
        temperature: Number(agent.temperature),
        maxTokens: Number(agent.max_tokens),
        isActive: Boolean(agent.is_active),
        createdAt: agent.created_at,
        updatedAt: agent.updated_at,
      },
      requestId,
    })
  }
)

/**
 * PATCH /api/v1/ai/agents/[id]
 * Actualiza los parámetros o estado de un agente de IA.
 * Rol requerido: 'employee' o 'admin'
 */
export const PATCH = createApiHandler(
  {
    requireAuth: true,
    minRole: 'employee',
    bodySchema: updateAgentSchema,
  },
  async ({ auth, body, params, requestId }) => {
    const supabase = await createClient()
    const agentId = params.id

    const updates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    }

    if (body.name !== undefined) updates.name = body.name
    if (body.role !== undefined) updates.role = body.role
    if (body.model !== undefined) updates.model = body.model
    if (body.systemPrompt !== undefined) updates.system_prompt = body.systemPrompt
    if (body.tools !== undefined) updates.tools = body.tools
    if (body.temperature !== undefined) updates.temperature = body.temperature
    if (body.maxTokens !== undefined) updates.max_tokens = body.maxTokens
    if (body.isActive !== undefined) updates.is_active = body.isActive

    const { data: agent, error } = await supabase
      .from('ai_agents')
      .update(updates)
      .eq('id', agentId)
      .eq('organization_id', auth.organizationId)
      .select('*')
      .single()

    if (error || !agent) {
      console.error(`[AI Agent Update Error][${requestId}]`, error?.message)
      return errorResponse('Error al actualizar el agente o no encontrado', 404, requestId)
    }

    return NextResponse.json({
      data: {
        id: agent.id,
        organizationId: agent.organization_id,
        name: agent.name,
        role: agent.role,
        model: agent.model,
        systemPrompt: agent.system_prompt,
        tools: agent.tools || [],
        temperature: Number(agent.temperature),
        maxTokens: Number(agent.max_tokens),
        isActive: Boolean(agent.is_active),
        createdAt: agent.created_at,
        updatedAt: agent.updated_at,
      },
      message: 'Agente actualizado exitosamente',
      requestId,
    })
  }
)

/**
 * DELETE /api/v1/ai/agents/[id]
 * Elimina un agente de IA.
 * Rol requerido: 'admin'
 */
export const DELETE = createApiHandler(
  {
    requireAuth: true,
    minRole: 'admin',
  },
  async ({ auth, params, requestId }) => {
    const supabase = await createClient()
    const agentId = params.id

    const { error } = await supabase
      .from('ai_agents')
      .delete()
      .eq('id', agentId)
      .eq('organization_id', auth.organizationId)

    if (error) {
      console.error(`[AI Agent Delete Error][${requestId}]`, error.message)
      return errorResponse('Error al eliminar el agente', 500, requestId)
    }

    return NextResponse.json({
      success: true,
      message: 'Agente eliminado exitosamente',
      requestId,
    })
  }
)
