import type { Metadata } from 'next'
import { Sidebar } from '@/components/dashboard/Sidebar'

export const metadata: Metadata = {
  title: 'Panel de Control — Nexus',
  description: 'Panel de operaciones de Nexus Dropshipping OS.',
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="dashboard"
      id="dashboard"
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#0c0c0d',
        color: '#f4f4f5',
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
          marginLeft: '250px',
          flex: 1,
          minHeight: '100vh',
          backgroundColor: '#0c0c0d',
          padding: '1.25rem 2rem',
          boxSizing: 'border-box',
          width: 'calc(100% - 250px)',
          maxWidth: 'calc(100% - 250px)',
          overflowX: 'hidden',
        }}
      >
        {children}
      </main>
    </div>
  )
}
