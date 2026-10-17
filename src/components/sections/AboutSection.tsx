const stats = [
  { value: '42', suffix: '+', label: 'Años de experiencia combinada' },
  { value: '204', suffix: '', label: 'Proyectos completados' },
  { value: '24M', suffix: '+', label: 'Mensajes de IA procesados' },
  { value: '112', suffix: '', label: 'Clientes satisfechos' },
]

const features = [
  {
    id: 'feat-exclusive',
    icon: '✦',
    title: 'Creaciones Exclusivas',
    description:
      'Desarrollamos soluciones de IA únicas, diseñadas específicamente para tu negocio y que no encontrarás en ningún otro lugar.',
  },
  {
    id: 'feat-ownership',
    icon: '🔐',
    title: 'Propiedad Total',
    description:
      'Cuando adquieres nuestros servicios, eres el dueño absoluto de todo: código, modelos, datos y estrategias.',
  },
  {
    id: 'feat-artists',
    icon: '🚀',
    title: 'Apoyo a tu Crecimiento',
    description:
      'Elegir NexusAI significa invertir en el futuro de tu empresa, con soporte continuo y actualización constante.',
  },
]

export default function AboutSection() {
  return (
    <section className="section" id="nosotros" style={{ position: 'relative' }}>
      {/* Background */}
      <div className="bg-gradient-section" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
      <div
        className="glow-orb glow-orb-pink"
        style={{ width: 400, height: 300, top: '50%', right: '10%', opacity: 0.07 }}
      />

      <div className="container" style={{ position: 'relative' }}>
        {/* Stats banner */}
        <div
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(147,51,234,0.15)',
            borderRadius: '1.5rem',
            marginBottom: '5rem',
            overflow: 'hidden',
          }}
          id="stats-banner"
        >
          <div className="stats-grid" id="stats-grid">
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

        {/* Why choose us */}
        <div className="section-header centered">
          <div className="section-eyebrow centered">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            Por qué elegirnos
          </div>
          <h2 className="section-title">
            Razones para{' '}
            <span className="gradient-text">Elegirnos</span>
          </h2>
          <p className="section-description">
            No somos solo proveedores de tecnología. Somos tus socios estratégicos en la
            transformación digital impulsada por inteligencia artificial.
          </p>
        </div>

        {/* Feature cards */}
        <div className="features-grid" id="features-grid">
          {features.map((feature) => (
            <div key={feature.id} className="feature-card" id={feature.id}>
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Highlight block */}
        <div
          style={{
            marginTop: '4rem',
            padding: '3rem',
            background: 'linear-gradient(135deg, rgba(147,51,234,0.12) 0%, rgba(124,58,237,0.06) 100%)',
            border: '1px solid rgba(147,51,234,0.25)',
            borderRadius: '1.5rem',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '3rem',
            alignItems: 'center',
          }}
          id="about-highlight"
        >
          <div>
            <div className="section-eyebrow">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10"/>
              </svg>
              Sobre NexusAI
            </div>
            <h2 className="section-title" style={{ fontSize: '2rem' }}>
              Arte Moderno en Plataformas de{' '}
              <span className="gradient-text">IA</span>
            </h2>
            <p className="section-description" style={{ marginTop: '1rem' }}>
              Invertimos en creatividad que perdura en el tiempo. Nuestros proyectos de IA
              son únicos en el espacio digital, construidos con tecnología de punta y
              visión estratégica.
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '5rem',
                fontWeight: 900,
                background: 'linear-gradient(135deg, #c084fc, #a855f7, #7c3aed)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                lineHeight: 1,
                marginBottom: '0.5rem',
              }}
            >
              100%
            </div>
            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Derechos asegurados
            </div>
            <div
              style={{
                marginTop: '1rem',
                fontFamily: 'var(--font-display)',
                fontSize: '1.25rem',
                fontWeight: 700,
                color: 'white',
              }}
            >
              Arte en la Era de la IA
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
