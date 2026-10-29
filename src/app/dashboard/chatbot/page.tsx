'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'

interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  time: string
  model?: string
  tokens?: number
  toolExecuted?: {
    name: string
    data?: any
  }
}

interface AgentOption {
  id: string
  name: string
  role: string
  tools: string[]
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'm-1',
    role: 'assistant',
    content: '¡Hola! Soy tu asistente de IA de NexusAI. Puedes pedirme consultas sobre servicios y cotizaciones, o pedirme que ejecute acciones reales en tu base de datos como:\n\n• "Crea un lead llamado Carlos Gómez de DentalPro con correo carlos@dentalpro.com"\n• "¿Qué clientes tengo en el CRM?"\n• "¿Cuáles son los paquetes y tarifas de automatización?"',
    time: 'Ahora',
    model: 'NexusAI Core',
  },
]

const QUICK_PROMPTS = [
  'Crea un lead llamado Carlos Gómez de DentalPro con correo carlos@dentalpro.com',
  '¿Qué clientes tengo en el CRM?',
  '¿Cuáles son los paquetes y tarifas de automatización?',
  '¿Qué proyectos tengo registrados?',
]

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
  const [input, setInput] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [selectedDoc, setSelectedDoc] = useState<string>('all')
  const [availableAgents, setAvailableAgents] = useState<AgentOption[]>([])
  const [selectedAgentId, setSelectedAgentId] = useState<string>('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Cargar lista de agentes guardados para permitir seleccionarlos
  useEffect(() => {
    async function loadAgents() {
      try {
        const res = await fetch('/api/v1/ai/agents')
        if (res.ok) {
          const json = await res.json()
          setAvailableAgents(json.data || [])
        }
      } catch (e) {
        console.warn('Error cargando agentes para el chatbot:', e)
      }
    }
    loadAgents()
  }, [])

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, loading, scrollToBottom])

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
      const history = messages
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .map((m) => ({ role: m.role, content: m.content }))

      const payload: any = {
        message: userText,
        history,
        knowledgeBase: selectedDoc,
      }

      if (selectedAgentId) {
        payload.agentId = selectedAgentId
      }

      const res = await fetch('/api/v1/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
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
          toolExecuted: json.toolExecuted,
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
    } catch {
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
        content: 'Conversación reiniciada. ¿Qué acción o consulta deseas que realice?',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: 'NexusAI Core',
      },
    ])
  }

  const currentAgent = availableAgents.find((a) => a.id === selectedAgentId)

  return (
    <div
      id="chatbot-page"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 3.25rem)',
        maxHeight: 'calc(100vh - 3.25rem)',
        width: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden',
        color: '#f3f4f6',
      }}
    >
      {/* Header & Controls */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.75rem',
          flexWrap: 'wrap',
          gap: '0.75rem',
          flexShrink: 0,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h1
              style={{
                fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                fontSize: '1.35rem',
                fontWeight: 700,
                color: '#ffffff',
                letterSpacing: '-0.01em',
                margin: 0,
              }}
            >
              Consola de Chatbot & IA
            </h1>
            <span
              style={{
                fontSize: '0.7rem',
                padding: '0.15rem 0.5rem',
                borderRadius: '999px',
                background: 'rgba(74, 222, 128, 0.15)',
                color: '#4ade80',
                border: '1px solid rgba(74, 222, 128, 0.3)',
                fontWeight: 600,
              }}
            >
              ● Conectado
            </span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.15rem', margin: 0 }}>
            Interactúa con Gemini 2.0 Flash o ejecuta acciones reales en CRM y Proyectos.
          </p>
        </div>

        {/* Filters and Agent Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {/* Agent Picker */}
          <select
            value={selectedAgentId}
            onChange={(e) => setSelectedAgentId(e.target.value)}
            style={{
              background: '#181818',
              border: '1px solid #333333',
              borderRadius: '0.45rem',
              color: 'white',
              fontSize: '0.8rem',
              padding: '0.45rem 0.65rem',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="">🤖 Asistente General (NexusAI)</option>
            {availableAgents.map((ag) => (
              <option key={ag.id} value={ag.id}>
                ⚡ {ag.name} ({ag.role})
              </option>
            ))}
          </select>

          {/* Context Picker */}
          <select
            value={selectedDoc}
            onChange={(e) => setSelectedDoc(e.target.value)}
            style={{
              background: '#181818',
              border: '1px solid #333333',
              borderRadius: '0.45rem',
              color: 'white',
              fontSize: '0.8rem',
              padding: '0.45rem 0.65rem',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="all">Base: Toda la Agencia</option>
            <option value="sales">Catálogo y Tarifas</option>
            <option value="support">Soporte y Políticas</option>
          </select>

          <button
            onClick={handleClearChat}
            style={{
              padding: '0.45rem 0.75rem',
              borderRadius: '0.45rem',
              background: '#242424',
              border: '1px solid #383838',
              color: 'rgba(255,255,255,0.8)',
              fontSize: '0.78rem',
              cursor: 'pointer',
              fontWeight: 500,
              transition: 'background 0.15s',
            }}
          >
            Limpiar
          </button>
        </div>
      </div>

      {/* Main Chat Container */}
      <div
        style={{
          flex: 1,
          background: '#181818',
          border: '1px solid #2e2e2e',
          borderRadius: '0.75rem',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          minHeight: 0,
          boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
        }}
      >
        {/* Active Agent Banner (if selected) */}
        {currentAgent && (
          <div
            style={{
              padding: '0.5rem 1rem',
              background: 'rgba(147, 51, 234, 0.15)',
              borderBottom: '1px solid rgba(147, 51, 234, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.78rem',
              color: 'rgba(255,255,255,0.85)',
              flexShrink: 0,
            }}
          >
            <div>
              Hablando con: <strong style={{ color: '#d8b4fe' }}>{currentAgent.name}</strong> ({currentAgent.role})
            </div>
            <div style={{ display: 'flex', gap: '0.35rem' }}>
              {currentAgent.tools.map((t) => (
                <span
                  key={t}
                  style={{
                    fontSize: '0.68rem',
                    fontFamily: 'monospace',
                    padding: '0.15rem 0.4rem',
                    borderRadius: '0.25rem',
                    background: 'rgba(147, 51, 234, 0.25)',
                    color: '#e9d5ff',
                  }}
                >
                  {t}()
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Messages Stream */}
        <div
          style={{
            flex: 1,
            padding: '1rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
            minHeight: 0,
          }}
        >
          {messages.map((m) => {
            const isBot = m.role === 'assistant'
            return (
              <div
                key={m.id}
                style={{
                  display: 'flex',
                  justifyContent: isBot ? 'flex-start' : 'flex-end',
                  alignItems: 'flex-start',
                  gap: '0.65rem',
                }}
              >
                {isBot && (
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: '0.45rem',
                      background: 'linear-gradient(135deg, #7c3aed, #9333ea)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.8rem',
                      color: 'white',
                      fontWeight: 700,
                      flexShrink: 0,
                      boxShadow: '0 2px 8px rgba(124, 58, 237, 0.3)',
                    }}
                  >
                    🤖
                  </div>
                )}

                <div
                  style={{
                    maxWidth: '85%',
                    background: isBot ? '#242424' : 'linear-gradient(135deg, #6d28d9, #7c3aed)',
                    border: isBot ? '1px solid #333333' : '1px solid rgba(147, 51, 234, 0.4)',
                    borderRadius: '0.65rem',
                    padding: '0.75rem 1rem',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    lineHeight: 1.5,
                    whiteSpace: 'pre-wrap',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                  }}
                >
                  {/* Tool execution badge if an action was executed */}
                  {m.toolExecuted && (
                    <div
                      style={{
                        padding: '0.4rem 0.65rem',
                        background: 'rgba(74, 222, 128, 0.12)',
                        border: '1px solid rgba(74, 222, 128, 0.3)',
                        borderRadius: '0.45rem',
                        fontSize: '0.75rem',
                        color: '#4ade80',
                        fontWeight: 600,
                        marginBottom: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span>✓ Acción Real Ejecutada: <code>{m.toolExecuted.name}()</code></span>
                      {m.toolExecuted.name === 'crm_create_lead' && (
                        <Link
                          href="/dashboard/clients"
                          style={{ color: '#86efac', textDecoration: 'underline', fontSize: '0.72rem', marginLeft: '0.5rem' }}
                        >
                          Ver en CRM ➔
                        </Link>
                      )}
                    </div>
                  )}

                  <div>{m.content}</div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.68rem',
                      color: isBot ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.7)',
                      marginTop: '0.45rem',
                      gap: '0.75rem',
                    }}
                  >
                    <span>
                      {m.model ? `● ${m.model}` : ''} {m.tokens ? `• ${m.tokens} tokens` : ''}
                    </span>
                    <span>{m.time}</span>
                  </div>
                </div>
              </div>
            )
          })}

          {loading && (
            <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: '0.45rem',
                  background: 'linear-gradient(135deg, #7c3aed, #9333ea)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  color: 'white',
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                ⚡
              </div>
              <div
                style={{
                  background: '#242424',
                  padding: '0.55rem 0.9rem',
                  borderRadius: '0.65rem',
                  color: '#d8b4fe',
                  fontSize: '0.8rem',
                  border: '1px solid #333333',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <span className="spinner" style={{ width: 13, height: 13 }} />
                <span>Ejecutando razonamiento y acciones con Gemini 2.0 Flash...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick prompt suggestions */}
        <div
          style={{
            padding: '0.45rem 0.85rem',
            borderTop: '1px solid #282828',
            background: '#141414',
            display: 'flex',
            gap: '0.4rem',
            overflowX: 'auto',
            flexShrink: 0,
          }}
        >
          {QUICK_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => sendMessage(prompt)}
              disabled={loading}
              style={{
                whiteSpace: 'nowrap',
                padding: '0.3rem 0.65rem',
                borderRadius: '9999px',
                background: '#222222',
                border: '1px solid #333333',
                color: 'rgba(255,255,255,0.75)',
                fontSize: '0.72rem',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-purple-500)'
                e.currentTarget.style.color = '#ffffff'
                e.currentTarget.style.background = '#2a2a2a'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#333333'
                e.currentTarget.style.color = 'rgba(255,255,255,0.75)'
                e.currentTarget.style.background = '#222222'
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
            padding: '0.65rem 0.85rem',
            borderTop: '1px solid #282828',
            background: '#121212',
            display: 'flex',
            gap: '0.65rem',
            alignItems: 'center',
            flexShrink: 0,
          }}
        >
          <input
            type="text"
            placeholder={
              selectedAgentId
                ? `Escribe tu instrucción para ${currentAgent?.name || 'el agente'}...`
                : 'Escribe tu instrucción o consulta (ej. "Crea un lead llamado Juan Pérez...")'
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            style={{
              flex: 1,
              background: '#222222',
              border: '1px solid #333333',
              borderRadius: '0.45rem',
              padding: '0.65rem 0.85rem',
              color: 'white',
              fontSize: '0.85rem',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = '#9333ea')}
            onBlur={(e) => (e.currentTarget.style.borderColor = '#333333')}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            style={{
              padding: '0.65rem 1.25rem',
              fontSize: '0.85rem',
              fontWeight: 600,
              background: 'linear-gradient(135deg, #7c3aed, #9333ea)',
              color: 'white',
              border: 'none',
              borderRadius: '0.45rem',
              cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
              opacity: loading || !input.trim() ? 0.6 : 1,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: '0 2px 8px rgba(124, 58, 237, 0.4)',
              flexShrink: 0,
            }}
          >
            {loading ? <span className="spinner" style={{ width: 14, height: 14 }} /> : 'Enviar ↵'}
          </button>
        </form>
      </div>
    </div>
  )
}
