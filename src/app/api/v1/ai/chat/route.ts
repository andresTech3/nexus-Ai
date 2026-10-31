import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createApiHandler } from '@/lib/api/handler'
import { createClient } from '@/lib/supabase/server'
import { generateGeminiChatResponse, type ChatMessageInput } from '@/lib/ai/gemini'

const chatRequestSchema = z.object({
  message: z.string().min(1, 'El mensaje no puede estar vacío').max(3000),
  agentId: z.string().uuid().optional(),
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

    let agentCustomPrompt: string | undefined = undefined
    let agentName = 'NexusAI'
    let allowedTools: string[] = []

    // 1. Si viene un agentId específico, cargar su configuración desde Supabase
    if (body.agentId) {
      const { data: agent } = await supabase
        .from('ai_agents')
        .select('*')
        .eq('id', body.agentId)
        .eq('organization_id', auth.organizationId)
        .single()

      if (agent) {
        agentCustomPrompt = agent.system_prompt
        agentName = agent.name
        allowedTools = Array.isArray(agent.tools) ? agent.tools : []
      }
    }

    // 2. Comprobar si el usuario solicita una acción real (Tool Execution)
    const userText = body.message.trim()
    const lowerText = userText.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    let toolExecuted: { tool: string; resultText: string; data?: any } | null = null

    // A) HERRAMIENTA: crm_create_lead (Crear lead en CRM)
    const isCreateLeadIntent =
      lowerText.includes('crea un lead') ||
      lowerText.includes('crear lead') ||
      lowerText.includes('registra un lead') ||
      lowerText.includes('registrar cliente') ||
      lowerText.includes('nuevo cliente') ||
      lowerText.includes('nuevo prospecto') ||
      lowerText.includes('agrega un lead') ||
      lowerText.includes('agrega a') ||
      lowerText.includes('anade a')

    if (isCreateLeadIntent) {
      // Extraer datos mediante heurística / regex
      const emailMatch = userText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)
      const email = emailMatch ? emailMatch[0] : null

      // Intentar extraer nombre y empresa
      let name = ''
      let company = 'Empresa Prospecto'

      const nameMatch = userText.match(/(?:llamado|cliente|prospecto|nombre|a)\s+([A-ZÁÉÍÓÚa-záéíóúñ]+(?:\s+[A-ZÁÉÍÓÚa-záéíóúñ]+)?)/i)
      if (nameMatch && nameMatch[1] && !['un', 'el', 'la', 'nuevo', 'prospecto', 'cliente'].includes(nameMatch[1].toLowerCase())) {
        name = nameMatch[1].trim()
      }

      const companyMatch = userText.match(/(?:de\s+la\s+empresa|de|empresa|para)\s+([A-ZÁÉÍÓÚa-záéíóúñ0-9]+(?:\s+[A-ZÁÉÍÓÚa-záéíóúñ0-9]+)?)/i)
      if (companyMatch && companyMatch[1] && companyMatch[1] !== name) {
        company = companyMatch[1].trim()
      }

      // VALIDACIÓN ESTRICTA: Correo electrónico primero
      if (!email) {
        return NextResponse.json({
          validationError: true,
          field: 'email',
          problem: 'No se ingresó un correo electrónico válido para el nuevo lead.',
          actionRequired: 'Debes proporcionar un correo con formato válido (ej. usuario@empresa.com) junto con el nombre para registrar al cliente en el CRM.',
          reply: 'No puedo registrar al cliente porque no se ingresó un correo electrónico válido. Para mantener la integridad de los datos en tu CRM, debes indicar el email (ej. carlos@dentalpro.com).',
          model: `${agentName} (Validación)`,
          tokensUsed: { prompt: 25, completion: 45, total: 70 },
          isFallback: false,
          requestId,
        })
      }

      // VALIDACIÓN ESTRICTA: Nombre del cliente
      if (!name) {
        return NextResponse.json({
          validationError: true,
          field: 'name',
          problem: 'No se identificó el nombre de la persona o contacto.',
          actionRequired: 'Indica el nombre del cliente (ej. "Carlos Gómez") y su empresa para guardarlo en el CRM.',
          reply: 'No puedo registrar al cliente sin su nombre. Por favor indica el nombre de la persona junto con su correo.',
          model: `${agentName} (Validación)`,
          tokensUsed: { prompt: 20, completion: 35, total: 55 },
          isFallback: false,
          requestId,
        })
      }

      try {
        const { data: newLead, error: insertError } = await supabase
          .from('crm_clients')
          .insert({
            organization_id: auth.organizationId,
            name,
            company_name: company,
            email: email.toLowerCase(),
            status: 'lead',
            notes: `Creado de forma autónoma por agente IA (${agentName}) mediante solicitud de usuario.`,
          })
          .select('id, name, company_name, email, status')
          .single()

        if (!insertError && newLead) {
          toolExecuted = {
            tool: 'crm_create_lead',
            resultText: `He ejecutado la herramienta **crm_create_lead()** con éxito en la base de datos de Supabase. Registré a **${newLead.name}** de la empresa **${newLead.company_name}** (${newLead.email}) con estado **Lead**. Ya puedes verlo en tu sección de Clientes y CRM.`,
            data: newLead,
          }
        }
      } catch (err) {
        console.warn('[Tool crm_create_lead Error]:', err)
      }
    }

    // B) HERRAMIENTA: crm_check_contact (Consultar lista de clientes del CRM)
    const isListClientsIntent =
      lowerText.includes('que clientes') ||
      lowerText.includes('cuales clientes') ||
      lowerText.includes('cuantos clientes') ||
      lowerText.includes('lista de clientes') ||
      lowerText.includes('mostrar clientes') ||
      lowerText.includes('ver crm')

    if (!toolExecuted && isListClientsIntent) {
      try {
        const { data: clients } = await supabase
          .from('crm_clients')
          .select('name, company_name, email, status')
          .eq('organization_id', auth.organizationId)
          .order('created_at', { ascending: false })
          .limit(8)

        if (clients && clients.length > 0) {
          const list = clients
            .map((c, i) => `${i + 1}. **${c.name}** (${c.company_name || 'Sin empresa'}) — *${c.status.toUpperCase()}* [${c.email}]`)
            .join('\n')

          toolExecuted = {
            tool: 'crm_check_contact',
            resultText: `He consultado tu CRM en tiempo real. Tienes los siguientes registros:\n\n${list}\n\nPuedes pedirme registrar un nuevo lead o consultar el estado de sus proyectos.`,
            data: clients,
          }
        } else {
          toolExecuted = {
            tool: 'crm_check_contact',
            resultText: `He consultado tu CRM en Supabase y actualmente no tienes clientes registrados. ¿Deseas que registre un nuevo prospecto? Solo dime su nombre, empresa y correo.`,
          }
        }
      } catch (err) {
        console.warn('[Tool crm_check_contact Error]:', err)
      }
    }

    // C) HERRAMIENTA: projects_status (Consultar estado de proyectos)
    const isProjectsStatusIntent =
      lowerText.includes('que proyectos') ||
      lowerText.includes('proyectos tengo') ||
      lowerText.includes('estado de proyectos') ||
      lowerText.includes('mis proyectos')

    if (!toolExecuted && isProjectsStatusIntent) {
      try {
        const { data: projects } = await supabase
          .from('projects')
          .select('title, status, budget_cents, currency')
          .eq('organization_id', auth.organizationId)
          .order('created_at', { ascending: false })
          .limit(6)

        if (projects && projects.length > 0) {
          const pList = projects
            .map(
              (p, i) =>
                `${i + 1}. **${p.title}** — Estado: \`${p.status}\` | Presupuesto: **${(p.budget_cents / 100).toLocaleString()} ${p.currency}**`
            )
            .join('\n')

          toolExecuted = {
            tool: 'projects_status',
            resultText: `He verificado tus proyectos registrados en Supabase:\n\n${pList}`,
            data: projects,
          }
        } else {
          toolExecuted = {
            tool: 'projects_status',
            resultText: `No tienes proyectos activos registrados en este momento. Puedes crearlos desde la pestaña Proyectos o pedirme que prepare una cotización.`,
          }
        }
      } catch (err) {
        console.warn('[Tool projects_status Error]:', err)
      }
    }

    // 3. Obtener contexto de base de datos de la organización (RAG ligero)
    let knowledgeSnippet = ''
    try {
      const { data: services } = await supabase
        .from('service_catalog')
        .select('title, description, base_price_cents, currency, delivery_days')
        .eq('organization_id', auth.organizationId)
        .eq('active', true)
        .limit(5)

      if (services && services.length > 0) {
        knowledgeSnippet += 'Servicios activos en la agencia:\n'
        services.forEach((s) => {
          knowledgeSnippet += `- ${s.title}: ${(s.base_price_cents / 100).toFixed(0)} ${s.currency} (${s.delivery_days} días). ${s.description || ''}\n`
        })
      }
    } catch (e) {
      console.warn('[Knowledge Context Warning]:', e)
    }

    // 4. Si una herramienta fue ejecutada directamente, retornar la respuesta con el resultado de la acción
    if (toolExecuted) {
      return NextResponse.json({
        reply: toolExecuted.resultText,
        model: `${agentName} (Acción Real)`,
        tokensUsed: { prompt: 45, completion: 80, total: 125 },
        isFallback: false,
        toolExecuted: {
          name: toolExecuted.tool,
          data: toolExecuted.data || null,
        },
        timestamp: new Date().toISOString(),
        requestId,
      })
    }

    // 5. De lo contrario, invocar al adaptador de IA con el prompt del agente
    const messages: ChatMessageInput[] = [
      ...body.history,
      { role: 'user', content: body.message },
    ]

    const aiResult = await generateGeminiChatResponse({
      messages,
      systemInstruction: agentCustomPrompt,
      organizationId: auth.organizationId,
      userId: auth.userId,
      knowledgeContext: knowledgeSnippet || undefined,
    })

    return NextResponse.json({
      reply: aiResult.reply,
      model: body.agentId ? `${agentName} (${aiResult.model})` : aiResult.model,
      tokensUsed: aiResult.tokensUsed,
      isFallback: aiResult.isFallback,
      timestamp: new Date().toISOString(),
      requestId,
    })
  }
)
