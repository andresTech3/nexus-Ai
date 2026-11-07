'use client'

import React, { useState } from 'react'

interface ShopifyLiquidPreviewProps {
  liquidCode: string
  productName?: string
  brandName?: string
  price?: number
}

/**
 * Shopify Liquid Preview Component
 *
 * Renders a live preview of Liquid template code in an iframe
 * so the user can see how the product page will look before
 * deploying to Shopify.
 *
 * Uses a sandboxed iframe to safely render the HTML/Liquid output.
 */
export function ShopifyLiquidPreview({
  liquidCode,
  productName = 'Nombre del Producto',
  brandName = 'Mi Marca',
  price = 34.99,
}: ShopifyLiquidPreviewProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'code' | 'html'>('preview')
  const [copied, setCopied] = useState(false)

  // Simple Liquid → HTML converter for preview
  // This is a basic converter that handles common Liquid tags
  function liquidToHtml(code: string): string {
    return code
      // Strip Liquid comments
      .replace(/{%\s*comment\s*%}[\s\S]*?{%\s*endcomment\s*%}/g, '')
      // Handle product title
      .replace(/{{\s*product\.title\s*}}/g, productName)
      .replace(/{{\s*product\.vendor\s*}}/g, brandName)
      .replace(/{{\s*product\.price\s*}}/g, `${price} €`)
      // Handle product object
      .replace(/{%\s*for\s+product\s+in\s+products\s*%}/g, '')
      .replace(/{%\s*endfor\s*%}/g, '')
      // Handle if conditions
      .replace(/{%\s*if\s+product\s*%}/g, '')
      .replace(/{%\s*endif\s*%}/g, '')
      // Handle comment blocks
      .replace(/{%\s*comment\s*%}/g, '')
      .replace(/{%\s*endcomment\s*%}/g, '')
      // Strip remaining Liquid tags for HTML-only view
      .replace(/{%[^%]*%}/g, '')
      .replace(/{{[^}]*}}/g, '')
  }

  const htmlOutput = liquidToHtml(liquidCode)

  const handleCopy = () => {
    navigator.clipboard.writeText(liquidCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      style={{
        backgroundColor: '#121214',
        border: '1px solid #1f1f23',
        borderRadius: '12px',
        overflow: 'hidden',
        height: '600px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Tab Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.75rem 1rem',
          borderBottom: '1px solid #1f1f23',
          backgroundColor: '#0f0f10',
        }}
      >
        <div style={{ display: 'flex', gap: '0.25rem' }}>
          {(['preview', 'code', 'html'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '0.4rem 0.9rem',
                fontSize: '0.78rem',
                fontWeight: 600,
                background: activeTab === tab ? '#1a1a1f' : 'transparent',
                border: activeTab === tab ? '1px solid #27272a' : '1px solid transparent',
                color: activeTab === tab ? '#ffffff' : '#71717a',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              {tab === 'preview' && '👁️ Vista Previa'}
              {tab === 'code' && '📝 Liquid'}
              {tab === 'html' && '🌐 HTML'}
            </button>
          ))}
        </div>
        <button
          onClick={handleCopy}
          style={{
            padding: '0.35rem 0.7rem',
            fontSize: '0.72rem',
            background: 'transparent',
            border: '1px solid #3f3f46',
            color: '#a1a1aa',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          {copied ? '✓ Copiado' : 'Copiar'}
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {activeTab === 'preview' && (
          <iframe
            id="liquid-preview-frame"
            sandbox="allow-scripts allow-same-origin"
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              backgroundColor: '#ffffff',
            }}
            srcDoc={htmlOutput}
            title="Liquid Preview"
          />
        )}
        {activeTab === 'code' && (
          <pre
            style={{
              margin: 0,
              padding: '1rem',
              fontSize: '0.78rem',
              color: '#d4d4d8',
              backgroundColor: '#0a0a0b',
              fontFamily: 'monospace',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              height: '100%',
              overflow: 'auto',
            }}
          >
            {liquidCode}
          </pre>
        )}
        {activeTab === 'html' && (
          <pre
            style={{
              margin: 0,
              padding: '1rem',
              fontSize: '0.78rem',
              color: '#a1a1aa',
              backgroundColor: '#0a0a0b',
              fontFamily: 'monospace',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              height: '100%',
              overflow: 'auto',
            }}
          >
            {htmlOutput}
          </pre>
        )}
      </div>
    </div>
  )
}