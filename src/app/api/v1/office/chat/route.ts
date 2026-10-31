import { NextRequest, NextResponse } from 'next/server'
import { FREELLMAPI_CATALOG } from '@/lib/office/freellmapiCatalog'

interface OfficeChatPayload {
  provider: 'freellmapi' | 'openai' | 'claude' | 'deepseek' | 'gemini' | 'groq' | 'cerebras' | 'openrouter' | 'ollama' | 'mock'
  apiKey?: string
  modelName?: string
  hostUrl?: string
  systemPrompt: string
  userPrompt: string
  jsonMode?: boolean
}

export async function POST(req: NextRequest) {
  try {
    const body: OfficeChatPayload = await req.json()
    let {
      provider = 'freellmapi',
      apiKey: clientKey,
      modelName,
      hostUrl,
      systemPrompt,
      userPrompt,
      jsonMode = false,
    } = body

    // 1. Resolve API key
    let apiKey = clientKey?.trim()
    if (!apiKey || apiKey === '' || apiKey === 'INTERNAL') {
      if (provider === 'gemini') {
        apiKey = process.env.GEMINI_API_KEY
      }
    }

    // Normalize 'opensource' to ollama, groq or openrouter
    if (provider === ('opensource' as any)) {
      if (apiKey?.startsWith('http://') || apiKey?.startsWith('https://')) {
        provider = 'ollama'
      } else if (apiKey?.startsWith('gsk_')) {
        provider = 'groq'
      } else if (apiKey?.startsWith('sk-or-')) {
        provider = 'openrouter'
      } else {
        provider = 'ollama'
      }
    }

    const hasRealKey = apiKey && apiKey.trim() !== '' && !apiKey.includes('FAKE_')

    // ============================================================
    // 1. FREELLMAPI ADAPTER (Unified Gateway - port 31415 / 3001)
    // ============================================================
    if (provider === 'freellmapi') {
      const candidateHosts = [
        hostUrl,
        'http://127.0.0.1:31415/v1',
        'http://localhost:31415/v1',
        'http://localhost:3001/v1',
      ].filter(Boolean) as string[]

      const internalKey = process.env.FREELLM_API_KEY || 'freellmapi-ab594e82b2ee92f972d72406358969f6bff80d5132d2a3f7'
      const bearerToken = apiKey && apiKey.trim() !== '' && !apiKey.startsWith('http') ? apiKey : internalKey
      const requestedModel = modelName && modelName !== 'auto' ? modelName : 'gpt-4o-mini'

      for (const host of candidateHosts) {
        try {
          const cleanHost = host.endsWith('/') ? host.slice(0, -1) : host
          const endpoint = cleanHost.endsWith('/v1') ? `${cleanHost}/chat/completions` : `${cleanHost}/v1/chat/completions`

          const res = await fetch(endpoint, {
            method: 'POST',
            signal: AbortSignal.timeout(3500),
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${bearerToken}`,
            },
            body: JSON.stringify({
              model: requestedModel,
              messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
              ],
              temperature: 0.6,
              max_tokens: 3000,
            }),
          })

          if (res.ok) {
            const data = await res.json()
            const reply = data.choices?.[0]?.message?.content || ''
            return NextResponse.json({
              reply,
              provider: 'freellmapi',
              model: data.model || requestedModel,
              tokensUsed: data.usage?.total_tokens || 850,
              isReal: true,
              gatewayEndpoint: endpoint,
            })
          }
        } catch (fErr) {
          // Continue to next candidate host
        }
      }
    }

    // ============================================================
    // 2. OPENAI / CHATGPT ADAPTER (GPT-4o, GPT-4o-mini)
    // ============================================================
    if (provider === 'openai' && hasRealKey) {
      try {
        const oaiModel = modelName || 'gpt-4o-mini'
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: oaiModel,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt },
            ],
            temperature: 0.6,
            max_tokens: 3000,
            ...(jsonMode ? { response_format: { type: 'json_object' } } : {}),
          }),
        })

        if (res.ok) {
          const data = await res.json()
          const reply = data.choices?.[0]?.message?.content || ''
          return NextResponse.json({
            reply,
            provider: 'openai',
            model: oaiModel,
            tokensUsed: data.usage?.total_tokens || 850,
            isReal: true,
          })
        }
      } catch (oaiErr) {
        console.warn('[LLM Router] OpenAI request failed:', oaiErr)
      }
    }

    // ============================================================
    // 3. ANTHROPIC CLAUDE ADAPTER (Claude 3.7 Sonnet, Claude 3.5 Haiku)
    // ============================================================
    if (provider === 'claude' && hasRealKey) {
      try {
        const claudeModel = modelName || 'claude-3-7-sonnet-20250219'
        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey || '',
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: claudeModel,
            system: systemPrompt,
            messages: [{ role: 'user', content: userPrompt }],
            max_tokens: 3000,
          }),
        })

        if (res.ok) {
          const data = await res.json()
          const reply = data.content?.[0]?.text || ''
          return NextResponse.json({
            reply,
            provider: 'claude',
            model: claudeModel,
            tokensUsed: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0),
            isReal: true,
          })
        }
      } catch (claudeErr) {
        console.warn('[LLM Router] Claude request failed:', claudeErr)
      }
    }

    // ============================================================
    // 4. DEEPSEEK ADAPTER (DeepSeek-Chat, DeepSeek-Reasoner)
    // ============================================================
    if (provider === 'deepseek' && hasRealKey) {
      try {
        const dsModel = modelName || 'deepseek-chat'
        const res = await fetch('https://api.deepseek.com/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: dsModel,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt },
            ],
            temperature: 0.6,
            max_tokens: 3000,
            ...(jsonMode ? { response_format: { type: 'json_object' } } : {}),
          }),
        })

        if (res.ok) {
          const data = await res.json()
          const reply = data.choices?.[0]?.message?.content || ''
          return NextResponse.json({
            reply,
            provider: 'deepseek',
            model: dsModel,
            tokensUsed: data.usage?.total_tokens || 850,
            isReal: true,
          })
        }
      } catch (dsErr) {
        console.warn('[LLM Router] DeepSeek request failed:', dsErr)
      }
    }

    // ============================================================
    // 5. CEREBRAS CLOUD ADAPTER (Ultra-fast inference ~2000 tps)
    // ============================================================
    if (provider === 'cerebras' && hasRealKey) {
      try {
        const cerebrasModel = modelName || 'llama-3.3-70b'
        const res = await fetch('https://api.cerebras.ai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: cerebrasModel,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt },
            ],
            temperature: 0.6,
            max_tokens: 3000,
          }),
        })

        if (res.ok) {
          const data = await res.json()
          const reply = data.choices?.[0]?.message?.content || ''
          return NextResponse.json({
            reply,
            provider: 'cerebras',
            model: cerebrasModel,
            tokensUsed: data.usage?.total_tokens || 800,
            isReal: true,
          })
        }
      } catch (cErr) {
        console.warn('[LLM Router] Cerebras failed, attempting fallback...', cErr)
      }
    }

    // ============================================================
    // 3. GROQ CLOUD ADAPTER (Llama 3.3 70B & 3.1 8B)
    // ============================================================
    if (provider === 'groq' && hasRealKey) {
      try {
        const groqModel = modelName || 'llama-3.3-70b-versatile'
        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: groqModel,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt },
            ],
            temperature: 0.6,
            max_tokens: 2500,
            ...(jsonMode ? { response_format: { type: 'json_object' } } : {}),
          }),
        })

        if (res.ok) {
          const data = await res.json()
          const reply = data.choices?.[0]?.message?.content || ''
          return NextResponse.json({
            reply,
            provider: 'groq',
            model: groqModel,
            tokensUsed: data.usage?.total_tokens || 800,
            isReal: true,
          })
        }
      } catch (groqErr) {
        console.warn('[LLM Router] Groq failed, attempting fallback...', groqErr)
      }
    }

    // ============================================================
    // 4. GOOGLE GEMINI ADAPTER (Flash & Flash-Lite)
    // ============================================================
    if ((provider === 'gemini' || !hasRealKey) && hasRealKey) {
      try {
        const geminiModel = modelName || process.env.GEMINI_MODEL || 'gemini-2.0-flash'
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${apiKey}`

        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{ text: systemPrompt }],
            },
            contents: [
              {
                role: 'user',
                parts: [{ text: userPrompt }],
              },
            ],
            generationConfig: {
              temperature: 0.6,
              maxOutputTokens: 3000,
              ...(jsonMode ? { responseMimeType: 'application/json' } : {}),
            },
          }),
        })

        if (res.ok) {
          const data = await res.json()
          const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
          return NextResponse.json({
            reply,
            provider: 'gemini',
            model: geminiModel,
            tokensUsed: data.usageMetadata?.totalTokenCount || 900,
            isReal: true,
          })
        }
      } catch (geminiErr) {
        console.warn('[LLM Router] Gemini failed, attempting fallback...', geminiErr)
      }
    }

    // ============================================================
    // 5. OPENROUTER ADAPTER (Free Models)
    // ============================================================
    if (provider === 'openrouter' && hasRealKey) {
      try {
        const orModel = modelName || 'meta-llama/llama-3.3-70b-instruct:free'
        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
            'HTTP-Referer': 'http://localhost:3000',
            'X-Title': 'NexusAI Dropshipping Office',
          },
          body: JSON.stringify({
            model: orModel,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt },
            ],
          }),
        })

        if (res.ok) {
          const data = await res.json()
          const reply = data.choices?.[0]?.message?.content || ''
          return NextResponse.json({
            reply,
            provider: 'openrouter',
            model: orModel,
            tokensUsed: data.usage?.total_tokens || 600,
            isReal: true,
          })
        }
      } catch (orErr) {
        console.warn('[LLM Router] OpenRouter failed, attempting fallback...', orErr)
      }
    }

    // ============================================================
    // 6. OLLAMA LOCAL ADAPTER (100% Offline)
    // ============================================================
    if (provider === 'ollama') {
      try {
        const host = clientKey && clientKey.startsWith('http') ? clientKey : 'http://localhost:11434'
        const ollamaModel = modelName || 'qwen2.5:7b'
        const res = await fetch(`${host}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: ollamaModel,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt },
            ],
            stream: false,
          }),
        })

        if (res.ok) {
          const data = await res.json()
          const reply = data.message?.content || ''
          return NextResponse.json({
            reply,
            provider: 'ollama',
            model: ollamaModel,
            tokensUsed: data.eval_count || 500,
            isReal: true,
          })
        }
      } catch (ollamaErr) {
        console.warn('[LLM Router] Ollama failed, attempting fallback...', ollamaErr)
      }
    }

    // 7. HEURISTIC FALLBACK
    return NextResponse.json({
      reply: null,
      provider: 'mock',
      model: 'heuristic-generator-v2',
      tokensUsed: 650,
      isReal: false,
      message: 'Modo simulación activo. Conecta FreeLLMAPI (localhost:3001) o tu API key gratuita de Gemini/Groq/Cerebras en Conexiones.',
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Error processing AI chat request' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const provider = searchParams.get('provider') || 'freellmapi'
  const hostParam = searchParams.get('hostUrl') || 'http://localhost:3001/v1'
  const cleanHost = hostParam.endsWith('/') ? hostParam.slice(0, -1) : hostParam
  const endpoint = cleanHost.endsWith('/v1') ? `${cleanHost}/models` : `${cleanHost}/v1/models`

  if (provider === 'freellmapi') {
    const candidateHosts = [
      hostParam,
      'http://127.0.0.1:31415/v1',
      'http://localhost:31415/v1',
      'http://localhost:3001/v1',
    ].filter(Boolean) as string[]

    const bearerToken = searchParams.get('apiKey') || 'freellmapi-ab594e82b2ee92f972d72406358969f6bff80d5132d2a3f7'

    for (const host of candidateHosts) {
      try {
        const cleanHost = host.endsWith('/') ? host.slice(0, -1) : host
        const endpoint = cleanHost.endsWith('/v1') ? `${cleanHost}/models` : `${cleanHost}/v1/models`
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 2000)

        const res = await fetch(endpoint, {
          headers: { Authorization: `Bearer ${bearerToken}` },
          signal: controller.signal,
        })
        clearTimeout(timeout)

        if (res.ok) {
          const data = await res.json()
          const rawList = data.data || data.models || []
          return NextResponse.json({
            status: 'online',
            isLive: true,
            endpoint,
            models: rawList.length > 0 ? rawList : FREELLMAPI_CATALOG,
          })
        }
      } catch {
        // Try next
      }
    }

    return NextResponse.json({
      status: 'offline_catalog',
      isLive: false,
      endpoint: 'http://127.0.0.1:31415/v1/models',
      models: FREELLMAPI_CATALOG,
    })
  }

  return NextResponse.json({ status: 'unknown_provider' })
}
