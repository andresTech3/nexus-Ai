'use client'

import { useState } from 'react'

interface Task {
  id: string
  title: string
  project: string
  status: 'todo' | 'in_progress' | 'review' | 'done'
  priority: 'Baja' | 'Media' | 'Alta' | 'Urgente'
  assignee: string
  dueDate: string
}

const INITIAL_TASKS: Task[] = [
  {
    id: 't-1',
    title: 'Configurar Webhook de Shopify con Agente IA',
    project: 'RetailMax E-commerce',
    status: 'in_progress',
    priority: 'Alta',
    assignee: 'Andrés N.',
    dueDate: '25 Oct',
  },
  {
    id: 't-2',
    title: 'Crear System Prompt con restricciones de catálogo',
    project: 'TechCo Chatbot',
    status: 'review',
    priority: 'Alta',
    assignee: 'Carlos M.',
    dueDate: '22 Oct',
  },
  {
    id: 't-3',
    title: 'Subir documentos PDF a Base de Conocimiento RAG',
    project: 'TechCo Chatbot',
    status: 'done',
    priority: 'Media',
    assignee: 'Andrés N.',
    dueDate: '20 Oct',
  },
  {
    id: 't-4',
    title: 'Diseñar Dashboard de KPIs en tiempo real',
    project: 'BrandGrow Marketing',
    status: 'in_progress',
    priority: 'Media',
    assignee: 'Laura P.',
    dueDate: '29 Oct',
  },
  {
    id: 't-5',
    title: 'Instalar worker asíncrono para colas de tareas',
    project: 'Core Platform',
    status: 'todo',
    priority: 'Urgente',
    assignee: 'Dev Team',
    dueDate: '26 Oct',
  },
]

const COLUMNS = [
  { id: 'todo', label: 'Por Hacer', color: '#94a3b8' },
  { id: 'in_progress', label: 'En Progreso', color: '#a855f7' },
  { id: 'review', label: 'En Revisión', color: '#38bdf8' },
  { id: 'done', label: 'Completado', color: '#4ade80' },
]

const priorityColors: Record<string, string> = {
  Baja: '#94a3b8',
  Media: '#38bdf8',
  Alta: '#f59e0b',
  Urgente: '#ef4444',
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS)
  const [showModal, setShowModal] = useState(false)
  const [newTask, setNewTask] = useState({
    title: '',
    project: 'RetailMax E-commerce',
    priority: 'Alta' as const,
    assignee: 'Andrés N.',
    dueDate: '30 Oct',
  })

  const moveTask = (taskId: string, newStatus: Task['status']) => {
    setTasks(tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)))
  }

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTask.title) return
    const created: Task = {
      id: `t-${Date.now()}`,
      title: newTask.title,
      project: newTask.project,
      status: 'todo',
      priority: newTask.priority,
      assignee: newTask.assignee,
      dueDate: newTask.dueDate,
    }
    setTasks([...tasks, created])
    setShowModal(false)
    setNewTask({ title: '', project: 'RetailMax E-commerce', priority: 'Alta', assignee: 'Andrés N.', dueDate: '30 Oct' })
  }

  return (
    <div id="tasks-page">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, color: 'white', marginBottom: '0.375rem' }}>
            Tablero de Tareas & Entregables
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)' }}>
            Supervisión Kanban del pipeline de desarrollo, automatizaciones e integraciones.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary"
          id="btn-create-task"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <span>+</span> Nueva Tarea
        </button>
      </div>

      {/* Kanban Board */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(260px, 1fr))', gap: '1rem', alignItems: 'flex-start', overflowX: 'auto', paddingBottom: '1rem' }}>
        {COLUMNS.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.id)
          return (
            <div
              key={col.id}
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(147, 51, 234, 0.15)',
                borderRadius: '0.875rem',
                padding: '1rem',
                minHeight: '480px',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Column Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: col.color }} />
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'white' }}>{col.label}</span>
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.06)', padding: '0.15rem 0.5rem', borderRadius: '999px' }}>
                  {colTasks.length}
                </span>
              </div>

              {/* Task Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                {colTasks.map((task) => (
                  <div
                    key={task.id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '0.625rem',
                      padding: '1rem',
                      transition: 'border-color 0.15s, transform 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(147, 51, 234, 0.4)'
                      e.currentTarget.style.transform = 'translateY(-2px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'
                      e.currentTarget.style.transform = 'none'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '0.15rem 0.45rem',
                          borderRadius: '0.25rem',
                          background: `${priorityColors[task.priority]}15`,
                          color: priorityColors[task.priority],
                          border: `1px solid ${priorityColors[task.priority]}30`,
                        }}
                      >
                        {task.priority}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>
                        {task.dueDate}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'white', marginBottom: '0.35rem', lineHeight: 1.4 }}>
                      {task.title}
                    </h4>

                    <div style={{ fontSize: '0.75rem', color: 'var(--color-purple-400)', marginBottom: '0.75rem' }}>
                      {task.project}
                    </div>

                    {/* Bottom controls */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                      <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)' }}>
                        👤 {task.assignee}
                      </span>

                      {/* Move selector */}
                      <select
                        value={task.status}
                        onChange={(e) => moveTask(task.id, e.target.value as Task['status'])}
                        style={{
                          background: 'rgba(0,0,0,0.4)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          color: 'rgba(255,255,255,0.7)',
                          fontSize: '0.7rem',
                          padding: '0.2rem 0.4rem',
                          borderRadius: '0.25rem',
                          cursor: 'pointer',
                        }}
                      >
                        <option value="todo">Por Hacer</option>
                        <option value="in_progress">En Progreso</option>
                        <option value="review">Revisión</option>
                        <option value="done">Completado</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal Nueva Tarea */}
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
              maxWidth: 480,
              padding: '2rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white' }}>Nueva Tarea</h2>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '1.25rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.35rem' }}>Título de la Tarea</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Entrenar agente con FAQ del cliente"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.8rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: 'white' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.35rem' }}>Proyecto Relacionado</label>
                <select
                  value={newTask.project}
                  onChange={(e) => setNewTask({ ...newTask, project: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.8rem', background: '#12121c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: 'white' }}
                >
                  <option value="RetailMax E-commerce">RetailMax E-commerce</option>
                  <option value="TechCo Chatbot">TechCo Chatbot</option>
                  <option value="BrandGrow Marketing">BrandGrow Marketing</option>
                  <option value="Core Platform">Core Platform</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.35rem' }}>Prioridad</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                    style={{ width: '100%', padding: '0.6rem 0.8rem', background: '#12121c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: 'white' }}
                  >
                    <option value="Baja">Baja</option>
                    <option value="Media">Media</option>
                    <option value="Alta">Alta</option>
                    <option value="Urgente">Urgente</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.35rem' }}>Fecha Límite</label>
                  <input
                    type="text"
                    placeholder="Ej. 28 Oct"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.8rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: 'white' }}
                  />
                </div>
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
                  Crear Tarea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
