'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function HeroSection() {
  return (
    <section className="hero bg-gradient-hero" id="inicio">
      {/* Background Image — Dynamic runner in warm golden/amber motion */}
      <div className="hero-bg">
        <img
          src="https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1920&q=80"
          alt="Nexus AI Hero — Creative Digital Agency"
          className="hero-bg-image"
        />
        <div className="hero-bg-overlay" />
        <div className="botanical-watermark" />
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 1, width: '100%' }}>
        <div className="hero-content">
          {/* Eyebrow & Star Rating (Matches screenshot top-left) */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', color: 'var(--color-tiger-gold)', fontSize: '13px', letterSpacing: '3px' }}>
                ★★★★★
              </div>
              <span style={{ fontFamily: 'var(--font-graphikx)', fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                300+ Clientes Globales
              </span>
            </div>

            <div className="hero-eyebrow" id="hero-eyebrow">
              <span className="hero-eyebrow-dot" />
              SISTEMAS AUTÓNOMOS & INGENIERÍA COGNITIVA
            </div>
          </div>

          {/* Massive Display Title (Poster Scale from screenshot: CREATIVE DIGITAL AGENCY) */}
          <h1 className="hero-title">
            CREATIVE
            <br />
            <span className="hero-title-accent">
              DIGITAL
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 'clamp(36px, 6vw, 76px)',
                  height: 'clamp(36px, 6vw, 76px)',
                  borderRadius: '16px',
                  background: 'var(--color-tiger-gold)',
                  color: 'var(--color-charred-clove)',
                  fontSize: 'clamp(20px, 3.5vw, 42px)',
                  fontWeight: 900,
                  verticalAlign: 'middle',
                  margin: '0 8px',
                }}
              >
                ✦
              </span>
              AGENCY
            </span>
          </h1>

          {/* Two-column Hero Lower Row: Manifesto + CTAs on left, Floating Widget on right */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '40px',
              alignItems: 'flex-end',
              marginTop: '20px',
            }}
          >
            <div>
              {/* Manifesto paragraph */}
              <p className="hero-description">
                TRANSFORMAMOS IDEAS EN MARCAS Y SISTEMAS QUE LA GENTE ELIGE.
                ARQUITECTURA DE IA DE MÁXIMO RENDIMIENTO PARA LÍDERES QUE EXIGEN VELOCIDAD Y RESULTADOS REALES.
              </p>

              {/* Action Buttons (Pill Controls) */}
              <div className="hero-actions" id="hero-actions">
                <Link href="/register" className="btn btn-primary btn-lg" id="hero-cta-primary">
                  Iniciar Proyecto
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M5 12h14M12 5l7 7-7 7"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
                <Link href="/#trabajos" className="btn btn-outline btn-lg" id="hero-cta-secondary">
                  Ver Casos de Éxito
                </Link>
              </div>
            </div>

            {/* Floating Visual Micro-cards (From reference screenshot) */}
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
              {/* Left Charred Micro Card */}
              <div
                className="hero-widget-card"
                style={{
                  flex: '1 1 240px',
                  maxWidth: '320px',
                  background: 'var(--surface-charred-core)',
                  border: '1px solid var(--color-cardamom-brown)',
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '8px',
                    background: 'var(--surface-spice-card)',
                    border: '1px solid var(--color-tiger-gold)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-tiger-gold)',
                    fontSize: '18px',
                    fontWeight: 900,
                    flexShrink: 0,
                  }}
                >
                  ⚡
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-salmond)', fontSize: '15px', color: '#ffffff', fontWeight: 700 }}>
                    50+ Proyectos
                  </div>
                  <div style={{ fontFamily: 'var(--font-graphikx)', fontSize: '11px', color: 'var(--color-tiger-gold)', marginTop: 2 }}>
                    3.8x Retorno Promedio
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    className="btn-icon"
                    style={{ width: 28, height: 28, fontSize: '10px' }}
                    aria-label="Anterior"
                  >
                    ←
                  </button>
                  <button
                    className="btn-icon"
                    style={{ width: 28, height: 28, fontSize: '10px' }}
                    aria-label="Siguiente"
                  >
                    →
                  </button>
                </div>
              </div>

              {/* Right Vertical Pill Thumbnail Card */}
              <div
                style={{
                  background: 'var(--surface-charred-core)',
                  border: '1px solid var(--color-cardamom-brown)',
                  borderRadius: '16px',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  flex: '1 1 200px',
                  maxWidth: '280px',
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    overflow: 'hidden',
                    position: 'relative',
                    border: '1px solid var(--color-tiger-gold)',
                    flexShrink: 0,
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=120&q=80"
                    alt="Vision"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <span
                  style={{
                    fontFamily: 'var(--font-graphikx)',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: 'rgba(255,255,255,0.85)',
                    lineHeight: 1.3,
                  }}
                >
                  Elegidos por startups y marcas en hipercrecimiento
                </span>
              </div>
            </div>
          </div>

          {/* Dotted Divider & Metrics Strip */}
          <div className="hero-stats-strip" id="hero-stats">
            <div className="hero-stat-item">
              <span className="hero-stat-value">50+</span>
              <span className="hero-stat-label">Modelos & Agentes de IA</span>
            </div>
            <div className="hero-stat-item">
              <span className="hero-stat-value">3.8x</span>
              <span className="hero-stat-label">Multiplicador de Conversión</span>
            </div>
            <div className="hero-stat-item">
              <span className="hero-stat-value">24M+</span>
              <span className="hero-stat-label">Interacciones Automatizadas</span>
            </div>
            <div className="hero-stat-item">
              <span className="hero-stat-value">99.9%</span>
              <span className="hero-stat-label">SLA & Disponibilidad Cloud</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
