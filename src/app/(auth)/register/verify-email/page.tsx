import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Verifica tu correo — NexusAI',
  description: 'Confirma tu correo electrónico para acceder a la plataforma NexusAI.',
}

export default function VerifyEmailPage() {
  return (
    <div
      id="verify-email-page"
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
        id="verify-email-card"
        style={{
          width: '100%',
          maxWidth: '460px',
          background: 'rgba(18, 16, 14, 0.92)',
          border: '1px solid rgba(250, 174, 51, 0.2)',
          borderRadius: '1.25rem',
          padding: '2.5rem 2rem',
          textAlign: 'center',
          boxShadow: '0 20px 48px rgba(0, 0, 0, 0.7), 0 0 32px rgba(250, 174, 51, 0.08)',
          backdropFilter: 'blur(16px)',
        }}
      >
        {/* Email Icon */}
        <div
          style={{
            width: 68,
            height: 68,
            borderRadius: '50%',
            background: 'rgba(250, 174, 51, 0.12)',
            border: '1px solid rgba(250, 174, 51, 0.35)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.5rem',
            color: '#faae33',
            boxShadow: '0 4px 20px rgba(250, 174, 51, 0.2)',
          }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
        </div>

        <h1
          style={{
            fontSize: '1.65rem',
            fontWeight: 800,
            color: '#ffffff',
            margin: '0 0 0.65rem 0',
            letterSpacing: '-0.02em',
          }}
        >
          ¡Revisa tu correo!
        </h1>
        <p
          style={{
            fontSize: '0.9rem',
            color: '#a1a1aa',
            lineHeight: 1.6,
            margin: '0 auto 2rem auto',
            maxWidth: '360px',
          }}
        >
          Hemos enviado un enlace de confirmación a tu dirección de correo electrónico. Haz clic en el enlace para activar tu cuenta de operador.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <Link
            href="/login"
            style={{
              display: 'block',
              width: '100%',
              padding: '0.75rem 1rem',
              boxSizing: 'border-box',
              background: 'linear-gradient(135deg, #faae33 0%, #d97706 100%)',
              borderRadius: '0.55rem',
              color: '#090807',
              fontSize: '0.875rem',
              fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(250, 174, 51, 0.35)',
              transition: 'all 0.15s ease',
            }}
          >
            Ir a Iniciar Sesión
          </Link>
          <Link
            href="/"
            style={{
              display: 'block',
              width: '100%',
              padding: '0.75rem 1rem',
              boxSizing: 'border-box',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '0.55rem',
              color: '#d4d4d8',
              fontSize: '0.85rem',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'all 0.15s ease',
            }}
          >
            Volver al Inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
