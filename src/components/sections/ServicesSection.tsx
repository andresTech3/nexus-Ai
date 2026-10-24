'use client'

import Image from 'next/image'
import Link from 'next/link'

const services = [
  {
    id: 'ai-agents',
    number: '01',
    title: 'Agentes Autónomos 24/7',
    description: 'Sistemas cognitivos independientes que gestionan flujos de venta, prospección multicanal y resolución compleja de tickets sin supervisión manual.',
    badge: 'Popular',
    badgeClass: 'badge-gold',
    tags: ['GPT-4o', 'Claude 3.5', 'Autonomía Total'],
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'marketing-ia',
    number: '02',
    title: 'Growth Marketing & Copy IA',
    description: 'Generación hiperpersonalizada de campañas publicitarias, segmentación dinámica y optimización algorítmica de conversión en tiempo real.',
    badge: 'Trending',
    badgeClass: 'badge-alert',
    tags: ['E-Commerce', 'Performance', 'Paid Media'],
    image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'process-automation',
    number: '03',
    title: 'Automatización de Pipelines',
    description: 'Conexión integral de ERPs, CRMs y bases de datos con flujos inteligentes que eliminan hasta el 85% de la carga operativa manual.',
    badge: 'Alta Escala',
    badgeClass: 'badge-secondary',
    tags: ['n8n', 'Zapier Enterprise', 'Webhooks'],
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'rag-chatbots',
    number: '04',
    title: 'Asistentes RAG Empresariales',
    description: 'Modelos entrenados exclusivamente con la base de conocimiento de tu compañía para brindar respuestas infalibles con cero alucinaciones.',
    badge: 'Seguro',
    badgeClass: 'badge-secondary',
    tags: ['Embeddings', 'Vectores', 'Privacidad'],
    image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'predictive-crm',
    number: '05',
    title: 'CRM Inteligente & Lead Scoring',
    description: 'Predicción probabilística de churn, calificación de leads por comportamiento y asignación automática al mejor representante comercial.',
    badge: 'Predictivo',
    badgeClass: 'badge-gold',
    tags: ['Machine Learning', 'Pipelines', 'Analytics'],
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'audit-strategy',
    number: '06',
    title: 'Auditoría & Estrategia IA',
    description: 'Diagnóstico exhaustivo de procesos de negocio, identificación de cuellos de botella y diseño del roadmap tecnológico de automatización a 12 meses.',
    badge: 'Consultoría',
    badgeClass: 'badge-secondary',
    tags: ['Roadmap', 'ROI Medible', 'Arquitectura'],
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
  },
]

export default function ServicesSection() {
  return (
    <section className="section" id="servicios">
      <div className="container">
        {/* Section Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            borderBottom: '1px dotted var(--color-tiger-gold)',
            paddingBottom: '24px',
            marginBottom: '48px',
            flexWrap: 'wrap',
            gap: '24px',
          }}
        >
          <div>
            <div className="section-eyebrow">
              ✦ SERVICIOS COGNITIVOS DE ALTA PRECISIÓN
            </div>
            <h2 className="section-title">
              SUITE DE SOLUCIONES
              <br />
              <span style={{ color: '#ffffff' }}>PARA DOMINAR EL MERCADO</span>
            </h2>
          </div>

          <p className="section-description" style={{ maxWidth: '420px', margin: 0 }}>
            Infraestructura modular lista para desplegarse sobre tus operaciones actuales,
            diseñada con el estándar más estricto de seguridad y soberanía de datos.
          </p>
        </div>

        {/* Services Grid */}
        <div className="services-grid" id="services-grid">
          {services.map((s) => (
            <div key={s.id} className="service-card" id={`service-${s.id}`}>
              {/* Image with Tag */}
              <div className="service-card-image">
                <img
                  src={s.image}
                  alt={s.title}
                  loading="lazy"
                />
                <div className="service-card-image-overlay" />
                <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 1 }}>
                  <span className={`badge ${s.badgeClass}`}>{s.badge}</span>
                </div>
                <div
                  style={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    zIndex: 1,
                    fontFamily: 'var(--font-salmond)',
                    fontSize: '14px',
                    fontWeight: 800,
                    color: 'var(--color-tiger-gold)',
                  }}
                >
                  {s.number}
                </div>
              </div>

              {/* Body */}
              <div className="service-card-body">
                <h3 className="service-card-title">{s.title}</h3>
                <p className="service-card-description">{s.description}</p>

                {/* Tags */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
                  {s.tags.map((t) => (
                    <span
                      key={t}
                      style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        padding: '3px 8px',
                        borderRadius: '9999px',
                        background: 'var(--surface-charred-core)',
                        color: 'rgba(250, 174, 51, 0.85)',
                        border: '1px solid var(--color-cardamom-brown)',
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="service-card-footer">
                  <Link
                    href="/register"
                    className="btn btn-outline btn-sm"
                    style={{ fontSize: '11px', padding: '6px 14px' }}
                  >
                    Implementar
                  </Link>
                  <Link
                    href="/#contacto"
                    style={{
                      fontFamily: 'var(--font-graphikx)',
                      fontSize: '12px',
                      color: 'var(--color-tiger-gold)',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}
                  >
                    Detalles ➔
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
