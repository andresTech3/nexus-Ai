'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="nav-inner">
          {/* Logo */}
          <Link href="/" className="nav-logo" id="nav-logo">
            <div className="nav-logo-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
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

          {/* Desktop Nav Links */}
          <ul className="nav-links" id="nav-links">
            <li>
              <Link href="/" className="nav-link active" id="nav-home">
                Inicio
              </Link>
            </li>
            <li>
              <Link href="/#servicios" className="nav-link" id="nav-services">
                Servicios
              </Link>
            </li>
            <li>
              <Link href="/#trabajos" className="nav-link" id="nav-works">
                Trabajos
              </Link>
            </li>
            <li>
              <Link href="/#nosotros" className="nav-link" id="nav-about">
                Nosotros
              </Link>
            </li>
            <li>
              <Link href="/#contacto" className="nav-link" id="nav-contact">
                Contacto
              </Link>
            </li>
          </ul>

          {/* Actions */}
          <div className="nav-actions">
            <Link href="/login" className="btn btn-ghost btn-sm" id="nav-login-btn">
              Iniciar sesión
            </Link>
            <Link href="/register" className="btn btn-primary btn-sm" id="nav-cta-btn">
              Comenzar ahora
            </Link>
            {/* Mobile toggle */}
            <button
              className="btn btn-ghost btn-sm"
              id="nav-mobile-toggle"
              style={{ display: 'none' }}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menú"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                {mobileOpen ? (
                  <path
                    d="M18 6L6 18M6 6l12 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                ) : (
                  <path
                    d="M4 6h16M4 12h16M4 18h16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
