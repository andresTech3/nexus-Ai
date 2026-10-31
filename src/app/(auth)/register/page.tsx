'use client'

import Link from 'next/link'
import { useActionState, useEffect, useRef, useState } from 'react'
import { registerAction, oauthAction, type ActionResult } from '../actions'

const initialState: ActionResult | null = null

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
        {/* Left Side: Brand Story & Features */}
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

          {/* Headline */}
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
              Prueba Inicial de 14 Días • Sin Tarjeta
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
              Despliega tu escuadrón de 11 agentes de E-Commerce.
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
              Automatiza la investigación de productos ganadores, diseño de funnels en Shopify y optimización de pauta en Meta & TikTok con estándares institucionales.
            </p>
          </div>

          {/* Pillars List */}
          <div
            style={{
              background: 'rgba(18, 16, 14, 0.75)',
              border: '1px solid rgba(250, 174, 51, 0.14)',
              borderRadius: '0.875rem',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.9rem',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: '0.375rem',
                  background: 'rgba(250, 174, 51, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.85rem',
                  flexShrink: 0,
                  marginTop: 2,
                }}
              >
                ⚡
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f4f4f5' }}>
                  Activación Inmediata en 2 Minutos
                </div>
                <div style={{ fontSize: '0.75rem', color: '#a1a1aa', lineHeight: 1.45 }}>
                  Tu espacio de trabajo autónomo se genera en blanco, listo para conectar tus tiendas o API keys.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: '0.375rem',
                  background: 'rgba(16, 185, 129, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.85rem',
                  flexShrink: 0,
                  marginTop: 2,
                }}
              >
                🛡️
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f4f4f5' }}>
                  Quality Gate de Auditoría Automática
                </div>
                <div style={{ fontSize: '0.75rem', color: '#a1a1aa', lineHeight: 1.45 }}>
                  Ningún producto o anuncio se publica sin cumplir márgenes mínimos del 55% y puntuación técnica aprobada.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: '0.375rem',
                  background: 'rgba(59, 130, 246, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.85rem',
                  flexShrink: 0,
                  marginTop: 2,
                }}
              >
                🔒
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f4f4f5' }}>
                  Privacidad y Seguridad Estricta
                </div>
                <div style={{ fontSize: '0.75rem', color: '#a1a1aa', lineHeight: 1.45 }}>
                  Tus datos de ventas, proveedores y claves de IA permanecen 100% aislados y encriptados.
                </div>
              </div>
            </div>
          </div>

          {/* Social Proof Quote */}
          <div
            style={{
              fontSize: '0.825rem',
              color: '#71717a',
              fontStyle: 'italic',
              borderLeft: '2px solid rgba(250, 174, 51, 0.4)',
              paddingLeft: '0.85rem',
            }}
          >
            “Pasamos de tardar 3 días evaluando productos a lanzar 5 tiendas validadas en 24 horas con un ROAS de 4.8x.”
          </div>
        </div>

        {/* Right Side: The Registration Card */}
        <div
          id="register-card"
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
            <Link
              href="/login"
              id="register-login-link"
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
              Iniciar Sesión
            </Link>
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
              Crear Cuenta
            </div>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <h2
              style={{
                fontSize: '1.45rem',
                fontWeight: 700,
                color: '#ffffff',
                margin: '0 0 0.35rem 0',
                letterSpacing: '-0.02em',
              }}
            >
              Crea tu cuenta de operador
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#a1a1aa', margin: 0 }}>
              Acceso a la oficina de agentes con tu entorno limpio y listo
            </p>
          </div>

          {/* General Error Banner */}
          {state && !state.success && !state.field && (
            <div
              id="register-error-banner"
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
              id="register-github-btn"
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
              margin: '1.15rem 0',
            }}
          >
            <div style={{ flex: 1, height: 1, background: 'rgba(255, 255, 255, 0.08)' }} />
            <span style={{ fontSize: '0.72rem', color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              o con tu correo
            </span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255, 255, 255, 0.08)' }} />
          </div>

          <form id="register-form" action={formAction} noValidate>
            {/* Name Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.9rem' }}>
              <div>
                <label
                  htmlFor="register-firstname"
                  style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#e4e4e7', marginBottom: '0.35rem' }}
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
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: `1px solid ${state && !state.success && state.field === 'firstName' ? '#ef4444' : 'rgba(255, 255, 255, 0.1)'}`,
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
                    e.currentTarget.style.borderColor = state && !state.success && state.field === 'firstName' ? '#ef4444' : 'rgba(255, 255, 255, 0.1)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
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
                  style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#e4e4e7', marginBottom: '0.35rem' }}
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
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: `1px solid ${state && !state.success && state.field === 'lastName' ? '#ef4444' : 'rgba(255, 255, 255, 0.1)'}`,
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
                    e.currentTarget.style.borderColor = state && !state.success && state.field === 'lastName' ? '#ef4444' : 'rgba(255, 255, 255, 0.1)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                />
                {state && !state.success && state.field === 'lastName' && (
                  <p id="register-lastname-error" style={{ color: '#f87171', fontSize: '0.72rem', marginTop: '0.25rem', margin: '0.25rem 0 0' }} role="alert">
                    {state.error}
                  </p>
                )}
              </div>
            </div>

            {/* Company / Store */}
            <div style={{ marginBottom: '0.9rem' }}>
              <label
                htmlFor="register-company"
                style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#e4e4e7', marginBottom: '0.35rem' }}
              >
                Tienda o Marca de Dropshipping
              </label>
              <input
                id="register-company"
                name="company"
                type="text"
                autoComplete="organization"
                required
                placeholder="Mi Tienda E-Commerce"
                value={formValues.company}
                onChange={(e) => setFormValues((prev) => ({ ...prev, company: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '0.62rem 0.75rem',
                  boxSizing: 'border-box',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: `1px solid ${state && !state.success && state.field === 'company' ? '#ef4444' : 'rgba(255, 255, 255, 0.1)'}`,
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
                  e.currentTarget.style.borderColor = state && !state.success && state.field === 'company' ? '#ef4444' : 'rgba(255, 255, 255, 0.1)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
              {state && !state.success && state.field === 'company' && (
                <p id="register-company-error" style={{ color: '#f87171', fontSize: '0.72rem', marginTop: '0.25rem', margin: '0.25rem 0 0' }} role="alert">
                  {state.error}
                </p>
              )}
            </div>

            {/* Email */}
            <div style={{ marginBottom: '0.9rem' }}>
              <label
                htmlFor="register-email"
                style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#e4e4e7', marginBottom: '0.35rem' }}
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
                placeholder="tu@empresa.com"
                value={formValues.email}
                onChange={(e) => setFormValues((prev) => ({ ...prev, email: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '0.62rem 0.75rem',
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
                <p id="register-email-error" style={{ color: '#f87171', fontSize: '0.72rem', marginTop: '0.25rem', margin: '0.25rem 0 0' }} role="alert">
                  {state.error}
                </p>
              )}
            </div>

            {/* Password */}
            <div style={{ marginBottom: '1.15rem' }}>
              <label
                htmlFor="register-password"
                style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#e4e4e7', marginBottom: '0.35rem' }}
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
                    padding: '0.62rem 2.5rem 0.62rem 0.75rem',
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
                  width: 15,
                  height: 15,
                  accentColor: '#faae33',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              />
              <label htmlFor="register-terms" style={{ fontSize: '0.75rem', color: '#a1a1aa', cursor: 'pointer', lineHeight: 1.4 }}>
                Acepto los términos de servicio, políticas de privacidad y control de sesión única de NexusAI.
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
                  Creando cuenta de operador...
                </>
              ) : (
                'Crear Cuenta de Operador'
              )}
            </button>
          </form>

          {/* Bottom reassurance */}
          <div
            style={{
              marginTop: '1.25rem',
              paddingTop: '0.85rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.06)',
              textAlign: 'center',
              fontSize: '0.72rem',
              color: '#71717a',
            }}
          >
            ¿Ya tienes una cuenta?{' '}
            <Link
              href="/login"
              style={{ color: '#faae33', fontWeight: 600, textDecoration: 'none' }}
              onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
              onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
            >
              Iniciar sesión aquí
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
