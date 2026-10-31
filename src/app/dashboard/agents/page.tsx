'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { AGENT_DEFINITIONS } from '@/lib/office/agents/definitions'
import { useOfficeStore } from '@/lib/office/store'
import { AgentId } from '@/types/office'

export default function AgentsPage() {
  const store = useOfficeStore()
  const activeOffice = store.offices[store.activeOfficeId]
  const [selectedAgentId, setSelectedAgentId] = useState<AgentId>('dora')

  const agentsList = Object.values(AGENT_DEFINITIONS)
  const selectedAgent = AGENT_DEFINITIONS[selectedAgentId]

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
            <span style={{ fontSize: '1.25rem' }}>⚡</span>
            <h1
              style={{
                fontSize: '1.5rem',
                fontWeight: 800,
                color: '#fff',
                margin: 0,
                fontFamily: 'var(--font-display, inherit)',
              }}
            >
              11 Agentes Especialistas de Dropshipping
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
              Equipo Autónomo
            </span>
          </div>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>
            Cada agente domina una fase crítica del pipeline: desde la investigación con datos reales de TikTok/AliExpress hasta creativos y la tienda Shopify.
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
            🏛️ Ver Oficina 3D
          </Link>
          <Link
            href="/dashboard/projects"
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
            📦 Ver Entregables
          </Link>
        </div>
      </div>

      {/* Main Grid: Agent Cards on Left, Detail Inspector on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Left Column: List of 11 Agents */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#faae33', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Lista de Agentes ({agentsList.length})
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {agentsList.map((agent) => {
              const isSelected = selectedAgentId === agent.id
              const status = activeOffice?.agentStates?.[agent.id] || 'IDLE'
              const isWorking = status === 'ANALYZING' || status === 'GENERATING'
              const isWaiting = status === 'NEEDS_APPROVAL'

              return (
                <div
                  key={agent.id}
                  onClick={() => setSelectedAgentId(agent.id)}
                  style={{
                    background: isSelected
                      ? 'linear-gradient(135deg, rgba(250, 174, 51, 0.15), rgba(130, 53, 19, 0.15))'
                      : 'rgba(255, 255, 255, 0.02)',
                    border: isSelected ? '1px solid #faae33' : '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '10px',
                    padding: '0.85rem 1.1rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: '8px',
                        background: agent.avatarColor,
                        color: '#000',
                        fontWeight: 800,
                        fontSize: '0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {agent.avatarInitials}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>{agent.name}</span>
                        <span
                          style={{
                            fontSize: '0.7rem',
                            padding: '1px 6px',
                            borderRadius: '4px',
                            background: 'rgba(255,255,255,0.08)',
                            color: 'rgba(255,255,255,0.7)',
                          }}
                        >
                          {agent.department}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>{agent.role}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        padding: '3px 8px',
                        borderRadius: '999px',
                        background: isWorking
                          ? 'rgba(250, 174, 51, 0.2)'
                          : isWaiting
                          ? 'rgba(239, 68, 68, 0.2)'
                          : 'rgba(16, 185, 129, 0.15)',
                        color: isWorking ? '#faae33' : isWaiting ? '#f87171' : '#34d399',
                      }}
                    >
                      {isWorking ? '● En ejecución' : isWaiting ? '⏸ En pausa' : '✓ Listo'}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right Column: Selected Agent Detail Card */}
        {selectedAgent && (
          <div
            style={{
              background: 'linear-gradient(135deg, #1f1510, #16100c)',
              border: '1px solid #3d2a1d',
              borderRadius: '12px',
              padding: '1.5rem',
              position: 'sticky',
              top: '1.5rem',
            }}
          >
            {/* Agent Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: '12px',
                  background: selectedAgent.avatarColor,
                  color: '#000',
                  fontWeight: 900,
                  fontSize: '1.2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {selectedAgent.avatarInitials}
              </div>
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', margin: 0 }}>{selectedAgent.name}</h2>
                <div style={{ fontSize: '0.85rem', color: '#faae33', fontWeight: 600 }}>{selectedAgent.role}</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>Departamento: {selectedAgent.department}</div>
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: '1.25rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.5 }}>
              {selectedAgent.description}
            </div>

            {/* System Prompt / Instrucciones Maestras */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#faae33', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                Instrucciones Maestras & Rol
              </div>
              <div
                style={{
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '8px',
                  padding: '0.85rem',
                  fontSize: '0.8rem',
                  color: 'rgba(255,255,255,0.75)',
                  lineHeight: 1.45,
                  maxHeight: '140px',
                  overflowY: 'auto',
                }}
              >
                {selectedAgent.systemPrompt}
              </div>
            </div>

            {/* Skills */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#faae33', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Habilidades & Especialidades
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {selectedAgent.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: '0.75rem',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: 'rgba(255,255,255,0.85)',
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Quality Gates */}
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#faae33', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Filtros de Calidad Obligatorios (Dora Gate)
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {selectedAgent.qualityGates.map((gate, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.75rem',
                      color: 'rgba(255,255,255,0.7)',
                    }}
                  >
                    <span style={{ color: '#faae33' }}>✓</span>
                    <span>{gate}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
