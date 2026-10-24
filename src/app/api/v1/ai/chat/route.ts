import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createApiHandler } from '@/lib/api/handler'
import { createClient } from '@/lib/supabase/server'
import { generateGeminiChatResponse, type ChatMessageInput } from '@/lib/ai/gemini'

const chatRequestSchema = z.object({
  message: z.string().min(1, 'El mensaje no puede estar vacío').max(2500),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant', 'system']),
        content: z.string(),
      })
    )
    .optional()
    .default([]),
  knowledgeBase: z.enum(['all', 'support', 'sales']).optional().default('all'),
})

export const POST = createApiHandler(
  {
    requireAuth: true,
    minRole: 'client', // Permite interacción a clientes y empleados
    bodySchema: chatRequestSchema,
  },
  async ({ auth, body, requestId }) => {
    const supabase = await createClient()

    // 1. Obtener contexto de base de datos de la organización (RAG ligero)
    let knowledgeSnippet = ''

    try {
      // Consultar servicios activos del catálogo
      const { data: services } = await supabase
        .from('service_catalog')
        .select('title, description, base_price_cents, currency, delivery_days')
        .eq('organization_id', auth.organizationId)
        .eq('active', true)
        .limit(5)

      if (services && services.length > 0) {
        knowledgeSnippet += 'Servicios ofrecidos:\n'
        services.forEach((s) => {
          knowledgeSnippet += `- ${s.title}: ${(s.base_price_cents / 100).toFixed(0)} ${s.currency} (${s.delivery_days} días de entrega). ${s.description || ''}\n`
        })
      }

      // Consultar conteo de proyectos y clientes
      const { count: clientCount } = await supabase
        .from('crm_clients')
        .select('id', { count: 'exact', head: true })
        .eq('organization_id', auth.organizationId)

      const { count: projectCount } = await supabase
        .from('projects')
        .select('id', { count: 'exact', head: true })
        .eq('organization_id', auth.organizationId)

      knowledgeSnippet += `\nEstado de la organización: ${clientCount || 0} clientes en CRM y ${projectCount || 0} proyectos registrados.`
    } catch (e) {
      console.warn('[Knowledge Context Warning]:', e)
    }

    // 2. Preparar el historial completo de mensajes
    const messages: ChatMessageInput[] = [
      ...body.history,
      { role: 'user', content: body.message },
    ]

    // 3. Invocar al adaptador de IA (Gemini 2.0 Flash)
    const aiResult = await generateGeminiChatResponse({
      messages,
      organizationId: auth.organizationId,
      userId: auth.userId,
      knowledgeContext: knowledgeSnippet || undefined,
    })

    return NextResponse.json({
      reply: aiResult.reply,
      model: aiResult.model,
      tokensUsed: aiResult.tokensUsed,
      isFallback: aiResult.isFallback,
      timestamp: new Date().toISOString(),
      requestId,
    })
  }
)
