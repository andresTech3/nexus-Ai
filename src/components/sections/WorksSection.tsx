'use client'

import { useState } from 'react'
import Image from 'next/image'

const showcaseProjects = [
  {
    id: 'case-1',
    tag: 'Impacto',
    tagClass: 'badge-alert',
    title: 'Campaña Multicanal E-Commerce',
    metric: '+340% Engagement orgánico con IA',
    subCategory: 'E-COMMERCE & D2C BRANDS',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
    client: 'Velocita D2C',
  },
  {
    id: 'case-2',
    tag: 'Conversión',
    tagClass: 'badge-gold',
    title: 'Optimización de Embudo & UX Cognitiva',
    metric: '+120% Incremento en Tasa de Conversión',
    subCategory: 'STARTUPS & HIGH-GROWTH SAAS',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    client: 'Aura Cloud',
  },
  {
    id: 'case-3',
    tag: 'Retención',
    tagClass: 'badge-secondary',
    title: 'Agentes Autónomos 24/7 de Soporte',
    metric: '85% Clientes retenidos a largo plazo',
    subCategory: 'CORPORATE & ENTERPRISE TEAMS',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    client: 'Nexus Global Corp',
  },
  {
    id: 'case-4',
    tag: 'Automatización',
    tagClass: 'badge-gold',
    title: 'Pipeline de Ventas & Scoring Predictivo',
    metric: '4.2x Velocidad de Cierre de Negocios',
    subCategory: 'B2B FINTECH & LOGÍSTICA',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    client: 'FinScale Enterprise',
  },
]

const categories = [
  { id: 'cat-1', name: 'Agentes Autónomos', count: '14 Casos' },
  { id: 'cat-2', name: 'Marketing & Contenido IA', count: '22 Casos' },
  { id: 'cat-3', name: 'Automatización de Procesos', count: '18 Casos' },
  { id: 'cat-4', name: 'Modelos Cognitivos Custom', count: '9 Casos' },
]

export default function WorksSection() {
  const [selectedSub, setSelectedSub] = useState<string | null>(null)

  return (
    <section className="section" id="trabajos">
      <div className="container">
        {/* Editorial Subhead Bar (from reference screenshot) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px dotted var(--color-tiger-gold)',
            paddingBottom: '16px',
            marginBottom: '32px',
          }}
        >
          <div style={{ fontFamily: 'var(--font-graphikx)', fontSize: '11px', fontWeight: 700, color: 'var(--color-tiger-gold)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            / CONFIANZA & LEGITIMIDAD
          </div>
          <div style={{ fontFamily: 'var(--font-graphikx)', fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            DIRECCIÓN DE ARQUITECTURA IA
          </div>
        </div>

        {/* Section Header Split Layout (Matches screenshot) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '40px',
            alignItems: 'flex-start',
            marginBottom: '48px',
          }}
        >
          <div>
            <h2 className="section-title">
              AVALADOS POR
              <br />
              <span style={{ color: '#ffffff' }}>➔ EQUIPOS EN ESCALABILIDAD</span>
            </h2>
          </div>

          <div>
            <p className="section-description" style={{ fontSize: '15px' }}>
              Desde startups en hipercrecimiento hasta corporativos consolidados, nos asociamos con
              equipos que exigen rendimiento medible, autonomía operativa y sofisticación visual.
            </p>

            <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => setSelectedSub(null)}
                style={{
                  background: selectedSub === null ? 'var(--color-tiger-gold)' : 'transparent',
                  color: selectedSub === null ? 'var(--color-charred-clove)' : 'var(--color-tiger-gold)',
                }}
              >
                Todos los Casos
              </button>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => setSelectedSub('E-COMMERCE & D2C BRANDS')}
                style={{
                  background: selectedSub === 'E-COMMERCE & D2C BRANDS' ? 'var(--color-tiger-gold)' : 'transparent',
                  color: selectedSub === 'E-COMMERCE & D2C BRANDS' ? 'var(--color-charred-clove)' : 'var(--color-tiger-gold)',
                }}
              >
                E-Commerce
              </button>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => setSelectedSub('CORPORATE & ENTERPRISE TEAMS')}
                style={{
                  background: selectedSub === 'CORPORATE & ENTERPRISE TEAMS' ? 'var(--color-tiger-gold)' : 'transparent',
                  color: selectedSub === 'CORPORATE & ENTERPRISE TEAMS' ? 'var(--color-charred-clove)' : 'var(--color-tiger-gold)',
                }}
              >
                Enterprise
              </button>
            </div>
          </div>
        </div>

        {/* Showcase Vertical Editorial Cards (Direct reproduction of screenshot grid) */}
        <div className="showcase-scroll" id="works-grid">
          {showcaseProjects
            .filter((p) => (selectedSub ? p.subCategory === selectedSub : true))
            .map((item) => (
              <div key={item.id} className="showcase-card" id={item.id}>
                {/* Image */}
                <div className="showcase-card-image">
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                  />
                </div>
                <div className="showcase-card-overlay" />

                {/* Content Overlay */}
                <div className="showcase-card-content">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className={`badge ${item.tagClass}`}>
                      {item.tag}
                    </span>
                    <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-graphikx)', textTransform: 'uppercase' }}>
                      {item.client}
                    </span>
                  </div>

                  <div>
                    <h3 className="showcase-title">{item.title}</h3>
                    <p className="showcase-metric">{item.metric}</p>
                    <div
                      style={{
                        marginTop: '12px',
                        paddingTop: '8px',
                        borderTop: '1px dotted rgba(250, 174, 51, 0.5)',
                        fontFamily: 'var(--font-graphikx)',
                        fontSize: '10px',
                        fontWeight: 700,
                        color: 'rgba(255,255,255,0.9)',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                      }}
                    >
                      {item.subCategory}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Categories Strip */}
        <div style={{ marginTop: '64px', borderTop: '1px dotted var(--color-tiger-gold)', paddingTop: '32px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '16px',
            }}
          >
            {categories.map((c) => (
              <div
                key={c.id}
                style={{
                  background: 'var(--surface-charred-core)',
                  border: '1px solid var(--color-cardamom-brown)',
                  borderRadius: '8px',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span style={{ fontFamily: 'var(--font-salmond)', fontSize: '14px', color: '#ffffff', fontWeight: 700 }}>
                  {c.name}
                </span>
                <span className="badge badge-secondary" style={{ fontSize: '10px' }}>
                  {c.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
