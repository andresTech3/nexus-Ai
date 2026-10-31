'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [currentDate, setCurrentDate] = useState('')

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)

    // Format current date nicely
    const now = new Date()
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }
    setCurrentDate(now.toLocaleDateString('es-ES', options).toUpperCase())

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="nav-inner">
          {/* Brand & Pill Nav Group */}
          <div className="nav-brand-group">
            <Link href="/" className="nav-logo" id="nav-logo">
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: 'var(--color-tiger-gold)',
                  color: 'var(--color-charred-clove)',
                  fontSize: '15px',
                  fontWeight: 900,
                  marginRight: 4,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                  <polyline points="2 17 12 22 22 17"></polyline>
                  <polyline points="2 12 12 17 22 12"></polyline>
                </svg>
              </span>
              NEXUS<span style={{ color: '#ffffff' }}>AI</span>
            </Link>

            {/* Desktop Pill Menu */}
            <div className="nav-pill-menu nav-desktop-menu">
              <ul className="nav-links" id="nav-links">
                <li>
                  <Link href="/#servicios" className="nav-link" id="nav-services">
                    Servicios
                  </Link>
                </li>
                <li>
                  <Link href="/#trabajos" className="nav-link" id="nav-works">
                    Casos
                  </Link>
                </li>
                <li>
                  <Link href="/#nosotros" className="nav-link" id="nav-about">
                    Agencia
                  </Link>
                </li>
                <li>
                  <Link href="/#contacto" className="nav-link" id="nav-contact">
                    Contacto
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Center Date Badge (From reference screenshot) */}
          <div className="nav-date-badge" id="nav-date-badge">
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-tiger-gold)' }} />
            <span>{currentDate || 'SÁB • 24 OCT 2026'}</span>
            <span style={{ opacity: 0.4 }}>|</span>
            <span style={{ color: 'rgba(255,255,255,0.7)' }}>LAB GLOBAL</span>
          </div>

          {/* Actions */}
          <div className="nav-actions">
            <Link href="/dashboard" className="btn btn-primary btn-sm" id="nav-cta-btn">
              Entrar al Dashboard <span style={{ marginLeft: 4, fontWeight: 900 }}>&rarr;</span>
            </Link>

            {/* Mobile toggle */}
            <button
              className="btn-icon"
              id="nav-mobile-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menú"
              style={{ display: 'flex' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                {mobileOpen ? (
                  <path
                    d="M18 6L6 18M6 6l12 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                ) : (
                  <path
                    d="M4 7h16M4 12h16M4 17h16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileOpen && (
          <div
            style={{
              marginTop: '12px',
              padding: '16px',
              background: 'var(--surface-charred-core)',
              border: '1px solid var(--color-cardamom-brown)',
              borderRadius: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <Link
              href="/#servicios"
              className="nav-link"
              onClick={() => setMobileOpen(false)}
            >
              Servicios
            </Link>
            <Link
              href="/#trabajos"
              className="nav-link"
              onClick={() => setMobileOpen(false)}
            >
              Casos de Éxito
            </Link>
            <Link
              href="/#nosotros"
              className="nav-link"
              onClick={() => setMobileOpen(false)}
            >
              Nosotros
            </Link>
            <Link
              href="/#contacto"
              className="nav-link"
              onClick={() => setMobileOpen(false)}
            >
              Contacto
            </Link>
            <div style={{ borderTop: '1px dotted var(--color-tiger-gold)', marginTop: 8, paddingTop: 8 }}>
              <Link
                href="/login"
                className="btn btn-outline btn-sm"
                style={{ width: '100%', justifyContent: 'center', marginBottom: 8 }}
                onClick={() => setMobileOpen(false)}
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/register"
                className="btn btn-primary btn-sm"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => setMobileOpen(false)}
              >
                Iniciar Proyecto +
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
