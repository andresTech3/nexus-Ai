'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ActionToast, ActionToastData } from '@/components/ui/ActionToast'

interface ClientOption {
  id: string
  name: string
  company_name: string
}

interface Project {
  id: string
  title: string
  client_id?: string | null
  client?: { id: string; name: string; company_name: string; email: string } | null
  status: 'planning' | 'in_progress' | 'review' | 'completed' | 'cancelled'
  budget_cents: number
  currency: string
  start_date?: string | null
  due_date?: string | null
  description?: string | null
  created_at?: string
}

const statusConfig: Record<string, { label: string; bg: string; text: string; border: string }> = {
  in_progress: { label: 'En curso', bg: 'rgba(168, 85, 247, 0.15)', text: '#c084fc', border: 'rgba(168, 85, 247, 0.3)' },
  review: { label: 'Revisión', bg: 'rgba(34, 211, 238, 0.15)', text: '#38bdf8', border: 'rgba(34, 211, 238, 0.3)' },
  completed: { label: 'Completado', bg: 'rgba(74, 222, 128, 0.15)', text: '#4ade80', border: 'rgba(74, 222, 128, 0.3)' },
  planning: { label: 'Planificación', bg: 'rgba(250, 174, 51, 0.15)', text: '#faae33', border: 'rgba(250, 174, 51, 0.3)' },
  cancelled: { label: 'Cancelado', bg: 'rgba(255, 255, 255, 0.08)', text: 'rgba(255,255,255,0.5)', border: 'rgba(255, 255, 255, 0.15)' },
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [clients, setClients] = useState<ClientOption[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [filter, setFilter] = useState<string>('all')
  const [search, setSearch] = useState<string>('')
  const [showModal, setShowModal] = useState<boolean>(false)
  const [selectedClientId, setSelectedClientId] = useState<string>('')
  const [actionToast, setActionToast] = useState<ActionToastData | null>(null)
  const [newProject, setNewProject] = useState({
    title: '',
    clientName: '',
    budget: '',
    dueDate: '',
    description: '',
    status: 'in_progress' as const,
  })

  // Cargar proyectos y clientes desde la base de datos
  useEffect(() => {
    async function loadData() {
      try {
        const [projRes, cliRes] = await Promise.all([
          fetch('/api/v1/projects?page=1&pageSize=50'),
          fetch('/api/v1/crm/clients?page=1&pageSize=100'),
        ])

        if (projRes.ok) {
          const pJson = await projRes.json()
          setProjects(pJson.data || [])
        }

        if (cliRes.ok) {
          const cJson = await cliRes.json()
          setClients(cJson.data || [])
        }
      } catch (err) {
        console.error('Error cargando proyectos o clientes:', err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const filteredProjects = projects.filter((p) => {
    const matchesFilter = filter === 'all' || p.status === filter
    const clientName = p.client?.name || p.client?.company_name || ''
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      clientName.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()

    // 1. Validación de Título
    if (!newProject.title.trim() || newProject.title.trim().length < 2) {
      setActionToast({
        title: 'Título de Proyecto Obligatorio',
        problem: 'El proyecto no tiene título o tiene menos de 2 caracteres.',
        actionRequired: 'Escribe un nombre descriptivo para el entregable o proyecto.',
        type: 'error',
      })
      return
    }

    // 2. Validación de Cliente
    if (!selectedClientId && !newProject.clientName.trim()) {
      setActionToast({
        title: 'Cliente Asociado Obligatorio',
        problem: 'No has seleccionado un cliente existente ni ingresado una empresa destinataria.',
        actionRequired: 'Selecciona un cliente del menú o escribe el nombre del cliente en el formulario.',
        type: 'error',
      })
      return
    }

    // 3. Validación de Fecha (tipo date estricto AAAA-MM-DD)
    if (newProject.dueDate && !/^\d{4}-\d{2}-\d{2}$/.test(newProject.dueDate)) {
      setActionToast({
        title: 'Fecha de Entrega Inválida',
        problem: 'El formato de fecha no cumple con el estándar estricto AAAA-MM-DD.',
        actionRequired: 'Selecciona una fecha válida con el selector de calendario.',
        type: 'error',
      })
      return
    }

    // 4. Validación de Presupuesto
    const cleanBudget = newProject.budget ? parseFloat(newProject.budget.replace(/[^0-9.]/g, '')) : 0
    if (newProject.budget && (isNaN(cleanBudget) || cleanBudget < 0)) {
      setActionToast({
        title: 'Presupuesto Inválido',
        problem: 'El valor de presupuesto ingresado no es un número válido o es menor a cero.',
        actionRequired: 'Ingresa una cifra numérica válida (ejemplo: 2500).',
        type: 'error',
      })
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        title: newProject.title.trim(),
        clientId: selectedClientId || undefined,
        clientName: !selectedClientId ? newProject.clientName.trim() : undefined,
        budget: cleanBudget,
        currency: 'USD',
        dueDate: newProject.dueDate || undefined,
        description: newProject.description ? newProject.description.trim() : undefined,
        status: newProject.status,
      }

      const res = await fetch('/api/v1/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        const json = await res.json()
        setProjects([json.data, ...projects])
        setShowModal(false)
        setNewProject({ title: '', clientName: '', budget: '', dueDate: '', description: '', status: 'in_progress' })
        setSelectedClientId('')
        setActionToast({
          title: 'Proyecto Creado Exitosamente',
          problem: 'Ninguno. Datos validados correctamente en Supabase.',
          actionRequired: 'El proyecto ya se encuentra registrado y visible en tu panel de control.',
          type: 'success',
        })
      } else {
        const errJson = await res.json().catch(() => ({}))
        setActionToast({
          title: 'Error al Crear Proyecto',
          problem: errJson.problem || errJson.message || 'Error en la base de datos.',
          actionRequired: errJson.actionRequired || 'Verifica los campos del formulario y vuelve a intentarlo.',
          type: 'error',
        })
      }
    } catch {
      setActionToast({
        title: 'Error de Red',
        problem: 'No se pudo conectar con el servidor para registrar el proyecto.',
        actionRequired: 'Revisa tu conexión a internet y vuelve a intentar.',
        type: 'error',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const formatBudget = (cents: number, currency: string) => {
    const amount = (cents || 0) / 100
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency || 'USD', maximumFractionDigits: 0 }).format(amount)
  }

  return (
    <div id="projects-page">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, color: 'white', marginBottom: '0.375rem' }}>
            Proyectos & Entregables
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)' }}>
            Supervisa avances, clientes asociados y entregables de IA persistidos en la base de datos.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary"
          id="btn-create-project"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <span>+</span> Crear Proyecto
        </button>
      </div>

      {/* Filters and Search Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
          padding: '1rem',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(147,51,234,0.15)',
          borderRadius: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'Todos' },
            { id: 'in_progress', label: 'En curso' },
            { id: 'review', label: 'Revisión' },
            { id: 'planning', label: 'Planificación' },
            { id: 'completed', label: 'Completado' },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setFilter(st.id)}
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: '0.5rem',
                fontSize: '0.8125rem',
                fontWeight: 600,
                border: filter === st.id ? '1px solid var(--color-purple-500)' : '1px solid transparent',
                background: filter === st.id ? 'rgba(147,51,234,0.2)' : 'transparent',
                color: filter === st.id ? '#e9d5ff' : 'rgba(255,255,255,0.6)',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {st.label}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Buscar por proyecto o cliente..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '0.5rem',
            padding: '0.5rem 0.875rem',
            color: 'white',
            fontSize: '0.85rem',
            width: '280px',
            outline: 'none',
          }}
        />
      </div>

      {/* Projects Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
        {loading ? (
          <div style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
            Cargando proyectos desde Supabase...
          </div>
        ) : filteredProjects.length === 0 ? (
          <div
            style={{
              gridColumn: '1 / -1',
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
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem', opacity: 0.7 }}>📁</div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f3f4f6', marginBottom: '0.5rem' }}>
              {projects.length === 0 ? 'No tienes proyectos registrados todavía' : 'No se encontraron proyectos con ese filtro'}
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', maxWidth: '420px', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              {projects.length === 0
                ? 'Empieza creando tu primer proyecto para gestionar entregables, plazos de entrega y presupuestos reales.'
                : 'Prueba cambiando los términos de búsqueda o el filtro de estado.'}
            </p>
            {projects.length === 0 && (
              <button
                onClick={() => setShowModal(true)}
                className="btn btn-primary"
                style={{ padding: '0.65rem 1.4rem', fontSize: '0.875rem' }}
              >
                + Crear Primer Proyecto
              </button>
            )}
          </div>
        ) : (
          filteredProjects.map((p) => {
            const st = statusConfig[p.status] || statusConfig.planning
            const clientDisplay = p.client?.company_name || p.client?.name || 'Cliente sin asignar'
            return (
              <div
                key={p.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(147, 51, 234, 0.15)',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, border-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(147, 51, 234, 0.4)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(147, 51, 234, 0.15)'
                  e.currentTarget.style.transform = 'none'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <span
                    style={{
                      padding: '0.2rem 0.6rem',
                      borderRadius: '9999px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      background: st.bg,
                      color: st.text,
                      border: `1px solid ${st.border}`,
                    }}
                  >
                    {st.label}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>
                    {p.due_date ? `Entrega: ${p.due_date}` : 'Sin plazo fijado'}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', marginBottom: '0.25rem' }}>
                  {p.title}
                </h3>
                <div style={{ fontSize: '0.8125rem', color: 'var(--color-purple-400)', marginBottom: '0.75rem', fontWeight: 500 }}>
                  🏢 {clientDisplay}
                </div>

                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5, marginBottom: '1.25rem', flex: 1 }}>
                  {p.description || 'Sin descripción detallada.'}
                </p>

                {/* Footer info */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Presupuesto: </span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#4ade80' }}>
                      {formatBudget(p.budget_cents, p.currency)}
                    </span>
                  </div>
                  <Link
                    href="/dashboard/tasks"
                    style={{
                      fontSize: '0.8rem',
                      color: 'var(--color-purple-400)',
                      textDecoration: 'none',
                      fontWeight: 600,
                    }}
                  >
                    Ver Tareas →
                  </Link>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Modal Crear Proyecto */}
      {showModal && (
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
              maxWidth: 520,
              padding: '2rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white' }}>Nuevo Proyecto de Agencia</h2>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '1.25rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProject}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.35rem' }}>
                  Nombre del Proyecto *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Agente de Soporte WhatsApp para Clínica"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.8rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: 'white' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.35rem' }}>
                  Cliente Asociado
                </label>
                {clients.length > 0 ? (
                  <select
                    value={selectedClientId}
                    onChange={(e) => {
                      setSelectedClientId(e.target.value)
                      if (e.target.value) setNewProject({ ...newProject, clientName: '' })
                    }}
                    style={{ width: '100%', padding: '0.6rem 0.8rem', background: '#12121c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: 'white', marginBottom: '0.5rem' }}
                  >
                    <option value="">-- Seleccionar cliente existente o escribir nuevo --</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} {c.company_name ? `(${c.company_name})` : ''}
                      </option>
                    ))}
                  </select>
                ) : null}

                {!selectedClientId && (
                  <input
                    type="text"
                    placeholder="O escribe el nombre de un nuevo cliente/empresa..."
                    value={newProject.clientName}
                    onChange={(e) => setNewProject({ ...newProject, clientName: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.8rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: 'white' }}
                  />
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.35rem' }}>Presupuesto (USD)</label>
                  <input
                    type="number"
                    step="50"
                    placeholder="Ej. 3500"
                    value={newProject.budget}
                    onChange={(e) => setNewProject({ ...newProject, budget: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.8rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: 'white' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.35rem' }}>Fecha de Entrega</label>
                  <input
                    type="date"
                    value={newProject.dueDate}
                    onChange={(e) => setNewProject({ ...newProject, dueDate: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.8rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: 'white' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.35rem' }}>Alcance y Objetivos</label>
                <textarea
                  rows={3}
                  placeholder="Descripción de los requerimientos y módulos a entregar..."
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.8rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: 'white', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{ padding: '0.6rem 1.2rem', borderRadius: '0.5rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white', cursor: 'pointer' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary"
                  style={{ padding: '0.6rem 1.2rem' }}
                >
                  {submitting ? 'Guardando...' : 'Guardar Proyecto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Ventana emergente rectangular abajo a la derecha */}
      <ActionToast toast={actionToast} onClose={() => setActionToast(null)} />
    </div>
  )
}
