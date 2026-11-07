'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useCurrency } from '@/hooks/useCurrency'

interface DemoProduct {
  id: string
  name: string
  category: string
  emoji: string
  cost: number
  price: number
  profitPerUnit: number
  videoUrl: string
  image: string
  headline: string
}

const DEMO_PRODUCTS: DemoProduct[] = [
  {
    id: 'luna',
    name: 'Lámpara Lunar Flotante',
    category: 'Hogar & Regalos',
    emoji: '🌕',
    cost: 12,
    price: 49,
    profitPerUnit: 37,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    image: 'https://images.unsplash.com/photo-1532767153582-b1a0e5145009?w=600&auto=format&fit=crop&q=80',
    headline: 'Levita y gira en el aire con luz cálida mágica.',
  },
  {
    id: 'pet',
    name: 'Cepillo de Vapor Mascotas',
    category: 'Mascotas',
    emoji: '🐶',
    cost: 5,
    price: 25,
    profitPerUnit: 20,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&auto=format&fit=crop&q=80',
    headline: 'Quita el 95% del pelo suelto con vapor suave sin tirones.',
  },
  {
    id: 'galaxy',
    name: 'Proyector Galaxia 360°',
    category: 'Dormitorio & Relax',
    emoji: '✨',
    cost: 9,
    price: 39,
    profitPerUnit: 30,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
    headline: 'Convierte el techo en un cielo estrellado con nebulosas.',
  },
]

