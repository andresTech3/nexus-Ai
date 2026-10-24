import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Verifica tu correo — NexusAI',
  description: 'Confirma tu correo electrónico para acceder a la plataforma NexusAI.',
}

export default function VerifyEmailPage() {
  return (
    <div className="auth-page" id="verify-email-page">
      {/* Floating orbs */}
      <div
        className="glow-orb glow-orb-purple animate-float"
        style={{ width: 350, height: 350, top: '10%', right: '10%', opacity: 0.18 }}
      />
      <div
        className="glow-orb glow-orb-violet animate-float-delayed"
        style={{ width: 250, height: 250, bottom: '15%', left: '10%', opacity: 0.15 }}
      />

      <div className="auth-card" id="verify-email-card" style={{ textAlign: 'center' }}>
        {/* Email Icon */}
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'rgba(168,85,247,0.15)',
            border: '1px solid rgba(168,85,247,0.3)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.5rem',
            color: 'var(--color-purple-400)',
          }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
        </div>

        <h1 className="auth-title">¡Revisa tu correo!</h1>
        <p className="auth-subtitle" style={{ maxWidth: 360, margin: '0 auto 2rem auto', lineHeight: 1.6 }}>
          Hemos enviado un enlace de confirmación a tu dirección de correo electrónico. Haz clic en el enlace para activar tu cuenta.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <Link href="/login" className="btn btn-primary" style={{ width: '100%', padding: '0.875rem' }}>
            Ir a Iniciar Sesión
          </Link>
          <Link href="/" className="btn btn-outline" style={{ width: '100%', padding: '0.875rem' }}>
            Volver al Inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
