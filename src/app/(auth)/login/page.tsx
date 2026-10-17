'use client'

import Link from 'next/link'
import { useActionState, useEffect, useRef } from 'react'
import { loginAction, oauthAction, type ActionResult } from '../actions'

const initialState: ActionResult | null = null

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState)
  const emailRef = useRef<HTMLInputElement>(null)

  // Foco en campo con error
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
    <div className="auth-page" id="login-page">
      {/* Orbes decorativos */}
      <div className="glow-orb glow-orb-purple animate-float"
        style={{ width: 300, height: 300, top: '10%', left: '10%', opacity: 0.2 }} />
      <div className="glow-orb glow-orb-violet animate-float-delayed"
        style={{ width: 200, height: 200, bottom: '15%', right: '10%', opacity: 0.15 }} />

      <div className="auth-card" id="login-card">
        {/* Logo */}
        <div className="auth-logo">
          <Link href="/" id="login-logo" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.375rem', color: 'white'
          }}>
            <div className="nav-logo-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                  stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            Nexus<span className="gradient-text-purple">AI</span>
          </Link>
        </div>

        <h1 className="auth-title">Bienvenido de vuelta</h1>
        <p className="auth-subtitle">Inicia sesión en tu cuenta para continuar</p>

        {/* Error general */}
        {state && !state.success && !state.field && (
          <div id="login-error-banner" role="alert" style={{
            padding: '0.75rem 1rem',
            background: 'rgba(248,113,113,0.1)',
            border: '1px solid rgba(248,113,113,0.3)',
            borderRadius: '0.75rem',
            color: '#fca5a5',
            fontSize: '0.875rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            <span>⚠</span> {state.error}
          </div>
        )}

        <form id="login-form" action={formAction} noValidate>
          {/* Email */}
          <div className="form-group">
            <label className="label" htmlFor="login-email">Correo electrónico</label>
            <input
              ref={emailRef}
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="tu@empresa.com"
              className="input"
              aria-describedby={state && !state.success && state.field === 'email' ? 'login-email-error' : undefined}
              style={state && !state.success && state.field === 'email' ? { borderColor: '#f87171' } : {}}
            />
            {state && !state.success && state.field === 'email' && (
              <p id="login-email-error" className="form-error" role="alert">{state.error}</p>
            )}
          </div>

          {/* Contraseña */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label className="label" htmlFor="login-password" style={{ margin: 0 }}>Contraseña</label>
              <Link href="/forgot-password" id="forgot-password-link"
                style={{ fontSize: '0.8125rem', color: 'var(--color-purple-400)' }}>
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="••••••••"
              className="input"
              aria-describedby={state && !state.success && state.field === 'password' ? 'login-password-error' : undefined}
              style={state && !state.success && state.field === 'password' ? { borderColor: '#f87171' } : {}}
            />
            {state && !state.success && state.field === 'password' && (
              <p id="login-password-error" className="form-error" role="alert">{state.error}</p>
            )}
          </div>

          {/* Recordarme */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <input id="login-remember" name="remember" type="checkbox"
              style={{ width: 16, height: 16, accentColor: 'var(--color-purple-500)', cursor: 'pointer' }} />
            <label htmlFor="login-remember"
              style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}>
              Recordarme en este dispositivo
            </label>
          </div>

          <button
            type="submit"
            id="login-submit-btn"
            className="btn btn-primary"
            disabled={isPending}
            aria-busy={isPending}
            style={{ width: '100%', padding: '0.875rem', opacity: isPending ? 0.7 : 1 }}
          >
            {isPending ? (
              <>
                <span style={{ display: 'inline-block', width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin-slow 0.8s linear infinite' }} />
                Iniciando sesión...
              </>
            ) : (
              'Iniciar sesión'
            )}
          </button>
        </form>

        <div className="form-divider">o continuar con</div>

        {/* OAuth */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            id="login-google-btn"
            className="btn btn-outline"
            style={{ flex: 1, padding: '0.75rem' }}
            type="button"
            onClick={() => handleOAuth('google')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Google
          </button>
          <button
            id="login-github-btn"
            className="btn btn-outline"
            style={{ flex: 1, padding: '0.75rem' }}
            type="button"
            onClick={() => handleOAuth('github')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            GitHub
          </button>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9375rem', color: 'rgba(255,255,255,0.5)' }}>
          ¿No tienes cuenta?{' '}
          <Link href="/register" id="login-register-link"
            style={{ color: 'var(--color-purple-400)', fontWeight: 600 }}>
            Registrarse gratis
          </Link>
        </p>
      </div>
    </div>
  )
}
