'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Project {
  id: string
  name: string
  client: string
  status: 'En curso' | 'Revisión' | 'Completado' | 'Pendiente'
  progress: number
  dueDate: string
  budget: string
  priority: 'Alta' | 'Media' | 'Baja'
  description: string
}

const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    name: 'Automatización E-commerce RetailMax',
    client: 'RetailMax S.A.',
    status: 'En curso',
    progress: 75,
    dueDate: '28 Oct 2026',
    budget: '$4,200',
    priority: 'Alta',
    description: 'Integración de agentes para atención al cliente y gestión de inventario en tiempo real.',
  },
  {
    id: 'proj-2',
    name: 'Chatbot Multicanal Soporte TechCo',
    client: 'TechCo Global',
    status: 'Revisión',
    progress: 90,
    dueDate: '22 Oct 2026',
    budget: '$3,800',
    priority: 'Alta',
    description: 'Bot de WhatsApp y Web con IA de Gemini conectado a base de conocimiento documental.',
  },
  {
    id: 'proj-3',
    name: 'Dashboard Analytics & IA BrandGrow',
    client: 'BrandGrow Marketing',
    status: 'En curso',
    progress: 45,
    dueDate: '15 Nov 2026',
    budget: '$6,500',
    priority: 'Media',
    description: 'Panel de métricas con predicción de retención de clientes mediante IA generativa.',
  },
  {
    id: 'proj-4',
    name: 'Automatización de Facturas & CRM',
    client: 'SaaS Solutions',
    status: 'Pendiente',
    progress: 10,
    dueDate: '30 Nov 2026',
    budget: '$2,900',
    priority: 'Baja',
    description: 'Flujo n8n auto-hospedado para procesar facturas PDF con OCR y alimentar el CRM.',
  },
]

const statusStyles = {
  'En curso': { bg: 'rgba(168, 85, 247, 0.15)', text: '#c084fc', border: 'rgba(168, 85, 247, 0.3)' },
  'Revisión': { bg: 'rgba(34, 211, 238, 0.15)', text: '#38bdf8', border: 'rgba(34, 211, 238, 0.3)' },
  'Completado': { bg: 'rgba(74, 222, 128, 0.15)', text: '#4ade80', border: 'rgba(74, 222, 128, 0.3)' },
  'Pendiente': { bg: 'rgba(255, 255, 255, 0.08)', text: 'rgba(255,255,255,0.6)', border: 'rgba(255, 255, 255, 0.15)' },
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS)
  const [filter, setFilter] = useState<string>('Todos')
  const [search, setSearch] = useState<string>('')
  const [showModal, setShowModal] = useState<boolean>(false)
  const [newProject, setNewProject] = useState({
    name: '',
    client: '',
    budget: '',
    dueDate: '',
    description: '',
    priority: 'Media' as const,
  })

  const filteredProjects = projects.filter((p) => {
    const matchesFilter = filter === 'Todos' || p.status === filter
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.client.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProject.name || !newProject.client) return

    const created: Project = {
      id: `proj-${Date.now()}`,
      name: newProject.name,
      client: newProject.client,
      budget: newProject.budget || '$3,000',
      dueDate: newProject.dueDate || '30 Nov 2026',
      priority: newProject.priority,
      status: 'En curso',
      progress: 0,
      description: newProject.description || 'Proyecto creado desde el panel.',
    }

    setProjects([created, ...projects])
    setShowModal(false)
    setNewProject({ name: '', client: '', budget: '', dueDate: '', description: '', priority: 'Media' })
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
            Supervisa avances, plazos y entregables de automatización para cada cliente.
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
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['Todos', 'En curso', 'Revisión', 'Completado', 'Pendiente'].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: '0.5rem',
                fontSize: '0.8125rem',
                fontWeight: 600,
                border: filter === st ? '1px solid var(--color-purple-500)' : '1px solid transparent',
                background: filter === st ? 'rgba(147,51,234,0.2)' : 'transparent',
                color: filter === st ? '#e9d5ff' : 'rgba(255,255,255,0.6)',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {st}
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
        {filteredProjects.map((p) => {
          const st = statusStyles[p.status]
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
                  {p.status}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>
                  Entrega: {p.dueDate}
                </span>
              </div>

              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', marginBottom: '0.25rem' }}>
                {p.name}
              </h3>
              <div style={{ fontSize: '0.8125rem', color: 'var(--color-purple-400)', marginBottom: '0.75rem', fontWeight: 500 }}>
                {p.client}
              </div>

              <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5, marginBottom: '1.25rem', flex: 1 }}>
                {p.description}
              </p>

              {/* Progress bar */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.35rem' }}>
                  <span>Progreso de entregables</span>
                  <span style={{ color: 'white', fontWeight: 600 }}>{p.progress}%</span>
                </div>
                <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${p.progress}%`,
                      background: 'linear-gradient(90deg, #9333ea, #c084fc)',
                      borderRadius: 3,
                      transition: 'width 0.4s ease',
                    }}
                  />
                </div>
              </div>

              {/* Footer info */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Presupuesto: </span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#4ade80' }}>{p.budget}</span>
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
        })}
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
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.35rem' }}>Nombre del Proyecto</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Agente de Soporte WhatsApp para Clínica"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.8rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: 'white' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.35rem' }}>Cliente</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Clínica Dental Sonrisas S.L."
                  value={newProject.client}
                  onChange={(e) => setNewProject({ ...newProject, client: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.8rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: 'white' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.35rem' }}>Presupuesto Estimado</label>
                  <input
                    type="text"
                    placeholder="Ej. $3,500"
                    value={newProject.budget}
                    onChange={(e) => setNewProject({ ...newProject, budget: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.8rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: 'white' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.35rem' }}>Fecha de Entrega</label>
                  <input
                    type="text"
                    placeholder="Ej. 15 Dic 2026"
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
                  className="btn btn-primary"
                  style={{ padding: '0.6rem 1.2rem' }}
                >
                  Guardar Proyecto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
