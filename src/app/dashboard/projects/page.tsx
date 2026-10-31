'use client'

import React from 'react'
import Link from 'next/link'
import { DeliverablesView } from '@/components/office/DeliverablesView'
import { useOfficeStore } from '@/lib/office/store'

export default function ProjectsPage() {
  const store = useOfficeStore()
  const activeOffice = store.offices[store.activeOfficeId]

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

      {/* Active Brand / Product Badge */}
      {activeOffice && (
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
                Marca Activa: <span style={{ color: '#faae33' }}>{activeOffice.brand?.name || 'AURA ICE'}</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>
                Producto: {activeOffice.product?.name || 'Depilador Láser IPL Sapphire Ice Pro'} · Nicho:{' '}
                {activeOffice.product?.niche || 'Belleza & Cuidado Personal'} · PVP Recomendado: 69.90€
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
      )}

      {/* Deliverables View Component */}
      <DeliverablesView />
    </div>
  )
}
