'use client'

import React from 'react'

export interface ActionToastData {
  title: string
  problem: string
  actionRequired: string
  type: 'error' | 'warning' | 'info' | 'success'
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
  const icon = isError ? '⚠️' : isSuccess ? '✓' : 'ℹ️'

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
          <span style={{ fontSize: '1.1rem' }}>{icon}</span>
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
            fontSize: '1.1rem',
            cursor: 'pointer',
            padding: '0.2rem',
            lineHeight: 1,
          }}
        >
          ✕
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
        <span style={{ color: '#38bdf8', fontWeight: 700 }}>👉 Lo que debes hacer: </span>
        {toast.actionRequired}
      </div>
    </div>
  )
}
