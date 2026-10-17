import Link from 'next/link'

export default function CtaSection() {
  return (
    <section className="cta-section" id="contacto">
      <div className="cta-bg" />

      {/* Decorative rings */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        height: 600,
        borderRadius: '50%',
        border: '1px solid rgba(147,51,234,0.1)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        height: 400,
        borderRadius: '50%',
        border: '1px solid rgba(147,51,234,0.12)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 200,
        height: 200,
        borderRadius: '50%',
        border: '1px solid rgba(147,51,234,0.15)',
        pointerEvents: 'none',
      }} />

      <div className="container">
        <div className="cta-content" id="cta-content">
          <div className="section-eyebrow centered">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            Comienza hoy
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 900,
              color: 'white',
              marginBottom: '1.5rem',
              lineHeight: 1.1,
            }}
          >
            ¿Listo para transformar tu{' '}
            <span className="gradient-text">negocio con IA?</span>
          </h2>

          <p
            style={{
              fontSize: '1.0625rem',
              color: 'rgba(255,255,255,0.6)',
              lineHeight: 1.7,
              marginBottom: '2.5rem',
              maxWidth: 560,
              margin: '0 auto 2.5rem',
            }}
          >
            Únete a más de 100 empresas que ya están automatizando sus procesos,
            generando más leads y cerrando más ventas con inteligencia artificial.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
            <Link href="/register" className="btn btn-primary btn-lg" id="cta-primary-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Crear cuenta gratis
            </Link>
            <Link href="/#contacto" className="btn btn-outline btn-lg" id="cta-secondary-btn">
              Hablar con un experto
            </Link>
          </div>

          {/* Trust badges */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            {[
              { icon: '🔒', text: 'Sin tarjeta requerida' },
              { icon: '⚡', text: 'Setup en 5 minutos' },
              { icon: '🎯', text: '14 días de prueba' },
            ].map((trust, i) => (
              <div
                key={i}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)' }}
                id={`trust-badge-${i}`}
              >
                <span>{trust.icon}</span>
                <span>{trust.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
