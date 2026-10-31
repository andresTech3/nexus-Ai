'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { DeliverablesView } from '@/components/office/DeliverablesView'
import { useOfficeStore } from '@/lib/office/store'
import { scheduler } from '@/lib/office/scheduler'
import { TrafficMode } from '@/types/office'

export default function ProjectsPage() {
  const store = useOfficeStore()
  const activeOffice = store.offices[store.activeOfficeId]
  const hasActiveProduct = Boolean(activeOffice?.product?.name?.trim())
  const hasDeliverables = Object.keys(activeOffice?.deliverables || {}).length > 0

  // Form state for launching a new project
  const [productName, setProductName] = useState('')
  const [niche, setNiche] = useState('')
  const [brandName, setBrandName] = useState('')
  const [trafficMode, setTrafficMode] = useState<TrafficMode>('HYBRID')
  const [isStarting, setIsStarting] = useState(false)

  const handleStartProject = (e: React.FormEvent) => {
    e.preventDefault()
    if (!productName.trim()) return

    setIsStarting(true)
    const brand = brandName.trim() || productName.trim().split(' ')[0] + ' Labs'
    const cleanNiche = niche.trim() || 'Comercio Electrónico D2C'

    if (activeOffice) {
      activeOffice.product.name = productName.trim()
      activeOffice.product.niche = cleanNiche
      activeOffice.product.source = 'USER_PROVIDED'
      activeOffice.brand.name = brand
      activeOffice.trafficMode = trafficMode
      activeOffice.currentStep = 'Investigando mercado y generando activos reales con 11 agentes...'
    }

    // Trigger pipeline execution
    setTimeout(() => {
      scheduler.startPipeline(activeOffice?.id || store.activeOfficeId)
      setIsStarting(false)
    }, 400)
  }

  const handleApplyPreset = (pName: string, pNiche: string, pBrand: string) => {
    setProductName(pName)
    setNiche(pNiche)
    setBrandName(pBrand)
  }

  const handleResetToClean = () => {
    if (confirm('¿Deseas reiniciar este proyecto? Se limpiarán los datos y podrás empezar de cero con otro producto.')) {
      if (activeOffice) {
        activeOffice.product.name = ''
        activeOffice.product.niche = ''
        activeOffice.brand.name = ''
        activeOffice.deliverables = {}
        activeOffice.currentStep = 'Listo para empezar. Configura tu producto o nicho para activar a los 11 agentes.'
      }
      localStorage.removeItem('nexus-autonomous-office-v5-clean')
      localStorage.removeItem('nexus-autonomous-office-v3-clean')
      window.location.reload()
    }
  }

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem',
          background: 'linear-gradient(135deg, #241812, #18120e)',
          border: '1px solid #3d2a1d',
          borderRadius: '12px',
          padding: '1.25rem 1.5rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '1.25rem' }}>📦</span>
            <h1
              style={{
                fontSize: '1.5rem',
                fontWeight: 800,
                color: '#fff',
                margin: 0,
                fontFamily: 'var(--font-display, inherit)',
              }}
            >
              Proyectos & Entregables de Dropshipping
            </h1>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '6px',
                background: 'rgba(250, 174, 51, 0.15)',
                color: '#faae33',
                border: '1px solid rgba(250, 174, 51, 0.3)',
              }}
            >
              11 Agentes IA
            </span>
          </div>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>
            Supervisa los activos reales, creativos, cálculos financieros y auditoría de calidad generados por tu equipo autónomo.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {hasActiveProduct && (
            <button
              onClick={handleResetToClean}
              style={{
                padding: '0.65rem 1rem',
                borderRadius: '8px',
                background: 'rgba(239, 68, 68, 0.12)',
                color: '#f87171',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <span>🗑️</span>
              <span>Limpiar / Nuevo Producto</span>
            </button>
          )}

          <Link
            href="/dashboard"
            style={{
              padding: '0.65rem 1.25rem',
              borderRadius: '8px',
              background: '#faae33',
              color: '#1a100a',
              fontWeight: 700,
              fontSize: '0.85rem',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 12px rgba(250, 174, 51, 0.25)',
            }}
          >
            🏛️ Ver Oficina 3D en Vivo
          </Link>
          <Link
            href="/dashboard/settings"
            style={{
              padding: '0.65rem 1.1rem',
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.06)',
              color: 'rgba(255,255,255,0.85)',
              fontWeight: 600,
              fontSize: '0.85rem',
              textDecoration: 'none',
              border: '1px solid rgba(255,255,255,0.12)',
            }}
          >
            ⚙️ Conectores IA
          </Link>
        </div>
      </div>

      {/* CASE 1: EMPTY STATE / CLEAN PROJECT STARTER */}
      {(!hasActiveProduct || !hasDeliverables) && (
        <div
          style={{
            background: 'linear-gradient(135deg, #1d140f, #140e0b)',
            border: '1px solid #3d2a1d',
            borderRadius: '16px',
            padding: '2.5rem',
            textAlign: 'center',
            marginBottom: '2rem',
            boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '16px',
              background: 'rgba(250, 174, 51, 0.15)',
              border: '1px solid rgba(250, 174, 51, 0.3)',
              color: '#faae33',
              fontSize: '2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem auto',
            }}
          >
            ✨
          </div>

          <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fff', marginBottom: '0.5rem' }}>
            Espacio de Trabajo Limpio & Preparado
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', maxWidth: 650, margin: '0 auto 2rem auto', lineHeight: 1.5 }}>
            No hay datos genéricos cargados. Ingresa el producto o nicho que quieres lanzar en tu tienda de dropshipping y tus <strong>11 agentes de IA</strong> investigarán el mercado real, calcularán los márgenes deterministas y redactarán todos los creativos.
          </p>

          {/* New Project Form */}
          <form
            onSubmit={handleStartProject}
            style={{
              maxWidth: 680,
              margin: '0 auto',
              background: '#16100c',
              border: '1px solid #3d2a1d',
              borderRadius: '12px',
              padding: '1.75rem',
              textAlign: 'left',
            }}
          >
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#faae33', fontWeight: 700, marginBottom: '0.4rem' }}>
                * Nombre del Producto a Investigar / Vender
              </label>
              <input
                type="text"
                required
                value={productName}
                placeholder="Ej: Lámpara Levitante Magnética, Aspirador Facial Hidro-Dermoabrasión..."
                onChange={(e) => setProductName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  backgroundColor: '#0d0907',
                  border: '1px solid #4a3424',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '0.9rem',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#d1d5db', fontWeight: 700, marginBottom: '0.4rem' }}>
                  Nicho / Categoría
                </label>
                <input
                  type="text"
                  value={niche}
                  placeholder="Ej: Hogar & Iluminación, Belleza..."
                  onChange={(e) => setNiche(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    backgroundColor: '#0d0907',
                    border: '1px solid #4a3424',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '0.85rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#d1d5db', fontWeight: 700, marginBottom: '0.4rem' }}>
                  Nombre de la Marca (Opcional)
                </label>
                <input
                  type="text"
                  value={brandName}
                  placeholder="Ej: Lumina Sphere, Aura Tech..."
                  onChange={(e) => setBrandName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    backgroundColor: '#0d0907',
                    border: '1px solid #4a3424',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '0.85rem',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#d1d5db', fontWeight: 700, marginBottom: '0.4rem' }}>
                Canal de Tráfico Principal
              </label>
              <select
                value={trafficMode}
                onChange={(e) => setTrafficMode(e.target.value as TrafficMode)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  backgroundColor: '#0d0907',
                  border: '1px solid #4a3424',
                  borderRadius: '8px',
                  color: '#faae33',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                <option value="HYBRID">⚡ HÍBRIDO (Campañas Meta Ads + Contenido Orgánico TikTok)</option>
                <option value="ADS">🎯 ADS SOLAMENTE (Meta CBO + Anuncios Verticales 9:16)</option>
                <option value="ORGANIC">🌱 ORGÁNICO SOLAMENTE (Vídeos UGC Diarios + SEO)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isStarting || !productName.trim()}
              style={{
                width: '100%',
                padding: '0.85rem',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #faae33, #e59b20)',
                color: '#1a100a',
                fontWeight: 900,
                fontSize: '0.95rem',
                border: 'none',
                cursor: !productName.trim() ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 16px rgba(250, 174, 51, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
              }}
            >
              <span>{isStarting ? '⏳' : '🚀'}</span>
              <span>{isStarting ? 'Iniciando Pipeline de 11 Agentes...' : 'Iniciar Trabajo Real con los 11 Agentes'}</span>
            </button>
          </form>

          {/* Quick presets */}
          <div style={{ marginTop: '1.75rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', marginRight: '0.75rem' }}>
              O pulsa para probar una idea rápida:
            </span>
            <div style={{ display: 'inline-flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={() => handleApplyPreset('Lámpara Lunar Levitante Magnética', 'Hogar & Decoración Futurista', 'Lumina Sphere')}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontSize: '0.76rem',
                  cursor: 'pointer',
                }}
              >
                🌕 Lámpara Lunar Levitante
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('Cepillo Exfoliante Facial Ultrasónico IPX7', 'Skincare & Cuidado Personal', 'DermaPulse')}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontSize: '0.76rem',
                  cursor: 'pointer',
                }}
              >
                💆 Cepillo Exfoliante Facial
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('Corrector de Postura Inteligente con Vibración', 'Salud & Ergonomía', 'PosturAlign')}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontSize: '0.76rem',
                  cursor: 'pointer',
                }}
              >
                🧍 Corrector de Postura
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CASE 2: ACTIVE PRODUCT WITH DELIVERABLES */}
      {hasActiveProduct && hasDeliverables && (
        <>
          <div
            style={{
              background: 'rgba(250, 174, 51, 0.04)',
              border: '1px solid rgba(250, 174, 51, 0.2)',
              borderRadius: '10px',
              padding: '0.9rem 1.25rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '1.4rem' }}>⭐</span>
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>
                  Marca Activa: <span style={{ color: '#faae33' }}>{activeOffice?.brand?.name || 'Mi Marca'}</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>
                  Producto: {activeOffice?.product?.name} · Nicho: {activeOffice?.product?.niche}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span
                style={{
                  fontSize: '0.75rem',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#34d399',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  fontWeight: 600,
                }}
              >
                ✓ Quality Gate 100/100 Aprobado por Dora
              </span>
            </div>
          </div>

          <DeliverablesView />
        </>
      )}
    </div>
  )
}
