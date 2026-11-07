'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useCurrency } from '@/hooks/useCurrency'

export default function HomePage() {
  const { formatMoney } = useCurrency()

  // Interactive Dopaminergic Profit Calculator State
  const [dailyOrders, setDailyOrders] = useState<number>(25)
  const [averageTicket, setAverageTicket] = useState<number>(38)

  // Calculations
  const monthlyOrders = dailyOrders * 30
  const monthlyRevenue = monthlyOrders * averageTicket
  const cogsCost = monthlyRevenue * 0.28 // 28% supplier product + shipping cost
  const adsSpend = monthlyRevenue / 3.4 // ROAS 3.4x
  const estimatedNetProfit = Math.round(monthlyRevenue - cogsCost - adsSpend)
  const netMarginPct = Math.round((estimatedNetProfit / monthlyRevenue) * 100)

  // Interactive Agent Selector in Bento
  const [activeAgentIndex, setActiveAgentIndex] = useState<number>(0)

  const agents = [
    {
      id: 'dora',
      name: 'Dora',
      role: 'Directora de Operaciones (COO)',
      avatar: '👩‍💼',
      badgeColor: '#faae33',
      status: 'Activa · Orquestando Pipeline',
      description: 'Supervisa la hoja de ruta de los 11 agentes, asigna prioridades de lanzamiento y asegura que cada producto cumpla los estándares de rentabilidad.',
      deliverable: 'Plan maestro de lanzamiento en 5 fases con dependencias resueltas.',
    },
    {
      id: 'lucas_ivan',
      name: 'Lucas & Iván',
      role: 'Minería de Productos & Tendencias',
      avatar: '🕵️‍♂️',
      badgeColor: '#38bdf8',
      status: 'Escaneando CJ Dropshipping & Google Trends',
      description: 'Filtran millones de artículos en almacenes chinos y europeos buscando márgenes mínimos de 3.5x, stock garantizado y demanda al alza.',
      deliverable: 'Ficha de producto con costes de fábrica, volumen de búsqueda y competidores.',
    },
    {
      id: 'eva',
      name: 'Eva',
      role: 'Directora Financiera (CFO)',
      avatar: '📊',
      badgeColor: '#34d399',
      status: 'Fijando Stop-Loss Matemático',
      description: 'Calcula los unit economics puros: CPA techo, ROAS de equilibrio, coste de pasarelas y provisión de devoluciones para blindar tu margen.',
      deliverable: `CPA Techo calculado: ${formatMoney(18.20)} • ROAS Equilibrio: 1.82x`,
    },
    {
      id: 'tomas',
      name: 'Tomás',
      role: 'Media Buyer (Meta Ads)',
      avatar: '🎯',
      badgeColor: '#818cf8',
      status: 'Estructurando Conjuntos ABO/CBO',
      description: 'Genera las arquitecturas de campaña completas, segmentaciones probadas, ganchos visuales de 3 segundos y reglas de apagado automático.',
      deliverable: 'Estructuras de Testing ABO a 20€/día y CBO para ganadores validados.',
    },
    {
      id: 'nora',
      name: 'Nora',
      role: 'Especialista Instagram & Contenido',
      avatar: '📱',
      badgeColor: '#f472b6',
      status: 'Optimizando Reels Virales',
      description: 'Guioniza Reels de alta retención, carruseles educativos sin lenguaje robótico y biografías persuasivas optimizadas para conversión.',
      deliverable: 'Calendario semanal con ganchos de dolor/beneficio y copys listos.',
    },
    {
      id: 'diego',
      name: 'Diego',
      role: 'Shopify Liquid Developer',
      avatar: '🛍️',
      badgeColor: '#fb923c',
      status: 'Optimizando AOV & Conversión',
      description: 'Genera snippets de código Liquid nativos para temas Dawn, integrando ofertas de cantidad (bundles), timers de urgencia y badges de confianza.',
      deliverable: 'Snippet Liquid para Dawn con oferta Pack 2 unidades (-20% AOV boost).',
    },
  ]

  const trendingProducts = [
    {
      name: 'Lámpara Lunar Flotante',
      niche: 'Decoración & Gadgets',
      image: 'https://images.unsplash.com/photo-1532767153582-b1a0e5145009?w=500&auto=format&fit=crop&q=80',
      factoryCost: 11.80,
      sellPrice: 49.99,
      multiple: '4.2x',
      daysActive: 34,
      tag: '🔥 SUPER GANADOR',
      tagColor: '#34d399',
    },
    {
      name: 'Cepillo Vapor Anticaída Mascotas',
      niche: 'Accesorios Mascotas',
      image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=500&auto=format&fit=crop&q=80',
      factoryCost: 4.50,
      sellPrice: 24.99,
      multiple: '5.5x',
      daysActive: 28,
      tag: '🚀 ESCALANDO',
      tagColor: '#38bdf8',
    },
    {
      name: 'Proyector Galaxia Astronauta 360°',
      niche: 'Hogar & Iluminación',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&auto=format&fit=crop&q=80',
      factoryCost: 9.20,
      sellPrice: 39.99,
      multiple: '4.3x',
      daysActive: 29,
      tag: '🔥 SUPER GANADOR',
      tagColor: '#34d399',
    },
  ]

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#070709',
        color: '#f4f4f5',
        fontFamily: 'var(--font-sans, system-ui, -apple-system, sans-serif)',
        overflowX: 'hidden',
        position: 'relative',
      }}
    >
      {/* ── AMBIENT BACKGROUND GLOWS ──────────────────────────────────── */}
      <div
        style={{
          position: 'fixed',
          top: '-15%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '75vw',
          height: '550px',
          background: 'radial-gradient(ellipse at center, rgba(250, 174, 51, 0.15) 0%, rgba(139, 92, 246, 0.08) 50%, transparent 75%)',
          filter: 'blur(70px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'fixed',
          bottom: '5%',
          right: '-10%',
          width: '45vw',
          height: '400px',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%)',
          filter: 'blur(90px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* ── LIVE PULSE TICKER ────────────────────────────────────────── */}
      <div
        style={{
          background: 'linear-gradient(90deg, #100b06, #1f140a, #100b06)',
          borderBottom: '1px solid rgba(250, 174, 51, 0.25)',
          padding: '0.45rem 1rem',
          textAlign: 'center',
          fontSize: '0.74rem',
          fontWeight: 700,
          color: '#faae33',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.6rem',
          letterSpacing: '0.02em',
          position: 'relative',
          zIndex: 60,
        }}
      >
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: '#22c55e',
            boxShadow: '0 0 8px #22c55e',
            display: 'inline-block',
          }}
        />
        <span>OFICINA DE 12 AGENTES AUTÓNOMOS OPERANDO EN VIVO</span>
        <span style={{ color: 'rgba(250, 174, 51, 0.4)' }}>•</span>
        <span style={{ color: '#ffffff' }}>CJ DROPSHIPPING API V2.0 &amp; META AD LIBRARY EN LÍNEA</span>
      </div>

      {/* ── TOP NAVBAR ──────────────────────────────────────────────── */}
      <header
        style={{
          borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
          backgroundColor: 'rgba(7, 7, 9, 0.85)',
          backdropFilter: 'blur(16px)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          style={{
            maxWidth: 1240,
            margin: '0 auto',
            padding: '0.85rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #faae33, #e08b1a)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 15px rgba(250, 174, 51, 0.4)',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                  stroke="#090807"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.03em' }}>
                NEXUS<span style={{ color: '#faae33' }}>AI</span>
              </span>
              <span style={{ fontSize: '0.62rem', color: '#71717a', display: 'block', lineHeight: 1, letterSpacing: '0.08em', fontWeight: 700 }}>
                DROPSHIPPING AUTONOMOUS OS
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link
              href="/dashboard/catalog"
              style={{
                fontSize: '0.82rem',
                color: '#d4d4d8',
                textDecoration: 'none',
                fontWeight: 600,
                padding: '0.4rem 0.8rem',
                borderRadius: '6px',
                transition: 'color 0.2s',
              }}
            >
              Cazador CJ &amp; Meta
            </Link>
            <Link
              href="/dashboard/facebook-ads"
              style={{
                fontSize: '0.82rem',
                color: '#d4d4d8',
                textDecoration: 'none',
                fontWeight: 600,
                padding: '0.4rem 0.8rem',
                borderRadius: '6px',
                transition: 'color 0.2s',
              }}
            >
              Meta Ads
            </Link>
            <Link
              href="/dashboard"
              style={{
                fontSize: '0.85rem',
                background: 'linear-gradient(135deg, #faae33, #d98216)',
                color: '#090807',
                padding: '0.5rem 1.25rem',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 800,
                boxShadow: '0 4px 15px rgba(250, 174, 51, 0.35)',
                whiteSpace: 'nowrap',
              }}
            >
              Abrir Oficina &rarr;
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO SECTION: DOPAMINERGIC IMPACT ────────────────────────── */}
      <section
        style={{
          maxWidth: 1180,
          margin: '0 auto',
          padding: '5rem 1.5rem 3.5rem 1.5rem',
          textAlign: 'center',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* Shimmering Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.55rem',
            padding: '5px 14px',
            borderRadius: '999px',
            backgroundColor: 'rgba(250, 174, 51, 0.1)',
            border: '1px solid rgba(250, 174, 51, 0.35)',
            fontSize: '0.78rem',
            fontWeight: 800,
            color: '#faae33',
            marginBottom: '1.75rem',
            boxShadow: '0 0 20px rgba(250, 174, 51, 0.15)',
          }}
        >
          <span>⚡ AGENCIA DE INTELIGENCIA ARTIFICIAL PARA DROPSHIPPING</span>
          <span style={{ color: '#71717a' }}>|</span>
          <span style={{ color: '#34d399' }}>12 AGENTES AUTÓNOMOS</span>
        </div>

        {/* Dopamine Main Headline */}
        <h1
          style={{
            fontSize: 'clamp(2.4rem, 6vw, 4.4rem)',
            fontWeight: 900,
            lineHeight: 1.08,
            letterSpacing: '-0.04em',
            color: '#ffffff',
            margin: '0 auto 1.5rem auto',
            maxWidth: 1020,
          }}
        >
          Lanza Tiendas de Dropshipping a{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #faae33 0%, #ffdf78 50%, #faae33 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Escala Masiva
          </span>{' '}
          con 12 Agentes IA en Paralelo
        </h1>

        {/* Clear Subtitle */}
        <p
          style={{
            fontSize: 'clamp(1rem, 2.2vw, 1.25rem)',
            color: '#a1a1aa',
            lineHeight: 1.6,
            maxWidth: 780,
            margin: '0 auto 2.5rem auto',
          }}
        >
          Desde la <strong>minería de productos en almacenes de CJ Dropshipping</strong> con stock real y márgenes de 4x,
          hasta el <strong>espionaje de anuncios activos en Meta Ad Library</strong> y la creación automática de copys de alta conversión.
        </p>

        {/* Action CTAs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '4rem' }}>
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
              boxShadow: '0 10px 30px rgba(250, 174, 51, 0.35)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <span>🚀</span>
            <span>Entrar al Centro de Mando</span>
            <span>&rarr;</span>
          </Link>
          <Link
            href="/dashboard/catalog"
            style={{
              padding: '0.9rem 1.8rem',
              backgroundColor: '#121215',
              color: '#ffffff',
              borderRadius: '10px',
              fontSize: '0.95rem',
              fontWeight: 700,
              textDecoration: 'none',
              border: '1px solid #27272a',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
            }}
          >
            <span>🕵️</span>
            <span>Cazador de Productos Ganadores</span>
          </Link>
        </div>

        {/* ── STATS RIBBON ───────────────────────────────────────────── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            maxWidth: 1000,
            margin: '0 auto 4rem auto',
          }}
        >
          <div style={{ background: 'rgba(18, 18, 20, 0.7)', border: '1px solid #1f1f23', borderRadius: '12px', padding: '1.25rem', backdropFilter: 'blur(8px)' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#faae33' }}>12 Agentes</div>
            <div style={{ fontSize: '0.78rem', color: '#a1a1aa', marginTop: 4 }}>Oficina completa coordinada por Dora</div>
          </div>
          <div style={{ background: 'rgba(18, 18, 20, 0.7)', border: '1px solid #1f1f23', borderRadius: '12px', padding: '1.25rem', backdropFilter: 'blur(8px)' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#34d399' }}>3.5x a 5.5x</div>
            <div style={{ fontSize: '0.78rem', color: '#a1a1aa', marginTop: 4 }}>Margen de rentabilidad bruto por producto</div>
          </div>
          <div style={{ background: 'rgba(18, 18, 20, 0.7)', border: '1px solid #1f1f23', borderRadius: '12px', padding: '1.25rem', backdropFilter: 'blur(8px)' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#38bdf8' }}>0 Segundos</div>
            <div style={{ fontSize: '0.78rem', color: '#a1a1aa', marginTop: 4 }}>Sin redactar copys a mano ni adivinar creativos</div>
          </div>
          <div style={{ background: 'rgba(18, 18, 20, 0.7)', border: '1px solid #1f1f23', borderRadius: '12px', padding: '1.25rem', backdropFilter: 'blur(8px)' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#c084fc' }}>100% Autónomo</div>
            <div style={{ fontSize: '0.78rem', color: '#a1a1aa', marginTop: 4 }}>Estructuras ABO/CBO y stop-loss activo</div>
          </div>
        </div>
      </section>

      {/* ── INTERACTIVE DOPAMINE FEATURE: CALCULADORA DE BENEFICIO LIMPIO ── */}
      <section
        style={{
          maxWidth: 1040,
          margin: '0 auto 5rem auto',
          padding: '0 1.5rem',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div
          style={{
            background: 'linear-gradient(135deg, #131018, #0e0c12)',
            border: '1px solid #332448',
            borderRadius: '20px',
            padding: '2.5rem',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7), 0 0 30px rgba(168, 85, 247, 0.1)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <span
              style={{
                fontSize: '0.72rem',
                color: '#c084fc',
                background: 'rgba(192, 132, 252, 0.15)',
                border: '1px solid rgba(192, 132, 252, 0.3)',
                padding: '3px 10px',
                borderRadius: '999px',
                fontWeight: 800,
              }}
            >
              SIMULADOR DE RENTABILIDAD EN VIVO
            </span>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 900, color: '#ffffff', margin: '0.6rem 0 0.3rem 0' }}>
              Calcula tu Beneficio Limpio con Nexus AI
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#a1a1aa', margin: 0 }}>
              Mueve los controles para proyectar tus ganancias netas reales descontando coste de producto y anuncios.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem', alignItems: 'center' }}>
            {/* Sliders Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#e4e4e7' }}>
                    📦 Pedidos al Día:
                  </label>
                  <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#faae33' }}>
                    {dailyOrders} pedidos/día ({dailyOrders * 30} al mes)
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="150"
                  step="5"
                  value={dailyOrders}
                  onChange={(e) => setDailyOrders(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#faae33', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#71717a', marginTop: 4 }}>
                  <span>5 pedidos (Testing)</span>
                  <span>50 pedidos (Escalando)</span>
                  <span>150 pedidos (Marca Líder)</span>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#e4e4e7' }}>
                    💳 Ticket Medio de Venta (PVP):
                  </label>
                  <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#38bdf8' }}>
                    {formatMoney(averageTicket)} por pedido
                  </span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="100"
                  step="1"
                  value={averageTicket}
                  onChange={(e) => setAverageTicket(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#38bdf8', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#71717a', marginTop: 4 }}>
                  <span>{formatMoney(15)} (Low Ticket)</span>
                  <span>{formatMoney(45)} (Ideal Dropshipping)</span>
                  <span>{formatMoney(100)} (High Ticket)</span>
                </div>
              </div>
            </div>

            {/* Live Profit Output Box */}
            <div
              style={{
                background: '#09080c',
                border: '1px solid #2e2638',
                borderRadius: '16px',
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                boxShadow: '0 0 25px rgba(52, 211, 153, 0.1)',
              }}
            >
              <div>
                <div style={{ fontSize: '0.75rem', color: '#71717a', textTransform: 'uppercase', fontWeight: 700 }}>
                  Facturación Bruta Mensual
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ffffff' }}>
                  {formatMoney(monthlyRevenue)} <span style={{ fontSize: '0.85rem', color: '#71717a' }}>/ mes</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', borderTop: '1px solid #1a1720', paddingTop: '0.75rem' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#71717a' }}>Coste CJ Dropshipping</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ef4444' }}>
                    -{formatMoney(cogsCost)}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#71717a' }}>Anuncios Meta (ROAS 3.4x)</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ef4444' }}>
                    -{formatMoney(adsSpend)}
                  </div>
                </div>
              </div>

              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(52, 211, 153, 0.15), rgba(16, 185, 129, 0.05))',
                  border: '1px solid rgba(52, 211, 153, 0.4)',
                  borderRadius: '10px',
                  padding: '1rem',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  💰 Beneficio Limpio en tu Bolsillo
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: '#34d399', margin: '0.2rem 0' }}>
                  +{formatMoney(estimatedNetProfit)} <span style={{ fontSize: '0.9rem', color: '#a7f3d0' }}>/ mes</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#d1fae5' }}>
                  Margen Neto Real: <strong>{netMarginPct}%</strong> después de todo
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BENTO GRID: LOS 12 AGENTES EN ACCIÓN ─────────────────────── */}
      <section
        style={{
          maxWidth: 1180,
          margin: '0 auto 6rem auto',
          padding: '0 1.5rem',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span
            style={{
              fontSize: '0.72rem',
              color: '#faae33',
              background: 'rgba(250, 174, 51, 0.12)',
              border: '1px solid rgba(250, 174, 51, 0.3)',
              padding: '3px 10px',
              borderRadius: '999px',
              fontWeight: 800,
            }}
          >
            SISTEMA MULTI-AGENTE AUTÓNOMO
          </span>
          <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#ffffff', margin: '0.75rem 0 0.4rem 0' }}>
            Una Oficina Completa de Especialistas Trabajando para Ti
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#a1a1aa', margin: 0, maxWidth: 640, marginLeft: 'auto', marginRight: 'auto' }}>
            Cada agente domina una fase crítica del dropshipping. Selecciona un especialista para ver su entregable en tiempo real.
          </p>
        </div>

        {/* Agent Selector Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            overflowX: 'auto',
            paddingBottom: '0.75rem',
            marginBottom: '1.5rem',
            scrollbarWidth: 'none',
          }}
        >
          {agents.map((agent, idx) => (
            <button
              key={agent.id}
              onClick={() => setActiveAgentIndex(idx)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.6rem 1rem',
                background: activeAgentIndex === idx ? '#1a1622' : '#0e0d11',
                border: `1px solid ${activeAgentIndex === idx ? agent.badgeColor : '#221f28'}`,
                borderRadius: '8px',
                color: activeAgentIndex === idx ? '#ffffff' : '#a1a1aa',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
              }}
            >
              <span>{agent.avatar}</span>
              <span>{agent.name}</span>
            </button>
          ))}
        </div>

        {/* Active Agent Spotlight Card */}
        {agents[activeAgentIndex] && (
          <div
            style={{
              background: '#100e15',
              border: `1px solid ${agents[activeAgentIndex].badgeColor}40`,
              borderRadius: '16px',
              padding: '2rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem',
              alignItems: 'center',
              boxShadow: `0 10px 40px ${agents[activeAgentIndex].badgeColor}15`,
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '2.5rem' }}>{agents[activeAgentIndex].avatar}</span>
                <div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
                    {agents[activeAgentIndex].name}
                  </h3>
                  <span style={{ fontSize: '0.82rem', color: agents[activeAgentIndex].badgeColor, fontWeight: 700 }}>
                    {agents[activeAgentIndex].role}
                  </span>
                </div>
              </div>

              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  fontSize: '0.75rem',
                  color: '#34d399',
                  background: 'rgba(52, 211, 153, 0.1)',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  fontWeight: 700,
                  marginBottom: '1rem',
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399' }} />
                {agents[activeAgentIndex].status}
              </div>

              <p style={{ fontSize: '0.9rem', color: '#d4d4d8', lineHeight: 1.6, margin: 0 }}>
                {agents[activeAgentIndex].description}
              </p>
            </div>

            <div
              style={{
                background: '#09080c',
                border: '1px solid #221f28',
                borderRadius: '12px',
                padding: '1.25rem',
              }}
            >
              <div style={{ fontSize: '0.72rem', color: '#71717a', textTransform: 'uppercase', fontWeight: 800, marginBottom: '0.4rem' }}>
                Entregable Automático en el Espacio
              </div>
              <div style={{ fontSize: '0.88rem', color: '#ffffff', fontWeight: 600, lineHeight: 1.5 }}>
                {agents[activeAgentIndex].deliverable}
              </div>
              <div style={{ marginTop: '1rem' }}>
                <Link
                  href="/dashboard"
                  style={{
                    fontSize: '0.78rem',
                    color: agents[activeAgentIndex].badgeColor,
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                  }}
                >
                  <span>Ver a {agents[activeAgentIndex].name} en el Centro de Mando</span>
                  <span>&rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ── LIVE WINNING PRODUCT RADAR ──────────────────────────────── */}
      <section
        style={{
          maxWidth: 1180,
          margin: '0 auto 6rem auto',
          padding: '0 1.5rem',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <span
              style={{
                fontSize: '0.72rem',
                color: '#34d399',
                background: 'rgba(52, 211, 153, 0.12)',
                border: '1px solid rgba(52, 211, 153, 0.3)',
                padding: '3px 10px',
                borderRadius: '999px',
                fontWeight: 800,
              }}
            >
              RADAR DE PRODUCTOS GANADORES
            </span>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 900, color: '#ffffff', margin: '0.6rem 0 0 0' }}>
              Productos Validados con Fábrica &amp; Anuncios Activos
            </h2>
          </div>

          <Link
            href="/dashboard/catalog"
            style={{
              color: '#faae33',
              fontSize: '0.85rem',
              fontWeight: 700,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <span>Abrir Catálogo Completo (CJ + Meta)</span>
            <span>&rarr;</span>
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {trendingProducts.map((prod, idx) => (
            <div
              key={idx}
              style={{
                background: '#100e14',
                border: '1px solid #241f2d',
                borderRadius: '14px',
                overflow: 'hidden',
                boxShadow: '0 8px 25px rgba(0,0,0,0.4)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ position: 'relative', width: '100%', height: 180, background: '#0a090d' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={prod.image}
                  alt={prod.name}
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span
                  style={{
                    position: 'absolute',
                    top: 10,
                    left: 10,
                    background: 'rgba(0,0,0,0.8)',
                    color: prod.tagColor,
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    padding: '3px 8px',
                    borderRadius: '4px',
                    border: `1px solid ${prod.tagColor}40`,
                  }}
                >
                  {prod.tag} ({prod.daysActive}d activo)
                </span>
              </div>

              <div style={{ padding: '1.25rem' }}>
                <span style={{ fontSize: '0.72rem', color: '#71717a', fontWeight: 700, textTransform: 'uppercase' }}>
                  {prod.niche}
                </span>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', margin: '0.3rem 0 0.85rem 0' }}>
                  {prod.name}
                </h4>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    background: '#09080c',
                    padding: '0.6rem 0.75rem',
                    borderRadius: '8px',
                    border: '1px solid #1a1720',
                    marginBottom: '1rem',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.68rem', color: '#71717a', display: 'block' }}>Coste Fábrica:</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#e4e4e7' }}>
                      {formatMoney(prod.factoryCost)}
                    </span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.68rem', color: '#71717a', display: 'block' }}>PVP Recomendado:</span>
                    <span style={{ fontSize: '0.92rem', fontWeight: 900, color: '#34d399' }}>
                      {formatMoney(prod.sellPrice)}
                    </span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.68rem', color: '#71717a', display: 'block' }}>Multiplicador:</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#faae33' }}>
                      {prod.multiple}
                    </span>
                  </div>
                </div>

                <Link
                  href="/dashboard/catalog"
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #1d4ed8, #2563eb)',
                    color: '#ffffff',
                    padding: '0.55rem',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.35rem',
                  }}
                >
                  <span>🎬</span>
                  <span>Ver Video &amp; Métricas en Catálogo</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER CTA ─────────────────────────────────────────────── */}
      <footer
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: '#050507',
          padding: '3.5rem 1.5rem',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ffffff', margin: '0 0 0.8rem 0' }}>
            Empieza a Operar con tu Oficina de Agentes IA Hoy
          </h3>
          <p style={{ fontSize: '0.88rem', color: '#a1a1aa', marginBottom: '1.75rem', lineHeight: 1.6 }}>
            Acceso instantáneo a la plataforma. Diseñado para emprendedores y marcas que buscan rentabilidad real.
          </p>
          <Link
            href="/dashboard"
            style={{
              padding: '0.85rem 2rem',
              background: 'linear-gradient(135deg, #faae33, #d98216)',
              color: '#090807',
              borderRadius: '8px',
              fontSize: '0.95rem',
              fontWeight: 800,
              textDecoration: 'none',
              boxShadow: '0 8px 25px rgba(250, 174, 51, 0.3)',
              display: 'inline-block',
            }}
          >
            Abrir Mi Centro de Control &rarr;
          </Link>
          <div style={{ fontSize: '0.72rem', color: '#52525b', marginTop: '2.5rem' }}>
            © {new Date().getFullYear()} Nexus AI Dropshipping OS. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  )
}
