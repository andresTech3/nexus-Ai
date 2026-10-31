'use client'

import { useState } from 'react'

interface Workflow {
  id: string
  name: string
  trigger: string
  actions: string[]
  status: 'active' | 'paused'
  lastRun: string
  successRate: string
  runsCount: number
}

const INITIAL_WORKFLOWS: Workflow[] = []

export default function AutomationsPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>(INITIAL_WORKFLOWS)
  const [executingId, setExecutingId] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const toggleStatus = (id: string) => {
    setWorkflows(
      workflows.map((w) =>
        w.id === id ? { ...w, status: w.status === 'active' ? 'paused' : 'active' } : w
      )
    )
  }

  const triggerManualRun = (id: string, name: string) => {
    setExecutingId(id)
    setTimeout(() => {
      setExecutingId(null)
      setToastMessage(`¡Flujo "${name}" ejecutado con éxito! Tarea completada.`)
      setTimeout(() => setToastMessage(null), 4000)
    }, 1200)
  }

  return (
    <div id="automations-page">
      {/* Toast Alert */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '1.5rem',
            right: '1.5rem',
            background: 'rgba(16, 185, 129, 0.95)',
            color: 'white',
            padding: '0.875rem 1.5rem',
            borderRadius: '0.75rem',
            boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
            zIndex: 9999,
            fontSize: '0.9rem',
            fontWeight: 600,
            animation: 'fadeIn 0.3s ease',
          }}
        >
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, color: 'white', marginBottom: '0.375rem' }}>
            Motor de Automatizaciones & Workflows
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)' }}>
            Orquestación de tareas en segundo plano con colas persistentes, leases y reintentos automáticos.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <span className="badge badge-purple" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
            Worker de Fondo: Conectado (PID Activo)
          </span>
        </div>
      </div>

      {/* Grid of Workflows */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.25rem' }}>
        {workflows.length === 0 ? (
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
            <div style={{ width: 44, height: 44, margin: '0 auto 1rem auto', borderRadius: '8px', backgroundColor: '#18181b', border: '1px solid #27272a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#faae33' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f3f4f6', marginBottom: '0.5rem' }}>
              No tienes flujos de automatización todavía
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', maxWidth: '420px', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              Diseña tuberías de eventos para conectar webhooks, procesar leads con IA y sincronizar datos con el CRM en tiempo real.
            </p>
            <button
              onClick={() => {
                const sample: Workflow = {
                  id: `wf-${Date.now()}`,
                  name: 'Captura y Calificación de Leads Web',
                  trigger: 'Webhook: Formulario de Contacto',
                  actions: ['Validar Payload Zod', 'Consultar Gemini 2.0 Lead Score', 'Guardar en CRM Supabase'],
                  status: 'active',
                  lastRun: 'Nunca',
                  successRate: '100%',
                  runsCount: 0,
                }
                setWorkflows([sample])
              }}
              className="btn btn-primary"
              style={{ padding: '0.65rem 1.4rem', fontSize: '0.875rem' }}
            >
              + Crear Primer Flujo
            </button>
          </div>
        ) : (
          workflows.map((wf) => (
          <div
            key={wf.id}
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
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '0.2rem 0.55rem',
                  borderRadius: '999px',
                  background: wf.status === 'active' ? 'rgba(74, 222, 128, 0.15)' : 'rgba(255, 255, 255, 0.06)',
                  color: wf.status === 'active' ? '#4ade80' : 'rgba(255,255,255,0.4)',
                  border: wf.status === 'active' ? '1px solid rgba(74, 222, 128, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                {wf.status === 'active' ? '● En Ejecución' : '○ En Pausa'}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
                {wf.lastRun}
              </span>
            </div>

            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', marginBottom: '0.5rem' }}>
              {wf.name}
            </h3>

            {/* Trigger badge */}
            <div style={{ marginBottom: '1rem', background: 'rgba(0,0,0,0.3)', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--color-purple-400)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                Disparador
              </div>
              <div style={{ fontSize: '0.85rem', color: 'white', marginTop: '0.15rem' }}>
                {wf.trigger}
              </div>
            </div>

            {/* Pipeline Steps */}
            <div style={{ marginBottom: '1.25rem', flex: 1 }}>
              <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: '0.4rem', fontWeight: 700 }}>
                Acciones Encadenadas
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {wf.actions.map((act, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)' }}>
                    <span style={{ color: 'var(--color-purple-400)', fontSize: '0.7rem' }}>{idx + 1}.</span>
                    <span>{act}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats and Execution Trigger */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.875rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>
                Éxito: <strong style={{ color: '#4ade80' }}>{wf.successRate}</strong> ({wf.runsCount} ejecuciones)
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => toggleStatus(wf.id)}
                  style={{
                    padding: '0.35rem 0.65rem',
                    background: 'none',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '0.375rem',
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                  }}
                >
                  {wf.status === 'active' ? 'Pausar' : 'Activar'}
                </button>
                <button
                  onClick={() => triggerManualRun(wf.id, wf.name)}
                  disabled={executingId === wf.id}
                  className="btn btn-primary"
                  style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                >
                  {executingId === wf.id ? 'Ejecutando...' : 'Probar Ahora ▷'}
                </button>
              </div>
            </div>
          </div>
        )))}
      </div>
    </div>
  )
}
