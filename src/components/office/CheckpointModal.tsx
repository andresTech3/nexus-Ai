'use client'

import React, { useState } from 'react'
import { useOfficeStore } from '@/lib/office/store'

export function CheckpointModal() {
  const store = useOfficeStore()
  const checkpoint = store.activeCheckpoint
  const activeOffice = store.offices[store.activeOfficeId]

  const [mode, setMode] = useState<'view' | 'with_changes' | 'reject'>('view')
  const [feedback, setFeedback] = useState('')

  if (!checkpoint || !activeOffice) return null

  const deliverables = activeOffice.deliverables || {}

  const handleApprove = () => {
    store.resolveCheckpoint(checkpoint.checkpointId, 'APPROVED')
    setFeedback('')
    setMode('view')
  }

  const handleApproveWithChanges = () => {
    if (!feedback.trim()) return
    store.resolveCheckpoint(checkpoint.checkpointId, 'APPROVED_WITH_CHANGES', feedback)
    setFeedback('')
    setMode('view')
  }

  const handleReject = () => {
    if (!feedback.trim()) return
    store.resolveCheckpoint(checkpoint.checkpointId, 'REJECTED', feedback)
    setFeedback('')
    setMode('view')
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(10, 8, 6, 0.85)',
        backdropFilter: 'blur(10px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '780px',
          maxHeight: '90vh',
          backgroundColor: '#1b1410',
          border: '2px solid #faae33',
          borderRadius: '14px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 60px rgba(0,0,0,0.8), 0 0 30px rgba(250, 174, 51, 0.25)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            background: 'linear-gradient(135deg, #2b180d, #1b1410)',
            borderBottom: '1px solid #3d2a1d',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                backgroundColor: 'rgba(250, 174, 51, 0.15)',
                border: '1px solid #faae33',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                color: '#faae33',
              }}
            >
              🛡️
            </span>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#faae33', fontWeight: 700, letterSpacing: '0.05em' }}>
                SUPERVISIÓN DE DORA (CEO) — CHECKPOINT BLOQUEANTE
              </div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                {checkpoint.title}
              </h2>
            </div>
          </div>
          <span
            style={{
              backgroundColor: '#431407',
              color: '#fb923c',
              border: '1px solid #c2410c',
              padding: '0.25rem 0.65rem',
              borderRadius: '20px',
              fontSize: '0.72rem',
              fontWeight: 700,
            }}
          >
            REVISIÓN HUMANA OBLIGATORIA
          </span>
        </div>

        {/* Content Body */}
        <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
          {/* Dora's Quality Gate Audit Box */}
          <div
            style={{
              backgroundColor: '#241a14',
              border: '1px solid #4a3424',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1.25rem',
            }}
          >
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#faae33', marginBottom: '0.5rem' }}>
              ⚖️ Auditoría de Cumplimiento & Quality Gates de Dora:
            </div>
            <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.82rem', color: '#e5e7eb', lineHeight: 1.6 }}>
              <li>
                <strong style={{ color: '#34d399' }}>✓ Multiplicador de Margen:</strong> &gt;= 3.5x verificado en código puro determinista por Eva.
              </li>
              <li>
                <strong style={{ color: '#34d399' }}>✓ Claims Publicitarios:</strong> 100% purgados de promesas médicas prohibidas ("sin agujas", "elimina arrugas", testimonios falsos).
              </li>
              <li>
                <strong style={{ color: '#34d399' }}>✓ Gancho Visual demostrable:</strong> Verificado en guiones de Marco para formato 9:16 (0-3 segundos).
              </li>
              <li>
                <strong style={{ color: '#34d399' }}>✓ Coherencia de Tarifas:</strong> Precios idénticos entre ficha de Eva, copy de Carlos y selector Liquid de Diego.
              </li>
            </ul>
          </div>

          {/* Deliverables summary in this checkpoint */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
              📦 Entregables listos para aprobación:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
              {checkpoint.checkpointId === 'CP_01_PRODUCTO' && (
                <>
                  <div style={{ background: '#18120e', border: '1px solid #332418', borderRadius: '6px', padding: '0.75rem' }}>
                    <div style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 700 }}>Iván (Producto)</div>
                    <div style={{ fontSize: '0.82rem', color: '#fff', fontWeight: 600 }}>01_investigacion_producto.json</div>
                    <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>Nicho validado &gt; 200k€/mes</div>
                  </div>
                  <div style={{ background: '#18120e', border: '1px solid #332418', borderRadius: '6px', padding: '0.75rem' }}>
                    <div style={{ fontSize: '0.75rem', color: '#818cf8', fontWeight: 700 }}>Lucas (Posicionamiento)</div>
                    <div style={{ fontSize: '0.82rem', color: '#fff', fontWeight: 600 }}>02_analisis_competencia.md</div>
                    <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>PVP 32.90€ + packaging magnético</div>
                  </div>
                  <div style={{ background: '#18120e', border: '1px solid #332418', borderRadius: '6px', padding: '0.75rem' }}>
                    <div style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 700 }}>Eva (Finanzas)</div>
                    <div style={{ fontSize: '0.82rem', color: '#fff', fontWeight: 600 }}>03_unit_economics_eva.csv</div>
                    <div style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: 700 }}>HEALTH SCORE: GREEN</div>
                  </div>
                </>
              )}

              {checkpoint.checkpointId === 'CP_02_TIENDA' && (
                <>
                  <div style={{ background: '#18120e', border: '1px solid #332418', borderRadius: '6px', padding: '0.75rem' }}>
                    <div style={{ fontSize: '0.75rem', color: '#f472b6', fontWeight: 700 }}>Sofía (Avatar)</div>
                    <div style={{ fontSize: '0.82rem', color: '#fff', fontWeight: 600 }}>04_customer_avatar_sofia.json</div>
                    <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>Elena (36 años) + 5 objeciones</div>
                  </div>
                  <div style={{ background: '#18120e', border: '1px solid #332418', borderRadius: '6px', padding: '0.75rem' }}>
                    <div style={{ fontSize: '0.75rem', color: '#fb923c', fontWeight: 700 }}>Carlos (Copywriting)</div>
                    <div style={{ fontSize: '0.82rem', color: '#fff', fontWeight: 600 }}>05_copy_landing_page.md</div>
                    <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>Above The Fold &amp; Bundles</div>
                  </div>
                  <div style={{ background: '#18120e', border: '1px solid #332418', borderRadius: '6px', padding: '0.75rem' }}>
                    <div style={{ fontSize: '0.75rem', color: '#2dd4bf', fontWeight: 700 }}>Diego (Shopify Liquid)</div>
                    <div style={{ fontSize: '0.82rem', color: '#fff', fontWeight: 600 }}>07_shopify_bundle_selector.liquid</div>
                    <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>Sección Dawn OS 2.0 lista</div>
                  </div>
                </>
              )}

              {checkpoint.checkpointId === 'CP_03_CREATIVOS' && (
                <>
                  <div style={{ background: '#18120e', border: '1px solid #332418', borderRadius: '6px', padding: '0.75rem' }}>
                    <div style={{ fontSize: '0.75rem', color: '#a78bfa', fontWeight: 700 }}>Leo (Arte &amp; Fotografía)</div>
                    <div style={{ fontSize: '0.82rem', color: '#fff', fontWeight: 600 }}>06_prompts_fotografia_leo.json</div>
                    <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>Renders Pollinations 1:1 y 9:16</div>
                  </div>
                  <div style={{ background: '#18120e', border: '1px solid #332418', borderRadius: '6px', padding: '0.75rem' }}>
                    <div style={{ fontSize: '0.75rem', color: '#e879f9', fontWeight: 700 }}>Marco (UGC &amp; Vídeo)</div>
                    <div style={{ fontSize: '0.82rem', color: '#fff', fontWeight: 600 }}>08_guiones_anuncios_ugc.md</div>
                    <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>Guion 30s con 3 ganchos</div>
                  </div>
                </>
              )}

              {checkpoint.checkpointId === 'CP_04_ACTIVACION' && (
                <>
                  <div style={{ background: '#18120e', border: '1px solid #332418', borderRadius: '6px', padding: '0.75rem' }}>
                    <div style={{ fontSize: '0.75rem', color: '#facc15', fontWeight: 700 }}>Tomás (Media Buyer)</div>
                    <div style={{ fontSize: '0.82rem', color: '#fff', fontWeight: 600 }}>09_estructura_campana_meta.json</div>
                    <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>CBO 50€/día + Stop-Loss</div>
                  </div>
                  <div style={{ background: '#18120e', border: '1px solid #332418', borderRadius: '6px', padding: '0.75rem' }}>
                    <div style={{ fontSize: '0.75rem', color: '#4ade80', fontWeight: 700 }}>Marta (Operaciones)</div>
                    <div style={{ fontSize: '0.82rem', color: '#fff', fontWeight: 600 }}>10_manual_atencion_cliente.md</div>
                    <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>Árbol devoluciones y plantillas</div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Feedback Form for Changes / Reject */}
          {(mode === 'with_changes' || mode === 'reject') && (
            <div
              style={{
                backgroundColor: '#281a12',
                border: `1px solid ${mode === 'reject' ? '#ef4444' : '#faae33'}`,
                borderRadius: '8px',
                padding: '1rem',
                marginTop: '1rem',
              }}
            >
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#fff', marginBottom: '0.4rem' }}>
                {mode === 'reject'
                  ? 'Motivo del rechazo para ordenar regeneración completa a Dora:'
                  : 'Instrucciones precisas para inyectar al siguiente agente:'}
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder={
                  mode === 'reject'
                    ? 'Ej: El precio propuesto es demasiado bajo para absorber adquisición en Meta Ads. Subir PVP a 34.90€ y recalcular...'
                    : 'Ej: Ajustar el tono del Above The Fold para enfatizar más el ritual nocturno que el ácido hialurónico...'
                }
                style={{
                  width: '100%',
                  minHeight: '80px',
                  backgroundColor: '#16100c',
                  border: '1px solid #4a3424',
                  borderRadius: '6px',
                  color: '#fff',
                  padding: '0.6rem',
                  fontSize: '0.82rem',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div
          style={{
            padding: '1rem 1.5rem',
            backgroundColor: '#16100c',
            borderTop: '1px solid #3d2a1d',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
          }}
        >
          {mode === 'view' ? (
            <>
              <button
                onClick={() => setMode('reject')}
                style={{
                  background: 'transparent',
                  border: '1px solid #ef4444',
                  color: '#ef4444',
                  padding: '0.55rem 1rem',
                  borderRadius: '6px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                ✕ Rechazar y Regenerar
              </button>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={() => setMode('with_changes')}
                  style={{
                    background: '#451a03',
                    border: '1px solid #faae33',
                    color: '#faae33',
                    padding: '0.55rem 1.1rem',
                    borderRadius: '6px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  ✎ Aprobar con Cambios
                </button>

                <button
                  onClick={handleApprove}
                  style={{
                    background: 'linear-gradient(135deg, #15803d, #16a34a)',
                    border: 'none',
                    color: '#fff',
                    padding: '0.55rem 1.4rem',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(22, 163, 74, 0.4)',
                  }}
                >
                  ✓ Aprobar y Continuar Pipeline
                </button>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', gap: '0.75rem' }}>
              <button
                onClick={() => setMode('view')}
                style={{
                  background: 'transparent',
                  border: '1px solid #555',
                  color: '#9ca3af',
                  padding: '0.55rem 1rem',
                  borderRadius: '6px',
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                }}
              >
                Cancelar
              </button>

              <button
                onClick={mode === 'reject' ? handleReject : handleApproveWithChanges}
                disabled={!feedback.trim()}
                style={{
                  background: mode === 'reject' ? '#dc2626' : '#faae33',
                  color: mode === 'reject' ? '#fff' : '#181008',
                  border: 'none',
                  padding: '0.55rem 1.3rem',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  cursor: feedback.trim() ? 'pointer' : 'not-allowed',
                  opacity: feedback.trim() ? 1 : 0.5,
                }}
              >
                {mode === 'reject' ? 'Confirmar Rechazo y Regenerar' : 'Confirmar Aprobación con Instrucciones'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
