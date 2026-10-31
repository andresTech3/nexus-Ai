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
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2.5rem 1.25rem',
        boxSizing: 'border-box',
        backgroundColor: '#0a0a0b',
      }}
    >
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
          Recuperación de Acceso
        </p>
      </div>

      <div
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
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', margin: '0 0 0.5rem 0' }}>
          Recuperar Contraseña
        </h1>
        <p style={{ fontSize: '0.825rem', color: '#71717a', margin: '0 0 1.5rem 0', lineHeight: 1.5 }}>
          Ingresa el correo electrónico asociado a tu cuenta para recibir el enlace de restablecimiento.
        </p>

        {submitted ? (
          <div>
            <div
              style={{
                padding: '0.85rem',
                backgroundColor: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: '6px',
                color: '#6ee7b7',
                fontSize: '0.825rem',
                marginBottom: '1.5rem',
                lineHeight: 1.5,
              }}
            >
              Se ha enviado un enlace de recuperación. Revisa tu bandeja de entrada o carpeta de spam.
            </div>
            <Link
              href="/login"
              style={{
                display: 'block',
                width: '100%',
                padding: '0.7rem',
                boxSizing: 'border-box',
                backgroundColor: '#faae33',
                borderRadius: '6px',
                color: '#090807',
                fontSize: '0.85rem',
                fontWeight: 700,
                textDecoration: 'none',
                textAlign: 'center',
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
                  padding: '0.7rem 0.85rem',
                  backgroundColor: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  borderRadius: '6px',
                  color: '#fca5a5',
                  fontSize: '0.8rem',
                  marginBottom: '1rem',
                }}
              >
                {errorMsg}
              </div>
            )}

            <div style={{ marginBottom: '1.25rem' }}>
              <label
                htmlFor="forgot-email"
                style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.35rem' }}
              >
                Correo Electrónico
              </label>
              <input
                id="forgot-email"
                type="email"
                required
                placeholder="nombre@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.8rem',
                  boxSizing: 'border-box',
                  backgroundColor: '#0c0c0e',
                  border: '1px solid #27272e',
                  borderRadius: '6px',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#faae33')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#27272e')}
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
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
                opacity: isPending ? 0.7 : 1,
              }}
            >
              {isPending ? 'Enviando...' : 'Enviar Enlace de Recuperación'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
              <Link
                href="/login"
                style={{ fontSize: '0.78rem', color: '#71717a', textDecoration: 'none' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#71717a')}
              >
                Volver a Iniciar Sesión
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
