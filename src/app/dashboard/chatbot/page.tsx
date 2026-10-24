'use client'

import { useState } from 'react'

interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  time: string
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'm-1',
    role: 'assistant',
    content: '¡Hola! Soy el Asistente Inteligente de NexusAI. ¿En qué puedo ayudarte hoy con tus proyectos o consultas de clientes?',
    time: '10:00 AM',
  },
]

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
  const [input, setInput] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [selectedDoc, setSelectedDoc] = useState<string>('all')

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userText = input.trim()
    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    // Simular respuesta inteligente con contexto documental
    setTimeout(() => {
      let reply = 'He procesado tu solicitud utilizando el modelo Gemini 2.0 Flash.'
      const lower = userText.toLowerCase()
      if (lower.includes('precio') || lower.includes('cotiza') || lower.includes('cuanto')) {
        reply = 'Según el catálogo de servicios de la agencia, el paquete de "Automatización con Agentes IA" tiene una tarifa base estimada de $3,500 USD, con un plazo promedio de entrega de 3 semanas.'
      } else if (lower.includes('cliente') || lower.includes('crm')) {
        reply = 'He verificado la base de datos de CRM de tu organización: puedes consultar y registrar contactos desde la sección Clientes CRM. ¿Deseas redactar una propuesta o registrar un nuevo cliente?'
      } else if (lower.includes('gemini') || lower.includes('modelo')) {
        reply = 'Estamos conectados al adaptador oficial de Google Gemini 2.0 Flash con límite gratuito garantizado. Todas las respuestas se sanitizan para evitar fugas de datos sensibles.'
      } else {
        reply = `Entendido. He analizado tu mensaje: "${userText}". Puedo asistirte programando una tarea, creando un flujo en n8n o redactando una propuesta formal en la sección de cotizaciones.`
      }

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages((prev) => [...prev, botMsg])
      setLoading(false)
    }, 700)
  }

  const handleClearChat = () => {
    setMessages([
      {
        id: 'm-reset',
        role: 'assistant',
        content: 'Conversación reiniciada. ¿Qué consulta o prueba deseas realizar?',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ])
  }

  return (
    <div id="chatbot-page" style={{ height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, color: 'white', marginBottom: '0.25rem' }}>
            Consola de Chatbot & RAG
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
            Prueba de conversaciones interactivas conectadas a la base de conocimiento vectorial de tu agencia.
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
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #9333ea, #7c3aed)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.8rem',
                      color: 'white',
                      flexShrink: 0,
                    }}
                  >
                    ⚡
                  </div>
                )}
                <div
                  style={{
                    maxWidth: '75%',
                    background: isBot ? 'rgba(255, 255, 255, 0.04)' : 'linear-gradient(135deg, rgba(147, 51, 234, 0.25), rgba(124, 58, 237, 0.25))',
                    border: isBot ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(147, 51, 234, 0.4)',
                    borderRadius: '0.875rem',
                    padding: '0.875rem 1.125rem',
                    color: 'white',
                    fontSize: '0.9rem',
                    lineHeight: 1.5,
                  }}
                >
                  <div>{m.content}</div>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', textAlign: 'right', marginTop: '0.35rem' }}>
                    {m.time}
                  </div>
                </div>
              </div>
            )
          })}
          {loading && (
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #9333ea, #7c3aed)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  color: 'white',
                }}
              >
                ⚡
              </div>
              <div style={{ background: 'rgba(255,255,255,0.04)', padding: '0.6rem 1rem', borderRadius: '0.875rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>
                Consultando Gemini 2.0 Flash...
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleSendMessage}
          style={{
            padding: '1rem',
            borderTop: '1px solid rgba(147, 51, 234, 0.15)',
            background: 'rgba(0,0,0,0.2)',
            display: 'flex',
            gap: '0.75rem',
          }}
        >
          <input
            type="text"
            placeholder="Escribe un mensaje de prueba para el chatbot..."
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
            Enviar ↵
          </button>
        </form>
      </div>
    </div>
  )
}
