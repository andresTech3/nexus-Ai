'use client'

import { useState, useRef, useEffect } from 'react'

interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  time: string
  model?: string
  tokens?: number
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'm-1',
    role: 'assistant',
    content: '¡Hola! Soy el Asistente Inteligente de NexusAI impulsado por Google Gemini. ¿En qué puedo ayudarte hoy con tus proyectos, presupuestos o consultas de clientes?',
    time: 'Ahora',
    model: 'Gemini 2.0 Flash',
  },
]

const QUICK_PROMPTS = [
  '¿Cuáles son los paquetes y tarifas de automatización?',
  '¿Cómo funciona la integración de agentes de WhatsApp?',
  '¿Qué proyectos o clientes tengo registrados?',
  'Redacta una propuesta de automatización para una clínica dental',
]

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
  const [input, setInput] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [selectedDoc, setSelectedDoc] = useState<string>('all')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, loading])

  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return

    const userText = textToSend.trim()
    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setInput('')
    setLoading(true)

    try {
      // Formatear historial para la API
      const history = messages
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .map((m) => ({ role: m.role, content: m.content }))

      const res = await fetch('/api/v1/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          history,
          knowledgeBase: selectedDoc,
        }),
      })

      if (res.ok) {
        const json = await res.json()
        const botMsg: Message = {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          content: json.reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          model: json.model,
          tokens: json.tokensUsed?.total,
        }
        setMessages((prev) => [...prev, botMsg])
      } else {
        const errJson = await res.json().catch(() => ({}))
        const errorMsg: Message = {
          id: `bot-err-${Date.now()}`,
          role: 'assistant',
          content: `⚠️ ${errJson.message || 'No se pudo obtener respuesta del modelo en este momento.'}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          model: 'Sistema',
        }
        setMessages((prev) => [...prev, errorMsg])
      }
    } catch (err) {
      console.error('Error de red al consultar chatbot:', err)
      const errorMsg: Message = {
        id: `bot-err-${Date.now()}`,
        role: 'assistant',
        content: '⚠️ Error de conexión con el servicio de IA.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: 'Sistema',
      }
      setMessages((prev) => [...prev, errorMsg])
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  const handleClearChat = () => {
    setMessages([
      {
        id: 'm-reset',
        role: 'assistant',
        content: 'Conversación reiniciada. ¿Qué consulta o prueba deseas realizar?',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: 'Gemini 2.0 Flash',
      },
    ])
  }

  return (
    <div id="chatbot-page" style={{ height: 'calc(100vh - 110px)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, color: 'white', marginBottom: '0.25rem' }}>
            Consola de Chatbot & IA
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
            Asistente conversacional inteligente conectado a Google Gemini 2.0 Flash y a la base de conocimiento de tu agencia.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <select
            value={selectedDoc}
            onChange={(e) => setSelectedDoc(e.target.value)}
            style={{
              background: '#12121c',
              border: '1px solid rgba(147, 51, 234, 0.3)',
              borderRadius: '0.5rem',
              color: 'white',
              fontSize: '0.8rem',
              padding: '0.45rem 0.75rem',
              outline: 'none',
            }}
          >
            <option value="all">Base de Conocimiento: Toda la Agencia</option>
            <option value="support">Manual de Soporte y Políticas</option>
            <option value="sales">Catálogo de Servicios y Precios</option>
          </select>
          <button
            onClick={handleClearChat}
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: '0.5rem',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'rgba(255,255,255,0.7)',
              fontSize: '0.8rem',
              cursor: 'pointer',
              transition: 'background 0.15s',
            }}
          >
            Limpiar Chat
          </button>
        </div>
      </div>

      {/* Chat Area Container */}
      <div
        style={{
          flex: 1,
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(147, 51, 234, 0.15)',
          borderRadius: '1rem',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Messages Stream */}
        <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {messages.map((m) => {
            const isBot = m.role === 'assistant'
            return (
              <div
                key={m.id}
                style={{
                  display: 'flex',
                  justifyContent: isBot ? 'flex-start' : 'flex-end',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                }}
              >
                {isBot && (
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #faae33, #d1255c)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.85rem',
                      color: '#281006',
                      fontWeight: 800,
                      flexShrink: 0,
                      boxShadow: '0 4px 12px rgba(250, 174, 51, 0.3)',
                    }}
                  >
                    ⚡
                  </div>
                )}
                <div
                  style={{
                    maxWidth: '78%',
                    background: isBot ? 'rgba(255, 255, 255, 0.03)' : 'linear-gradient(135deg, rgba(147, 51, 234, 0.3), rgba(124, 58, 237, 0.3))',
                    border: isBot ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(147, 51, 234, 0.45)',
                    borderRadius: '0.875rem',
                    padding: '0.875rem 1.125rem',
                    color: 'white',
                    fontSize: '0.9rem',
                    lineHeight: 1.55,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  <div>{m.content}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.5rem', gap: '1rem' }}>
                    <span>{m.model ? `🤖 ${m.model}` : ''} {m.tokens ? `• ${m.tokens} tokens` : ''}</span>
                    <span>{m.time}</span>
                  </div>
                </div>
              </div>
            )
          })}

          {loading && (
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #faae33, #d1255c)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.85rem',
                  color: '#281006',
                  fontWeight: 800,
                }}
              >
                ⚡
              </div>
              <div style={{ background: 'rgba(255,255,255,0.04)', padding: '0.65rem 1.1rem', borderRadius: '0.875rem', color: '#faae33', fontSize: '0.85rem', border: '1px solid rgba(250, 174, 51, 0.2)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="animate-pulse">●</span> Generando respuesta con Gemini 2.0 Flash...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick prompt pills */}
        <div
          style={{
            padding: '0.5rem 1rem',
            borderTop: '1px solid rgba(255,255,255,0.04)',
            background: 'rgba(0,0,0,0.15)',
            display: 'flex',
            gap: '0.5rem',
            overflowX: 'auto',
          }}
        >
          {QUICK_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => sendMessage(prompt)}
              disabled={loading}
              style={{
                whiteSpace: 'nowrap',
                padding: '0.35rem 0.75rem',
                borderRadius: '9999px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.7)',
                fontSize: '0.75rem',
                cursor: 'pointer',
                transition: 'border-color 0.15s, color 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-tiger-gold)'
                e.currentTarget.style.color = '#ffffff'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                e.currentTarget.style.color = 'rgba(255,255,255,0.7)'
              }}
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleSendMessage}
          style={{
            padding: '1rem',
            borderTop: '1px solid rgba(147, 51, 234, 0.15)',
            background: 'rgba(0,0,0,0.25)',
            display: 'flex',
            gap: '0.75rem',
          }}
        >
          <input
            type="text"
            placeholder="Pregunta sobre servicios, cotizaciones, proyectos o automatizaciones..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '0.625rem',
              padding: '0.75rem 1rem',
              color: 'white',
              fontSize: '0.9rem',
              outline: 'none',
            }}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="btn btn-primary"
            style={{ padding: '0.75rem 1.5rem', fontSize: '0.9rem' }}
          >
            {loading ? 'Pensando...' : 'Enviar ↵'}
          </button>
        </form>
      </div>
    </div>
  )
}
