'use client'

import Image from 'next/image'
import Link from 'next/link'

const services = [
  {
    id: 'ai-agents',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" fill="currentColor"/>
      </svg>
    ),
    title: 'Agentes de IA',
    description: 'Agentes autónomos que trabajan 24/7 gestionando tareas complejas, tomando decisiones y ejecutando flujos de trabajo completos.',
    image: '/ai-card.jpg',
    badge: 'Más popular',
    badgeClass: 'badge-purple',
    tags: ['GPT-4', 'Gemini', 'Autónomo'],
  },
  {
    id: 'marketing',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M3 3h18v4H3zM3 10h18v4H3zM3 17h18v4H3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Marketing Digital IA',
    description: 'Campañas automatizadas, contenido generado con IA, análisis predictivo y optimización en tiempo real de tus canales digitales.',
    image: '/marketing-card.jpg',
    badge: 'Trending',
    badgeClass: 'badge-cyan',
    tags: ['SEO', 'Ads', 'Contenido IA'],
  },
  {
    id: 'chatbot',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Chatbot Inteligente',
    description: 'Chatbots entrenados con tu conocimiento empresarial, capaces de resolver consultas, calificar leads y automatizar soporte.',
    image: '/chatbot-card.jpg',
    badge: 'Nuevo',
    badgeClass: 'badge-pink',
    tags: ['Base conocimiento', 'Multicanal', '24/7'],
  },
  {
    id: 'automation',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Automatización Avanzada',
    description: 'Flujos de trabajo inteligentes que conectan tus herramientas, eliminan tareas repetitivas y escalan sin límites.',
    image: '/automation-showcase.jpg',
    badge: 'Escalable',
    badgeClass: 'badge-purple',
    tags: ['Zapier', 'n8n', 'API REST'],
  },
  {
    id: 'crm',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'CRM Inteligente',
    description: 'Gestión de clientes potenciada con IA: predicción de churn, scoring de leads, personalización automática y seguimiento proactivo.',
    image: '/hero-bg.jpg',
    badge: 'Integrado',
    badgeClass: 'badge-cyan',
    tags: ['CRM', 'Pipeline', 'Scoring IA'],
  },
  {
    id: 'analytics',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M18 20V10M12 20V4M6 20v-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Analytics & Reportes',
    description: 'Dashboards en tiempo real, informes automáticos, alertas inteligentes y análisis predictivo de tus métricas clave.',
    image: '/marketing-card.jpg',
    badge: 'Tiempo real',
    badgeClass: 'badge-purple',
    tags: ['KPIs', 'Predicción', 'Alertas'],
  },
]

export default function ServicesSection() {
  return (
    <section className="section" id="servicios" style={{ position: 'relative' }}>
      {/* Background glow */}
      <div
        className="glow-orb glow-orb-purple"
        style={{ width: 600, height: 400, top: '20%', right: '-15%', opacity: 0.08 }}
      />

      <div className="container">
        {/* Header */}
        <div className="section-header centered">
          <div className="section-eyebrow centered">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            Nuestros servicios
          </div>
          <h2 className="section-title">
            Explora nuestros{' '}
            <span className="gradient-text">Servicios IA</span>
          </h2>
          <p className="section-description">
            Una suite completa de servicios de inteligencia artificial diseñados para
            transformar cada aspecto de tu negocio.
          </p>
        </div>

        {/* Grid */}
        <div className="services-grid" id="services-grid">
          {services.map((service) => (
            <div key={service.id} className="service-card" id={`service-card-${service.id}`}>
              {/* Image */}
              <div className="service-card-image">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{ objectFit: 'cover' }}
                />
                <div className="service-card-image-overlay" />
                {/* Badge */}
                <div
                  style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', zIndex: 1 }}
                >
                  <span className={`badge ${service.badgeClass}`}>{service.badge}</span>
                </div>
              </div>

              {/* Body */}
              <div className="service-card-body">
                <div className="service-card-icon">{service.icon}</div>
                <h3 className="service-card-title">{service.title}</h3>
                <p className="service-card-description">{service.description}</p>

                {/* Tags */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                  {service.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontSize: '0.75rem',
                        padding: '0.2rem 0.6rem',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '9999px',
                        color: 'rgba(255,255,255,0.5)',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="service-card-footer">
                  <Link
                    href={`/#${service.id}`}
                    className="service-card-link"
                    id={`service-link-${service.id}`}
                  >
                    Ver más
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                  <Link href="/register" className="btn btn-primary btn-sm" id={`service-cta-${service.id}`}>
                    Solicitar
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
