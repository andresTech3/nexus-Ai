'use client'

import Link from 'next/link'

const sidebarLinks = [
  {
    section: 'Principal',
    links: [
      { id: 'dash-overview', icon: '◉', label: 'Resumen', href: '/dashboard', active: true },
      { id: 'dash-projects', icon: '◈', label: 'Proyectos', href: '/dashboard/projects' },
      { id: 'dash-tasks', icon: '✓', label: 'Tareas', href: '/dashboard/tasks' },
      { id: 'dash-clients', icon: '◎', label: 'Clientes', href: '/dashboard/clients' },
    ],
  },
  {
    section: 'IA & Automatización',
    links: [
      { id: 'dash-agents', icon: '⚡', label: 'Agentes IA', href: '/dashboard/agents' },
      { id: 'dash-chatbot', icon: '◐', label: 'Chatbot', href: '/dashboard/chatbot' },
      { id: 'dash-automations', icon: '↻', label: 'Automatizaciones', href: '/dashboard/automations' },
      { id: 'dash-campaigns', icon: '◻', label: 'Campañas', href: '/dashboard/campaigns' },
    ],
  },
  {
    section: 'Finanzas',
    links: [
      { id: 'dash-catalog', icon: '$', label: 'Catálogo', href: '/dashboard/catalog' },
      { id: 'dash-quotes', icon: '❑', label: 'Cotizaciones', href: '/dashboard/quotes' },
      { id: 'dash-orders', icon: '◉', label: 'Órdenes', href: '/dashboard/orders' },
      { id: 'dash-reports', icon: '▤', label: 'Informes', href: '/dashboard/reports' },
    ],
  },
  {
    section: 'Sistema',
    links: [
      { id: 'dash-api-tester', icon: '⚡', label: 'API Tester (v1)', href: '/dashboard/api-tester' },
      { id: 'dash-settings', icon: '⚙', label: 'Configuración', href: '/dashboard/settings' },
      { id: 'dash-support', icon: '?', label: 'Soporte', href: '/dashboard/support' },
    ],
  },
]

const metrics = [
  { id: 'metric-projects', label: 'Proyectos activos', value: '12', change: '+3 este mes', positive: true, icon: '◈' },
  { id: 'metric-clients', label: 'Clientes totales', value: '47', change: '+8 este mes', positive: true, icon: '◎' },
  { id: 'metric-ai-calls', label: 'Llamadas IA hoy', value: '1,284', change: '+12% vs ayer', positive: true, icon: '⚡' },
  { id: 'metric-revenue', label: 'Ingresos del mes', value: '$24,560', change: '+18% vs anterior', positive: true, icon: '$' },
]

const recentProjects = [
  { id: 'proj-1', name: 'Automatización E-commerce RetailMax', status: 'En curso', progress: 75, client: 'RetailMax', dueDate: '28 Oct 2026' },
  { id: 'proj-2', name: 'Chatbot de Soporte TechCo', status: 'Revisión', progress: 90, client: 'TechCo', dueDate: '22 Oct 2026' },
  { id: 'proj-3', name: 'Dashboard Analytics BrandGrow', status: 'En curso', progress: 45, client: 'BrandGrow', dueDate: '15 Nov 2026' },
  { id: 'proj-4', name: 'Agentes CRM SaaS Solutions', status: 'Pendiente', progress: 10, client: 'SaaS Solutions', dueDate: '30 Nov 2026' },
]

const statusColors: Record<string, string> = {
  'En curso': '#a855f7',
  'Revisión': '#22d3ee',
  'Pendiente': 'rgba(255,255,255,0.3)',
  'Completado': '#4ade80',
}

