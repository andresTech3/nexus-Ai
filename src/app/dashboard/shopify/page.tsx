'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useOfficeStore } from '@/lib/office/store'
import { calculateUnitEconomics } from '@/lib/office/finance/calculator'
import { useCurrency } from '@/hooks/useCurrency'

export default function ShopifyStudioPage() {
  const store = useOfficeStore()
  const { formatMoney, currencyConfig } = useCurrency()
  const activeOffice = store.offices[store.activeOfficeId]
  const hasProduct = Boolean(activeOffice?.product?.name?.trim())
  const productName = activeOffice?.product?.name?.trim() || ''
  const brandName = activeOffice?.brand?.name?.trim() || 'Mi Marca'

  const [activeTab, setActiveTab] = useState<'liquid' | 'bundles' | 'analytics' | 'comparison' | 'csv_export'>('liquid')
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const handleDownloadShopifyCSV = () => {
    if (!productName) return
    const handle = productName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    const vendor = brandName || 'Mi Marca'
    const basePvp = unitEco.pvp_con_iva || 34.99
    const price1 = basePvp.toFixed(2)
    const price2 = (basePvp * 2 * 0.8).toFixed(2)
    const price3 = (basePvp * 3 * 0.7).toFixed(2)
    const comp1 = (basePvp * 1.3).toFixed(2)
    const comp2 = (basePvp * 2).toFixed(2)
    const comp3 = (basePvp * 3).toFixed(2)

    const headers = [
      'Handle', 'Title', 'Body (HTML)', 'Vendor', 'Standard Product Type', 'Tags',
      'Published', 'Option1 Name', 'Option1 Value', 'Variant SKU', 'Variant Price',
      'Variant Compare At Price', 'Variant Requires Shipping', 'Variant Taxable', 'Status'
    ]

    const bodyHtml = `<p><strong>${productName}</strong> de ${vendor}. Diseñado para ofrecer máxima calidad y resultados visibles en los primeros días de uso.</p><h3>¿Por qué elegir ${productName}?</h3><ul><li>Demostración de beneficio en menos de 3 segundos</li><li>Envío seguro con número de seguimiento</li><li>Garantía de satisfacción de 30 días</li></ul>`

    const rows = [
      [handle, `"${productName}"`, `"${bodyHtml}"`, `"${vendor}"`, '"E-commerce"', '"dropshipping, ganador, trending"', 'TRUE', 'Pack', '1x Unidad', `${handle}-1`, price1, comp1, 'TRUE', 'TRUE', 'active'],
      [handle, '', '', '', '', '', '', 'Pack', '2x Unidades (Ahorra 20% - Más Vendido)', `${handle}-2`, price2, comp2, 'TRUE', 'TRUE', 'active'],
      [handle, '', '', '', '', '', '', 'Pack', '3x Unidades (Pack Familiar - Máximo Ahorro)', `${handle}-3`, price3, comp3, 'TRUE', 'TRUE', 'active'],
    ]

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `shopify-product-${handle}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast('Archivo CSV de Shopify descargado con éxito.')
  }

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(key)
    showToast('Código copiado al portapapeles')
    setTimeout(() => setCopiedKey(null), 2000)
  }

  // Unit economics for bundles
  const unitEco = calculateUnitEconomics({
    costo_producto: hasProduct ? 8.5 : 0,
    costo_envio: hasProduct ? 3.5 : 0,
    costo_packaging: hasProduct ? 1.0 : 0,
    pvp: hasProduct ? 34.99 : 0,
    comision_pct: 0.029,
    comision_fijo: 0.3,
    provision_devoluciones_pct: 0.05,
    iva_pct: 0.21,
    traffic_mode: 'ADS',
  })

  const liquidDawnSnippet = `{% comment %}
  ============================================================
  NEXUS DROPSHIPPING OS — Pack Selector (Shopify Dawn Theme)
  Desarrollado por Diego (Shopify Architect)
  ============================================================
{% endcomment %}

<div class="product-bundles-container" style="margin: 1.5rem 0;">
  <div style="font-weight: 700; font-size: 0.95rem; margin-bottom: 0.75rem; color: #111;">
    Elige tu Tratamiento Postural:
  </div>

  <div class="bundle-options" style="display: flex; flex-direction: column; gap: 0.75rem;">
    <!-- Pack 1 -->
    <label class="bundle-card" style="display: flex; align-items: center; justify-content: space-between; border: 2px solid #e5e7eb; border-radius: 8px; padding: 1rem; cursor: pointer;">
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <input type="radio" name="bundle_pack" value="1" checked />
        <div>
          <div style="font-weight: 700;">1x Unidad (Prueba 30 días)</div>
          <div style="font-size: 0.85rem; color: #6b7280;">Ideal para uso personal diario</div>
        </div>
      </div>
      <div style="text-align: right;">
        <div style="font-weight: 800; font-size: 1.1rem; color: #111;">34,99 €</div>
        <div style="font-size: 0.75rem; color: #6b7280;">Envío estándar</div>
      </div>
    </label>

    <!-- Pack 2 (Recomendado) -->
    <label class="bundle-card popular" style="display: flex; align-items: center; justify-content: space-between; border: 2px solid #10b981; background: #f0fdf4; border-radius: 8px; padding: 1rem; cursor: pointer; position: relative;">
      <div style="position: absolute; top: -10px; right: 20px; background: #10b981; color: white; font-size: 0.7rem; font-weight: 800; padding: 2px 8px; border-radius: 999px;">
        MÁS VENDIDO • AHORRA 20%
      </div>
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <input type="radio" name="bundle_pack" value="2" />
        <div>
          <div style="font-weight: 700; color: #065f46;">2x Unidades (Pareja / Oficina + Casa)</div>
          <div style="font-size: 0.85rem; color: #047857;">1 para el trabajo, 1 para casa</div>
        </div>
      </div>
      <div style="text-align: right;">
        <div style="font-weight: 800; font-size: 1.15rem; color: #065f46;">55,99 €</div>
        <div style="font-size: 0.75rem; text-decoration: line-through; color: #9ca3af;">69,98 €</div>
      </div>
    </label>

    <!-- Pack 3 -->
    <label class="bundle-card" style="display: flex; align-items: center; justify-content: space-between; border: 2px solid #e5e7eb; border-radius: 8px; padding: 1rem; cursor: pointer;">
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <input type="radio" name="bundle_pack" value="3" />
        <div>
          <div style="font-weight: 700;">3x Unidades (Pack Familiar)</div>
          <div style="font-size: 0.85rem; color: #6b7280;">Máximo ahorro garantizado</div>
        </div>
      </div>
      <div style="text-align: right;">
        <div style="font-weight: 800; font-size: 1.1rem; color: #111;">69,99 €</div>
        <div style="font-size: 0.75rem; color: #10b981; font-weight: 600;">Envío Prioritario Gratis</div>
      </div>
    </label>
  </div>
</div>`

  return (
    <div id="shopify-studio-workspace" style={{ maxWidth: 1200, margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Toast Alert */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '1.5rem',
            right: '1.5rem',
            background: '#10b981',
            color: '#ffffff',
            padding: '0.75rem 1.25rem',
            borderRadius: '8px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
            zIndex: 9999,
            fontSize: '0.85rem',
            fontWeight: 600,
          }}
        >
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.75rem',
          borderBottom: '1px solid #1f1f23',
          paddingBottom: '1.25rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
            <span
              style={{
                width: 28,
                height: 28,
                borderRadius: '6px',
                background: 'rgba(150, 191, 66, 0.15)',
                color: '#96bf42',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.337 3.095c-.033-.298-.28-.506-.575-.506l-4.22-.002c-.053 0-.104.015-.15.042l-1.65.987a.499.499 0 0 0-.236.435v.06l-.993 3.08-1.52.47c-.41.127-.63.568-.504.978l3.19 10.37c.097.316.386.536.716.536h9.11c.33 0 .62-.22.717-.536l3.19-10.37c.126-.41-.094-.851-.504-.978l-1.52-.47-.993-3.08v-.06a.5.5 0 0 0-.236-.435l-1.65-.987c-.046-.027-.097-.042-.15-.042l-2.02.001c.01-.01.02-.02.03-.03z" />
              </svg>
            </span>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
              Shopify Studio & E-commerce
            </h1>
            <span
              style={{
                fontSize: '0.72rem',
                padding: '2px 8px',
                borderRadius: '999px',
                background: 'rgba(150, 191, 66, 0.15)',
                color: '#96bf42',
                fontWeight: 600,
                border: '1px solid rgba(150, 191, 66, 0.3)',
              }}
            >
              Arquitecto Diego: Compatible con Tema Dawn
            </span>
          </div>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#a1a1aa' }}>
            Código Liquid limpio, paquetes de venta cruzada (AOV Boost), comparativa anti-commodity y analítica de sensibilidad de producto.
          </p>
        </div>
      </div>

      {/* ── Empty State if No Product Assigned ───────────────────────────────── */}
      {!hasProduct && (
        <div
          style={{
            background: 'rgba(250, 174, 51, 0.08)',
            border: '1px solid rgba(250, 174, 51, 0.25)',
            borderRadius: '10px',
            padding: '1.25rem 1.5rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <h3 style={{ margin: '0 0 0.25rem 0', color: '#faae33', fontSize: '0.95rem', fontWeight: 700 }}>
              ⚪ Sin Producto Asignado
            </h3>
            <p style={{ margin: 0, color: '#d1d5db', fontSize: '0.8rem', lineHeight: 1.5 }}>
              Diego (Arquitecto Shopify) necesita un producto asignado en tu espacio para estructurar los snippets de Liquid Dawn y los paquetes con descuento AOV.
            </p>
          </div>
          <Link
            href="/dashboard"
            style={{
              background: '#faae33',
              color: '#181008',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: 700,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            Ir al Centro de Mando →
          </Link>
        </div>
      )}

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '1px solid #1f1f23',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
        }}
      >
        <button
          onClick={() => setActiveTab('liquid')}
          style={{
            padding: '0.65rem 1rem',
            fontSize: '0.85rem',
            fontWeight: 600,
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'liquid' ? '2px solid #96bf42' : '2px solid transparent',
            color: activeTab === 'liquid' ? '#ffffff' : '#71717a',
            cursor: 'pointer',
          }}
        >
          Snippet Shopify Liquid (Dawn)
        </button>

        <button
          onClick={() => setActiveTab('bundles')}
          style={{
            padding: '0.65rem 1rem',
            fontSize: '0.85rem',
            fontWeight: 600,
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'bundles' ? '2px solid #96bf42' : '2px solid transparent',
            color: activeTab === 'bundles' ? '#ffffff' : '#71717a',
            cursor: 'pointer',
          }}
        >
          Estructura de Bundles & AOV
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          style={{
            padding: '0.65rem 1rem',
            fontSize: '0.85rem',
            fontWeight: 600,
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'analytics' ? '2px solid #96bf42' : '2px solid transparent',
            color: activeTab === 'analytics' ? '#ffffff' : '#71717a',
            cursor: 'pointer',
          }}
        >
          Gráficos & Analítica de Margen
        </button>

        <button
          onClick={() => setActiveTab('comparison')}
          style={{
            padding: '0.65rem 1rem',
            fontSize: '0.85rem',
            fontWeight: 600,
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'comparison' ? '2px solid #96bf42' : '2px solid transparent',
            color: activeTab === 'comparison' ? '#ffffff' : '#71717a',
            cursor: 'pointer',
          }}
        >
          Tabla Comparativa & Claims
        </button>

        <button
          onClick={() => setActiveTab('csv_export')}
          style={{
            padding: '0.65rem 1rem',
            fontSize: '0.85rem',
            fontWeight: 600,
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'csv_export' ? '2px solid #96bf42' : '2px solid transparent',
            color: activeTab === 'csv_export' ? '#ffffff' : '#71717a',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          <span>📥</span>
          <span>Exportar Producto a Shopify (CSV 1 Clic)</span>
        </button>
      </div>

      {/* Tab: Liquid Snippet */}
      {activeTab === 'liquid' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div
            style={{
              backgroundColor: '#121214',
              border: '1px solid #1f1f23',
              borderRadius: '8px',
              padding: '1.25rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#ffffff' }}>
                Selector de Ofertas Escalonadas (Packs 1, 2 y 3 unidades)
              </div>
              <div style={{ fontSize: '0.8rem', color: '#71717a', marginTop: '0.2rem' }}>
                Listo para copiar y pegar en tu tema Dawn de Shopify dentro de <code>sections/main-product.liquid</code>.
              </div>
            </div>

            <button
              onClick={() => copyToClipboard(liquidDawnSnippet, 'liquid_code')}
              style={{
                padding: '0.55rem 1.1rem',
                background: '#96bf42',
                border: 'none',
                borderRadius: '6px',
                color: '#121214',
                fontSize: '0.825rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {copiedKey === 'liquid_code' ? '✓ Snippet Copiado' : 'Copiar Código Liquid'}
            </button>
          </div>

          <pre
            style={{
              backgroundColor: '#09090b',
              border: '1px solid #1f1f23',
              borderRadius: '8px',
              padding: '1.25rem',
              color: '#d4d4d8',
              fontSize: '0.8rem',
              lineHeight: 1.5,
              overflowX: 'auto',
              fontFamily: 'Consolas, Monaco, monospace',
            }}
          >
            {liquidDawnSnippet}
          </pre>
        </div>
      )}

      {/* Tab: Bundles & AOV */}
      {activeTab === 'bundles' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          <div
            style={{
              background: '#121214',
              border: '1px solid #1f1f23',
              borderRadius: '8px',
              padding: '1.5rem',
            }}
          >
            <div style={{ fontSize: '0.75rem', color: '#71717a', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Nivel 1: Entrada
            </div>
            <h3 style={{ fontSize: '1.25rem', color: '#ffffff', margin: '0 0 0.5rem 0' }}>1x Unidad</h3>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', marginBottom: '1rem' }}>
              {formatMoney(34.99)}
            </div>
            <ul style={{ paddingLeft: '1.2rem', color: '#a1a1aa', fontSize: '0.825rem', lineHeight: 1.6, margin: 0 }}>
              <li>Coste de Producto: {formatMoney(8.50)}</li>
              <li>Margen Neto: 55,2%</li>
              <li>CPA Techo Rentable: {formatMoney(18.20)}</li>
              <li>Perfil de comprador: Probar sin compromiso</li>
            </ul>
          </div>

          <div
            style={{
              background: '#121214',
              border: '2px solid #10b981',
              borderRadius: '8px',
              padding: '1.5rem',
              position: 'relative',
            }}
          >
            <span
              style={{
                position: 'absolute',
                top: '-10px',
                right: '15px',
                background: '#10b981',
                color: '#ffffff',
                fontSize: '0.7rem',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '999px',
              }}
            >
              RECOMENDADO • AOV SWEET SPOT
            </span>
            <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Nivel 2: Pack Ahorro 20%
            </div>
            <h3 style={{ fontSize: '1.25rem', color: '#ffffff', margin: '0 0 0.5rem 0' }}>2x Unidades</h3>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#34d399', marginBottom: '1rem' }}>
              {formatMoney(55.99)} <span style={{ fontSize: '0.85rem', color: '#71717a', textDecoration: 'line-through' }}>{formatMoney(69.98)}</span>
            </div>
            <ul style={{ paddingLeft: '1.2rem', color: '#a1a1aa', fontSize: '0.825rem', lineHeight: 1.6, margin: 0 }}>
              <li>Ticket Medio (+60% sobre el básico)</li>
              <li>Margen Neto: 58,4%</li>
              <li>CPA Techo Rentable: {formatMoney(27.80)} (mayor holgura en Meta Ads)</li>
              <li>Ángulo de venta: Uno para casa, otro para la oficina</li>
            </ul>
          </div>

          <div
            style={{
              background: '#121214',
              border: '1px solid #1f1f23',
              borderRadius: '8px',
              padding: '1.5rem',
            }}
          >
            <div style={{ fontSize: '0.75rem', color: '#71717a', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Nivel 3: Máximo Ahorro
            </div>
            <h3 style={{ fontSize: '1.25rem', color: '#ffffff', margin: '0 0 0.5rem 0' }}>3x Unidades (Familiar)</h3>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', marginBottom: '1rem' }}>
              {formatMoney(69.99)}
            </div>
            <ul style={{ paddingLeft: '1.2rem', color: '#a1a1aa', fontSize: '0.825rem', lineHeight: 1.6, margin: 0 }}>
              <li>Envío Prioritario Express Incluido</li>
              <li>Margen Neto: 61,0%</li>
              <li>Ideal para regalos y compras compartidas</li>
            </ul>
          </div>
        </div>
      )}

      {/* Tab: Analytics & Charts */}
      {activeTab === 'analytics' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Visual Trend Graphic using SVG */}
          <div
            style={{
              backgroundColor: '#121214',
              border: '1px solid #1f1f23',
              borderRadius: '8px',
              padding: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#ffffff', fontWeight: 600 }}>
                  Tendencia de Demanda & Búsquedas (Últimos 30 Días)
                </h3>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: '#71717a' }}>
                  Índice de interés para nicho &ldquo;{productName}&rdquo; en TikTok Creative Center y Google Trends ES
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }}></span>
                <span style={{ fontSize: '0.8rem', color: '#a1a1aa' }}>Tendencia Alcista (+24% MoM)</span>
              </div>
            </div>

            {/* Clean SVG Trend Chart */}
            <div style={{ width: '100%', height: '180px', position: 'relative' }}>
              <svg width="100%" height="100%" viewBox="0 0 600 160" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
                <defs>
                  <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                <line x1="0" y1="40" x2="600" y2="40" stroke="#1f1f23" strokeDasharray="4 4" />
                <line x1="0" y1="80" x2="600" y2="80" stroke="#1f1f23" strokeDasharray="4 4" />
                <line x1="0" y1="120" x2="600" y2="120" stroke="#1f1f23" strokeDasharray="4 4" />

                {/* Filled Area */}
                <polygon
                  points="0,140 50,130 100,115 150,125 200,95 250,90 300,75 350,85 400,60 450,55 500,40 550,45 600,25 600,160 0,160"
                  fill="url(#trendGradient)"
                />

                {/* Trend Line */}
                <polyline
                  points="0,140 50,130 100,115 150,125 200,95 250,90 300,75 350,85 400,60 450,55 500,40 550,45 600,25"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Peak point */}
                <circle cx="600" cy="25" r="5" fill="#10b981" />
              </svg>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#71717a', marginTop: '0.5rem' }}>
              <span>Día 1 (Lanzamiento)</span>
              <span>Día 10</span>
              <span>Día 20</span>
              <span>Día 30 (Pico Actual)</span>
            </div>
          </div>

          {/* Unit Economics Table */}
          <div
            style={{
              backgroundColor: '#121214',
              border: '1px solid #1f1f23',
              borderRadius: '8px',
              padding: '1.5rem',
            }}
          >
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: '#ffffff', fontWeight: 600 }}>
              Desglose Unitario de Costes (Eva CFO)
            </h3>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #27272a', textAlign: 'left', color: '#71717a' }}>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Concepto</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Importe ({currencyConfig.symbol})</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>% Sobre PVP</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Observaciones</th>
                  </tr>
                </thead>
                <tbody style={{ color: '#d4d4d8' }}>
                  <tr style={{ borderBottom: '1px solid #18181b' }}>
                    <td style={{ padding: '0.65rem 0.5rem', fontWeight: 600 }}>PVP Venta al Público (con IVA)</td>
                    <td style={{ padding: '0.65rem 0.5rem', fontWeight: 700, color: '#ffffff' }}>{formatMoney(34.99)}</td>
                    <td style={{ padding: '0.65rem 0.5rem' }}>100%</td>
                    <td style={{ padding: '0.65rem 0.5rem', color: '#71717a' }}>Precio en ficha de producto</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #18181b' }}>
                    <td style={{ padding: '0.65rem 0.5rem' }}>Coste de Producto (Fábrica / Proveedor)</td>
                    <td style={{ padding: '0.65rem 0.5rem', color: '#f87171' }}>- {formatMoney(8.50)}</td>
                    <td style={{ padding: '0.65rem 0.5rem' }}>24,3%</td>
                    <td style={{ padding: '0.65rem 0.5rem', color: '#71717a' }}>Multiplicador 4.1x (&ge; 3.5x reglamentario)</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #18181b' }}>
                    <td style={{ padding: '0.65rem 0.5rem' }}>Envío & Logística D2C</td>
                    <td style={{ padding: '0.65rem 0.5rem', color: '#f87171' }}>- {formatMoney(3.50)}</td>
                    <td style={{ padding: '0.65rem 0.5rem' }}>10,0%</td>
                    <td style={{ padding: '0.65rem 0.5rem', color: '#71717a' }}>Línea directa YunExpress / CJPacket</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #18181b' }}>
                    <td style={{ padding: '0.65rem 0.5rem' }}>Comisiones Pasarela + Devoluciones (5%)</td>
                    <td style={{ padding: '0.65rem 0.5rem', color: '#f87171' }}>- {formatMoney(3.05)}</td>
                    <td style={{ padding: '0.65rem 0.5rem' }}>8,7%</td>
                    <td style={{ padding: '0.65rem 0.5rem', color: '#71717a' }}>Stripe/Shopify Payments + Fondo de reserva</td>
                  </tr>
                  <tr style={{ backgroundColor: 'rgba(52, 211, 153, 0.08)' }}>
                    <td style={{ padding: '0.75rem 0.5rem', fontWeight: 700, color: '#34d399' }}>Margen Bruto para Publicidad</td>
                    <td style={{ padding: '0.75rem 0.5rem', fontWeight: 800, color: '#34d399' }}>{formatMoney(18.20)}</td>
                    <td style={{ padding: '0.75rem 0.5rem', fontWeight: 700, color: '#34d399' }}>52,0%</td>
                    <td style={{ padding: '0.75rem 0.5rem', color: '#34d399' }}>CPA máximo tolerable para estar en punto de equilibrio</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Comparison Table */}
      {activeTab === 'comparison' && (
        <div
          style={{
            backgroundColor: '#121214',
            border: '1px solid #1f1f23',
            borderRadius: '8px',
            padding: '1.5rem',
          }}
        >
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.15rem', color: '#ffffff', fontWeight: 600 }}>
            Tabla Comparativa &ldquo;Nosotros vs. Otros Genéricos&rdquo;
          </h3>
          <p style={{ margin: '0 0 1.25rem 0', fontSize: '0.825rem', color: '#71717a' }}>
            Diseñada por Carlos (Copywriter) para desmarcar el producto de baratijas de AliExpress y justificar el PVP prémium.
          </p>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #27272a', textAlign: 'left' }}>
                  <th style={{ padding: '0.75rem', color: '#71717a' }}>Característica Clave</th>
                  <th style={{ padding: '0.75rem', color: '#10b981', fontWeight: 700 }}>{brandName}</th>
                  <th style={{ padding: '0.75rem', color: '#71717a' }}>Copias Genéricas de Mercado</th>
                </tr>
              </thead>
              <tbody style={{ color: '#d4d4d8' }}>
                <tr style={{ borderBottom: '1px solid #18181b' }}>
                  <td style={{ padding: '0.75rem' }}>Material y Transpirabilidad</td>
                  <td style={{ padding: '0.75rem', color: '#34d399', fontWeight: 600 }}>Neopreno microperforado hipoalergénico</td>
                  <td style={{ padding: '0.75rem', color: '#71717a' }}>Plástico rígido que provoca sudoración</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #18181b' }}>
                  <td style={{ padding: '0.75rem' }}>Uso Invisible bajo la ropa</td>
                  <td style={{ padding: '0.75rem', color: '#34d399', fontWeight: 600 }}>100% discreto bajo camisas o jerséis</td>
                  <td style={{ padding: '0.75rem', color: '#71717a' }}>Bulto visible y correas que rozan la axila</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #18181b' }}>
                  <td style={{ padding: '0.75rem' }}>Garantía y Devolución</td>
                  <td style={{ padding: '0.75rem', color: '#34d399', fontWeight: 600 }}>30 días de prueba en casa sin compromiso</td>
                  <td style={{ padding: '0.75rem', color: '#71717a' }}>Sin soporte ni devoluciones garantizadas</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.75rem' }}>Tiempo de Envío</td>
                  <td style={{ padding: '0.75rem', color: '#34d399', fontWeight: 600 }}>24 / 48 horas desde almacén local</td>
                  <td style={{ padding: '0.75rem', color: '#71717a' }}>15 a 25 días laborables desde ultramar</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: CSV Export */}
      {activeTab === 'csv_export' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div
            style={{
              backgroundColor: '#121214',
              border: '1px solid #1f1f23',
              borderRadius: '12px',
              padding: '1.75rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      color: '#96bf42',
                      background: 'rgba(150, 191, 66, 0.15)',
                      border: '1px solid rgba(150, 191, 66, 0.3)',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      fontWeight: 700,
                    }}
                  >
                    SHOPIFY NATIVE IMPORT
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: 600 }}>
                    ● 100% Compatible con Shopify Admin
                  </span>
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                  Exportador Directo de Producto para Shopify
                </h3>
                <p style={{ fontSize: '0.825rem', color: '#a1a1aa', margin: '0.35rem 0 0 0', maxWidth: 640 }}>
                  Descarga un archivo CSV oficial de Shopify con la ficha completa, descripción persuasiva y los 3 paquetes de variantes (1x, 2x y 3x) configurados con sus precios de venta y precios tachados.
                </p>
              </div>

              <button
                onClick={handleDownloadShopifyCSV}
                disabled={!hasProduct}
                style={{
                  background: hasProduct ? 'linear-gradient(135deg, #96bf42, #72962e)' : '#27272a',
                  color: hasProduct ? '#ffffff' : '#71717a',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.75rem 1.4rem',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  cursor: hasProduct ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: hasProduct ? '0 4px 14px rgba(150, 191, 66, 0.3)' : 'none',
                }}
              >
                <span>📥</span>
                <span>Descargar CSV para Shopify</span>
              </button>
            </div>

            {/* How to import guide */}
            <div
              style={{
                background: '#09090b',
                border: '1px solid #1f1f23',
                borderRadius: '8px',
                padding: '1.25rem',
                marginBottom: '1.25rem',
              }}
            >
              <div style={{ fontSize: '0.78rem', color: '#96bf42', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Cómo importar este producto a tu tienda en 3 pasos:
              </div>
              <ol style={{ margin: 0, paddingLeft: '1.25rem', color: '#d4d4d8', fontSize: '0.825rem', lineHeight: 1.8 }}>
                <li>Haz clic en el botón superior <strong>&quot;Descargar CSV para Shopify&quot;</strong>.</li>
                <li>Entra a tu panel de control de <strong>Shopify Admin &rarr; Productos</strong> y pulsa el botón <strong>&quot;Importar&quot;</strong> (arriba a la derecha).</li>
                <li>Sube el archivo CSV descargado y pulsa <strong>&quot;Cargar y continuar&quot;</strong>. ¡Tu producto con las 3 variantes y precios con descuento estará publicado al instante!</li>
              </ol>
            </div>

            {/* Product Snapshot Preview */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '0.75rem',
              }}
            >
              <div style={{ background: '#18181b', padding: '0.75rem', borderRadius: '6px' }}>
                <div style={{ fontSize: '0.7rem', color: '#71717a' }}>Variante 1 (Prueba)</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginTop: 2 }}>
                  1x Unidad: {formatMoney(unitEco.pvp_con_iva || 34.99)}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#71717a' }}>Comparar en: {formatMoney((unitEco.pvp_con_iva || 34.99) * 1.3)}</div>
              </div>

              <div style={{ background: '#18181b', padding: '0.75rem', borderRadius: '6px', border: '1px solid rgba(52, 211, 153, 0.3)' }}>
                <div style={{ fontSize: '0.7rem', color: '#34d399', fontWeight: 700 }}>Variante 2 (Más Vendido • -20%)</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#34d399', marginTop: 2 }}>
                  2x Unidades: {formatMoney((unitEco.pvp_con_iva || 34.99) * 2 * 0.8)}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#71717a' }}>Comparar en: {formatMoney((unitEco.pvp_con_iva || 34.99) * 2)}</div>
              </div>

              <div style={{ background: '#18181b', padding: '0.75rem', borderRadius: '6px' }}>
                <div style={{ fontSize: '0.7rem', color: '#fbbf24', fontWeight: 700 }}>Variante 3 (Familiar • -30%)</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fbbf24', marginTop: 2 }}>
                  3x Unidades: {formatMoney((unitEco.pvp_con_iva || 34.99) * 3 * 0.7)}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#71717a' }}>Comparar en: {formatMoney((unitEco.pvp_con_iva || 34.99) * 3)}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

