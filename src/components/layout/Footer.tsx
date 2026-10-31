import Link from 'next/link'

const footerLinks = {
  soluciones: [
    { label: 'Agentes Autónomos', href: '/#servicios' },
    { label: 'Growth Marketing IA', href: '/#servicios' },
    { label: 'Automatización de Pipelines', href: '/#servicios' },
    { label: 'Chatbots RAG Seguros', href: '/#servicios' },
    { label: 'Lead Scoring & CRM', href: '/#servicios' },
  ],
  agencia: [
    { label: 'Casos de Éxito', href: '/#trabajos' },
    { label: 'Manifiesto', href: '/#nosotros' },
    { label: 'Laboratorio de IA', href: '/#inicio' },
    { label: 'Contacto Directo', href: '/#contacto' },
    { label: 'Seguridad & Privacidad', href: '/privacidad' },
  ],
  plataforma: [
    { label: 'Iniciar Sesión', href: '/login' },
    { label: 'Crear Cuenta', href: '/register' },
    { label: 'Portal de Clientes', href: '/portal' },
    { label: 'Documentación API', href: '/docs' },
    { label: 'Estado del Servicio', href: '/status' },
  ],
}

export default function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="container">
        <div className="footer-top">
          {/* Brand */}
          <div>
            <Link href="/" className="nav-logo" id="footer-logo" style={{ display: 'inline-flex', marginBottom: '16px' }}>
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
                  marginRight: 6,
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
            <p className="footer-brand-description">
              Agencia boutique de inteligencia artificial aplicada, automatizaciones autónomas
              y arquitectura cognitiva para empresas que buscan ventaja competitiva sostenible.
            </p>
            <div className="footer-social" id="footer-social">
              {[
                { label: 'X', icon: '𝕏' },
                { label: 'LinkedIn', icon: 'in' },
                { label: 'GitHub', icon: 'GH' },
                { label: 'Discord', icon: 'DS' },
              ].map((s) => (
                <a
                  key={s.label}
                  href="#"
                  className="footer-social-link"
                  id={`footer-social-${s.label.toLowerCase()}`}
                  aria-label={s.label}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Soluciones */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-salmond)',
                fontSize: '13px',
                fontWeight: 700,
                color: 'var(--color-tiger-gold)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '16px',
              }}
            >
              Soluciones
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {footerLinks.soluciones.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    style={{
                      fontFamily: 'var(--font-graphikx)',
                      fontSize: '13px',
                      color: 'rgba(255,255,255,0.7)',
                      textDecoration: 'none',
                    }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Agencia */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-salmond)',
                fontSize: '13px',
                fontWeight: 700,
                color: 'var(--color-tiger-gold)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '16px',
              }}
            >
              Agencia
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {footerLinks.agencia.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    style={{
                      fontFamily: 'var(--font-graphikx)',
                      fontSize: '13px',
                      color: 'rgba(255,255,255,0.7)',
                      textDecoration: 'none',
                    }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Plataforma */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-salmond)',
                fontSize: '13px',
                fontWeight: 700,
                color: 'var(--color-tiger-gold)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '16px',
              }}
            >
              Acceso
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {footerLinks.plataforma.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    style={{
                      fontFamily: 'var(--font-graphikx)',
                      fontSize: '13px',
                      color: 'rgba(255,255,255,0.7)',
                      textDecoration: 'none',
                    }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Bottom with Dotted Rule */}
        <div
          style={{
            borderTop: '1px dotted var(--color-tiger-gold)',
            paddingTop: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            fontFamily: 'var(--font-graphikx)',
            fontSize: '12px',
            color: 'rgba(250, 174, 51, 0.7)',
          }}
        >
          <p>© 2026 Nexus AI Agency. Estilo Hungry Tiger — Todos los derechos reservados.</p>
          <div style={{ display: 'flex', gap: '20px' }}>
            <Link href="/privacidad" style={{ color: 'inherit' }}>Privacidad</Link>
            <Link href="/terminos" style={{ color: 'inherit' }}>Términos de Servicio</Link>
            <Link href="/seguridad" style={{ color: 'inherit' }}>Seguridad</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
