import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'NEXUS OS — Sistema Operativo Autónomo de E-Commerce & Dropshipping',
  description:
    'Oficina autónoma de agentes de IA para operar, validar y escalar marcas de dropshipping con CJ Dropshipping, Shopify Liquid y Meta Ads.',
  keywords: ['NEXUS OS', 'agencia IA', 'dropshipping', 'inteligencia artificial', 'automatización', 'agentes IA', 'Shopify Liquid', 'CJ Dropshipping'],
  icons: {
    icon: [
      { url: '/brand/nexus-app-icon.png', sizes: '192x192', type: 'image/png' },
      { url: '/brand/nexus-icon.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/brand/nexus-app-icon.png',
  },
  openGraph: {
    title: 'NEXUS OS — Sistema Operativo Autónomo de E-Commerce',
    description: 'Oficina autónoma de especialistas de IA para operar marcas de dropshipping.',
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
        <link
          href="https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600;700;800;900&family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Syne:wght@700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
