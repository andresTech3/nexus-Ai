import type { Metadata } from 'next'
import { Sidebar } from '@/components/dashboard/Sidebar'

export const metadata: Metadata = {
  title: 'Dashboard — NexusAI',
  description: 'Panel de control de NexusAI.',
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dashboard" id="dashboard">
      <Sidebar />
      <main className="main-content" id="dashboard-main">
        {children}
      </main>
    </div>
  )
}
