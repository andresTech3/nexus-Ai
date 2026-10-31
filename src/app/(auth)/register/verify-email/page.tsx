import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Verifica tu correo — Nexus',
  description: 'Confirma tu correo electrónico para acceder a la plataforma Nexus.',
}

export default function VerifyEmailPage() {
  return (
    <div
      id="verify-email-page"
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
          Verificación de Cuenta
        </p>
      </div>

      <div
        id="verify-email-card"
        style={{
          width: '100%',
          maxWidth: '420px',
          backgroundColor: '#111113',
          border: '1px solid #1f1f23',
          borderRadius: '12px',
          padding: '2rem 1.75rem',
          textAlign: 'center',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.45)',
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            backgroundColor: '#1f1f23',
            border: '1px solid #2d2d34',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.25rem',
            color: '#faae33',
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
        </div>

        <h1
          style={{
            fontSize: '1.35rem',
            fontWeight: 700,
            color: '#ffffff',
            margin: '0 0 0.5rem 0',
          }}
        >
          Revisa tu correo
        </h1>
        <p
          style={{
            fontSize: '0.85rem',
            color: '#71717a',
            lineHeight: 1.5,
            margin: '0 auto 1.75rem auto',
            maxWidth: '320px',
          }}
        >
          Hemos enviado un enlace de confirmación a tu correo. Haz clic en el enlace para activar tu cuenta de operador.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
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
            }}
          >
            Ir a Iniciar Sesión
          </Link>
          <Link
            href="/"
            style={{
              display: 'block',
              width: '100%',
              padding: '0.65rem',
              boxSizing: 'border-box',
              backgroundColor: 'transparent',
              border: '1px solid #222226',
              borderRadius: '6px',
              color: '#a1a1aa',
              fontSize: '0.8rem',
              fontWeight: 500,
              textDecoration: 'none',
            }}
          >
            Volver al Inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
