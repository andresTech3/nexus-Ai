'use client'

import React from 'react'
import { useMetaConnection } from '@/hooks/useMetaConnection'
import { MIGRATION_SQL } from '@/lib/meta/migration'

interface MetaConnectBannerProps {
  mode: 'ads' | 'instagram'
  onConnected?: () => void
}

const CONFIG = {
  ads: {
    label: 'Facebook Ads (Meta)',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    gradient: 'linear-gradient(135deg, #1877f2, #0d5dbf)',
    color: '#1877f2',
    scopes: 'Gestión de Anuncios, Cuentas Publicitarias, Páginas de Facebook',
    benefit: 'Ver campañas activas, gastos reales, ROAS y CPA directamente desde tu cuenta de Ads.',
    docsUrl: 'https://developers.facebook.com/docs/marketing-apis',
  },
  instagram: {
    label: 'Instagram',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
    gradient: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
    color: '#e1306c',
    scopes: 'Perfil de Instagram, Contenido Publicado, Seguidores, Métricas de Posts',
    benefit: 'Analizar tu perfil real, métricas de engagement, optimizar tu bio y obtener recomendaciones de contenido.',
    docsUrl: 'https://developers.facebook.com/docs/instagram-api',
  },
}

export function MetaConnectBanner({ mode, onConnected }: MetaConnectBannerProps) {
  const { connected, loading, connecting, error, accountName, accountId, tokenExpiresAt, connect, disconnect, refresh } =
    useMetaConnection(mode)
  const cfg = CONFIG[mode]

  const [urlNotice, setUrlNotice] = React.useState<{ type: 'error' | 'success'; message: string } | null>(null)
  const [copiedSql, setCopiedSql] = React.useState(false)
  const [showSqlDetails, setShowSqlDetails] = React.useState(false)

  const handleCopySql = () => {
    navigator.clipboard.writeText(MIGRATION_SQL.trim())
    setCopiedSql(true)
    setTimeout(() => setCopiedSql(false), 2500)
  }

  React.useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    const err = params.get('meta_error')
    const desc = params.get('desc')
    const ok = params.get('meta_connected')

    if (err) {
      let msg = 'La conexión no pudo completarse.'
      if (err === 'cancelled') msg = 'Cancelaste la autorización en Meta o no concediste los permisos requeridos.'
      else if (err === 'db_error') msg = `Error al guardar en Supabase: ${desc ? decodeURIComponent(desc) : 'Verifica que la tabla social_connections exista.'}`
      else if (err === 'token_exchange' || err === 'token_extension') {
        const decodedDesc = desc ? decodeURIComponent(desc) : ''
        msg = `Fallo de token con Meta: ${decodedDesc && decodedDesc !== '[object Object]' ? decodedDesc : 'Verifica que la URL de redirección en Meta coincida y vuelve a intentar.'}`
      }
      else if (err === 'user_fetch_failed') msg = `Meta rechazó la lectura del perfil: ${desc ? decodeURIComponent(desc) : 'Permisos insuficientes.'}`
      else if (desc) msg = decodeURIComponent(desc)

      setUrlNotice({ type: 'error', message: msg })
      // Clean query params from URL without reload
      window.history.replaceState({}, '', window.location.pathname)
    } else if (ok === '1') {
      setUrlNotice({ type: 'success', message: '¡Cuenta vinculada con éxito!' })
      window.history.replaceState({}, '', window.location.pathname)
      if (onConnected) onConnected()
    }
  }, [onConnected])

  if (loading) {
    return (
      <div
        style={{
          background: '#111113',
          border: '1px solid #27272a',
          borderRadius: '12px',
          padding: '1rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: '8px',
            background: '#1f1f23',
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
        />
        <div>
          <div style={{ width: 140, height: 12, background: '#1f1f23', borderRadius: 4, marginBottom: 6 }} />
          <div style={{ width: 100, height: 10, background: '#1f1f23', borderRadius: 4 }} />
        </div>
      </div>
    )
  }

  if (connected) {
    const daysLeft = tokenExpiresAt
      ? Math.round((new Date(tokenExpiresAt).getTime() - Date.now()) / 86400000)
      : null

    return (
      <div
        style={{
          background: 'rgba(34, 197, 94, 0.05)',
          border: '1px solid rgba(34, 197, 94, 0.25)',
          borderRadius: '12px',
          padding: '0.9rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Platform icon */}
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '8px',
              background: cfg.gradient,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {cfg.icon}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>
                {cfg.label} conectado
              </span>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#22c55e',
                  display: 'inline-block',
                  boxShadow: '0 0 6px #22c55e',
                }}
              />
            </div>
            <div style={{ fontSize: '0.78rem', color: '#71717a', marginTop: 2 }}>
              {accountName && <span>@{accountName}</span>}
              {accountId && <span style={{ marginLeft: 8, color: '#52525b' }}>· ID: {accountId}</span>}
              {daysLeft !== null && (
                <span
                  style={{
                    marginLeft: 8,
                    color: daysLeft < 7 ? '#f59e0b' : '#52525b',
                  }}
                >
                  · Token válido {daysLeft}d
                </span>
              )}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={refresh}
            style={{
              background: 'transparent',
              border: '1px solid #3f3f46',
              borderRadius: '6px',
              color: '#a1a1aa',
              padding: '0.4rem 0.75rem',
              fontSize: '0.78rem',
              cursor: 'pointer',
            }}
          >
            Actualizar datos
          </button>
          <button
            onClick={disconnect}
            style={{
              background: 'transparent',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '6px',
              color: '#f87171',
              padding: '0.4rem 0.75rem',
              fontSize: '0.78rem',
              cursor: 'pointer',
            }}
          >
            Desconectar
          </button>
        </div>
      </div>
    )
  }

  // Not connected → show connect card
  return (
    <div
      style={{
        background: '#111113',
        border: '1px solid #27272a',
        borderRadius: '12px',
        padding: '1.25rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
        {/* Icon */}
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: '10px',
            background: cfg.gradient,
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {cfg.icon}
        </div>

        {/* Text */}
        <div style={{ flex: 1, minWidth: 220 }}>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '0.3rem' }}>
            Conecta tu cuenta de {cfg.label}
          </div>
          <div style={{ fontSize: '0.82rem', color: '#a1a1aa', lineHeight: 1.5, marginBottom: '0.75rem' }}>
            {cfg.benefit}
          </div>

          {/* Scopes info */}
          <div
            style={{
              background: '#18181b',
              border: '1px solid #27272a',
              borderRadius: '8px',
              padding: '0.6rem 0.9rem',
              marginBottom: '0.9rem',
            }}
          >
            <div style={{ fontSize: '0.72rem', color: '#71717a', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Permisos que se solicitarán
            </div>
            <div style={{ fontSize: '0.8rem', color: '#d4d4d8' }}>{cfg.scopes}</div>
          </div>

          {/* URL Feedback Alert */}
          {urlNotice && (
            <div
              style={{
                background: urlNotice.type === 'error' ? 'rgba(239, 68, 68, 0.12)' : 'rgba(34, 197, 94, 0.12)',
                border: urlNotice.type === 'error' ? '1px solid rgba(239, 68, 68, 0.35)' : '1px solid rgba(34, 197, 94, 0.35)',
                borderRadius: '8px',
                padding: '0.65rem 0.9rem',
                fontSize: '0.82rem',
                color: urlNotice.type === 'error' ? '#fca5a5' : '#86efac',
                marginBottom: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.5rem',
              }}
            >
              <span>{urlNotice.type === 'error' ? '⚠️ ' : '✅ '}{urlNotice.message}</span>
              <button
                onClick={() => setUrlNotice(null)}
                style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: '2px 4px', fontSize: '0.9rem' }}
              >
                ✕
              </button>
            </div>
          )}

          {/* Special Helper for Missing Supabase Table */}
          {urlNotice?.message.toLowerCase().includes('social_connections') && (
            <div
              style={{
                background: 'rgba(56, 189, 248, 0.08)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                borderRadius: '10px',
                padding: '1rem',
                marginBottom: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1rem' }}>🛠️</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#38bdf8' }}>
                  Solución rápida: Crear tabla en Supabase (Solo 10 segundos)
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.5, margin: '0 0 0.75rem 0' }}>
                Tu proyecto de Supabase necesita la tabla <code>social_connections</code> para guardar de forma cifrada el token de conexión. Sigue estos 2 sencillos pasos:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: '#94a3b8' }}>
                  <span style={{ background: '#0284c7', color: '#fff', borderRadius: '50%', width: 18, height: 18, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700 }}>1</span>
                  <span>Copia el script SQL con un clic:</span>
                  <button
                    onClick={handleCopySql}
                    style={{
                      background: copiedSql ? '#16a34a' : '#2563eb',
                      border: 'none',
                      borderRadius: '6px',
                      color: '#fff',
                      padding: '3px 8px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {copiedSql ? '✓ Copiado' : 'Copiar SQL'}
                  </button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: '#94a3b8' }}>
                  <span style={{ background: '#0284c7', color: '#fff', borderRadius: '50%', width: 18, height: 18, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700 }}>2</span>
                  <span>Abre el SQL Editor de tu Supabase, pégalo y haz clic en <strong>RUN</strong>:</span>
                  <a
                    href="https://supabase.com/dashboard/project/sleisgocuwawjguoxkxy/sql/new"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      color: '#38bdf8',
                      textDecoration: 'underline',
                      fontWeight: 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '2px',
                    }}
                  >
                    Abrir SQL Editor en Supabase ↗
                  </a>
                </div>
              </div>
              <div style={{ marginTop: '0.5rem' }}>
                <button
                  onClick={() => setShowSqlDetails(!showSqlDetails)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#64748b',
                    fontSize: '0.72rem',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    padding: 0,
                  }}
                >
                  {showSqlDetails ? 'Ocultar código SQL' : 'Ver código SQL a ejecutar'}
                </button>
                {showSqlDetails && (
                  <pre
                    style={{
                      marginTop: '0.5rem',
                      background: '#090d16',
                      padding: '0.6rem',
                      borderRadius: '6px',
                      fontSize: '0.7rem',
                      color: '#94a3b8',
                      overflowX: 'auto',
                      maxHeight: '150px',
                    }}
                  >
                    {MIGRATION_SQL.trim()}
                  </pre>
                )}
              </div>
            </div>
          )}

          {error && (
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                borderRadius: '8px',
                padding: '0.65rem 0.9rem',
                fontSize: '0.82rem',
                color: '#fca5a5',
                marginBottom: '0.85rem',
              }}
            >
              ⚠️ {error}
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={connect}
              disabled={connecting}
              style={{
                background: cfg.gradient,
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                padding: '0.6rem 1.2rem',
                fontSize: '0.875rem',
                fontWeight: 700,
                cursor: connecting ? 'not-allowed' : 'pointer',
                opacity: connecting ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              {connecting ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin 1s linear infinite' }}>
                    <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeOpacity="0.3" />
                    <path d="M21 12a9 9 0 00-9-9" strokeLinecap="round" />
                  </svg>
                  Conectando...
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                  </svg>
                  Conectar con {cfg.label}
                </>
              )}
            </button>
            <span style={{ fontSize: '0.75rem', color: '#52525b' }}>
              🔒 Conexión segura OAuth 2.0 — nunca guardamos tu contraseña
            </span>
          </div>
        </div>
      </div>

      {/* Setup requirements */}
      <div
        style={{
          marginTop: '1rem',
          paddingTop: '1rem',
          borderTop: '1px solid #1f1f23',
          display: 'flex',
          gap: '1.5rem',
          flexWrap: 'wrap',
        }}
      >
        <RequirementBadge
          icon="📋"
          text="Necesitas una App de Meta registrada con tu App ID y App Secret"
        />
        <RequirementBadge
          icon="🌐"
          text={`URL de redirección: ${typeof window !== 'undefined' ? window.location.origin : ''}/api/v1/meta/callback`}
        />
        <a
          href={cfg.docsUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: '0.78rem', color: '#71717a', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
        >
          Ver documentación Meta →
        </a>
      </div>
    </div>
  )
}

function RequirementBadge({ icon, text }: { icon: string; text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', maxWidth: 300 }}>
      <span style={{ fontSize: '0.85rem' }}>{icon}</span>
      <span style={{ fontSize: '0.75rem', color: '#71717a', lineHeight: 1.4 }}>{text}</span>
    </div>
  )
}

