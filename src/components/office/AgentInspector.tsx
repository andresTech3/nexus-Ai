'use client'

import React, { useState } from 'react'
import { useOfficeStore } from '@/lib/office/store'
import { AGENT_DEFINITIONS } from '@/lib/office/agents/definitions'
import { getRecommendedModelForAgent } from '@/lib/office/freellmapiCatalog'
import { CleanDeliverableRenderer } from './CleanDeliverableRenderer'
import { AgentId } from '@/types/office'

export function AgentInspector() {
  const store = useOfficeStore()
  const agentId = store.selectedAgentId
  const activeOffice = store.offices[store.activeOfficeId]

  const [activeTab, setActiveTab] = useState<'profile' | 'logs' | 'deliverable' | 'prompt'>('profile')
  const [copied, setCopied] = useState(false)

  if (!agentId) return null

  const agentDef = AGENT_DEFINITIONS[agentId]
  if (!agentDef) return null

  const currentStatus = activeOffice?.agentStates[agentId] || 'IDLE'
  const agentLogs = store.logs.filter((l) => l.agentId === agentId)
  const deliverables = activeOffice?.deliverables || {}

  // Find relevant deliverable for this agent
  let deliverableKey = ''
  let deliverableContent: any = null

  if (agentId === 'ivan') {
    deliverableKey = '01_investigacion_producto_ivan.json'
  } else if (agentId === 'lucas') {
    deliverableKey = '02_analisis_competencia_lucas.md'
  } else if (agentId === 'eva') {
    deliverableKey = '03_unit_economics_eva.csv'
  } else if (agentId === 'sofia') {
    deliverableKey = '04_customer_avatar_sofia.json'
  } else if (agentId === 'carlos') {
    deliverableKey = '05_copy_landing_page_carlos.md'
  } else if (agentId === 'leo') {
    deliverableKey = '06_prompts_fotografia_leo.json'
  } else if (agentId === 'diego') {
    deliverableKey = '07_shopify_bundle_selector_diego.liquid'
  } else if (agentId === 'marco') {
    deliverableKey = '08_guiones_anuncios_ugc_marco.md'
  } else if (agentId === 'tomas') {
    deliverableKey = '09_estructura_campana_meta_tomas.json'
  } else if (agentId === 'marta') {
    deliverableKey = '10_manual_atencion_cliente_marta.md'
  } else if (agentId === 'dora') {
    deliverableKey = '11_informe_lanzamiento_dora.html'
  } else if (agentId === 'nora') {
    deliverableKey = '12_plan_contenido_organico_nora.md'
  }

  deliverableContent = deliverables[deliverableKey]

  const handleCopyDeliverable = () => {
    if (!deliverableContent) return
    const text = typeof deliverableContent === 'string' ? deliverableContent : JSON.stringify(deliverableContent, null, 2)
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getStatusBadge = () => {
    switch (currentStatus) {
      case 'ANALYZING':
        return <span style={{ color: '#38bdf8', background: '#082f49', border: '1px solid #38bdf8', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700 }}>ANALIZANDO</span>
      case 'GENERATING':
        return <span style={{ color: '#facc15', background: '#422006', border: '1px solid #facc15', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700 }}>GENERANDO</span>
      case 'NEEDS_APPROVAL':
        return <span style={{ color: '#f43f5e', background: '#4c0519', border: '1px solid #f43f5e', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700 }}>APROBACIÓN PENDIENTE</span>
      case 'DONE':
        return <span style={{ color: '#34d399', background: '#064e3b', border: '1px solid #34d399', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700 }}>FINALIZADO</span>
      case 'VACANT':
        return <span style={{ color: '#9ca3af', background: '#27272a', border: '1px solid #52525b', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700 }}>DISPONIBLE</span>
      default:
        return <span style={{ color: '#9ca3af', background: '#27272a', border: '1px solid #52525b', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700 }}>EN ESPERA</span>
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: '460px',
        maxWidth: '92vw',
        backgroundColor: '#18120e',
        borderLeft: '2px solid #3d2a1d',
        zIndex: 500,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-10px 0 30px rgba(0,0,0,0.7)',
        animation: 'slideInRight 0.25s ease-out',
      }}
    >
      {/* Drawer Header */}
      <div
        style={{
          padding: '1.25rem',
          borderBottom: '1px solid #332418',
          background: 'linear-gradient(180deg, #241812, #18120e)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              backgroundColor: `${agentDef.avatarColor}20`,
              border: `2px solid ${agentDef.avatarColor}`,
              color: agentDef.avatarColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1rem',
              boxShadow: `0 0 14px ${agentDef.avatarColor}40`,
            }}
          >
            {agentDef.avatarInitials}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                {agentDef.name}
              </h3>
              {getStatusBadge()}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#faae33' }}>
              {agentDef.role} • {agentDef.department}
            </div>
          </div>
        </div>

        <button
          onClick={() => store.selectAgent(null)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#9ca3af',
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            borderRadius: '4px',
          }}
          title="Cerrar Ficha"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid #332418',
          backgroundColor: '#140f0c',
        }}
      >
        <button
          onClick={() => setActiveTab('profile')}
          style={{
            flex: 1,
            padding: '0.65rem 0.5rem',
            background: activeTab === 'profile' ? '#241812' : 'transparent',
            border: 'none',
            borderBottom: activeTab === 'profile' ? '2px solid #faae33' : '2px solid transparent',
            color: activeTab === 'profile' ? '#faae33' : '#9ca3af',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Ficha &amp; Skills
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          style={{
            flex: 1,
            padding: '0.65rem 0.5rem',
            background: activeTab === 'logs' ? '#241812' : 'transparent',
            border: 'none',
            borderBottom: activeTab === 'logs' ? '2px solid #faae33' : '2px solid transparent',
            color: activeTab === 'logs' ? '#faae33' : '#9ca3af',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Logs ({agentLogs.length})
        </button>
        <button
          onClick={() => setActiveTab('deliverable')}
          style={{
            flex: 1,
            padding: '0.65rem 0.5rem',
            background: activeTab === 'deliverable' ? '#241812' : 'transparent',
            border: 'none',
            borderBottom: activeTab === 'deliverable' ? '2px solid #faae33' : '2px solid transparent',
            color: activeTab === 'deliverable' ? '#faae33' : '#9ca3af',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Entregable
        </button>
        <button
          onClick={() => setActiveTab('prompt')}
          style={{
            flex: 1,
            padding: '0.65rem 0.5rem',
            background: activeTab === 'prompt' ? '#241812' : 'transparent',
            border: 'none',
            borderBottom: activeTab === 'prompt' ? '2px solid #faae33' : '2px solid transparent',
            color: activeTab === 'prompt' ? '#faae33' : '#9ca3af',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Prompt
        </button>
      </div>

      {/* Tab Contents */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem' }}>
        {activeTab === 'profile' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Description */}
            <div style={{ fontSize: '0.82rem', color: '#d1d5db', lineHeight: 1.5 }}>
              {agentDef.description}
            </div>

            {/* Provider and Token Consumption */}
            <div
              style={{
                background: '#1f1611',
                border: '1px solid #3a281c',
                borderRadius: '8px',
                padding: '0.85rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.72rem', color: '#faae33', fontWeight: 800 }}>
                  MOTOR DE IA (FREELLMAPI GATEWAY)
                </span>
                <span style={{ fontSize: '0.65rem', background: '#064e3b', color: '#34d399', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                  100% GRATIS
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', color: '#e5e7eb', marginBottom: '0.3rem' }}>
                <span>Modelo activo en oficina:</span>
                <strong style={{ color: '#faae33', fontFamily: 'monospace' }}>
                  {store.quotas.freellmapi?.modelName || 'auto'}
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', color: '#e5e7eb', marginBottom: '0.5rem' }}>
                <span>Recomendado para {agentDef.name}:</span>
                <strong style={{ color: '#38bdf8', fontFamily: 'monospace' }}>
                  {getRecommendedModelForAgent(agentId)}
                </strong>
              </div>
              {store.quotas.freellmapi?.modelName !== getRecommendedModelForAgent(agentId) && (
                <button
                  onClick={() => store.setProviderModel('freellmapi', getRecommendedModelForAgent(agentId))}
                  style={{
                    backgroundColor: '#271a12',
                    border: '1px solid #faae33',
                    color: '#faae33',
                    borderRadius: '4px',
                    padding: '0.35rem 0.6rem',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'center',
                  }}
                >
                  Asignar {getRecommendedModelForAgent(agentId)} a la Oficina
                </button>
              )}
            </div>

            {/* Skills */}
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
                HABILIDADES ESPECIALIZADAS (SKILLS)
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {agentDef.skills.map((s, idx) => (
                  <span
                    key={idx}
                    style={{
                      background: '#18181b',
                      border: '1px solid #27272a',
                      borderRadius: '16px',
                      padding: '0.25rem 0.65rem',
                      fontSize: '0.72rem',
                      color: '#faae33',
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Tools & Connections with Traffic Light */}
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
                HERRAMIENTAS &amp; CONEXIONES (SEMÁFORO)
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {agentDef.tools.map((t, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: '#1d1510',
                      border: '1px solid #332418',
                      borderRadius: '6px',
                      padding: '0.45rem 0.65rem',
                      fontSize: '0.76rem',
                    }}
                  >
                    <span style={{ color: '#d1d5db' }}>{t}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#34d399', fontSize: '0.7rem' }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#34d399' }} /> Conectado
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quality Gates */}
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
                QUALITY GATES AUDITADOS POR DORA
              </div>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.75rem', color: '#9ca3af', lineHeight: 1.6 }}>
                {agentDef.qualityGates.map((q, idx) => (
                  <li key={idx}>{q}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'logs' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {agentLogs.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#6b7280', padding: '2rem 0', fontSize: '0.8rem' }}>
                No hay logs registrados para este agente todavía.
              </div>
            ) : (
              agentLogs.map((log) => (
                <div
                  key={log.id}
                  style={{
                    background: '#1d1510',
                    border: '1px solid #332418',
                    borderRadius: '6px',
                    padding: '0.5rem 0.75rem',
                    fontSize: '0.75rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                    <span style={{ color: '#faae33', fontWeight: 700 }}>{log.timestamp}</span>
                    <span
                      style={{
                        color: log.level === 'success' ? '#34d399' : log.level === 'warn' ? '#facc15' : '#9ca3af',
                        fontSize: '0.68rem',
                        textTransform: 'uppercase',
                      }}
                    >
                      {log.level}
                    </span>
                  </div>
                  <div style={{ color: '#e5e7eb', lineHeight: 1.4 }}>{log.message}</div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'deliverable' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#faae33', fontWeight: 700 }}>ARCHIVO PRINCIPAL:</div>
                <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 700 }}>{deliverableKey || 'Sin entregable'}</div>
              </div>
              {deliverableContent && (
                <button
                  onClick={handleCopyDeliverable}
                  style={{
                    background: copied ? '#15803d' : '#2b1b11',
                    border: '1px solid #faae33',
                    color: '#faae33',
                    borderRadius: '4px',
                    padding: '0.3rem 0.65rem',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {copied ? 'Copiado' : 'Copiar Archivo'}
                </button>
              )}
            </div>

            {deliverableContent ? (
              <CleanDeliverableRenderer
                deliverableKey={deliverableKey}
                content={deliverableContent}
                productName={activeOffice?.product.name || 'Producto'}
                brandName={activeOffice?.brand.name}
              />
            ) : (
              <div style={{ textAlign: 'center', color: '#6b7280', padding: '2rem 0', fontSize: '0.8rem' }}>
                Este agente aún no ha generado su entregable final. Inicia el pipeline para ver el resultado.
              </div>
            )}
          </div>
        )}

        {activeTab === 'prompt' && (
          <div>
            <div style={{ fontSize: '0.75rem', color: '#faae33', fontWeight: 700, marginBottom: '0.4rem' }}>
              SYSTEM PROMPT MAESTRO
            </div>
            <div
              style={{
                background: '#120d09',
                border: '1px solid #332418',
                borderRadius: '6px',
                padding: '0.85rem',
                color: '#e5e7eb',
                fontSize: '0.75rem',
                lineHeight: 1.5,
                whiteSpace: 'pre-wrap',
              }}
            >
              {agentDef.systemPrompt}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
