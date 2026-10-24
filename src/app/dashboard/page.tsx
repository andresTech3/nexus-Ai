'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Project {
  id: string
  name: string
  status: 'En curso' | 'Revisión' | 'Pendiente' | 'Completado'
  progress: number
  client: string
  dueDate: string
}

const INITIAL_METRICS = [
  { id: 'metric-projects', label: 'Proyectos activos', value: '0', change: 'Sin proyectos aún', positive: true, icon: '◈' },
  { id: 'metric-clients', label: 'Clientes totales', value: '0', change: 'Sin clientes aún', positive: true, icon: '◎' },
  { id: 'metric-ai-calls', label: 'Llamadas IA hoy', value: '0', change: '0 peticiones', positive: true, icon: '⚡' },
  { id: 'metric-revenue', label: 'Ingresos del mes', value: '$0.00', change: 'Sin facturación aún', positive: true, icon: '$' },
]

const statusColors: Record<string, string> = {
  'En curso': 'var(--color-tiger-gold)',
  'Revisión': '#22d3ee',
  'Pendiente': 'rgba(255,255,255,0.4)',
  'Completado': '#4ade80',
}

export default function DashboardPage() {
  const [metrics] = useState(INITIAL_METRICS)
  const [recentProjects] = useState<Project[]>([]) // Vacío por defecto para nuevos usuarios

  return (
    <div id="dashboard-overview">
      {/* Header */}
      <div className="dashboard-header" id="dashboard-header">
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-tiger-gold)', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
            Panel de Control
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)' }}>
            Bienvenido a tu suite de Agencia IA. Todo tu entorno está listo y configurado.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="badge badge-secondary" style={{ fontSize: '11px' }}>
            {new Date().toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase()}
          </div>
          <Link href="/dashboard/projects" className="btn btn-primary btn-sm" id="new-project-btn">
            + Nuevo proyecto
          </Link>
        </div>
      </div>

      {/* Metrics */}
      <div className="dashboard-grid" id="metrics-grid">
        {metrics.map((metric) => (
          <div key={metric.id} className="metric-card" id={metric.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <div className="metric-label">{metric.label}</div>
              <div style={{
                width: 32,
                height: 32,
                background: 'var(--surface-charred-core)',
                border: '1px solid var(--color-cardamom-brown)',
                borderRadius: '9999px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.875rem',
                color: 'var(--color-tiger-gold)',
              }}>
                {metric.icon}
              </div>
            </div>
            <div className="metric-value">{metric.value}</div>
            <div className={`metric-change ${!metric.positive ? 'negative' : ''}`} style={{ color: 'rgba(250, 174, 51, 0.7)' }}>
              {metric.change}
            </div>
          </div>
        ))}
      </div>

      {/* Projects Container */}
      <div
        style={{
          background: 'var(--surface-spice-card)',
          border: '1px solid var(--color-cardamom-brown)',
          borderRadius: '12px',
          overflow: 'hidden',
          marginBottom: '2rem',
        }}
        id="projects-table-container"
      >
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px dotted var(--color-cardamom-brown)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-tiger-gold)', textTransform: 'uppercase' }}>
            Proyectos Recientes
          </h2>
          <Link href="/dashboard/projects" id="view-all-projects" style={{ fontSize: '0.8125rem', color: 'var(--color-tiger-gold)', fontWeight: 600 }}>
            Ver todos →
          </Link>
        </div>

        {recentProjects.length === 0 ? (
          <div style={{ padding: '3.5rem 1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--color-tiger-gold)' }}>◈</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.5rem' }}>
              No tienes proyectos activos todavía
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.65)', maxWidth: '420px', margin: '0 auto 1.5rem', lineHeight: 1.5 }}>
              Tu panel está completamente listo. Comienza agregando tu primer cliente o creando un proyecto con agentes de IA.
            </p>
            <Link href="/dashboard/projects" className="btn btn-primary btn-sm">
              + Crear Primer Proyecto
            </Link>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }} id="projects-table">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  {['Proyecto', 'Cliente', 'Estado', 'Progreso', 'Entrega'].map((h) => (
                    <th key={h} style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentProjects.map((project) => (
                  <tr
                    key={project.id}
                    id={`project-row-${project.id}`}
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}
                  >
                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.9375rem', color: 'white', fontWeight: 500 }}>
                      {project.name}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)' }}>
                      {project.client}
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.375rem',
                        padding: '0.25rem 0.625rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: `${statusColors[project.status]}20`,
                        color: statusColors[project.status],
                        border: `1px solid ${statusColors[project.status]}40`,
                      }}>
                        {project.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', width: 160 }}>
                      <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>
                        {project.progress}%
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.8125rem', color: 'rgba(255,255,255,0.4)' }}>
                      {project.dueDate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick actions row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }} id="quick-actions">
        {[
          { id: 'qa-new-client', label: 'Clientes CRM', icon: '◎', href: '/dashboard/clients' },
          { id: 'qa-new-quote', label: 'Cotizaciones', icon: '$', href: '/dashboard/quotes' },
          { id: 'qa-new-agent', label: 'Agentes IA', icon: '⚡', href: '/dashboard/agents' },
          { id: 'qa-view-reports', label: 'Ver informes', icon: '▤', href: '/dashboard/reports' },
        ].map((action) => (
          <Link
            key={action.id}
            href={action.href}
            id={action.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '1rem 1.25rem',
              background: 'var(--surface-charred-core)',
              border: '1px solid var(--color-cardamom-brown)',
              borderRadius: '8px',
              color: '#ffffff',
              fontSize: '0.875rem',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'border-color 150ms',
            }}
          >
            <span style={{ fontSize: '1.125rem', color: 'var(--color-tiger-gold)' }}>{action.icon}</span>
            {action.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
