'use client'

import { useState, useEffect, useCallback } from 'react'

interface Agent {
  id: string
  organizationId: string
  name: string
  role: string
  model: string
  systemPrompt: string
  tools: string[]
  temperature: number
  maxTokens: number
  isActive: boolean
  callsToday: number
  totalTokens: string
  createdAt: string
  updatedAt: string
}

interface AgentStats {
  totalAgents: number
  activeAgents: number
  callsToday: number
  tokensToday: number
  quotaMaxDaily: number
  quotaRemaining: number
}

const AVAILABLE_TOOLS = [
  { id: 'crm_create_lead', name: 'crm_create_lead', desc: 'Crear leads en CRM' },
  { id: 'crm_check_contact', name: 'crm_check_contact', desc: 'Consultar contactos' },
  { id: 'catalog_query', name: 'catalog_query', desc: 'Consultar catálogo y tarifas' },
  { id: 'quote_calculate', name: 'quote_calculate', desc: 'Calcular cotizaciones' },
  { id: 'projects_status', name: 'projects_status', desc: 'Consultar estado de proyectos' },
  { id: 'ticket_create', name: 'ticket_create', desc: 'Registrar tickets de soporte' },
]

const AGENT_TEMPLATES = [
  {
    name: 'LeadBot Pro',
    role: 'Calificador de Leads CRM',
    model: 'gemini-2.0-flash',
    tools: ['crm_create_lead', 'crm_check_contact'],
    temperature: 0.3,
    maxTokens: 800,
    systemPrompt:
      'Eres un agente especializado en prospección y calificación de leads B2B para la agencia. Tu objetivo es obtener el tamaño de la empresa, necesidad de automatización, presupuesto estimado y urgencia del cliente antes de transferirlo a un ejecutivo de ventas.',
  },
  {
    name: 'QuoteMaster AI',
    role: 'Cotizador Comercial',
    model: 'gemini-2.0-flash',
    tools: ['catalog_query', 'quote_calculate'],
    temperature: 0.2,
    maxTokens: 1200,
    systemPrompt:
      'Eres el agente comercial de NexusAI encargado de estructurar propuestas económicas para servicios de Chatbots RAG, flujos n8n y desarrollo de agentes IA. Utiliza los precios de catálogo vigentes y calcula plazos en días laborables.',
  },
  {
    name: 'SupportNexus',
    role: 'Soporte al Cliente 24/7',
    model: 'gemini-2.0-flash',
    tools: ['projects_status', 'ticket_create'],
    temperature: 0.5,
    maxTokens: 1000,
    systemPrompt:
      'Eres el agente de soporte técnico y seguimiento de proyectos de NexusAI. Ayudas a los clientes a conocer el estado de sus proyectos, responder dudas sobre entregables y canalizar incidencias críticas con los ingenieros de la agencia.',
  },
]

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [stats, setStats] = useState<AgentStats | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false)
  const [saving, setSaving] = useState<boolean>(false)
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  // Filtros
  const [search, setSearch] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'paused'>('all')

  // Form State
  const [formName, setFormName] = useState('')
  const [formRole, setFormRole] = useState('')
  const [formModel, setFormModel] = useState('gemini-2.0-flash')
  const [formSystemPrompt, setFormSystemPrompt] = useState('')
  const [formTools, setFormTools] = useState<string[]>([])
  const [formTemperature, setFormTemperature] = useState<number>(0.7)
  const [formMaxTokens, setFormMaxTokens] = useState<number>(1000)
  const [formIsActive, setFormIsActive] = useState<boolean>(true)

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type })
    setTimeout(() => setToastMessage(null), 4000)
  }

  const fetchAgents = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (statusFilter !== 'all') params.append('status', statusFilter)

      const res = await fetch(`/api/v1/ai/agents?${params.toString()}`)
      if (res.ok) {
        const json = await res.json()
        setAgents(json.data || [])
        setStats(json.stats || null)
      } else {
        showToast('Error al cargar agentes de IA', 'error')
      }
    } catch {
      showToast('Error de conexión al cargar agentes', 'error')
    } finally {
      setLoading(false)
    }
  }, [search, statusFilter])

  useEffect(() => {
    fetchAgents()
  }, [fetchAgents])

  const openModal = (agent?: Agent) => {
    if (agent) {
      setSelectedAgent(agent)
      setFormName(agent.name)
      setFormRole(agent.role)
      setFormModel(agent.model)
      setFormSystemPrompt(agent.systemPrompt)
      setFormTools(agent.tools || [])
      setFormTemperature(agent.temperature)
      setFormMaxTokens(agent.maxTokens)
      setFormIsActive(agent.isActive)
    } else {
      setSelectedAgent(null)
      setFormName('')
      setFormRole('')
      setFormModel('gemini-2.0-flash')
      setFormSystemPrompt('')
      setFormTools([])
      setFormTemperature(0.7)
      setFormMaxTokens(1000)
      setFormIsActive(true)
    }
    setShowConfigModal(true)
  }

  const applyTemplate = (template: typeof AGENT_TEMPLATES[0]) => {
    setFormName(template.name)
    setFormRole(template.role)
    setFormModel(template.model)
    setFormSystemPrompt(template.systemPrompt)
    setFormTools(template.tools)
    setFormTemperature(template.temperature)
    setFormMaxTokens(template.maxTokens)
  }

  const toggleTool = (toolId: string) => {
    setFormTools((prev) =>
      prev.includes(toolId) ? prev.filter((t) => t !== toolId) : [...prev, toolId]
    )
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formName.trim() || !formRole.trim() || formSystemPrompt.trim().length < 10) {
      showToast('Completa el nombre, rol y un prompt de al menos 10 caracteres', 'error')
      return
    }

    setSaving(true)
    try {
      const payload = {
        name: formName.trim(),
        role: formRole.trim(),
        model: formModel,
        systemPrompt: formSystemPrompt.trim(),
        tools: formTools,
        temperature: Number(formTemperature),
        maxTokens: Number(formMaxTokens),
        isActive: formIsActive,
      }

      if (selectedAgent) {
        // Actualizar
        const res = await fetch(`/api/v1/ai/agents/${selectedAgent.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        if (res.ok) {
          showToast('Agente actualizado exitosamente')
          setShowConfigModal(false)
          fetchAgents()
        } else {
          const err = await res.json().catch(() => ({}))
          showToast(err.message || 'Error al actualizar agente', 'error')
        }
      } else {
        // Crear
        const res = await fetch('/api/v1/ai/agents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        if (res.ok) {
          showToast('Agente creado exitosamente en Supabase')
          setShowConfigModal(false)
          fetchAgents()
        } else {
          const err = await res.json().catch(() => ({}))
          showToast(err.message || 'Error al crear agente', 'error')
        }
      }
    } catch {
      showToast('Error de red al guardar el agente', 'error')
    } finally {
      setSaving(false)
    }
  }

  const toggleAgentStatus = async (agent: Agent) => {
    const newStatus = !agent.isActive

    // Actualización optimista en interfaz
    setAgents((prev) =>
      prev.map((a) => (a.id === agent.id ? { ...a, isActive: newStatus } : a))
    )

    try {
      const res = await fetch(`/api/v1/ai/agents/${agent.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: newStatus }),
      })

      if (!res.ok) {
        // Revertir
        setAgents((prev) =>
          prev.map((a) => (a.id === agent.id ? { ...a, isActive: agent.isActive } : a))
        )
        showToast('No se pudo cambiar el estado del agente', 'error')
      } else {
        showToast(newStatus ? `Agente "${agent.name}" activado` : `Agente "${agent.name}" pausado`)
      }
    } catch {
      setAgents((prev) =>
        prev.map((a) => (a.id === agent.id ? { ...a, isActive: agent.isActive } : a))
      )
      showToast('Error de red al actualizar estado', 'error')
    }
  }

  const handleDeleteAgent = async (agent: Agent) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar el agente "${agent.name}"?`)) {
      return
    }

    try {
      const res = await fetch(`/api/v1/ai/agents/${agent.id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        showToast(`Agente "${agent.name}" eliminado`)
        setAgents((prev) => prev.filter((a) => a.id !== agent.id))
      } else {
        const err = await res.json().catch(() => ({}))
        showToast(err.message || 'No se pudo eliminar el agente', 'error')
      }
    } catch {
      showToast('Error de red al eliminar el agente', 'error')
    }
  }

  const totalCallsToday = stats?.callsToday ?? agents.reduce((sum, a) => sum + (a.callsToday || 0), 0)
  const remainingQuota = stats?.quotaRemaining ?? Math.max(0, 1500 - totalCallsToday)
  const remainingPercent = `${((remainingQuota / 1500) * 100).toFixed(1)}%`

  return (
    <div id="agents-page">
      {/* Toast Alert */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '1.5rem',
            right: '1.5rem',
            background: toastMessage.type === 'error' ? 'rgba(239, 68, 68, 0.95)' : 'rgba(16, 185, 129, 0.95)',
            color: 'white',
            padding: '0.875rem 1.5rem',
            borderRadius: '0.75rem',
            boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
            zIndex: 9999,
            fontSize: '0.9rem',
            fontWeight: 600,
            animation: 'fadeIn 0.3s ease',
            backdropFilter: 'blur(8px)',
          }}
        >
          {toastMessage.type === 'error' ? '⚠️' : '✓'} {toastMessage.text}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, color: 'white', marginBottom: '0.375rem' }}>
            Agentes Autónomos de IA
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)' }}>
            Configuración y monitorización de agentes inteligentes conectados a Supabase y potenciados por Google Gemini.
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="btn btn-primary"
          id="btn-new-agent"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 1.25rem' }}
        >
          <span>⚡</span> Crear Agente
        </button>
      </div>

      {/* Quota & Status Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.12), rgba(34, 211, 238, 0.06))',
          border: '1px solid rgba(147, 51, 234, 0.28)',
          borderRadius: '0.875rem',
          padding: '1.25rem 1.5rem',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <span style={{ color: '#4ade80', fontSize: '0.9rem' }}>●</span>
            <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'white' }}>Proveedor Activo: Google Gemini 2.0 Flash</span>
            <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>Nivel Gratuito Activo</span>
            <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 600 }}>• Persistencia Supabase</span>
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.65)' }}>
            Límite gratuito de 15 peticiones por minuto (RPM) y 1,500 al día (RPD). Presupuesto 0€ garantizado.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1.75rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Agentes Activos</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white' }}>
              {agents.filter((a) => a.isActive).length} / {agents.length}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Consumo Hoy</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#38bdf8' }}>{totalCallsToday} reqs</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cuota Restante</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#4ade80' }}>{remainingPercent}</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255,255,255,0.03)', padding: '0.25rem', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.08)' }}>
          <button
            onClick={() => setStatusFilter('all')}
            style={{
              padding: '0.4rem 0.85rem',
              borderRadius: '0.375rem',
              border: 'none',
              background: statusFilter === 'all' ? 'var(--color-purple-600)' : 'transparent',
              color: 'white',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Todos ({agents.length})
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            style={{
              padding: '0.4rem 0.85rem',
              borderRadius: '0.375rem',
              border: 'none',
              background: statusFilter === 'active' ? 'var(--color-purple-600)' : 'transparent',
              color: 'white',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Activos
          </button>
          <button
            onClick={() => setStatusFilter('paused')}
            style={{
              padding: '0.4rem 0.85rem',
              borderRadius: '0.375rem',
              border: 'none',
              background: statusFilter === 'paused' ? 'var(--color-purple-600)' : 'transparent',
              color: 'white',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Pausados
          </button>
        </div>

        <div style={{ position: 'relative', minWidth: 260 }}>
          <input
            type="text"
            placeholder="Buscar por nombre o rol..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '0.55rem 0.85rem',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '0.5rem',
              color: 'white',
              fontSize: '0.85rem',
            }}
          />
        </div>
      </div>

      {/* Agents Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'rgba(255,255,255,0.6)' }}>
          <div className="spinner" style={{ margin: '0 auto 1rem auto' }} />
          <p>Cargando agentes desde Supabase...</p>
        </div>
      ) : agents.length === 0 ? (
        <div
          style={{
            padding: '3.5rem 2rem',
            textAlign: 'center',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px dashed rgba(147, 51, 234, 0.25)',
            borderRadius: '1rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem', opacity: 0.7 }}>🤖</div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f3f4f6', marginBottom: '0.5rem' }}>
            No se encontraron agentes de IA
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', maxWidth: '420px', marginBottom: '1.5rem', lineHeight: 1.5 }}>
            {search ? 'No hay resultados que coincidan con la búsqueda.' : 'Despliega agentes autónomos con Gemini 2.0 Flash para calificar prospectos, atender clientes 24/7 o redactar propuestas.'}
          </p>
          <button
            onClick={() => openModal()}
            className="btn btn-primary"
            style={{ padding: '0.65rem 1.4rem', fontSize: '0.875rem' }}
          >
            + Crear Primer Agente
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.25rem' }}>
          {agents.map((agent) => (
            <div
              key={agent.id}
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: agent.isActive ? '1px solid rgba(147, 51, 234, 0.25)' : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '1rem',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                transition: 'border-color 0.2s, transform 0.2s',
                opacity: agent.isActive ? 1 : 0.7,
              }}
            >
              {/* Card Header */}
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
                  onClick={() => toggleAgentStatus(agent)}
                  style={{
                    padding: '0.25rem 0.65rem',
                    borderRadius: '999px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    border: agent.isActive ? '1px solid rgba(74, 222, 128, 0.4)' : '1px solid rgba(255, 255, 255, 0.15)',
                    background: agent.isActive ? 'rgba(74, 222, 128, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                    color: agent.isActive ? '#4ade80' : 'rgba(255,255,255,0.4)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                  title="Haz clic para alternar estado"
                >
                  <span>{agent.isActive ? '● Activo' : '○ Pausado'}</span>
                </button>
              </div>

              {/* System Prompt preview */}
              <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.5, marginBottom: '1.25rem', flex: 1, maxHeight: '4.5rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {agent.systemPrompt}
              </p>

              {/* Tools allowed */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                  Herramientas Habilitadas
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {agent.tools && agent.tools.length > 0 ? (
                    agent.tools.map((t) => (
                      <span
                        key={t}
                        style={{
                          fontSize: '0.7rem',
                          fontFamily: 'monospace',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '0.25rem',
                          background: 'rgba(147, 51, 234, 0.15)',
                          color: '#d8b4fe',
                          border: '1px solid rgba(147, 51, 234, 0.25)',
                        }}
                      >
                        {t}()
                      </span>
                    ))
                  ) : (
                    <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>
                      Sin herramientas externas
                    </span>
                  )}
                </div>
              </div>

              {/* Metrics and actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.875rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)' }}>
                  <span>Llamadas: <strong style={{ color: 'white' }}>{agent.callsToday}</strong></span>
                  <span>Tokens: <strong style={{ color: '#38bdf8' }}>{agent.totalTokens}</strong></span>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    onClick={() => openModal(agent)}
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
                  <button
                    onClick={() => handleDeleteAgent(agent)}
                    style={{
                      fontSize: '0.8rem',
                      color: '#ef4444',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      opacity: 0.7,
                    }}
                    title="Eliminar agente"
                  >
                    🗑
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Config / Create Modal */}
      {showConfigModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1.5rem',
          }}
        >
          <div
            style={{
              background: '#0d0d16',
              border: '1px solid rgba(147, 51, 234, 0.35)',
              borderRadius: '1rem',
              width: '100%',
              maxWidth: 600,
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '2rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.85)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'white' }}>
                  {selectedAgent ? `Configurar: ${selectedAgent.name}` : 'Crear Agente Autónomo'}
                </h2>
                <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
                  Persistido en Supabase con permisos multi-inquilino.
                </p>
              </div>
              <button
                onClick={() => setShowConfigModal(false)}
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '1.25rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            {/* Quick Template Picker (Only when creating new) */}
            {!selectedAgent && (
              <div style={{ marginBottom: '1.5rem', padding: '0.85rem', background: 'rgba(147, 51, 234, 0.08)', borderRadius: '0.5rem', border: '1px solid rgba(147, 51, 234, 0.2)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-purple-400)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                  ⚡ Cargar Plantilla Rápida
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {AGENT_TEMPLATES.map((tmpl) => (
                    <button
                      key={tmpl.name}
                      type="button"
                      onClick={() => applyTemplate(tmpl)}
                      style={{
                        padding: '0.35rem 0.65rem',
                        borderRadius: '0.35rem',
                        border: '1px solid rgba(255,255,255,0.15)',
                        background: 'rgba(255,255,255,0.05)',
                        color: 'white',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                      }}
                    >
                      + {tmpl.name} ({tmpl.role})
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.35rem' }}>
                    Nombre del Agente *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Ej. LeadBot Pro"
                    style={{ width: '100%', padding: '0.6rem 0.8rem', background: '#13131f', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '0.5rem', color: 'white', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.35rem' }}>
                    Rol / Especialidad *
                  </label>
                  <input
                    type="text"
                    required
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    placeholder="Ej. Calificador de Leads CRM"
                    style={{ width: '100%', padding: '0.6rem 0.8rem', background: '#13131f', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '0.5rem', color: 'white', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.35rem' }}>Modelo LLM</label>
                <select
                  value={formModel}
                  onChange={(e) => setFormModel(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.8rem', background: '#13131f', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '0.5rem', color: 'white', fontSize: '0.85rem' }}
                >
                  <option value="gemini-2.0-flash">Google Gemini 2.0 Flash (Recomendado — 0€ / Free Tier)</option>
                  <option value="gemini-1.5-flash">Google Gemini 1.5 Flash (Free Tier)</option>
                  <option value="mock-local">Simulador Local de Agencia (Sin Red)</option>
                </select>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.35rem' }}>
                  Instrucciones del Sistema (System Prompt) *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formSystemPrompt}
                  onChange={(e) => setFormSystemPrompt(e.target.value)}
                  placeholder="Define el rol estricto, tono de voz y restricciones de seguridad del agente..."
                  style={{ width: '100%', padding: '0.6rem 0.8rem', background: '#13131f', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '0.5rem', color: 'white', resize: 'vertical', fontSize: '0.85rem' }}
                />
              </div>

              {/* Tools selection */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.5rem' }}>
                  Herramientas y Acciones Permitidas (Function Calling)
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  {AVAILABLE_TOOLS.map((t) => {
                    const isChecked = formTools.includes(t.id)
                    return (
                      <div
                        key={t.id}
                        onClick={() => toggleTool(t.id)}
                        style={{
                          padding: '0.5rem 0.75rem',
                          borderRadius: '0.5rem',
                          background: isChecked ? 'rgba(147, 51, 234, 0.2)' : 'rgba(255,255,255,0.03)',
                          border: isChecked ? '1px solid rgba(147, 51, 234, 0.5)' : '1px solid rgba(255,255,255,0.08)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          style={{ cursor: 'pointer' }}
                        />
                        <div>
                          <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'white', fontFamily: 'monospace' }}>
                            {t.name}()
                          </div>
                          <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>
                            {t.desc}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Temperature & Max tokens */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <label style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>Temperatura</label>
                    <span style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 600 }}>{formTemperature}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={formTemperature}
                    onChange={(e) => setFormTemperature(parseFloat(e.target.value))}
                    style={{ width: '100%', cursor: 'pointer' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.2rem' }}>
                    <span>0.0 (Preciso)</span>
                    <span>1.0 (Creativo)</span>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.35rem' }}>
                    Tokens Máximos / Respuesta
                  </label>
                  <input
                    type="number"
                    min="100"
                    max="4096"
                    step="50"
                    value={formMaxTokens}
                    onChange={(e) => setFormMaxTokens(parseInt(e.target.value) || 1000)}
                    style={{ width: '100%', padding: '0.6rem 0.8rem', background: '#13131f', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '0.5rem', color: 'white', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              {/* Active Toggle in form */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.75rem' }}>
                <input
                  type="checkbox"
                  id="agent-active-chk"
                  checked={formIsActive}
                  onChange={(e) => setFormIsActive(e.target.checked)}
                  style={{ width: '1rem', height: '1rem', cursor: 'pointer' }}
                />
                <label htmlFor="agent-active-chk" style={{ fontSize: '0.85rem', color: 'white', cursor: 'pointer' }}>
                  Agente activo inmediatamente para atender solicitudes
                </label>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setShowConfigModal(false)}
                  style={{ padding: '0.65rem 1.25rem', borderRadius: '0.5rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white', cursor: 'pointer', fontSize: '0.875rem' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn btn-primary"
                  style={{ padding: '0.65rem 1.4rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  {saving && <span className="spinner" />}
                  {selectedAgent ? 'Guardar Cambios' : 'Crear Agente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
