'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { ActionToast, ActionToastData } from '@/components/ui/ActionToast'
import { AutonomousOfficeDashboard } from '@/components/office/AutonomousOfficeDashboard'

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

interface TestMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  time: string
  toolExecuted?: {
    name: string
    data?: any
  }
}

const AVAILABLE_TOOLS = [
  { id: 'crm_create_lead', name: 'crm_create_lead', desc: 'Crear leads reales en CRM' },
  { id: 'crm_check_contact', name: 'crm_check_contact', desc: 'Consultar clientes del CRM' },
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
  const [actionToast, setActionToast] = useState<ActionToastData | null>(null)

  // View Mode
  const [viewMode, setViewMode] = useState<'office3d' | 'classic'>('office3d')

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

  // Live Agent Playground State
  const [testingAgent, setTestingAgent] = useState<Agent | null>(null)
  const [testMessages, setTestMessages] = useState<TestMessage[]>([])
  const [testInput, setTestInput] = useState('')
  const [testLoading, setTestLoading] = useState(false)
  const testEndRef = useRef<HTMLDivElement>(null)

  const showActionToast = (toast: ActionToastData) => {
    setActionToast(toast)
    setTimeout(() => {
      setActionToast((current) => (current === toast ? null : current))
    }, 7000)
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
        showActionToast({
          title: 'Error al Cargar Agentes',
          problem: 'No se pudo obtener la lista de agentes de IA desde el servidor.',
          actionRequired: 'Verifica que la base de datos esté accesible y recarga la página.',
          type: 'error',
        })
      }
    } catch {
      showActionToast({
        title: 'Error de Red',
        problem: 'Fallo de conexión al cargar agentes.',
        actionRequired: 'Revisa tu conectividad a internet.',
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }, [search, statusFilter])

  useEffect(() => {
    fetchAgents()
  }, [fetchAgents])

  // Scroll to bottom on test messages
  useEffect(() => {
    if (testingAgent) {
      testEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [testMessages, testLoading, testingAgent])

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

  const openPlayground = (agent: Agent) => {
    setTestingAgent(agent)
    setTestMessages([
      {
        id: 'msg-init',
        role: 'assistant',
        content: `¡Hola! Soy ${agent.name} (${agent.role}). Estoy listo para ejecutar mis instrucciones y herramientas permitidas (${agent.tools.join(', ') || 'sin herramientas'}). ¿Qué deseas que haga?`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ])
    setTestInput('')
  }

  const sendTestMessage = async (text: string) => {
    if (!text.trim() || testLoading || !testingAgent) return

    const userText = text.trim()
    const lower = userText.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    const isLeadIntent =
      lower.includes('lead') ||
      lower.includes('prospecto') ||
      lower.includes('cliente')

    const hasCreationVerb =
      lower.includes('crea') ||
      lower.includes('registra') ||
      lower.includes('agrega') ||
      lower.includes('inserta')

    // VALIDACIÓN PREVENTIVA: Si intenta registrar un lead o cliente sin correo electrónico
    if (isLeadIntent && hasCreationVerb && !userText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)) {
      showActionToast({
        title: 'Correo Electrónico Obligatorio',
        problem: 'Intentas registrar un contacto o prospecto sin proveer una dirección de correo válida.',
        actionRequired: 'Escribe el correo electrónico válido (ej. usuario@empresa.com) junto con el nombre del contacto en tu mensaje.',
        type: 'error',
      })
      return
    }

    const userMsg: TestMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setTestMessages((prev) => [...prev, userMsg])
    setTestInput('')
    setTestLoading(true)

    try {
      const history = testMessages.map((m) => ({ role: m.role, content: m.content }))

      const res = await fetch('/api/v1/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          agentId: testingAgent.id,
          history,
        }),
      })

      if (res.ok) {
        const json = await res.json()
        const botMsg: TestMessage = {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          content: json.reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          toolExecuted: json.toolExecuted,
        }
        setTestMessages((prev) => [...prev, botMsg])

        if (json.toolExecuted) {
          showActionToast({
            title: 'Acción Ejecutada en CRM',
            problem: 'Ninguno. Operación completada con éxito en la base de datos.',
            actionRequired: `El agente ejecutó la función ${json.toolExecuted.name}() y los datos quedaron registrados en Supabase.`,
            type: 'success',
          })
        }
      } else {
        const err = await res.json().catch(() => ({}))
        const errorMsg: TestMessage = {
          id: `bot-err-${Date.now()}`,
          role: 'assistant',
          content: `⚠️ ${err.message || 'Error al comunicarse con el agente'}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
        setTestMessages((prev) => [...prev, errorMsg])

        showActionToast({
          title: 'Error de Ejecución del Agente',
          problem: err.problem || err.message || 'Fallo en la comunicación con el modelo.',
          actionRequired: err.actionRequired || 'Verifica los parámetros y las herramientas configuradas para este agente.',
          type: 'error',
        })
      }
    } catch {
      const errorMsg: TestMessage = {
        id: `bot-err-${Date.now()}`,
        role: 'assistant',
        content: '⚠️ Error de conexión con el agente',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setTestMessages((prev) => [...prev, errorMsg])

      showActionToast({
        title: 'Error de Conexión de Red',
        problem: 'No se pudo conectar con el servidor de agentes.',
        actionRequired: 'Verifica tu conexión y recarga la página.',
        type: 'error',
      })
    } finally {
      setTestLoading(false)
    }
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

    if (!formName.trim() || formName.trim().length < 2) {
      showActionToast({
        title: 'Nombre de Agente Inválido',
        problem: 'El nombre del agente está vacío o tiene menos de 2 caracteres.',
        actionRequired: 'Escribe un nombre descriptivo (ejemplo: "LeadBot Pro" o "Cotizador IA").',
        type: 'error',
      })
      return
    }

    if (!formRole.trim() || formRole.trim().length < 2) {
      showActionToast({
        title: 'Rol o Especialidad Obligatoria',
        problem: 'No has especificado el rol o especialidad del agente.',
        actionRequired: 'Indica la función principal del agente (ejemplo: "Calificador de Leads B2B").',
        type: 'error',
      })
      return
    }

    if (formSystemPrompt.trim().length < 10) {
      showActionToast({
        title: 'Instrucciones Insuficientes',
        problem: 'El System Prompt tiene menos de 10 caracteres y no proporciona contexto al modelo LLM.',
        actionRequired: 'Redacta un System Prompt detallado con las directrices, tono y restricciones del agente.',
        type: 'error',
      })
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
          showActionToast({
            title: 'Agente Actualizado Exitosamente',
            problem: 'Ninguno. Parámetros persistidos en Supabase.',
            actionRequired: 'El agente ya está actualizado para responder en el chatbot.',
            type: 'success',
          })
          setShowConfigModal(false)
          fetchAgents()
        } else {
          const err = await res.json().catch(() => ({}))
          showActionToast({
            title: 'Error al Actualizar Agente',
            problem: err.problem || err.message || 'Error en la base de datos.',
            actionRequired: err.actionRequired || 'Revisa los campos e intenta de nuevo.',
            type: 'error',
          })
        }
      } else {
        // Crear
        const res = await fetch('/api/v1/ai/agents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        if (res.ok) {
          showActionToast({
            title: 'Agente Creado Exitosamente',
            problem: 'Ninguno. Nuevo agente registrado en Supabase.',
            actionRequired: 'Haz clic en "💬 Probar Agente" para validar sus herramientas.',
            type: 'success',
          })
          setShowConfigModal(false)
          fetchAgents()
        } else {
          const err = await res.json().catch(() => ({}))
          showActionToast({
            title: 'Error al Crear Agente',
            problem: err.problem || err.message || 'No se pudo insertar el agente.',
            actionRequired: err.actionRequired || 'Verifica que el nombre sea único y los datos sean válidos.',
            type: 'error',
          })
        }
      }
    } catch {
      showActionToast({
        title: 'Error de Red',
        problem: 'Fallo al enviar la solicitud al servidor.',
        actionRequired: 'Revisa tu conexión y vuelve a intentar.',
        type: 'error',
      })
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
        setAgents((prev) =>
          prev.map((a) => (a.id === agent.id ? { ...a, isActive: agent.isActive } : a))
        )
        showActionToast({
          title: 'Error de Estado',
          problem: 'No se pudo actualizar el estado del agente en el servidor.',
          actionRequired: 'Reintenta en unos instantes.',
          type: 'error',
        })
      } else {
        showActionToast({
          title: newStatus ? 'Agente Activado' : 'Agente Pausado',
          problem: 'Ninguno.',
          actionRequired: newStatus ? `El agente "${agent.name}" ahora responderá peticiones.` : `El agente "${agent.name}" está en pausa.`,
          type: 'success',
        })
      }
    } catch {
      setAgents((prev) =>
        prev.map((a) => (a.id === agent.id ? { ...a, isActive: agent.isActive } : a))
      )
      showActionToast({
        title: 'Error de Red',
        problem: 'No se pudo conectar con el servidor para actualizar el estado.',
        actionRequired: 'Revisa tu conexión a internet.',
        type: 'error',
      })
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
        showActionToast({
          title: 'Agente Eliminado',
          problem: 'Ninguno.',
          actionRequired: `El agente "${agent.name}" fue removido de Supabase.`,
          type: 'success',
        })
        setAgents((prev) => prev.filter((a) => a.id !== agent.id))
      } else {
        const err = await res.json().catch(() => ({}))
        showActionToast({
          title: 'Error al Eliminar',
          problem: err.problem || err.message || 'No se pudo eliminar el agente.',
          actionRequired: err.actionRequired || 'Verifica que tengas permisos de administrador.',
          type: 'error',
        })
      }
    } catch {
      showActionToast({
        title: 'Error de Red',
        problem: 'No se pudo conectar para eliminar el agente.',
        actionRequired: 'Revisa tu conexión e intenta de nuevo.',
        type: 'error',
      })
    }
  }

  const totalCallsToday = stats?.callsToday ?? agents.reduce((sum, a) => sum + (a.callsToday || 0), 0)
  const remainingQuota = stats?.quotaRemaining ?? Math.max(0, 1500 - totalCallsToday)
  const remainingPercent = `${((remainingQuota / 1500) * 100).toFixed(1)}%`

  return (
    <div id="agents-page" style={{ color: '#f3f4f6' }}>
      {/* View Switcher Bar */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          backgroundColor: '#1b1410',
          border: '1px solid #3d2a1d',
          borderRadius: '8px',
          padding: '4px',
          marginBottom: '1.5rem',
          width: 'fit-content',
        }}
      >
        <button
          onClick={() => setViewMode('office3d')}
          style={{
            background: viewMode === 'office3d' ? '#faae33' : 'transparent',
            color: viewMode === 'office3d' ? '#181008' : '#9ca3af',
            border: 'none',
            borderRadius: '6px',
            padding: '0.45rem 1rem',
            fontSize: '0.8rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          <span>🏛️</span>
          <span>11 Agentes Dropshipping (Oficina 3D)</span>
        </button>

        <button
          onClick={() => setViewMode('classic')}
          style={{
            background: viewMode === 'classic' ? '#faae33' : 'transparent',
            color: viewMode === 'classic' ? '#181008' : '#9ca3af',
            border: 'none',
            borderRadius: '6px',
            padding: '0.45rem 1rem',
            fontSize: '0.8rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          <span>⚡</span>
          <span>Agentes Clásicos de Agencia (CRM)</span>
        </button>
      </div>

      {viewMode === 'office3d' ? (
        <AutonomousOfficeDashboard />
      ) : (
        <>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, color: 'white', marginBottom: '0.375rem' }}>
                Agentes Autónomos de IA
              </h1>
              <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)' }}>
                Configuración, ejecución y monitorización de agentes inteligentes conectados a Supabase y Google Gemini.
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
          background: '#1c1c1c',
          border: '1px solid #2e2e2e',
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
            <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>Free Tier Activo</span>
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
        <div style={{ display: 'flex', gap: '0.5rem', background: '#1c1c1c', padding: '0.25rem', borderRadius: '0.5rem', border: '1px solid #2e2e2e' }}>
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
              background: '#1c1c1c',
              border: '1px solid #2e2e2e',
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
            background: '#1c1c1c',
            border: '1px dashed #333',
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
                background: '#1c1c1c',
                border: agent.isActive ? '1px solid #333333' : '1px solid #282828',
                borderRadius: '1rem',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.2s',
                opacity: agent.isActive ? 1 : 0.75,
                boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid #282828' }}>
                {/* PROBAR AGENTE BUTTON */}
                <button
                  onClick={() => openPlayground(agent)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '0.5rem',
                    background: 'rgba(147, 51, 234, 0.25)',
                    border: '1px solid rgba(147, 51, 234, 0.5)',
                    color: '#e9d5ff',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--color-purple-600)'
                    e.currentTarget.style.color = 'white'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(147, 51, 234, 0.25)'
                    e.currentTarget.style.color = '#e9d5ff'
                  }}
                >
                  💬 Probar Agente
                </button>

                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
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

      {/* LIVE AGENT PLAYGROUND MODAL */}
      {testingAgent && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
          }}
        >
          <div
            style={{
              background: '#181818',
              border: '1px solid #333',
              borderRadius: '1rem',
              width: '100%',
              maxWidth: 680,
              height: '85vh',
              maxHeight: 700,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 60px rgba(0,0,0,0.9)',
              overflow: 'hidden',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '1rem 1.25rem',
                borderBottom: '1px solid #282828',
                background: '#141414',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.1rem' }}>🤖</span>
                  <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'white' }}>
                    Probando Agente: {testingAgent.name}
                  </h2>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '999px',
                      background: 'rgba(147, 51, 234, 0.2)',
                      color: '#d8b4fe',
                      fontWeight: 700,
                    }}
                  >
                    {testingAgent.role}
                  </span>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.2rem' }}>
                  Herramientas activas: {testingAgent.tools.map((t) => `${t}()`).join(', ') || 'Ninguna'}
                </div>
              </div>
              <button
                onClick={() => setTestingAgent(null)}
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '1.25rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            {/* Test Messages Stream */}
            <div
              style={{
                flex: 1,
                padding: '1.25rem',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem',
                background: '#191919',
              }}
            >
              {testMessages.map((m) => {
                const isBot = m.role === 'assistant'
                return (
                  <div
                    key={m.id}
                    style={{
                      display: 'flex',
                      justifyContent: isBot ? 'flex-start' : 'flex-end',
                      alignItems: 'flex-start',
                      gap: '0.6rem',
                    }}
                  >
                    {isBot && (
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: '0.35rem',
                          background: 'linear-gradient(135deg, #7c3aed, #9333ea)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          color: 'white',
                          flexShrink: 0,
                        }}
                      >
                        🤖
                      </div>
                    )}
                    <div
                      style={{
                        maxWidth: '85%',
                        background: isBot ? '#262626' : 'linear-gradient(135deg, #6d28d9, #7c3aed)',
                        border: isBot ? '1px solid #333' : '1px solid rgba(147, 51, 234, 0.4)',
                        borderRadius: '0.75rem',
                        padding: '0.75rem 1rem',
                        color: 'white',
                        fontSize: '0.85rem',
                        lineHeight: 1.5,
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {/* Tool Execution Notification */}
                      {m.toolExecuted && (
                        <div
                          style={{
                            padding: '0.4rem 0.65rem',
                            background: 'rgba(74, 222, 128, 0.12)',
                            border: '1px solid rgba(74, 222, 128, 0.3)',
                            borderRadius: '0.4rem',
                            fontSize: '0.75rem',
                            color: '#4ade80',
                            fontWeight: 600,
                            marginBottom: '0.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <span>✓ Acción Real: <code>{m.toolExecuted.name}()</code></span>
                          {m.toolExecuted.name === 'crm_create_lead' && (
                            <Link href="/dashboard/clients" style={{ color: '#86efac', textDecoration: 'underline' }}>
                              Ver en CRM ➔
                            </Link>
                          )}
                        </div>
                      )}
                      <div>{m.content}</div>
                      <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)', textAlign: 'right', marginTop: '0.35rem' }}>
                        {m.time}
                      </div>
                    </div>
                  </div>
                )
              })}

              {testLoading && (
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', color: '#c084fc', fontSize: '0.8rem' }}>
                  <span className="spinner" style={{ width: 14, height: 14 }} />
                  <span>{testingAgent.name} está procesando y ejecutando acciones...</span>
                </div>
              )}
              <div ref={testEndRef} />
            </div>

            {/* Quick Test Prompt Shortcuts */}
            <div
              style={{
                padding: '0.5rem 1rem',
                borderTop: '1px solid #282828',
                background: '#141414',
                display: 'flex',
                gap: '0.4rem',
                overflowX: 'auto',
              }}
            >
              <button
                onClick={() => sendTestMessage('Crea un lead llamado Carlos Gómez de DentalPro con correo carlos@dentalpro.com')}
                disabled={testLoading}
                style={{
                  whiteSpace: 'nowrap',
                  padding: '0.3rem 0.65rem',
                  borderRadius: '999px',
                  background: '#222',
                  border: '1px solid #333',
                  color: '#4ade80',
                  fontSize: '0.72rem',
                  cursor: 'pointer',
                }}
              >
                ⚡ Probar: Crear Lead en CRM
              </button>
              <button
                onClick={() => sendTestMessage('¿Qué clientes tengo en el CRM?')}
                disabled={testLoading}
                style={{
                  whiteSpace: 'nowrap',
                  padding: '0.3rem 0.65rem',
                  borderRadius: '999px',
                  background: '#222',
                  border: '1px solid #333',
                  color: '#38bdf8',
                  fontSize: '0.72rem',
                  cursor: 'pointer',
                }}
              >
                🔍 Probar: Consultar CRM
              </button>
              <button
                onClick={() => sendTestMessage('¿Cuáles son las tarifas y paquetes de automatización?')}
                disabled={testLoading}
                style={{
                  whiteSpace: 'nowrap',
                  padding: '0.3rem 0.65rem',
                  borderRadius: '999px',
                  background: '#222',
                  border: '1px solid #333',
                  color: '#e9d5ff',
                  fontSize: '0.72rem',
                  cursor: 'pointer',
                }}
              >
                💰 Probar: Tarifas
              </button>
            </div>

            {/* Test Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                sendTestMessage(testInput)
              }}
              style={{
                padding: '0.75rem 1rem',
                borderTop: '1px solid #282828',
                background: '#141414',
                display: 'flex',
                gap: '0.6rem',
              }}
            >
              <input
                type="text"
                placeholder={`Instrucción para ${testingAgent.name}...`}
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
                disabled={testLoading}
                style={{
                  flex: 1,
                  background: '#222',
                  border: '1px solid #333',
                  borderRadius: '0.5rem',
                  padding: '0.6rem 0.85rem',
                  color: 'white',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                disabled={testLoading || !testInput.trim()}
                className="btn btn-primary"
                style={{ padding: '0.6rem 1.1rem', fontSize: '0.85rem' }}
              >
                {testLoading ? '...' : 'Enviar'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Config / Create Modal */}
      {showConfigModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
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
              background: '#181818',
              border: '1px solid #333',
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
                        border: '1px solid #333',
                        background: '#222',
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
                    style={{ width: '100%', padding: '0.6rem 0.8rem', background: '#222', border: '1px solid #333', borderRadius: '0.5rem', color: 'white', fontSize: '0.85rem' }}
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
                    style={{ width: '100%', padding: '0.6rem 0.8rem', background: '#222', border: '1px solid #333', borderRadius: '0.5rem', color: 'white', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.35rem' }}>Modelo LLM</label>
                <select
                  value={formModel}
                  onChange={(e) => setFormModel(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.8rem', background: '#222', border: '1px solid #333', borderRadius: '0.5rem', color: 'white', fontSize: '0.85rem' }}
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
                  style={{ width: '100%', padding: '0.6rem 0.8rem', background: '#222', border: '1px solid #333', borderRadius: '0.5rem', color: 'white', resize: 'vertical', fontSize: '0.85rem' }}
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
                          background: isChecked ? 'rgba(147, 51, 234, 0.2)' : '#222',
                          border: isChecked ? '1px solid rgba(147, 51, 234, 0.5)' : '1px solid #333',
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
                    style={{ width: '100%', padding: '0.6rem 0.8rem', background: '#222', border: '1px solid #333', borderRadius: '0.5rem', color: 'white', fontSize: '0.85rem' }}
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
        </>
      )}

      {/* Ventana Emergente Rectangular de Acciones y Errores (Abajo a la Derecha) */}
      <ActionToast toast={actionToast} onClose={() => setActionToast(null)} />
    </div>
  )
}
