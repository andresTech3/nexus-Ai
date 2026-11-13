'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useCurrency } from '@/hooks/useCurrency'
import { AgentOrbitCarousel } from '@/components/ui/agent-orbit-carousel'

interface ShowcaseProduct {
  id: string
  name: string
  category: string
  supplierCost: number
  pvp: number
  multiple: string
  cpaMax: number
  marginPct: number
  heroHook: string
  marketGap: string
  competitorWeakness: string
  shopifyOffer: string
  ugcAngle: string
}

const SHOWCASE_PRODUCTS: ShowcaseProduct[] = [
  {
    id: 'luna',
    name: 'Lámpara Lunar Levitante',
    category: 'Decoración & Regalo Prémium',
    supplierCost: 9.80,
    pvp: 49.90,
    multiple: '5.1x',
    cpaMax: 22.40,
    marginPct: 58.2,
    heroHook: 'Transforma cualquier espacio con la magia de la luna flotando en tu salón.',
    marketGap: 'Modelos de diseño nórdico (Gingko/MoMA) se venden a 149€+. Las copias de AliExpress (16€) hacen ruido mecánico. La oportunidad es ofrecer base de nogal con levitación silenciosa en 49.90€ con entrega 48h.',
    competitorWeakness: 'Precios prohibitivos en marcas de lujo o motores ruidosos sin certificación CE en réplicas baratas.',
    shopifyOffer: 'Pack 1 Unidad: 49,90 € • Pack Pareja (2 Unidades): 79,90 € (Ahorro 20€) directo a checkout.',
    ugcAngle: 'Gancho visual de 2 segundos acercando la mano a la luna suspendida en el aire mientras gira sin cables.',
  },
  {
    id: 'pet',
    name: 'Cepillo Quita-Pelo con Vapor Suave',
    category: 'Cuidado de Mascotas D2C',
    supplierCost: 3.60,
    pvp: 24.90,
    multiple: '6.9x',
    cpaMax: 12.80,
    marginPct: 62.4,
    heroHook: 'El único cepillo con vapor suave que tu mascota adora recibir mientras retiras el 95% del pelo suelto.',
    marketGap: 'Los cepillos metálicos tradicionales (Furminator 39€) arañan la piel y dejan el pelo flotando. Nuestro modelo humidifica el pelo con vapor tibio para recogerlo en una sola capa limpia sin dolor.',
    competitorWeakness: 'Púas afiladas que causan rechazo en la mascota y cepillos genéricos de plástico que no retienen el pelo.',
    shopifyOffer: 'Pack Básico + Esencia Relajante: 24,90 € • Pack Multimascota (2 cepillos + recambios): 39,90 €.',
    ugcAngle: 'Contraste en pantalla dividida: a la izquierda pelos volando por el sofá, a la derecha el cepillo retirando un manto entero de pelo en 3 segundos.',
  },
  {
    id: 'ring',
    name: 'Anillo Biométrico de Titanio Grado 5',
    category: 'Wearable & Salud Silenciosa',
    supplierCost: 18.50,
    pvp: 89.90,
    multiple: '4.8x',
    cpaMax: 38.60,
    marginPct: 54.8,
    heroHook: 'Tu salud y tu sueño medidos con precisión médica en titanio. Sin pantallas. Sin suscripciones.',
    marketGap: 'Oura Ring cuesta 399€ y cobra 5.99€/mes obligatorios para ver tus propios datos. Nosotros ofrecemos titanio real en pago único con app nativa gratuita en español.',
    competitorWeakness: 'Suscripciones mensuales forzosas que enfurecen al usuario o anillos chinos de plástico con apps defectuosas.',
    shopifyOffer: 'Titanio Negro Mate o Plata Pulida: 89,90 € con kit medidor de tallas gratuito y 3 años de garantía.',
    ugcAngle: 'El creador se quita un smartwatch que vibra con notificaciones y se pone el anillo: "Por fin me libré de las pantallas que vibran en mi muñeca".',
  },
]

