/**
 * ADAPTADOR DE INTELIGENCIA ARTIFICIAL — GOOGLE GEMINI 2.0 FLASH
 * 
 * Características:
 * 1. Integración con Gemini 2.0 Flash mediante API REST directa (sin dependencias externas pesadas).
 * 2. Soporte de System Instruction y contexto de base de conocimiento (RAG).
 * 3. Modo de contingencia inteligente (Intelligent Fallback) cuando la API key no está configurada o se excede la cuota gratuita.
 * 4. Registro de auditoría y métricas de consumo de tokens en Supabase (ai_usage_logs).
 */

import { createClient } from '@/lib/supabase/server'

export interface ChatMessageInput {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface GenerateAiResponseOptions {
  messages: ChatMessageInput[]
  systemInstruction?: string
  organizationId?: string
  userId?: string
  knowledgeContext?: string
}

export interface GenerateAiResponseResult {
  reply: string
  model: string
  tokensUsed: {
    prompt: number
    completion: number
    total: number
  }
  isFallback: boolean
}

const DEFAULT_SYSTEM_INSTRUCTION = `Eres NexusAI, el asistente experto en inteligencia artificial, agentes autónomos y automatización de procesos para agencias de alto rendimiento.
Tu objetivo es ayudar a los clientes y administradores a diseñar soluciones de automatización, responder dudas sobre servicios, catálogo de precios, cotizaciones y flujos en n8n/WhatsApp/Make.
Mantén siempre un tono profesional, claro, directo y enfocado en entregar valor de negocio y tecnología de vanguardia.`

export async function generateGeminiChatResponse(
  options: GenerateAiResponseOptions
): Promise<GenerateAiResponseResult> {
  const { messages, systemInstruction, organizationId, userId, knowledgeContext } = options
  const apiKey = process.env.GEMINI_API_KEY
  const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash'

  const hasValidKey = apiKey && apiKey.trim() !== '' && !apiKey.includes('FAKE_GEMINI_KEY')

  // Construir instrucción de sistema con contexto de la agencia si existe
  let fullSystemPrompt = systemInstruction || DEFAULT_SYSTEM_INSTRUCTION
  if (knowledgeContext) {
    fullSystemPrompt += `\n\n--- BASE DE CONOCIMIENTO DE LA AGENCIA ---\n${knowledgeContext}\n--- FIN DE BASE DE CONOCIMIENTO ---`
  }

  // 1. INTENTO CON API DE GOOGLE GEMINI REAL
  if (hasValidKey) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`

      // Formatear mensajes para Gemini API
      const contents = messages
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .map((m) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        }))

      const payload = {
        systemInstruction: {
          parts: [{ text: fullSystemPrompt }],
        },
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        },
      }

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 12000)

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (res.ok) {
        const data = await res.json()
        const candidate = data.candidates?.[0]
        const text = candidate?.content?.parts?.[0]?.text || ''
        const usage = data.usageMetadata || {}

        const tokensUsed = {
          prompt: usage.promptTokenCount || 0,
          completion: usage.candidatesTokenCount || 0,
          total: usage.totalTokenCount || 0,
        }

        // Registrar consumo en Supabase asíncronamente
        if (organizationId) {
          logAiUsage(organizationId, userId, model, tokensUsed, 'success').catch((e) =>
            console.error('[logAiUsage Error]', e)
          )
        }

        return {
          reply: text,
          model,
          tokensUsed,
          isFallback: false,
        }
      } else {
        const errText = await res.text()
        console.warn(`[Gemini API Error ${res.status}]:`, errText)
      }
    } catch (err: any) {
      console.warn('[Gemini API Fetch Exception]:', err?.message || err)
    }
  }

  // 2. MOTOR DE CONTINGENCIA INTELIGENTE (Fallback Contextual de Agencia)
  const lastUserMsg = messages.filter((m) => m.role === 'user').slice(-1)[0]?.content || ''
  const reply = generateContextualFallbackReply(lastUserMsg, knowledgeContext)

  const estimatedTokens = {
    prompt: Math.ceil(lastUserMsg.length / 4),
    completion: Math.ceil(reply.length / 4),
    total: Math.ceil((lastUserMsg.length + reply.length) / 4),
  }

  if (organizationId) {
    logAiUsage(organizationId, userId, `${model}-fallback`, estimatedTokens, 'success').catch(() => {})
  }

  return {
    reply,
    model: `${model} (Motor Local)`,
    tokensUsed: estimatedTokens,
    isFallback: true,
  }
}

/**
 * Generador de respuestas de respaldo especializado en servicios de Agencia IA
 */
function generateContextualFallbackReply(query: string, knowledge?: string): string {
  // Normalizar acentos y pasar a minúsculas
  const q = query
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

  if (q.includes('precio') || q.includes('costo') || q.includes('cuanto') || q.includes('tarifa') || q.includes('cotiz')) {
    return `Nuestra agencia cuenta con 3 paquetes de soluciones en IA:
1. **Chatbot RAG Multicanal (Web + WhatsApp):** $3,800 USD (Entrega en 10-14 días hábiles).
2. **Automatización de Workflows y CRM (n8n / Supabase):** $4,500 USD (Entrega en 2-3 semanas).
3. **Agentes Autónomos Personalizados:** $6,200 USD (Incluye fine-tuning, prompts de sistema y panel de métricas).

Puedes emitir una propuesta formal para tu cliente directamente desde la sección **Cotizaciones** del panel.`
  }

  if (q.includes('whatsapp') || q.includes('chatbot') || q.includes('soporte')) {
    return `Para integrar un Chatbot de WhatsApp con IA en NexusAI, seguimos este flujo:
1. Conexión de webhook vía API oficial de WhatsApp Cloud o Evolution API.
2. Ingesta de la base de conocimiento de la empresa (documentos, preguntas frecuentes y catálogos).
3. Enrutamiento inteligente con Gemini 2.0 Flash y fallback a operador humano si el usuario lo solicita.
4. Registro de prospectos calificados en tu CRM en tiempo real.`
  }

  if (q.includes('cliente') || q.includes('proyecto') || q.includes('crm')) {
    return `Tu entorno de NexusAI cuenta con módulos dedicados:
- **Directorio CRM:** Gestiona contactos, empresas y estados de prospectos.
- **Proyectos & Entregables:** Monitorea avances, plazos fijados y presupuestos asignados.
Todos los registros están protegidos con aislamiento multi-inquilino estricto en Supabase.`
  }

  if (q.includes('gemini') || q.includes('api') || q.includes('clave') || q.includes('key')) {
    return `El sistema está preparado para interactuar con Google Gemini 2.0 Flash bajo el nivel gratuito oficial (Free Tier de 15 RPM y 1,500 RPD).
Para conectar tu clave personal de producción, agrega la variable **GEMINI_API_KEY** en tu configuración de Vercel o en el archivo \`.env.local\`.`
  }

  return `Comprendo tu consulta: "${query}". Como asistente de NexusAI, puedo ayudarte a estructurar propuestas de automatización, definir la arquitectura de agentes autónomos o coordinar nuevos requerimientos con tus clientes. ¿Deseas que preparemos un boceto de proyecto o una cotización?`
}

/**
 * Registra el consumo de tokens en public.ai_usage_logs
 */
async function logAiUsage(
  organizationId: string,
  userId: string | undefined,
  model: string,
  tokens: { prompt: number; completion: number; total: number },
  status: 'success' | 'failed' | 'rate_limited'
) {
  try {
    const supabase = await createClient()
    await supabase.from('ai_usage_logs').insert({
      organization_id: organizationId,
      user_id: userId || null,
      model,
      prompt_tokens: tokens.prompt,
      completion_tokens: tokens.completion,
      total_tokens: tokens.total,
      request_id: `ai_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      status,
    })
  } catch (err) {
    console.error('Error insertando ai_usage_log:', err)
  }
}
