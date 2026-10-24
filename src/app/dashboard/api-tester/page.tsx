'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Endpoint {
  id: string
  name: string
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  url: string
  description: string
  roleRequired: string
  defaultBody?: string
}

const ENDPOINTS: Endpoint[] = [
  {
    id: 'auth-me',
    name: '1. Obtener Mi Perfil y Organización',
    method: 'GET',
    url: '/api/v1/auth/me',
    description: 'Devuelve la identidad, perfil público y rol dentro de la organización activa.',
    roleRequired: 'Cualquier usuario autenticado',
  },
  {
    id: 'crm-list',
    name: '2. Listar Clientes del CRM (Paginado)',
    method: 'GET',
    url: '/api/v1/crm/clients?page=1&pageSize=10',
    description: 'Obtiene los clientes filtrados por el organization_id del usuario.',
    roleRequired: 'employee o admin',
  },
  {
    id: 'crm-create-valid',
    name: '3. Crear Nuevo Cliente en CRM (Válido)',
    method: 'POST',
    url: '/api/v1/crm/clients',
    description: 'Registra un nuevo prospecto en la base de datos de Supabase.',
    roleRequired: 'employee o admin',
    defaultBody: JSON.stringify(
      {
        name: 'Carlos Mendoza',
        companyName: 'Mendoza Tech S.L.',
        email: 'carlos.mendoza@empresa.com',
        phone: '+34612345678',
        status: 'prospect',
        customFields: {
          budgetEstimateCents: 350000,
          source: 'Web Form',
        },
      },
      null,
      2
    ),
  },
  {
    id: 'crm-create-invalid',
    name: '4. Probar Validación Zod (Payload Inválido)',
    method: 'POST',
    url: '/api/v1/crm/clients',
    description: 'Envía un email malformado para verificar la respuesta 422 de seguridad.',
    roleRequired: 'employee o admin',
    defaultBody: JSON.stringify(
      {
        name: '',
        email: 'correo-no-valido',
        status: 'prospect',
      },
      null,
      2
    ),
  },
]

