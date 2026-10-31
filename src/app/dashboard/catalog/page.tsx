'use client'

import { useState } from 'react'

interface ServiceItem {
  id: string
  name: string
  category: string
  priceCents: number
  currency: 'USD' | 'EUR'
  estimatedDays: number
  description: string
  features: string[]
}

const INITIAL_SERVICES: ServiceItem[] = []

export default function CatalogPage() {
  const [services, setServices] = useState<ServiceItem[]>(INITIAL_SERVICES)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [newService, setNewService] = useState({
    name: '',
    category: 'Desarrollo IA',
    price: 2500,
    estimatedDays: 10,
    description: '',
  })

  const formatPrice = (cents: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(cents / 100)
  }

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newService.name) return
    const created: ServiceItem = {
      id: `srv-${Date.now()}`,
      name: newService.name,
      category: newService.category,
      priceCents: Math.round(newService.price * 100),
      currency: 'USD',
      estimatedDays: newService.estimatedDays,
      description: newService.description || 'Servicio personalizado de la agencia.',
      features: ['Personalización a medida', 'Garantía de funcionamiento'],
    }
    setServices([created, ...services])
    setShowModal(false)
    setNewService({ name: '', category: 'Desarrollo IA', price: 2500, estimatedDays: 10, description: '' })
  }

  return (
    <div id="catalog-page">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, color: 'white', marginBottom: '0.375rem' }}>
            Catálogo de Servicios & Tarifas
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)' }}>
            Paquetes empaquetados de consultoría, agentes IA y automatización para cotizaciones rápidas.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary"
          id="btn-add-service"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <span>+</span> Añadir Servicio
        </button>
      </div>

      {/* Services Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.5rem' }}>
        {services.length === 0 ? (
          <div
            style={{
              gridColumn: '1 / -1',
              padding: '3.5rem 2rem',
              textAlign: 'center',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px dashed rgba(147, 51, 234, 0.25)',
              borderRadius: '1rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ width: 44, height: 44, margin: '0 auto 1rem auto', borderRadius: '8px', backgroundColor: '#18181b', border: '1px solid #27272a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#faae33' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                <line x1="12" y1="22.08" x2="12" y2="12"></line>
              </svg>
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f3f4f6', marginBottom: '0.5rem' }}>
              No tienes servicios registrados en el catálogo todavía
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', maxWidth: '420px', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              Crea tu oferta de paquetes, desarrollos de IA o consultorías para poder incluirlos de forma ágil en propuestas comerciales.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="btn btn-primary"
              style={{ padding: '0.65rem 1.4rem', fontSize: '0.875rem' }}
            >
              + Agregar Primer Servicio
            </button>
          </div>
        ) : (
          services.map((srv) => (
          <div
            key={srv.id}
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(147, 51, 234, 0.15)',
              borderRadius: '1rem',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              transition: 'border-color 0.2s, transform 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(147, 51, 234, 0.4)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(147, 51, 234, 0.15)'
              e.currentTarget.style.transform = 'none'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '0.2rem 0.6rem',
                  borderRadius: '999px',
                  background: 'rgba(147, 51, 234, 0.15)',
                  color: '#c084fc',
                  border: '1px solid rgba(147, 51, 234, 0.3)',
                }}
              >
                {srv.category}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>
                Plazo: {srv.estimatedDays} días
              </span>
            </div>

            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'white', marginBottom: '0.5rem' }}>
              {srv.name}
            </h3>

            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#4ade80', marginBottom: '1rem', fontFamily: 'var(--font-display)' }}>
              {formatPrice(srv.priceCents, srv.currency)}
            </div>

            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5, marginBottom: '1.25rem', flex: 1 }}>
              {srv.description}
            </p>

            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: '0.4rem', fontWeight: 700 }}>
                Incluye en la entrega:
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {srv.features.map((f, i) => (
                  <li key={i} style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <button
                onClick={() => alert(`Servicio "${srv.name}" seleccionado. Puedes incluirlo al crear una nueva cotización en la sección Cotizaciones.`)}
                style={{
                  width: '100%',
                  padding: '0.6rem',
                  borderRadius: '0.5rem',
                  background: 'rgba(147, 51, 234, 0.15)',
                  border: '1px solid rgba(147, 51, 234, 0.3)',
                  color: '#e9d5ff',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
              >
                + Usar en Cotización
              </button>
            </div>
          </div>
        )))}
      </div>

      {/* Modal Añadir Servicio */}
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
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white' }}>Nuevo Servicio del Catálogo</h2>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', borderRadius: '4px' }}
                aria-label="Cerrar modal"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreateService}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.35rem' }}>Nombre del Servicio</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Integración de Agente para CRM Salesforce"
                  value={newService.name}
                  onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.8rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: 'white' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.35rem' }}>Precio Base ($ USD)</label>
                  <input
                    type="number"
                    required
                    min="100"
                    step="50"
                    value={newService.price}
                    onChange={(e) => setNewService({ ...newService, price: parseFloat(e.target.value) || 0 })}
                    style={{ width: '100%', padding: '0.6rem 0.8rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: 'white' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.35rem' }}>Plazo Estimado (Días)</label>
                  <input
                    type="number"
                    min="1"
                    value={newService.estimatedDays}
                    onChange={(e) => setNewService({ ...newService, estimatedDays: parseInt(e.target.value) || 1 })}
                    style={{ width: '100%', padding: '0.6rem 0.8rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: 'white' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.35rem' }}>Descripción del Alcance</label>
                <textarea
                  rows={3}
                  placeholder="Detalles de los entregables y alcance técnico..."
                  value={newService.description}
                  onChange={(e) => setNewService({ ...newService, description: e.target.value })}
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
                  className="btn btn-primary"
                  style={{ padding: '0.6rem 1.2rem' }}
                >
                  Guardar Servicio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
