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
        background: 'radial-gradient(ellipse 80% 60% at 30% 30%, rgba(147,51,234,0.2) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 80%, rgba(124,58,237,0.15) 0%, transparent 60%), #05020f',
      }}
    >
      {children}
    </div>
  )
}
