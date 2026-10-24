'use client'

import { useState } from 'react'

export default function SettingsPage() {
  const [orgName, setOrgName] = useState('Andrestech AI')
  const [slug, setSlug] = useState('andrestech-ai')
  const [saveToast, setSaveToast] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaveToast(true)
    setTimeout(() => setSaveToast(false), 3000)
  }

  return (
    <div id="settings-page" style={{ maxWidth: 900 }}>
      {/* Toast Alert */}
      {saveToast && (
        <div
          style={{
            position: 'fixed',
            top: '1.5rem',
            right: '1.5rem',
            background: 'rgba(16, 185, 129, 0.95)',
            color: 'white',
            padding: '0.875rem 1.5rem',
            borderRadius: '0.75rem',
            boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
            zIndex: 9999,
            fontSize: '0.9rem',
            fontWeight: 600,
          }}
        >
          ✓ Configuración guardada correctamente
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, color: 'white', marginBottom: '0.375rem' }}>
          Configuración de la Organización
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)' }}>
          Ajustes de identidad multi-inquilino, credenciales de entorno y gestión de accesos.
        </p>
      </div>

      {/* Organization Details Form */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(147, 51, 234, 0.15)',
          borderRadius: '1rem',
          padding: '2rem',
          marginBottom: '2rem',
        }}
      >
        <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'white', marginBottom: '1.25rem' }}>
          Datos de la Empresa / Agencia
        </h2>

        <form onSubmit={handleSave}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.4rem' }}>
                Nombre de la Organización
              </label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                style={{ width: '100%', padding: '0.65rem 0.85rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: 'white', outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.4rem' }}>
                Identificador Slug (Subdominio / URL)
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                style={{ width: '100%', padding: '0.65rem 0.85rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: 'white', outline: 'none' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary" style={{ padding: '0.6rem 1.5rem' }}>
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>

      {/* Preferencias de Negocio y Operaciones */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(147, 51, 234, 0.15)',
          borderRadius: '1rem',
          padding: '2rem',
          marginBottom: '2rem',
        }}
      >
        <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'white', marginBottom: '1.25rem' }}>
          Preferencias Operativas
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.4rem' }}>
              Moneda Predeterminada de Cotización
            </label>
            <select
              defaultValue="USD"
              style={{ width: '100%', padding: '0.65rem 0.85rem', background: '#12121c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: 'white', outline: 'none' }}
            >
              <option value="USD">USD ($) — Dólar Estadounidense</option>
              <option value="EUR">EUR (€) — Euro</option>
              <option value="COP">COP ($) — Peso Colombiano</option>
              <option value="MXN">MXN ($) — Peso Mexicano</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.4rem' }}>
              Zona Horaria
            </label>
            <select
              defaultValue="America/Bogota"
              style={{ width: '100%', padding: '0.65rem 0.85rem', background: '#12121c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: 'white', outline: 'none' }}
            >
              <option value="America/Bogota">GMT-5 (Bogotá, Lima, Quito)</option>
              <option value="America/Mexico_City">GMT-6 (Ciudad de México)</option>
              <option value="America/Argentina/Buenos_Aires">GMT-3 (Buenos Aires, Santiago)</option>
              <option value="Europe/Madrid">GMT+1 (Madrid, Barcelona)</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="checkbox"
            id="notify-leads"
            defaultChecked
            style={{ width: 16, height: 16, accentColor: 'var(--color-purple-500)', cursor: 'pointer' }}
          />
          <label htmlFor="notify-leads" style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }}>
            Recibir notificaciones por correo electrónico al recibir un nuevo cliente o lead calificado
          </label>
        </div>
      </div>
    </div>
  )
}
