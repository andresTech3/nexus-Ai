import { NextResponse } from 'next/server'
import { createApiHandler } from '@/lib/api/handler'
import { createClient } from '@/lib/supabase/server'
import { createAgentSchema, agentQuerySchema } from '@/lib/validation/agents.schemas'
import { errorResponse } from '@/lib/auth/server'

/**
 * GET /api/v1/ai/agents
 * Lista los agentes autónomos de la organización y sus estadísticas de uso.
 * Rol requerido: 'client', 'employee' o 'admin'
 */
export const GET = createApiHandler(
  {
    requireAuth: true,
    minRole: 'client',
    querySchema: agentQuerySchema,
  },
  async ({ auth, query, requestId }) => {
    const supabase = await createClient()
    const { search, status } = query

    let dbQuery = supabase
      .from('ai_agents')
      .select('*')
      .eq('organization_id', auth.organizationId)
      .order('created_at', { ascending: false })

    if (status === 'active') {
      dbQuery = dbQuery.eq('is_active', true)
    } else if (status === 'paused') {
      dbQuery = dbQuery.eq('is_active', false)
    }

    if (search && search.trim() !== '') {
      dbQuery = dbQuery.or(`name.ilike.%${search}%,role.ilike.%${search}%`)
    }

    const { data: agents, error } = await dbQuery

    if (error) {
      console.error(`[AI Agents Fetch Error][${requestId}]`, error.message)
      return errorResponse('Error al consultar los agentes de IA', 500, requestId)
    }

    // Consultar uso de tokens hoy para la organización
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const { data: logs } = await supabase
      .from('ai_usage_logs')
      .select('agent_id, total_tokens')
      .eq('organization_id', auth.organizationId)
      .gte('created_at', today.toISOString())

    const callsCountByAgent: Record<string, number> = {}
    const tokensCountByAgent: Record<string, number> = {}
    let totalCallsToday = 0
    let totalTokensToday = 0

    if (logs) {
      logs.forEach((log) => {
        totalCallsToday += 1
        totalTokensToday += log.total_tokens || 0
        if (log.agent_id) {
          callsCountByAgent[log.agent_id] = (callsCountByAgent[log.agent_id] || 0) + 1
          tokensCountByAgent[log.agent_id] = (tokensCountByAgent[log.agent_id] || 0) + (log.total_tokens || 0)
        }
      })
    }

    const formattedAgents = (agents || []).map((agent) => ({
      id: agent.id,
      organizationId: agent.organization_id,
      name: agent.name,
      role: agent.role || 'Asistente Virtual',
      model: agent.model || 'gemini-2.0-flash',
      systemPrompt: agent.system_prompt,
      tools: Array.isArray(agent.tools) ? agent.tools : [],
      temperature: Number(agent.temperature ?? 0.7),
      maxTokens: Number(agent.max_tokens ?? 1000),
      isActive: Boolean(agent.is_active),
      callsToday: callsCountByAgent[agent.id] || 0,
      totalTokens: tokensCountByAgent[agent.id] ? `${tokensCountByAgent[agent.id].toLocaleString()} tks` : '0 tks',
      createdAt: agent.created_at,
      updatedAt: agent.updated_at,
    }))

    return NextResponse.json({
      data: formattedAgents,
      stats: {
        totalAgents: formattedAgents.length,
        activeAgents: formattedAgents.filter((a) => a.isActive).length,
        callsToday: totalCallsToday,
        tokensToday: totalTokensToday,
        quotaMaxDaily: 1500,
        quotaRemaining: Math.max(0, 1500 - totalCallsToday),
      },
      requestId,
    })
  }
)

/**
 * POST /api/v1/ai/agents
 * Crea un nuevo agente autónomo para la organización.
 * Rol requerido: 'employee' o 'admin'
 */
export const POST = createApiHandler(
  {
    requireAuth: true,
    minRole: 'employee',
    bodySchema: createAgentSchema,
  },
  async ({ auth, body, requestId }) => {
    const supabase = await createClient()

    const { data: agent, error } = await supabase
      .from('ai_agents')
      .insert({
        organization_id: auth.organizationId,
        name: body.name,
        role: body.role,
        model: body.model || 'gemini-2.0-flash',
        system_prompt: body.systemPrompt,
        tools: body.tools || [],
        temperature: body.temperature,
        max_tokens: body.maxTokens,
        is_active: body.isActive ?? true,
      })
      .select('*')
      .single()

    if (error) {
      console.error(`[AI Agent Create Error][${requestId}]`, error.message)
      return errorResponse('Error al crear el agente de IA', 500, requestId)
    }

    return NextResponse.json(
      {
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
          callsToday: 0,
          totalTokens: '0 tks',
          createdAt: agent.created_at,
          updatedAt: agent.updated_at,
        },
        message: 'Agente creado exitosamente',
        requestId,
      },
      { status: 201 }
    )
  }
)
