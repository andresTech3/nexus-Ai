'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOutAction } from '@/app/(auth)/actions'

interface NavLinkItem {
  id: string
  icon: string
  label: string
  href: string
}

interface NavSection {
  section: string
  links: NavLinkItem[]
}

const sidebarSections: NavSection[] = [
  {
    section: 'Principal',
    links: [
      { id: 'dash-overview', icon: '◉', label: 'Resumen', href: '/dashboard' },
      { id: 'dash-projects', icon: '◈', label: 'Proyectos', href: '/dashboard/projects' },
      { id: 'dash-tasks', icon: '✓', label: 'Tareas', href: '/dashboard/tasks' },
      { id: 'dash-clients', icon: '◎', label: 'Clientes CRM', href: '/dashboard/clients' },
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
      { id: 'dash-orders', icon: '◉', label: 'Órdenes & Pagos', href: '/dashboard/orders' },
      { id: 'dash-reports', icon: '▤', label: 'Informes', href: '/dashboard/reports' },
    ],
  },
  {
    section: 'Sistema',
    links: [
      { id: 'dash-settings', icon: '⚙', label: 'Configuración', href: '/dashboard/settings' },
      { id: 'dash-support', icon: '?', label: 'Soporte & Ayuda', href: '/dashboard/support' },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()

  const isLinkActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname.startsWith(href)
  }

  return (
    <aside className="sidebar" id="dashboard-sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <Link
          href="/"
          id="sidebar-logo-link"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.625rem',
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: '1.2rem',
            color: 'white',
            textDecoration: 'none',
          }}
        >
          <div className="nav-logo-icon" style={{ width: 30, height: 30 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          Nexus<span className="gradient-text-purple">AI</span>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav" id="sidebar-nav">
        {sidebarSections.map((sec) => (
          <div key={sec.section} style={{ marginBottom: '0.5rem' }}>
            <div className="sidebar-section-title">{sec.section}</div>
            {sec.links.map((link) => {
              const active = isLinkActive(link.href)
              return (
                <Link
                  key={link.id}
                  href={link.href}
                  className={`sidebar-link ${active ? 'active' : ''}`}
                  id={link.id}
                >
                  <span
                    style={{
                      width: 22,
                      textAlign: 'center',
                      fontSize: '1rem',
                      display: 'inline-block',
                    }}
                  >
                    {link.icon}
                  </span>
                  <span>{link.label}</span>
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* User profile & Logout */}
      <div
        style={{
          marginTop: 'auto',
          paddingTop: '1rem',
          borderTop: '1px solid rgba(147,51,234,0.18)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
        }}
        id="sidebar-user"
      >
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #9333ea, #7c3aed)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.95rem',
            fontWeight: 700,
            color: 'white',
            flexShrink: 0,
            boxShadow: '0 0 12px rgba(147, 51, 234, 0.4)',
          }}
        >
          A
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'white',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            Andrés (Admin)
          </div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)' }}>
            Empresa activa
          </div>
        </div>
        <form action={signOutAction}>
          <button
            type="submit"
            id="sidebar-logout"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '0.375rem',
              color: 'rgba(255,255,255,0.6)',
              fontSize: '0.85rem',
              cursor: 'pointer',
              padding: '0.35rem 0.5rem',
              transition: 'all 0.2s',
            }}
            title="Cerrar sesión"
          >
            ↩
          </button>
        </form>
      </div>
    </aside>
  )
}
