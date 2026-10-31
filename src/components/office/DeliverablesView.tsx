'use client'

import React, { useState } from 'react'
import JSZip from 'jszip'
import { useOfficeStore } from '@/lib/office/store'
import { calculateUnitEconomics } from '@/lib/office/finance/calculator'
import { CleanDeliverableRenderer } from './CleanDeliverableRenderer'
import { LeoCreativesStudio } from './LeoCreativesStudio'
import { RealMarketResearchView } from './RealMarketResearchView'

export function DeliverablesView() {
  const store = useOfficeStore()
  const activeOffice = store.offices[store.activeOfficeId]
  const deliverables = activeOffice?.deliverables || {}

  const [activeSubTab, setActiveSubTab] = useState<
    'market_research' | 'gallery' | 'calculator' | 'mobile_store' | 'ugc_timeline' | 'meta_ads' | 'all_files'
  >('gallery')

  // Financial Calculator Interactive Inputs
  const [calcInputs, setCalcInputs] = useState({
    costo_producto: 4.10,
    costo_envio: 3.80,
    costo_packaging: 1.20,
    pvp: 32.90,
    comision_pct: 0.029,
    comision_fijo: 0.30,
    provision_devoluciones_pct: 0.05,
    iva_pct: 0.21,
  })

  // Selected Pack for Mobile Store Preview
  const [selectedPack, setSelectedPack] = useState<1 | 2 | 3>(2)

  // Download All as ZIP using JSZip
  const [isZipping, setIsZipping] = useState(false)
  const [previewFile, setPreviewFile] = useState<{ name: string; content: string } | null>(null)

  const liveEcon = calculateUnitEconomics(calcInputs)

  const handleDownloadZip = async () => {
    setIsZipping(true)
    try {
      const zip = new JSZip()
      const folderName = `${activeOffice?.brand.name || 'Marca'}_Entregables_Agencia`
      const root = zip.folder(folderName) || zip

      Object.entries(deliverables).forEach(([fileName, content]) => {
        const textData = typeof content === 'string' ? content : JSON.stringify(content, null, 2)
        root.file(fileName, textData)
      })

      // Add readme
      root.file(
        'LEEME_PRIMERO.txt',
        `============================================================\n${activeOffice?.brand.name.toUpperCase()} — PAQUETE COMPLETO DE LANZAMIENTO\nGenerado por AUTONOMOUS DROPSHIPPING OFFICE (11 Agentes IA)\n============================================================\n\nEste archivo ZIP contiene la totalidad de activos generados determinísticamente para el lanzamiento de la marca:\n\n1. 01_investigacion_producto_ivan.json (Análisis de nicho y producto)\n2. 02_analisis_competencia_lucas.md (Posicionamiento y naming)\n3. 03_unit_economics_eva.csv (Márgenes, ROAS y CPA deterministas)\n4. 04_customer_avatar_sofia.json (Perfil psicológico y objeciones)\n5. 05_copy_landing_page_carlos.md (Textos mobile-first y filtro legal)\n6. 06_prompts_fotografia_leo.json (Prompts FLUX/SDXL y fotos)\n7. 07_shopify_bundle_selector_diego.liquid (Código listo para Shopify Dawn)\n8. 08_guiones_anuncios_ugc_marco.md (Guiones de vídeo vertical 9:16)\n9. 09_estructura_campana_meta_tomas.json (Blueprint de CBO y Stop-Loss)\n10. 10_manual_atencion_cliente_marta.md (Árbol de devoluciones y soporte)\n11. 11_informe_lanzamiento_dora.html (Dossier Ejecutivo de Lanzamiento)\n12. 12_plan_contenido_organico_nora.md (Plan 30 días de contenido viral)\n\nIMPORTANTE: Valida siempre con tu gestoría y normativa local antes de invertir.`
      )

      const blob = await zip.generateAsync({ type: 'blob' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${activeOffice?.brand.name.replace(/\s+/g, '_') || 'Oficina'}_Bundle_Completo.zip`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Error generating ZIP:', err)
    } finally {
      setIsZipping(false)
    }
  }

  const handleDownloadSingleFile = (name: string, content: any) => {
    const textData = typeof content === 'string' ? content : JSON.stringify(content, null, 2)
    const blob = new Blob([textData], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div
      style={{
        backgroundColor: '#18120e',
        border: '1px solid #3d2a1d',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      }}
    >
      {/* Header Bar */}
      <div
        style={{
          padding: '1rem 1.25rem',
          background: 'linear-gradient(180deg, #241812, #18120e)',
          borderBottom: '1px solid #332418',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <div>
          <div style={{ fontSize: '0.75rem', color: '#faae33', fontWeight: 700 }}>
            EXPLORADOR DE ENTREGABLES ACTIVOS
          </div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', margin: 0 }}>
            Activos de {activeOffice?.brand.name || 'Marca'}
          </h2>
        </div>

        {/* Global ZIP Download Button */}
        <button
          onClick={handleDownloadZip}
          disabled={isZipping || Object.keys(deliverables).length === 0}
          style={{
            background: 'linear-gradient(135deg, #faae33, #e59b20)',
            color: '#181008',
            border: 'none',
            borderRadius: '6px',
            padding: '0.55rem 1.1rem',
            fontSize: '0.82rem',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(250, 174, 51, 0.35)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          <span>{isZipping ? 'Generando ZIP...' : 'Descargar Todo en ZIP'}</span>
        </button>
      </div>

      {/* Navigation Sub-Tabs */}
      <div
        style={{
          display: 'flex',
          backgroundColor: '#140f0c',
          borderBottom: '1px solid #332418',
          overflowX: 'auto',
        }}
      >
        <button
          onClick={() => setActiveSubTab('gallery')}
          style={{
            padding: '0.65rem 1rem',
            background: activeSubTab === 'gallery' ? '#241812' : 'transparent',
            border: 'none',
            borderBottom: activeSubTab === 'gallery' ? '2px solid #faae33' : '2px solid transparent',
            color: activeSubTab === 'gallery' ? '#faae33' : '#9ca3af',
            fontSize: '0.78rem',
            fontWeight: 700,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          Creativos y Anuncios (Leo)
        </button>
        <button
          onClick={() => setActiveSubTab('market_research')}
          style={{
            padding: '0.65rem 1rem',
            background: activeSubTab === 'market_research' ? '#241812' : 'transparent',
            border: 'none',
            borderBottom: activeSubTab === 'market_research' ? '2px solid #34d399' : '2px solid transparent',
            color: activeSubTab === 'market_research' ? '#34d399' : '#9ca3af',
            fontSize: '0.78rem',
            fontWeight: 700,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          Investigación de Mercado (Iván)
        </button>
        <button
          onClick={() => setActiveSubTab('calculator')}
          style={{
            padding: '0.65rem 1rem',
            background: activeSubTab === 'calculator' ? '#241812' : 'transparent',
            border: 'none',
            borderBottom: activeSubTab === 'calculator' ? '2px solid #faae33' : '2px solid transparent',
            color: activeSubTab === 'calculator' ? '#faae33' : '#9ca3af',
            fontSize: '0.78rem',
            fontWeight: 700,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          Calculadora Determinista (Eva)
        </button>
        <button
          onClick={() => setActiveSubTab('mobile_store')}
          style={{
            padding: '0.65rem 1rem',
            background: activeSubTab === 'mobile_store' ? '#241812' : 'transparent',
            border: 'none',
            borderBottom: activeSubTab === 'mobile_store' ? '2px solid #faae33' : '2px solid transparent',
            color: activeSubTab === 'mobile_store' ? '#faae33' : '#9ca3af',
            fontSize: '0.78rem',
            fontWeight: 700,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          Mockup Móvil Shopify (Diego)
        </button>

        <button
          onClick={() => setActiveSubTab('ugc_timeline')}
          style={{
            padding: '0.65rem 1rem',
            background: activeSubTab === 'ugc_timeline' ? '#241812' : 'transparent',
            border: 'none',
            borderBottom: activeSubTab === 'ugc_timeline' ? '2px solid #faae33' : '2px solid transparent',
            color: activeSubTab === 'ugc_timeline' ? '#faae33' : '#9ca3af',
            fontSize: '0.78rem',
            fontWeight: 700,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          Guion Vídeo 9:16 (Marco)
        </button>
        <button
          onClick={() => setActiveSubTab('meta_ads')}
          style={{
            padding: '0.65rem 1rem',
            background: activeSubTab === 'meta_ads' ? '#241812' : 'transparent',
            border: 'none',
            borderBottom: activeSubTab === 'meta_ads' ? '2px solid #faae33' : '2px solid transparent',
            color: activeSubTab === 'meta_ads' ? '#faae33' : '#9ca3af',
            fontSize: '0.78rem',
            fontWeight: 700,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          Blueprint Meta Ads (Tomás)
        </button>
        <button
          onClick={() => setActiveSubTab('all_files')}
          style={{
            padding: '0.65rem 1rem',
            background: activeSubTab === 'all_files' ? '#241812' : 'transparent',
            border: 'none',
            borderBottom: activeSubTab === 'all_files' ? '2px solid #faae33' : '2px solid transparent',
            color: activeSubTab === 'all_files' ? '#faae33' : '#9ca3af',
            fontSize: '0.78rem',
            fontWeight: 700,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          Todos los Archivos ({Object.keys(deliverables).length})
        </button>
      </div>

      {/* Tab Panels */}
      <div style={{ padding: '1.25rem' }}>
        {/* ========================================== */}
        {/* SUBTAB 1: DETERMINISTIC FINANCIAL CALCULATOR */}
        {/* ========================================== */}
        {activeSubTab === 'calculator' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#faae33', fontWeight: 700, textTransform: 'uppercase' }}>
                  Fórmulas en Código Puro (Cero Alucinaciones de LLM)
                </span>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                  Unit Economics en Vivo — Eva (CFO)
                </h3>
              </div>

              {/* Health Score Badge */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor:
                    liveEcon.health_score === 'GREEN'
                      ? 'rgba(52, 211, 153, 0.15)'
                      : liveEcon.health_score === 'YELLOW'
                      ? 'rgba(250, 204, 21, 0.15)'
                      : 'rgba(239, 68, 68, 0.15)',
                  border: `1px solid ${
                    liveEcon.health_score === 'GREEN'
                      ? '#34d399'
                      : liveEcon.health_score === 'YELLOW'
                      ? '#facc15'
                      : '#ef4444'
                  }`,
                  borderRadius: '6px',
                  padding: '0.4rem 0.8rem',
                }}
              >
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    backgroundColor:
                      liveEcon.health_score === 'GREEN'
                        ? '#34d399'
                        : liveEcon.health_score === 'YELLOW'
                        ? '#facc15'
                        : '#ef4444',
                  }}
                />
                <span
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    color:
                      liveEcon.health_score === 'GREEN'
                        ? '#34d399'
                        : liveEcon.health_score === 'YELLOW'
                        ? '#facc15'
                        : '#ef4444',
                  }}
                >
                  SALUD FINANCIERA: {liveEcon.health_score}
                </span>
              </div>
            </div>

            {/* Interactive Inputs Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '0.75rem',
                backgroundColor: '#201712',
                border: '1px solid #3d2a1d',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '1.25rem',
              }}
            >
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', color: '#9ca3af', marginBottom: '0.25rem' }}>
                  PVP Escaparate (€ con IVA):
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={calcInputs.pvp}
                  onChange={(e) => setCalcInputs({ ...calcInputs, pvp: parseFloat(e.target.value) || 0 })}
                  style={{
                    width: '100%',
                    background: '#140f0c',
                    border: '1px solid #4a3424',
                    color: '#faae33',
                    fontWeight: 700,
                    borderRadius: '4px',
                    padding: '0.4rem',
                    fontSize: '0.85rem',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', color: '#9ca3af', marginBottom: '0.25rem' }}>
                  Coste Producto (€ proveedor):
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={calcInputs.costo_producto}
                  onChange={(e) => setCalcInputs({ ...calcInputs, costo_producto: parseFloat(e.target.value) || 0 })}
                  style={{
                    width: '100%',
                    background: '#140f0c',
                    border: '1px solid #4a3424',
                    color: '#fff',
                    borderRadius: '4px',
                    padding: '0.4rem',
                    fontSize: '0.85rem',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', color: '#9ca3af', marginBottom: '0.25rem' }}>
                  Envío Unitario 48h (€):
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={calcInputs.costo_envio}
                  onChange={(e) => setCalcInputs({ ...calcInputs, costo_envio: parseFloat(e.target.value) || 0 })}
                  style={{
                    width: '100%',
                    background: '#140f0c',
                    border: '1px solid #4a3424',
                    color: '#fff',
                    borderRadius: '4px',
                    padding: '0.4rem',
                    fontSize: '0.85rem',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', color: '#9ca3af', marginBottom: '0.25rem' }}>
                  Packaging Prémium (€):
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={calcInputs.costo_packaging}
                  onChange={(e) => setCalcInputs({ ...calcInputs, costo_packaging: parseFloat(e.target.value) || 0 })}
                  style={{
                    width: '100%',
                    background: '#140f0c',
                    border: '1px solid #4a3424',
                    color: '#fff',
                    borderRadius: '4px',
                    padding: '0.4rem',
                    fontSize: '0.85rem',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', color: '#9ca3af', marginBottom: '0.25rem' }}>
                  IVA (% sobre base):
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={calcInputs.iva_pct}
                  onChange={(e) => setCalcInputs({ ...calcInputs, iva_pct: parseFloat(e.target.value) || 0 })}
                  style={{
                    width: '100%',
                    background: '#140f0c',
                    border: '1px solid #4a3424',
                    color: '#fff',
                    borderRadius: '4px',
                    padding: '0.4rem',
                    fontSize: '0.85rem',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', color: '#9ca3af', marginBottom: '0.25rem' }}>
                  Comisión Stripe (% + fijo):
                </label>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <input
                    type="number"
                    step="0.001"
                    value={calcInputs.comision_pct}
                    onChange={(e) => setCalcInputs({ ...calcInputs, comision_pct: parseFloat(e.target.value) || 0 })}
                    style={{
                      width: '60%',
                      background: '#140f0c',
                      border: '1px solid #4a3424',
                      color: '#fff',
                      borderRadius: '4px',
                      padding: '0.4rem',
                      fontSize: '0.85rem',
                    }}
                  />
                  <input
                    type="number"
                    step="0.05"
                    value={calcInputs.comision_fijo}
                    onChange={(e) => setCalcInputs({ ...calcInputs, comision_fijo: parseFloat(e.target.value) || 0 })}
                    style={{
                      width: '40%',
                      background: '#140f0c',
                      border: '1px solid #4a3424',
                      color: '#fff',
                      borderRadius: '4px',
                      padding: '0.4rem',
                      fontSize: '0.85rem',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Calculated Key Metrics Row */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '0.75rem',
                marginBottom: '1.25rem',
              }}
            >
              <div style={{ background: '#201712', border: '1px solid #3d2a1d', borderRadius: '6px', padding: '0.75rem' }}>
                <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>PVP Sin IVA:</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>{liveEcon.pvp_sin_iva} €</div>
                <div style={{ fontSize: '0.65rem', color: '#6b7280' }}>Base Imponible</div>
              </div>

              <div style={{ background: '#201712', border: '1px solid #3d2a1d', borderRadius: '6px', padding: '0.75rem' }}>
                <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>COGS Total Unitario:</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f87171' }}>{liveEcon.cogs_total} €</div>
                <div style={{ fontSize: '0.65rem', color: '#6b7280' }}>Coste total x pedido</div>
              </div>

              <div style={{ background: '#201712', border: '1px solid #3d2a1d', borderRadius: '6px', padding: '0.75rem' }}>
                <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>Beneficio Antes Ads:</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#34d399' }}>{liveEcon.beneficio_neto_antes_ads} €</div>
                <div style={{ fontSize: '0.65rem', color: '#34d399' }}>{liveEcon.margen_neto_pct}% margen neto</div>
              </div>

              <div style={{ background: '#201712', border: '1px solid #3d2a1d', borderRadius: '6px', padding: '0.75rem' }}>
                <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>Multiplicador Markup:</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#faae33' }}>{liveEcon.multiplicador_markup}x</div>
                <div style={{ fontSize: '0.65rem', color: liveEcon.multiplicador_markup >= 3.5 ? '#34d399' : '#ef4444' }}>
                  {liveEcon.multiplicador_markup >= 3.5 ? '>= 3.5x Aprobado por Dora' : '¡Menor a 3.5x! (Rechazo)'}
                </div>
              </div>

              <div style={{ background: '#201712', border: '1px solid #3d2a1d', borderRadius: '6px', padding: '0.75rem' }}>
                <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>ROAS de Equilibrio:</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#38bdf8' }}>{liveEcon.roas_equilibrio}x</div>
                <div style={{ fontSize: '0.65rem', color: '#6b7280' }}>Breakeven en Meta</div>
              </div>

              <div style={{ background: '#201712', border: '1px solid #3d2a1d', borderRadius: '6px', padding: '0.75rem' }}>
                <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>CPA Máximo Rentable:</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#facc15' }}>{liveEcon.cpa_maximo_rentable} €</div>
                <div style={{ fontSize: '0.65rem', color: '#6b7280' }}>Límite stop-loss Tomás</div>
              </div>
            </div>

            {/* Bundles Modeling Table */}
            <div style={{ backgroundColor: '#201712', border: '1px solid #3d2a1d', borderRadius: '8px', padding: '1rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#faae33', marginBottom: '0.6rem' }}>
                MODELADO DETERMINISTA DE PACKS (30 / 60 / 90 DÍAS)
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #3d2a1d', color: '#9ca3af', textAlign: 'left' }}>
                      <th style={{ padding: '6px' }}>Pack</th>
                      <th style={{ padding: '6px' }}>Unidades</th>
                      <th style={{ padding: '6px' }}>PVP Total</th>
                      <th style={{ padding: '6px' }}>Descuento</th>
                      <th style={{ padding: '6px' }}>COGS Total</th>
                      <th style={{ padding: '6px' }}>Beneficio Neto</th>
                      <th style={{ padding: '6px' }}>Margen %</th>
                      <th style={{ padding: '6px' }}>ROAS Eq.</th>
                      <th style={{ padding: '6px' }}>CPA Máximo</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #2a1f18', color: '#fff' }}>
                      <td style={{ padding: '8px 6px', fontWeight: 700 }}>30 Días (Prueba)</td>
                      <td style={{ padding: '8px 6px' }}>1 caja</td>
                      <td style={{ padding: '8px 6px', color: '#faae33' }}>{liveEcon.bundles.bundle_30d.pvp_total.toFixed(2)} €</td>
                      <td style={{ padding: '8px 6px' }}>0%</td>
                      <td style={{ padding: '8px 6px', color: '#f87171' }}>{liveEcon.bundles.bundle_30d.cogs_total.toFixed(2)} €</td>
                      <td style={{ padding: '8px 6px', color: '#34d399', fontWeight: 700 }}>{liveEcon.bundles.bundle_30d.net_profit_before_ads.toFixed(2)} €</td>
                      <td style={{ padding: '8px 6px' }}>{liveEcon.bundles.bundle_30d.net_margin_pct}%</td>
                      <td style={{ padding: '8px 6px' }}>{liveEcon.bundles.bundle_30d.roas_breakeven}x</td>
                      <td style={{ padding: '8px 6px' }}>{liveEcon.bundles.bundle_30d.max_cpa.toFixed(2)} €</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #2a1f18', color: '#fff', background: 'rgba(250, 174, 51, 0.05)' }}>
                      <td style={{ padding: '8px 6px', fontWeight: 700, color: '#faae33' }}>60 Días (Más Vendido)</td>
                      <td style={{ padding: '8px 6px' }}>2 cajas</td>
                      <td style={{ padding: '8px 6px', color: '#faae33' }}>{liveEcon.bundles.bundle_60d.pvp_total.toFixed(2)} €</td>
                      <td style={{ padding: '8px 6px' }}>15%</td>
                      <td style={{ padding: '8px 6px', color: '#f87171' }}>{liveEcon.bundles.bundle_60d.cogs_total.toFixed(2)} €</td>
                      <td style={{ padding: '8px 6px', color: '#34d399', fontWeight: 700 }}>{liveEcon.bundles.bundle_60d.net_profit_before_ads.toFixed(2)} €</td>
                      <td style={{ padding: '8px 6px' }}>{liveEcon.bundles.bundle_60d.net_margin_pct}%</td>
                      <td style={{ padding: '8px 6px' }}>{liveEcon.bundles.bundle_60d.roas_breakeven}x</td>
                      <td style={{ padding: '8px 6px' }}>{liveEcon.bundles.bundle_60d.max_cpa.toFixed(2)} €</td>
                    </tr>
                    <tr style={{ color: '#fff' }}>
                      <td style={{ padding: '8px 6px', fontWeight: 700 }}>90 Días (3x2 Ritual)</td>
                      <td style={{ padding: '8px 6px' }}>3 cajas</td>
                      <td style={{ padding: '8px 6px', color: '#faae33' }}>{liveEcon.bundles.bundle_90d.pvp_total.toFixed(2)} €</td>
                      <td style={{ padding: '8px 6px' }}>27%</td>
                      <td style={{ padding: '8px 6px', color: '#f87171' }}>{liveEcon.bundles.bundle_90d.cogs_total.toFixed(2)} €</td>
                      <td style={{ padding: '8px 6px', color: '#34d399', fontWeight: 700 }}>{liveEcon.bundles.bundle_90d.net_profit_before_ads.toFixed(2)} €</td>
                      <td style={{ padding: '8px 6px' }}>{liveEcon.bundles.bundle_90d.net_margin_pct}%</td>
                      <td style={{ padding: '8px 6px' }}>{liveEcon.bundles.bundle_90d.roas_breakeven}x</td>
                      <td style={{ padding: '8px 6px' }}>{liveEcon.bundles.bundle_90d.max_cpa.toFixed(2)} €</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* SUBTAB 2: INTERACTIVE MOBILE PHONE PREVIEW */}
        {/* ========================================== */}
        {activeSubTab === 'mobile_store' && (
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            {/* Phone Frame */}
            <div
              style={{
                width: '320px',
                height: '560px',
                backgroundColor: '#0a0a0a',
                border: '8px solid #2a201a',
                borderRadius: '36px',
                boxShadow: '0 16px 40px rgba(0,0,0,0.8), 0 0 20px rgba(250, 174, 51, 0.2)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              {/* Phone Notch */}
              <div
                style={{
                  height: '24px',
                  backgroundColor: '#000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div style={{ width: '80px', height: '10px', backgroundColor: '#222', borderRadius: '10px' }} />
              </div>

              {/* Mobile Web View */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', backgroundColor: '#18120e', color: '#fff' }}>
                <div style={{ textAlign: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.65rem', color: '#faae33', fontWeight: 800, letterSpacing: '0.05em' }}>
                    INNOVACIÓN NOCTURNA
                  </span>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff', margin: '4px 0' }}>
                    {activeOffice?.brand.name || 'NuBae'} Microcristales
                  </h3>
                  <p style={{ fontSize: '0.68rem', color: '#9ca3af', margin: 0 }}>
                    1.200 microconos de ácido hialurónico soluble
                  </p>
                </div>

                {/* Bundle Selector Cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1rem' }}>
                  {/* Option 1 */}
                  <div
                    onClick={() => setSelectedPack(1)}
                    style={{
                      border: `2px solid ${selectedPack === 1 ? '#faae33' : '#3d2a1d'}`,
                      borderRadius: '8px',
                      padding: '0.6rem',
                      backgroundColor: selectedPack === 1 ? 'rgba(250, 174, 51, 0.1)' : '#241a14',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>1 Caja (Prueba 30d)</span>
                      <strong style={{ color: '#faae33', fontSize: '0.85rem' }}>32,90 €</strong>
                    </div>
                  </div>

                  {/* Option 2 (Featured) */}
                  <div
                    onClick={() => setSelectedPack(2)}
                    style={{
                      border: `2px solid ${selectedPack === 2 ? '#faae33' : '#3d2a1d'}`,
                      borderRadius: '8px',
                      padding: '0.6rem',
                      backgroundColor: selectedPack === 2 ? 'rgba(250, 174, 51, 0.15)' : '#241a14',
                      cursor: 'pointer',
                      position: 'relative',
                    }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '8px',
                        background: '#faae33',
                        color: '#181008',
                        fontSize: '0.6rem',
                        fontWeight: 800,
                        padding: '2px 6px',
                        borderRadius: '10px',
                      }}
                    >
                      MÁS ELEGIDO -15%
                    </span>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>2 Cajas (Ritual 60d)</span>
                      <div>
                        <span style={{ textDecoration: 'line-through', fontSize: '0.68rem', color: '#888', marginRight: '4px' }}>65,80€</span>
                        <strong style={{ color: '#faae33', fontSize: '0.85rem' }}>55,90 €</strong>
                      </div>
                    </div>
                  </div>

                  {/* Option 3 */}
                  <div
                    onClick={() => setSelectedPack(3)}
                    style={{
                      border: `2px solid ${selectedPack === 3 ? '#faae33' : '#3d2a1d'}`,
                      borderRadius: '8px',
                      padding: '0.6rem',
                      backgroundColor: selectedPack === 3 ? 'rgba(250, 174, 51, 0.1)' : '#241a14',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>3 Cajas (Compra 2 + 1 Gratis)</span>
                      <strong style={{ color: '#faae33', fontSize: '0.85rem' }}>72,40 €</strong>
                    </div>
                  </div>
                </div>

                {/* Checkout CTA */}
                <button
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #faae33, #d98216)',
                    color: '#181008',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.75rem',
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(250, 174, 51, 0.4)',
                  }}
                >
                  COMPRAR POR {selectedPack === 1 ? '32,90 €' : selectedPack === 2 ? '55,90 €' : '72,40 €'} &rarr;
                </button>

                {/* Ingredients Accordion Mandatory */}
                <div style={{ marginTop: '1rem', borderTop: '1px solid #3d2a1d', paddingTop: '0.6rem' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#faae33', marginBottom: '0.2rem' }}>
                    Ficha de Ingredientes (INCI):
                  </div>
                  <div style={{ fontSize: '0.64rem', color: '#9ca3af', lineHeight: 1.4 }}>
                    Ácido hialurónico puro microcristalizado, Niacinamida, Centella Asiática, Madecassoside. Sin alcohol ni fragancias sintéticas.
                  </div>
                </div>
              </div>
            </div>

            {/* Liquid Code Inspector Side */}
            <div style={{ flex: 1, minWidth: '320px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#faae33' }}>
                  Código Shopify Liquid (`07_shopify_bundle_selector_diego.liquid`)
                </span>
                <button
                  onClick={() => handleDownloadSingleFile('07_shopify_bundle_selector_diego.liquid', deliverables['07_shopify_bundle_selector_diego.liquid'])}
                  style={{
                    background: '#241a14',
                    border: '1px solid #4a3424',
                    color: '#faae33',
                    padding: '0.3rem 0.6rem',
                    borderRadius: '4px',
                    fontSize: '0.72rem',
                    cursor: 'pointer',
                  }}
                >
                  Descargar Liquid
                </button>
              </div>

              <pre
                style={{
                  background: '#120d09',
                  border: '1px solid #332418',
                  borderRadius: '8px',
                  padding: '1rem',
                  color: '#faae33',
                  fontSize: '0.72rem',
                  lineHeight: 1.4,
                  overflowY: 'auto',
                  maxHeight: '480px',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {deliverables['07_shopify_bundle_selector_diego.liquid'] || '// Ejecuta el pipeline para compilar el código Liquid.'}
              </pre>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* SUBTAB 3: AI ART & PHOTOGRAPHY GALLERY */}
        {/* ========================================== */}
        {/* ========================================== */}
        {/* SUBTAB: CREATIVE STUDIO (LEO) */}
        {/* ========================================== */}
        {activeSubTab === 'gallery' && <LeoCreativesStudio />}

        {/* ========================================== */}
        {/* SUBTAB: REAL MARKET RESEARCH (IVAN & LUCAS) */}
        {/* ========================================== */}
        {activeSubTab === 'market_research' && <RealMarketResearchView />}

        {/* ========================================== */}
        {/* SUBTAB 4: UGC VIDEO TIMELINE SCRIPT */}
        {/* ========================================== */}
        {activeSubTab === 'ugc_timeline' && (
          <div>
            <div style={{ marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.72rem', color: '#faae33', fontWeight: 700 }}>PRODUCCIÓN DE MARCO</span>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                Guion UGC 9:16 de 30 Segundos &amp; Variaciones de Gancho
              </h3>
            </div>

            {/* 3 Hooks Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ background: '#201712', border: '1px solid #faae33', borderRadius: '8px', padding: '0.85rem' }}>
                <span style={{ background: '#faae33', color: '#181008', fontSize: '0.65rem', fontWeight: 800, padding: '2px 6px', borderRadius: '4px' }}>
                  GANCHO A (DEMOSTRACIÓN VISUAL)
                </span>
                <p style={{ fontSize: '0.78rem', color: '#fff', margin: '8px 0 0 0', lineHeight: 1.4 }}>
                  "La creadora despega el parche a 5 cm de cámara frente al espejo con sonido pop. <em>¿Por qué nadie me habló antes de los microcristales solubles?</em>"
                </p>
              </div>

              <div style={{ background: '#201712', border: '1px solid #3d2a1d', borderRadius: '8px', padding: '0.85rem' }}>
                <span style={{ background: '#3d2a1d', color: '#faae33', fontSize: '0.65rem', fontWeight: 800, padding: '2px 6px', borderRadius: '4px' }}>
                  GANCHO B (CONTRASTE PROVOCADOR)
                </span>
                <p style={{ fontSize: '0.78rem', color: '#fff', margin: '8px 0 0 0', lineHeight: 1.4 }}>
                  "Tira a la papelera un tarro de crema de 80€: <em>Deja de tirar el dinero en cremas que solo se evaporan en tu almohada.</em>"
                </p>
              </div>

              <div style={{ background: '#201712', border: '1px solid #3d2a1d', borderRadius: '8px', padding: '0.85rem' }}>
                <span style={{ background: '#3d2a1d', color: '#faae33', fontSize: '0.65rem', fontWeight: 800, padding: '2px 6px', borderRadius: '4px' }}>
                  GANCHO C (CONFESIÓN ÍNTIMA)
                </span>
                <p style={{ fontSize: '0.78rem', color: '#fff', margin: '8px 0 0 0', lineHeight: 1.4 }}>
                  "<em>Dormí solo 5 horas, pero mi jefa me acaba de preguntar si vengo de un retiro de spa en los Alpes...</em>"
                </p>
              </div>
            </div>

            {/* Timeline Breakdown */}
            <div style={{ background: '#201712', border: '1px solid #3d2a1d', borderRadius: '8px', padding: '1rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#faae33', marginBottom: '0.6rem' }}>
                LÍNEA TEMPORAL EXACTA (0 A 30 SEGUNDOS)
              </div>
              <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.78rem', color: '#e5e7eb', lineHeight: 1.7 }}>
                <li><strong>00:00 - 00:03 (Gancho):</strong> Impacto visual inmediato y texto con gancho.</li>
                <li><strong>00:03 - 00:10 (Problema):</strong> Por qué los contornos tradicionales no penetran la piel fina.</li>
                <li><strong>00:10 - 00:20 (Mecanismo):</strong> Cómo los microconos de ácido hialurónico se disuelven de noche.</li>
                <li><strong>00:20 - 00:30 (Prueba &amp; Oferta):</strong> Mirada descansada al despertar + Envío 48h y garantía de 30 días.</li>
              </ul>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* SUBTAB 5: META ADS BLUEPRINT */}
        {/* ========================================== */}
        {activeSubTab === 'meta_ads' && (
          <div>
            <div style={{ marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.72rem', color: '#faae33', fontWeight: 700 }}>MEDIA BUYING DE TOMÁS</span>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                Estructura de Campaña Meta Ads &amp; Reglas de Stop-Loss
              </h3>
            </div>

            <div style={{ background: '#201712', border: '1px solid #3d2a1d', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.78rem', color: '#fff', fontWeight: 700, marginBottom: '0.4rem' }}>
                Configuración CBO (Advantage Campaign Budget):
              </div>
              <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8rem', color: '#d1d5db', flexWrap: 'wrap' }}>
                <div>Presupuesto Diario: <strong style={{ color: '#faae33' }}>50,00 €/día</strong></div>
                <div>Objetivo: <strong style={{ color: '#34d399' }}>Conversiones a Compra (Pixel + CAPI)</strong></div>
                <div>Mercado: <strong style={{ color: '#fff' }}>España (Península e Islas)</strong></div>
              </div>
            </div>

            <div style={{ background: '#201712', border: '1px solid #ef4444', borderRadius: '8px', padding: '1rem' }}>
              <div style={{ fontSize: '0.78rem', color: '#ef4444', fontWeight: 800, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Reglas Deterministas de Stop-Loss (Eva):
              </div>
              <div style={{ fontSize: '0.76rem', color: '#d1d5db', lineHeight: 1.6 }}>
                <div>1. <strong>Parada Inmediata:</strong> Si un conjunto gasta más de <strong>{(liveEcon.cpa_maximo_rentable * 1.5).toFixed(2)} €</strong> sin registrar compras, pausar de inmediato.</div>
                <div>2. <strong>Alerta de Margen:</strong> Si el ROAS medio de 3 días cae por debajo de <strong>1.45x</strong>, recortar presupuesto un 20%.</div>
                <div>3. <strong>Escalado Seguro:</strong> Si el ROAS medio supera <strong>2.80x</strong> con más de 5 compras, escalar +15% cada 48h.</div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* SUBTAB 6: ALL FILES EXPLORER & MODAL VIEW */}
        {/* ========================================== */}
        {activeSubTab === 'all_files' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
              {Object.entries(deliverables).map(([fileName, content]) => (
                <div
                  key={fileName}
                  style={{
                    background: '#201712',
                    border: '1px solid #3d2a1d',
                    borderRadius: '8px',
                    padding: '0.85rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#faae33', fontWeight: 700 }}>ARCHIVO GENERADO</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff', wordBreak: 'break-all' }}>
                      {fileName}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                    <button
                      onClick={() =>
                        setPreviewFile({
                          name: fileName,
                          content: typeof content === 'string' ? content : JSON.stringify(content, null, 2),
                        })
                      }
                      style={{
                        flex: 1,
                        background: '#2b1b11',
                        border: '1px solid #faae33',
                        color: '#faae33',
                        borderRadius: '4px',
                        padding: '0.35rem',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      Ver Archivo
                    </button>
                    <button
                      onClick={() => handleDownloadSingleFile(fileName, content)}
                      style={{
                        background: '#140f0c',
                        border: '1px solid #4a3424',
                        color: '#d1d5db',
                        borderRadius: '4px',
                        padding: '0.35rem 0.65rem',
                        fontSize: '0.72rem',
                        cursor: 'pointer',
                      }}
                      title="Descargar archivo"
                    >
                      ↓ Descargar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Single File Preview Modal */}
      {previewFile && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '800px',
              maxHeight: '85vh',
              backgroundColor: '#1b1410',
              border: '2px solid #faae33',
              borderRadius: '12px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                padding: '1rem',
                borderBottom: '1px solid #3d2a1d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                {previewFile.name}
              </h3>
              <button
                onClick={() => setPreviewFile(null)}
                style={{ background: 'transparent', border: 'none', color: '#9ca3af', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', borderRadius: '4px' }}
                aria-label="Cerrar vista previa"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div style={{ padding: '1rem', overflowY: 'auto', flex: 1 }}>
              <CleanDeliverableRenderer
                deliverableKey={previewFile.name}
                content={previewFile.content}
                productName={activeOffice?.product.name || 'Producto'}
                brandName={activeOffice?.brand.name}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
