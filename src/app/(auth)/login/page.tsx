'use client'

import Link from 'next/link'
import { useActionState, useEffect, useRef, useState } from 'react'
import { loginAction, oauthAction, type ActionResult } from '../actions'

const initialState: ActionResult | null = null

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState)
  const [authError, setAuthError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const emailRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      if (params.get('auth_error') === 'session_displaced') {
        setAuthError(
          'Tu sesión anterior se cerró automáticamente porque se inició sesión en esta cuenta desde otro dispositivo.'
        )
      }
    }
  }, [])

  useEffect(() => {
    if (state && !state.success && state.field === 'email') {
      emailRef.current?.focus()
    }
  }, [state])

  async function handleOAuth(provider: 'google' | 'github') {
    const result = await oauthAction(provider)
    if (result.success && result.url) {
      window.location.href = result.url
    }
  }

  return (
    <div
      id="login-page"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.25rem',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1080px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem',
          alignItems: 'center',
        }}
      >
        {/* Left Side: Brand Story & Live Dropshipping Showcase */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.75rem',
            padding: '1.5rem 0',
          }}
        >
          {/* Brand header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '0.625rem',
                background: 'linear-gradient(135deg, #faae33 0%, #b45309 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(250, 174, 51, 0.25)',
                color: '#090807',
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                  stroke="#090807"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-display, inherit)',
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  color: '#ffffff',
                  letterSpacing: '-0.02em',
                }}
              >
                Nexus<span style={{ color: '#faae33' }}>AI</span>
              </div>
              <div
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  color: '#a1a1aa',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              >
                Dropshipping Autonomous OS
              </div>
            </div>
          </div>

          {/* Editorial Headline */}
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(250, 174, 51, 0.1)',
                border: '1px solid rgba(250, 174, 51, 0.25)',
                borderRadius: '9999px',
                padding: '0.3rem 0.75rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#faae33',
                marginBottom: '1rem',
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: '#10b981',
                  boxShadow: '0 0 8px #10b981',
                }}
              />
              11 Agentes Especialistas Operando en Vivo
            </div>
            <h1
              style={{
                fontSize: 'clamp(1.85rem, 3.2vw, 2.45rem)',
                fontWeight: 800,
                lineHeight: 1.18,
                letterSpacing: '-0.03em',
                color: '#ffffff',
                margin: '0 0 0.85rem 0',
              }}
            >
              Tu oficina completa de E-Commerce automatizada.
            </h1>
            <p
              style={{
                fontSize: '0.975rem',
                lineHeight: 1.6,
                color: '#a1a1aa',
                margin: 0,
                maxWidth: '480px',
              }}
            >
              Desde la detección de productos en tendencia y construcción de funnels en Shopify hasta la optimización de campañas publicitarias en Meta y TikTok sin fricción.
            </p>
          </div>

          {/* Micro Agents Activity Feed */}
          <div
            style={{
              background: 'rgba(18, 16, 14, 0.75)',
              border: '1px solid rgba(250, 174, 51, 0.14)',
              borderRadius: '0.875rem',
              padding: '1.15rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                paddingBottom: '0.65rem',
              }}
            >
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#f4f4f5' }}>
                Monitor de Operaciones Autónomas
              </span>
              <span
                style={{
                  fontSize: '0.68rem',
                  color: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontWeight: 600,
                }}
              >
                ● Sistema Activo
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '0.375rem',
                  background: 'rgba(250, 174, 51, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.85rem',
                }}
              >
                🕵️‍♂️
              </div>
              <div style={{ flex: 1, minWidth: 0, fontSize: '0.78rem' }}>
                <span style={{ color: '#ffffff', fontWeight: 600 }}>Marcus Vance: </span>
                <span style={{ color: '#a1a1aa' }}>Validó 3 productos ganadores (Margen promedio 68%)</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '0.375rem',
                  background: 'rgba(16, 185, 129, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.85rem',
                }}
              >
                📐
              </div>
              <div style={{ flex: 1, minWidth: 0, fontSize: '0.78rem' }}>
                <span style={{ color: '#ffffff', fontWeight: 600 }}>Elena Rostova: </span>
                <span style={{ color: '#a1a1aa' }}>Generó landing Shopify optimizada para 4.2% CVR</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '0.375rem',
                  background: 'rgba(59, 130, 246, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.85rem',
                }}
              >
                🎯
              </div>
              <div style={{ flex: 1, minWidth: 0, fontSize: '0.78rem' }}>
                <span style={{ color: '#ffffff', fontWeight: 600 }}>Lucas Thorne: </span>
                <span style={{ color: '#a1a1aa' }}>Optimizó sets de anuncios alcanzando 4.8x ROAS</span>
              </div>
            </div>
          </div>

          {/* Metric Badges */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.75rem',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.025)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '0.65rem',
                padding: '0.65rem',
              }}
            >
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#faae33' }}>4.8x</div>
              <div style={{ fontSize: '0.68rem', color: '#71717a' }}>ROAS Promedio</div>
            </div>
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.025)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '0.65rem',
                padding: '0.65rem',
              }}
            >
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#10b981' }}>99.4%</div>
              <div style={{ fontSize: '0.68rem', color: '#71717a' }}>Automatización</div>
            </div>
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.025)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '0.65rem',
                padding: '0.65rem',
              }}
            >
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>11</div>
              <div style={{ fontSize: '0.68rem', color: '#71717a' }}>Especialistas IA</div>
            </div>
          </div>
        </div>

        {/* Right Side: The Sign In Card */}
        <div
          id="login-card"
          style={{
            background: 'rgba(18, 16, 14, 0.88)',
            border: '1px solid rgba(250, 174, 51, 0.18)',
            borderRadius: '1.15rem',
            padding: '2rem 1.85rem',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.6), 0 0 32px rgba(250, 174, 51, 0.06)',
            backdropFilter: 'blur(16px)',
          }}
        >
          {/* Segmented Mode Switch */}
          <div
            style={{
              display: 'flex',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '0.625rem',
              padding: '0.25rem',
              marginBottom: '1.5rem',
            }}
          >
            <div
              style={{
                flex: 1,
                textAlign: 'center',
                padding: '0.5rem 0.75rem',
                fontSize: '0.825rem',
                fontWeight: 700,
                color: '#090807',
                background: 'linear-gradient(135deg, #faae33 0%, #d97706 100%)',
                borderRadius: '0.45rem',
                boxShadow: '0 2px 8px rgba(250, 174, 51, 0.3)',
                cursor: 'default',
              }}
            >
              Iniciar Sesión
            </div>
            <Link
              href="/register"
              id="login-register-link"
              style={{
                flex: 1,
                textAlign: 'center',
                padding: '0.5rem 0.75rem',
                fontSize: '0.825rem',
                fontWeight: 600,
                color: '#a1a1aa',
                textDecoration: 'none',
                borderRadius: '0.45rem',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#ffffff'
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#a1a1aa'
                e.currentTarget.style.background = 'transparent'
              }}
            >
              Crear Cuenta
            </Link>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h2
              style={{
                fontSize: '1.45rem',
                fontWeight: 700,
                color: '#ffffff',
                margin: '0 0 0.35rem 0',
                letterSpacing: '-0.02em',
              }}
            >
              Bienvenido de vuelta
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#a1a1aa', margin: 0 }}>
              Ingresa tus credenciales para acceder a tu central operativa
            </p>
          </div>

          {/* Remote displacement warning */}
          {authError && (
            <div
              id="login-displaced-notice"
              role="alert"
              style={{
                padding: '0.75rem 1rem',
                background: 'rgba(56, 189, 248, 0.1)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                borderRadius: '0.625rem',
                color: '#7dd3fc',
                fontSize: '0.825rem',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <span>ℹ</span> {authError}
            </div>
          )}

          {/* Standard error banner */}
          {state && !state.success && !state.field && !state.isConflict && (
            <div
              id="login-error-banner"
              role="alert"
              style={{
                padding: '0.75rem 1rem',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '0.625rem',
                color: '#fca5a5',
                fontSize: '0.825rem',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <span>⚠</span> {state.error}
            </div>
          )}

          {/* Social OAuth Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', marginBottom: '1.25rem' }}>
            <button
              id="login-google-btn"
              type="button"
              onClick={() => handleOAuth('google')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.65rem 0.85rem',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.09)',
                borderRadius: '0.55rem',
                color: '#e4e4e7',
                fontSize: '0.825rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.18)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)'
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.09)'
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'scale(0.98)'
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google
            </button>
            <button
              id="login-github-btn"
              type="button"
              onClick={() => handleOAuth('github')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.65rem 0.85rem',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.09)',
                borderRadius: '0.55rem',
                color: '#e4e4e7',
                fontSize: '0.825rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.18)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)'
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.09)'
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'scale(0.98)'
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              GitHub
            </button>
          </div>

          {/* Divider */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              margin: '1.25rem 0',
            }}
          >
            <div style={{ flex: 1, height: 1, background: 'rgba(255, 255, 255, 0.08)' }} />
            <span style={{ fontSize: '0.72rem', color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              o con email
            </span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255, 255, 255, 0.08)' }} />
          </div>

          <form id="login-form" action={formAction} noValidate>
            {/* Active session on other device conflict */}
            {state && !state.success && state.isConflict && (
              <div
                id="login-conflict-card"
                role="alert"
                style={{
                  padding: '0.85rem',
                  background: 'rgba(234, 179, 8, 0.1)',
                  border: '1px solid rgba(234, 179, 8, 0.35)',
                  borderRadius: '0.625rem',
                  marginBottom: '1.25rem',
                }}
              >
                <div
                  style={{
                    color: '#facc15',
                    fontSize: '0.825rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    marginBottom: '0.35rem',
                  }}
                >
                  <span>🔒</span> Sesión Activa en Otro Dispositivo
                </div>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.78rem', lineHeight: 1.45, margin: 0 }}>
                  {state.error}
                </p>
                <div style={{ marginTop: '0.65rem', paddingTop: '0.55rem', borderTop: '1px solid rgba(234, 179, 8, 0.2)' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer', fontSize: '0.78rem', color: '#fef08a' }}>
                    <input type="checkbox" name="forceLogin" value="true" style={{ width: 15, height: 15, accentColor: '#faae33' }} />
                    <span>Cerrar la sesión anterior e ingresar en este equipo</span>
                  </label>
                </div>
              </div>
            )}

            {/* Email Field */}
            <div style={{ marginBottom: '1rem' }}>
              <label
                htmlFor="login-email"
                style={{
                  display: 'block',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: '#e4e4e7',
                  marginBottom: '0.4rem',
                }}
              >
                Correo Electrónico
              </label>
              <input
                ref={emailRef}
                id="login-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="tu@negocio.com"
                aria-describedby={state && !state.success && state.field === 'email' ? 'login-email-error' : undefined}
                style={{
                  width: '100%',
                  padding: '0.68rem 0.85rem',
                  boxSizing: 'border-box',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: `1px solid ${state && !state.success && state.field === 'email' ? '#ef4444' : 'rgba(255, 255, 255, 0.1)'}`,
                  borderRadius: '0.55rem',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  outline: 'none',
                  transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#faae33'
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(250, 174, 51, 0.15)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = state && !state.success && state.field === 'email' ? '#ef4444' : 'rgba(255, 255, 255, 0.1)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
              {state && !state.success && state.field === 'email' && (
                <p id="login-email-error" style={{ color: '#f87171', fontSize: '0.75rem', marginTop: '0.35rem', margin: '0.35rem 0 0' }} role="alert">
                  {state.error}
                </p>
              )}
            </div>

            {/* Password Field with Reveal Toggle */}
            <div style={{ marginBottom: '1.15rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label
                  htmlFor="login-password"
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    color: '#e4e4e7',
                    margin: 0,
                  }}
                >
                  Contraseña
                </label>
                <Link
                  href="/forgot-password"
                  id="forgot-password-link"
                  style={{
                    fontSize: '0.75rem',
                    color: '#faae33',
                    textDecoration: 'none',
                    fontWeight: 500,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                  onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
                >
                  ¿Olvidaste tu clave?
                </Link>
              </div>

              <div style={{ position: 'relative' }}>
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  aria-describedby={state && !state.success && state.field === 'password' ? 'login-password-error' : undefined}
                  style={{
                    width: '100%',
                    padding: '0.68rem 2.5rem 0.68rem 0.85rem',
                    boxSizing: 'border-box',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: `1px solid ${state && !state.success && state.field === 'password' ? '#ef4444' : 'rgba(255, 255, 255, 0.1)'}`,
                    borderRadius: '0.55rem',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    outline: 'none',
                    transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#faae33'
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(250, 174, 51, 0.15)'
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = state && !state.success && state.field === 'password' ? '#ef4444' : 'rgba(255, 255, 255, 0.1)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                  style={{
                    position: 'absolute',
                    right: '0.65rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: '#a1a1aa',
                    cursor: 'pointer',
                    padding: '0.2rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>

              {state && !state.success && state.field === 'password' && (
                <p id="login-password-error" style={{ color: '#f87171', fontSize: '0.75rem', marginTop: '0.35rem', margin: '0.35rem 0 0' }} role="alert">
                  {state.error}
                </p>
              )}
            </div>

            {/* Remember Me */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.35rem' }}>
              <input
                id="login-remember"
                name="remember"
                type="checkbox"
                style={{
                  width: 15,
                  height: 15,
                  accentColor: '#faae33',
                  cursor: 'pointer',
                }}
              />
              <label
                htmlFor="login-remember"
                style={{ fontSize: '0.78rem', color: '#a1a1aa', cursor: 'pointer', userSelect: 'none' }}
              >
                Recordar esta sesión en este dispositivo
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              id="login-submit-btn"
              disabled={isPending}
              aria-busy={isPending}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: 'linear-gradient(135deg, #faae33 0%, #d97706 100%)',
                border: 'none',
                borderRadius: '0.55rem',
                color: '#090807',
                fontSize: '0.875rem',
                fontWeight: 700,
                cursor: isPending ? 'wait' : 'pointer',
                boxShadow: '0 4px 14px rgba(250, 174, 51, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'all 0.15s ease',
                opacity: isPending ? 0.7 : 1,
              }}
              onMouseDown={(e) => {
                if (!isPending) e.currentTarget.style.transform = 'scale(0.98)'
              }}
              onMouseUp={(e) => {
                if (!isPending) e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              {isPending ? (
                <>
                  <span
                    style={{
                      display: 'inline-block',
                      width: 14,
                      height: 14,
                      border: '2px solid rgba(0,0,0,0.3)',
                      borderTopColor: '#000000',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite',
                    }}
                  />
                  Iniciando sesión...
                </>
              ) : (
                'Acceder al Panel de Agentes'
              )}
            </button>
          </form>

          {/* Footer reassurance */}
          <div
            style={{
              marginTop: '1.5rem',
              paddingTop: '1rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.06)',
              textAlign: 'center',
              fontSize: '0.72rem',
              color: '#71717a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
            }}
          >
            <span>🔒</span> Conexión segura con control de sesión única
          </div>
        </div>
      </div>
    </div>
  )
}
