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
  cost: number
  profit: number
  videoUrl: string
  tagline: string
}

const PRODUCTS: DemoProduct[] = [
  {
    id: 'luna',
    name: 'Lámpara Lunar Flotante',
    emoji: '🌕',
    badge: 'MÁS VENDIDO',
    price: 49,
    cost: 12,
    profit: 37,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    tagline: 'Levita y gira mágicamente en el aire.',
  },
  {
    id: 'pet',
    name: 'Cepillo Quita-Pelo Mascotas',
    emoji: '🐶',
    badge: 'VIRAL EN TIKTOK',
    price: 25,
    cost: 5,
    profit: 20,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    tagline: 'Limpia con vapor suave sin tirones.',
  },
  {
    id: 'galaxy',
    name: 'Proyector Galaxia 360°',
    emoji: '✨',
    badge: 'TENDENCIA HOY',
    price: 39,
    cost: 9,
    profit: 30,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    tagline: 'Llena tu habitación de estrellas.',
  },
  {
    id: 'watch',
    name: 'Reloj Fitness Deportivo',
    emoji: '⌚',
    badge: 'ALTA GANANCIA',
    price: 59,
    cost: 17,
    profit: 42,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    tagline: 'Mide pasos, pulsaciones y sueño.',
  },
]

export default function HomePage() {
  const { formatMoney } = useCurrency()

  // Interactive Product & Sales State
  const [activeProduct, setActiveProduct] = useState<DemoProduct>(PRODUCTS[0])
  const [salesPerDay, setSalesPerDay] = useState<number>(15)
  const [activeTab, setActiveTab] = useState<number>(0)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [videoModal, setVideoModal] = useState<string | null>(null)

  // Calculations
  const monthlyUnits = salesPerDay * 30
  const monthlyProfit = monthlyUnits * activeProduct.profit

  // Dopamine Level Indicator
  const getDopamineStatus = () => {
    if (monthlyProfit >= 15000) return { icon: '👑', label: '¡Nivel Imperio Digital!', color: '#f59e0b' }
    if (monthlyProfit >= 8000) return { icon: '🔥', label: '¡Libertad Financiera Total!', color: '#ec4899' }
    if (monthlyProfit >= 3500) return { icon: '🚀', label: '¡Más que un sueldo completo!', color: '#10b981' }
    return { icon: '💰', label: '¡Un extra increíble cada mes!', color: '#38bdf8' }
  }

  const dopamine = getDopamineStatus()

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
      {/* ── AMBIENT GLOW ─────────────────────────────────────────── */}
      <div
        style={{
          position: 'fixed',
          top: '-15%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '90vw',
          maxWidth: 800,
          height: 350,
          background: 'radial-gradient(circle, rgba(250, 174, 51, 0.15) 0%, transparent 70%)',
          filter: 'blur(70px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* ── SIMPLE NAVBAR ────────────────────────────────────────── */}
      <header
        style={{
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: 'rgba(7, 7, 9, 0.9)',
          backdropFilter: 'blur(16px)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          style={{
            maxWidth: 1100,
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
              gap: '0.5rem',
              textDecoration: 'none',
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: '9px',
                background: 'linear-gradient(135deg, #faae33, #e08b1a)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 14px rgba(250, 174, 51, 0.45)',
              }}
            >
              <span style={{ fontSize: '1.15rem' }}>⚡</span>
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em' }}>
              NEXUS<span style={{ color: '#faae33' }}>AI</span>
            </span>
          </Link>

          {/* Quick Action Button */}
          <Link
            href="/dashboard"
            style={{
              padding: '0.5rem 1.3rem',
              background: 'linear-gradient(135deg, #faae33, #d98216)',
              color: '#090807',
              borderRadius: '999px',
              fontSize: '0.85rem',
              fontWeight: 800,
              textDecoration: 'none',
              boxShadow: '0 4px 15px rgba(250, 174, 51, 0.35)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <span>Entrar</span>
            <span>&rarr;</span>
          </Link>
        </div>
      </header>

      {/* ── HERO: ULTRA DIRECTO & SIN TECNICISMOS ─────────────────── */}
      <section
        style={{
          maxWidth: 900,
          margin: '0 auto',
          padding: '2.5rem 1.25rem 1.5rem 1.25rem',
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
            gap: '0.45rem',
            padding: '5px 14px',
            borderRadius: '999px',
            backgroundColor: 'rgba(250, 174, 51, 0.12)',
            border: '1px solid rgba(250, 174, 51, 0.3)',
            fontSize: '0.8rem',
            fontWeight: 800,
            color: '#faae33',
            marginBottom: '1rem',
          }}
        >
          <span>✨</span>
          <span>SIN COMPRAR STOCK &bull; SIN CAJAS EN CASA</span>
        </div>

        {/* Short Punchy Title */}
        <h1
          style={{
            fontSize: 'clamp(2.1rem, 5.5vw, 3.4rem)',
            fontWeight: 900,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            margin: '0 auto 0.8rem auto',
          }}
        >
          Gana dinero por internet{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #faae33 0%, #ffdf78 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            en automático
          </span>
        </h1>

        <p
          style={{
            fontSize: 'clamp(0.95rem, 2vw, 1.15rem)',
            color: '#a1a1aa',
            lineHeight: 1.4,
            maxWidth: 540,
            margin: '0 auto 1.5rem auto',
          }}
        >
          Elige un producto viral, activa tu tienda en 1 clic y quédate con la ganancia de cada venta.
        </p>
      </section>

      {/* ── SIMULADOR DE GANANCIAS (INTERACTIVO AL 100%) ─────────── */}
      <section
        style={{
          maxWidth: 900,
          margin: '0 auto 3.5rem auto',
          padding: '0 1.25rem',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div
          style={{
            background: 'linear-gradient(145deg, #131019, #0a080e)',
            border: '2px solid rgba(250, 174, 51, 0.25)',
            borderRadius: '24px',
            padding: 'clamp(1.2rem, 3.5vw, 2.2rem)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(250, 174, 51, 0.1)',
          }}
        >
          {/* Header del Simulador */}
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <span
              style={{
                fontSize: '0.72rem',
                color: '#34d399',
                background: 'rgba(52, 211, 153, 0.12)',
                border: '1px solid rgba(52, 211, 153, 0.3)',
                padding: '3px 10px',
                borderRadius: '999px',
                fontWeight: 800,
                letterSpacing: '0.05em',
              }}
            >
              SIMULADOR EN TIEMPO REAL
            </span>
            <h2 style={{ fontSize: 'clamp(1.3rem, 3.5vw, 1.8rem)', fontWeight: 900, color: '#ffffff', margin: '0.5rem 0 0.2rem 0' }}>
              Toca un producto y calcula tu ganancia:
            </h2>
          </div>

          {/* 1. Selector de Productos Táctil */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '0.65rem',
              marginBottom: '1.5rem',
            }}
          >
            {PRODUCTS.map((prod) => {
              const isSelected = activeProduct.id === prod.id
              return (
                <button
                  key={prod.id}
                  onClick={() => setActiveProduct(prod)}
                  style={{
                    background: isSelected ? 'rgba(250, 174, 51, 0.18)' : '#100e16',
                    border: `2px solid ${isSelected ? '#faae33' : '#231d2c'}`,
                    borderRadius: '14px',
                    padding: '0.85rem 0.5rem',
                    color: '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.3rem',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: isSelected ? 'scale(1.03)' : 'scale(1)',
                    boxShadow: isSelected ? '0 0 16px rgba(250, 174, 51, 0.3)' : 'none',
                  }}
                >
                  <span style={{ fontSize: '1.9rem' }}>{prod.emoji}</span>
                  <span style={{ fontSize: '0.82rem', fontWeight: 800, textAlign: 'center', lineHeight: 1.2 }}>
                    {prod.name}
                  </span>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      color: isSelected ? '#34d399' : '#a1a1aa',
                      fontWeight: 800,
                    }}
                  >
                    +{formatMoney(prod.profit)} ganancia
                  </span>
                </button>
              )
            })}
          </div>

          {/* 2. Slider Interactivo y Botones Rápidos */}
          <div
            style={{
              background: '#09080d',
              border: '1px solid #1f1a28',
              borderRadius: '16px',
              padding: '1.25rem',
              marginBottom: '1.5rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.5rem',
                marginBottom: '0.85rem',
              }}
            >
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#e4e4e7' }}>
                ¿Cuántas personas te compran al día?
              </span>
              <span
                style={{
                  fontSize: '1.15rem',
                  fontWeight: 900,
                  color: '#faae33',
                  background: 'rgba(250, 174, 51, 0.12)',
                  padding: '3px 12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(250, 174, 51, 0.25)',
                }}
              >
                {salesPerDay} al día ({monthlyUnits}/mes)
              </span>
            </div>

            {/* Slider */}
            <input
              type="range"
              min="1"
              max="50"
              step="1"
              value={salesPerDay}
              onChange={(e) => setSalesPerDay(Number(e.target.value))}
              style={{
                width: '100%',
                height: '10px',
                accentColor: '#faae33',
                cursor: 'pointer',
                borderRadius: '5px',
                marginBottom: '0.85rem',
              }}
            />

            {/* Quick Preset Buttons */}
            <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
              {[3, 10, 20, 35, 50].map((preset) => (
                <button
                  key={preset}
                  onClick={() => setSalesPerDay(preset)}
                  style={{
                    flex: '1 1 50px',
                    padding: '0.4rem 0.6rem',
                    background: salesPerDay === preset ? '#faae33' : '#16131d',
                    color: salesPerDay === preset ? '#090807' : '#d4d4d8',
                    border: `1px solid ${salesPerDay === preset ? '#faae33' : '#272033'}`,
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {preset} al día
                </button>
              ))}
            </div>
          </div>

          {/* 3. Pantalla de Ganancias Limpias (Dopamina Visual) */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(52, 211, 153, 0.16), rgba(16, 185, 129, 0.04))',
              border: '2px solid #34d399',
              borderRadius: '18px',
              padding: '1.4rem 1rem',
              textAlign: 'center',
              boxShadow: '0 0 25px rgba(52, 211, 153, 0.15)',
            }}
          >
            {/* Dopamine Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.78rem',
                color: dopamine.color,
                fontWeight: 800,
                backgroundColor: 'rgba(0,0,0,0.3)',
                padding: '4px 12px',
                borderRadius: '999px',
                marginBottom: '0.5rem',
              }}
            >
              <span>{dopamine.icon}</span>
              <span>{dopamine.label}</span>
            </div>

            <div style={{ fontSize: '0.78rem', color: '#6ee7b7', fontWeight: 800, letterSpacing: '0.04em' }}>
              TU DINERO LIMPIO ESTIMADO
            </div>

            <div
              style={{
                fontSize: 'clamp(2.4rem, 7vw, 3.8rem)',
                fontWeight: 900,
                color: '#34d399',
                lineHeight: 1.1,
                margin: '0.2rem 0',
                textShadow: '0 0 20px rgba(52, 211, 153, 0.4)',
              }}
            >
              +{formatMoney(monthlyProfit)}{' '}
              <span style={{ fontSize: '1rem', color: '#a7f3d0', fontWeight: 700 }}>/ mes</span>
            </div>

            <p style={{ fontSize: '0.82rem', color: '#d1fae5', margin: '0 0 1rem 0' }}>
              Sin comprar mercancía por adelantado. Cobras y el fabricante hace el envío.
            </p>

            {/* Interactive Video Preview Button */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => setVideoModal(activeProduct.videoUrl)}
                style={{
                  background: '#121216',
                  border: '1px solid #34d399',
                  color: '#34d399',
                  padding: '0.55rem 1.2rem',
                  borderRadius: '10px',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'transform 0.15s',
                }}
              >
                <span>▶ Ver Video de Demostración</span>
              </button>

              <Link
                href="/dashboard"
                style={{
                  background: 'linear-gradient(135deg, #faae33, #d98216)',
                  color: '#090807',
                  padding: '0.55rem 1.4rem',
                  borderRadius: '10px',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  boxShadow: '0 4px 15px rgba(250, 174, 51, 0.3)',
                }}
              >
                <span>🚀 Activar Este Producto</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CÓMO FUNCIONA: 3 PASOS EN TABS INTERACTIVAS (SIN ROLLOS DE TEXTO) ─ */}
      <section
        style={{
          maxWidth: 900,
          margin: '0 auto 4rem auto',
          padding: '0 1.25rem',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: 'clamp(1.3rem, 4vw, 1.85rem)', fontWeight: 900, color: '#ffffff', margin: 0 }}>
            ¿Cómo funciona? (Solo 3 pasos)
          </h2>
        </div>

        {/* 3 Clickable Steps Tabs */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.5rem',
            marginBottom: '1rem',
          }}
        >
          {[
            { step: '1', title: 'La IA Busca', emoji: '🔍' },
            { step: '2', title: 'Tienda en 1 Clic', emoji: '⚡' },
            { step: '3', title: 'Cobras Tú', emoji: '💸' },
          ].map((tab, idx) => {
            const isActive = activeTab === idx
            return (
              <button
                key={idx}
                onClick={() => setActiveTab(idx)}
                style={{
                  background: isActive ? 'rgba(250, 174, 51, 0.15)' : '#0e0c12',
                  border: `2px solid ${isActive ? '#faae33' : '#1f1a28'}`,
                  borderRadius: '12px',
                  padding: '0.75rem 0.4rem',
                  color: isActive ? '#faae33' : '#d4d4d8',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.2rem',
                  fontWeight: 800,
                  transition: 'all 0.15s',
                }}
              >
                <span style={{ fontSize: '1.4rem' }}>{tab.emoji}</span>
                <span style={{ fontSize: '0.8rem' }}>{tab.title}</span>
              </button>
            )
          })}
        </div>

        {/* Interactive Step Preview Panel */}
        <div
          style={{
            background: '#0d0b12',
            border: '1px solid #231c2d',
            borderRadius: '16px',
            padding: '1.5rem',
            minHeight: '160px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          {activeTab === 0 && (
            <div>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.4rem' }}>🔍</div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', margin: '0 0 0.4rem 0' }}>
                1. Detectamos lo que se vende hoy
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#a1a1aa', maxWidth: 460, margin: '0 auto' }}>
                El sistema rastrea millones de compras por internet para mostrarte sólo los productos que la gente ya está deseando comprar.
              </p>
            </div>
          )}

          {activeTab === 1 && (
            <div>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.4rem' }}>⚡</div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', margin: '0 0 0.4rem 0' }}>
                2. Tu tienda lista al instante
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#a1a1aa', maxWidth: 460, margin: '0 auto' }}>
                Sin programar y sin diseñar. Con fotos, textos persuasivos y botón de compra para recibir pagos por tarjeta.
              </p>
            </div>
          )}

          {activeTab === 2 && (
            <div>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.4rem' }}>💸</div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', margin: '0 0 0.4rem 0' }}>
                3. Cobras y el fabricante envía
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#a1a1aa', maxWidth: 460, margin: '0 auto' }}>
                Tú te quedas con el beneficio limpio. El proveedor empaqueta y envía el pedido directamente a la puerta de tu cliente.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── PREGUNTAS FRECUENTES INTERACTIVAS (TOCAR PARA ABRIR) ──── */}
      <section
        style={{
          maxWidth: 700,
          margin: '0 auto 4rem auto',
          padding: '0 1.25rem',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <h2 style={{ fontSize: '1.3rem', fontWeight: 900, textAlign: 'center', marginBottom: '1.2rem' }}>
          Dudas rápidas
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {[
            {
              q: '¿Tengo que comprar cajas o guardar productos en mi casa?',
              a: 'No. Jamás tocas un producto físico. Cuando alguien te compra, el fabricante se lo envía directamente.',
            },
            {
              q: '¿Necesito saber de diseño o informática?',
              a: 'Nada en absoluto. El sistema genera todo de forma automática con un solo clic.',
            },
            {
              q: '¿Cuándo y cómo recibo mi dinero?',
              a: 'Cada venta se procesa al instante y el dinero va directo a tu cuenta de banco.',
            },
          ].map((item, idx) => {
            const isOpen = openFaq === idx
            return (
              <div
                key={idx}
                onClick={() => setOpenFaq(isOpen ? null : idx)}
                style={{
                  background: '#0e0c12',
                  border: '1px solid #1f1a28',
                  borderRadius: '12px',
                  padding: '0.85rem 1.1rem',
                  cursor: 'pointer',
                  transition: 'border 0.2s',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ffffff' }}>
                    {item.q}
                  </span>
                  <span style={{ fontSize: '1rem', color: '#faae33', fontWeight: 900 }}>
                    {isOpen ? '−' : '+'}
                  </span>
                </div>
                {isOpen && (
                  <div style={{ fontSize: '0.8rem', color: '#a1a1aa', marginTop: '0.5rem', lineHeight: 1.4 }}>
                    {item.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* ── BOTÓN FINAL DIRECTO ──────────────────────────────────── */}
      <section
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: '#050507',
          padding: '3rem 1.25rem 2.5rem 1.25rem',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: 500, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)', fontWeight: 900, color: '#ffffff', margin: '0 0 0.5rem 0' }}>
            Empieza hoy mismo
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#a1a1aa', marginBottom: '1.5rem' }}>
            Accede gratis al panel y descubre los productos listos para vender.
          </p>

          <Link
            href="/dashboard"
            style={{
              padding: '0.85rem 2.2rem',
              background: 'linear-gradient(135deg, #faae33, #d98216)',
              color: '#090807',
              borderRadius: '999px',
              fontSize: '0.95rem',
              fontWeight: 800,
              textDecoration: 'none',
              boxShadow: '0 6px 25px rgba(250, 174, 51, 0.4)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <span>🚀 Entrar a Mi Panel</span>
            <span>&rarr;</span>
          </Link>

          <div style={{ fontSize: '0.72rem', color: '#52525b', marginTop: '2rem' }}>
            © {new Date().getFullYear()} Nexus AI &bull; Venta directa por internet
          </div>
        </div>
      </section>

      {/* ── MODAL DE VIDEO RÁPIDO ─────────────────────────────────── */}
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
              backgroundColor: '#121115',
              border: '1px solid #332845',
              borderRadius: '16px',
              width: '100%',
              maxWidth: 540,
              overflow: 'hidden',
              boxShadow: '0 25px 50px rgba(0,0,0,0.8)',
            }}
          >
            <div
              style={{
                padding: '0.75rem 1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid #231c2d',
              }}
            >
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ffffff' }}>
                Video de {activeProduct.name}
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
                ✓ Listo para vender
              </span>
              <Link
                href="/dashboard"
                style={{
                  background: '#faae33',
                  color: '#090807',
                  padding: '0.4rem 0.9rem',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  textDecoration: 'none',
                }}
              >
                Comenzar &rarr;
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
