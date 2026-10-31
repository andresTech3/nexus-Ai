'use client'

import Link from 'next/link'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isPending, setIsPending] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setIsPending(true)
    setErrorMsg(null)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/api/v1/auth/callback?next=/dashboard/settings`,
      })

      if (error) {
        setErrorMsg(error.message || 'Error al enviar enlace de recuperación.')
      } else {
        setSubmitted(true)
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error inesperado.'
      setErrorMsg(msg)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div
      id="forgot-password-page"
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
          maxWidth: '440px',
          background: 'rgba(18, 16, 14, 0.92)',
          border: '1px solid rgba(250, 174, 51, 0.2)',
          borderRadius: '1.25rem',
          padding: '2.25rem 2rem',
          boxShadow: '0 20px 48px rgba(0, 0, 0, 0.7), 0 0 32px rgba(250, 174, 51, 0.08)',
          backdropFilter: 'blur(16px)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: '0.75rem',
              background: 'rgba(250, 174, 51, 0.12)',
              border: '1px solid rgba(250, 174, 51, 0.3)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
              color: '#faae33',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#ffffff', margin: '0 0 0.5rem 0' }}>
            Recuperar Contraseña
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#a1a1aa', margin: 0, lineHeight: 1.5 }}>
            Ingresa tu correo para recibir un enlace de restablecimiento seguro
          </p>
        </div>

        {submitted ? (
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                padding: '1rem',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '0.625rem',
                color: '#6ee7b7',
                fontSize: '0.85rem',
                marginBottom: '1.5rem',
                lineHeight: 1.5,
              }}
            >
              ✓ Te hemos enviado un enlace de recuperación. Revisa tu bandeja de entrada o spam.
            </div>
            <Link
              href="/login"
              style={{
                display: 'block',
                width: '100%',
                padding: '0.75rem',
                boxSizing: 'border-box',
                background: 'linear-gradient(135deg, #faae33 0%, #d97706 100%)',
                borderRadius: '0.55rem',
                color: '#090807',
                fontSize: '0.875rem',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              Volver a Iniciar Sesión
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {errorMsg && (
              <div
                style={{
                  padding: '0.75rem 1rem',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '0.625rem',
                  color: '#fca5a5',
                  fontSize: '0.825rem',
                  marginBottom: '1rem',
                }}
              >
                ⚠ {errorMsg}
              </div>
            )}

            <div style={{ marginBottom: '1.25rem' }}>
              <label
                htmlFor="forgot-email"
                style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#e4e4e7', marginBottom: '0.4rem' }}
              >
                Correo Electrónico
              </label>
              <input
                id="forgot-email"
                type="email"
                required
                placeholder="tu@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.68rem 0.85rem',
                  boxSizing: 'border-box',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '0.55rem',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
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
                opacity: isPending ? 0.7 : 1,
                boxShadow: '0 4px 14px rgba(250, 174, 51, 0.35)',
              }}
            >
              {isPending ? 'Enviando...' : 'Enviar Enlace de Recuperación'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
              <Link
                href="/login"
                style={{ fontSize: '0.8rem', color: '#a1a1aa', textDecoration: 'none' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#a1a1aa')}
              >
                ← Volver al inicio de sesión
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
