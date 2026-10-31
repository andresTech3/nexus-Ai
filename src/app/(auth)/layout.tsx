import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Iniciar sesión — Nexus',
  description: 'Accede a la plataforma operativa Nexus.',
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0a0a0b',
        color: '#f4f4f5',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {children}
    </div>
  )
}
