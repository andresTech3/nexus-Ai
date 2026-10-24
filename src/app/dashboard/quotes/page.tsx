'use client'

import { useState } from 'react'

interface Quote {
  id: string
  quoteNumber: string
  clientName: string
  totalCents: number
  status: 'draft' | 'sent' | 'accepted' | 'rejected'
  createdAt: string
  validUntil: string
  items: { name: string; amountCents: number }[]
}

const INITIAL_QUOTES: Quote[] = []

const statusBadges = {
  accepted: { label: 'Aceptada', bg: 'rgba(74, 222, 128, 0.15)', text: '#4ade80', border: 'rgba(74, 222, 128, 0.3)' },
  sent: { label: 'Enviada al Cliente', bg: 'rgba(56, 189, 248, 0.15)', text: '#38bdf8', border: 'rgba(56, 189, 248, 0.3)' },
  draft: { label: 'Borrador', bg: 'rgba(255, 255, 255, 0.08)', text: 'rgba(255,255,255,0.6)', border: 'rgba(255, 255, 255, 0.15)' },
  rejected: { label: 'Rechazada', bg: 'rgba(239, 68, 68, 0.15)', text: '#f87171', border: 'rgba(239, 68, 68, 0.3)' },
}

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>(INITIAL_QUOTES)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [newQuote, setNewQuote] = useState({
    clientName: '',
    serviceName: 'Despliegue de Chatbot RAG Multicanal',
    price: 3800,
    validDays: 15,
  })

  const totalCents = quotes.reduce((acc, q) => acc + q.totalCents, 0)
  const acceptedQuotes = quotes.filter((q) => q.status === 'accepted')
  const acceptanceRate = quotes.length > 0 ? `${((acceptedQuotes.length / quotes.length) * 100).toFixed(0)}%` : '0%'
  const sentQuotes = quotes.filter((q) => q.status === 'sent')
  const sentCents = sentQuotes.reduce((acc, q) => acc + q.totalCents, 0)

  const formatMoney = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(cents / 100)
  }

  const handleCreateQuote = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newQuote.clientName) return

    const num = `COT-2026-00${quotes.length + 1}`
    const cents = Math.round(newQuote.price * 100)
    const created: Quote = {
      id: `q-${Date.now()}`,
      quoteNumber: num,
      clientName: newQuote.clientName,
      totalCents: cents,
      status: 'sent',
      createdAt: 'Hoy',
      validUntil: 'En 15 días',
      items: [{ name: newQuote.serviceName, amountCents: cents }],
    }
    setQuotes([created, ...quotes])
    setShowModal(false)
    setNewQuote({ clientName: '', serviceName: 'Despliegue de Chatbot RAG Multicanal', price: 3800, validDays: 15 })
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
            Emisión de propuestas comerciales para clientes con desglose de servicios y montos exactos.
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
          <div className="metric-change">{sentQuotes.length} en revisión</div>
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
            {quotes.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '3.5rem 2rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem', opacity: 0.7 }}>📄</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f3f4f6', marginBottom: '0.35rem' }}>
                    No tienes cotizaciones registradas todavía
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginBottom: '1.25rem' }}>
                    Emite propuestas comerciales formales con desglose de servicios y montos para tus clientes.
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
                const badge = statusBadges[q.status]
              return (
                <tr
                  key={q.id}
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.15s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                >
                  <td style={{ padding: '1rem 1.5rem', color: 'white', fontWeight: 700, fontFamily: 'monospace' }}>
                    {q.quoteNumber}
                  </td>
                  <td style={{ padding: '1rem 1.5rem', color: 'white', fontWeight: 600 }}>
                    {q.clientName}
                  </td>
                  <td style={{ padding: '1rem 1.5rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>
                    {q.items.map((i) => i.name).join(', ')}
                  </td>
                  <td style={{ padding: '1rem 1.5rem', color: '#4ade80', fontWeight: 700, fontSize: '0.95rem' }}>
                    {formatMoney(q.totalCents)}
                  </td>
                  <td style={{ padding: '1rem 1.5rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
                    {q.validUntil}
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
                    <button
                      onClick={() => alert(`Enviando cotización ${q.quoteNumber} a ${q.clientName}...`)}
                      style={{
                        background: 'none',
                        border: '1px solid rgba(147, 51, 234, 0.3)',
                        borderRadius: '0.35rem',
                        color: 'var(--color-purple-400)',
                        fontSize: '0.75rem',
                        padding: '0.3rem 0.6rem',
                        cursor: 'pointer',
                      }}
                    >
                      PDF / Enviar
                    </button>
                  </td>
                </tr>
              )
            }))}
          </tbody>
        </table>
      </div>

      {/* Modal Nueva Cotización */}
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
              maxWidth: 500,
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
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.35rem' }}>Nombre del Cliente / Empresa</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Acme Corp o RetailMax"
                  value={newQuote.clientName}
                  onChange={(e) => setNewQuote({ ...newQuote, clientName: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.8rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: 'white' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.35rem' }}>Servicio Principal</label>
                <select
                  value={newQuote.serviceName}
                  onChange={(e) => setNewQuote({ ...newQuote, serviceName: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.8rem', background: '#12121c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: 'white' }}
                >
                  <option value="Despliegue de Chatbot RAG Multicanal">Despliegue de Chatbot RAG Multicanal ($3,800)</option>
                  <option value="Auditoría & Plan de Automatización con IA">Auditoría & Plan de Automatización con IA ($1,500)</option>
                  <option value="Sistema Automatizado de Captura y Calificación">Sistema Automatizado de Captura y Calificación ($2,900)</option>
                  <option value="Mantenimiento Mensual y Cuota de Tokens">Mantenimiento Mensual ($850/mes)</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.35rem' }}>Total Pactado ($ USD)</label>
                  <input
                    type="number"
                    required
                    value={newQuote.price}
                    onChange={(e) => setNewQuote({ ...newQuote, price: parseFloat(e.target.value) || 0 })}
                    style={{ width: '100%', padding: '0.6rem 0.8rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: 'white' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.35rem' }}>Validez de la Oferta</label>
                  <select
                    value={newQuote.validDays}
                    onChange={(e) => setNewQuote({ ...newQuote, validDays: parseInt(e.target.value) || 15 })}
                    style={{ width: '100%', padding: '0.6rem 0.8rem', background: '#12121c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: 'white' }}
                  >
                    <option value={7}>7 Días</option>
                    <option value={15}>15 Días</option>
                    <option value={30}>30 Días</option>
                  </select>
                </div>
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
                  className="btn btn-primary"
                  style={{ padding: '0.6rem 1.2rem' }}
                >
                  Generar Cotización
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
