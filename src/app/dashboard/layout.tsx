import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard — NexusAI',
  description: 'Panel de control de NexusAI.',
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
