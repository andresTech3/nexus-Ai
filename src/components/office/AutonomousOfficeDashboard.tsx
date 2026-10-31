'use client'

import React, { useState, useEffect } from 'react'
import { useOfficeStore } from '@/lib/office/store'
import { scheduler } from '@/lib/office/scheduler'
import { AGENT_DEFINITIONS } from '@/lib/office/agents/definitions'
import { Office3D } from './Office3D'
import { AgentInspector } from './AgentInspector'
import { CheckpointModal } from './CheckpointModal'
import { DeliverablesView } from './DeliverablesView'
import { MultiOfficeManager } from './MultiOfficeManager'
import { ConnectionsManager } from './ConnectionsManager'
import { NewProductLaunchModal } from './NewProductLaunchModal'
import { LeoCreativesStudio } from './LeoCreativesStudio'
import { RealMarketResearchView } from './RealMarketResearchView'
import { DoraQualityGateAuditView } from './DoraQualityGateAuditView'
import { AgentId, TrafficMode, WorkflowType } from '@/types/office'

export function AutonomousOfficeDashboard() {
  const store = useOfficeStore()
  const activeOffice = store.offices[store.activeOfficeId]
  const isRunning = store.isRunning
  const speed = store.speed

  const [activeMainTab, setActiveMainTab] = useState<
    'creatives' | 'market_research' | 'deliverables' | 'dora_audit' | 'office3d' | 'offices' | 'connections' | 'history'
  >('creatives')

  // Real Market Data Injection Modal State
  const [showRealDataModal, setShowRealDataModal] = useState(false)
  const [realDataInput, setRealDataInput] = useState(activeOffice?.product?.description || '')
  const [quickApiKey, setQuickApiKey] = useState('')

  // New Product Launch Wizard Modal State
  const [isLaunchModalOpen, setIsLaunchModalOpen] = useState(false)

  // Real-time countdown to daily quota reset (Midnight UTC / PST)
  const [resetCountdown, setResetCountdown] = useState('05h 42m')

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date()
      const hoursLeft = 23 - now.getUTCHours()
      const minsLeft = 59 - now.getUTCMinutes()
      setResetCountdown(`${String(hoursLeft).padStart(2, '0')}h ${String(minsLeft).padStart(2, '0')}m`)
    }
    updateCountdown()
    const timer = setInterval(updateCountdown, 60000)
    return () => clearInterval(timer)
  }, [])

  if (!activeOffice) return null

  const handleStartOrPause = () => {
    if (isRunning) {
      scheduler.stop()
      store.togglePlayPause()
    } else {
      scheduler.startPipeline(activeOffice.id)
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        width: '100%',
        maxWidth: '1600px',
        margin: '0 auto',
      }}
    >
      {/* ============================================================ */}
      {/* TOP COMMAND BAR: Office Selector, Workflow, Mode & Controls   */}
      {/* ============================================================ */}
      <div
        style={{
          background: 'linear-gradient(135deg, #241812, #18120e)',
          border: '1px solid #3d2a1d',
          borderRadius: '12px',
          padding: '1.1rem 1.4rem',
          boxShadow: '0 8px 30px rgba(0,0,0,0.45)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          {/* Brand & Office Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: '8px',
                background: '#faae33',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#090807',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#090807" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: '#faae33', fontWeight: 700, letterSpacing: '0.04em' }}>
                SISTEMA OPERATIVO DROPSHIPPING · 11 ESPECIALISTAS
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '2px' }}>
                <select
                  value={activeOffice.id}
                  onChange={(e) => store.setActiveOffice(e.target.value)}
                  style={{
                    backgroundColor: '#1b1410',
                    border: '1px solid #3d2a1d',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    borderRadius: '6px',
                    padding: '0.2rem 0.5rem',
                    cursor: 'pointer',
                  }}
                >
                  {Object.values(store.offices).map((off) => (
                    <option key={off.id} value={off.id}>
                      {off.name} ({off.status === 'ON' ? 'ACTIVA' : 'INACTIVA'})
                    </option>
                  ))}
                </select>

                <span
                  style={{
                    backgroundColor: activeOffice.status === 'ON' ? 'rgba(52, 211, 153, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    color: activeOffice.status === 'ON' ? '#34d399' : '#f87171',
                    border: `1px solid ${activeOffice.status === 'ON' ? 'rgba(52,211,153,0.3)' : 'rgba(239,68,68,0.3)'}`,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                  }}
                >
                  {activeOffice.status === 'ON' ? 'OPERATIVA' : 'APAGADA'}
                </span>

                {/* Real Data vs Simulated Badge */}
                <span
                  style={{
                    backgroundColor: activeOffice.product.source === 'USER_PROVIDED' ? 'rgba(52, 211, 153, 0.12)' : 'rgba(250, 174, 51, 0.12)',
                    color: activeOffice.product.source === 'USER_PROVIDED' ? '#34d399' : '#faae33',
                    border: `1px solid ${activeOffice.product.source === 'USER_PROVIDED' ? 'rgba(52,211,153,0.3)' : 'rgba(250,174,51,0.3)'}`,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                  }}
                >
                  {activeOffice.product.source === 'USER_PROVIDED' ? 'DATOS DE MERCADO' : 'MODO EVALUACIÓN'}
                </span>

                {/* Probar Nuevo Producto Golden Button */}
                <button
                  onClick={() => setIsLaunchModalOpen(true)}
                  style={{
                    background: '#faae33',
                    color: '#181008',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '4px 10px',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                  title="Configurar producto"
                >
                  <span>+</span>
                  <span>Nuevo Producto</span>
                </button>
              </div>
            </div>
          </div>

          {/* Executive Connectors Button */}
          <button
            onClick={() => setActiveMainTab('connections')}
            style={{
              backgroundColor: activeMainTab === 'connections' ? '#241a14' : '#141416',
              border: '1px solid #27272e',
              borderRadius: '6px',
              padding: '0.45rem 0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.78rem',
              fontWeight: 600,
              color: '#faae33',
              cursor: 'pointer',
              transition: 'all 0.12s ease',
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#34d399' }} />
            <span>Conectores</span>
            <span
              style={{
                fontSize: '0.68rem',
                backgroundColor: '#1f1f24',
                color: '#e5e7eb',
                padding: '2px 6px',
                borderRadius: '4px',
                fontWeight: 600,
              }}
            >
              Ajustes
            </span>
          </button>
        </div>

        {/* Second Row: Workflow, Traffic Mode, Speed & Play Button */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
            borderTop: '1px solid #2e2017',
            paddingTop: '0.85rem',
          }}
        >
          {/* Left Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
            {/* Workflow Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ fontSize: '0.72rem', color: '#9ca3af' }}>Flujo:</span>
              <select
                value={activeOffice.workflow}
                onChange={(e) => store.setWorkflow(activeOffice.id, e.target.value as WorkflowType)}
                style={{
                  backgroundColor: '#1b1410',
                  border: '1px solid #4a3424',
                  color: '#faae33',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  borderRadius: '4px',
                  padding: '0.35rem 0.55rem',
                }}
              >
                <option value="LAUNCH">[A] Lanzamiento Completo (4 Checkpoints)</option>
                <option value="MORNING">[B] Auditoría Rápida (Revisión Diaria)</option>
              </select>
            </div>

            {/* Traffic Mode Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ fontSize: '0.72rem', color: '#9ca3af' }}>Tráfico:</span>
              <div style={{ display: 'flex', backgroundColor: '#140f0c', borderRadius: '4px', padding: '2px' }}>
                {(['ADS', 'ORGANIC', 'HYBRID'] as TrafficMode[]).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => store.setTrafficMode(activeOffice.id, mode)}
                    style={{
                      background: activeOffice.trafficMode === mode ? '#faae33' : 'transparent',
                      color: activeOffice.trafficMode === mode ? '#181008' : '#9ca3af',
                      border: 'none',
                      borderRadius: '3px',
                      padding: '3px 8px',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {mode === 'ADS' ? 'PAUTA' : mode === 'ORGANIC' ? 'ORGÁNICO' : 'HÍBRIDO'}
                  </button>
                ))}
              </div>
            </div>

            {/* Speed Selector with 0.5x Reading Mode */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ fontSize: '0.72rem', color: '#9ca3af' }}>Velocidad:</span>
              <div style={{ display: 'flex', backgroundColor: '#140f0c', borderRadius: '4px', padding: '2px' }}>
                {([0.5, 1, 2, 5] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => store.setSpeed(s)}
                    style={{
                      background: speed === s ? '#faae33' : 'transparent',
                      color: speed === s ? '#181008' : '#9ca3af',
                      border: 'none',
                      borderRadius: '3px',
                      padding: '3px 8px',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                    title={s === 0.5 ? 'Modo Lectura (Pausado para inspeccionar)' : `${s}x`}
                  >
                    {s === 0.5 ? '0.5x Lectura' : `${s}x`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Action: Play / Pause */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <button
              onClick={() => store.toggleOfficePower(activeOffice.id)}
              style={{
                background: activeOffice.status === 'ON' ? '#18181c' : '#14532d',
                border: `1px solid ${activeOffice.status === 'ON' ? '#27272e' : '#22c55e'}`,
                color: activeOffice.status === 'ON' ? '#9ca3af' : '#4ade80',
                padding: '0.45rem 0.85rem',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {activeOffice.status === 'ON' ? 'Pausar Sistema' : 'Reanudar Sistema'}
            </button>

            <button
              onClick={handleStartOrPause}
              disabled={activeOffice.status === 'OFF'}
              style={{
                background: isRunning ? '#dc2626' : '#faae33',
                color: isRunning ? '#ffffff' : '#090807',
                border: 'none',
                padding: '0.45rem 1.15rem',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: activeOffice.status === 'OFF' ? 'not-allowed' : 'pointer',
                opacity: activeOffice.status === 'OFF' ? 0.5 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
              }}
            >
              <span>{isRunning ? 'Pausar Pipeline' : 'Ejecutar Pipeline'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 4-STEP EXECUTIVE WORKFLOW STEPPER                            */}
      {/* ============================================================ */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: '0.75rem',
          backgroundColor: '#19120e',
          border: '1px solid #3d2a1d',
          borderRadius: '10px',
          padding: '0.85rem',
        }}
      >
        {/* Step 1: Producto */}
        <div
          style={{
            backgroundColor: '#140f0c',
            border: '1px solid #332418',
            borderRadius: '8px',
            padding: '0.75rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.7rem', color: '#faae33', fontWeight: 800 }}>PASO 1: PRODUCTO &amp; MARCA</span>
              <span style={{ fontSize: '0.65rem', color: '#34d399', fontWeight: 700 }}>● Activo</span>
            </div>
            {activeOffice.product.name ? (
              <>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {activeOffice.product.name}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>{activeOffice.brand.name || 'Sin marca'}</div>
              </>
            ) : (
              <div style={{ fontSize: '0.8rem', color: '#faae33', fontWeight: 600, marginTop: '4px' }}>
                Sin producto asignado
              </div>
            )}
          </div>
          <button
            onClick={() => setIsLaunchModalOpen(true)}
            style={{
              marginTop: '0.5rem',
              background: activeOffice.product.name ? '#1c1c22' : '#faae33',
              border: `1px solid ${activeOffice.product.name ? '#2d2d34' : '#faae33'}`,
              color: activeOffice.product.name ? '#faae33' : '#181008',
              borderRadius: '4px',
              padding: '0.4rem',
              fontSize: '0.72rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {activeOffice.product.name ? '+ Probar Otro Producto' : 'Configurar Producto'}
          </button>
        </div>

        {/* Step 2: Averiguacion Real */}
        <div
          onClick={() => setActiveMainTab('market_research')}
          style={{
            backgroundColor: activeMainTab === 'market_research' ? '#221610' : '#140f0c',
            border: `1px solid ${activeMainTab === 'market_research' ? '#34d399' : '#332418'}`,
            borderRadius: '8px',
            padding: '0.75rem',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.7rem', color: '#34d399', fontWeight: 800 }}>PASO 2: AVERIGUACIÓN REAL</span>
              <span style={{ fontSize: '0.65rem', color: '#34d399' }}>FreeLLMAPI</span>
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff', marginTop: '2px' }}>
              Competidores &amp; Costes Fábrica
            </div>
            <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>Precios reales en España y quejas</div>
          </div>
          <div style={{ marginTop: '0.5rem', fontSize: '0.72rem', color: '#34d399', fontWeight: 700 }}>
            Ver Inteligencia Real &rarr;
          </div>
        </div>

        {/* Step 3: Creativos Leo */}
        <div
          onClick={() => setActiveMainTab('creatives')}
          style={{
            backgroundColor: activeMainTab === 'creatives' ? '#221610' : '#140f0c',
            border: `1px solid ${activeMainTab === 'creatives' ? '#faae33' : '#332418'}`,
            borderRadius: '8px',
            padding: '0.75rem',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.7rem', color: '#faae33', fontWeight: 800 }}>PASO 3: CREATIVOS VISUALES</span>
              <span style={{ fontSize: '0.65rem', color: '#faae33' }}>6 Formatos</span>
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff', marginTop: '2px' }}>
              Estudio de Anuncios HD (Leo)
            </div>
            <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>Packshots, UGC 9:16 y Feed 1:1</div>
          </div>
          <div style={{ marginTop: '0.5rem', fontSize: '0.72rem', color: '#faae33', fontWeight: 700 }}>
            Ver &amp; Descargar Creativos &rarr;
          </div>
        </div>

        {/* Step 4: Tienda & Pipeline */}
        <div
          onClick={() => setActiveMainTab('deliverables')}
          style={{
            backgroundColor: activeMainTab === 'deliverables' ? '#221610' : '#140f0c',
            border: `1px solid ${activeMainTab === 'deliverables' ? '#38bdf8' : '#332418'}`,
            borderRadius: '8px',
            padding: '0.75rem',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.7rem', color: '#38bdf8', fontWeight: 800 }}>PASO 4: TIENDA &amp; CAMPAÑA</span>
              <span style={{ fontSize: '0.65rem', color: '#38bdf8' }}>Shopify Liquid</span>
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff', marginTop: '2px' }}>
              Checkout Móvil &amp; Unit Economics
            </div>
            <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>Bundles 30/60/90d y CBO Tomás</div>
          </div>
          <div style={{ marginTop: '0.5rem', fontSize: '0.72rem', color: '#38bdf8', fontWeight: 700 }}>
            Ver Tienda &amp; Entregables &rarr;
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* MAIN NAVIGATION TABS                                         */}
      {/* ============================================================ */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '1px solid #332418',
          paddingBottom: '0.25rem',
          overflowX: 'auto',
        }}
      >
        <button
          onClick={() => setActiveMainTab('creatives')}
          style={{
            background: activeMainTab === 'creatives' ? '#241812' : 'transparent',
            border: `1px solid ${activeMainTab === 'creatives' ? '#faae33' : 'transparent'}`,
            borderBottom: activeMainTab === 'creatives' ? '2px solid #faae33' : 'none',
            color: activeMainTab === 'creatives' ? '#faae33' : '#9ca3af',
            borderRadius: '6px 6px 0 0',
            padding: '0.65rem 1.15rem',
            fontSize: '0.82rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            whiteSpace: 'nowrap',
          }}
        >
          <span>Creativos &amp; Anuncios</span>
        </button>

        <button
          onClick={() => setActiveMainTab('market_research')}
          style={{
            background: activeMainTab === 'market_research' ? '#241812' : 'transparent',
            border: `1px solid ${activeMainTab === 'market_research' ? '#34d399' : 'transparent'}`,
            borderBottom: activeMainTab === 'market_research' ? '2px solid #34d399' : 'none',
            color: activeMainTab === 'market_research' ? '#34d399' : '#9ca3af',
            borderRadius: '6px 6px 0 0',
            padding: '0.65rem 1.15rem',
            fontSize: '0.82rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            whiteSpace: 'nowrap',
          }}
        >
          <span>Inteligencia de Mercado</span>
        </button>

        <button
          onClick={() => setActiveMainTab('deliverables')}
          style={{
            background: activeMainTab === 'deliverables' ? '#241812' : 'transparent',
            border: `1px solid ${activeMainTab === 'deliverables' ? '#faae33' : 'transparent'}`,
            borderBottom: activeMainTab === 'deliverables' ? '2px solid #faae33' : 'none',
            color: activeMainTab === 'deliverables' ? '#faae33' : '#9ca3af',
            borderRadius: '6px 6px 0 0',
            padding: '0.65rem 1.15rem',
            fontSize: '0.82rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            whiteSpace: 'nowrap',
          }}
        >
          <span>Tienda &amp; Entregables ({Object.keys(activeOffice.deliverables || {}).length})</span>
        </button>

        <button
          onClick={() => setActiveMainTab('dora_audit')}
          style={{
            background: activeMainTab === 'dora_audit' ? '#241812' : 'transparent',
            border: `1px solid ${activeMainTab === 'dora_audit' ? '#faae33' : 'transparent'}`,
            borderBottom: activeMainTab === 'dora_audit' ? '2px solid #faae33' : 'none',
            color: activeMainTab === 'dora_audit' ? '#faae33' : '#9ca3af',
            borderRadius: '6px 6px 0 0',
            padding: '0.65rem 1.15rem',
            fontSize: '0.82rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            whiteSpace: 'nowrap',
          }}
        >
          <span>Auditoría Técnica</span>
        </button>

        <button
          onClick={() => setActiveMainTab('office3d')}
          style={{
            background: activeMainTab === 'office3d' ? '#241812' : 'transparent',
            border: `1px solid ${activeMainTab === 'office3d' ? '#faae33' : 'transparent'}`,
            borderBottom: activeMainTab === 'office3d' ? '2px solid #faae33' : 'none',
            color: activeMainTab === 'office3d' ? '#faae33' : '#9ca3af',
            borderRadius: '6px 6px 0 0',
            padding: '0.65rem 1.15rem',
            fontSize: '0.82rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            whiteSpace: 'nowrap',
          }}
        >
          <span>Oficina 3D</span>
          {isRunning && (
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                backgroundColor: '#34d399',
                display: 'inline-block',
                boxShadow: '0 0 8px #34d399',
              }}
            />
          )}
        </button>

        <button
          onClick={() => setActiveMainTab('connections')}
          style={{
            background: activeMainTab === 'connections' ? '#241812' : 'transparent',
            border: `1px solid ${activeMainTab === 'connections' ? '#faae33' : 'transparent'}`,
            borderBottom: activeMainTab === 'connections' ? '2px solid #faae33' : 'none',
            color: activeMainTab === 'connections' ? '#faae33' : '#9ca3af',
            borderRadius: '6px 6px 0 0',
            padding: '0.65rem 1.15rem',
            fontSize: '0.82rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            whiteSpace: 'nowrap',
          }}
        >
          <span>Conectores API</span>
        </button>

        <button
          onClick={() => setActiveMainTab('offices')}
          style={{
            background: activeMainTab === 'offices' ? '#241812' : 'transparent',
            border: `1px solid ${activeMainTab === 'offices' ? '#faae33' : 'transparent'}`,
            borderBottom: activeMainTab === 'offices' ? '2px solid #faae33' : 'none',
            color: activeMainTab === 'offices' ? '#faae33' : '#9ca3af',
            borderRadius: '6px 6px 0 0',
            padding: '0.65rem 1.15rem',
            fontSize: '0.82rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            whiteSpace: 'nowrap',
          }}
        >
          <span>Espacios de Trabajo ({Object.keys(store.offices).length})</span>
        </button>

        <button
          onClick={() => setActiveMainTab('history')}
          style={{
            background: activeMainTab === 'history' ? '#241812' : 'transparent',
            border: `1px solid ${activeMainTab === 'history' ? '#faae33' : 'transparent'}`,
            borderBottom: activeMainTab === 'history' ? '2px solid #faae33' : 'none',
            color: activeMainTab === 'history' ? '#faae33' : '#9ca3af',
            borderRadius: '6px 6px 0 0',
            padding: '0.65rem 1.15rem',
            fontSize: '0.82rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            whiteSpace: 'nowrap',
          }}
        >
          <span>Historial ({activeOffice.checkpointHistory.length})</span>
        </button>
      </div>

      {/* ============================================================ */}
      {/* TAB CONTENT 1: 3D INTERACTIVE OFFICE & REAL-TIME FEED        */}
      {/* ============================================================ */}
      {activeMainTab === 'office3d' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Main 3D Office Canvas */}
          <Office3D />

          {/* Under Canvas: Two Columns (Live Activity Stream & 11 Agent Roster) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(320px, 1fr) minmax(320px, 1.4fr)',
              gap: '1.25rem',
            }}
          >
            {/* Column 1: Live Real-Time Feed */}
            <div
              style={{
                backgroundColor: '#18120e',
                border: '1px solid #3d2a1d',
                borderRadius: '10px',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                height: '380px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: '#faae33' }}>
                  Feed de Actividad en Tiempo Real
                </div>
                <button
                  onClick={() => store.clearLogs(activeOffice.id)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#6b7280',
                    fontSize: '0.7rem',
                    cursor: 'pointer',
                  }}
                >
                  Limpiar feed
                </button>
              </div>

              <div
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.45rem',
                  paddingRight: '4px',
                }}
              >
                {store.logs.map((log) => {
                  const agentDef = AGENT_DEFINITIONS[log.agentId]
                  return (
                    <div
                      key={log.id}
                      style={{
                        backgroundColor: '#1f1611',
                        borderLeft: `3px solid ${agentDef ? agentDef.avatarColor : '#faae33'}`,
                        borderRadius: '0 6px 6px 0',
                        padding: '0.45rem 0.65rem',
                        fontSize: '0.74rem',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                        <span style={{ fontWeight: 700, color: agentDef ? agentDef.avatarColor : '#faae33' }}>
                          {log.agentName}
                        </span>
                        <span style={{ fontSize: '0.65rem', color: '#6b7280' }}>{log.timestamp}</span>
                      </div>
                      <div style={{ color: '#e5e7eb', lineHeight: 1.35 }}>{log.message}</div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Column 2: 11 Agents Quick Status Grid */}
            <div
              style={{
                backgroundColor: '#18120e',
                border: '1px solid #3d2a1d',
                borderRadius: '10px',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                height: '380px',
              }}
            >
              <div style={{ fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: '#faae33', marginBottom: '0.75rem' }}>
                Puestos de Trabajo (Inspección 3D)
              </div>

              <div
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '0.5rem',
                  paddingRight: '4px',
                }}
              >
                {Object.values(AGENT_DEFINITIONS).map((agent) => {
                  const state = activeOffice.agentStates[agent.id] || 'IDLE'
                  const isSelected = store.selectedAgentId === agent.id

                  let stateColor = '#71717a'
                  if (state === 'ANALYZING') stateColor = '#38bdf8'
                  else if (state === 'GENERATING') stateColor = '#facc15'
                  else if (state === 'DONE') stateColor = '#34d399'
                  else if (state === 'NEEDS_APPROVAL') stateColor = '#f43f5e'
                  else if (state === 'VACANT') stateColor = '#3f3f46'

                  return (
                    <div
                      key={agent.id}
                      onClick={() => store.selectAgent(agent.id)}
                      style={{
                        backgroundColor: isSelected ? '#2b1b11' : '#1f1611',
                        border: `1px solid ${isSelected ? '#faae33' : '#332418'}`,
                        borderRadius: '6px',
                        padding: '0.55rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: '50%',
                          backgroundColor: `${agent.avatarColor}20`,
                          border: `1px solid ${agent.avatarColor}`,
                          color: agent.avatarColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          flexShrink: 0,
                        }}
                      >
                        {agent.avatarInitials}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#fff' }}>
                            {agent.name}
                          </span>
                          <span
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              backgroundColor: stateColor,
                              boxShadow: `0 0 6px ${stateColor}`,
                            }}
                          />
                        </div>
                        <div style={{ fontSize: '0.65rem', color: '#9ca3af', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {agent.role}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB CONTENT: CREATIVE STUDIO (LEO)                           */}
      {/* ============================================================ */}
      {activeMainTab === 'creatives' && <LeoCreativesStudio />}

      {/* ============================================================ */}
      {/* TAB CONTENT: REAL MARKET RESEARCH (IVAN & LUCAS)             */}
      {/* ============================================================ */}
      {activeMainTab === 'market_research' && <RealMarketResearchView />}

      {/* ============================================================ */}
      {/* TAB CONTENT 2: DELIVERABLES & ZIP                            */}
      {/* ============================================================ */}
      {activeMainTab === 'deliverables' && <DeliverablesView />}

      {/* ============================================================ */}
      {/* TAB CONTENT: DORA QUALITY GATE & SELF-EVALUATION             */}
      {/* ============================================================ */}
      {activeMainTab === 'dora_audit' && <DoraQualityGateAuditView />}

      {/* ============================================================ */}
      {/* TAB CONTENT 3: MULTI-OFFICE MANAGER                          */}
      {/* ============================================================ */}
      {activeMainTab === 'offices' && <MultiOfficeManager />}

      {/* ============================================================ */}
      {/* TAB CONTENT 4: CONNECTIONS & LLMS                            */}
      {/* ============================================================ */}
      {activeMainTab === 'connections' && <ConnectionsManager />}

      {/* ============================================================ */}
      {/* TAB CONTENT 5: CHECKPOINT AUDIT HISTORY                      */}
      {/* ============================================================ */}
      {activeMainTab === 'history' && (
        <div
          style={{
            backgroundColor: '#18120e',
            border: '1px solid #3d2a1d',
            borderRadius: '12px',
            padding: '1.25rem',
          }}
        >
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: '0 0 1rem 0' }}>
            Historial de Checkpoints de {activeOffice.brand.name}
          </h2>

          {activeOffice.checkpointHistory.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#6b7280', padding: '3rem 0', fontSize: '0.85rem' }}>
              No hay decisiones registradas aún. Inicia el pipeline para ver las revisiones obligatorias de Dora.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {activeOffice.checkpointHistory.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#201712',
                    border: '1px solid #3d2a1d',
                    borderRadius: '8px',
                    padding: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#faae33' }}>
                      {item.title}
                    </span>
                    <span
                      style={{
                        backgroundColor: item.status === 'APPROVED' ? '#065f46' : '#78350f',
                        color: item.status === 'APPROVED' ? '#34d399' : '#facc15',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                      }}
                    >
                      {item.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>
                    Fecha: {new Date(item.timestamp).toLocaleString()} • Revisor: {item.agent}
                  </div>
                  {item.userFeedback && (
                    <div style={{ marginTop: '0.5rem', fontSize: '0.78rem', color: '#d1d5db', background: '#140f0c', padding: '0.5rem', borderRadius: '4px' }}>
                      <strong>Instrucción del Operador:</strong> {item.userFeedback}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Floating Agent Inspector Drawer */}
      <AgentInspector />

      {/* Blocking Checkpoint Modal */}
      <CheckpointModal />

      {/* REAL DATA INJECTION MODAL */}
      {showRealDataModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '620px',
              backgroundColor: '#1b1410',
              border: '2px solid #faae33',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 20px 60px rgba(0,0,0,0.8), 0 0 25px rgba(250, 174, 51, 0.25)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', margin: 0 }}>
                Inyectar Datos de Mercado
              </h3>
              <button
                onClick={() => setShowRealDataModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#9ca3af', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', borderRadius: '4px' }}
                aria-label="Cerrar modal"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <p style={{ fontSize: '0.78rem', color: '#d1d5db', lineHeight: 1.5, marginBottom: '1rem' }}>
              Pega aquí información verídica: enlaces o descripción de catálogo de CJ Dropshipping/AliExpress, textos de anuncios reales de competidores extraídos de Meta Ad Library o métricas de TikTok Creative Center. <strong>Los 11 agentes analizarán este texto real en lugar de datos simulados.</strong>
            </p>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#faae33', marginBottom: '0.35rem' }}>
                Datos de Entrada del Producto / Mercado:
              </label>
              <textarea
                rows={6}
                value={realDataInput}
                onChange={(e) => setRealDataInput(e.target.value)}
                placeholder="Pega aquí: Ficha técnica del fabricante, precio de coste en fábrica (ej: 5.20$), texto de anuncios de la competencia, reseñas de compradores, ingredientes reales o especificaciones técnicas..."
                style={{
                  width: '100%',
                  backgroundColor: '#120d09',
                  border: '1px solid #4a3424',
                  borderRadius: '6px',
                  color: '#fff',
                  padding: '0.75rem',
                  fontSize: '0.8rem',
                  lineHeight: 1.4,
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#34d399', marginBottom: '0.35rem' }}>
                Clave API Gratuita (Google Gemini o Groq) — Opcional para IA en Tiempo Real:
              </label>
              <input
                type="password"
                placeholder="Pega tu clave gratuita de Google AI Studio o Groq..."
                value={quickApiKey || store.quotas.gemini?.apiKey || store.quotas.groq?.apiKey || ''}
                onChange={(e) => {
                  setQuickApiKey(e.target.value)
                  store.setProviderApiKey('gemini', e.target.value)
                  store.setProviderApiKey('groq', e.target.value)
                }}
                style={{
                  width: '100%',
                  backgroundColor: '#120d09',
                  border: '1px solid #34d399',
                  borderRadius: '6px',
                  color: '#fff',
                  padding: '0.5rem',
                  fontSize: '0.78rem',
                  boxSizing: 'border-box',
                }}
              />
              <span style={{ fontSize: '0.68rem', color: '#9ca3af', display: 'block', marginTop: '3px' }}>
                Se almacena solo en tu navegador (LocalStorage). Permite que los agentes redacten copys y análisis únicos con LLM real.
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem' }}>
              <button
                onClick={() => setShowRealDataModal(false)}
                style={{
                  background: 'transparent',
                  border: '1px solid #555',
                  color: '#9ca3af',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                }}
              >
                Cancelar
              </button>

              <button
                onClick={() => {
                  if (activeOffice) {
                    store.offices[activeOffice.id].product.description = realDataInput
                    store.offices[activeOffice.id].product.source = realDataInput.trim() ? 'USER_PROVIDED' : 'DEMO'
                    store.addLog({
                      officeId: activeOffice.id,
                      agentId: 'dora',
                      agentName: 'Dora (CEO)',
                      message: realDataInput.trim()
                        ? '[Datos Reales] Información de mercado inyectada correctamente. Pipeline actualizado.'
                        : 'Modo simulación restaurado.',
                      level: 'success',
                    })
                  }
                  setShowRealDataModal(false)
                }}
                style={{
                  background: 'linear-gradient(135deg, #faae33, #d98216)',
                  color: '#181008',
                  border: 'none',
                  padding: '0.5rem 1.3rem',
                  borderRadius: '6px',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                Guardar e Inyectar en Pipeline
              </button>
            </div>
          </div>
        </div>
      )}
      {/* New Product Launch Wizard Modal */}
      <NewProductLaunchModal
        isOpen={isLaunchModalOpen}
        onClose={() => setIsLaunchModalOpen(false)}
      />
    </div>
  )
}