export default function DashboardPage() {
  return (
    <div className="dashboard" id="dashboard">
      {/* Sidebar */}
      <aside className="sidebar" id="dashboard-sidebar">
        {/* Logo */}
        <div className="sidebar-logo">
          <Link href="/" id="sidebar-logo" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.125rem', color: 'white' }}>
            <div className="nav-logo-icon" style={{ width: 28, height: 28 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            Nexus<span className="gradient-text-purple">AI</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav" id="sidebar-nav">
          {sidebarLinks.map((section) => (
            <div key={section.section}>
              <div className="sidebar-section-title">{section.section}</div>
              {section.links.map((link) => (
                <Link
                  key={link.id}
                  href={link.href}
                  className={`sidebar-link ${link.active ? 'active' : ''}`}
                  id={link.id}
                >
                  <span style={{ width: 20, textAlign: 'center', fontSize: '1rem' }}>{link.icon}</span>
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        {/* User profile */}
        <div
          style={{
            marginTop: 'auto',
            paddingTop: '1rem',
            borderTop: '1px solid rgba(147,51,234,0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
          id="sidebar-user"
        >
          <div style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #9333ea, #7c3aed)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.9rem',
            fontWeight: 700,
            color: 'white',
            flexShrink: 0,
          }}>
            A
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Admin</div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>Administrador</div>
          </div>
          <Link href="/login" id="sidebar-logout" style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }} title="Cerrar sesión">
            ↩
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="main-content" id="dashboard-main">
        {/* Header */}
        <div className="dashboard-header" id="dashboard-header">
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, color: 'white', marginBottom: '0.25rem' }}>
              Panel de Control
            </h1>
            <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)' }}>
              Bienvenido de vuelta. Aquí está el resumen de hoy.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.4)' }}>
              Sáb, 17 Oct 2026
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
                  background: 'rgba(147,51,234,0.15)',
                  border: '1px solid rgba(147,51,234,0.25)',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.875rem',
                  color: 'var(--color-purple-400)',
                }}>
                  {metric.icon}
                </div>
              </div>
              <div className="metric-value">{metric.value}</div>
              <div className={`metric-change ${!metric.positive ? 'negative' : ''}`}>
                <span>{metric.positive ? '↑' : '↓'}</span>
                {metric.change}
              </div>
            </div>
          ))}
        </div>

        {/* Projects table */}
        <div
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(147,51,234,0.15)',
            borderRadius: '1rem',
            overflow: 'hidden',
            marginBottom: '2rem',
          }}
          id="projects-table-container"
        >
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(147,51,234,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: 'white' }}>
              Proyectos Recientes
            </h2>
            <Link href="/dashboard/projects" id="view-all-projects" style={{ fontSize: '0.8125rem', color: 'var(--color-purple-400)', fontWeight: 500 }}>
              Ver todos →
            </Link>
          </div>
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
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 150ms' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)' }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
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
                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: statusColors[project.status], display: 'inline-block' }} />
                        {project.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', width: 160 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 9999, overflow: 'hidden' }}>
                          <div style={{
                            height: '100%',
                            width: `${project.progress}%`,
                            background: 'linear-gradient(90deg, #9333ea, #7c3aed)',
                            borderRadius: 9999,
                          }} />
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', minWidth: 32 }}>
                          {project.progress}%
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.8125rem', color: 'rgba(255,255,255,0.4)' }}>
                      {project.dueDate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick actions row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }} id="quick-actions">
          {[
            { id: 'qa-new-client', label: 'Nuevo cliente', icon: '◎', href: '/dashboard/clients/new' },
            { id: 'qa-new-quote', label: 'Nueva cotización', icon: '$', href: '/dashboard/quotes/new' },
            { id: 'qa-new-agent', label: 'Nuevo agente IA', icon: '⚡', href: '/dashboard/agents/new' },
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
                padding: '1rem',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(147,51,234,0.15)',
                borderRadius: '0.75rem',
                color: 'white',
                fontSize: '0.875rem',
                fontWeight: 500,
                transition: 'all 150ms',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = 'rgba(147,51,234,0.4)'
                el.style.background = 'rgba(147,51,234,0.08)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = 'rgba(147,51,234,0.15)'
                el.style.background = 'rgba(255,255,255,0.02)'
              }}
            >
              <span style={{ fontSize: '1.125rem', color: 'var(--color-purple-400)' }}>{action.icon}</span>
              {action.label}
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
