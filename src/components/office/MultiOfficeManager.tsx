'use client'

import React, { useState } from 'react'
import { useOfficeStore } from '@/lib/office/store'
import { TrafficMode, AgentId } from '@/types/office'
import { AGENT_DEFINITIONS } from '@/lib/office/agents/definitions'

export function MultiOfficeManager() {
  const store = useOfficeStore()
  const offices = Object.values(store.offices)
  const activeOfficeId = store.activeOfficeId

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showChangeProductModal, setShowChangeProductModal] = useState<string | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null)
  const [deleteConfirmName, setDeleteConfirmName] = useState('')

  // Create Form State
  const [newName, setNewName] = useState('')
  const [newProduct, setNewProduct] = useState('')
  const [newNiche, setNewNiche] = useState('')
  const [newTrafficMode, setNewTrafficMode] = useState<TrafficMode>('HYBRID')
  const [newTemplate, setNewTemplate] = useState<'nubae' | 'empty'>('empty')

  // Change Product Form State
  const [changeProductName, setChangeProductName] = useState('')
  const [changeProductNiche, setChangeProductNiche] = useState('')

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim() || !newProduct.trim()) return
    store.createOffice(newName, newProduct, newNiche || 'E-commerce D2C', newTrafficMode, newTemplate)
    setShowCreateModal(false)
    setNewName('')
    setNewProduct('')
    setNewNiche('')
  }

  const handleChangeProductSubmit = (officeId: string) => {
    if (!changeProductName.trim()) return
    store.changeProduct(officeId, {
      name: changeProductName,
      niche: changeProductNiche || 'E-commerce General',
    })
    setShowChangeProductModal(null)
    setChangeProductName('')
    setChangeProductNiche('')
  }

  const handleDeleteSubmit = (officeId: string) => {
    const office = store.offices[officeId]
    if (office && deleteConfirmName === office.name) {
      store.deleteOffice(officeId)
      setShowDeleteModal(null)
      setDeleteConfirmName('')
    }
  }

  return (
    <div
      style={{
        backgroundColor: '#18120e',
        border: '1px solid #3d2a1d',
        borderRadius: '12px',
        padding: '1.25rem',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      }}
    >
      {/* Title & Create Button */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.25rem',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <div>
          <span style={{ fontSize: '0.75rem', color: '#faae33', fontWeight: 700 }}>
            GESTIÓN MULTI-OFICINA INDEPENDIENTE
          </span>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', margin: 0 }}>
            Tus Oficinas Autónomas ({offices.length})
          </h2>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          style={{
            background: 'linear-gradient(135deg, #faae33, #d98216)',
            color: '#181008',
            border: 'none',
            borderRadius: '6px',
            padding: '0.55rem 1.1rem',
            fontSize: '0.82rem',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(250, 174, 51, 0.35)',
          }}
        >
          + Crear Nueva Oficina
        </button>
      </div>

      {/* Offices Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
        {offices.map((office) => {
          const isActive = office.id === activeOfficeId
          const isPowerOn = office.status === 'ON'
          const agentIds = Object.keys(AGENT_DEFINITIONS) as AgentId[]

          return (
            <div
              key={office.id}
              style={{
                backgroundColor: isActive ? '#241a13' : '#1b1410',
                border: `2px solid ${isActive ? '#faae33' : isPowerOn ? '#3d2a1d' : '#221a15'}`,
                borderRadius: '10px',
                padding: '1.1rem',
                position: 'relative',
                boxShadow: isActive ? '0 0 20px rgba(250, 174, 51, 0.15)' : 'none',
              }}
            >
              {/* Header of Card */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button
                    onClick={() => store.setActiveOffice(office.id)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: isActive ? '#faae33' : '#fff',
                      fontSize: '1rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      padding: 0,
                      textAlign: 'left',
                    }}
                  >
                    {office.name}
                  </button>
                  {isActive && (
                    <span
                      style={{
                        background: '#faae33',
                        color: '#181008',
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        padding: '1px 6px',
                        borderRadius: '4px',
                      }}
                    >
                      ACTIVA
                    </span>
                  )}
                </div>

                {/* ON / OFF Switch */}
                <button
                  onClick={() => store.toggleOfficePower(office.id)}
                  style={{
                    background: isPowerOn ? '#15803d' : '#3f3f46',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '20px',
                    padding: '3px 10px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                  title={isPowerOn ? 'Apagar oficina (dormir agentes)' : 'Encender oficina'}
                >
                  {isPowerOn ? '⚡ ON' : '💤 OFF'}
                </button>
              </div>

              {/* Product and Traffic Mode Info */}
              <div style={{ fontSize: '0.78rem', color: '#d1d5db', marginBottom: '0.6rem' }}>
                <div>
                  <span style={{ color: '#9ca3af' }}>Producto:</span> <strong>{office.product.name}</strong>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.35rem', alignItems: 'center' }}>
                  <span
                    style={{
                      background: '#2b1b11',
                      border: '1px solid #faae33',
                      color: '#faae33',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: '4px',
                    }}
                  >
                    MODO {office.trafficMode}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#9ca3af' }}>
                    {office.settings.market} • {office.settings.currency}
                  </span>
                </div>
              </div>

              {/* 11 Agent Status Dots */}
              <div style={{ marginBottom: '0.85rem' }}>
                <div style={{ fontSize: '0.68rem', color: '#9ca3af', marginBottom: '0.3rem' }}>
                  Estado de los 11 Empleados:
                </div>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  {agentIds.map((agId) => {
                    const state = office.agentStates[agId] || 'IDLE'
                    let dotColor = '#71717a'
                    if (state === 'ANALYZING') dotColor = '#38bdf8'
                    else if (state === 'GENERATING') dotColor = '#facc15'
                    else if (state === 'DONE') dotColor = '#34d399'
                    else if (state === 'NEEDS_APPROVAL') dotColor = '#f43f5e'
                    else if (state === 'VACANT') dotColor = '#27272a'

                    return (
                      <span
                        key={agId}
                        title={`${AGENT_DEFINITIONS[agId].name}: ${state}`}
                        style={{
                          width: 14,
                          height: 14,
                          borderRadius: '50%',
                          backgroundColor: dotColor,
                          display: 'inline-block',
                          border: '1px solid #18120e',
                        }}
                      />
                    )
                  })}
                </div>
              </div>

              {/* Card Actions Footer */}
              <div
                style={{
                  display: 'flex',
                  gap: '0.4rem',
                  borderTop: '1px solid #2e2017',
                  paddingTop: '0.65rem',
                  flexWrap: 'wrap',
                }}
              >
                <button
                  onClick={() => store.setActiveOffice(office.id)}
                  style={{
                    background: isActive ? '#faae33' : '#2b1b11',
                    color: isActive ? '#181008' : '#faae33',
                    border: '1px solid #faae33',
                    borderRadius: '4px',
                    padding: '0.3rem 0.6rem',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {isActive ? 'En Pantalla' : 'Seleccionar'}
                </button>

                <button
                  onClick={() => {
                    setShowChangeProductModal(office.id)
                    setChangeProductName(office.product.name)
                    setChangeProductNiche(office.product.niche)
                  }}
                  style={{
                    background: '#1d1510',
                    color: '#d1d5db',
                    border: '1px solid #3d2a1d',
                    borderRadius: '4px',
                    padding: '0.3rem 0.6rem',
                    fontSize: '0.72rem',
                    cursor: 'pointer',
                  }}
                >
                  Cambiar Producto
                </button>

                {office.productHistory.length > 0 && (
                  <button
                    onClick={() => store.undoProductChange(office.id)}
                    style={{
                      background: '#1d1510',
                      color: '#facc15',
                      border: '1px solid #facc15',
                      borderRadius: '4px',
                      padding: '0.3rem 0.6rem',
                      fontSize: '0.72rem',
                      cursor: 'pointer',
                    }}
                    title="Deshacer cambio de producto y restaurar anterior"
                  >
                    ↩ Deshacer
                  </button>
                )}

                <button
                  onClick={() => store.duplicateOffice(office.id)}
                  style={{
                    background: '#1d1510',
                    color: '#d1d5db',
                    border: '1px solid #3d2a1d',
                    borderRadius: '4px',
                    padding: '0.3rem 0.6rem',
                    fontSize: '0.72rem',
                    cursor: 'pointer',
                  }}
                  title="Duplicar esta oficina"
                >
                  Duplicar
                </button>

                {offices.length > 1 && (
                  <button
                    onClick={() => {
                      setShowDeleteModal(office.id)
                      setDeleteConfirmName('')
                    }}
                    style={{
                      background: '#1d1510',
                      color: '#ef4444',
                      border: '1px solid #7f1d1d',
                      borderRadius: '4px',
                      padding: '0.3rem 0.6rem',
                      fontSize: '0.72rem',
                      cursor: 'pointer',
                    }}
                    title="Eliminar oficina"
                  >
                    Eliminar
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* CREATE OFFICE MODAL */}
      {showCreateModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '520px',
              backgroundColor: '#1b1410',
              border: '2px solid #faae33',
              borderRadius: '12px',
              padding: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                Crear Nueva Oficina Autónoma
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#9ca3af', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.25rem' }}>
                  Nombre de la Oficina:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Oficina AuraTitanium Joyería"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: '#120d09',
                    border: '1px solid #4a3424',
                    borderRadius: '6px',
                    color: '#fff',
                    padding: '0.5rem',
                    fontSize: '0.85rem',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.25rem' }}>
                  Producto a Lanzar:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Anillo Inteligente de Titanio Cepillado"
                  value={newProduct}
                  onChange={(e) => setNewProduct(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: '#120d09',
                    border: '1px solid #4a3424',
                    borderRadius: '6px',
                    color: '#fff',
                    padding: '0.5rem',
                    fontSize: '0.85rem',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.25rem' }}>
                  Nicho de Mercado:
                </label>
                <input
                  type="text"
                  placeholder="Ej: Wellness & Joyería Biohacking"
                  value={newNiche}
                  onChange={(e) => setNewNiche(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: '#120d09',
                    border: '1px solid #4a3424',
                    borderRadius: '6px',
                    color: '#fff',
                    padding: '0.5rem',
                    fontSize: '0.85rem',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.25rem' }}>
                  Modo de Tráfico:
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {(['ADS', 'ORGANIC', 'HYBRID'] as TrafficMode[]).map((mode) => (
                    <button
                      type="button"
                      key={mode}
                      onClick={() => setNewTrafficMode(mode)}
                      style={{
                        flex: 1,
                        background: newTrafficMode === mode ? '#faae33' : '#241a14',
                        color: newTrafficMode === mode ? '#181008' : '#d1d5db',
                        border: `1px solid ${newTrafficMode === mode ? '#faae33' : '#4a3424'}`,
                        borderRadius: '6px',
                        padding: '0.45rem',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  style={{
                    background: 'transparent',
                    border: '1px solid #555',
                    color: '#9ca3af',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    background: 'linear-gradient(135deg, #faae33, #d98216)',
                    color: '#181008',
                    border: 'none',
                    padding: '0.5rem 1.25rem',
                    borderRadius: '6px',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  Crear Oficina
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CHANGE PRODUCT MODAL */}
      {showChangeProductModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '480px',
              backgroundColor: '#1b1410',
              border: '2px solid #faae33',
              borderRadius: '12px',
              padding: '1.5rem',
            }}
          >
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: '0 0 0.5rem 0' }}>
              Cambiar Producto de la Oficina
            </h3>
            <p style={{ fontSize: '0.78rem', color: '#9ca3af', marginBottom: '1rem' }}>
              Se guardará una instantánea del producto actual en el historial para que puedas deshacer en cualquier momento.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.25rem' }}>
                  Nuevo Producto:
                </label>
                <input
                  type="text"
                  value={changeProductName}
                  onChange={(e) => setChangeProductName(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: '#120d09',
                    border: '1px solid #4a3424',
                    borderRadius: '6px',
                    color: '#fff',
                    padding: '0.5rem',
                    fontSize: '0.85rem',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.25rem' }}>
                  Nuevo Nicho:
                </label>
                <input
                  type="text"
                  value={changeProductNiche}
                  onChange={(e) => setChangeProductNiche(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: '#120d09',
                    border: '1px solid #4a3424',
                    borderRadius: '6px',
                    color: '#fff',
                    padding: '0.5rem',
                    fontSize: '0.85rem',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button
                  onClick={() => setShowChangeProductModal(null)}
                  style={{
                    background: 'transparent',
                    border: '1px solid #555',
                    color: '#9ca3af',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                  }}
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleChangeProductSubmit(showChangeProductModal)}
                  style={{
                    background: '#faae33',
                    color: '#181008',
                    border: 'none',
                    padding: '0.5rem 1.25rem',
                    borderRadius: '6px',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  Confirmar Cambio
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '460px',
              backgroundColor: '#1b1410',
              border: '2px solid #ef4444',
              borderRadius: '12px',
              padding: '1.5rem',
            }}
          >
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ef4444', margin: '0 0 0.5rem 0' }}>
              Confirmar Eliminación de Oficina
            </h3>
            <p style={{ fontSize: '0.78rem', color: '#d1d5db', lineHeight: 1.5, marginBottom: '0.75rem' }}>
              Para evitar pérdidas accidentales, escribe el nombre exacto de la oficina:{' '}
              <strong style={{ color: '#faae33' }}>{store.offices[showDeleteModal]?.name}</strong>
            </p>

            <input
              type="text"
              placeholder="Escribe el nombre aquí..."
              value={deleteConfirmName}
              onChange={(e) => setDeleteConfirmName(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: '#120d09',
                border: '1px solid #7f1d1d',
                borderRadius: '6px',
                color: '#fff',
                padding: '0.5rem',
                fontSize: '0.85rem',
                marginBottom: '1rem',
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button
                onClick={() => setShowDeleteModal(null)}
                style={{
                  background: 'transparent',
                  border: '1px solid #555',
                  color: '#9ca3af',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                }}
              >
                Cancelar
              </button>
              <button
                disabled={deleteConfirmName !== store.offices[showDeleteModal]?.name}
                onClick={() => handleDeleteSubmit(showDeleteModal)}
                style={{
                  background: deleteConfirmName === store.offices[showDeleteModal]?.name ? '#dc2626' : '#555',
                  color: '#fff',
                  border: 'none',
                  padding: '0.5rem 1.25rem',
                  borderRadius: '6px',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  cursor: deleteConfirmName === store.offices[showDeleteModal]?.name ? 'pointer' : 'not-allowed',
                }}
              >
                Eliminar Permanentemente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
