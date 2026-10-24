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

      {/* Security and Connected Services Status */}
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
          Estado de Integraciones & Seguridad
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Supabase */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '0.625rem', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: '#4ade80' }}>●</span>
                <span style={{ fontWeight: 600, color: 'white', fontSize: '0.95rem' }}>Base de Datos Supabase (PostgreSQL)</span>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.2rem' }}>
                Proyecto: sleisgocuwawjguoxkxy (aws-0-us-east-1) · 19 Tablas RLS Activas
              </div>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#4ade80', fontWeight: 700, background: 'rgba(74, 222, 128, 0.15)', padding: '0.25rem 0.6rem', borderRadius: '999px' }}>
              Conectado
            </span>
          </div>

          {/* Gemini */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '0.625rem', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: '#4ade80' }}>●</span>
                <span style={{ fontWeight: 600, color: 'white', fontSize: '0.95rem' }}>Google Gemini 2.0 Flash (Adaptador IA)</span>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.2rem' }}>
                Plan Gratuito Activo · Rate limiting con Token Bucket
              </div>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#4ade80', fontWeight: 700, background: 'rgba(74, 222, 128, 0.15)', padding: '0.25rem 0.6rem', borderRadius: '999px' }}>
              Operativo
            </span>
          </div>

          {/* API Security */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '0.625rem', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: '#c084fc' }}>🔒</span>
                <span style={{ fontWeight: 600, color: 'white', fontSize: '0.95rem' }}>Cabeceras de Seguridad & CORS</span>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.2rem' }}>
                X-Content-Type-Options: nosniff · X-Request-ID · Zod Validation
              </div>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#c084fc', fontWeight: 700, background: 'rgba(147, 51, 234, 0.15)', padding: '0.25rem 0.6rem', borderRadius: '999px' }}>
              Protegido
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
