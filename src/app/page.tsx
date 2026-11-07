'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useCurrency } from '@/hooks/useCurrency'

interface DemoProduct {
  id: string
  name: string
  emoji: string
  badge: string
  price: number
  supplierCost: number
  profit: number
  videoUrl: string
  tagline: string
  rating: string
  ordersCount: number
}

const PRODUCTS: DemoProduct[] = [
  {
    id: 'luna',
    name: 'Lámpara Lunar Levitante',
    emoji: '🌕',
    badge: 'MÁS VENDIDO',
    price: 49,
    supplierCost: 12,
    profit: 37,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    tagline: 'Flota y gira mágicamente en el aire con luz cálida.',
    rating: '4.9 (1.240 opiniones)',
    ordersCount: 3820,
  },
  {
    id: 'pet',
    name: 'Cepillo Quita-Pelo Mascotas',
    emoji: '🐶',
    badge: 'VIRAL EN REDES',
    price: 25,
    supplierCost: 5,
    profit: 20,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    tagline: 'Quita el pelo suelto con vapor suave sin tirones.',
    rating: '4.8 (890 opiniones)',
    ordersCount: 4610,
  },
  {
    id: 'galaxy',
    name: 'Proyector Galaxia 360°',
    emoji: '✨',
    badge: 'TENDENCIA HOY',
    price: 39,
    supplierCost: 9,
    profit: 30,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    tagline: 'Convierte el techo en un cielo estrellado con nebulosas.',
    rating: '4.9 (2.150 opiniones)',
    ordersCount: 5120,
  },
  {
    id: 'watch',
    name: 'Reloj Fitness Deportivo',
    emoji: '⌚',
    badge: 'ALTA GANANCIA',
    price: 59,
    supplierCost: 17,
    profit: 42,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    tagline: 'Pulsómetro, pasos y notificaciones en tu muñeca.',
    rating: '4.7 (720 opiniones)',
    ordersCount: 2940,
  },
]

