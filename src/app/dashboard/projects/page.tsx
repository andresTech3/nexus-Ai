'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useOfficeStore } from '@/lib/office/store'
import { scheduler } from '@/lib/office/scheduler'
import { DeliverablesView } from '@/components/office/DeliverablesView'
import { TrafficMode } from '@/types/office'

function PackageIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  )
}

function GridIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
    </svg>
  )
}

function SettingsIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

export default function ProjectsPage() {
  const store = useOfficeStore()
  const activeOffice = store.offices[store.activeOfficeId]

  const hasActiveProduct = Boolean(activeOffice?.product?.name)
  const hasDeliverables = Boolean(
    activeOffice?.deliverables?.dossier ||
    activeOffice?.deliverables?.shopifyStore ||
    (activeOffice?.deliverables?.adCreatives && activeOffice?.deliverables?.adCreatives.length > 0)
  )

  const [productName, setProductName] = useState('')
  const [niche, setNiche] = useState('')
  const [brandName, setBrandName] = useState('')
  const [trafficMode, setTrafficMode] = useState<TrafficMode>('HYBRID')
  const [isStarting, setIsStarting] = useState(false)

  const handleStartProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!productName.trim()) return

    setIsStarting(true)
    const activeId = store.activeOfficeId || 'off_principal'

    store.changeProduct(activeId, {
      name: productName.trim(),
      niche: niche.trim() || 'Comercio Electrónico',
    })

    const office = store.offices[activeId]
    if (office && brandName.trim()) {
      office.brand.name = brandName.trim()
    }

    store.setTrafficMode(activeId, trafficMode)
    store.clearLogs(activeId)

    if (!store.isRunning) {
      store.togglePlayPause()
    }

    try {
      scheduler.startPipeline(activeId)
    } catch (err) {
      console.warn('Pipeline start error:', err)
    }

    try {
      await fetch('/api/v1/office/market-research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: productName.trim(),
          niche: niche.trim() || 'Comercio Electrónico',
          brandName: brandName.trim() || undefined,
        }),
      })
    } catch (err) {
      console.warn('Background intelligence prefetch:', err)
    } finally {
      setIsStarting(false)
    }
  }

  const handleResetToClean = () => {
    const activeId = store.activeOfficeId || 'off_principal'
    store.changeProduct(activeId, {
      name: '',
      niche: '',
    })
    const office = store.offices[activeId]
    if (office) {
      office.brand.name = ''
      office.brand.style = ''
      office.deliverables = {}
    }
    store.clearLogs(activeId)
  }

  const handleApplyPreset = (name: string, cat: string, brand: string) => {
    setProductName(name)
    setNiche(cat)
    setBrandName(brand)
  }

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Top Header Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem',
          backgroundColor: '#121214',
          border: '1px solid #1f1f24',
          borderRadius: '10px',
          padding: '1.25rem 1.5rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
            <span style={{ color: '#faae33', display: 'flex', alignItems: 'center' }}>
              <PackageIcon />
            </span>
            <h1
              style={{
                fontSize: '1.35rem',
                fontWeight: 700,
                color: '#ffffff',
                margin: 0,
                letterSpacing: '-0.02em',
              }}
            >
              Proyectos & Entregables
            </h1>
            <span
              style={{
                fontSize: '0.7rem',
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: '4px',
                backgroundColor: '#1a1a20',
                color: '#a1a1aa',
                border: '1px solid #272730',
              }}
            >
              Flujo Autónomo
            </span>
          </div>
          <p style={{ margin: 0, fontSize: '0.825rem', color: '#71717a' }}>
            Supervisa los activos reales, creativos, cálculos financieros y auditoría técnica de cada producto.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {hasActiveProduct && (
            <button
              onClick={handleResetToClean}
              style={{
                padding: '0.55rem 0.85rem',
                borderRadius: '6px',
                backgroundColor: 'rgba(239, 68, 68, 0.08)',
                color: '#f87171',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                fontWeight: 600,
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'all 0.12s ease',
              }}
            >
              <TrashIcon />
              <span>Limpiar / Nuevo Producto</span>
            </button>
          )}

          <Link
            href="/dashboard"
            style={{
              padding: '0.55rem 1rem',
              borderRadius: '6px',
              backgroundColor: '#faae33',
              color: '#090807',
              fontWeight: 700,
              fontSize: '0.8rem',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
            }}
          >
            <GridIcon />
            Centro de Control
          </Link>
          <Link
            href="/dashboard/settings"
            style={{
              padding: '0.55rem 0.95rem',
              borderRadius: '6px',
              backgroundColor: '#18181b',
              color: '#d4d4d8',
              fontWeight: 500,
              fontSize: '0.8rem',
              textDecoration: 'none',
              border: '1px solid #27272e',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
            }}
          >
            <SettingsIcon />
            Conectores
          </Link>
        </div>
      </div>

      {/* Case 1: Empty Workspace State */}
      {(!hasActiveProduct || !hasDeliverables) && (
        <div
          style={{
            backgroundColor: '#111113',
            border: '1px solid #1f1f24',
            borderRadius: '12px',
            padding: '2.5rem',
            textAlign: 'center',
            marginBottom: '2rem',
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: '10px',
              backgroundColor: '#1a1a20',
              border: '1px solid #272730',
              color: '#faae33',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem auto',
            }}
          >
            <PlusIcon />
          </div>

          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.4rem' }}>
            Espacio de Trabajo Listo
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#71717a', maxWidth: 580, margin: '0 auto 2rem auto', lineHeight: 1.5 }}>
            Ingresa el nombre del producto o nicho que deseas lanzar para comenzar el análisis de mercado, estimación de márgenes y generación de creativos.
          </p>

          {/* New Project Form */}
          <form
            onSubmit={handleStartProject}
            style={{
              maxWidth: 620,
              margin: '0 auto',
              backgroundColor: '#0c0c0e',
              border: '1px solid #1f1f24',
              borderRadius: '10px',
              padding: '1.5rem',
              textAlign: 'left',
            }}
          >
            <div style={{ marginBottom: '1.15rem' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', color: '#e4e4e7', fontWeight: 600, marginBottom: '0.4rem' }}>
                Producto a Investigar y Lanzar
              </label>
              <input
                type="text"
                required
                value={productName}
                placeholder="Ej: Lámpara Levitante Magnética, Aspirador Facial Hidro-Dermoabrasión..."
                onChange={(e) => setProductName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  boxSizing: 'border-box',
                  backgroundColor: '#141416',
                  border: '1px solid #27272e',
                  borderRadius: '6px',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#faae33')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#27272e')}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '1.15rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#a1a1aa', fontWeight: 600, marginBottom: '0.4rem' }}>
                  Nicho o Categoría
                </label>
                <input
                  type="text"
                  value={niche}
                  placeholder="Ej: Hogar, Skincare..."
                  onChange={(e) => setNiche(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    boxSizing: 'border-box',
                    backgroundColor: '#141416',
                    border: '1px solid #27272e',
                    borderRadius: '6px',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    outline: 'none',
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#faae33')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = '#27272e')}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#a1a1aa', fontWeight: 600, marginBottom: '0.4rem' }}>
                  Nombre de Marca (Opcional)
                </label>
                <input
                  type="text"
                  value={brandName}
                  placeholder="Ej: Lumina Sphere, Aura..."
                  onChange={(e) => setBrandName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    boxSizing: 'border-box',
                    backgroundColor: '#141416',
                    border: '1px solid #27272e',
                    borderRadius: '6px',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    outline: 'none',
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#faae33')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = '#27272e')}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.35rem' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', color: '#a1a1aa', fontWeight: 600, marginBottom: '0.4rem' }}>
                Canal de Tráfico
              </label>
              <select
                value={trafficMode}
                onChange={(e) => setTrafficMode(e.target.value as TrafficMode)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  boxSizing: 'border-box',
                  backgroundColor: '#141416',
                  border: '1px solid #27272e',
                  borderRadius: '6px',
                  color: '#faae33',
                  fontWeight: 600,
                  fontSize: '0.825rem',
                  cursor: 'pointer',
                }}
              >
                <option value="HYBRID">Híbrido (Pauta Publicitaria + Tráfico Orgánico)</option>
                <option value="ADS">Pauta Publicitaria (Meta Ads & TikTok CBO)</option>
                <option value="ORGANIC">Contenido Orgánico (UGC & Creadores)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isStarting || !productName.trim()}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '6px',
                backgroundColor: '#faae33',
                color: '#090807',
                fontWeight: 700,
                fontSize: '0.875rem',
                border: 'none',
                cursor: !productName.trim() ? 'not-allowed' : 'pointer',
                opacity: !productName.trim() ? 0.6 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'opacity 0.12s ease',
              }}
            >
              {isStarting ? 'Iniciando Pipeline...' : 'Iniciar Pipeline de Producto'}
            </button>
          </form>

          {/* Quick presets */}
          <div style={{ marginTop: '1.75rem' }}>
            <span style={{ fontSize: '0.78rem', color: '#71717a', marginRight: '0.75rem' }}>
              Ideas sugeridas para probar:
            </span>
            <div style={{ display: 'inline-flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={() => handleApplyPreset('Lámpara Lunar Levitante Magnética', 'Hogar & Iluminación', 'Lumina Sphere')}
                style={{
                  backgroundColor: '#141416',
                  border: '1px solid #222226',
                  color: '#d4d4d8',
                  borderRadius: '5px',
                  padding: '4px 10px',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                }}
              >
                Lámpara Lunar Levitante
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('Cepillo Exfoliante Facial Ultrasónico', 'Skincare & Cuidado', 'DermaPulse')}
                style={{
                  backgroundColor: '#141416',
                  border: '1px solid #222226',
                  color: '#d4d4d8',
                  borderRadius: '5px',
                  padding: '4px 10px',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                }}
              >
                Cepillo Exfoliante Facial
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('Corrector de Postura Ergonómico', 'Salud & Bienestar', 'PosturAlign')}
                style={{
                  backgroundColor: '#141416',
                  border: '1px solid #222226',
                  color: '#d4d4d8',
                  borderRadius: '5px',
                  padding: '4px 10px',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                }}
              >
                Corrector de Postura
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Case 2: Active Product with Deliverables */}
      {hasActiveProduct && hasDeliverables && (
        <>
          <div
            style={{
              backgroundColor: '#121215',
              border: '1px solid #1f1f26',
              borderRadius: '8px',
              padding: '0.85rem 1.25rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#ffffff' }}>
                Marca: <span style={{ color: '#faae33' }}>{activeOffice?.brand?.name || 'Mi Marca'}</span>
              </div>
              <div style={{ fontSize: '0.78rem', color: '#71717a' }}>
                Producto: {activeOffice?.product?.name} · Categoría: {activeOffice?.product?.niche}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span
                style={{
                  fontSize: '0.72rem',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  color: '#34d399',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  fontWeight: 600,
                }}
              >
                Auditoría Técnica Aprobada (100/100)
              </span>
            </div>
          </div>

          <DeliverablesView />
        </>
      )}
    </div>
  )
}
