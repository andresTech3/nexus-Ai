'use client'

import { useState } from 'react'
import Image from 'next/image'

const tabs = ['Todos', 'Agentes IA', 'Automatización', 'Marketing', 'Chatbot', 'Analytics']

const works = [
  {
    id: 'work-1',
    title: 'Sistema de Agentes para E-commerce',
    category: 'Agentes IA',
    tags: ['Agentes IA'],
    image: '/ai-card.jpg',
    result: '340% ROI en 3 meses',
    client: 'RetailMax',
    duration: '8 semanas',
  },
  {
    id: 'work-2',
    title: 'Automatización de Pipeline de Ventas',
    category: 'Automatización',
    tags: ['Automatización'],
    image: '/automation-showcase.jpg',
    result: '85% menos tiempo manual',
    client: 'SalesForce Pro',
    duration: '4 semanas',
  },
  {
    id: 'work-3',
    title: 'Campaña de Marketing IA Multicanal',
    category: 'Marketing',
    tags: ['Marketing'],
    image: '/marketing-card.jpg',
    result: '2.4M alcance orgánico',
    client: 'BrandGrow',
    duration: '12 semanas',
  },
  {
    id: 'work-4',
    title: 'Chatbot de Soporte Inteligente',
    category: 'Chatbot',
    tags: ['Chatbot'],
    image: '/chatbot-card.jpg',
    result: '92% satisfacción cliente',
    client: 'TechSupport Co',
    duration: '6 semanas',
  },
  {
    id: 'work-5',
    title: 'Dashboard Analytics en Tiempo Real',
    category: 'Analytics',
    tags: ['Analytics'],
    image: '/hero-bg.jpg',
    result: 'Decisiones 10x más rápidas',
    client: 'DataDriven Inc',
    duration: '5 semanas',
  },
  {
    id: 'work-6',
    title: 'Plataforma CRM con IA Predictiva',
    category: 'Agentes IA',
    tags: ['Agentes IA'],
    image: '/marketing-card.jpg',
    result: '67% aumento en conversiones',
    client: 'SaaS Solutions',
    duration: '10 semanas',
  },
]

const categories = [
  { id: 'cat-ai', icon: '🤖', name: 'Agentes IA', color: '#9333ea' },
  { id: 'cat-music', icon: '🎵', name: 'Marketing & Contenido', color: '#7c3aed' },
  { id: 'cat-auto', icon: '⚡', name: 'Automatización', color: '#a855f7' },
  { id: 'cat-crm', icon: '👥', name: 'CRM & Ventas', color: '#9333ea' },
  { id: 'cat-analytics', icon: '📊', name: 'Analytics', color: '#8b5cf6' },
  { id: 'cat-chatbot', icon: '💬', name: 'Chatbots', color: '#7c3aed' },
]

export default function WorksSection() {
  const [activeTab, setActiveTab] = useState('Todos')

  const filtered = activeTab === 'Todos'
    ? works
    : works.filter((w) => w.tags.includes(activeTab))

  return (
    <section className="section" id="trabajos" style={{ position: 'relative' }}>
      {/* Background */}
      <div
        className="glow-orb glow-orb-violet"
        style={{ width: 500, height: 400, bottom: '10%', left: '-10%', opacity: 0.08 }}
      />

      <div className="container">
        {/* Header split layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'flex-start', marginBottom: '3rem' }}>
          <div>
            <div className="section-eyebrow">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              Trending IA
            </div>
            <h2 className="section-title">
              Nuestros{' '}
              <span className="gradient-text">Últimos Trabajos</span>
            </h2>
          </div>

          {/* Market News column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{
                width: 32, height: 32,
                background: 'linear-gradient(135deg, #9333ea, #7c3aed)',
                borderRadius: 6,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" stroke="white" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>/Draft /Crear /Conectar</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800 }}>
                  Noticias del Mercado
                </h3>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                {
                  title: 'Encuentra Arte Moderno en Plataformas de IA',
                  subtitle: 'Invierte en creatividad que perdura en el tiempo',
                  image: '/marketing-card.jpg',
                },
                {
                  title: '100% — Arte en la Era de la IA',
                  subtitle: 'Derechos digitales y propiedad intelectual asegurados',
                  image: '/ai-card.jpg',
                  highlight: true,
                },
              ].map((news, i) => (
                <div key={i} className="news-card" id={`news-card-${i}`}>
                  <div className="news-card-image">
                    <Image src={news.image} alt={news.title} fill style={{ objectFit: 'cover' }} />
                  </div>
                  <div className="news-card-content">
                    <div className="news-card-title">{news.title}</div>
                    <div className="news-card-meta">
                      <span>{news.subtitle}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '0.5rem' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M9 18l6-6-6-6" stroke="rgba(147,51,234,0.6)" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="works-tabs" id="works-tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`works-tab ${activeTab === tab ? 'active' : ''}`}
              id={`works-tab-${tab.toLowerCase().replace(/\s/g, '-')}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Works grid */}
        <div className="works-grid" id="works-grid">
          {filtered.map((work) => (
            <div key={work.id} className="work-card" id={work.id}>
              <div className="work-card-image">
                <Image
                  src={work.image}
                  alt={work.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: 'cover' }}
                />
                <div className="work-card-overlay" />
                {/* Result badge */}
                <div style={{
                  position: 'absolute',
                  top: '0.75rem',
                  right: '0.75rem',
                  background: 'rgba(147,51,234,0.85)',
                  backdropFilter: 'blur(8px)',
                  padding: '0.3rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'white',
                }}>
                  {work.result}
                </div>
              </div>

              <div className="work-card-info">
                <div className="work-card-category">{work.category}</div>
                <div className="work-card-title">{work.title}</div>
                <div className="work-card-meta">
                  <span>{work.client}</span>
                  <span>•</span>
                  <span>{work.duration}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Categories bottom section */}
        <div style={{ marginTop: '5rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700 }}>
              Categorías principales
            </h3>
          </div>
          <div className="categories-grid" id="categories-grid">
            {categories.map((cat) => (
              <div key={cat.id} className="category-item" id={cat.id}>
                <div
                  className="category-icon"
                  style={{ background: `${cat.color}20`, border: `1px solid ${cat.color}40` }}
                >
                  {cat.icon}
                </div>
                <span className="category-name">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
