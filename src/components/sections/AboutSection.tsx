'use client'

import Link from 'next/link'

const stats = [
  { value: '42', suffix: '+', label: 'Especialistas e Ingenieros IA' },
  { value: '300', suffix: '+', label: 'Empresas Transformadas' },
  { value: '24M', suffix: '+', label: 'Mensajes & Decisiones Procesadas' },
  { value: '99.4', suffix: '%', label: 'Retención de Clientes' },
]

const pillars = [
  {
    icon: '✦',
    title: 'Soberanía Absoluta del Código',
    description: 'Tus datos, tus modelos y tus prompts son 100% de tu propiedad. Sin dependencias opacas ni contratos cautivos.',
  },
  {
    icon: '⚡',
    title: 'Despliegues en Semanas, no Años',
    description: 'Arquitectura modular prediseñada que se integra a tus canales en días, garantizando tracción comercial inmediata.',
  },
  {
    icon: '🎯',
    title: 'ROI Medido al Centavo',
    description: 'Cada automatización y cada agente está anclado a un KPI comercial: aumento de margen, ahorro de horas o conversión.',
  },
]

export default function AboutSection() {
  return (
    <section className="section" id="nosotros">
      <div className="container">
        {/* Stats Banner (Charred Core Stepping) */}
        <div className="stats-banner" id="stats-banner">
          <div className="stats-grid">
            {stats.map((stat, i) => (
              <div key={i} className="stat-item" id={`stat-${i}`}>
                <span className="stat-number">
                  {stat.value}
                  <span style={{ fontSize: '0.6em' }}>{stat.suffix}</span>
                </span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '760px', margin: '0 auto 60px' }}>
          <div className="section-eyebrow" style={{ justifyContent: 'center' }}>
            ✦ EL MANIFIESTO DE NEXUS AI
          </div>
          <h2 className="section-title">
            INGENIERÍA COGNITIVA
            <br />
            <span style={{ color: '#ffffff' }}>SIN CONCESIONES NI HUMO</span>
          </h2>
          <p className="section-description" style={{ margin: '16px auto 0' }}>
            No somos consultores de diapositivas. Somos arquitectos de software e inteligencia artificial
            que construyen ventajas competitivas imposibles de replicar.
          </p>
        </div>

        {/* Pillars Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            marginBottom: '64px',
          }}
        >
          {pillars.map((p, i) => (
            <div
              key={i}
              style={{
                background: 'var(--surface-spice-card)',
                border: '1px solid var(--color-cardamom-brown)',
                borderRadius: '8px',
                padding: '32px 24px',
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: 'var(--surface-charred-core)',
                  border: '1px solid var(--color-tiger-gold)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-tiger-gold)',
                  fontSize: '18px',
                  fontWeight: 900,
                  marginBottom: '20px',
                }}
              >
                {p.icon}
              </div>
              <h3
                style={{
                  fontFamily: 'var(--font-salmond)',
                  fontSize: '18px',
                  fontWeight: 700,
                  color: 'var(--color-tiger-gold)',
                  marginBottom: '10px',
                  textTransform: 'uppercase',
                }}
              >
                {p.title}
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-graphikx)',
                  fontSize: '13px',
                  color: 'rgba(255,255,255,0.8)',
                  lineHeight: 1.5,
                }}
              >
                {p.description}
              </p>
            </div>
          ))}
        </div>

        {/* Typographic Poster Statement Block */}
        <div
          style={{
            background: 'var(--surface-charred-core)',
            border: '1px solid var(--color-cardamom-brown)',
            borderRadius: '12px',
            padding: '48px 40px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '40px',
            alignItems: 'center',
          }}
        >
          <div>
            <div className="section-eyebrow">✦ EL FUTURO ES AUTÓNOMO</div>
            <h3
              style={{
                fontFamily: 'var(--font-salmond)',
                fontSize: 'clamp(2rem, 4.5vw, 42px)',
                fontWeight: 800,
                color: '#ffffff',
                lineHeight: 0.95,
                marginBottom: '16px',
              }}
            >
              100% SOBERANÍA
              <br />
              <span style={{ color: 'var(--color-tiger-gold)' }}>Y MODELOS EXCLUSIVOS</span>
            </h3>
            <p style={{ fontFamily: 'var(--font-graphikx)', fontSize: '13px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.5 }}>
              Construimos activos digitales que incrementan la valuación patrimonial de tu compañía.
              Toda la propiedad intelectual te pertenece desde el minuto uno.
            </p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontFamily: 'var(--font-salmond)',
                fontSize: 'clamp(3.5rem, 8vw, 96px)',
                fontWeight: 900,
                color: 'var(--color-tiger-gold)',
                lineHeight: 0.85,
              }}
            >
              100%
            </div>
            <div
              style={{
                fontFamily: 'var(--font-graphikx)',
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: 'rgba(255,255,255,0.6)',
                marginTop: '8px',
              }}
            >
              Propiedad Intelectual Asegurada
            </div>
            <div style={{ marginTop: '20px' }}>
              <Link href="/register" className="btn btn-primary btn-sm">
                Agendar Consulta Estratégica ➔
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
