'use client'

import Link from 'next/link'
import { useActionState, useEffect, useRef, useState } from 'react'
import { registerAction, oauthAction, type ActionResult } from '../actions'

const initialState: ActionResult | null = null

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(registerAction, initialState)
  const firstNameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  // Preservar valores ingresados por el usuario para evitar que se borren si hay algún error
  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    company: '',
    email: '',
    password: '',
    terms: false,
  })

  useEffect(() => {
    if (state && !state.success) {
      if (state.field === 'firstName') firstNameRef.current?.focus()
      else if (state.field === 'email') emailRef.current?.focus()
      else if (state.field === 'password') passwordRef.current?.focus()
    }
  }, [state])

  async function handleOAuth(provider: 'google' | 'github') {
    const result = await oauthAction(provider)
    if (result.success && result.url) {
      window.location.href = result.url
    }
  }

  return (
    <div className="auth-page" id="register-page">
      {/* Floating orbs */}
      <div
        className="glow-orb glow-orb-purple animate-float"
        style={{ width: 350, height: 350, top: '5%', right: '5%', opacity: 0.18 }}
      />
      <div
        className="glow-orb glow-orb-pink animate-float-delayed"
        style={{ width: 200, height: 200, bottom: '10%', left: '5%', opacity: 0.12 }}
      />

      <div className="auth-card" id="register-card">
        {/* Logo */}
        <div className="auth-logo">
          <Link
            href="/"
            id="register-logo"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '1.375rem',
              color: 'white',
            }}
          >
            <div className="nav-logo-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            Nexus<span className="gradient-text-purple">AI</span>
          </Link>
        </div>

        <h1 className="auth-title">Crear cuenta gratis</h1>
        <p className="auth-subtitle">14 días de prueba sin tarjeta de crédito</p>

        {/* Error general */}
        {state && !state.success && !state.field && (
          <div
            id="register-error-banner"
            role="alert"
            style={{
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
            }}
          >
            <span>⚠</span> {state.error}
          </div>
        )}

        <form id="register-form" action={formAction} noValidate>
          <div className="register-name-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label className="label" htmlFor="register-firstname">
                Nombre
              </label>
              <input
                ref={firstNameRef}
                id="register-firstname"
                name="firstName"
                type="text"
                autoComplete="given-name"
                required
                placeholder="Juan"
                className="input"
                value={formValues.firstName}
                onChange={(e) => setFormValues((prev) => ({ ...prev, firstName: e.target.value }))}
                aria-describedby={
                  state && !state.success && state.field === 'firstName'
                    ? 'register-firstname-error'
                    : undefined
                }
                style={
                  state && !state.success && state.field === 'firstName'
                    ? { borderColor: '#f87171' }
                    : {}
                }
              />
              {state && !state.success && state.field === 'firstName' && (
                <p id="register-firstname-error" className="form-error" role="alert">
                  {state.error}
                </p>
              )}
            </div>
            <div className="form-group">
              <label className="label" htmlFor="register-lastname">
                Apellido
              </label>
              <input
                id="register-lastname"
                name="lastName"
                type="text"
                autoComplete="family-name"
                required
                placeholder="García"
                className="input"
                value={formValues.lastName}
                onChange={(e) => setFormValues((prev) => ({ ...prev, lastName: e.target.value }))}
                aria-describedby={
                  state && !state.success && state.field === 'lastName'
                    ? 'register-lastname-error'
                    : undefined
                }
                style={
                  state && !state.success && state.field === 'lastName'
                    ? { borderColor: '#f87171' }
                    : {}
                }
              />
              {state && !state.success && state.field === 'lastName' && (
                <p id="register-lastname-error" className="form-error" role="alert">
                  {state.error}
                </p>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="label" htmlFor="register-company">
              Empresa
            </label>
            <input
              id="register-company"
              name="company"
              type="text"
              autoComplete="organization"
              required
              placeholder="Mi Empresa S.A."
              className="input"
              value={formValues.company}
              onChange={(e) => setFormValues((prev) => ({ ...prev, company: e.target.value }))}
              aria-describedby={
                state && !state.success && state.field === 'company'
                  ? 'register-company-error'
                  : undefined
              }
              style={
                state && !state.success && state.field === 'company'
                  ? { borderColor: '#f87171' }
                  : {}
              }
            />
            {state && !state.success && state.field === 'company' && (
              <p id="register-company-error" className="form-error" role="alert">
                {state.error}
              </p>
            )}
          </div>

          <div className="form-group">
            <label className="label" htmlFor="register-email">
              Correo electrónico
            </label>
            <input
              ref={emailRef}
              id="register-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="tu@empresa.com"
              className="input"
              value={formValues.email}
              onChange={(e) => setFormValues((prev) => ({ ...prev, email: e.target.value }))}
              aria-describedby={
                state && !state.success && state.field === 'email'
                  ? 'register-email-error'
                  : undefined
              }
              style={
                state && !state.success && state.field === 'email'
                  ? { borderColor: '#f87171' }
                  : {}
              }
            />
            {state && !state.success && state.field === 'email' && (
              <p id="register-email-error" className="form-error" role="alert">
                {state.error}
              </p>
            )}
          </div>

          <div className="form-group">
            <label className="label" htmlFor="register-password">
              Contraseña
            </label>
            <input
              ref={passwordRef}
              id="register-password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              placeholder="Mínimo 8 car., 1 mayúscula, 1 número"
              className="input"
              value={formValues.password}
              onChange={(e) => setFormValues((prev) => ({ ...prev, password: e.target.value }))}
              aria-describedby={
                state && !state.success && state.field === 'password'
                  ? 'register-password-error'
                  : undefined
              }
              style={
                state && !state.success && state.field === 'password'
                  ? { borderColor: '#f87171' }
                  : {}
              }
            />
            {state && !state.success && state.field === 'password' && (
              <p id="register-password-error" className="form-error" role="alert">
                {state.error}
              </p>
            )}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.5rem',
              marginBottom: '1.5rem',
            }}
          >
            <input
              id="register-terms"
              name="terms"
              type="checkbox"
              required
              checked={formValues.terms}
              onChange={(e) => setFormValues((prev) => ({ ...prev, terms: e.target.checked }))}
              style={{
                marginTop: 2,
                width: 16,
                height: 16,
                accentColor: 'var(--color-purple-500)',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            />
            <label
              htmlFor="register-terms"
              style={{
                fontSize: '0.8125rem',
                color: 'rgba(255,255,255,0.5)',
                cursor: 'pointer',
                lineHeight: 1.4,
              }}
            >
              Acepto los{' '}
              <a
                href="#"
                style={{ color: 'var(--color-purple-400)', textDecoration: 'underline' }}
              >
                Términos de Servicio
              </a>{' '}
              y la{' '}
              <a
                href="#"
                style={{ color: 'var(--color-purple-400)', textDecoration: 'underline' }}
              >
                Política de Privacidad
              </a>
            </label>
          </div>
          {state && !state.success && state.field === 'terms' && (
            <p
              id="register-terms-error"
              className="form-error"
              role="alert"
              style={{ marginTop: '-1rem', marginBottom: '1rem' }}
            >
              {state.error}
            </p>
          )}

          <button
            id="register-submit-btn"
            type="submit"
            className="btn btn-primary w-full"
            disabled={isPending}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            {isPending ? (
              <>
                <span className="spinner" /> Creando cuenta...
              </>
            ) : (
              'Crear cuenta'
            )}
          </button>
        </form>

        <div className="form-divider">o regístrate con</div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <button
            id="register-google-btn"
            type="button"
            className="btn btn-outline"
            onClick={() => handleOAuth('google')}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.875rem' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.5 0 2.9.5 4 1.5l3-3C17.2 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
              />
              <path
                fill="#FBBC05"
                d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.1-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
              />
            </svg>
            Google
          </button>

          <button
            id="register-github-btn"
            type="button"
            className="btn btn-outline"
            onClick={() => handleOAuth('github')}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.875rem' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            GitHub
          </button>
        </div>

        <p
          style={{
            textAlign: 'center',
            fontSize: '0.875rem',
            color: 'var(--color-text-muted)',
            marginTop: '2rem',
          }}
        >
          ¿Ya tienes cuenta?{' '}
          <Link
            href="/login"
            id="register-login-link"
            style={{ color: 'var(--color-purple-400)', fontWeight: 600 }}
          >
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
