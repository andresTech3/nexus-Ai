'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ConnectionsManager } from '@/components/office/ConnectionsManager'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'connectors' | 'organization'>('connectors')
  const [orgName, setOrgName] = useState('')
  const [slug, setSlug] = useState('')
  const [saveToast, setSaveToast] = useState(false)

  useEffect(() => {
    async function loadOrg() {
      try {
        const supabase = createClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (user) {
          const comp = user.user_metadata?.company || ''
          setOrgName(comp)
          setSlug(comp.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))
        }
      } catch (err) {
        console.error('Error loading org settings:', err)
      }
    }
    loadOrg()
  }, [])

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaveToast(true)
    setTimeout(() => setSaveToast(false), 3000)
  }

  return (
    <div id="settings-page" style={{ maxWidth: 1200, margin: '0 auto', paddingBottom: '3rem' }}>
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
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
          <span style={{ fontSize: '1.5rem' }}>⚙️</span>
          <h1
            style={{
              fontFamily: 'var(--font-display, inherit)',
              fontSize: '1.75rem',
              fontWeight: 800,
              color: 'white',
              margin: 0,
            }}
          >
            Configuración & Conectores IA
          </h1>
        </div>
        <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', margin: 0 }}>
          Conecta tus modelos de IA favoritos (Claude, ChatGPT, DeepSeek, IA Código Abierto o FreeLLMAPI) para alimentar la oficina de 11 agentes de dropshipping.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '1px solid #33241b',
          marginBottom: '1.75rem',
          paddingBottom: '0.25rem',
        }}
      >
        <button
          onClick={() => setActiveTab('connectors')}
          style={{
            padding: '0.65rem 1.25rem',
            background: activeTab === 'connectors' ? '#faae33' : 'rgba(255,255,255,0.04)',
            color: activeTab === 'connectors' ? '#18100a' : 'rgba(255,255,255,0.8)',
            border: 'none',
            borderRadius: '8px',
            fontSize: '0.875rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.15s ease',
          }}
        >
          <span>⚡</span>
          <span>Conectores IA (Claude / ChatGPT / DeepSeek / Open Source)</span>
        </button>

        <button
          onClick={() => setActiveTab('organization')}
          style={{
            padding: '0.65rem 1.25rem',
            background: activeTab === 'organization' ? '#faae33' : 'rgba(255,255,255,0.04)',
            color: activeTab === 'organization' ? '#18100a' : 'rgba(255,255,255,0.8)',
            border: 'none',
            borderRadius: '8px',
            fontSize: '0.875rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.15s ease',
          }}
        >
          <span>🏢</span>
          <span>Datos de la Organización</span>
        </button>
      </div>

      {/* Tab 1: Conectores IA */}
      {activeTab === 'connectors' && (
        <div>
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(250, 174, 51, 0.08), rgba(130, 53, 19, 0.08))',
              border: '1px solid rgba(250, 174, 51, 0.25)',
              borderRadius: '12px',
              padding: '1.1rem 1.35rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '8px',
                background: '#faae33',
                color: '#1a100a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                flexShrink: 0,
              }}
            >
              🔑
            </div>
            <div>
              <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem', marginBottom: '0.2rem' }}>
                Conexión Directa de Modelos de Inteligencia Artificial
              </div>
              <div style={{ fontSize: '0.825rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.4 }}>
                Solo ingresa tus API keys aquí. Los 11 agentes utilizarán tus credenciales de forma privada y segura en tu navegador. Si no tienes una clave de pago, puedes usar <strong>FreeLLMAPI</strong> o modelos de código abierto (Ollama/Groq) de forma 100% gratuita.
              </div>
            </div>
          </div>

          <ConnectionsManager />
        </div>
      )}

      {/* Tab 2: Organización */}
      {activeTab === 'organization' && (
        <div>
          {/* Organization Details Form */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(250, 174, 51, 0.15)',
              borderRadius: '1rem',
              padding: '2rem',
              marginBottom: '2rem',
            }}
          >
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'white', marginBottom: '1.25rem' }}>
              Datos de la Empresa / Marca Dropshipping
            </h2>

            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.4rem' }}>
                    Nombre de la Marca u Organización
                  </label>
                  <input
                    type="text"
                    value={orgName}
                    placeholder="Ej: Aura Ice Dropshipping"
                    onChange={(e) => setOrgName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '0.5rem',
                      color: 'white',
                      outline: 'none',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.4rem' }}>
                    Identificador de Marca (Slug)
                  </label>
                  <input
                    type="text"
                    value={slug}
                    placeholder="ej: aura-ice"
                    onChange={(e) => setSlug(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '0.5rem',
                      color: 'white',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.4rem' }}>
                    Moneda Predeterminada
                  </label>
                  <select
                    defaultValue="EUR"
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      background: '#12121c',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '0.5rem',
                      color: 'white',
                      outline: 'none',
                    }}
                  >
                    <option value="EUR">EUR (€) — Euro</option>
                    <option value="USD">USD ($) — Dólar Estadounidense</option>
                    <option value="COP">COP ($) — Peso Colombiano</option>
                    <option value="MXN">MXN ($) — Peso Mexicano</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.4rem' }}>
                    Zona Horaria
                  </label>
                  <select
                    defaultValue="Europe/Madrid"
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      background: '#12121c',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '0.5rem',
                      color: 'white',
                      outline: 'none',
                    }}
                  >
                    <option value="Europe/Madrid">GMT+1 (Madrid, Barcelona)</option>
                    <option value="America/Bogota">GMT-5 (Bogotá, Lima, Quito)</option>
                    <option value="America/Mexico_City">GMT-6 (Ciudad de México)</option>
                    <option value="America/Argentina/Buenos_Aires">GMT-3 (Buenos Aires, Santiago)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="submit"
                  style={{
                    padding: '0.65rem 1.75rem',
                    borderRadius: '8px',
                    background: '#faae33',
                    color: '#18100a',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