export default function ApiTesterPage() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint>(ENDPOINTS[0])
  const [requestUrl, setRequestUrl] = useState<string>(ENDPOINTS[0].url)
  const [requestBody, setRequestBody] = useState<string>(ENDPOINTS[0].defaultBody || '')
  const [loading, setLoading] = useState<boolean>(false)
  const [responseStatus, setResponseStatus] = useState<number | null>(null)
  const [responseHeaders, setResponseHeaders] = useState<Record<string, string>>({})
  const [responseBody, setResponseBody] = useState<string>('')
  const [responseTime, setResponseTime] = useState<number | null>(null)

  function handleSelect(ep: Endpoint) {
    setSelectedEndpoint(ep)
    setRequestUrl(ep.url)
    setRequestBody(ep.defaultBody || '')
    setResponseStatus(null)
    setResponseBody('')
    setResponseHeaders({})
    setResponseTime(null)
  }

  async function executeRequest() {
    setLoading(true)
    setResponseStatus(null)
    setResponseBody('')
    setResponseHeaders({})
    const startTime = performance.now()

    try {
      const headers: Record<string, string> = {
        'Accept': 'application/json',
      }

      if (['POST', 'PATCH', 'PUT'].includes(selectedEndpoint.method)) {
        headers['Content-Type'] = 'application/json'
      }

      const res = await fetch(requestUrl, {
        method: selectedEndpoint.method,
        headers,
        body: ['POST', 'PATCH', 'PUT'].includes(selectedEndpoint.method) && requestBody ? requestBody : undefined,
      })

      const endTime = performance.now()
      setResponseTime(Math.round(endTime - startTime))
      setResponseStatus(res.status)

      // Extraer cabeceras de respuesta
      const extractedHeaders: Record<string, string> = {}
      res.headers.forEach((val, key) => {
        extractedHeaders[key] = val
      })
      setResponseHeaders(extractedHeaders)

      // Formatear JSON de respuesta
      const text = await res.text()
      try {
        const json = JSON.parse(text)
        setResponseBody(JSON.stringify(json, null, 2))
      } catch {
        setResponseBody(text)
      }
    } catch (err: any) {
      setResponseStatus(0)
      setResponseBody(`Error de red o conexión: ${err?.message || err}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-primary)', color: 'white', padding: '2rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <Link href="/dashboard" style={{ color: 'var(--color-purple-400)', fontSize: '0.875rem' }}>
                ← Volver al Dashboard
              </Link>
              <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
              <span className="badge badge-purple" style={{ fontSize: '0.75rem' }}>API REST v1 Playground</span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800 }}>
              Consola de Pruebas de API REST
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
              Prueba los endpoints en vivo contra el servidor Next.js y la base de datos de Supabase.
            </p>
          </div>
          <Link
            href="/docs/api/REST_API_SPEC.md"
            target="_blank"
            className="btn btn-outline"
            style={{ fontSize: '0.85rem' }}
          >
            📖 Ver Especificación OpenAPI
          </Link>
        </div>

        {/* Layout en 2 columnas */}
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.5rem', alignItems: 'start' }}>
          {/* Columna Izquierda: Selector de Endpoints */}
          <div className="glass-panel" style={{ padding: '1.25rem' }}>
            <h2 style={{ fontSize: '0.875rem', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '1rem', letterSpacing: '0.05em' }}>
              Endpoints Disponibles
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {ENDPOINTS.map((ep) => {
                const isSelected = selectedEndpoint.id === ep.id
                return (
                  <button
                    key={ep.id}
                    onClick={() => handleSelect(ep)}
                    style={{
                      textAlign: 'left',
                      padding: '0.875rem 1rem',
                      borderRadius: '0.75rem',
                      background: isSelected ? 'rgba(168,85,247,0.15)' : 'rgba(255,255,255,0.03)',
                      border: isSelected ? '1px solid var(--color-purple-500)' : '1px solid rgba(255,255,255,0.06)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '0.15rem 0.45rem',
                          borderRadius: '0.25rem',
                          background: ep.method === 'GET' ? 'rgba(59,130,246,0.2)' : 'rgba(16,185,129,0.2)',
                          color: ep.method === 'GET' ? '#60a5fa' : '#34d399',
                        }}
                      >
                        {ep.method}
                      </span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'white' }}>{ep.name}</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {ep.url}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Columna Derecha: Consola de Petición y Respuesta */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Petición */}
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{selectedEndpoint.name}</h3>
                  <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.2rem' }}>
                    {selectedEndpoint.description}
                  </p>
                </div>
                <span className="badge" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.75rem' }}>
                  Permiso: {selectedEndpoint.roleRequired}
                </span>
              </div>

              {/* Barra de URL y botón Enviar */}
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 1rem',
                    background: selectedEndpoint.method === 'GET' ? 'rgba(59,130,246,0.15)' : 'rgba(16,185,129,0.15)',
                    color: selectedEndpoint.method === 'GET' ? '#60a5fa' : '#34d399',
                    borderRadius: '0.5rem',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  {selectedEndpoint.method}
                </span>
                <input
                  type="text"
                  value={requestUrl}
                  onChange={(e) => setRequestUrl(e.target.value)}
                  className="input"
                  style={{ flex: 1, fontFamily: 'monospace', fontSize: '0.875rem' }}
                />
                <button
                  onClick={executeRequest}
                  disabled={loading}
                  className="btn btn-primary"
                  style={{ minWidth: 140, padding: '0.75rem 1.25rem' }}
                >
                  {loading ? 'Enviando...' : '▶ Enviar Request'}
                </button>
              </div>

              {/* Editor de Body si es POST/PATCH */}
              {['POST', 'PATCH', 'PUT'].includes(selectedEndpoint.method) && (
                <div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: '0.5rem' }}>
                    JSON Request Body:
                  </div>
                  <textarea
                    rows={8}
                    value={requestBody}
                    onChange={(e) => setRequestBody(e.target.value)}
                    className="input"
                    style={{
                      width: '100%',
                      fontFamily: 'Consolas, monospace',
                      fontSize: '0.85rem',
                      lineHeight: 1.5,
                      resize: 'vertical',
                    }}
                  />
                </div>
              )}
            </div>

            {/* Respuesta */}
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Respuesta del Servidor</h3>
                {responseStatus !== null && (
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    {responseTime !== null && (
                      <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
                        ⏱ {responseTime} ms
                      </span>
                    )}
                    <span
                      style={{
                        padding: '0.25rem 0.65rem',
                        borderRadius: '0.375rem',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        background:
                          responseStatus >= 200 && responseStatus < 300
                            ? 'rgba(16,185,129,0.2)'
                            : responseStatus === 401 || responseStatus === 403
                            ? 'rgba(245,158,11,0.2)'
                            : 'rgba(239,68,68,0.2)',
                        color:
                          responseStatus >= 200 && responseStatus < 300
                            ? '#34d399'
                            : responseStatus === 401 || responseStatus === 403
                            ? '#fbbf24'
                            : '#f87171',
                        border: '1px solid rgba(255,255,255,0.1)',
                      }}
                    >
                      Status: {responseStatus}
                    </span>
                  </div>
                )}
              </div>

              {/* Cabeceras de seguridad destacadas */}
              {responseHeaders['x-request-id'] && (
                <div
                  style={{
                    padding: '0.5rem 0.75rem',
                    background: 'rgba(255,255,255,0.02)',
                    borderRadius: '0.5rem',
                    border: '1px solid rgba(255,255,255,0.06)',
                    marginBottom: '1rem',
                    fontSize: '0.75rem',
                    display: 'flex',
                    gap: '1.5rem',
                    color: 'rgba(255,255,255,0.7)',
                    fontFamily: 'monospace',
                  }}
                >
                  <div>
                    <span style={{ color: 'var(--color-purple-400)' }}>X-Request-ID:</span> {responseHeaders['x-request-id']}
                  </div>
                  <div>
                    <span style={{ color: 'var(--color-purple-400)' }}>Security:</span> {responseHeaders['x-content-type-options']}
                  </div>
                </div>
              )}

              {/* Visor de JSON */}
              <pre
                style={{
                  background: 'rgba(0,0,0,0.4)',
                  padding: '1.25rem',
                  borderRadius: '0.75rem',
                  overflowX: 'auto',
                  fontSize: '0.85rem',
                  fontFamily: 'Consolas, monospace',
                  color: responseBody ? '#e2e8f0' : 'rgba(255,255,255,0.3)',
                  minHeight: 180,
                  border: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                {responseBody || '// Pulsa "Enviar Request" para observar la respuesta en tiempo real...'}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
