'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

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
    section: 'Dropshipping OS',
    links: [
      { id: 'dash-overview', icon: '🏛️', label: 'Oficina 3D en Vivo', href: '/dashboard' },
      { id: 'dash-agents', icon: '⚡', label: '11 Agentes Especialistas', href: '/dashboard/agents' },
      { id: 'dash-deliverables', icon: '📦', label: 'Proyectos & Entregables', href: '/dashboard/projects' },
    ],
  },
  {
    section: 'Configuración & Conexiones',
    links: [
      { id: 'dash-settings', icon: '⚙️', label: 'Conectores IA & Ajustes', href: '/dashboard/settings' },
      { id: 'dash-support', icon: '❓', label: 'Soporte Dropshipping', href: '/dashboard/support' },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [userName, setUserName] = useState<string>('Cargando...')
  const [userEmail, setUserEmail] = useState<string>('')
  const [userOrg, setUserOrg] = useState<string>('Dropshipping OS')
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false)

  useEffect(() => {
    let isMounted = true
    async function loadUser() {
      try {
        const supabase = createClient()
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError || !user) {
          if (isMounted) setUserName('Mi Perfil')
          return
        }

        if (isMounted) {
          const email = user.email || ''
          setUserEmail(email)

          // 1. Obtener perfil de user_profiles si existe
          let profileName = ''
          let profileCompany = ''
          try {
            const { data: profile } = await supabase
              .from('user_profiles')
              .select('first_name, last_name, company')
              .eq('id', user.id)
              .maybeSingle()

            if (profile) {
              profileName = [profile.first_name, profile.last_name].filter(Boolean).join(' ')
              profileCompany = profile.company || ''
            }
          } catch (e) {
            // Ignorar error si no existe la tabla
          }

          const metaFirst = user.user_metadata?.first_name || ''
          const metaLast = user.user_metadata?.last_name || ''
          const metaFullName = [metaFirst, metaLast].filter(Boolean).join(' ') || user.user_metadata?.full_name || ''
          const metaCompany = user.user_metadata?.company || ''

          const finalName = profileName || metaFullName || (email ? email.split('@')[0] : 'Usuario')
          const finalCompany = profileCompany || metaCompany || 'Dropshipping OS'

          setUserName(finalName)
          setUserOrg(finalCompany)
        }
      } catch (err) {
        console.error('Error loading user profile:', err)
        if (isMounted) setUserName('Mi Perfil')
      }
    }
    loadUser()

    return () => {
      isMounted = false
    }
  }, [])

  const handleSignOut = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (isLoggingOut) return
    setIsLoggingOut(true)

    try {
      const supabase = createClient()
      await supabase.auth.signOut()
    } catch (err) {
      console.error('Error signing out client:', err)
    }

    try {
      await fetch('/api/v1/auth/sign-out', { method: 'POST' })
    } catch (err) {
      console.error('Error calling sign-out API:', err)
    }

    try {
      if (typeof window !== 'undefined') {
        Object.keys(localStorage).forEach((key) => {
          if (key.startsWith('sb-') || key.includes('supabase') || key.includes('auth')) {
            localStorage.removeItem(key)
          }
        })
        sessionStorage.clear()
      }
    } catch (e) {
      // Ignorar si storage está deshabilitado
    }

    if (typeof window !== 'undefined') {
      window.location.replace('/login')
    }
  }

  const isLinkActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname.startsWith(href)
  }

  return (
    <aside
      className="sidebar"
      id="dashboard-sidebar"
      style={{
        width: '260px',
        minWidth: '260px',
        maxWidth: '260px',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        backgroundColor: '#181818',
        borderRight: '1px solid #2e2e2e',
        zIndex: 100,
        overflowY: 'auto',
      }}
    >
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
          Nexus<span style={{ color: '#faae33' }}>AI</span>
          <span style={{ fontSize: '0.62rem', background: 'rgba(250, 174, 51, 0.15)', color: '#faae33', border: '1px solid rgba(250, 174, 51, 0.3)', padding: '0.1rem 0.35rem', borderRadius: '0.25rem', fontWeight: 600, letterSpacing: '0.04em' }}>OS</span>
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
          padding: '0.875rem',
          borderTop: '1px solid rgba(250, 174, 51, 0.15)',
          background: 'rgba(18, 16, 14, 0.6)',
          borderRadius: '0.75rem',
          margin: 'auto 0.75rem 0.75rem 0.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.625rem',
        }}
        id="sidebar-user"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '0.5rem',
              background: 'linear-gradient(135deg, #faae33 0%, #b45309 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.9rem',
              fontWeight: 700,
              color: '#0a0a0a',
              flexShrink: 0,
              boxShadow: '0 2px 8px rgba(250, 174, 51, 0.25)',
            }}
          >
            {userName ? userName.charAt(0).toUpperCase() : 'U'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: '0.825rem',
                fontWeight: 600,
                color: '#f4f4f5',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
              title={userName}
            >
              {userName}
            </div>
            <div
              style={{
                fontSize: '0.7rem',
                color: '#faae33',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                fontWeight: 500,
              }}
              title={userOrg}
            >
              {userOrg}
            </div>
            {userEmail && (
              <div
                style={{
                  fontSize: '0.675rem',
                  color: 'rgba(255, 255, 255, 0.45)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
                title={userEmail}
              >
                {userEmail}
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => handleSignOut()}
          id="sidebar-logout"
          disabled={isLoggingOut}
          style={{
            width: '100%',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '0.5rem',
            color: '#d4d4d8',
            fontSize: '0.75rem',
            fontWeight: 500,
            cursor: isLoggingOut ? 'wait' : 'pointer',
            padding: '0.45rem 0.65rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem',
            transition: 'all 0.15s ease',
            opacity: isLoggingOut ? 0.6 : 1,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.12)'
            e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)'
            e.currentTarget.style.color = '#fca5a5'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)'
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'
            e.currentTarget.style.color = '#d4d4d8'
          }}
        >
          {isLoggingOut ? (
            <>
              <span
                style={{
                  display: 'inline-block',
                  width: 12,
                  height: 12,
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#fca5a5',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                }}
              />
              Cerrando sesión...
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Cerrar sesión
            </>
          )}
        </button>
      </div>
    </aside>
  )
}
