'use client'

import React, { useState } from 'react'
import { useOfficeStore } from '@/lib/office/store'
import { scheduler } from '@/lib/office/scheduler'
import { TrafficMode } from '@/types/office'

interface NewProductLaunchModalProps {
  isOpen: boolean
  onClose: () => void
}

const PRODUCT_PRESETS = [
  {
    name: 'Lámpara Lunar Levitante Magnética',
    niche: 'Hogar & Decoración Futurista',
    brand: 'Lumina Sphere',
    cost: 11.20,
    pvp: 49.90,
    trafficMode: 'HYBRID' as TrafficMode,
  },
  {
    name: 'Cepillo Exfoliante Facial Ultrasónico IPX7',
    niche: 'Skincare Tecnológico & Cuidado Personal',
    brand: 'DermaPulse Paris',
    cost: 6.80,
    pvp: 34.90,
    trafficMode: 'HYBRID' as TrafficMode,
  },
  {
    name: 'Corrector de Postura Inteligente con Sensor Vibratorio',
    niche: 'Salud, Ergonomía & Bienestar en Casa',
    brand: 'PosturAlign Tech',
    cost: 5.50,
    pvp: 29.90,
    trafficMode: 'ADS' as TrafficMode,
  },
]

export function NewProductLaunchModal({ isOpen, onClose }: NewProductLaunchModalProps) {
  const store = useOfficeStore()

  const [productName, setProductName] = useState('')
  const [niche, setNiche] = useState('')
  const [brandName, setBrandName] = useState('')
  const [productCost, setProductCost] = useState<number>(8.50)
  const [targetPvp, setTargetPvp] = useState<number>(39.90)
  const [trafficMode, setTrafficMode] = useState<TrafficMode>('HYBRID')
  const [notes, setNotes] = useState('')

  if (!isOpen) return null

  // Markup calculation
  const multiplier = productCost > 0 ? (targetPvp / productCost).toFixed(1) : '0'
  const isMarkupValid = parseFloat(multiplier) >= 3.5

  const handleApplyPreset = (p: typeof PRODUCT_PRESETS[0]) => {
    setProductName(p.name)
    setNiche(p.niche)
    setBrandName(p.brand)
    setProductCost(p.cost)
    setTargetPvp(p.pvp)
    setTrafficMode(p.trafficMode)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!productName.trim() || !niche.trim()) return

    const brand = brandName.trim() || productName.split(' ')[0] + ' Brand'
    const officeName = `Oficina ${productName.slice(0, 24)}`

    // Create new office in store
    const newOfficeId = store.createOffice(
      officeName,
      productName.trim(),
      niche.trim(),
      trafficMode,
      'empty'
    )

    // Update newly created office details
    const office = store.offices[newOfficeId]
    if (office) {
      office.brand.name = brand
      office.product.description = notes.trim() || `Producto D2C validado con multiplicador ${multiplier}x.`
      office.status = 'ON'
    }

    store.setActiveOffice(newOfficeId)
    onClose()

    // Kick off pipeline automatically
    setTimeout(() => {
      scheduler.startPipeline(newOfficeId)
    }, 400)
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
        animation: 'fadeIn 0.2s ease-out',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          backgroundColor: '#1b1410',
          border: '2px solid #faae33',
          borderRadius: '12px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 0 35px rgba(250, 174, 51, 0.25)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem',
            background: 'linear-gradient(180deg, #271a12, #1b1410)',
            borderBottom: '1px solid #3d2a1d',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.2rem' }}>🚀</span>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#fff', margin: 0 }}>
                Probar con un Nuevo Producto
              </h2>
              <span
                style={{
                  backgroundColor: '#064e3b',
                  color: '#34d399',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '10px',
                }}
              >
                11 AGENTES EN ACCIÓN
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#9ca3af', margin: '4px 0 0 0' }}>
              Tus agentes investigarán el nicho, calcularán los márgenes, diseñarán la tienda Shopify y redactarán los anuncios UGC.
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#9ca3af',
              fontSize: '1.3rem',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Preset Quick Fill */}
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#faae33', marginBottom: '0.4rem' }}>
              💡 O ELIGE UN PRODUCTO DE PRUEBA RÁPIDA (1 CLICK):
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {PRODUCT_PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(p)}
                  style={{
                    backgroundColor: productName === p.name ? '#faae33' : '#271a12',
                    color: productName === p.name ? '#181008' : '#e5e7eb',
                    border: `1px solid ${productName === p.name ? '#faae33' : '#3d2a1d'}`,
                    borderRadius: '6px',
                    padding: '0.35rem 0.65rem',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  ✦ {p.name.split(' ')[0]} {p.name.split(' ')[1]} ({p.pvp}€)
                </button>
              ))}
            </div>
          </div>

          {/* Product Name */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#fff', marginBottom: '0.3rem' }}>
              1. Nombre del Producto: <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="text"
              required
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="ej: Lámpara Lunar Levitante Magnética"
              style={{
                width: '100%',
                backgroundColor: '#120d09',
                border: '1px solid #4a3424',
                borderRadius: '6px',
                padding: '0.55rem 0.75rem',
                color: '#fff',
                fontSize: '0.85rem',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Niche & Brand Name Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#fff', marginBottom: '0.3rem' }}>
                2. Nicho / Categoría: <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                required
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="ej: Hogar & Decoración Futurista"
                style={{
                  width: '100%',
                  backgroundColor: '#120d09',
                  border: '1px solid #4a3424',
                  borderRadius: '6px',
                  padding: '0.55rem 0.75rem',
                  color: '#fff',
                  fontSize: '0.82rem',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#fff', marginBottom: '0.3rem' }}>
                3. Nombre de Marca (Opcional):
              </label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="ej: Lumina Sphere"
                style={{
                  width: '100%',
                  backgroundColor: '#120d09',
                  border: '1px solid #4a3424',
                  borderRadius: '6px',
                  padding: '0.55rem 0.75rem',
                  color: '#fff',
                  fontSize: '0.82rem',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* Pricing & Markup Rule Gate */}
          <div
            style={{
              backgroundColor: '#201712',
              border: `1px solid ${isMarkupValid ? '#059669' : '#b45309'}`,
              borderRadius: '8px',
              padding: '0.85rem',
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#faae33', marginBottom: '0.4rem' }}>
              4. Finanzas Previas &amp; Calidad de Dora (Regla &ge; 3.5x):
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', alignItems: 'center' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.68rem', color: '#9ca3af', marginBottom: '0.2rem' }}>
                  Coste Proveedor (€):
                </label>
                <input
                  type="number"
                  step="0.10"
                  min="0.5"
                  value={productCost}
                  onChange={(e) => setProductCost(parseFloat(e.target.value) || 0)}
                  style={{
                    width: '100%',
                    backgroundColor: '#120d09',
                    border: '1px solid #4a3424',
                    borderRadius: '4px',
                    padding: '0.4rem',
                    color: '#fff',
                    fontSize: '0.85rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.68rem', color: '#9ca3af', marginBottom: '0.2rem' }}>
                  PVP Objetivo (€):
                </label>
                <input
                  type="number"
                  step="0.10"
                  min="1"
                  value={targetPvp}
                  onChange={(e) => setTargetPvp(parseFloat(e.target.value) || 0)}
                  style={{
                    width: '100%',
                    backgroundColor: '#120d09',
                    border: '1px solid #4a3424',
                    borderRadius: '4px',
                    padding: '0.4rem',
                    color: '#fff',
                    fontSize: '0.85rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.68rem', color: '#9ca3af' }}>Multiplicador Markup:</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: isMarkupValid ? '#34d399' : '#f87171' }}>
                  {multiplier}x
                </div>
                <div style={{ fontSize: '0.65rem', color: isMarkupValid ? '#34d399' : '#f87171', fontWeight: 700 }}>
                  {isMarkupValid ? '✓ Aprobado por Dora' : '⚠️ Inferior a 3.5x'}
                </div>
              </div>
            </div>
          </div>

          {/* Traffic Mode Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#fff', marginBottom: '0.3rem' }}>
              5. Estrategia de Tráfico:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              {(['HYBRID', 'ADS', 'ORGANIC'] as TrafficMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setTrafficMode(mode)}
                  style={{
                    backgroundColor: trafficMode === mode ? '#faae33' : '#201712',
                    color: trafficMode === mode ? '#181008' : '#d1d5db',
                    border: `1px solid ${trafficMode === mode ? '#faae33' : '#3d2a1d'}`,
                    borderRadius: '6px',
                    padding: '0.5rem',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  {mode === 'HYBRID' ? '⚡ Híbrido (Ads + Viral)' : mode === 'ADS' ? '🎯 Solo Meta Ads' : '🌱 Solo Orgánico'}
                </button>
              ))}
            </div>
          </div>

          {/* Optional notes */}
          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', color: '#9ca3af', marginBottom: '0.2rem' }}>
              Datos o enlaces opcionales (AliExpress, CJ, competidores):
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Pega enlaces de producto o instrucciones especiales para Iván y Dora..."
              style={{
                width: '100%',
                backgroundColor: '#120d09',
                border: '1px solid #4a3424',
                borderRadius: '6px',
                padding: '0.45rem',
                color: '#fff',
                fontSize: '0.75rem',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Submit Button */}
          <div style={{ marginTop: '0.5rem' }}>
            <button
              type="submit"
              disabled={!productName.trim() || !niche.trim()}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #faae33 0%, #d98216 100%)',
                color: '#181008',
                border: 'none',
                borderRadius: '8px',
                padding: '0.85rem',
                fontSize: '0.95rem',
                fontWeight: 900,
                cursor: !productName.trim() || !niche.trim() ? 'not-allowed' : 'pointer',
                opacity: !productName.trim() || !niche.trim() ? 0.5 : 1,
                boxShadow: '0 4px 20px rgba(250, 174, 51, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
              }}
            >
              <span>🚀</span>
              <span>Crear Oficina y Poner a Trabajar a los 11 Agentes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
