'use client'

import { useState, useEffect } from 'react'
import { ActionToast, ActionToastData } from '@/components/ui/ActionToast'

interface Client {
  id: string
  name: string
  company_name: string
  email: string
  phone: string | null
  status: 'prospect' | 'active' | 'churned'
  created_at?: string
}

const statusBadges: Record<string, { label: string; bg: string; text: string; border: string }> = {
  active: { label: 'Activo', bg: 'rgba(74, 222, 128, 0.15)', text: '#4ade80', border: 'rgba(74, 222, 128, 0.3)' },
  prospect: { label: 'Prospecto', bg: 'rgba(168, 85, 247, 0.15)', text: '#c084fc', border: 'rgba(168, 85, 247, 0.3)' },
  churned: { label: 'Inactivo', bg: 'rgba(255, 255, 255, 0.08)', text: 'rgba(255,255,255,0.5)', border: 'rgba(255, 255, 255, 0.15)' },
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [search, setSearch] = useState<string>('')
  const [showModal, setShowModal] = useState<boolean>(false)
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [actionToast, setActionToast] = useState<ActionToastData | null>(null)
  const [newClient, setNewClient] = useState({
    name: '',
    companyName: '',
    email: '',
    phone: '',
    status: 'prospect' as const,
  })

  // Cargar clientes desde la API REST v1
  useEffect(() => {
    async function fetchClients() {
      try {
        const res = await fetch('/api/v1/crm/clients?page=1&pageSize=50')
        if (res.ok) {
          const json = await res.json()
          setClients(json.data || [])
        } else {
          setClients([])
        }
      } catch (err) {
        console.error('Error fetching clients:', err)
        setClients([])
      } finally {
        setLoading(false)
      }
    }
    fetchClients()
  }, [])

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault()

    // 1. VALIDACIÓN PREVENTIVA: Correo electrónico obligatorio primero
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!newClient.email || !emailRegex.test(newClient.email.trim())) {
      setActionToast({
        title: 'Correo Electrónico Obligatorio',
        problem: !newClient.email.trim()
          ? 'El campo de correo electrónico está vacío.'
          : 'El formato de correo no es válido (debe tener estructura nombre@dominio.com).',
        actionRequired: 'Por favor, introduce primero un correo electrónico válido antes de guardar el cliente.',
        type: 'error',
      })
      return
    }

    // 2. Validación de nombre
    if (!newClient.name.trim() || newClient.name.trim().length < 2) {
      setActionToast({
        title: 'Nombre de Contacto Obligatorio',
        problem: 'El nombre del cliente está vacío o tiene menos de 2 caracteres.',
        actionRequired: 'Escribe el nombre y apellido del contacto comercial.',
        type: 'error',
      })
      return
    }

    // 3. Validación de empresa
    if (!newClient.companyName.trim()) {
      setActionToast({
        title: 'Empresa Obligatoria',
        problem: 'No se indicó la empresa u organización del cliente.',
        actionRequired: 'Escribe el nombre comercial o razón social de la empresa.',
        type: 'error',
      })
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/v1/crm/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClient),
      })

      if (res.ok) {
        const json = await res.json()
        setClients([json.data, ...clients])
        setShowModal(false)
        setNewClient({ name: '', companyName: '', email: '', phone: '', status: 'prospect' })
        setActionToast({
          title: 'Cliente Guardado Exitosamente',
          problem: 'Ninguno. Datos validados correctamente en Supabase.',
          actionRequired: 'El nuevo contacto ya está disponible en tu CRM para asignarle cotizaciones o proyectos.',
          type: 'success',
        })
      } else {
        const errJson = await res.json().catch(() => ({}))
        setActionToast({
          title: 'Error al Guardar Cliente',
          problem: errJson.problem || errJson.message || 'Error en la base de datos.',
          actionRequired: errJson.actionRequired || 'Verifica que el correo no esté duplicado e intenta nuevamente.',
          type: 'error',
        })
      }
    } catch {
      setActionToast({
        title: 'Error de Red',
        problem: 'No se pudo conectar con el servidor para guardar el cliente.',
        actionRequired: 'Revisa tu conexión a internet y vuelve a intentar.',
        type: 'error',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.company_name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div id="clients-page">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, color: 'white', marginBottom: '0.375rem' }}>
            Directorio de Clientes & CRM
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)' }}>
            Base de datos de contactos, prospectos y empresas con aislamiento multi-inquilino.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary"
          id="btn-create-client"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <span>+</span> Nuevo Cliente
        </button>
      </div>

      {/* Search and summary */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          padding: '1rem',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(147,51,234,0.15)',
          borderRadius: '0.75rem',
        }}
      >
        <input
          type="text"
          placeholder="Buscar cliente, empresa o email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '0.5rem',
            padding: '0.5rem 0.875rem',
            color: 'white',
            fontSize: '0.85rem',
            width: '320px',
            outline: 'none',
          }}
        />
        <div style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.5)' }}>
          Total registrados: <strong style={{ color: 'white' }}>{clients.length}</strong>
        </div>
      </div>

      {/* Clients Table */}
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
              {['Contacto', 'Empresa', 'Email', 'Teléfono', 'Estado'].map((h) => (
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
                <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
                  Cargando clientes de la base de datos...
                </td>
              </tr>
            ) : filteredClients.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '3.5rem 2rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem', opacity: 0.7 }}>👥</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f3f4f6', marginBottom: '0.35rem' }}>
                    {clients.length === 0 ? 'No tienes clientes registrados todavía' : 'No se encontraron clientes con esa búsqueda'}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginBottom: '1.25rem' }}>
                    {clients.length === 0
                      ? 'Agrega tu primer cliente o prospecto para comenzar a gestionar proyectos y cotizaciones.'
                      : 'Intenta con otro nombre, empresa o email.'}
                  </div>
                  {clients.length === 0 && (
                    <button
                      onClick={() => setShowModal(true)}
                      className="btn btn-primary"
                      style={{ padding: '0.55rem 1.25rem', fontSize: '0.85rem' }}
                    >
                      + Nuevo Cliente
                    </button>
                  )}
                </td>
              </tr>
            ) : (
              filteredClients.map((client) => {
                const badge = statusBadges[client.status] || statusBadges.prospect
                return (
                  <tr
                    key={client.id}
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.15s' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                  >
                    <td style={{ padding: '1rem 1.5rem', color: 'white', fontWeight: 600, fontSize: '0.9rem' }}>
                      {client.name}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', color: 'var(--color-purple-400)', fontSize: '0.875rem' }}>
                      {client.company_name}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>
                      {client.email}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
                      {client.phone || '—'}
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
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Crear Cliente */}
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
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white' }}>Registrar Nuevo Cliente</h2>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '1.25rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateClient}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.35rem' }}>Nombre de Contacto</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Roberto Martínez"
                  value={newClient.name}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.8rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: 'white' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.35rem' }}>Empresa</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Logística Global S.A."
                  value={newClient.companyName}
                  onChange={(e) => setNewClient({ ...newClient, companyName: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.8rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: 'white' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.35rem' }}>Correo Electrónico</label>
                  <input
                    type="email"
                    required
                    placeholder="contacto@empresa.com"
                    value={newClient.email}
                    onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.8rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: 'white' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.35rem' }}>Teléfono / WhatsApp</label>
                  <input
                    type="tel"
                    placeholder="+34 600..."
                    value={newClient.phone}
                    onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.8rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: 'white' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.35rem' }}>Estado Inicial</label>
                <select
                  value={newClient.status}
                  onChange={(e) => setNewClient({ ...newClient, status: e.target.value as any })}
                  style={{ width: '100%', padding: '0.6rem 0.8rem', background: '#12121c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: 'white' }}
                >
                  <option value="prospect">Prospecto</option>
                  <option value="active">Activo</option>
                  <option value="churned">Inactivo</option>
                </select>
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
                  {submitting ? 'Guardando...' : 'Guardar Cliente'}
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
