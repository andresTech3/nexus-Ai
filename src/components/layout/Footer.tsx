import Link from 'next/link'

const footerLinks = {
  servicios: [
    { label: 'Agentes IA', href: '/#servicios' },
    { label: 'Automatización', href: '/#servicios' },
    { label: 'Marketing Digital', href: '/#servicios' },
    { label: 'Chatbot IA', href: '/#servicios' },
    { label: 'CRM Inteligente', href: '/#servicios' },
  ],
  empresa: [
    { label: 'Nosotros', href: '/#nosotros' },
    { label: 'Trabajos', href: '/#trabajos' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contacto', href: '/#contacto' },
    { label: 'Privacidad', href: '/privacidad' },
  ],
  plataforma: [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Portal Cliente', href: '/portal' },
    { label: 'Documentación', href: '/docs' },
    { label: 'Estado del sistema', href: '/status' },
    { label: 'API', href: '/api/v1' },
  ],
}

export default function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="container">
        <div className="footer-top">
          {/* Brand */}
          <div>
            <Link href="/" className="nav-logo" id="footer-logo" style={{ display: 'inline-flex', marginBottom: '1rem' }}>
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
            <p className="footer-brand-description">
              Transformamos negocios mediante inteligencia artificial, automatización avanzada
              y estrategias de marketing digital de vanguardia.
            </p>
            <div className="footer-social" id="footer-social">
              {[
                { label: 'Twitter', icon: 'X' },
                { label: 'LinkedIn', icon: 'in' },
                { label: 'GitHub', icon: 'GH' },
                { label: 'YouTube', icon: '▶' },
              ].map((s) => (
                <a
                  key={s.label}
                  href="#"
                  className="footer-social-link"
                  id={`footer-social-${s.label.toLowerCase()}`}
                  aria-label={s.label}
                  title={s.label}
                >
                  <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>{s.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="footer-col-title">Servicios</h4>
            <ul className="footer-links">
              {footerLinks.servicios.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="footer-link" id={`footer-link-${l.label.toLowerCase().replace(/\s/g, '-')}`}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="footer-col-title">Empresa</h4>
            <ul className="footer-links">
              {footerLinks.empresa.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="footer-link" id={`footer-link-empresa-${l.label.toLowerCase().replace(/\s/g, '-')}`}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 className="footer-col-title">Plataforma</h4>
            <ul className="footer-links">
              {footerLinks.plataforma.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="footer-link" id={`footer-link-platform-${l.label.toLowerCase().replace(/\s/g, '-')}`}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-bottom-text">
            © 2026 NexusAI. Todos los derechos reservados.
          </p>
          <p className="footer-bottom-text" style={{ display: 'flex', gap: '1.5rem' }}>
            <Link href="/privacidad" className="footer-link" id="footer-privacy">Privacidad</Link>
            <Link href="/terminos" className="footer-link" id="footer-terms">Términos</Link>
            <Link href="/cookies" className="footer-link" id="footer-cookies">Cookies</Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
