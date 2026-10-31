import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Iniciar sesión — NexusAI',
  description: 'Accede a tu cuenta de NexusAI y gestiona tus proyectos de IA.',
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#090807',
        backgroundImage: `
          radial-gradient(circle at 15% 20%, rgba(250, 174, 51, 0.05) 0%, transparent 40%),
          radial-gradient(circle at 85% 80%, rgba(180, 83, 9, 0.04) 0%, transparent 45%),
          linear-gradient(rgba(255, 255, 255, 0.015) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.015) 1px, transparent 1px)
        `,
        backgroundSize: '100% 100%, 100% 100%, 32px 32px, 32px 32px',
        color: '#f4f4f5',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {children}
    </div>
  )
}
