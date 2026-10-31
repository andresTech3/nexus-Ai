'use client'

import Link from 'next/link'
import { useActionState, useEffect, useRef, useState } from 'react'
import { loginAction, oauthAction, type ActionResult } from '../actions'

const initialState: ActionResult | null = null

function GoogleIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}

function AlertIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  )
}

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
          'Tu sesión se cerró porque se inició sesión en esta cuenta desde otro dispositivo.'
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
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2.5rem 1.25rem',
        boxSizing: 'border-box',
        backgroundColor: '#0a0a0b',
      }}
    >
      {/* Brand Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.65rem',
            textDecoration: 'none',
            marginBottom: '0.75rem',
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: '7px',
              backgroundColor: '#faae33',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                stroke="#090807"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span
            style={{
              fontFamily: 'var(--font-display, inherit)',
              fontSize: '1.25rem',
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '-0.02em',
            }}
          >
            NEXUS
          </span>
        </Link>
        <p style={{ fontSize: '0.825rem', color: '#71717a', margin: 0 }}>
          Plataforma de Operaciones de E-Commerce & Dropshipping
        </p>
      </div>

      {/* Main Authentication Card */}
      <div
        id="login-card"
        style={{
          width: '100%',
          maxWidth: '420px',
          backgroundColor: '#111113',
          border: '1px solid #1f1f23',
          borderRadius: '12px',
          padding: '2rem 1.75rem',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.45)',
        }}
      >
        {/* Segmented Mode Switch */}
        <div
          style={{
            display: 'flex',
            backgroundColor: '#09090b',
            border: '1px solid #1f1f23',
            borderRadius: '7px',
            padding: '3px',
            marginBottom: '1.5rem',
          }}
        >
          <div
            style={{
              flex: 1,
              textAlign: 'center',
              padding: '0.45rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#ffffff',
              backgroundColor: '#1c1c20',
              borderRadius: '5px',
              border: '1px solid #2d2d34',
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
              padding: '0.45rem',
              fontSize: '0.8rem',
              fontWeight: 500,
              color: '#71717a',
              textDecoration: 'none',
              borderRadius: '5px',
              transition: 'color 0.12s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#71717a')}
          >
            Crear Cuenta
          </Link>
        </div>

        {/* Remote displacement warning */}
        {authError && (
          <div
            id="login-displaced-notice"
            role="alert"
            style={{
              padding: '0.7rem 0.85rem',
              backgroundColor: 'rgba(56, 189, 248, 0.08)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              borderRadius: '6px',
              color: '#7dd3fc',
              fontSize: '0.8rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <AlertIcon />
            <span>{authError}</span>
          </div>
        )}

        {/* Standard error banner */}
        {state && !state.success && !state.field && !state.isConflict && (
          <div
            id="login-error-banner"
            role="alert"
            style={{
              padding: '0.7rem 0.85rem',
              backgroundColor: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              borderRadius: '6px',
              color: '#fca5a5',
              fontSize: '0.8rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <AlertIcon />
            <span>{state.error}</span>
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
              padding: '0.62rem 0.85rem',
              backgroundColor: '#161619',
              border: '1px solid #27272e',
              borderRadius: '6px',
              color: '#e4e4e7',
              fontSize: '0.8rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.12s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#1e1e23'
              e.currentTarget.style.borderColor = '#383842'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#161619'
              e.currentTarget.style.borderColor = '#27272e'
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <GoogleIcon />
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
              padding: '0.62rem 0.85rem',
              backgroundColor: '#161619',
              border: '1px solid #27272e',
              borderRadius: '6px',
              color: '#e4e4e7',
              fontSize: '0.8rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.12s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#1e1e23'
              e.currentTarget.style.borderColor = '#383842'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#161619'
              e.currentTarget.style.borderColor = '#27272e'
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <GitHubIcon />
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
          <div style={{ flex: 1, height: 1, backgroundColor: '#1f1f23' }} />
          <span style={{ fontSize: '0.7rem', color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            o continúa con email
          </span>
          <div style={{ flex: 1, height: 1, backgroundColor: '#1f1f23' }} />
        </div>

        <form id="login-form" action={formAction} noValidate>
          {/* Active session on other device conflict */}
          {state && !state.success && state.isConflict && (
            <div
              id="login-conflict-card"
              role="alert"
              style={{
                padding: '0.85rem',
                backgroundColor: 'rgba(234, 179, 8, 0.08)',
                border: '1px solid rgba(234, 179, 8, 0.3)',
                borderRadius: '6px',
                marginBottom: '1.25rem',
              }}
            >
              <div
                style={{
                  color: '#facc15',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  marginBottom: '0.35rem',
                }}
              >
                <LockIcon />
                <span>Sesión activa en otro dispositivo</span>
              </div>
              <p style={{ color: '#d4d4d8', fontSize: '0.75rem', lineHeight: 1.4, margin: 0 }}>
                {state.error}
              </p>
              <div style={{ marginTop: '0.65rem', paddingTop: '0.55rem', borderTop: '1px solid rgba(234, 179, 8, 0.15)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer', fontSize: '0.75rem', color: '#fef08a' }}>
                  <input type="checkbox" name="forceLogin" value="true" style={{ width: 14, height: 14, accentColor: '#faae33' }} />
                  <span>Cerrar la sesión remota e ingresar aquí</span>
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
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#d4d4d8',
                marginBottom: '0.35rem',
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
              placeholder="nombre@empresa.com"
              aria-describedby={state && !state.success && state.field === 'email' ? 'login-email-error' : undefined}
              style={{
                width: '100%',
                padding: '0.65rem 0.8rem',
                boxSizing: 'border-box',
                backgroundColor: '#0c0c0e',
                border: `1px solid ${state && !state.success && state.field === 'email' ? '#ef4444' : '#27272e'}`,
                borderRadius: '6px',
                color: '#ffffff',
                fontSize: '0.85rem',
                outline: 'none',
                transition: 'border-color 0.12s ease',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#faae33'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = state && !state.success && state.field === 'email' ? '#ef4444' : '#27272e'
              }}
            />
            {state && !state.success && state.field === 'email' && (
              <p id="login-email-error" style={{ color: '#f87171', fontSize: '0.72rem', marginTop: '0.3rem', margin: '0.3rem 0 0' }} role="alert">
                {state.error}
              </p>
            )}
          </div>

          {/* Password Field with Reveal Toggle */}
          <div style={{ marginBottom: '1.15rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <label
                htmlFor="login-password"
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#d4d4d8',
                  margin: 0,
                }}
              >
                Contraseña
              </label>
              <Link
                href="/forgot-password"
                id="forgot-password-link"
                style={{
                  fontSize: '0.72rem',
                  color: '#71717a',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#71717a')}
              >
                ¿Olvidaste tu contraseña?
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
                  padding: '0.65rem 2.4rem 0.65rem 0.8rem',
                  boxSizing: 'border-box',
                  backgroundColor: '#0c0c0e',
                  border: `1px solid ${state && !state.success && state.field === 'password' ? '#ef4444' : '#27272e'}`,
                  borderRadius: '6px',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  outline: 'none',
                  transition: 'border-color 0.12s ease',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#faae33'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = state && !state.success && state.field === 'password' ? '#ef4444' : '#27272e'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                style={{
                  position: 'absolute',
                  right: '0.6rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: '#71717a',
                  cursor: 'pointer',
                  padding: '0.2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {showPassword ? (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>

            {state && !state.success && state.field === 'password' && (
              <p id="login-password-error" style={{ color: '#f87171', fontSize: '0.72rem', marginTop: '0.3rem', margin: '0.3rem 0 0' }} role="alert">
                {state.error}
              </p>
            )}
          </div>

          {/* Remember Me */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <input
              id="login-remember"
              name="remember"
              type="checkbox"
              style={{
                width: 14,
                height: 14,
                accentColor: '#faae33',
                cursor: 'pointer',
              }}
            />
            <label
              htmlFor="login-remember"
              style={{ fontSize: '0.75rem', color: '#71717a', cursor: 'pointer', userSelect: 'none' }}
            >
              Recordar sesión en este equipo
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
              padding: '0.7rem 1rem',
              backgroundColor: '#faae33',
              border: 'none',
              borderRadius: '6px',
              color: '#090807',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: isPending ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'opacity 0.12s ease',
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
                    width: 13,
                    height: 13,
                    border: '2px solid rgba(0,0,0,0.3)',
                    borderTopColor: '#000000',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                  }}
                />
                Iniciando sesión...
              </>
            ) : (
              'Ingresar a la Plataforma'
            )}
          </button>
        </form>
      </div>

      {/* Footer info */}
      <div
        style={{
          marginTop: '1.75rem',
          textAlign: 'center',
          fontSize: '0.72rem',
          color: '#52525b',
        }}
      >
        Nexus Platform · Sesión encriptada con control anti-concurrencia
      </div>
    </div>
  )
}