export default function HomePage() {
  const { formatMoney } = useCurrency()

  const [activeProduct, setActiveProduct] = useState<DemoProduct>(PRODUCTS[0])
  const [salesPerDay, setSalesPerDay] = useState<number>(15)
  const [activeCapability, setActiveCapability] = useState<number>(0)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [videoModal, setVideoModal] = useState<string | null>(null)

  // Calculations
  const monthlyOrders = salesPerDay * 30
  const monthlyRevenue = monthlyOrders * activeProduct.price
  const monthlySupplier = monthlyOrders * activeProduct.supplierCost
  const monthlyNetProfit = monthlyOrders * activeProduct.profit

  return (
    <div
      style={{
        minHeight: '100dvh',
        backgroundColor: '#0a090e',
        color: '#f4f4f5',
        fontFamily: "'Jost', 'Outfit', sans-serif",
        overflowX: 'hidden',
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      {/* ── MINIMAL TOP BAR ────────────────────────────────────────── */}
      <nav
        style={{
          borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
          backgroundColor: 'rgba(10, 9, 14, 0.85)',
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
                background: '#faae33',
                color: '#09080d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '1rem',
              }}
            >
              ⚡
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
              NEXUS<span style={{ color: '#faae33' }}>AI</span>
            </span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link
              href="/dashboard/catalog"
              style={{
                fontSize: '0.85rem',
                color: '#a1a1aa',
                textDecoration: 'none',
                fontWeight: 600,
                padding: '0.4rem 0.6rem',
              }}
            >
              Catálogo
            </Link>
            <Link
              href="/dashboard"
              style={{
                fontSize: '0.85rem',
                background: '#faae33',
                color: '#09080d',
                padding: '0.55rem 1.25rem',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 800,
                letterSpacing: '0.01em',
                transition: 'transform 150ms cubic-bezier(0.2, 0.8, 0.2, 1)',
              }}
            >
              Entrar al Panel &rarr;
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO (DIRECTION: THE PRODUCT PERFORMS) ────────────────── */}
      <section
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: 'clamp(2.5rem, 5vw, 4.5rem) 1.5rem 2rem 1.5rem',
        }}
      >
        <div style={{ maxWidth: 760, marginBottom: '2.5rem' }}>
          <h1
            style={{
              fontSize: 'clamp(2.3rem, 5.5vw, 4.2rem)',
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: '-0.035em',
              color: '#ffffff',
              margin: '0 0 1.25rem 0',
            }}
          >
            Vende productos virales sin comprar stock
          </h1>

          <p
            style={{
              fontSize: 'clamp(1.05rem, 2vw, 1.3rem)',
              color: '#a1a1aa',
              lineHeight: 1.45,
              margin: '0 0 1.75rem 0',
              maxWidth: 620,
            }}
          >
            Elige qué vender, la inteligencia artificial monta tu tienda y tú cobras la ganancia de cada pedido directo en tu banco.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link
              href="/dashboard"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: '#faae33',
                color: '#0a090e',
                fontSize: '0.95rem',
                fontWeight: 800,
                padding: '0.85rem 1.85rem',
                borderRadius: '8px',
                textDecoration: 'none',
                transition: 'transform 150ms ease',
              }}
            >
              <span>Empezar Gratis</span>
              <span>&rarr;</span>
            </Link>
            <span style={{ fontSize: '0.82rem', color: '#71717a' }}>
              Sin tarjeta de crédito requerida &bull; Listo en 2 minutos
            </span>
          </div>
        </div>

        {/* ── THE LIVE WORKING FRAGMENT (DATA-UI) ───────────────────── */}
        <div
          data-ui="interactive-workbench"
          style={{
            background: '#110f18',
            border: '1px solid #282336',
            borderRadius: '16px',
            padding: 'clamp(1rem, 3vw, 2rem)',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6)',
          }}
        >
          {/* Top Workbench Bar: Live Selector */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div
              style={{
                fontSize: '0.78rem',
                color: '#a1a1aa',
                fontWeight: 700,
                marginBottom: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              1. Toca un producto para probarlo en vivo:
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '0.65rem',
              }}
            >
              {PRODUCTS.map((prod) => {
                const isSelected = activeProduct.id === prod.id
                return (
                  <button
                    key={prod.id}
                    onClick={() => setActiveProduct(prod)}
                    style={{
                      background: isSelected ? 'rgba(250, 174, 51, 0.12)' : '#161420',
                      border: `2px solid ${isSelected ? '#faae33' : '#231f2e'}`,
                      borderRadius: '12px',
                      padding: '0.75rem 0.6rem',
                      color: '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      gap: '0.25rem',
                      textAlign: 'left',
                      transition: 'border 150ms ease, background 150ms ease',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                      <span style={{ fontSize: '1.6rem' }}>{prod.emoji}</span>
                      <span
                        style={{
                          fontSize: '0.65rem',
                          color: '#34d399',
                          background: 'rgba(52, 211, 153, 0.12)',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontWeight: 800,
                        }}
                      >
                        +{formatMoney(prod.profit)}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, marginTop: 4 }}>
                      {prod.name}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Center Stage: Split between Simulated Customer Store and Merchant Payout */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {/* Left: What the customer sees in your store */}
            <div
              style={{
                background: '#161420',
                border: '1px solid #2a2538',
                borderRadius: '12px',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      color: '#faae33',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}
                  >
                    Tu Tienda Online (Vista del Cliente)
                  </span>
                  <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 700 }}>
                    ● En línea y lista
                  </span>
                </div>

                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.25rem' }}>
                  {activeProduct.name}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#a1a1aa', marginBottom: '0.85rem' }}>
                  {activeProduct.tagline}
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '1.85rem', fontWeight: 900, color: '#ffffff' }}>
                    {formatMoney(activeProduct.price)}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: '#71717a', textDecoration: 'line-through' }}>
                    {formatMoney(activeProduct.price * 1.6)}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 700 }}>
                    Envío Gratis 24/48h
                  </span>
                </div>

                <div
                  style={{
                    backgroundColor: '#1d1a29',
                    borderRadius: '8px',
                    padding: '0.65rem 0.85rem',
                    fontSize: '0.75rem',
                    color: '#d4d4d8',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '1rem',
                  }}
                >
                  <span>⭐ {activeProduct.rating}</span>
                  <span style={{ color: '#52525b' }}>&bull;</span>
                  <span>{activeProduct.ordersCount} personas ya lo han pedido</span>
                </div>
              </div>

              <div>
                <button
                  onClick={() => setVideoModal(activeProduct.videoUrl)}
                  style={{
                    width: '100%',
                    background: '#231e30',
                    border: '1px solid #3d3550',
                    color: '#ffffff',
                    padding: '0.65rem',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    marginBottom: '0.65rem',
                  }}
                >
                  <span>▶</span>
                  <span>Ver anuncio en vídeo del producto</span>
                </button>

                <div
                  style={{
                    width: '100%',
                    background: '#10b981',
                    color: '#062817',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    fontSize: '0.88rem',
                    fontWeight: 900,
                    textAlign: 'center',
                  }}
                >
                  Botón: Comprar Ahora con Tarjeta o Bizum
                </div>
              </div>
            </div>

            {/* Right: What you receive in your bank */}
            <div
              style={{
                background: '#161420',
                border: '1px solid #2a2538',
                borderRadius: '12px',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      color: '#34d399',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}
                  >
                    Tu Liquidación Mensual Estimada
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#faae33', fontWeight: 800 }}>
                    {salesPerDay} ventas/día
                  </span>
                </div>

                {/* Slider */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    step="1"
                    value={salesPerDay}
                    onChange={(e) => setSalesPerDay(Number(e.target.value))}
                    style={{
                      width: '100%',
                      height: '8px',
                      accentColor: '#faae33',
                      cursor: 'pointer',
                      borderRadius: '4px',
                      marginBottom: '0.5rem',
                    }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#71717a' }}>
                    <span>1 al día (Tranquilo)</span>
                    <span>15 al día (Sólido)</span>
                    <span>50 al día (Escala)</span>
                  </div>
                </div>

                {/* Accounting breakdown */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#a1a1aa' }}>
                    <span>Facturado a clientes ({monthlyOrders} pedidos):</span>
                    <span style={{ color: '#ffffff', fontWeight: 600 }}>{formatMoney(monthlyRevenue)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#a1a1aa' }}>
                    <span>El fabricante cobra por enviar los paquetes:</span>
                    <span style={{ color: '#ef4444', fontWeight: 600 }}>-{formatMoney(monthlySupplier)}</span>
                  </div>
                </div>
              </div>

              {/* Big Net Profit Display */}
              <div
                style={{
                  background: 'rgba(52, 211, 153, 0.08)',
                  border: '1.5px solid #34d399',
                  borderRadius: '10px',
                  padding: '1rem',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '0.72rem', color: '#6ee7b7', fontWeight: 800, textTransform: 'uppercase' }}>
                  Tu ganancia limpia transferida al banco
                </div>
                <div
                  style={{
                    fontSize: 'clamp(2rem, 5vw, 2.8rem)',
                    fontWeight: 900,
                    color: '#34d399',
                    lineHeight: 1.1,
                    margin: '0.2rem 0',
                  }}
                >
                  +{formatMoney(monthlyNetProfit)}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#a7f3d0' }}>
                  Directo a tu cuenta bancaria cada mes
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CAPABILITIES SEQUENCE (AS YIELDED BY DRAW.MJS) ──────────── */}
      <section
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '4rem 1.5rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.07)',
        }}
      >
        <div style={{ maxWidth: 640, marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff', margin: '0 0 0.5rem 0' }}>
            Cómo funciona el sistema en 3 pasos
          </h2>
          <p style={{ fontSize: '0.95rem', color: '#a1a1aa', margin: 0 }}>
            Tú no tienes que fabricar nada, ni guardar cajas, ni aprender a programar.
          </p>
        </div>

        {/* 3 Step Interactive Row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {[
            {
              icon: '🎯',
              step: 'Paso 1',
              title: 'La IA encuentra productos que se venden solos',
              desc: 'Analizamos millones de compras en internet para encontrar los productos virales que la gente ya está buscando ahora mismo.',
            },
            {
              icon: '⚡',
              step: 'Paso 2',
              title: 'Crea tu tienda online en 1 toque',
              desc: 'Tu tienda queda lista para recibir compras con tarjeta o contra reembolso, con fotos atractivas y textos persuasivos.',
            },
            {
              icon: '💰',
              step: 'Paso 3',
              title: 'Cobras tú y el proveedor envía el paquete',
              desc: 'Cuando un cliente compra en tu tienda, tú te quedas con la ganancia y el fabricante envía el producto directo a su casa.',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                background: '#110f18',
                border: '1px solid #231f2e',
                borderRadius: '14px',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '2rem' }}>{item.icon}</span>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      color: '#faae33',
                      background: 'rgba(250, 174, 51, 0.1)',
                      padding: '3px 8px',
                      borderRadius: '4px',
                    }}
                  >
                    {item.step}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', margin: '0 0 0.5rem 0', lineHeight: 1.3 }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#a1a1aa', lineHeight: 1.5, margin: 0 }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ACCORDION FAQS (NO TECHNICAL TERMS) ─────────────────────── */}
      <section
        style={{
          maxWidth: 800,
          margin: '0 auto',
          padding: '2rem 1.5rem 4rem 1.5rem',
        }}
      >
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, textAlign: 'center', color: '#ffffff', marginBottom: '1.5rem' }}>
          Preguntas Frecuentes
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {[
            {
              q: '¿Tengo que comprar mercancía antes de venderla?',
              a: 'No. Jamás compras ningún producto por adelantado. Primero el cliente te paga a ti en tu tienda, y luego el fabricante envía el pedido con el dinero de la venta.',
            },
            {
              q: '¿Tengo que almacenar paquetes o cajas en mi casa?',
              a: 'No. Los productos salen directamente desde el almacén del proveedor hacia la puerta de tu cliente.',
            },
            {
              q: '¿Necesito saber programar o diseñar páginas web?',
              a: 'Para nada. La inteligencia artificial genera la tienda, las descripciones y las imágenes automáticamente con 1 clic.',
            },
            {
              q: '¿Cómo y cuándo recibo mis ganancias?',
              a: 'Cada venta procesada transfiere tu beneficio limpio directamente a tu cuenta bancaria.',
            },
          ].map((faq, idx) => {
            const isOpen = openFaq === idx
            return (
              <div
                key={idx}
                onClick={() => setOpenFaq(isOpen ? null : idx)}
                style={{
                  background: '#110f18',
                  border: '1px solid #231f2e',
                  borderRadius: '10px',
                  padding: '1rem 1.25rem',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff' }}>
                    {faq.q}
                  </span>
                  <span style={{ color: '#faae33', fontWeight: 900, fontSize: '1.1rem' }}>
                    {isOpen ? '−' : '+'}
                  </span>
                </div>
                {isOpen && (
                  <div style={{ fontSize: '0.82rem', color: '#a1a1aa', marginTop: '0.65rem', lineHeight: 1.5 }}>
                    {faq.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* ── ACTION TILE (CTA) ───────────────────────────────────────── */}
      <section
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.07)',
          backgroundColor: '#07060a',
          padding: '4rem 1.5rem 3rem 1.5rem',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.3rem)', fontWeight: 800, color: '#ffffff', margin: '0 0 0.65rem 0' }}>
            Empieza a ganar dinero hoy mismo
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#a1a1aa', margin: '0 0 1.75rem 0' }}>
            Entra al panel, elige tu primer producto viral y activa tu negocio en minutos.
          </p>

          <Link
            href="/dashboard"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#faae33',
              color: '#0a090e',
              fontSize: '1rem',
              fontWeight: 800,
              padding: '0.9rem 2.2rem',
              borderRadius: '8px',
              textDecoration: 'none',
              boxShadow: '0 6px 20px rgba(250, 174, 51, 0.35)',
            }}
          >
            <span>Abrir Mi Centro de Control</span>
            <span>&rarr;</span>
          </Link>
        </div>
      </section>

      {/* ── A SINGLE QUIET FOOTER LINE ─────────────────────────────── */}
      <footer
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          padding: '1.25rem 1.5rem',
          textAlign: 'center',
          fontSize: '0.75rem',
          color: '#52525b',
        }}
      >
        &copy; {new Date().getFullYear()} Nexus AI &bull; Comercio digital automatizado sin stock
      </footer>

      {/* ── VIDEO MODAL ────────────────────────────────────────────── */}
      {videoModal && (
        <div
          onClick={() => setVideoModal(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#121018',
              border: '1px solid #332a42',
              borderRadius: '14px',
              width: '100%',
              maxWidth: 540,
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
            }}
          >
            <div
              style={{
                padding: '0.75rem 1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid #221d2d',
              }}
            >
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ffffff' }}>
                Vídeo Demostración: {activeProduct.name}
              </span>
              <button
                onClick={() => setVideoModal(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#a1a1aa',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                }}
              >
                ✕
              </button>
            </div>
            <div style={{ width: '100%', background: '#000000', minHeight: 260 }}>
              <video
                src={videoModal}
                controls
                autoPlay
                playsInline
                style={{ width: '100%', maxHeight: '60vh', display: 'block' }}
              />
            </div>
            <div style={{ padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 700 }}>
                ✓ Anuncio viral listo para generar ventas
              </span>
              <Link
                href="/dashboard"
                style={{
                  background: '#faae33',
                  color: '#09080d',
                  padding: '0.45rem 1rem',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  textDecoration: 'none',
                }}
              >
                Empezar &rarr;
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