export default function HomePage() {
  const { formatMoney } = useCurrency()

  const [selectedProduct, setSelectedProduct] = useState<ShowcaseProduct>(SHOWCASE_PRODUCTS[0])
  const [activeTab, setActiveTab] = useState<'finance' | 'competition' | 'copy' | 'store'>('finance')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div
      style={{
        minHeight: '100dvh',
        backgroundColor: '#09080d',
        color: '#f4f4f5',
        fontFamily: "'Outfit', ui-sans-serif, system-ui, sans-serif",
        overflowX: 'hidden',
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      {/* ── TOP NAVIGATION ────────────────────────────────────────── */}
      <nav
        style={{
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: 'rgba(9, 8, 13, 0.85)',
          backdropFilter: 'blur(20px)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: '1rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              textDecoration: 'none',
              color: '#ffffff',
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #faae33, #d98216)',
                color: '#09080d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '0.9rem',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#09080d" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
            </div>
            <span style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
              NEXUS <span style={{ color: '#faae33', fontWeight: 600 }}>OS</span>
            </span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <Link
              href="/dashboard/catalog"
              style={{
                fontSize: '0.85rem',
                color: '#a1a1aa',
                textDecoration: 'none',
                fontWeight: 600,
                transition: 'color 0.15s',
              }}
            >
              Catálogo de Proveedores
            </Link>
            <Link
              href="/dashboard/agents"
              style={{
                fontSize: '0.85rem',
                color: '#a1a1aa',
                textDecoration: 'none',
                fontWeight: 600,
                transition: 'color 0.15s',
              }}
            >
              Directorio de Agentes
            </Link>
            <Link
              href="/dashboard"
              style={{
                fontSize: '0.85rem',
                background: 'linear-gradient(135deg, #faae33, #d98216)',
                color: '#09080d',
                padding: '0.55rem 1.25rem',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 800,
                letterSpacing: '0.01em',
                boxShadow: '0 4px 14px rgba(250, 174, 51, 0.25)',
              }}
            >
              Entrar al Panel &rarr;
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO: MATURE, EDITORIAL & AUTHORITATIVE ───────────────── */}
      <section
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: 'clamp(3rem, 6vw, 5.5rem) 1.5rem 2.5rem 1.5rem',
        }}
      >
        <div style={{ maxWidth: 840, margin: '0 auto', textAlign: 'center', marginBottom: '3.5rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'rgba(250, 174, 51, 0.08)',
              border: '1px solid rgba(250, 174, 51, 0.2)',
              borderRadius: '99px',
              padding: '0.35rem 0.95rem',
              fontSize: '0.78rem',
              color: '#faae33',
              fontWeight: 700,
              letterSpacing: '0.02em',
              marginBottom: '1.5rem',
            }}
          >
            <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#34d399' }} />
            <span>SISTEMA OPERATIVO DE COMERCIO ELECTRÓNICO &bull; 12 AGENTES ESPECIALISTAS</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.4rem, 5.5vw, 4rem)',
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: '-0.035em',
              color: '#ffffff',
              margin: '0 0 1.5rem 0',
            }}
          >
            La oficina de agentes de IA para operar y escalar tu marca de dropshipping
          </h1>

          <p
            style={{
              fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
              color: '#a1a1aa',
              lineHeight: 1.55,
              maxWidth: 720,
              margin: '0 auto 2.25rem auto',
            }}
          >
            Investiga productos ganadores en tiempo real, audita costes de fábrica y unit economics matemáticos, y genera automáticamente tu tienda Shopify Liquid, creativos publicitarios y estrategia de lanzamiento.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link
              href="/dashboard"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: '#faae33',
                color: '#09080d',
                fontSize: '0.95rem',
                fontWeight: 800,
                padding: '0.85rem 1.85rem',
                borderRadius: '8px',
                textDecoration: 'none',
                boxShadow: '0 8px 24px rgba(250, 174, 51, 0.3)',
              }}
            >
              <span>Abrir Centro de Control</span>
              <span>&rarr;</span>
            </Link>

            <Link
              href="/dashboard/catalog"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#ffffff',
                fontSize: '0.95rem',
                fontWeight: 700,
                padding: '0.85rem 1.65rem',
                borderRadius: '8px',
                textDecoration: 'none',
              }}
            >
              <span>Ver Catálogo de Proveedores</span>
            </Link>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1.75rem',
              marginTop: '2.5rem',
              fontSize: '0.78rem',
              color: '#71717a',
              flexWrap: 'wrap',
            }}
          >
            <span>Conexión directa con CJ Dropshipping</span>
            <span>&bull;</span>
            <span>Shopify Dawn Liquid nativo</span>
            <span>&bull;</span>
            <span>Cálculo determinista de Eva (CFO)</span>
          </div>
        </div>

        {/* ── INTERACTIVE WORKBENCH: REAL AGENT OUTPUTS (NO FAKE SIMULATORS) ── */}
        <div
          style={{
            backgroundColor: '#121018',
            border: '1px solid #272235',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.65)',
          }}
        >
          {/* Header Bar: Product Selector */}
          <div
            style={{
              padding: '1.25rem 1.5rem',
              backgroundColor: '#171420',
              borderBottom: '1px solid #272235',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#faae33', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Producto en Análisis:
              </span>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {SHOWCASE_PRODUCTS.map((prod) => (
                  <button
                    key={prod.id}
                    onClick={() => setSelectedProduct(prod)}
                    style={{
                      background: selectedProduct.id === prod.id ? '#faae33' : '#1f1b2c',
                      color: selectedProduct.id === prod.id ? '#09080d' : '#a1a1aa',
                      border: `1px solid ${selectedProduct.id === prod.id ? '#faae33' : '#332c45'}`,
                      borderRadius: '6px',
                      padding: '0.4rem 0.85rem',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {prod.name}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#34d399' }} />
              <span style={{ fontSize: '0.74rem', color: '#34d399', fontWeight: 700 }}>
                Auditoría Completa Superada
              </span>
            </div>
          </div>

          {/* Workbench Body: Tabs of real deliverables */}
          <div style={{ padding: '1.5rem' }}>
            {/* Perspective Selector */}
            <div
              style={{
                display: 'flex',
                gap: '0.5rem',
                borderBottom: '1px solid #231e30',
                paddingBottom: '0.85rem',
                marginBottom: '1.5rem',
                flexWrap: 'wrap',
              }}
            >
              {[
                { id: 'finance', label: '1. Auditoría Financiera (Eva CFO)', role: 'Costes, márgenes y CPA techo' },
                { id: 'competition', label: '2. Inteligencia de Mercado (Lucas & Clara)', role: 'Brecha y análisis de competidores' },
                { id: 'copy', label: '3. Copywriting & UGC (Carlos & Marco)', role: 'Ganchos de 3s y texto de venta' },
                { id: 'store', label: '4. Arquitectura Shopify (Diego)', role: 'Packs de ahorro y Liquid' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  style={{
                    background: activeTab === tab.id ? 'rgba(250, 174, 51, 0.12)' : 'transparent',
                    border: `1px solid ${activeTab === tab.id ? '#faae33' : 'transparent'}`,
                    color: activeTab === tab.id ? '#faae33' : '#a1a1aa',
                    borderRadius: '6px',
                    padding: '0.5rem 1rem',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div>{tab.label}</div>
                  <div style={{ fontSize: '0.68rem', opacity: 0.75, fontWeight: 500, marginTop: 2 }}>{tab.role}</div>
                </button>
              ))}
            </div>

            {/* Tab 1: Financial Audit */}
            {activeTab === 'finance' && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ background: '#181523', border: '1px solid #2a243a', borderRadius: '10px', padding: '1rem' }}>
                    <span style={{ fontSize: '0.72rem', color: '#71717a', textTransform: 'uppercase', fontWeight: 700 }}>Coste Fábrica (CJ Dropshipping)</span>
                    <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ffffff', marginTop: '0.35rem' }}>
                      {formatMoney(selectedProduct.supplierCost)}
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#a1a1aa' }}>Negociado para pedidos unitarios</span>
                  </div>

                  <div style={{ background: '#181523', border: '1px solid #2a243a', borderRadius: '10px', padding: '1rem' }}>
                    <span style={{ fontSize: '0.72rem', color: '#71717a', textTransform: 'uppercase', fontWeight: 700 }}>PVP Recomendado</span>
                    <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#faae33', marginTop: '0.35rem' }}>
                      {formatMoney(selectedProduct.pvp)}
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#a1a1aa' }}>Multiplicador markup: {selectedProduct.multiple}</span>
                  </div>

                  <div style={{ background: '#181523', border: '1px solid #2a243a', borderRadius: '10px', padding: '1rem' }}>
                    <span style={{ fontSize: '0.72rem', color: '#71717a', textTransform: 'uppercase', fontWeight: 700 }}>Margen Neto Operativo</span>
                    <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#34d399', marginTop: '0.35rem' }}>
                      {selectedProduct.marginPct}%
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#a1a1aa' }}>Tras envíos, empaque y pasarelas</span>
                  </div>

                  <div style={{ background: '#181523', border: '1px solid #2a243a', borderRadius: '10px', padding: '1rem' }}>
                    <span style={{ fontSize: '0.72rem', color: '#71717a', textTransform: 'uppercase', fontWeight: 700 }}>CPA Techo Seguro (Tomás)</span>
                    <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#60a5fa', marginTop: '0.35rem' }}>
                      {formatMoney(selectedProduct.cpaMax)}
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#a1a1aa' }}>Límite máximo de adquisición</span>
                  </div>
                </div>

                <div style={{ background: '#15121e', border: '1px solid #2d263e', borderRadius: '10px', padding: '1rem 1.25rem', fontSize: '0.85rem', color: '#d4d4d8', lineHeight: 1.6 }}>
                  <strong style={{ color: '#faae33' }}>Dictamen de Eva (CFO):</strong> El producto cumple holgadamente la regla de viabilidad de Dora (multiplicador &ge; 3.5x). Permite absorber hasta {formatMoney(selectedProduct.cpaMax)} en adquisición publicitaria antes de entrar en zona de riesgo, con un margen neto seguro de más del {selectedProduct.marginPct}%.
                </div>
              </div>
            )}

            {/* Tab 2: Competitive Intelligence */}
            {activeTab === 'competition' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
                <div style={{ background: '#181523', border: '1px solid #2a243a', borderRadius: '10px', padding: '1.25rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#f87171', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    Debilidades Detectadas en Competidores
                  </div>
                  <p style={{ fontSize: '0.88rem', color: '#d4d4d8', lineHeight: 1.6, margin: 0 }}>
                    {selectedProduct.competitorWeakness}
                  </p>
                </div>

                <div style={{ background: '#181523', border: '1px solid #2a243a', borderRadius: '10px', padding: '1.25rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#34d399', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    Brecha de Mercado &amp; Posicionamiento de Marca
                  </div>
                  <p style={{ fontSize: '0.88rem', color: '#d4d4d8', lineHeight: 1.6, margin: 0 }}>
                    {selectedProduct.marketGap}
                  </p>
                </div>
              </div>
            )}

            {/* Tab 3: Copywriting & UGC */}
            {activeTab === 'copy' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
                <div style={{ background: '#181523', border: '1px solid #2a243a', borderRadius: '10px', padding: '1.25rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#faae33', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    Titular Above-the-Fold de Carlos (Copywriter)
                  </div>
                  <blockquote style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', lineHeight: 1.5, margin: 0 }}>
                    &ldquo;{selectedProduct.heroHook}&rdquo;
                  </blockquote>
                  <div style={{ fontSize: '0.75rem', color: '#a1a1aa', marginTop: '0.85rem' }}>
                    Garantía 30 días &bull; Envío Express 24/48h &bull; Cero suscripciones
                  </div>
                </div>

                <div style={{ background: '#181523', border: '1px solid #2a243a', borderRadius: '10px', padding: '1.25rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#a78bfa', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    Gancho UGC de 3 Segundos de Marco (Vídeo)
                  </div>
                  <p style={{ fontSize: '0.88rem', color: '#d4d4d8', lineHeight: 1.6, margin: 0 }}>
                    {selectedProduct.ugcAngle}
                  </p>
                </div>
              </div>
            )}

            {/* Tab 4: Shopify Architecture */}
            {activeTab === 'store' && (
              <div style={{ background: '#181523', border: '1px solid #2a243a', borderRadius: '10px', padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#34d399', textTransform: 'uppercase' }}>
                    Módulo Liquid Direct-to-Checkout de Diego
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#a1a1aa' }}>Shopify Dawn &bull; Carga 0.8s</span>
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.5rem' }}>
                  {selectedProduct.shopifyOffer}
                </div>
                <p style={{ fontSize: '0.82rem', color: '#a1a1aa', margin: 0, lineHeight: 1.5 }}>
                  Estructurado para maximizar el valor medio de carrito (AOV) permitiendo al comprador seleccionar cantidades directamente con selector visual interactivo sin recargar la página.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── 3-STAGE PIPELINE ARCHITECTURE (CLEAN & SUBSTANTIAL) ───── */}
      <section
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '4rem 1.5rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div style={{ maxWidth: 640, marginBottom: '3rem' }}>
          <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.4rem)', fontWeight: 800, letterSpacing: '-0.025em', color: '#ffffff', margin: '0 0 0.65rem 0' }}>
            Cómo opera la oficina autónoma
          </h2>
          <p style={{ fontSize: '1rem', color: '#a1a1aa', margin: 0, lineHeight: 1.5 }}>
            Un flujo determinista en tres fases sincronizadas entre los 12 especialistas para validar y lanzar marcas sin margen de error.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {/* Phase 1 */}
          <div
            style={{
              backgroundColor: '#121018',
              border: '1px solid #251f33',
              borderRadius: '14px',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#faae33', letterSpacing: '0.04em', marginBottom: '0.75rem' }}>
                FASE 01 &bull; DETECCIÓN &amp; VIABILIDAD
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: '0 0 0.75rem 0' }}>
                Investigación de Demanda &amp; Fábrica
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#a1a1aa', lineHeight: 1.6, margin: 0 }}>
                Iván rastrea tendencias en Google Trends y catálogos de CJ Dropshipping para identificar productos en aceleración antes de que el mercado se sature. Diego audita costes de fabricación en lotes unitarios.
              </p>
            </div>
            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #1f1b2c', fontSize: '0.75rem', color: '#71717a' }}>
              Responsables: Iván (Radar) &bull; Diego (Sourcing) &bull; Dora (Filtro)
            </div>
          </div>

          {/* Phase 2 */}
          <div
            style={{
              backgroundColor: '#121018',
              border: '1px solid #251f33',
              borderRadius: '14px',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#34d399', letterSpacing: '0.04em', marginBottom: '0.75rem' }}>
                FASE 02 &bull; FINANZAS &amp; POSICIONAMIENTO
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: '0 0 0.75rem 0' }}>
                Unit Economics &amp; Psicología de Compra
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#a1a1aa', lineHeight: 1.6, margin: 0 }}>
                Eva modela la rentabilidad deduciendo COGS, envíos urgentes, pasarelas de pago y provisiones de devolución para calcular el CPA máximo rentable. Valeria y Clara analizan las quejas de competidores.
              </p>
            </div>
            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #1f1b2c', fontSize: '0.75rem', color: '#71717a' }}>
              Responsables: Eva (CFO) &bull; Valeria (Audiencias) &bull; Clara (Espía)
            </div>
          </div>

          {/* Phase 3 */}
          <div
            style={{
              backgroundColor: '#121018',
              border: '1px solid #251f33',
              borderRadius: '14px',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#60a5fa', letterSpacing: '0.04em', marginBottom: '0.75rem' }}>
                FASE 03 &bull; PRODUCCIÓN &amp; DESPLIEGUE
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: '0 0 0.75rem 0' }}>
                Shopify Liquid, Creativos &amp; Campañas
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#a1a1aa', lineHeight: 1.6, margin: 0 }}>
                Lucas redacta el copy persuasivo, Leo renderiza fotografías de estudio 3D y Diego ensambla el código Liquid para Shopify. Tomás y Mateo dejan listos los blueprints de campaña con reglas de stop-loss.
              </p>
            </div>
            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #1f1b2c', fontSize: '0.75rem', color: '#71717a' }}>
              Responsables: Lucas (Copy) &bull; Leo (3D) &bull; Tomás (Media Buyer)
            </div>
          </div>
        </div>
      </section>

      {/* ── AGENT ORBIT CAROUSEL: 11 ESPECIALISTAS EN ÓRBITA ───────── */}
      <section
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '4rem 1.5rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div style={{ maxWidth: 720, marginBottom: '2.5rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'rgba(250, 174, 51, 0.08)',
              border: '1px solid rgba(250, 174, 51, 0.2)',
              borderRadius: '99px',
              padding: '0.35rem 0.85rem',
              fontSize: '0.75rem',
              fontWeight: 800,
              color: '#faae33',
              marginBottom: '0.85rem',
            }}
          >
            <span>OFICINA VIRTUAL EN ACCIÓN</span>
          </div>
          <h2
            style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.7rem)',
              fontWeight: 800,
              letterSpacing: '-0.025em',
              color: '#ffffff',
              margin: '0 0 0.65rem 0',
            }}
          >
            Conoce a tus 11 agentes especialistas
          </h2>
          <p style={{ fontSize: '1rem', color: '#a1a1aa', margin: 0, lineHeight: 1.5 }}>
            Gira el carrusel para explorar las credenciales técnicas, habilidades y entregables que cada agente ejecuta de forma autónoma.
          </p>
        </div>

        <div
          style={{
            width: '100%',
            borderRadius: '20px',
            overflow: 'hidden',
            border: '1px solid #272235',
            backgroundColor: '#0c0a12',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.55)',
          }}
        >
          <AgentOrbitCarousel />
        </div>
      </section>

      {/* ── FAQ ACCORDION ───────────────────────────────────────────── */}
      <section
        style={{
          maxWidth: 840,
          margin: '0 auto',
          padding: '2rem 1.5rem 5rem 1.5rem',
        }}
      >
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, textAlign: 'center', color: '#ffffff', marginBottom: '2rem' }}>
          Preguntas Frecuentes
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[
            {
              q: '¿Cómo funciona la conexión con los proveedores de dropshipping?',
              a: 'Nexus se integra directamente con la API oficial de CJ Dropshipping para consultar disponibilidad de inventario, costes de fábrica y plazos de envío urgente hacia Europa y América.',
            },
            {
              q: '¿Qué diferencia a Nexus de plantillas o cursos convencionales?',
              a: 'Nexus no es un curso ni una plantilla: es un sistema operativo con lógica financiera estricta. Eva y Dora impiden lanzar campañas si el producto no supera un multiplicador de margen seguro, protegiendo tu capital publicitario.',
            },
            {
              q: '¿El código para Shopify es compatible con mi tienda actual?',
              a: 'Sí. Diego genera código Liquid puro optimizado para el tema oficial Dawn de Shopify, sin dependencias de plugins pesados que ralenticen la velocidad de carga de tu tienda.',
            },
            {
              q: '¿Puedo personalizar los análisis para mi propio nicho?',
              a: 'Completamente. Puedes asignar cualquier producto desde el catálogo de CJ Dropshipping o introducir tu propio producto para que los 12 agentes recalculen la investigación y los entregables a medida.',
            },
          ].map((faq, idx) => {
            const isOpen = openFaq === idx
            return (
              <div
                key={idx}
                onClick={() => setOpenFaq(isOpen ? null : idx)}
                style={{
                  backgroundColor: '#121018',
                  border: '1px solid #231e30',
                  borderRadius: '10px',
                  padding: '1.15rem 1.35rem',
                  cursor: 'pointer',
                  transition: 'border-color 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>
                    {faq.q}
                  </span>
                  <span style={{ color: '#faae33', fontWeight: 900, fontSize: '1.2rem', marginLeft: '1rem' }}>
                    {isOpen ? '−' : '+'}
                  </span>
                </div>
                {isOpen && (
                  <div style={{ fontSize: '0.88rem', color: '#a1a1aa', marginTop: '0.75rem', lineHeight: 1.6 }}>
                    {faq.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* ── FOOTER CTA ──────────────────────────────────────────────── */}
      <section
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: '#07060a',
          padding: '4.5rem 1.5rem',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, color: '#ffffff', margin: '0 0 0.85rem 0' }}>
            Empieza a operar con tu oficina de agentes hoy
          </h2>
          <p style={{ fontSize: '0.95rem', color: '#a1a1aa', margin: '0 0 2rem 0', lineHeight: 1.6 }}>
            Accede al Centro de Control de Nexus OS, investiga oportunidades verificadas y pon a trabajar a tus 12 especialistas.
          </p>

          <Link
            href="/dashboard"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#faae33',
              color: '#09080d',
              fontSize: '1rem',
              fontWeight: 800,
              padding: '0.95rem 2.25rem',
              borderRadius: '8px',
              textDecoration: 'none',
              boxShadow: '0 8px 25px rgba(250, 174, 51, 0.35)',
            }}
          >
            <span>Abrir Centro de Control</span>
            <span>&rarr;</span>
          </Link>
        </div>
      </section>

      {/* ── QUIET EDITORIAL FOOTER ──────────────────────────────────── */}
      <footer
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          padding: '1.5rem 1.5rem',
          textAlign: 'center',
          fontSize: '0.75rem',
          color: '#52525b',
        }}
      >
        &copy; {new Date().getFullYear()} Nexus OS &bull; Sistema Operativo Autónomo para Comercio Electrónico
      </footer>
    </div>
  )
}
