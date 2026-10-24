'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Project {
  id: string
  title: string
  status: 'planning' | 'in_progress' | 'review' | 'completed' | 'cancelled'
  client?: { name?: string; company_name?: string } | null
  budget_cents?: number
  currency?: string
  due_date?: string | null
}

const statusMap: Record<string, { label: string; color: string }> = {
  in_progress: { label: 'En curso', color: 'var(--color-tiger-gold)' },
  review: { label: 'Revisión', color: '#22d3ee' },
  planning: { label: 'Planificación', color: 'rgba(250, 174, 51, 0.9)' },
  completed: { label: 'Completado', color: '#4ade80' },
  cancelled: { label: 'Cancelado', color: 'rgba(255,255,255,0.4)' },
}

export default function DashboardPage() {
  const [projectsCount, setProjectsCount] = useState<number>(0)
  const [clientsCount, setClientsCount] = useState<number>(0)
  const [revenueTotal, setRevenueTotal] = useState<number>(0)
  const [recentProjects, setRecentProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    async function loadOverview() {
      try {
        const [projRes, cliRes] = await Promise.all([
          fetch('/api/v1/projects?page=1&pageSize=5'),
          fetch('/api/v1/crm/clients?page=1&pageSize=1'),
        ])

        if (projRes.ok) {
          const pJson = await projRes.json()
          setProjectsCount(pJson.pagination?.total || 0)
          setRecentProjects(pJson.data || [])

          // Calcular presupuesto acumulado
          const totalCents = (pJson.data || []).reduce((acc: number, p: any) => acc + (p.budget_cents || 0), 0)
          setRevenueTotal(totalCents / 100)
        }

        if (cliRes.ok) {
          const cJson = await cliRes.json()
          setClientsCount(cJson.pagination?.total || 0)
        }
      } catch (err) {
        console.error('Error cargando métricas:', err)
      } finally {
        setLoading(false)
      }
    }

    loadOverview()
  }, [])

  const metrics = [
    {
      id: 'metric-projects',
      label: 'Proyectos activos',
      value: loading ? '...' : String(projectsCount),
      change: projectsCount > 0 ? `${projectsCount} registrados` : 'Sin proyectos aún',
      positive: projectsCount > 0,
      icon: '◈',
    },
    {
      id: 'metric-clients',
      label: 'Clientes totales',
      value: loading ? '...' : String(clientsCount),
      change: clientsCount > 0 ? `${clientsCount} en directorio` : 'Sin clientes aún',
      positive: clientsCount > 0,
      icon: '◎',
    },
    {
      id: 'metric-ai-calls',
      label: 'Llamadas IA hoy',
      value: '0',
      change: '0 peticiones',
      positive: true,
      icon: '⚡',
    },
    {
      id: 'metric-revenue',
      label: 'Presupuesto Proyectos',
      value: loading ? '...' : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(revenueTotal),
      change: revenueTotal > 0 ? 'En proyectos activos' : 'Sin facturación aún',
      positive: revenueTotal > 0,
      icon: '$',
    },
  ]

  return (
    <div id="dashboard-overview">
      {/* Header */}
      <div className="dashboard-header" id="dashboard-header">
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-tiger-gold)', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
            Panel de Control
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)' }}>
            Bienvenido a tu suite de Agencia IA. Todo tu entorno está listo y sincronizado en tiempo real.
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
            Ver todos ({projectsCount}) →
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
                  {['Proyecto', 'Cliente', 'Estado', 'Presupuesto', 'Plazo'].map((h) => (
                    <th key={h} style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentProjects.map((project) => {
                  const st = statusMap[project.status] || statusMap.planning
                  const clientDisplay = project.client?.company_name || project.client?.name || 'Cliente sin asignar'
                  const budgetFormatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: project.currency || 'USD', maximumFractionDigits: 0 }).format((project.budget_cents || 0) / 100)

                  return (
                    <tr
                      key={project.id}
                      id={`project-row-${project.id}`}
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}
                    >
                      <td style={{ padding: '1rem 1.5rem', fontSize: '0.9375rem', color: 'white', fontWeight: 500 }}>
                        {project.title}
                      </td>
                      <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)' }}>
                        {clientDisplay}
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
                          background: `${st.color}20`,
                          color: st.color,
                          border: `1px solid ${st.color}40`,
                        }}>
                          {st.label}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', color: '#4ade80', fontWeight: 600 }}>
                        {budgetFormatted}
                      </td>
                      <td style={{ padding: '1rem 1.5rem', fontSize: '0.8125rem', color: 'rgba(255,255,255,0.4)' }}>
                        {project.due_date || 'Sin fecha'}
                      </td>
                    </tr>
                  )
                })}
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
