import type { Metadata } from 'next'
import { Sidebar } from '@/components/dashboard/Sidebar'

export const metadata: Metadata = {
  title: 'Dashboard — NexusAI',
  description: 'Panel de control de NexusAI.',
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="dashboard"
      id="dashboard"
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#222222',
        color: '#f3f4f6',
        position: 'relative',
        width: '100%',
        overflowX: 'hidden',
      }}
    >
      <Sidebar />
      <main
        className="main-content"
        id="dashboard-main"
        style={{
          marginLeft: '260px',
          flex: 1,
          minHeight: '100vh',
          backgroundColor: '#222222',
          padding: '1.25rem 2rem',
          boxSizing: 'border-box',
          width: 'calc(100% - 260px)',
          maxWidth: 'calc(100% - 260px)',
          overflowX: 'hidden',
        }}
      >
        {children}
      </main>
    </div>
  )
}