export default function HomePage() {
  const { formatMoney } = useCurrency()

  // Interactive Product Selector
  const [selectedProduct, setSelectedProduct] = useState<DemoProduct>(DEMO_PRODUCTS[0])
  const [salesPerDay, setSalesPerDay] = useState<number>(15)

  // Interactive Video Modal
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null)

  // Calculations
  const monthlySales = salesPerDay * 30
  const monthlyNetProfit = monthlySales * selectedProduct.profitPerUnit
  const monthlyGrossRevenue = monthlySales * selectedProduct.price

  // Simple steps interactive tab
  const [activeStep, setActiveStep] = useState<number>(0)

  const steps = [
    {
      step: 'Paso 1',
      title: 'La IA encuentra productos que se venden solos',
      emoji: '🎯',
      desc: 'Escaneamos los almacenes para encontrar productos virales que la gente ya está comprando ahora mismo.',
      action: 'Explorar Productos',
      href: '/dashboard/catalog',
    },
    {
      step: 'Paso 2',
      title: 'Te crea tu tienda online en 1 clic',
      emoji: '🛍️',
      desc: 'Sin saber programar ni diseñar. Tu tienda lista para recibir pagos con tarjeta o contra reembolso.',
      action: 'Ver Tienda',
      href: '/dashboard',
    },
    {
      step: 'Paso 3',
      title: 'Tú cobras, el fabricante envía el paquete',
      emoji: '💰',
      desc: 'No necesitas comprar stock por adelantado ni guardar cajas en tu casa. El proveedor lo envía directo a tu cliente.',
      action: 'Abrir Mi Panel',
      href: '/dashboard',
    },
  ]

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#070709',
        color: '#ffffff',
        fontFamily: "'Outfit', sans-serif",
        overflowX: 'hidden',
        position: 'relative',
      }}
    >
      {/* ── TOP AMBIENT GLOW ─────────────────────────────────────────── */}
      <div
        style={{
          position: 'fixed',
          top: '-20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '90vw',
          maxWidth: '900px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(250, 174, 51, 0.16) 0%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* ── TOP HEADER / NAVBAR ──────────────────────────────────────── */}
      <header
        style={{
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: 'rgba(7, 7, 9, 0.88)',
          backdropFilter: 'blur(16px)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          style={{
            maxWidth: 1140,
            margin: '0 auto',
            padding: '0.85rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              textDecoration: 'none',
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #faae33, #e08b1a)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 14px rgba(250, 174, 51, 0.4)',
              }}
            >
              <span style={{ fontSize: '1.1rem' }}>⚡</span>
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em' }}>
              NEXUS<span style={{ color: '#faae33' }}>AI</span>
            </span>
          </Link>

          {/* Quick Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link
              href="/dashboard/catalog"
              style={{
                fontSize: '0.85rem',
                color: '#d4d4d8',
                textDecoration: 'none',
                fontWeight: 600,
                padding: '0.45rem 0.8rem',
              }}
            >
              Productos
            </Link>
            <Link
              href="/dashboard"
              style={{
                fontSize: '0.85rem',
                background: 'linear-gradient(135deg, #faae33, #d98216)',
                color: '#090807',
                padding: '0.5rem 1.2rem',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 800,
                boxShadow: '0 4px 15px rgba(250, 174, 51, 0.35)',
                whiteSpace: 'nowrap',
              }}
            >
              Entrar &rarr;
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO: DIRECTO, FÁCIL & SIN TECNICISMOS ────────────────────── */}
      <section
        style={{
          maxWidth: 960,
          margin: '0 auto',
          padding: '3.5rem 1.25rem 2rem 1.25rem',
          textAlign: 'center',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* Friendly Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '6px 14px',
            borderRadius: '999px',
            backgroundColor: 'rgba(250, 174, 51, 0.12)',
            border: '1px solid rgba(250, 174, 51, 0.3)',
            fontSize: '0.82rem',
            fontWeight: 800,
            color: '#faae33',
            marginBottom: '1.5rem',
          }}
        >
          <span>🚀</span>
          <span>GANA DINERO POR INTERNET SIN TENER STOCK</span>
        </div>

        {/* Clear Headline */}
        <h1
          style={{
            fontSize: 'clamp(2.1rem, 6vw, 3.8rem)',
            fontWeight: 900,
            lineHeight: 1.12,
            letterSpacing: '-0.03em',
            margin: '0 auto 1.2rem auto',
          }}
        >
          Crea tu Negocio Digital con{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #faae33 0%, #ffdf78 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Inteligencia Artificial
          </span>
        </h1>

        {/* 1-Sentence Non-Technical Subtitle */}
        <p
          style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
            color: '#a1a1aa',
            lineHeight: 1.5,
            maxWidth: 620,
            margin: '0 auto 2.2rem auto',
          }}
        >
          La IA busca los productos más vendidos, te monta la tienda en minutos y tú ganas la diferencia en cada venta.
        </p>

        {/* Fast Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.85rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
          <Link
            href="/dashboard"
            style={{
              padding: '0.9rem 2rem',
              background: 'linear-gradient(135deg, #faae33, #d98216)',
              color: '#090807',
              borderRadius: '10px',
              fontSize: '1rem',
              fontWeight: 800,
              textDecoration: 'none',
              boxShadow: '0 8px 25px rgba(250, 174, 51, 0.35)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <span>🚀 Empezar Gratis</span>
            <span>&rarr;</span>
          </Link>
          <Link
            href="/dashboard/catalog"
            style={{
              padding: '0.9rem 1.6rem',
              backgroundColor: '#16141a',
              color: '#ffffff',
              borderRadius: '10px',
              fontSize: '0.95rem',
              fontWeight: 700,
              textDecoration: 'none',
              border: '1px solid #2e2838',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <span>👀 Ver Productos Ganadores</span>
          </Link>
        </div>
      </section>

      {/* ── SIMULADOR INTERACTIVO: "¿CUÁNTO PUEDES GANAR?" ────────────── */}
      <section
        style={{
          maxWidth: 960,
          margin: '0 auto 4.5rem auto',
          padding: '0 1.25rem',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div
          style={{
            background: 'linear-gradient(135deg, #120e17, #0c0a10)',
            border: '1px solid #2e243d',
            borderRadius: '20px',
            padding: 'clamp(1.25rem, 4vw, 2.25rem)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 25px rgba(250, 174, 51, 0.1)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <span
              style={{
                fontSize: '0.72rem',
                color: '#34d399',
                background: 'rgba(52, 211, 153, 0.12)',
                border: '1px solid rgba(52, 211, 153, 0.3)',
                padding: '4px 10px',
                borderRadius: '999px',
                fontWeight: 800,
              }}
            >
              SIMULADOR EN VIVO
            </span>
            <h2 style={{ fontSize: 'clamp(1.4rem, 4vw, 1.85rem)', fontWeight: 900, color: '#ffffff', margin: '0.6rem 0 0.3rem 0' }}>
              ¿Cuánto dinero quieres ganar al mes?
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#a1a1aa', margin: 0 }}>
              Elige un producto y mueve la barra para calcular tus ganancias limpias.
            </p>
          </div>

          {/* 1. Selector de Producto Interactivo */}
          <div style={{ marginBottom: '1.75rem' }}>
            <div style={{ fontSize: '0.78rem', color: '#a1a1aa', fontWeight: 700, marginBottom: '0.6rem', textAlign: 'center' }}>
              Paso 1: Elige el producto que quieres vender:
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '0.65rem',
              }}
            >
              {DEMO_PRODUCTS.map((prod) => {
                const isSelected = selectedProduct.id === prod.id
                return (
                  <button
                    key={prod.id}
                    onClick={() => setSelectedProduct(prod)}
                    style={{
                      background: isSelected ? 'rgba(250, 174, 51, 0.15)' : '#0e0c12',
                      border: `2px solid ${isSelected ? '#faae33' : '#231d2c'}`,
                      borderRadius: '12px',
                      padding: '0.75rem 0.5rem',
                      color: '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.3rem',
                      transition: 'all 0.2s',
                    }}
                  >
                    <span style={{ fontSize: '1.8rem' }}>{prod.emoji}</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, textAlign: 'center', lineHeight: 1.2 }}>
                      {prod.name}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: isSelected ? '#faae33' : '#a1a1aa', fontWeight: 700 }}>
                      +{formatMoney(prod.profitPerUnit)} limpios/venta
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* 2. Slider Interactivo de Ventas */}
          <div
            style={{
              background: '#09080d',
              border: '1px solid #1f1a28',
              borderRadius: '14px',
              padding: '1.25rem',
              marginBottom: '1.75rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#e4e4e7' }}>
                Paso 2: ¿Cuántas ventas haces al día?
              </span>
              <span
                style={{
                  fontSize: '1.15rem',
                  fontWeight: 900,
                  color: '#faae33',
                  background: 'rgba(250, 174, 51, 0.1)',
                  padding: '3px 10px',
                  borderRadius: '6px',
                }}
              >
                {salesPerDay} ventas al día
              </span>
            </div>

            <input
              type="range"
              min="3"
              max="60"
              step="1"
              value={salesPerDay}
              onChange={(e) => setSalesPerDay(Number(e.target.value))}
              style={{
                width: '100%',
                height: '8px',
                accentColor: '#faae33',
                cursor: 'pointer',
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#71717a', marginTop: 6 }}>
              <span>3 al día (Principiante)</span>
              <span>15 al día (Negocio Sólido)</span>
              <span>60 al día (Escala Máxima)</span>
            </div>
          </div>

          {/* 3. Resultado de Ganancia Gigante y Claro */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(52, 211, 153, 0.15), rgba(16, 185, 129, 0.05))',
              border: '2px solid #34d399',
              borderRadius: '16px',
              padding: '1.5rem',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              🎉 TU GANANCIA LIMPIA ESTIMADA
            </div>

            <div style={{ fontSize: 'clamp(2.2rem, 7vw, 3.5rem)', fontWeight: 900, color: '#34d399', margin: '0.2rem 0' }}>
              +{formatMoney(monthlyNetProfit)} <span style={{ fontSize: '1rem', color: '#a7f3d0' }}>/ mes</span>
            </div>

            <p style={{ fontSize: '0.82rem', color: '#d1fae5', margin: '0 0 1rem 0' }}>
              Vendiendo {monthlySales} unidades de {selectedProduct.name} al mes. Tú no compras nada hasta que el cliente te paga.
            </p>

            {/* Video preview button */}
            <button
              onClick={() => setPreviewVideoUrl(selectedProduct.videoUrl)}
              style={{
                background: '#121216',
                border: '1px solid #34d399',
                color: '#34d399',
                padding: '0.55rem 1.25rem',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <span>▶</span>
              <span>Ver Video de {selectedProduct.name}</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── CÓMO FUNCIONA EN 3 PASOS INTERACTIVOS ─────────────────────── */}
      <section
        style={{
          maxWidth: 960,
          margin: '0 auto 5rem auto',
          padding: '0 1.25rem',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span style={{ fontSize: '0.72rem', color: '#faae33', fontWeight: 800, textTransform: 'uppercase' }}>
            SENCILLO Y SIN COMPLICACIONES
          </span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#ffffff', margin: '0.4rem 0 0 0' }}>
            ¿Cómo funciona para ti?
          </h2>
        </div>

        {/* Step Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1rem',
          }}
        >
          {steps.map((s, idx) => (
            <div
              key={idx}
              style={{
                background: '#0e0c12',
                border: '1px solid #201a28',
                borderRadius: '16px',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '2rem' }}>{s.emoji}</span>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      color: '#faae33',
                      background: 'rgba(250, 174, 51, 0.1)',
                      padding: '2px 8px',
                      borderRadius: '4px',
                    }}
                  >
                    {s.step}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', margin: '0 0 0.5rem 0', lineHeight: 1.3 }}>
                  {s.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#a1a1aa', lineHeight: 1.5, margin: 0 }}>
                  {s.desc}
                </p>
              </div>

              <div style={{ marginTop: '1.5rem' }}>
                <Link
                  href={s.href}
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: '#faae33',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                  }}
                >
                  <span>{s.action}</span>
                  <span>&rarr;</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── BOTÓN FINAL PARA EMPEZAR ─────────────────────────────────── */}
      <section
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: '#050507',
          padding: '3.5rem 1.25rem',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: 650, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.2rem)', fontWeight: 900, color: '#ffffff', margin: '0 0 0.8rem 0' }}>
            Empieza a Ganar Dinero con tu Tienda Digital
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#a1a1aa', marginBottom: '1.75rem', lineHeight: 1.6 }}>
            Accede al catálogo de productos ganadores y deja que la IA haga el trabajo pesado por ti.
          </p>
          <Link
            href="/dashboard"
            style={{
              padding: '0.9rem 2.2rem',
              background: 'linear-gradient(135deg, #faae33, #d98216)',
              color: '#090807',
              borderRadius: '10px',
              fontSize: '1rem',
              fontWeight: 800,
              textDecoration: 'none',
              boxShadow: '0 8px 30px rgba(250, 174, 51, 0.35)',
              display: 'inline-block',
            }}
          >
            Abrir Mi Centro de Control &rarr;
          </Link>
          <div style={{ fontSize: '0.72rem', color: '#52525b', marginTop: '2.5rem' }}>
            © {new Date().getFullYear()} Nexus AI. La forma más fácil de vender por internet.
          </div>
        </div>
      </section>

      {/* ── VIDEO MODAL FLUIDO & LIGERO ──────────────────────────────── */}
      {previewVideoUrl && (
        <div
          onClick={() => setPreviewVideoUrl(null)}
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
              backgroundColor: '#121115',
              border: '1px solid #332845',
              borderRadius: '16px',
              width: '100%',
              maxWidth: 580,
              overflow: 'hidden',
              boxShadow: '0 25px 50px rgba(0,0,0,0.8)',
            }}
          >
            <div style={{ padding: '0.85rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #231c2d' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ffffff' }}>
                Video Demostración de {selectedProduct.name}
              </span>
              <button
                onClick={() => setPreviewVideoUrl(null)}
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
            <div style={{ width: '100%', background: '#000000', minHeight: 280 }}>
              <video
                src={previewVideoUrl}
                controls
                autoPlay
                playsInline
                style={{ width: '100%', maxHeight: '65vh', display: 'block' }}
              />
            </div>
            <div style={{ padding: '0.85rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 700 }}>
                ✓ Producto listo para vender en tu tienda
              </span>
              <Link
                href="/dashboard/catalog"
                style={{
                  background: '#faae33',
                  color: '#090807',
                  padding: '0.45rem 0.9rem',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  textDecoration: 'none',
                }}
              >
                Ir al Catálogo &rarr;
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
