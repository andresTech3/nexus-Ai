import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'NexusAI — Agencia de Inteligencia Artificial y Automatización',
  description:
    'Transformamos tu negocio con inteligencia artificial, automatización avanzada y marketing digital de vanguardia. Soluciones a medida para la era digital.',
  keywords: ['agencia IA', 'inteligencia artificial', 'automatización', 'marketing digital', 'chatbot', 'agentes IA'],
  openGraph: {
    title: 'NexusAI — Agencia de IA y Automatización',
    description: 'Transformamos tu negocio con inteligencia artificial y automatización avanzada.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  )
}
