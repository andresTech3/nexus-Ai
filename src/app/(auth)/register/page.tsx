'use client'

import Link from 'next/link'
import { useActionState, useEffect, useRef, useState } from 'react'
import { registerAction, oauthAction, type ActionResult } from '../actions'

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

function AlertIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  )
}

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(registerAction, initialState)
  const [showPassword, setShowPassword] = useState(false)
  const firstNameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

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
    <div
      id="register-page"
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
          Crear Cuenta de Operador
        </p>
      </div>

      {/* Main Card */}
      <div
        id="register-card"
        style={{
          width: '100%',
          maxWidth: '440px',
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
          <Link
            href="/login"
            id="register-login-link"
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
            Iniciar Sesión
          </Link>
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
            Crear Cuenta
          </div>
        </div>

        {/* General Error Banner */}
        {state && !state.success && !state.field && (
          <div
            id="register-error-banner"
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

        {/* Social OAuth */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', marginBottom: '1.25rem' }}>
          <button
            id="register-google-btn"
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
            id="register-github-btn"
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
            o con tu correo
          </span>
          <div style={{ flex: 1, height: 1, backgroundColor: '#1f1f23' }} />
        </div>

        <form id="register-form" action={formAction} noValidate>
          {/* Name Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.85rem' }}>
            <div>
              <label
                htmlFor="register-firstname"
                style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.35rem' }}
              >
                Nombre
              </label>
              <input
                ref={firstNameRef}
                id="register-firstname"
                name="firstName"
                type="text"
                autoComplete="given-name"
                required
                placeholder="Carlos"
                value={formValues.firstName}
                onChange={(e) => setFormValues((prev) => ({ ...prev, firstName: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '0.62rem 0.75rem',
                  boxSizing: 'border-box',
                  backgroundColor: '#0c0c0e',
                  border: `1px solid ${state && !state.success && state.field === 'firstName' ? '#ef4444' : '#27272e'}`,
                  borderRadius: '6px',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#faae33')}
                onBlur={(e) => (e.currentTarget.style.borderColor = state && !state.success && state.field === 'firstName' ? '#ef4444' : '#27272e')}
              />
              {state && !state.success && state.field === 'firstName' && (
                <p id="register-firstname-error" style={{ color: '#f87171', fontSize: '0.72rem', marginTop: '0.25rem', margin: '0.25rem 0 0' }} role="alert">
                  {state.error}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="register-lastname"
                style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.35rem' }}
              >
                Apellido
              </label>
              <input
                id="register-lastname"
                name="lastName"
                type="text"
                autoComplete="family-name"
                required
                placeholder="Méndez"
                value={formValues.lastName}
                onChange={(e) => setFormValues((prev) => ({ ...prev, lastName: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '0.62rem 0.75rem',
                  boxSizing: 'border-box',
                  backgroundColor: '#0c0c0e',
                  border: `1px solid ${state && !state.success && state.field === 'lastName' ? '#ef4444' : '#27272e'}`,
                  borderRadius: '6px',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#faae33')}
                onBlur={(e) => (e.currentTarget.style.borderColor = state && !state.success && state.field === 'lastName' ? '#ef4444' : '#27272e')}
              />
              {state && !state.success && state.field === 'lastName' && (
                <p id="register-lastname-error" style={{ color: '#f87171', fontSize: '0.72rem', marginTop: '0.25rem', margin: '0.25rem 0 0' }} role="alert">
                  {state.error}
                </p>
              )}
            </div>
          </div>

          {/* Company / Store */}
          <div style={{ marginBottom: '0.85rem' }}>
            <label
              htmlFor="register-company"
              style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.35rem' }}
            >
              Organización o Marca
            </label>
            <input
              id="register-company"
              name="company"
              type="text"
              autoComplete="organization"
              required
              placeholder="Mi Marca E-Commerce"
              value={formValues.company}
              onChange={(e) => setFormValues((prev) => ({ ...prev, company: e.target.value }))}
              style={{
                width: '100%',
                padding: '0.62rem 0.75rem',
                boxSizing: 'border-box',
                backgroundColor: '#0c0c0e',
                border: `1px solid ${state && !state.success && state.field === 'company' ? '#ef4444' : '#27272e'}`,
                borderRadius: '6px',
                color: '#ffffff',
                fontSize: '0.85rem',
                outline: 'none',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#faae33')}
              onBlur={(e) => (e.currentTarget.style.borderColor = state && !state.success && state.field === 'company' ? '#ef4444' : '#27272e')}
            />
            {state && !state.success && state.field === 'company' && (
              <p id="register-company-error" style={{ color: '#f87171', fontSize: '0.72rem', marginTop: '0.25rem', margin: '0.25rem 0 0' }} role="alert">
                {state.error}
              </p>
            )}
          </div>

          {/* Email */}
          <div style={{ marginBottom: '0.85rem' }}>
            <label
              htmlFor="register-email"
              style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.35rem' }}
            >
              Correo Electrónico
            </label>
            <input
              ref={emailRef}
              id="register-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="nombre@empresa.com"
              value={formValues.email}
              onChange={(e) => setFormValues((prev) => ({ ...prev, email: e.target.value }))}
              style={{
                width: '100%',
                padding: '0.62rem 0.75rem',
                boxSizing: 'border-box',
                backgroundColor: '#0c0c0e',
                border: `1px solid ${state && !state.success && state.field === 'email' ? '#ef4444' : '#27272e'}`,
                borderRadius: '6px',
                color: '#ffffff',
                fontSize: '0.85rem',
                outline: 'none',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#faae33')}
              onBlur={(e) => (e.currentTarget.style.borderColor = state && !state.success && state.field === 'email' ? '#ef4444' : '#27272e')}
            />
            {state && !state.success && state.field === 'email' && (
              <p id="register-email-error" style={{ color: '#f87171', fontSize: '0.72rem', marginTop: '0.25rem', margin: '0.25rem 0 0' }} role="alert">
                {state.error}
              </p>
            )}
          </div>

          {/* Password */}
          <div style={{ marginBottom: '1.15rem' }}>
            <label
              htmlFor="register-password"
              style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.35rem' }}
            >
              Contraseña
            </label>
            <div style={{ position: 'relative' }}>
              <input
                ref={passwordRef}
                id="register-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                placeholder="Mínimo 8 car., 1 mayúscula, 1 número"
                value={formValues.password}
                onChange={(e) => setFormValues((prev) => ({ ...prev, password: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '0.62rem 2.4rem 0.62rem 0.75rem',
                  boxSizing: 'border-box',
                  backgroundColor: '#0c0c0e',
                  border: `1px solid ${state && !state.success && state.field === 'password' ? '#ef4444' : '#27272e'}`,
                  borderRadius: '6px',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#faae33')}
                onBlur={(e) => (e.currentTarget.style.borderColor = state && !state.success && state.field === 'password' ? '#ef4444' : '#27272e')}
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
              <p id="register-password-error" style={{ color: '#f87171', fontSize: '0.72rem', marginTop: '0.25rem', margin: '0.25rem 0 0' }} role="alert">
                {state.error}
              </p>
            )}
          </div>

          {/* Terms Checkbox */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <input
              id="register-terms"
              name="terms"
              type="checkbox"
              required
              checked={formValues.terms}
              onChange={(e) => setFormValues((prev) => ({ ...prev, terms: e.target.checked }))}
              style={{
                marginTop: 2,
                width: 14,
                height: 14,
                accentColor: '#faae33',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            />
            <label htmlFor="register-terms" style={{ fontSize: '0.75rem', color: '#71717a', cursor: 'pointer', lineHeight: 1.4 }}>
              Acepto los términos de servicio y la política de privacidad.
            </label>
          </div>
          {state && !state.success && state.field === 'terms' && (
            <p id="register-terms-error" style={{ color: '#f87171', fontSize: '0.72rem', marginTop: '-0.75rem', marginBottom: '0.75rem' }} role="alert">
              {state.error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            id="register-submit-btn"
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
                Creando cuenta...
              </>
            ) : (
              'Crear Cuenta'
            )}
          </button>
        </form>
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: '1.75rem',
          textAlign: 'center',
          fontSize: '0.72rem',
          color: '#52525b',
        }}
      >
        Nexus Platform · Registro seguro con verificación
      </div>
    </div>
  )
}
