'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

// Clean bespoke SVG icons (zero emojis)
function OverviewIcon({ className }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
    </svg>
  )
}

function AgentsIcon({ className }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 8V4H8" />
      <rect width="16" height="12" x="4" y="8" rx="2" />
      <path d="M2 14h2" />
      <path d="M20 14h2" />
      <path d="M9 13v2" />
      <path d="M15 13v2" />
    </svg>
  )
}

function DeliverablesIcon({ className }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  )
}

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function SupportIcon({ className }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </svg>
  )
}

function LogoutIcon({ className }: { className?: string }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
}

interface NavLinkItem {
  id: string
  icon: React.ReactNode
  label: string
  href: string
}

interface NavSection {
  section: string
  links: NavLinkItem[]
}

const sidebarSections: NavSection[] = [
  {
    section: 'Operaciones',
    links: [
      { id: 'dash-overview', icon: <OverviewIcon />, label: 'Centro de Control', href: '/dashboard' },
      { id: 'dash-agents', icon: <AgentsIcon />, label: 'Agentes Especialistas', href: '/dashboard/agents' },
      { id: 'dash-deliverables', icon: <DeliverablesIcon />, label: 'Proyectos & Entregables', href: '/dashboard/projects' },
    ],
  },
  {
    section: 'Configuración',
    links: [
      { id: 'dash-settings', icon: <SettingsIcon />, label: 'Conectores & Ajustes', href: '/dashboard/settings' },
      { id: 'dash-support', icon: <SupportIcon />, label: 'Centro de Ayuda', href: '/dashboard/support' },
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
            // Ignorar
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
      // Ignorar si storage está bloqueado
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
      id="dashboard-sidebar"
      style={{
        width: '250px',
        minWidth: '250px',
        maxWidth: '250px',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        backgroundColor: '#0f0f10',
        borderRight: '1px solid #1f1f23',
        zIndex: 100,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Brand Logo Header */}
      <div
        style={{
          padding: '1.25rem 1.15rem',
          borderBottom: '1px solid #1a1a1e',
        }}
      >
        <Link
          href="/"
          id="sidebar-logo-link"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            textDecoration: 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '6px',
                background: '#faae33',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#090807',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                  stroke="#090807"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  fontFamily: 'var(--font-display, inherit)',
                  fontWeight: 700,
                  fontSize: '1.05rem',
                  color: '#ffffff',
                  letterSpacing: '-0.02em',
                }}
              >
                NEXUS
              </span>
            </div>
          </div>
          <span
            style={{
              fontSize: '0.625rem',
              background: '#1a1a1f',
              color: '#a1a1aa',
              border: '1px solid #27272e',
              padding: '0.12rem 0.4rem',
              borderRadius: '4px',
              fontWeight: 600,
              letterSpacing: '0.04em',
            }}
          >
            v2.4
          </span>
        </Link>
      </div>

      {/* Navigation Sections */}
      <nav
        id="sidebar-nav"
        style={{
          padding: '1rem 0.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          flex: 1,
        }}
      >
        {sidebarSections.map((sec) => (
          <div key={sec.section}>
            <div
              style={{
                fontSize: '0.68rem',
                fontWeight: 600,
                color: '#71717a',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                padding: '0 0.5rem',
                marginBottom: '0.4rem',
              }}
            >
              {sec.section}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              {sec.links.map((link) => {
                const active = isLinkActive(link.href)
                return (
                  <Link
                    key={link.id}
                    href={link.href}
                    id={link.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                      padding: '0.52rem 0.65rem',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      fontSize: '0.825rem',
                      fontWeight: active ? 600 : 500,
                      color: active ? '#ffffff' : '#9ca3af',
                      backgroundColor: active ? '#1a1a1f' : 'transparent',
                      border: active ? '1px solid #27272e' : '1px solid transparent',
                      transition: 'all 0.12s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (!active) {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)'
                        e.currentTarget.style.color = '#ffffff'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        e.currentTarget.style.backgroundColor = 'transparent'
                        e.currentTarget.style.color = '#9ca3af'
                      }
                    }}
                  >
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: active ? '#faae33' : '#71717a',
                      }}
                    >
                      {link.icon}
                    </span>
                    <span>{link.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User profile & Clean Logout Button */}
      <div
        id="sidebar-user"
        style={{
          marginTop: 'auto',
          padding: '0.85rem',
          borderTop: '1px solid #1a1a1e',
          backgroundColor: '#0c0c0d',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.65rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '6px',
              backgroundColor: '#1f1f23',
              border: '1px solid #2d2d33',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: '#f4f4f5',
              flexShrink: 0,
            }}
          >
            {userName ? userName.charAt(0).toUpperCase() : 'U'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: '0.8rem',
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
            {userEmail && (
              <div
                style={{
                  fontSize: '0.68rem',
                  color: '#71717a',
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
            backgroundColor: '#141416',
            border: '1px solid #222226',
            borderRadius: '6px',
            color: '#a1a1aa',
            fontSize: '0.75rem',
            fontWeight: 500,
            cursor: isLoggingOut ? 'wait' : 'pointer',
            padding: '0.45rem 0.65rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.45rem',
            transition: 'all 0.15s ease',
            opacity: isLoggingOut ? 0.6 : 1,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'
            e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.25)'
            e.currentTarget.style.color = '#f87171'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#141416'
            e.currentTarget.style.borderColor = '#222226'
            e.currentTarget.style.color = '#a1a1aa'
          }}
        >
          {isLoggingOut ? (
            <>
              <span
                style={{
                  display: 'inline-block',
                  width: 12,
                  height: 12,
                  border: '2px solid rgba(255,255,255,0.2)',
                  borderTopColor: '#f87171',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                }}
              />
              Cerrando sesión...
            </>
          ) : (
            <>
              <LogoutIcon />
              Cerrar sesión
            </>
          )}
        </button>
      </div>
    </aside>
  )
}
