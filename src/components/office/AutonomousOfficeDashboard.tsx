'use client'

import React, { useState, useEffect } from 'react'
import { useOfficeStore } from '@/lib/office/store'
import { scheduler } from '@/lib/office/scheduler'
import { AGENT_DEFINITIONS } from '@/lib/office/agents/definitions'
import { Office3D } from './Office3D'
import { CheckpointModal } from './CheckpointModal'
import { DeliverablesView } from './DeliverablesView'
import { MultiOfficeManager } from './MultiOfficeManager'
import { ConnectionsManager } from './ConnectionsManager'
import { NewProductLaunchModal } from './NewProductLaunchModal'
import { LeoCreativesStudio } from './LeoCreativesStudio'
import { RealMarketResearchView } from './RealMarketResearchView'
import { DoraQualityGateAuditView } from './DoraQualityGateAuditView'
import { ExecutiveCommandCenter } from './ExecutiveCommandCenter'
import { AgentId, TrafficMode, WorkflowType } from '@/types/office'

export function AutonomousOfficeDashboard() {
  const store = useOfficeStore()
  const activeOffice = store.offices[store.activeOfficeId]
  const isRunning = store.isRunning
  const speed = store.speed

  const [activeMainTab, setActiveMainTab] = useState<
    'command_center' | 'creatives' | 'market_research' | 'deliverables' | 'dora_audit' | 'offices' | 'connections' | 'history'
  >('command_center')

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
          background: 'linear-gradient(135deg, #16121c, #0e0c14)',
          border: '1px solid #2e263c',
          borderRadius: '16px',
          padding: '1.25rem 1.5rem',
          boxShadow: '0 10px 35px rgba(0,0,0,0.5)',
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
                width: 42,
                height: 42,
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #faae33, #d98216)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#090807',
                fontSize: '1.25rem',
                boxShadow: '0 4px 15px rgba(250, 174, 51, 0.35)',
              }}
            >
              🏢
            </div>
            <div>
              <div style={{ fontSize: '0.74rem', color: '#faae33', fontWeight: 800, letterSpacing: '0.04em' }}>
                OFICINA VIRTUAL IA &bull; 11 ASISTENTES EN 3D
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '3px', flexWrap: 'wrap' }}>
                <select
                  value={activeOffice.id}
                  onChange={(e) => store.setActiveOffice(e.target.value)}
                  style={{
                    backgroundColor: '#1b1724',
                    border: '1px solid #3d344e',
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    borderRadius: '8px',
                    padding: '0.3rem 0.6rem',
                    cursor: 'pointer',
                  }}
                >
                  {Object.values(store.offices).map((off) => (
                    <option key={off.id} value={off.id}>
                      {off.name}
                    </option>
                  ))}
                </select>

                <span
                  style={{
                    backgroundColor: activeOffice.status === 'ON' ? 'rgba(52, 211, 153, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    color: activeOffice.status === 'ON' ? '#34d399' : '#f87171',
                    border: `1px solid ${activeOffice.status === 'ON' ? 'rgba(52,211,153,0.3)' : 'rgba(239,68,68,0.3)'}`,
                    padding: '3px 10px',
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                  }}
                >
                  {activeOffice.status === 'ON' ? '🟢 Asistentes Listos' : '⚪ En Pausa'}
                </span>

                {/* Probar Nuevo Producto Golden Button */}
                <button
                  onClick={() => setIsLaunchModalOpen(true)}
                  style={{
                    background: '#faae33',
                    color: '#100c06',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '4px 10px',
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    boxShadow: '0 2px 8px rgba(250, 174, 51, 0.3)',
                  }}
                  title="Configurar producto"
                >
                  <span>+</span>
                  <span>Nuevo Producto</span>
                </button>
              </div>
            </div>
          </div>

          {/* Connectors & Settings Button */}
          <button
            onClick={() => setActiveMainTab('connections')}
            style={{
              backgroundColor: activeMainTab === 'connections' ? '#271f33' : '#14121a',
              border: '1px solid #332a42',
              borderRadius: '8px',
              padding: '0.5rem 0.95rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: '#faae33',
              cursor: 'pointer',
            }}
          >
            <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#34d399' }} />
            <span>Conexiones &amp; Ajustes</span>
          </button>
        </div>

        {/* Second Row: Mode, Speed & Big Action Button */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
            borderTop: '1px solid #231c2d',
            paddingTop: '0.9rem',
          }}
        >
          {/* Left Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            {/* Simple Strategy Mode Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#a1a1aa', fontWeight: 600 }}>Estrategia:</span>
              <div style={{ display: 'flex', backgroundColor: '#131019', borderRadius: '6px', padding: '2px', border: '1px solid #282136' }}>
                {(['HYBRID', 'ADS', 'ORGANIC'] as TrafficMode[]).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => store.setTrafficMode(activeOffice.id, mode)}
                    style={{
                      background: activeOffice.trafficMode === mode ? '#faae33' : 'transparent',
                      color: activeOffice.trafficMode === mode ? '#100c06' : '#a1a1aa',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '4px 10px',
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    {mode === 'HYBRID' ? '🚀 Automático' : mode === 'ADS' ? '⚡ Publicidad' : '📱 Vídeos Virales'}
                  </button>
                ))}
              </div>
            </div>

            {/* Speed Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#a1a1aa', fontWeight: 600 }}>Velocidad:</span>
              <div style={{ display: 'flex', backgroundColor: '#131019', borderRadius: '6px', padding: '2px', border: '1px solid #282136' }}>
                {([0.5, 1, 2, 5] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => store.setSpeed(s)}
                    style={{
                      background: speed === s ? '#faae33' : 'transparent',
                      color: speed === s ? '#100c06' : '#a1a1aa',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '4px 9px',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    {s === 0.5 ? 'Modo Pausado' : `${s}x`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Action: Big Play / Pause */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <button
              onClick={handleStartOrPause}
              disabled={activeOffice.status === 'OFF'}
              style={{
                background: isRunning ? '#ef4444' : 'linear-gradient(135deg, #faae33, #d98216)',
                color: isRunning ? '#ffffff' : '#090807',
                border: 'none',
                padding: '0.6rem 1.4rem',
                borderRadius: '8px',
                fontSize: '0.86rem',
                fontWeight: 900,
                cursor: activeOffice.status === 'OFF' ? 'not-allowed' : 'pointer',
                opacity: activeOffice.status === 'OFF' ? 0.5 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: isRunning ? '0 0 20px rgba(239, 68, 68, 0.4)' : '0 4px 20px rgba(250, 174, 51, 0.4)',
                transition: 'transform 0.15s ease',
              }}
            >
              <span>{isRunning ? '⏸ Pausar Trabajo' : '▶ Iniciar Trabajo de los Asistentes'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 4-STEP VISUAL WORKFLOW: SIMPLE & DIRECT                      */}
      {/* ============================================================ */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '0.85rem',
          backgroundColor: '#120f17',
          border: '1px solid #272133',
          borderRadius: '14px',
          padding: '1rem',
        }}
      >
        {/* Step 1: Producto */}
        <div
          style={{
            backgroundColor: '#17141f',
            border: '1px solid #2f273e',
            borderRadius: '10px',
            padding: '0.85rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.72rem', color: '#faae33', fontWeight: 800 }}>📦 PASO 1: TU PRODUCTO</span>
              <span style={{ fontSize: '0.68rem', color: '#34d399', fontWeight: 700 }}>● Asignado</span>
            </div>
            {activeOffice.product.name ? (
              <>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {activeOffice.product.name}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#a1a1aa' }}>Listo para vender en tienda</div>
              </>
            ) : (
              <div style={{ fontSize: '0.82rem', color: '#faae33', fontWeight: 700 }}>
                Elige qué producto quieres vender
              </div>
            )}
          </div>
          <button
            onClick={() => setIsLaunchModalOpen(true)}
            style={{
              marginTop: '0.65rem',
              background: activeOffice.product.name ? '#221e2d' : '#faae33',
              border: `1px solid ${activeOffice.product.name ? '#3c324e' : '#faae33'}`,
              color: activeOffice.product.name ? '#faae33' : '#100c06',
              borderRadius: '6px',
              padding: '0.45rem',
              fontSize: '0.75rem',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            {activeOffice.product.name ? 'Cambiar Producto' : 'Configurar Producto'}
          </button>
        </div>

        {/* Step 2: Precios y Fabricante */}
        <div
          onClick={() => setActiveMainTab('market_research')}
          style={{
            backgroundColor: activeMainTab === 'market_research' ? '#1f1a2a' : '#17141f',
            border: `1px solid ${activeMainTab === 'market_research' ? '#34d399' : '#2f273e'}`,
            borderRadius: '10px',
            padding: '0.85rem',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: 800 }}>🔍 PASO 2: PRECIOS &amp; FÁBRICA</span>
              <span style={{ fontSize: '0.68rem', color: '#34d399' }}>Investigación</span>
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#fff' }}>
              Costes de Fábrica y Competencia
            </div>
            <div style={{ fontSize: '0.72rem', color: '#a1a1aa' }}>Precios de compra y margen de beneficio</div>
          </div>
          <div style={{ marginTop: '0.65rem', fontSize: '0.75rem', color: '#34d399', fontWeight: 800 }}>
            Ver Precios Reales &rarr;
          </div>
        </div>

        {/* Step 3: Vídeos y Anuncios */}
        <div
          onClick={() => setActiveMainTab('creatives')}
          style={{
            backgroundColor: activeMainTab === 'creatives' ? '#1f1a2a' : '#17141f',
            border: `1px solid ${activeMainTab === 'creatives' ? '#faae33' : '#2f273e'}`,
            borderRadius: '10px',
            padding: '0.85rem',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.72rem', color: '#faae33', fontWeight: 800 }}>🎨 PASO 3: VÍDEOS &amp; ANUNCIOS</span>
              <span style={{ fontSize: '0.68rem', color: '#faae33' }}>Visual</span>
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#fff' }}>
              Vídeos y Fotos Atractivas
            </div>
            <div style={{ fontSize: '0.72rem', color: '#a1a1aa' }}>Guiones y creativos listos para redes sociales</div>
          </div>
          <div style={{ marginTop: '0.65rem', fontSize: '0.75rem', color: '#faae33', fontWeight: 800 }}>
            Ver Vídeos y Fotos &rarr;
          </div>
        </div>

        {/* Step 4: Tienda Lista */}
        <div
          onClick={() => setActiveMainTab('deliverables')}
          style={{
            backgroundColor: activeMainTab === 'deliverables' ? '#1f1a2a' : '#17141f',
            border: `1px solid ${activeMainTab === 'deliverables' ? '#38bdf8' : '#2f273e'}`,
            borderRadius: '10px',
            padding: '0.85rem',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 800 }}>🛒 PASO 4: TU TIENDA ONLINE</span>
              <span style={{ fontSize: '0.68rem', color: '#38bdf8' }}>Tienda</span>
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#fff' }}>
              Página Web Lista para Cobrar
            </div>
            <div style={{ fontSize: '0.72rem', color: '#a1a1aa' }}>Botón de pago y pedidos directos a tu banco</div>
          </div>
          <div style={{ marginTop: '0.65rem', fontSize: '0.75rem', color: '#38bdf8', fontWeight: 800 }}>
            Ver Mi Tienda y Archivos &rarr;
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
          borderBottom: '1px solid #2d243a',
          paddingBottom: '0.25rem',
          overflowX: 'auto',
        }}
      >
        <button
          onClick={() => setActiveMainTab('command_center')}
          style={{
            background: activeMainTab === 'command_center' ? '#1c1726' : 'transparent',
            border: `1px solid ${activeMainTab === 'command_center' ? '#faae33' : 'transparent'}`,
            borderBottom: activeMainTab === 'command_center' ? '2px solid #faae33' : 'none',
            color: activeMainTab === 'command_center' ? '#faae33' : '#a1a1aa',
            borderRadius: '8px 8px 0 0',
            padding: '0.65rem 1.15rem',
            fontSize: '0.84rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            whiteSpace: 'nowrap',
          }}
        >
          <span>🏢 Oficina 3D &amp; Control</span>
          {isRunning && (
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: '#34d399',
                display: 'inline-block',
                boxShadow: '0 0 10px #34d399',
              }}
            />
          )}
        </button>

        <button
          onClick={() => setActiveMainTab('creatives')}
          style={{
            background: activeMainTab === 'creatives' ? '#1c1726' : 'transparent',
            border: `1px solid ${activeMainTab === 'creatives' ? '#faae33' : 'transparent'}`,
            borderBottom: activeMainTab === 'creatives' ? '2px solid #faae33' : 'none',
            color: activeMainTab === 'creatives' ? '#faae33' : '#a1a1aa',
            borderRadius: '8px 8px 0 0',
            padding: '0.65rem 1.15rem',
            fontSize: '0.84rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            whiteSpace: 'nowrap',
          }}
        >
          <span>🎨 Vídeos &amp; Anuncios</span>
        </button>

        <button
          onClick={() => setActiveMainTab('market_research')}
          style={{
            background: activeMainTab === 'market_research' ? '#1c1726' : 'transparent',
            border: `1px solid ${activeMainTab === 'market_research' ? '#34d399' : 'transparent'}`,
            borderBottom: activeMainTab === 'market_research' ? '2px solid #34d399' : 'none',
            color: activeMainTab === 'market_research' ? '#34d399' : '#a1a1aa',
            borderRadius: '8px 8px 0 0',
            padding: '0.65rem 1.15rem',
            fontSize: '0.84rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            whiteSpace: 'nowrap',
          }}
        >
          <span>🔍 Precios &amp; Competidores</span>
        </button>

        <button
          onClick={() => setActiveMainTab('deliverables')}
          style={{
            background: activeMainTab === 'deliverables' ? '#1c1726' : 'transparent',
            border: `1px solid ${activeMainTab === 'deliverables' ? '#faae33' : 'transparent'}`,
            borderBottom: activeMainTab === 'deliverables' ? '2px solid #faae33' : 'none',
            color: activeMainTab === 'deliverables' ? '#faae33' : '#a1a1aa',
            borderRadius: '8px 8px 0 0',
            padding: '0.65rem 1.15rem',
            fontSize: '0.84rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            whiteSpace: 'nowrap',
          }}
        >
          <span>🛒 Mi Tienda &amp; Archivos</span>
        </button>

        <button
          onClick={() => setActiveMainTab('dora_audit')}
          style={{
            background: activeMainTab === 'dora_audit' ? '#1c1726' : 'transparent',
            border: `1px solid ${activeMainTab === 'dora_audit' ? '#faae33' : 'transparent'}`,
            borderBottom: activeMainTab === 'dora_audit' ? '2px solid #faae33' : 'none',
            color: activeMainTab === 'dora_audit' ? '#faae33' : '#a1a1aa',
            borderRadius: '8px 8px 0 0',
            padding: '0.65rem 1.15rem',
            fontSize: '0.84rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            whiteSpace: 'nowrap',
          }}
        >
          <span>🛡️ Control de Calidad</span>
        </button>

        <button
          onClick={() => setActiveMainTab('connections')}
          style={{
            background: activeMainTab === 'connections' ? '#1c1726' : 'transparent',
            border: `1px solid ${activeMainTab === 'connections' ? '#faae33' : 'transparent'}`,
            borderBottom: activeMainTab === 'connections' ? '2px solid #faae33' : 'none',
            color: activeMainTab === 'connections' ? '#faae33' : '#a1a1aa',
            borderRadius: '8px 8px 0 0',
            padding: '0.65rem 1.15rem',
            fontSize: '0.84rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            whiteSpace: 'nowrap',
          }}
        >
          <span>⚙️ Conexiones</span>
        </button>

        <button
          onClick={() => setActiveMainTab('offices')}
          style={{
            background: activeMainTab === 'offices' ? '#1c1726' : 'transparent',
            border: `1px solid ${activeMainTab === 'offices' ? '#faae33' : 'transparent'}`,
            borderBottom: activeMainTab === 'offices' ? '2px solid #faae33' : 'none',
            color: activeMainTab === 'offices' ? '#faae33' : '#a1a1aa',
            borderRadius: '8px 8px 0 0',
            padding: '0.65rem 1.15rem',
            fontSize: '0.84rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            whiteSpace: 'nowrap',
          }}
        >
          <span>📁 Mis Proyectos ({Object.keys(store.offices).length})</span>
        </button>

        <button
          onClick={() => setActiveMainTab('history')}
          style={{
            background: activeMainTab === 'history' ? '#1c1726' : 'transparent',
            border: `1px solid ${activeMainTab === 'history' ? '#faae33' : 'transparent'}`,
            borderBottom: activeMainTab === 'history' ? '2px solid #faae33' : 'none',
            color: activeMainTab === 'history' ? '#faae33' : '#a1a1aa',
            borderRadius: '8px 8px 0 0',
            padding: '0.65rem 1.15rem',
            fontSize: '0.84rem',
            fontWeight: 800,
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
      {/* TAB CONTENT 1: OFICINA 3D EN VIVO & CENTRO DE MANDO          */}
      {/* ============================================================ */}
      {activeMainTab === 'command_center' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
          {/* OFICINA VIRTUAL 3D CON AGENTES LOW-POLY */}
          <div style={{ position: 'relative', width: '100%' }}>
            <Office3D />
          </div>

          {/* PANEL EJECUTIVO Y ESTADO DE AGENTES */}
          <ExecutiveCommandCenter onOpenResearch={() => setActiveMainTab('market_research')} />
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
