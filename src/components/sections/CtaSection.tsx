'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function CtaSection() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSent(true)
    }
  }

  return (
    <section className="cta-section" id="contacto">
      <div className="container">
        <div className="cta-content">
          <div className="section-eyebrow" style={{ justifyContent: 'center' }}>
            ✦ CONECTA CON NUESTRO EQUIPO
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-salmond)',
              fontSize: 'clamp(2.5rem, 6.5vw, 76px)',
              fontWeight: 900,
              color: '#ffffff',
              lineHeight: 0.88,
              letterSpacing: '-0.02em',
              marginBottom: '20px',
              textTransform: 'uppercase',
            }}
          >
            ¿LISTO PARA DESPLEGAR
            <br />
            <span style={{ color: 'var(--color-tiger-gold)' }}>TU PRIMER AGENTE DE IA?</span>
          </h2>

          <p
            style={{
              fontFamily: 'var(--font-graphikx)',
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.85)',
              lineHeight: 1.5,
              maxWidth: '560px',
              margin: '0 auto 36px',
            }}
          >
            Cuéntanos tu cuello de botella más crítico. Analizaremos tu arquitectura
            y te presentaremos un prototipo funcional sin costo en 72 horas.
          </p>

          {/* Pill Input Email Capture Form */}
          {!sent ? (
            <form
              onSubmit={handleSubmit}
              style={{
                display: 'flex',
                maxWidth: '520px',
                margin: '0 auto 32px',
                gap: '8px',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              <div style={{ flex: '1 1 280px' }}>
                <input
                  type="email"
                  required
                  placeholder="Tu correo corporativo..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                  style={{ width: '100%' }}
                />
              </div>
              <button type="submit" className="btn btn-primary btn-lg">
                Solicitar Demo ➔
              </button>
            </form>
          ) : (
            <div
              style={{
                padding: '16px 24px',
                background: 'var(--surface-spice-card)',
                border: '1px solid var(--color-tiger-gold)',
                borderRadius: '9999px',
                display: 'inline-block',
                marginBottom: '32px',
                color: 'var(--color-tiger-gold)',
                fontFamily: 'var(--font-graphikx)',
                fontSize: '13px',
                fontWeight: 600,
              }}
            >
              ✓ Solicitud recibida. Un arquitecto te contactará hoy mismo.
            </div>
          )}

          {/* Trust Badges */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              flexWrap: 'wrap',
            }}
          >
            <span className="badge badge-secondary">
              🔒 NDA & Privacidad Garantizada
            </span>
            <span className="badge badge-secondary">
              ⚡ Prototipo en 72h
            </span>
            <span className="badge badge-alert">
              ✦ Cupos Limitados por Trimestre
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
