'use client'

import { useState } from 'react'

interface Agent {
  id: string
  name: string
  role: string
  model: string
  status: 'active' | 'paused'
  callsToday: number
  totalTokens: string
  systemPrompt: string
  tools: string[]
}

const INITIAL_AGENTS: Agent[] = [
  {
    id: 'agent-1',
    name: 'Agente Calificador de Leads',
    role: 'Ventas & CRM',
    model: 'Gemini 2.0 Flash (Free)',
    status: 'active',
    callsToday: 342,
    totalTokens: '48.2k',
    systemPrompt: 'Evalúa la intención de compra del cliente, extrae presupuesto y necesidades clave, y califica el lead de 1 a 10.',
    tools: ['crm_lookup', 'score_lead', 'send_slack_alert'],
  },
  {
    id: 'agent-2',
    name: 'Asistente de Soporte 24/7',
    role: 'Atención al Cliente',
    model: 'Gemini 2.0 Flash (Free)',
    status: 'active',
    callsToday: 820,
    totalTokens: '112.5k',
    systemPrompt: 'Responde dudas frecuentes consultando exclusivamente la base de conocimiento vectorial autorizada de la empresa.',
    tools: ['knowledge_search', 'create_ticket'],
  },
  {
    id: 'agent-3',
    name: 'Generador de Copys & Campañas',
    role: 'Marketing de Contenidos',
    model: 'Gemini 2.0 Flash (Free)',
    status: 'paused',
    callsToday: 45,
    totalTokens: '18.9k',
    systemPrompt: 'Genera propuestas de anuncios en LinkedIn y Meta adaptadas al tono de marca del cliente con llamadas a la acción.',
    tools: ['tone_analyzer', 'hashtag_generator'],
  },
  {
    id: 'agent-4',
    name: 'Auditor Financiero & Cotizaciones',
    role: 'Operaciones',
    model: 'Gemini 2.0 Flash (Free)',
    status: 'active',
    callsToday: 77,
    totalTokens: '14.1k',
    systemPrompt: 'Calcula presupuestos basados en horas hombre, margen de beneficio de la agencia y servicios contratados.',
    tools: ['catalog_query', 'calculate_margin'],
  },
]

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS)
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false)

  const toggleAgentStatus = (id: string) => {
    setAgents(
      agents.map((a) =>
        a.id === id ? { ...a, status: a.status === 'active' ? 'paused' : 'active' } : a
      )
    )
  }

  return (
    <div id="agents-page">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, color: 'white', marginBottom: '0.375rem' }}>
            Agentes Autónomos de IA
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)' }}>
            Configuración y monitorización de agentes impulsados por Google Gemini bajo cuota gratuita (cero costes).
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedAgent(null)
            setShowConfigModal(true)
          }}
          className="btn btn-primary"
          id="btn-new-agent"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <span>⚡</span> Crear Agente
        </button>
      </div>

      {/* Quota Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.1), rgba(34, 211, 238, 0.05))',
          border: '1px solid rgba(147, 51, 234, 0.25)',
          borderRadius: '0.875rem',
          padding: '1.25rem 1.5rem',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span style={{ color: '#4ade80', fontSize: '0.9rem' }}>●</span>
            <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'white' }}>Proveedor Activo: Google Gemini 2.0 Flash</span>
            <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>Free Tier Activo</span>
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.6)' }}>
            Límite gratuito de 15 solicitudes por minuto (RPM) y 1,500 por día (RPD). Presupuesto cero garantizado.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Consumo Hoy</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#38bdf8' }}>1,284 reqs</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Cuota Restante</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#4ade80' }}>85.6%</div>
          </div>
        </div>
      </div>

      {/* Agents Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.25rem' }}>
        {agents.map((agent) => (
          <div
            key={agent.id}
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(147, 51, 234, 0.15)',
              borderRadius: '1rem',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              transition: 'border-color 0.2s',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-purple-400)', fontWeight: 600, letterSpacing: '0.05em' }}>
                  {agent.role}
                </span>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'white', marginTop: '0.2rem' }}>
                  {agent.name}
                </h3>
              </div>
              <button
                onClick={() => toggleAgentStatus(agent.id)}
                style={{
                  padding: '0.25rem 0.65rem',
                  borderRadius: '999px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  border: agent.status === 'active' ? '1px solid rgba(74, 222, 128, 0.4)' : '1px solid rgba(255, 255, 255, 0.15)',
                  background: agent.status === 'active' ? 'rgba(74, 222, 128, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                  color: agent.status === 'active' ? '#4ade80' : 'rgba(255,255,255,0.4)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <span>{agent.status === 'active' ? '● Activo' : '○ Pausado'}</span>
              </button>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5, marginBottom: '1.25rem', flex: 1 }}>
              {agent.systemPrompt}
            </p>

            {/* Tools allowed */}
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.35rem', textTransform: 'uppercase' }}>
                Herramientas Permitidas
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {agent.tools.map((t) => (
                  <span
                    key={t}
                    style={{
                      fontSize: '0.7rem',
                      fontFamily: 'monospace',
                      padding: '0.15rem 0.45rem',
                      borderRadius: '0.25rem',
                      background: 'rgba(147, 51, 234, 0.15)',
                      color: '#d8b4fe',
                      border: '1px solid rgba(147, 51, 234, 0.25)',
                    }}
                  >
                    {t}()
                  </span>
                ))}
              </div>
            </div>

            {/* Metrics and action */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.875rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)' }}>
                <span>Llamadas: <strong style={{ color: 'white' }}>{agent.callsToday}</strong></span>
                <span>Tokens: <strong style={{ color: '#38bdf8' }}>{agent.totalTokens}</strong></span>
              </div>
              <button
                onClick={() => {
                  setSelectedAgent(agent)
                  setShowConfigModal(true)
                }}
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--color-purple-400)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                Ajustes ⚙
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Config Modal */}
      {showConfigModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
          }}
        >
          <div
            style={{
              background: '#0d0d14',
              border: '1px solid rgba(147, 51, 234, 0.3)',
              borderRadius: '1rem',
              width: '100%',
              maxWidth: 540,
              padding: '2rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white' }}>
                {selectedAgent ? `Configurar: ${selectedAgent.name}` : 'Nuevo Agente IA'}
              </h2>
              <button
                onClick={() => setShowConfigModal(false)}
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '1.25rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.35rem' }}>Modelo LLM</label>
              <select
                defaultValue="gemini-2.0-flash"
                style={{ width: '100%', padding: '0.6rem 0.8rem', background: '#12121c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: 'white' }}
              >
                <option value="gemini-2.0-flash">Gemini 2.0 Flash (Recomendado - 0€ / Free Tier)</option>
                <option value="gemini-1.5-flash">Gemini 1.5 Flash (Free Tier)</option>
                <option value="mock-local">Simulador Local (Desarrollo sin red)</option>
              </select>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.35rem' }}>Instrucciones del Sistema (System Prompt)</label>
              <textarea
                rows={4}
                defaultValue={selectedAgent?.systemPrompt || ''}
                placeholder="Define el rol estricto, tono de voz y restricciones de seguridad del agente..."
                style={{ width: '100%', padding: '0.6rem 0.8rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: 'white', resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.35rem' }}>Temperatura</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="1"
                  defaultValue="0.4"
                  style={{ width: '100%', padding: '0.6rem 0.8rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: 'white' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.35rem' }}>Tokens Máximos / Respuesta</label>
                <input
                  type="number"
                  defaultValue="1024"
                  style={{ width: '100%', padding: '0.6rem 0.8rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: 'white' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                style={{ padding: '0.6rem 1.2rem', borderRadius: '0.5rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white', cursor: 'pointer' }}
              >
                Cerrar
              </button>
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="btn btn-primary"
                style={{ padding: '0.6rem 1.2rem' }}
              >
                Guardar Ajustes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
