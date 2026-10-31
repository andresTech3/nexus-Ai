'use client'

import React from 'react'

export interface ActionToastData {
  title: string
  problem: string
  actionRequired: string
  type?: 'error' | 'warning' | 'success'
}

interface ActionToastProps {
  toast: ActionToastData | null
  onClose: () => void
}

export function ActionToast({ toast, onClose }: ActionToastProps) {
  if (!toast) return null

  const isError = toast.type === 'error'
  const isSuccess = toast.type === 'success'

  const borderColor = isError ? '#ef4444' : isSuccess ? '#22c55e' : '#f59e0b'
  const bgColor = isError ? '#1c1212' : isSuccess ? '#101c13' : '#1c1810'
  const titleColor = isError ? '#fca5a5' : isSuccess ? '#86efac' : '#fde68a'

  return (
    <div
      role="alert"
      id="action-required-toast"
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        width: '400px',
        maxWidth: 'calc(100vw - 3rem)',
        backgroundColor: bgColor,
        border: `1px solid ${borderColor}`,
        borderRadius: '0.625rem',
        padding: '1.1rem 1.25rem',
        boxShadow: '0 20px 45px rgba(0,0,0,0.85), 0 0 15px rgba(0,0,0,0.5)',
        zIndex: 999999,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.6rem',
        animation: 'slideInUp 0.25s ease-out',
        color: '#ffffff',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {isError ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          ) : isSuccess ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          )}
          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: titleColor, letterSpacing: '-0.01em' }}>
            {toast.title}
          </span>
        </div>
        <button
          onClick={onClose}
          aria-label="Cerrar notificación"
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255,255,255,0.5)',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            padding: 0,
            borderRadius: '4px',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="2" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      {/* Problema */}
      <div style={{ fontSize: '0.84rem', color: '#e5e7eb', lineHeight: 1.45 }}>
        <span style={{ color: titleColor, fontWeight: 700 }}>El problema: </span>
        {toast.problem}
      </div>

      {/* Qué debes hacer */}
      <div
        style={{
          fontSize: '0.82rem',
          color: '#ffffff',
          backgroundColor: 'rgba(0,0,0,0.45)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '0.45rem',
          padding: '0.6rem 0.75rem',
          lineHeight: 1.45,
        }}
      >
        <span style={{ color: '#38bdf8', fontWeight: 700 }}>Acción requerida: </span>
        {toast.actionRequired}
      </div>
    </div>
  )
}
