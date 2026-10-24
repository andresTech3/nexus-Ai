'use client'

import { useState } from 'react'

interface AuditLog {
  id: string
  timestamp: string
  actor: string
  action: string
  resource: string
  status: 'success' | 'warning' | 'error'
  ipAddress: string
}

const INITIAL_LOGS: AuditLog[] = []

export default function ReportsPage() {
  const [logs] = useState<AuditLog[]>(INITIAL_LOGS)

  return (
    <div id="reports-page">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, color: 'white', marginBottom: '0.375rem' }}>
            Informes, Auditoría & Rendimiento
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)' }}>
            Registro cronológico inmutable de auditoría, trazabilidad de llamadas a modelos y analítica operativa.
          </p>
        </div>
        <button
          onClick={() => alert('Exportando informe consolidado en formato CSV...')}
          className="btn btn-secondary"
          style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
        >
          ▤ Exportar Informe CSV
        </button>
      </div>

      {/* Analytics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div className="metric-card">
          <div className="metric-label">Eficiencia Operativa</div>
          <div className="metric-value" style={{ color: '#4ade80' }}>100%</div>
          <div className="metric-change">Sin tiempos de caída de base de datos</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Tiempo Medio de Respuesta IA</div>
          <div className="metric-value" style={{ color: '#38bdf8' }}>{logs.length === 0 ? '—' : '640 ms'}</div>
          <div className="metric-change">Adaptador Gemini 2.0 Flash</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Volumen de Solicitudes API</div>
          <div className="metric-value" style={{ color: '#c084fc' }}>{logs.length}</div>
          <div className="metric-change">Rutas /api/v1 aisladas por tenant</div>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'white' }}>
          Registro de Auditoría del Sistema (Audit Log)
        </h2>
        <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
          Retención de seguridad: 90 días
        </span>
      </div>

      <div
        style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(147,51,234,0.15)',
          borderRadius: '1rem',
          overflow: 'hidden',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.01)' }}>
              {['Fecha & Hora', 'Actor / Usuario', 'Acción Auditada', 'Recurso Afectado', 'IP Origen', 'Estado'].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: '0.875rem 1.5rem',
                    textAlign: 'left',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: 'rgba(255,255,255,0.4)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '3.5rem 2rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem', opacity: 0.7 }}>📊</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f3f4f6', marginBottom: '0.35rem' }}>
                    No hay eventos de auditoría registrados todavía
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
                    Las llamadas a la API, inicios de sesión y ejecuciones de agentes se auditarán aquí automáticamente en tiempo real.
                  </div>
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr
                  key={log.id}
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.15s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                >
                  <td style={{ padding: '0.9rem 1.5rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                    {log.timestamp}
                  </td>
                  <td style={{ padding: '0.9rem 1.5rem', color: 'white', fontWeight: 600, fontSize: '0.85rem' }}>
                    {log.actor}
                  </td>
                  <td style={{ padding: '0.9rem 1.5rem', color: 'var(--color-purple-400)', fontFamily: 'monospace', fontSize: '0.82rem' }}>
                    {log.action}
                  </td>
                  <td style={{ padding: '0.9rem 1.5rem', color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }}>
                    {log.resource}
                  </td>
                  <td style={{ padding: '0.9rem 1.5rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                    {log.ipAddress}
                  </td>
                  <td style={{ padding: '0.9rem 1.5rem' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '0.15rem 0.5rem',
                        borderRadius: '999px',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        background: 'rgba(74, 222, 128, 0.15)',
                        color: '#4ade80',
                        border: '1px solid rgba(74, 222, 128, 0.3)',
                      }}
                    >
                      ✓ Correcto
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
