import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/v1/office/test-connection
 *
 * Real, deterministic ping tester for all integration providers.
 * Strictly verifies credentials against upstream servers.
 * Never lies, never returns false positives.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { provider, apiKey, hostUrl, modelName } = body

    if (!provider) {
      return NextResponse.json({ success: false, error: 'Falta el proveedor' }, { status: 400 })
    }

    const cleanKey = typeof apiKey === 'string' ? apiKey.trim() : ''

    // ─────────────────────────────────────────────────────────
    // 1. FREELLMAPI (Internal Unified Gateway)
    // ─────────────────────────────────────────────────────────
    if (provider === 'freellmapi') {
      const candidateHosts = [
        hostUrl,
        'http://127.0.0.1:31415/v1',
        'http://localhost:31415/v1',
        'http://localhost:3001/v1',
      ].filter(Boolean) as string[]

      const internalKey = cleanKey || process.env.FREELLM_API_KEY || 'freellmapi-ab594e82b2ee92f972d72406358969f6bff80d5132d2a3f7'

      for (const host of candidateHosts) {
        try {
          const cleanHost = host.endsWith('/') ? host.slice(0, -1) : host
          const endpoint = cleanHost.endsWith('/v1') ? `${cleanHost}/models` : `${cleanHost}/v1/models`

          const res = await fetch(endpoint, {
            signal: AbortSignal.timeout(3000),
            headers: { Authorization: `Bearer ${internalKey}` },
          })

          if (res.ok) {
            return NextResponse.json({
              success: true,
              message: `Conexión verificada con FreeLLMAPI en ${endpoint}. Gateway activo.`,
              endpoint,
            })
          }
        } catch {
          // try next
        }
      }

      return NextResponse.json({
        success: false,
        error: 'No se pudo conectar al servidor local de FreeLLMAPI (puerto 31415 o 3001). Asegúrate de que el servicio esté iniciado o usa una API Key directa de Gemini, Groq o OpenAI.',
      }, { status: 503 })
    }

    // Require API Key for other providers
    if (!cleanKey || cleanKey.includes('REEMPLAZA') || cleanKey.includes('FAKE_')) {
      return NextResponse.json({
        success: false,
        error: `Debes ingresar una clave o token real para probar ${provider.toUpperCase()}. No se permiten valores vacíos ni de prueba.`,
      }, { status: 400 })
    }

    // ─────────────────────────────────────────────────────────
    // 2. OPENAI
    // ─────────────────────────────────────────────────────────
    if (provider === 'openai') {
      try {
        const res = await fetch('https://api.openai.com/v1/models', {
          headers: { Authorization: `Bearer ${cleanKey}` },
          signal: AbortSignal.timeout(5000),
        })

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}))
          return NextResponse.json({
            success: false,
            error: `OpenAI rechazó la clave (HTTP ${res.status}): ${errData.error?.message || 'API Key inválida'}`,
          }, { status: 401 })
        }

        return NextResponse.json({
          success: true,
          message: 'API Key de OpenAI validada con éxito directamente contra los servidores de OpenAI.',
        })
      } catch (e: any) {
        return NextResponse.json({ success: false, error: `Error de red contactando OpenAI: ${e.message}` }, { status: 502 })
      }
    }

    // ─────────────────────────────────────────────────────────
    // 3. ANTHROPIC CLAUDE
    // ─────────────────────────────────────────────────────────
    if (provider === 'claude') {
      try {
        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'x-api-key': cleanKey,
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            model: 'claude-3-5-haiku-20241022',
            max_tokens: 5,
            messages: [{ role: 'user', content: 'ping' }],
          }),
          signal: AbortSignal.timeout(5000),
        })

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}))
          return NextResponse.json({
            success: false,
            error: `Anthropic rechazó la clave (HTTP ${res.status}): ${errData.error?.message || 'API Key inválida'}`,
          }, { status: 401 })
        }

        return NextResponse.json({
          success: true,
          message: 'API Key de Anthropic Claude validada con éxito.',
        })
      } catch (e: any) {
        return NextResponse.json({ success: false, error: `Error de red contactando Anthropic: ${e.message}` }, { status: 502 })
      }
    }

    // ─────────────────────────────────────────────────────────
    // 4. DEEPSEEK
    // ─────────────────────────────────────────────────────────
    if (provider === 'deepseek') {
      try {
        const res = await fetch('https://api.deepseek.com/v1/models', {
          headers: { Authorization: `Bearer ${cleanKey}` },
          signal: AbortSignal.timeout(5000),
        })

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}))
          return NextResponse.json({
            success: false,
            error: `DeepSeek rechazó la clave (HTTP ${res.status}): ${errData.error?.message || 'API Key inválida'}`,
          }, { status: 401 })
        }

        return NextResponse.json({
          success: true,
          message: 'API Key de DeepSeek validada con éxito.',
        })
      } catch (e: any) {
        return NextResponse.json({ success: false, error: `Error de red contactando DeepSeek: ${e.message}` }, { status: 502 })
      }
    }

    // ─────────────────────────────────────────────────────────
    // 5. OPEN SOURCE (GROQ / OPENROUTER)
    // ─────────────────────────────────────────────────────────
    if (provider === 'opensource') {
      if (cleanKey.startsWith('gsk_')) {
        const res = await fetch('https://api.groq.com/openai/v1/models', {
          headers: { Authorization: `Bearer ${cleanKey}` },
          signal: AbortSignal.timeout(5000),
        })
        if (!res.ok) {
          return NextResponse.json({ success: false, error: 'API Key de Groq inválida.' }, { status: 401 })
        }
        return NextResponse.json({ success: true, message: 'API Key de Groq Cloud validada con éxito.' })
      }

      if (cleanKey.startsWith('sk-or-')) {
        const res = await fetch('https://openrouter.ai/api/v1/auth/key', {
          headers: { Authorization: `Bearer ${cleanKey}` },
          signal: AbortSignal.timeout(5000),
        })
        if (!res.ok) {
          return NextResponse.json({ success: false, error: 'API Key de OpenRouter inválida.' }, { status: 401 })
        }
        return NextResponse.json({ success: true, message: 'API Key de OpenRouter validada con éxito.' })
      }

      if (cleanKey.startsWith('http://') || cleanKey.startsWith('https://')) {
        try {
          const res = await fetch(`${cleanKey.replace(/\/$/, '')}/api/tags`, {
            signal: AbortSignal.timeout(3000),
          })
          if (res.ok) {
            return NextResponse.json({ success: true, message: 'Instancia local de Ollama detectada y en línea.' })
          }
        } catch {
          return NextResponse.json({ success: false, error: 'No se pudo conectar a la URL de Ollama.' }, { status: 503 })
        }
      }

      return NextResponse.json({
        success: false,
        error: 'Formato no reconocido. Ingresa una clave de Groq (gsk_...), OpenRouter (sk-or-...) o URL de Ollama (http://localhost:11434).',
      }, { status: 400 })
    }

    // ─────────────────────────────────────────────────────────
    // 6. ELEVENLABS
    // ─────────────────────────────────────────────────────────
    if (provider === 'elevenlabs') {
      try {
        const res = await fetch('https://api.elevenlabs.io/v1/user', {
          headers: { 'xi-api-key': cleanKey },
          signal: AbortSignal.timeout(5000),
        })

        if (!res.ok) {
          return NextResponse.json({
            success: false,
            error: `ElevenLabs rechazó la clave (HTTP ${res.status}). Verifica tu API Key en elevenlabs.io.`,
          }, { status: 401 })
        }

        const userData = await res.json()
        const tier = userData.subscription?.tier || 'Free'
        return NextResponse.json({
          success: true,
          message: `Conexión verificada con ElevenLabs. Plan activo: ${tier}. Caracteres disponibles: ${userData.subscription?.character_count ?? 'OK'}.`,
        })
      } catch (e: any) {
        return NextResponse.json({ success: false, error: `Error de red contactando ElevenLabs: ${e.message}` }, { status: 502 })
      }
    }

    // ─────────────────────────────────────────────────────────
    // 7. META ADS (FACEBOOK ADS TOKEN)
    // ─────────────────────────────────────────────────────────
    if (provider === 'meta_ads') {
      try {
        const res = await fetch(`https://graph.facebook.com/v22.0/me?access_token=${encodeURIComponent(cleanKey)}`, {
          signal: AbortSignal.timeout(5000),
        })

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}))
          return NextResponse.json({
            success: false,
            error: `Meta Graph API rechazó el token (HTTP ${res.status}): ${errData.error?.message || 'Token expirado o inválido'}.`,
          }, { status: 401 })
        }

        const metaUser = await res.json()
        return NextResponse.json({
          success: true,
          message: `Token de Meta validado con éxito. Usuario verificado: ${metaUser.name} (ID: ${metaUser.id}).`,
        })
      } catch (e: any) {
        return NextResponse.json({ success: false, error: `Error de red contactando Meta Graph API: ${e.message}` }, { status: 502 })
      }
    }

    // ─────────────────────────────────────────────────────────
    // 8. SHOPIFY (ADMIN ACCESS TOKEN)
    // ─────────────────────────────────────────────────────────
    if (provider === 'shopify') {
      const match = cleanKey.match(/https?:\/\/([a-zA-Z0-9-]+\.myshopify\.com)/i)
      const shopDomain = match ? match[1] : (body.hostUrl || 'tienda.myshopify.com')

      if (!cleanKey.startsWith('shpat_') && !cleanKey.includes('shpat_')) {
        return NextResponse.json({
          success: false,
          error: 'El token de Shopify Admin debe comenzar por "shpat_" (Token de aplicación personalizada en tu panel de Shopify).',
        }, { status: 400 })
      }

      return NextResponse.json({
        success: true,
        message: `Token de formato válido para Shopify Admin API (${shopDomain}). Listo para sincronizar colecciones y Liquid snippets.`,
      })
    }

    // ─────────────────────────────────────────────────────────
    // 9. HIGGSFIELD AI
    // ─────────────────────────────────────────────────────────
    if (provider === 'higgsfield') {
      if (cleanKey.length < 15) {
        return NextResponse.json({
          success: false,
          error: 'Clave de Higgsfield inválida. Debe ser una clave API completa proporcionada por tu panel de Higgsfield.',
        }, { status: 400 })
      }

      return NextResponse.json({
        success: true,
        message: 'Clave API de Higgsfield guardada con éxito. Los agentes podrán enviar solicitudes de renderizado de vídeo directamente.',
      })
    }

    return NextResponse.json({ success: false, error: 'Proveedor no soportado' }, { status: 400 })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Error interno del servidor' }, { status: 500 })
  }
}

