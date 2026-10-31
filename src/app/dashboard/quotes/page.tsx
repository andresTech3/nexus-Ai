'use client'

import { useState, useEffect } from 'react'
import { ActionToast, ActionToastData } from '@/components/ui/ActionToast'

interface QuoteItem {
  id: string
  description: string
  quantity: number
  unit_price_cents: number
  total_price_cents: number
}

interface Quote {
  id: string
  quote_number: string
  client_id?: string | null
  client?: { name: string; company_name: string; email: string } | null
  total_cents: number
  currency: string
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired'
  created_at: string
  valid_until: string
  notes?: string | null
  items?: QuoteItem[]
}

interface ClientOption {
  id: string
  name: string
  company_name: string
}

const statusBadges: Record<string, { label: string; bg: string; text: string; border: string }> = {
  accepted: { label: 'Aceptada', bg: 'rgba(74, 222, 128, 0.15)', text: '#4ade80', border: 'rgba(74, 222, 128, 0.3)' },
  sent: { label: 'Enviada', bg: 'rgba(56, 189, 248, 0.15)', text: '#38bdf8', border: 'rgba(56, 189, 248, 0.3)' },
  draft: { label: 'Borrador', bg: 'rgba(255, 255, 255, 0.08)', text: 'rgba(255,255,255,0.6)', border: 'rgba(255, 255, 255, 0.15)' },
  rejected: { label: 'Rechazada', bg: 'rgba(239, 68, 68, 0.15)', text: '#f87171', border: 'rgba(239, 68, 68, 0.3)' },
  expired: { label: 'Vencida', bg: 'rgba(255, 255, 255, 0.05)', text: 'rgba(255,255,255,0.4)', border: 'rgba(255, 255, 255, 0.1)' },
}

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [clients, setClients] = useState<ClientOption[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [selectedClientId, setSelectedClientId] = useState<string>('')
  const [actionToast, setActionToast] = useState<ActionToastData | null>(null)
  const [newQuote, setNewQuote] = useState({
    clientName: '',
    serviceName: 'Despliegue de Chatbot RAG Multicanal',
    price: 3800,
    validDays: 15,
    notes: '',
  })

  // Cargar cotizaciones y clientes desde la base de datos
  useEffect(() => {
    async function loadData() {
      try {
        const [qRes, cRes] = await Promise.all([
          fetch('/api/v1/quotes?page=1&pageSize=50'),
          fetch('/api/v1/crm/clients?page=1&pageSize=100'),
        ])

        if (qRes.ok) {
          const qJson = await qRes.json()
          setQuotes(qJson.data || [])
        }
        if (cRes.ok) {
          const cJson = await cRes.json()
          setClients(cJson.data || [])
        }
      } catch (err) {
        console.error('Error cargando cotizaciones:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const totalCents = quotes.reduce((acc, q) => acc + (q.total_cents || 0), 0)
  const acceptedQuotes = quotes.filter((q) => q.status === 'accepted')
  const acceptanceRate = quotes.length > 0 ? `${((acceptedQuotes.length / quotes.length) * 100).toFixed(0)}%` : '0%'
  const sentQuotes = quotes.filter((q) => q.status === 'sent')
  const sentCents = sentQuotes.reduce((acc, q) => acc + (q.total_cents || 0), 0)

  const formatMoney = (cents: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      maximumFractionDigits: 0,
    }).format((cents || 0) / 100)
  }

  const handleCreateQuote = async (e: React.FormEvent) => {
    e.preventDefault()

    // 1. Validación de cliente
    if (!selectedClientId && !newQuote.clientName.trim()) {
      setActionToast({
        title: 'Cliente Requerido',
        problem: 'La cotización no tiene ningún cliente asignado.',
        actionRequired: 'Selecciona un cliente de la lista o escribe el nombre del cliente destinatario.',
        type: 'error',
      })
      return
    }

    // 2. Validación de servicio
    if (!newQuote.serviceName.trim() || newQuote.serviceName.trim().length < 2) {
      setActionToast({
        title: 'Servicio Obligatorio',
        problem: 'El concepto o servicio a cotizar no puede estar vacío.',
        actionRequired: 'Indica el nombre del paquete o servicio de desarrollo.',
        type: 'error',
      })
      return
    }

    // 3. Validación de precio numérico
    const priceNum = Number(newQuote.price)
    if (isNaN(priceNum) || priceNum <= 0) {
      setActionToast({
        title: 'Precio Inválido',
        problem: 'El importe de la cotización debe ser un número positivo mayor a 0.',
        actionRequired: 'Introduce un precio válido en USD (ejemplo: 2500).',
        type: 'error',
      })
      return
    }

    // 4. Validación de vigencia
    const validDaysNum = Number(newQuote.validDays)
    if (isNaN(validDaysNum) || validDaysNum < 1 || validDaysNum > 90) {
      setActionToast({
        title: 'Vigencia Inválida',
        problem: 'El periodo de vigencia debe estar entre 1 y 90 días.',
        actionRequired: 'Introduce un plazo entre 1 y 90 días laborables.',
        type: 'error',
      })
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        clientId: selectedClientId || undefined,
        clientName: selectedClientId
          ? clients.find((c) => c.id === selectedClientId)?.name || 'Cliente'
          : newQuote.clientName.trim(),
        serviceName: newQuote.serviceName.trim(),
        price: priceNum,
        currency: 'USD',
        validDays: validDaysNum,
        status: 'sent',
        notes: newQuote.notes ? newQuote.notes.trim() : undefined,
      }

      const res = await fetch('/api/v1/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        const json = await res.json()
        setQuotes([json.data, ...quotes])
        setShowModal(false)
        setNewQuote({ clientName: '', serviceName: 'Despliegue de Chatbot RAG Multicanal', price: 3800, validDays: 15, notes: '' })
        setSelectedClientId('')
        setActionToast({
          title: 'Cotización Emitida Exitosamente',
          problem: 'Ninguno. Cotización guardada en Supabase.',
          actionRequired: 'Puedes consultar el estado y el importe total en el resumen superior.',
          type: 'success',
        })
      } else {
        const errJson = await res.json().catch(() => ({}))
        setActionToast({
          title: 'Error al Emitir Cotización',
          problem: errJson.problem || errJson.message || 'Error en la base de datos.',
          actionRequired: errJson.actionRequired || 'Verifica los campos ingresados e intenta nuevamente.',
          type: 'error',
        })
      }
    } catch {
      setActionToast({
        title: 'Error de Red',
        problem: 'No se pudo conectar con el servidor para emitir la cotización.',
        actionRequired: 'Revisa tu conexión a internet y vuelve a intentar.',
        type: 'error',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleStatusChange = async (quoteId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/v1/quotes/${quoteId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (res.ok) {
        const json = await res.json()
        setQuotes(quotes.map((q) => (q.id === quoteId ? json.data : q)))
      }
    } catch (err) {
      console.error('Error al actualizar estado:', err)
    }
  }

  return (
    <div id="quotes-page">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, color: 'white', marginBottom: '0.375rem' }}>
            Propuestas & Cotizaciones
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)' }}>
            Emisión de propuestas comerciales para clientes con montos exactos y persistencia en Supabase.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary"
          id="btn-create-quote"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <span>+</span> Nueva Cotización
        </button>
      </div>

      {/* Summary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="metric-card">
          <div className="metric-label">Total Cotizado</div>
          <div className="metric-value">{formatMoney(totalCents)}</div>
          <div className="metric-change">{quotes.length} {quotes.length === 1 ? 'propuesta emitida' : 'propuestas emitidas'}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Tasa de Aceptación</div>
          <div className="metric-value" style={{ color: '#4ade80' }}>{acceptanceRate}</div>
          <div className="metric-change">{acceptedQuotes.length} aceptadas</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">En Negociación</div>
          <div className="metric-value" style={{ color: '#38bdf8' }}>{formatMoney(sentCents)}</div>
          <div className="metric-change">{sentQuotes.length} enviadas / en revisión</div>
        </div>
      </div>

      {/* Quotes Table */}
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
              {['Código', 'Cliente', 'Servicios Incluidos', 'Total', 'Válido Hasta', 'Estado', 'Acción'].map((h) => (
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
            {loading ? (
              <tr>
                <td colSpan={7} style={{ padding: '2.5rem', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
                  Cargando cotizaciones desde Supabase...
                </td>
              </tr>
            ) : quotes.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '3.5rem 2rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem', opacity: 0.7 }}>📄</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f3f4f6', marginBottom: '0.35rem' }}>
                    No tienes cotizaciones emitidas todavía
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginBottom: '1.25rem' }}>
                    Emite tu primera propuesta comercial con desglose de servicios de automatización e IA.
                  </div>
                  <button
                    onClick={() => setShowModal(true)}
                    className="btn btn-primary"
                    style={{ padding: '0.55rem 1.25rem', fontSize: '0.85rem' }}
                  >
                    + Nueva Cotización
                  </button>
                </td>
              </tr>
            ) : (
              quotes.map((q) => {
                const badge = statusBadges[q.status] || statusBadges.sent
                const clientName = q.client?.company_name || q.client?.name || 'Cliente sin asignar'
                const serviceDescription = q.items?.[0]?.description || 'Servicios de Automatización'

                return (
                  <tr
                    key={q.id}
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.15s' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                  >
                    <td style={{ padding: '1rem 1.5rem', color: '#faae33', fontWeight: 700, fontSize: '0.85rem' }}>
                      {q.quote_number}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', color: 'white', fontWeight: 600, fontSize: '0.9rem' }}>
                      {clientName}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>
                      {serviceDescription}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', color: '#4ade80', fontWeight: 700, fontSize: '0.95rem' }}>
                      {formatMoney(q.total_cents, q.currency)}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem' }}>
                      {q.valid_until || '15 días'}
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '999px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          background: badge.bg,
                          color: badge.text,
                          border: `1px solid ${badge.border}`,
                        }}
                      >
                        {badge.label}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <select
                        value={q.status}
                        onChange={(e) => handleStatusChange(q.id, e.target.value)}
                        style={{
                          background: '#12121c',
                          border: '1px solid rgba(255,255,255,0.15)',
                          borderRadius: '0.375rem',
                          color: 'rgba(255,255,255,0.8)',
                          fontSize: '0.75rem',
                          padding: '0.3rem 0.5rem',
                          cursor: 'pointer',
                        }}
                      >
                        <option value="draft">Borrador</option>
                        <option value="sent">Enviada</option>
                        <option value="accepted">✓ Aceptada</option>
                        <option value="rejected">✕ Rechazada</option>
                      </select>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Crear Cotización */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
          }}
        >
          <div
            style={{
              background: '#0d0d14',
              border: '1px solid rgba(147, 51, 234, 0.3)',
              borderRadius: '1rem',
              width: '100%',
              maxWidth: 520,
              padding: '2rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white' }}>Nueva Cotización Comercial</h2>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '1.25rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateQuote}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.35rem' }}>
                  Cliente Destinatario *
                </label>
                {clients.length > 0 && (
                  <select
                    value={selectedClientId}
                    onChange={(e) => {
                      setSelectedClientId(e.target.value)
                      if (e.target.value) setNewQuote({ ...newQuote, clientName: '' })
                    }}
                    style={{ width: '100%', padding: '0.6rem 0.8rem', background: '#12121c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: 'white', marginBottom: '0.5rem' }}
                  >
                    <option value="">-- Seleccionar de clientes CRM o escribir nuevo --</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} {c.company_name ? `(${c.company_name})` : ''}
                      </option>
                    ))}
                  </select>
                )}

                {!selectedClientId && (
                  <input
                    type="text"
                    required={!selectedClientId}
                    placeholder="Ej. Inmobiliaria Costa Blanca S.L."
                    value={newQuote.clientName}
                    onChange={(e) => setNewQuote({ ...newQuote, clientName: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.8rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: 'white' }}
                  />
                )}
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.35rem' }}>
                  Servicio Principal de IA
                </label>
                <select
                  value={newQuote.serviceName}
                  onChange={(e) => {
                    const s = e.target.value
                    let p = 3800
                    if (s.includes('Workflows')) p = 4500
                    if (s.includes('Autónomos')) p = 6200
                    if (s.includes('Auditoría')) p = 1500
                    setNewQuote({ ...newQuote, serviceName: s, price: p })
                  }}
                  style={{ width: '100%', padding: '0.6rem 0.8rem', background: '#12121c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: 'white' }}
                >
                  <option value="Despliegue de Chatbot RAG Multicanal">Despliegue de Chatbot RAG Multicanal ($3,800)</option>
                  <option value="Automatización de Workflows y CRM (n8n)">Automatización de Workflows y CRM ($4,500)</option>
                  <option value="Desarrollo de Agentes Autónomos Personalizados">Desarrollo de Agentes Autónomos ($6,200)</option>
                  <option value="Auditoría de Procesos y Consultoría de IA">Auditoría y Consultoría de IA ($1,500)</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.35rem' }}>Precio Total (USD)</label>
                  <input
                    type="number"
                    step="100"
                    required
                    value={newQuote.price}
                    onChange={(e) => setNewQuote({ ...newQuote, price: Number(e.target.value) })}
                    style={{ width: '100%', padding: '0.6rem 0.8rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: 'white' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.35rem' }}>Validez de la Oferta</label>
                  <select
                    value={newQuote.validDays}
                    onChange={(e) => setNewQuote({ ...newQuote, validDays: Number(e.target.value) })}
                    style={{ width: '100%', padding: '0.6rem 0.8rem', background: '#12121c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: 'white' }}
                  >
                    <option value={7}>7 días</option>
                    <option value={15}>15 días</option>
                    <option value={30}>30 días</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.35rem' }}>Notas y Condiciones</label>
                <textarea
                  rows={2}
                  placeholder="Ej. Pago del 50% al inicio y 50% tras entrega y puesta en producción..."
                  value={newQuote.notes}
                  onChange={(e) => setNewQuote({ ...newQuote, notes: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.8rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: 'white', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{ padding: '0.6rem 1.2rem', borderRadius: '0.5rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white', cursor: 'pointer' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary"
                  style={{ padding: '0.6rem 1.2rem' }}
                >
                  {submitting ? 'Emitiendo...' : 'Emitir Cotización'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Ventana emergente rectangular abajo a la derecha */}
      <ActionToast toast={actionToast} onClose={() => setActionToast(null)} />
    </div>
  )
}
