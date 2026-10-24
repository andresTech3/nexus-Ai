'use client'

import { useState } from 'react'

interface Order {
  id: string
  orderNumber: string
  clientName: string
  amountCents: number
  currency: 'USD' | 'EUR'
  status: 'paid' | 'pending' | 'refunded'
  paymentMethod: string
  paidAt: string | null
  reference: string
}

const INITIAL_ORDERS: Order[] = []

const statusBadges = {
  paid: { label: 'Pagado', bg: 'rgba(74, 222, 128, 0.15)', text: '#4ade80', border: 'rgba(74, 222, 128, 0.3)' },
  pending: { label: 'Pendiente', bg: 'rgba(234, 179, 8, 0.15)', text: '#facc15', border: 'rgba(234, 179, 8, 0.3)' },
  refunded: { label: 'Reembolsado', bg: 'rgba(239, 68, 68, 0.15)', text: '#f87171', border: 'rgba(239, 68, 68, 0.3)' },
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [newOrder, setNewOrder] = useState({
    clientName: '',
    amount: 1500,
    paymentMethod: 'Transferencia Bancaria',
    reference: '',
  })

  const confirmedCents = orders.filter((o) => o.status === 'paid').reduce((sum, o) => sum + o.amountCents, 0)
  const pendingOrders = orders.filter((o) => o.status === 'pending')
  const pendingCents = pendingOrders.reduce((sum, o) => sum + o.amountCents, 0)

  const formatMoney = (cents: number, cur: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: cur,
      maximumFractionDigits: 0,
    }).format(cents / 100)
  }

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newOrder.clientName) return

    const created: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `ORD-2026-0${orders.length + 91}`,
      clientName: newOrder.clientName,
      amountCents: Math.round(newOrder.amount * 100),
      currency: 'USD',
      status: 'paid',
      paymentMethod: newOrder.paymentMethod,
      paidAt: 'Hoy',
      reference: newOrder.reference || `MANUAL-${Date.now().toString().slice(-6)}`,
    }

    setOrders([created, ...orders])
    setShowModal(false)
    setNewOrder({ clientName: '', amount: 1500, paymentMethod: 'Transferencia Bancaria', reference: '' })
  }

  return (
    <div id="orders-page">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, color: 'white', marginBottom: '0.375rem' }}>
            Órdenes & Control Financiero
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)' }}>
            Registro de cobros administrativos, pasarelas de prueba y conciliación de servicios entregados.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary"
          id="btn-record-payment"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <span>$</span> Registrar Pago Manual
        </button>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="metric-card">
          <div className="metric-label">Ingresos Confirmados</div>
          <div className="metric-value" style={{ color: '#4ade80' }}>{formatMoney(confirmedCents, 'USD')}</div>
          <div className="metric-change">Fondos conciliados</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Facturación por Cobrar</div>
          <div className="metric-value" style={{ color: '#facc15' }}>{formatMoney(pendingCents, 'USD')}</div>
          <div className="metric-change">{pendingOrders.length} {pendingOrders.length === 1 ? 'orden pendiente' : 'órdenes pendientes'}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Margen Operativo Bruto</div>
          <div className="metric-value" style={{ color: '#38bdf8' }}>{orders.length === 0 ? '100%' : '92.4%'}</div>
          <div className="metric-change">Infraestructura Free Tier</div>
        </div>
      </div>

      {/* Orders Table */}
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
              {['Nº Orden', 'Cliente', 'Importe', 'Método de Pago', 'Referencia TXN', 'Fecha de Pago', 'Estado'].map((h) => (
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
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '3.5rem 2rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem', opacity: 0.7 }}>💳</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f3f4f6', marginBottom: '0.35rem' }}>
                    No hay órdenes ni cobros registrados todavía
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginBottom: '1.25rem' }}>
                    Registra cobros administrativos, facturas pagadas o transferencias de clientes.
                  </div>
                  <button
                    onClick={() => setShowModal(true)}
                    className="btn btn-primary"
                    style={{ padding: '0.55rem 1.25rem', fontSize: '0.85rem' }}
                  >
                    + Registrar Pago
                  </button>
                </td>
              </tr>
            ) : (
              orders.map((ord) => {
                const badge = statusBadges[ord.status]
              return (
                <tr
                  key={ord.id}
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.15s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                >
                  <td style={{ padding: '1rem 1.5rem', color: 'white', fontWeight: 700, fontFamily: 'monospace' }}>
                    {ord.orderNumber}
                  </td>
                  <td style={{ padding: '1rem 1.5rem', color: 'white', fontWeight: 600 }}>
                    {ord.clientName}
                  </td>
                  <td style={{ padding: '1rem 1.5rem', color: '#4ade80', fontWeight: 700, fontSize: '0.95rem' }}>
                    {formatMoney(ord.amountCents, ord.currency)}
                  </td>
                  <td style={{ padding: '1rem 1.5rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>
                    {ord.paymentMethod}
                  </td>
                  <td style={{ padding: '1rem 1.5rem', color: 'var(--color-purple-400)', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                    {ord.reference}
                  </td>
                  <td style={{ padding: '1rem 1.5rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
                    {ord.paidAt || 'Pendiente'}
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
                </tr>
              )
            }))}
          </tbody>
        </table>
      </div>

      {/* Modal Registrar Pago */}
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
              maxWidth: 480,
              padding: '2rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white' }}>Registrar Pago Administrativo</h2>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '1.25rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRecordPayment}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.35rem' }}>Cliente</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. RetailMax S.A."
                  value={newOrder.clientName}
                  onChange={(e) => setNewOrder({ ...newOrder, clientName: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.8rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: 'white' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.35rem' }}>Importe Cobrado ($ USD)</label>
                  <input
                    type="number"
                    required
                    value={newOrder.amount}
                    onChange={(e) => setNewOrder({ ...newOrder, amount: parseFloat(e.target.value) || 0 })}
                    style={{ width: '100%', padding: '0.6rem 0.8rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: 'white' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.35rem' }}>Método de Pago</label>
                  <select
                    value={newOrder.paymentMethod}
                    onChange={(e) => setNewOrder({ ...newOrder, paymentMethod: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.8rem', background: '#12121c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: 'white' }}
                  >
                    <option value="Transferencia Bancaria">Transferencia Bancaria</option>
                    <option value="Stripe Sandbox">Stripe Sandbox (Test)</option>
                    <option value="Efectivo / Recibo">Efectivo / Recibo</option>
                    <option value="Cripto / USDT">Cripto / USDT</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.35rem' }}>Referencia de Transacción o Recibo</label>
                <input
                  type="text"
                  placeholder="Ej. REF-BANCO-83921"
                  value={newOrder.reference}
                  onChange={(e) => setNewOrder({ ...newOrder, reference: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.8rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: 'white' }}
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
                  className="btn btn-primary"
                  style={{ padding: '0.6rem 1.2rem' }}
                >
                  Confirmar Pago
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
