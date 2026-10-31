'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { AGENT_DEFINITIONS } from '@/lib/office/agents/definitions'
import { useOfficeStore } from '@/lib/office/store'
import { AgentId } from '@/types/office'

function BotIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 8V4H8" />
      <rect width="16" height="12" x="4" y="8" rx="2" />
      <path d="M2 14h2" />
      <path d="M20 14h2" />
      <path d="M9 13v2" />
      <path d="M15 13v2" />
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

function PackageIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  )
}

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
          backgroundColor: '#121214',
          border: '1px solid #1f1f24',
          borderRadius: '10px',
          padding: '1.25rem 1.5rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
            <span style={{ color: '#faae33', display: 'flex', alignItems: 'center' }}>
              <BotIcon />
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
              Agentes Especialistas
            </h1>
            <span
              style={{
                fontSize: '0.7rem',
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: '4px',
                backgroundColor: '#1a1a20',
                color: '#faae33',
                border: '1px solid rgba(250, 174, 51, 0.25)',
              }}
            >
              11 Especialistas Activos
            </span>
          </div>
          <p style={{ margin: 0, fontSize: '0.825rem', color: '#71717a' }}>
            Cada agente supervisa una fase técnica del flujo de comercio: análisis de mercado, creatividad publicitaria, arquitectura de tienda y finanzas.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
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
            href="/dashboard/projects"
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
            <PackageIcon />
            Entregables
          </Link>
        </div>
      </div>

      {/* Main Grid: Agent Cards on Left, Detail Inspector on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Left Column: List of 11 Agents */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Directorio de Agentes ({agentsList.length})
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
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
                    backgroundColor: isSelected ? '#1c1c22' : '#121215',
                    border: isSelected ? '1px solid #faae33' : '1px solid #1f1f24',
                    borderRadius: '8px',
                    padding: '0.75rem 1rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.12s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: '6px',
                        backgroundColor: '#1f1f24',
                        border: '1px solid #2d2d34',
                        color: '#f4f4f5',
                        fontWeight: 700,
                        fontSize: '0.8rem',
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
                        <span style={{ fontWeight: 600, color: '#ffffff', fontSize: '0.875rem' }}>{agent.name}</span>
                        <span
                          style={{
                            fontSize: '0.68rem',
                            padding: '1px 5px',
                            borderRadius: '4px',
                            backgroundColor: '#1f1f24',
                            color: '#a1a1aa',
                          }}
                        >
                          {agent.department}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#71717a' }}>{agent.role}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 600,
                        padding: '2px 7px',
                        borderRadius: '4px',
                        backgroundColor: isWorking
                          ? 'rgba(250, 174, 51, 0.12)'
                          : isWaiting
                          ? 'rgba(239, 68, 68, 0.12)'
                          : 'rgba(16, 185, 129, 0.1)',
                        color: isWorking ? '#faae33' : isWaiting ? '#f87171' : '#34d399',
                        border: `1px solid ${isWorking ? 'rgba(250,174,51,0.25)' : isWaiting ? 'rgba(239,68,68,0.25)' : 'rgba(16,185,129,0.2)'}`,
                      }}
                    >
                      {isWorking ? 'En ejecución' : isWaiting ? 'En pausa' : 'Listo'}
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
              backgroundColor: '#121215',
              border: '1px solid #1f1f24',
              borderRadius: '10px',
              padding: '1.5rem',
              position: 'sticky',
              top: '1.5rem',
            }}
          >
            {/* Agent Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.25rem' }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '8px',
                  backgroundColor: '#1f1f24',
                  border: '1px solid #2d2d34',
                  color: '#faae33',
                  fontWeight: 800,
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {selectedAgent.avatarInitials}
              </div>
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>{selectedAgent.name}</h2>
                <div style={{ fontSize: '0.8rem', color: '#faae33', fontWeight: 500 }}>{selectedAgent.role}</div>
                <div style={{ fontSize: '0.72rem', color: '#71717a' }}>Departamento: {selectedAgent.department}</div>
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: '1.25rem', fontSize: '0.825rem', color: '#a1a1aa', lineHeight: 1.5 }}>
              {selectedAgent.description}
            </div>

            {/* System Prompt / Instrucciones Maestras */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem' }}>
                Instrucciones del Especialista
              </div>
              <div
                style={{
                  backgroundColor: '#0c0c0e',
                  border: '1px solid #1f1f24',
                  borderRadius: '6px',
                  padding: '0.75rem',
                  fontSize: '0.78rem',
                  color: '#a1a1aa',
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
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem' }}>
                Especialidades
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {selectedAgent.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: '0.72rem',
                      padding: '2px 7px',
                      borderRadius: '4px',
                      backgroundColor: '#18181c',
                      border: '1px solid #25252c',
                      color: '#d4d4d8',
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Quality Gates */}
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem' }}>
                Filtros de Calidad Requeridos
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
                      color: '#a1a1aa',
                    }}
                  >
                    <span style={{ color: '#faae33', fontSize: '0.7rem' }}>■</span>
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
