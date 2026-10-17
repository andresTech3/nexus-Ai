'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function HeroSection() {
  return (
    <section className="hero bg-gradient-hero" id="inicio">
      {/* Background */}
      <div className="hero-bg">
        <Image
          src="/hero-bg.jpg"
          alt="NexusAI hero background"
          fill
          priority
          className="hero-bg-image"
          style={{ objectFit: 'cover' }}
        />
        <div className="hero-bg-overlay" />
      </div>

      {/* Floating orbs */}
      <div
        className="glow-orb glow-orb-purple animate-float"
        style={{ width: 400, height: 400, top: '10%', left: '-10%' }}
      />
      <div
        className="glow-orb glow-orb-violet animate-float-delayed"
        style={{ width: 300, height: 300, top: '30%', right: '-8%' }}
      />

      {/* Content */}
      <div className="container" style={{ position: 'relative', zIndex: 1, width: '100%' }}>
        <div className="hero-content">
          {/* Eyebrow badge */}
          <div className="hero-eyebrow" id="hero-eyebrow">
            <span className="hero-eyebrow-dot" />
            Plataforma de Agencia IA
          </div>

          {/* Title */}
          <h1 className="hero-title">
            Automatiza tu negocio con{' '}
            <span className="gradient-text">Inteligencia Artificial</span>{' '}
            de vanguardia
          </h1>

          {/* Description */}
          <p className="hero-description">
            Conectamos tu empresa con los mejores agentes de IA, automatizaciones avanzadas
            y estrategias de marketing digital. Todo en una sola plataforma.
          </p>

          {/* Actions */}
          <div className="hero-actions" id="hero-actions">
            <Link href="/register" className="btn btn-primary btn-lg" id="hero-cta-primary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 12h14M12 5l7 7-7 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Comenzar gratis
            </Link>
            <Link href="/#servicios" className="btn btn-outline btn-lg" id="hero-cta-secondary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                <path
                  d="M10 8l6 4-6 4V8z"
                  fill="currentColor"
                />
              </svg>
              Ver demo
            </Link>
          </div>

          {/* Social proof */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '4rem' }}>
            <div style={{ display: 'flex' }}>
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: `hsl(${270 + i * 15}, 70%, 50%)`,
                    border: '2px solid rgba(5,2,15,0.8)',
                    marginLeft: i > 1 ? -10 : 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'white',
                  }}
                >
                  {['C', 'M', 'A', 'R'][i - 1]}
                </div>
              ))}
            </div>
            <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>
              <strong style={{ color: 'white' }}>+47 clientes</strong> ya confían en nosotros
            </p>
          </div>

          {/* Stats */}
          <div className="hero-stats" id="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-value">42+</div>
              <div className="hero-stat-label">Proyectos completados</div>
            </div>
            <div style={{ width: 1, height: 50, background: 'rgba(147,51,234,0.3)' }} />
            <div className="hero-stat">
              <div className="hero-stat-value">204</div>
              <div className="hero-stat-label">Automatizaciones activas</div>
            </div>
            <div style={{ width: 1, height: 50, background: 'rgba(147,51,234,0.3)' }} />
            <div className="hero-stat">
              <div className="hero-stat-value">24M+</div>
              <div className="hero-stat-label">Mensajes procesados</div>
            </div>
            <div style={{ width: 1, height: 50, background: 'rgba(147,51,234,0.3)' }} />
            <div className="hero-stat">
              <div className="hero-stat-value">112</div>
              <div className="hero-stat-label">Agentes desplegados</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1,
        }}
      >
        <div className="scroll-indicator">
          <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Explorar
          </span>
          <div className="scroll-indicator-line" />
        </div>
      </div>
    </section>
  )
}
