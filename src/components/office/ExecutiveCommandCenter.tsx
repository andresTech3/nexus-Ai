'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useOfficeStore } from '@/lib/office/store'
import { AGENT_DEFINITIONS } from '@/lib/office/agents/definitions'
import { AgentStatus, Department } from '@/types/office'
import { calculateUnitEconomics } from '@/lib/office/finance/calculator'

interface ExecutiveCommandCenterProps {
  onOpenResearch?: () => void
}

export function ExecutiveCommandCenter({ onOpenResearch }: ExecutiveCommandCenterProps) {
  const store = useOfficeStore()
  const activeOffice = store.offices[store.activeOfficeId]
  const productName = activeOffice?.product?.name?.trim() || ''
  const brandName = activeOffice?.brand?.name?.trim() || ''
  const niche = activeOffice?.product?.niche?.trim() || ''

  const hasProduct = Boolean(productName)

  // Fast manual product assignment form inside empty state
  const [inputProductName, setInputProductName] = useState('')
  const [inputProductNiche, setInputProductNiche] = useState('Salud & Bienestar')
  const [isAssigning, setIsAssigning] = useState(false)
  const [selectedDept, setSelectedDept] = useState<'ALL' | Department>('ALL')

  // Real unit economics based on active product's real supplier and sell prices
  const prodLower = (productName + ' ' + (activeOffice?.product?.niche || '')).toLowerCase()
  const isRing = prodLower.includes('anillo') || prodLower.includes('titanio')
  const isLamp = prodLower.includes('luna') || prodLower.includes('lamp') || prodLower.includes('luz')
  const isPet = prodLower.includes('mascota') || prodLower.includes('perro') || prodLower.includes('gato') || prodLower.includes('pet')
  const isWatch = prodLower.includes('reloj') || prodLower.includes('watch')
  const isPosture = prodLower.includes('postur') || prodLower.includes('espalda')

  const effectiveCost = activeOffice?.product?.supplierPriceEur && activeOffice.product.supplierPriceEur > 0
    ? activeOffice.product.supplierPriceEur
    : isRing ? 18.50 : isLamp ? 9.80 : isPet ? 3.60 : isPosture ? 4.80 : isWatch ? 14.50 : 6.80

  const effectivePvp = activeOffice?.product?.sellPriceEur && activeOffice.product.sellPriceEur > 0
    ? activeOffice.product.sellPriceEur
    : isRing ? 89.90 : isLamp ? 49.90 : isPet ? 24.90 : isPosture ? 29.90 : isWatch ? 59.90 : Math.max(29.90, Math.round(effectiveCost * 3.6 * 10) / 10)

  const unitEco = calculateUnitEconomics({
    costo_producto: hasProduct ? effectiveCost : 0,
    costo_envio: hasProduct ? 3.8 : 0,
    costo_packaging: hasProduct ? (effectiveCost > 15 ? 2.2 : 1.2) : 0,
    pvp: hasProduct ? effectivePvp : 0,
    comision_pct: 0.029,
    comision_fijo: 0.3,
    provision_devoluciones_pct: 0.05,
    iva_pct: 0.21,
    traffic_mode: activeOffice?.trafficMode || 'HYBRID',
  })

  const handleManualAssign = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputProductName.trim()) return
    setIsAssigning(true)
    store.changeProduct(activeOffice.id, {
      name: inputProductName.trim(),
      niche: inputProductNiche.trim() || 'General E-commerce',
    })
    setIsAssigning(false)
    setInputProductName('')
  }

  const handleClearCurrentProduct = () => {
    if (confirm(`¿Estás seguro de que deseas eliminar "${productName}" de este espacio de trabajo? El espacio quedará completamente vacío y limpio.`)) {
      store.clearProduct(activeOffice.id)
    }
  }

  const handleDeleteCurrentWorkspace = () => {
    if (confirm(`¿Estás seguro de que deseas eliminar el espacio de trabajo "${activeOffice.name}"? Esta acción no se puede deshacer.`)) {
      store.deleteOffice(activeOffice.id)
    }
  }

  const getStatusBadge = (status: AgentStatus) => {
    switch (status) {
      case 'ANALYZING':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#38bdf8', fontSize: '0.7rem', fontWeight: 700 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#38bdf8', animation: 'pulse 1.5s infinite' }}></span>
            Analizando
          </span>
        )
      case 'GENERATING':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#facc15', fontSize: '0.7rem', fontWeight: 700 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#facc15', animation: 'pulse 1.5s infinite' }}></span>
            Generando
          </span>
        )
      case 'DONE':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#34d399', fontSize: '0.7rem', fontWeight: 700 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399' }}></span>
            Hecho
          </span>
        )
      case 'NEEDS_APPROVAL':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#f43f5e', fontSize: '0.7rem', fontWeight: 700 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f43f5e' }}></span>
            Revisión
          </span>
        )
      default:
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#71717a', fontSize: '0.7rem', fontWeight: 600 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#52525b' }}></span>
            En Espera
          </span>
        )
    }
  }

  const agentsList = Object.values(AGENT_DEFINITIONS)
  const filteredAgents = selectedDept === 'ALL' ? agentsList : agentsList.filter((a) => a.department === selectedDept)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      {/* ── WORKSPACE ACTION CONTROLS ────────────────────────────────────── */}
      <div
        style={{
          background: '#121019',
          border: '1px solid #282136',
          borderRadius: '10px',
          padding: '0.75rem 1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8rem', color: '#a1a1aa', fontWeight: 600 }}>
            Proyecto activo:
          </span>
          <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#ffffff' }}>
            {activeOffice?.name || 'Mi Espacio'}
          </span>
          {hasProduct && (
            <span
              style={{
                fontSize: '0.75rem',
                color: '#34d399',
                background: 'rgba(52, 211, 153, 0.12)',
                border: '1px solid rgba(52, 211, 153, 0.3)',
                padding: '2px 8px',
                borderRadius: '6px',
                fontWeight: 700,
              }}
            >
              📦 {productName}
            </span>
          )}
        </div>

        {/* Action buttons: Clear Product / Delete Workspace */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {hasProduct && (
            <button
              onClick={handleClearCurrentProduct}
              style={{
                background: '#181522',
                border: '1px solid #332845',
                color: '#f87171',
                padding: '0.4rem 0.8rem',
                borderRadius: '6px',
                fontSize: '0.76rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
              title="Borra el producto actual y deja el espacio limpio"
            >
              <span>🗑️ Quitar Producto</span>
            </button>
          )}

          <button
            onClick={handleDeleteCurrentWorkspace}
            style={{
              background: '#181522',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#ef4444',
              padding: '0.4rem 0.8rem',
              borderRadius: '6px',
              fontSize: '0.76rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
            title="Elimina este espacio de trabajo"
          >
            <span>Eliminar Espacio</span>
          </button>
        </div>
      </div>

      {/* ── EMPTY STATE ONBOARDING (If no product has been assigned) ────────── */}
      {!hasProduct && (
        <div
          style={{
            background: 'linear-gradient(135deg, #18120e, #110e0c)',
            border: '1px solid #3d2a1d',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          }}
        >
          <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '12px',
                background: 'rgba(250, 174, 51, 0.15)',
                color: '#faae33',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem auto',
                border: '1px solid rgba(250, 174, 51, 0.3)',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                <line x1="12" y1="22.08" x2="12" y2="12"></line>
              </svg>
            </div>

            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.5rem' }}>
              Tu Espacio de Trabajo está Listo y Limpio
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#a1a1aa', lineHeight: 1.6, marginBottom: '2rem' }}>
              No hay datos inventados ni simulaciones falsas. Los 12 agentes están en espera. Elige cómo quieres comenzar a trabajar con tu marca:
            </p>

            {/* 2 Ways to Start: Manual input or Ivan Research */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1.25rem',
                textAlign: 'left',
              }}
            >
              {/* Option 1: Manual Assignment */}
              <div
                style={{
                  background: '#121214',
                  border: '1px solid #27272a',
                  borderRadius: '10px',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '1.1rem' }}>✏️</span>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>
                      Asignar Producto Manual
                    </h3>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#71717a', lineHeight: 1.5, marginBottom: '1rem' }}>
                    Si ya tienes un producto en mente (o un enlace de proveedor), escríbelo aquí para que los agentes empiecen a redactar y calcular.
                  </p>

                  <form onSubmit={handleManualAssign} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', color: '#a1a1aa', fontWeight: 600, marginBottom: '0.25rem' }}>
                        Nombre del Producto:
                      </label>
                      <input
                        type="text"
                        placeholder="Ej. Lámpara Flotante Lunar LED"
                        value={inputProductName}
                        onChange={(e) => setInputProductName(e.target.value)}
                        required
                        style={{
                          width: '100%',
                          background: '#09090b',
                          border: '1px solid #332418',
                          color: '#fff',
                          padding: '0.5rem 0.75rem',
                          borderRadius: '6px',
                          fontSize: '0.85rem',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', color: '#a1a1aa', fontWeight: 600, marginBottom: '0.25rem' }}>
                        Nicho / Categoría:
                      </label>
                      <input
                        type="text"
                        placeholder="Ej. Hogar, Decoración, Bienestar"
                        value={inputProductNiche}
                        onChange={(e) => setInputProductNiche(e.target.value)}
                        style={{
                          width: '100%',
                          background: '#09090b',
                          border: '1px solid #332418',
                          color: '#fff',
                          padding: '0.5rem 0.75rem',
                          borderRadius: '6px',
                          fontSize: '0.85rem',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isAssigning || !inputProductName.trim()}
                      style={{
                        marginTop: '0.5rem',
                        background: 'linear-gradient(135deg, #faae33, #d98216)',
                        color: '#181008',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '0.6rem',
                        fontSize: '0.825rem',
                        fontWeight: 700,
                        cursor: !inputProductName.trim() ? 'not-allowed' : 'pointer',
                        opacity: !inputProductName.trim() ? 0.6 : 1,
                      }}
                    >
                      {isAssigning ? 'Activando...' : 'Guardar y Activar Agentes'}
                    </button>
                  </form>
                </div>
              </div>

              {/* Option 2: Automatic Hunting with Ivan */}
              <div
                style={{
                  background: '#121214',
                  border: '1px solid #27272a',
                  borderRadius: '10px',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '1.1rem' }}>🔍</span>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>
                      Buscar Tendencia con Iván
                    </h3>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#71717a', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                    Deja que Iván (Investigador de Producto) escanee las tendencias de TikTok Creative Center y Google Trends para proponerte un producto ganador con formato visual de 3 segundos.
                  </p>
                  <div
                    style={{
                      background: 'rgba(56, 189, 248, 0.08)',
                      border: '1px solid rgba(56, 189, 248, 0.2)',
                      borderRadius: '6px',
                      padding: '0.75rem',
                      fontSize: '0.75rem',
                      color: '#93c5fd',
                      marginBottom: '1rem',
                    }}
                  >
                    💡 <strong>Filtro de calidad de Iván:</strong> Solo acepta productos con margen &ge; 3.5x y demostración en video &lt; 3 segundos.
                  </div>
                </div>

                <Link
                  href="/dashboard/catalog"
                  style={{
                    background: '#18181b',
                    border: '1px solid #38bdf8',
                    color: '#38bdf8',
                    textDecoration: 'none',
                    borderRadius: '6px',
                    padding: '0.65rem',
                    fontSize: '0.825rem',
                    fontWeight: 700,
                    textAlign: 'center',
                    display: 'block',
                    transition: 'all 0.15s',
                  }}
                >
                  🔍 Explorar Productos Ganadores con Iván →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 1. TOP METRICS RIBBON (Only shows real calculations if product exists) ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
        }}
      >
        <div
          style={{
            background: '#121214',
            border: '1px solid #1f1f23',
            borderRadius: '10px',
            padding: '1.25rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#71717a', fontWeight: 700, textTransform: 'uppercase' }}>
              Margen Neto Producto
            </span>
            <span
              style={{
                fontSize: '0.7rem',
                padding: '2px 6px',
                borderRadius: '4px',
                background: hasProduct ? 'rgba(52, 211, 153, 0.1)' : 'rgba(107, 114, 128, 0.1)',
                color: hasProduct ? '#34d399' : '#71717a',
                fontWeight: 700,
              }}
            >
              {hasProduct ? (unitEco.health_score === 'GREEN' ? 'ÓPTIMO' : 'AJUSTAR') : 'SIN PRODUCTO'}
            </span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: hasProduct ? '#ffffff' : '#52525b', letterSpacing: '-0.02em' }}>
            {hasProduct ? `${unitEco.margen_neto_pct.toFixed(1)}%` : '—'}
          </div>
          <div style={{ fontSize: '0.775rem', color: '#71717a', marginTop: '0.35rem' }}>
            {hasProduct
              ? `${unitEco.beneficio_neto_antes_ads.toFixed(2)} € beneficio bruto por unidad`
              : 'Asigna un producto para calcular costes'}
          </div>
        </div>

        <div
          style={{
            background: '#121214',
            border: '1px solid #1f1f23',
            borderRadius: '10px',
            padding: '1.25rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#71717a', fontWeight: 700, textTransform: 'uppercase' }}>
              Multiplicador PVP
            </span>
            <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', background: hasProduct ? 'rgba(56, 189, 248, 0.1)' : 'rgba(107, 114, 128, 0.1)', color: hasProduct ? '#38bdf8' : '#71717a', fontWeight: 700 }}>
              Dora Quality Gate
            </span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: hasProduct ? '#38bdf8' : '#52525b', letterSpacing: '-0.02em' }}>
            {hasProduct ? `${unitEco.multiplicador_markup.toFixed(1)}x` : '—'}
          </div>
          <div style={{ fontSize: '0.775rem', color: '#71717a', marginTop: '0.35rem' }}>
            {hasProduct ? 'Multiplicador saludable (&ge; 3.5x)' : 'Requiere precio y coste'}
          </div>
        </div>

        <div
          style={{
            background: '#121214',
            border: '1px solid #1f1f23',
            borderRadius: '10px',
            padding: '1.25rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#71717a', fontWeight: 700, textTransform: 'uppercase' }}>
              CPA Techo Meta Ads
            </span>
            <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', background: hasProduct ? 'rgba(250, 174, 51, 0.1)' : 'rgba(107, 114, 128, 0.1)', color: hasProduct ? '#faae33' : '#71717a', fontWeight: 700 }}>
              Límite Stop-Loss
            </span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: hasProduct ? '#faae33' : '#52525b', letterSpacing: '-0.02em' }}>
            {hasProduct ? `${unitEco.cpa_maximo_rentable.toFixed(2)} €` : '—'}
          </div>
          <div style={{ fontSize: '0.775rem', color: '#71717a', marginTop: '0.35rem' }}>
            {hasProduct ? `ROAS de equilibrio: ${unitEco.roas_equilibrio.toFixed(2)}x` : 'Límite de coste por compra'}
          </div>
        </div>

        <div
          style={{
            background: '#121214',
            border: '1px solid #1f1f23',
            borderRadius: '10px',
            padding: '1.25rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#71717a', fontWeight: 700, textTransform: 'uppercase' }}>
              Retención Visual 3s
            </span>
            <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', background: hasProduct ? 'rgba(225, 48, 108, 0.1)' : 'rgba(107, 114, 128, 0.1)', color: hasProduct ? '#f472b6' : '#71717a', fontWeight: 700 }}>
              TikTok / Reels
            </span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: hasProduct ? '#f472b6' : '#52525b', letterSpacing: '-0.02em' }}>
            {hasProduct ? '88 / 100' : '—'}
          </div>
          <div style={{ fontSize: '0.775rem', color: '#71717a', marginTop: '0.35rem' }}>
            {hasProduct ? 'Demostrable visualmente en los primeros 3s' : 'Requiere producto'}
          </div>
        </div>
      </div>

      {/* ── 2. PRODUCT DEMAND & TREND CHART + FAST ACTION SHORTCUTS ───────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(300px, 2fr) minmax(260px, 1fr)',
          gap: '1.25rem',
        }}
      >
        {/* Trend Chart Box */}
        <div
          style={{
            background: '#121214',
            border: '1px solid #1f1f23',
            borderRadius: '10px',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>
                Tendencia de Demanda: {hasProduct ? `"${productName}"` : 'Sin Producto Asignado'}
              </h3>
              <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.775rem', color: '#71717a' }}>
                {hasProduct
                  ? 'Datos de tracción en TikTok Creative Center y Google Trends España (Últimos 30 días)'
                  : 'La curva se trazará en tiempo real al asignar o investigar un producto'}
              </p>
            </div>
            {hasProduct && (
              <span
                style={{
                  fontSize: '0.72rem',
                  color: '#34d399',
                  background: 'rgba(52, 211, 153, 0.1)',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontWeight: 700,
                }}
              >
                ▲ Demanda Activa
              </span>
            )}
          </div>

          {/* SVG Sparkline / Interactive Line Chart */}
          <div style={{ width: '100%', height: '140px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {hasProduct ? (
              <svg width="100%" height="100%" viewBox="0 0 500 120" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="commandTrendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                <line x1="0" y1="30" x2="500" y2="30" stroke="#1f1f23" strokeDasharray="3 3" />
                <line x1="0" y1="65" x2="500" y2="65" stroke="#1f1f23" strokeDasharray="3 3" />
                <line x1="0" y1="95" x2="500" y2="95" stroke="#1f1f23" strokeDasharray="3 3" />

                <polygon
                  points="0,110 40,95 80,100 120,80 160,85 200,60 240,65 280,45 320,55 360,35 400,40 440,25 500,15 500,120 0,120"
                  fill="url(#commandTrendGrad)"
                />

                <polyline
                  points="0,110 40,95 80,100 120,80 160,85 200,60 240,65 280,45 320,55 360,35 400,40 440,25 500,15"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                <circle cx="500" cy="15" r="4" fill="#38bdf8" />
              </svg>
            ) : (
              <div style={{ textAlign: 'center', color: '#52525b', fontSize: '0.8rem' }}>
                <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '4px' }}>📊</span>
                Asigna un producto arriba para generar la curva de demanda
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#71717a', marginTop: '0.35rem' }}>
            <span>Semana 1 (Detección)</span>
            <span>Semana 2 (Validación)</span>
            <span>Semana 3 (Tracción Reels)</span>
            <span>Semana 4 (Listo para Escalar)</span>
          </div>
        </div>

        {/* Specialized Channel Shortcuts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <Link
            href="/dashboard/shopify"
            style={{
              background: '#121214',
              border: '1px solid #1f1f23',
              borderRadius: '8px',
              padding: '1rem',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'border-color 0.2s, background 0.2s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '6px',
                  background: 'rgba(150, 191, 66, 0.15)',
                  color: '#96bf42',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.337 3.095c-.033-.298-.28-.506-.575-.506l-4.22-.002c-.053 0-.104.015-.15.042l-1.65.987a.499.499 0 0 0-.236.435v.06l-.993 3.08-1.52.47c-.41.127-.63.568-.504.978l3.19 10.37c.097.316.386.536.716.536h9.11c.33 0 .62-.22.717-.536l3.19-10.37c.126-.41-.094-.851-.504-.978l-1.52-.47-.993-3.08v-.06a.5.5 0 0 0-.236-.435l-1.65-.987c-.046-.027-.097-.042-.15-.042l-2.02.001c.01-.01.02-.02.03-.03z" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>Shopify Studio</div>
                <div style={{ fontSize: '0.72rem', color: '#71717a' }}>Liquid Dawn & Bundles AOV</div>
              </div>
            </div>
            <span style={{ color: '#96bf42', fontSize: '0.9rem' }}>&rarr;</span>
          </Link>
        </div>
      </div>

      {/* ── 3. 12 AGENTS ROSTER MATRIX ────────────────────────────────────── */}
      <div
        style={{
          background: '#121214',
          border: '1px solid #1f1f23',
          borderRadius: '10px',
          padding: '1.5rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: '#ffffff' }}>
              Equipo de 12 Agentes Especialistas
            </h3>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: '#71717a' }}>
              Haz clic en cualquier agente para ver su ficha técnica, prompts generados y entregables.
            </p>
          </div>

          {/* Department Filter Pills */}
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {(['ALL', 'Dirección', 'Producto', 'Marketing', 'Ecommerce', 'Operaciones'] as const).map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '6px',
                  border: selectedDept === dept ? '1px solid #faae33' : '1px solid #27272a',
                  background: selectedDept === dept ? 'rgba(250, 174, 51, 0.15)' : '#09090b',
                  color: selectedDept === dept ? '#faae33' : '#a1a1aa',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {dept === 'ALL' ? 'Todos (12)' : dept}
              </button>
            ))}
          </div>
        </div>

        {/* Agents Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1rem',
          }}
        >
          {filteredAgents.map((agent) => {
            const status = activeOffice?.agentStates[agent.id] || 'IDLE'
            return (
              <div
                key={agent.id}
                onClick={() => store.selectAgent(agent.id)}
                style={{
                  background: '#09090b',
                  border: '1px solid #1f1f23',
                  borderRadius: '8px',
                  padding: '1rem',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                  transition: 'border-color 0.2s, transform 0.15s',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.65rem' }}>
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: '10px',
                        backgroundColor: '#161420',
                        border: `1.5px solid ${agent.avatarColor}60`,
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                      }}
                    >
                      {agent.avatarImage ? (
                        <img
                          src={agent.avatarImage}
                          alt={agent.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <span style={{ color: agent.avatarColor, fontWeight: 800, fontSize: '0.9rem' }}>
                          {agent.avatarInitials}
                        </span>
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ffffff' }}>
                          {agent.name}
                        </div>
                        {getStatusBadge(status)}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: agent.avatarColor, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {agent.role}
                      </div>
                    </div>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.74rem', color: '#a1a1aa', lineHeight: 1.4 }}>
                    {agent.skills[0] || 'Especialista en su área'}
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid #18181b', fontSize: '0.68rem', color: '#52525b' }}>
                  <span>{agent.department}</span>
                  <span style={{ color: '#a1a1aa' }}>Ficha técnica →</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
