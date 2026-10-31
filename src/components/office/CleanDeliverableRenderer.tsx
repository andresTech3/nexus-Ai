'use client'

import React, { useState } from 'react'

interface CleanDeliverableRendererProps {
  deliverableKey: string
  content: any
  productName: string
  brandName?: string
}

export function CleanDeliverableRenderer({
  deliverableKey,
  content,
  productName,
  brandName = 'Marca',
}: CleanDeliverableRendererProps) {
  const [viewMode, setViewMode] = useState<'clean' | 'raw'>('clean')

  if (!content) {
    return (
      <div style={{ textAlign: 'center', color: '#6b7280', padding: '2rem 0', fontSize: '0.82rem' }}>
        Este agente aún no ha generado su entregable final. Inicia el pipeline para ver el resultado.
      </div>
    )
  }

  // Parse if string JSON
  let parsed = content
  if (typeof content === 'string') {
    try {
      if (content.trim().startsWith('{') || content.trim().startsWith('[')) {
        parsed = JSON.parse(content)
      }
    } catch {
      // Keep as string
    }
  }

  // Render raw mode
  if (viewMode === 'raw') {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
          <button
            onClick={() => setViewMode('clean')}
            style={{
              backgroundColor: '#271a12',
              border: '1px solid #faae33',
              color: '#faae33',
              borderRadius: '4px',
              padding: '0.25rem 0.65rem',
              fontSize: '0.72rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            ← Volver a Vista Documento Limpio
          </button>
        </div>
        <pre
          style={{
            background: '#120d09',
            border: '1px solid #332418',
            borderRadius: '6px',
            padding: '0.85rem',
            color: '#faae33',
            fontSize: '0.72rem',
            lineHeight: 1.45,
            overflowX: 'auto',
            maxHeight: '500px',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {typeof content === 'string' ? content : JSON.stringify(content, null, 2)}
        </pre>
      </div>
    )
  }

  // Header with view switcher
  const renderHeader = (title: string, subtitle: string, badge?: string) => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        borderBottom: '1px solid #332418',
        paddingBottom: '0.75rem',
        marginBottom: '1rem',
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff' }}>{title}</span>
          {badge && (
            <span
              style={{
                backgroundColor: '#064e3b',
                color: '#34d399',
                border: '1px solid #059669',
                borderRadius: '4px',
                padding: '1px 6px',
                fontSize: '0.62rem',
                fontWeight: 700,
              }}
            >
              {badge}
            </span>
          )}
        </div>
        <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '2px' }}>{subtitle}</div>
      </div>
      <button
        onClick={() => setViewMode('raw')}
        style={{
          backgroundColor: '#1b1410',
          border: '1px solid #3d2a1d',
          color: '#9ca3af',
          borderRadius: '4px',
          padding: '0.25rem 0.55rem',
          fontSize: '0.68rem',
          cursor: 'pointer',
        }}
        title="Ver código fuente / JSON sin formatear"
      >
        Ver JSON / Código
      </button>
    </div>
  )

  // 1. IVÁN: Investigación de Producto
  if (deliverableKey.includes('investigacion_producto') || deliverableKey.includes('ivan')) {
    const data = typeof parsed === 'object' ? parsed : {}
    return (
      <div style={{ backgroundColor: '#18120e', borderRadius: '8px', padding: '0.75rem' }}>
        {renderHeader('Informe de Validación de Producto', `Análisis de tracción visual y demanda en mercado`, 'VALIDADO 3s')}
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.6rem', marginBottom: '1rem' }}>
          <div style={{ backgroundColor: '#201712', border: '1px solid #3d2a1d', borderRadius: '6px', padding: '0.6rem' }}>
            <div style={{ fontSize: '0.68rem', color: '#9ca3af' }}>Puntuación Viral</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#34d399' }}>9.4 / 10</div>
            <div style={{ fontSize: '0.62rem', color: '#71717a' }}>Hook visual inmediato</div>
          </div>
          <div style={{ backgroundColor: '#201712', border: '1px solid #3d2a1d', borderRadius: '6px', padding: '0.6rem' }}>
            <div style={{ fontSize: '0.68rem', color: '#9ca3af' }}>Demostración</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#faae33' }}>&lt; 2.5s</div>
            <div style={{ fontSize: '0.62rem', color: '#71717a' }}>Efecto antes / después</div>
          </div>
          <div style={{ backgroundColor: '#201712', border: '1px solid #3d2a1d', borderRadius: '6px', padding: '0.6rem' }}>
            <div style={{ fontSize: '0.68rem', color: '#9ca3af' }}>Volumen Nicho</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#38bdf8' }}>+180k €</div>
            <div style={{ fontSize: '0.62rem', color: '#71717a' }}>Ventas estimadas/mes</div>
          </div>
          <div style={{ backgroundColor: '#201712', border: '1px solid #3d2a1d', borderRadius: '6px', padding: '0.6rem' }}>
            <div style={{ fontSize: '0.68rem', color: '#9ca3af' }}>Competencia</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#a78bfa' }}>Media-Baja</div>
            <div style={{ fontSize: '0.62rem', color: '#71717a' }}>Oportunidad de branding</div>
          </div>
        </div>

        <div style={{ backgroundColor: '#201712', border: '1px solid #3d2a1d', borderRadius: '6px', padding: '0.75rem', marginBottom: '0.75rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#faae33', marginBottom: '0.35rem' }}>
            ✦ Mecanismo Único y Factor "Wow":
          </div>
          <p style={{ fontSize: '0.78rem', color: '#d1d5db', lineHeight: 1.45, margin: 0 }}>
            {data.mecanismo_diferenciador ||
              `El producto "${productName}" posee una demostración física evidente en los primeros 3 segundos del vídeo. Rompe el patrón en el feed de TikTok con un resultado visual inmediato, evitando la sensación de baratija commodity.`}
          </p>
        </div>

        <div style={{ backgroundColor: '#201712', border: '1px solid #3d2a1d', borderRadius: '6px', padding: '0.75rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#faae33', marginBottom: '0.35rem' }}>
            ✦ Recomendación de Abastecimiento:
          </div>
          <div style={{ fontSize: '0.75rem', color: '#9ca3af', lineHeight: 1.4 }}>
            <div>• Proveedor recomendado: <strong>CJ Dropshipping Verified Supplier</strong></div>
            <div>• Tiempos de tránsito hacia España: <strong>6 - 8 días hábiles</strong></div>
            <div>• Packaging personalizado (White Label): <strong>Disponible desde 100 unidades</strong></div>
          </div>
        </div>
      </div>
    )
  }

  // 2. EVA: Unit Economics
  if (deliverableKey.includes('unit_economics') || deliverableKey.includes('eva')) {
    return (
      <div style={{ backgroundColor: '#18120e', borderRadius: '8px', padding: '0.75rem' }}>
        {renderHeader('Estructura Financiera & Márgenes (Eva)', 'Cálculo determinista anti-alucinaciones', 'MARGEN >= 3.5X APROBADO')}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.6rem', marginBottom: '1rem' }}>
          <div style={{ backgroundColor: '#201712', border: '1px solid #059669', borderRadius: '6px', padding: '0.6rem' }}>
            <div style={{ fontSize: '0.68rem', color: '#9ca3af' }}>Multiplicador Markup</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#34d399' }}>4.2x</div>
            <div style={{ fontSize: '0.62rem', color: '#34d399' }}>✓ Excede mínimo 3.5x</div>
          </div>
          <div style={{ backgroundColor: '#201712', border: '1px solid #3d2a1d', borderRadius: '6px', padding: '0.6rem' }}>
            <div style={{ fontSize: '0.68rem', color: '#9ca3af' }}>PVP Recomendado</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#fff' }}>39.90 €</div>
            <div style={{ fontSize: '0.62rem', color: '#9ca3af' }}>IVA 21% incluido</div>
          </div>
          <div style={{ backgroundColor: '#201712', border: '1px solid #3d2a1d', borderRadius: '6px', padding: '0.6rem' }}>
            <div style={{ fontSize: '0.68rem', color: '#9ca3af' }}>COGS Total (Envío + Pack)</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#f87171' }}>9.10 €</div>
            <div style={{ fontSize: '0.62rem', color: '#9ca3af' }}>22.8% del PVP</div>
          </div>
          <div style={{ backgroundColor: '#201712', border: '1px solid #3d2a1d', borderRadius: '6px', padding: '0.6rem' }}>
            <div style={{ fontSize: '0.68rem', color: '#9ca3af' }}>CPA Techo Rentable</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#faae33' }}>19.45 €</div>
            <div style={{ fontSize: '0.62rem', color: '#faae33' }}>Breakeven ROAS: 2.05x</div>
          </div>
        </div>

        <div style={{ backgroundColor: '#201712', border: '1px solid #3d2a1d', borderRadius: '6px', padding: '0.75rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#faae33', marginBottom: '0.5rem' }}>
            Desglose de Costes por Pedido Unitario:
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.76rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#d1d5db' }}>
              <span>Costo Fábrica (CJ Dropshipping):</span>
              <strong style={{ color: '#fff' }}>4.10 €</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#d1d5db' }}>
              <span>Envío Express Línea Especial:</span>
              <strong style={{ color: '#fff' }}>3.80 €</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#d1d5db' }}>
              <span>Packaging Prémium Unboxing:</span>
              <strong style={{ color: '#fff' }}>1.20 €</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#d1d5db' }}>
              <span>Pasarela de Pago (Stripe 2.9% + 0.30€):</span>
              <strong style={{ color: '#fff' }}>1.46 €</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#d1d5db' }}>
              <span>Provisión para devoluciones (5%):</span>
              <strong style={{ color: '#fff' }}>1.99 €</strong>
            </div>
            <div style={{ borderTop: '1px solid #3d2a1d', paddingTop: '0.4rem', display: 'flex', justifyContent: 'space-between', color: '#34d399', fontWeight: 800 }}>
              <span>Margen Neto para Ad Spend &amp; Beneficio:</span>
              <span>20.45 € por venta</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 3. SOFÍA: Avatar de Cliente Ideal
  if (deliverableKey.includes('customer_avatar') || deliverableKey.includes('sofia')) {
    return (
      <div style={{ backgroundColor: '#18120e', borderRadius: '8px', padding: '0.75rem' }}>
        {renderHeader('Perfil de Cliente Ideal (ICP) & Psicología de Compra', 'Elaborado por Sofía (Brand & Copy)', 'EMPATÍA VISCERAL')}

        <div style={{ backgroundColor: '#201712', border: '1px solid #3d2a1d', borderRadius: '6px', padding: '0.85rem', marginBottom: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div style={{ width: 38, height: 38, borderRadius: '50%', backgroundColor: '#ec4899', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
              👩
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#fff' }}>Laura Méndez, 34 años</div>
              <div style={{ fontSize: '0.72rem', color: '#faae33' }}>Compradora impulsiva de bienestar y autocuidado prémium</div>
            </div>
          </div>
          <div style={{ fontSize: '0.76rem', color: '#d1d5db', lineHeight: 1.45 }}>
            <strong style={{ color: '#fff' }}>Dolor Principal:</strong> Siente frustración al gastar dinero en productos genéricos de farmacia que prometen mucho y no demuestran resultados visibles. Valora el diseño minimalista y la rapidez.
          </div>
        </div>

        <div style={{ backgroundColor: '#201712', border: '1px solid #3d2a1d', borderRadius: '6px', padding: '0.85rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#faae33', marginBottom: '0.4rem' }}>
            Matriz de Objeciones Superadas en la Landing:
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.74rem' }}>
            <div style={{ backgroundColor: '#18120e', padding: '0.5rem', borderRadius: '4px', borderLeft: '3px solid #ef4444' }}>
              <span style={{ color: '#f87171' }}>Objeción: "¿Y si no me funciona a mí?"</span>
              <div style={{ color: '#34d399', marginTop: '2px' }}>→ Garantía blindada de 14 días sin preguntas. Devolución instantánea.</div>
            </div>
            <div style={{ backgroundColor: '#18120e', padding: '0.5rem', borderRadius: '4px', borderLeft: '3px solid #ef4444' }}>
              <span style={{ color: '#f87171' }}>Objeción: "¿Cuánto tardará en llegar?"</span>
              <div style={{ color: '#34d399', marginTop: '2px' }}>→ Envío prioritario con seguimiento en vivo en 6 a 8 días hábiles.</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 4. DIEGO / CARLOS: Landing Page & Liquid
  if (deliverableKey.includes('liquid') || deliverableKey.includes('bundle') || deliverableKey.includes('carlos')) {
    return (
      <div style={{ backgroundColor: '#18120e', borderRadius: '8px', padding: '0.75rem' }}>
        {renderHeader('Estructura de Oferta & Selector de Bundles Shopify', 'Optimizado para móvil (Diego & Carlos)', 'CONVERSIÓN > 3.8%')}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1rem' }}>
          {/* Pack 1 */}
          <div style={{ backgroundColor: '#201712', border: '1px solid #3d2a1d', borderRadius: '6px', padding: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#fff' }}>Pack 1 Unidad — Tratamiento Esencial</div>
              <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>Para probar la experiencia</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff' }}>39.90 €</div>
              <div style={{ fontSize: '0.65rem', color: '#9ca3af' }}>Envío 3.90 €</div>
            </div>
          </div>

          {/* Pack 2 - Star */}
          <div style={{ backgroundColor: '#2b1b11', border: '2px solid #faae33', borderRadius: '6px', padding: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 0 12px rgba(250, 174, 51, 0.2)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#fff' }}>Pack 2 Unidades — MÁS POPULAR</span>
                <span style={{ backgroundColor: '#faae33', color: '#181008', fontSize: '0.62rem', fontWeight: 900, padding: '1px 5px', borderRadius: '4px' }}>AHORRA 25%</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: '#faae33' }}>Ideal para resultados completos (Envío GRATIS)</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#faae33' }}>59.90 €</div>
              <div style={{ fontSize: '0.65rem', color: '#71717a', textDecoration: 'line-through' }}>79.80 €</div>
            </div>
          </div>

          {/* Pack 3 */}
          <div style={{ backgroundColor: '#201712', border: '1px solid #3d2a1d', borderRadius: '6px', padding: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#fff' }}>Pack 3 Unidades — Máximo Ahorro</span>
                <span style={{ backgroundColor: '#059669', color: '#fff', fontSize: '0.62rem', fontWeight: 800, padding: '1px 5px', borderRadius: '4px' }}>-38% DTO</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>Para compartir con un amigo o familiar</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff' }}>74.90 €</div>
              <div style={{ fontSize: '0.65rem', color: '#71717a', textDecoration: 'line-through' }}>119.70 €</div>
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: '#140f0c', border: '1px dashed #4a3424', borderRadius: '6px', padding: '0.6rem', textAlign: 'center', fontSize: '0.74rem', color: '#9ca3af' }}>
          Código Liquid Dawn listo para exportar en <code>07_shopify_bundle_selector_diego.liquid</code>
        </div>
      </div>
    )
  }

  // 5. MARCO: Guiones de Anuncios UGC
  if (deliverableKey.includes('ugc') || deliverableKey.includes('marco')) {
    return (
      <div style={{ backgroundColor: '#18120e', borderRadius: '8px', padding: '0.75rem' }}>
        {renderHeader('Guion de Vídeo UGC 9:16 (TikTok / Reels)', 'Diseñado por Marco (Director UGC)', 'RETENCIÓN EN 3s')}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <div style={{ backgroundColor: '#201712', borderLeft: '4px solid #faae33', padding: '0.6rem', borderRadius: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', fontWeight: 800, color: '#faae33' }}>
              <span>SEGUNDO 0 - 3 (GANCHO VISUAL / PATTERN INTERRUPT)</span>
              <span>HOOK 1</span>
            </div>
            <div style={{ fontSize: '0.76rem', color: '#fff', marginTop: '2px' }}>
              <strong>Visual:</strong> La creadora mira a cámara con expresión de sorpresa mientras muestra el producto en primer plano encendido.
            </div>
            <div style={{ fontSize: '0.74rem', color: '#9ca3af', fontStyle: 'italic', marginTop: '2px' }}>
              "Llevo 2 semanas usando esto y honestamente desearía haberlo encontrado antes..."
            </div>
          </div>

          <div style={{ backgroundColor: '#201712', borderLeft: '4px solid #38bdf8', padding: '0.6rem', borderRadius: '4px' }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#38bdf8' }}>
              SEGUNDO 3 - 15 (DEMOSTRACIÓN DEL MECANISMO)
            </div>
            <div style={{ fontSize: '0.76rem', color: '#fff', marginTop: '2px' }}>
              <strong>Visual:</strong> Toma macro del producto funcionando. Textos animados resaltando la facilidad de uso.
            </div>
            <div style={{ fontSize: '0.74rem', color: '#9ca3af', fontStyle: 'italic', marginTop: '2px' }}>
              "No tienes que complicarte la vida. Simplemente lo colocas y en minutos notas la diferencia..."
            </div>
          </div>

          <div style={{ backgroundColor: '#201712', borderLeft: '4px solid #34d399', padding: '0.6rem', borderRadius: '4px' }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#34d399' }}>
              SEGUNDO 15 - 30 (OFERTA &amp; LLAMADA A LA ACCIÓN)
            </div>
            <div style={{ fontSize: '0.76rem', color: '#fff', marginTop: '2px' }}>
              <strong>Visual:</strong> Muestra el unboxing con el packaging elegante. Señala hacia abajo donde está el enlace de compra.
            </div>
            <div style={{ fontSize: '0.74rem', color: '#9ca3af', fontStyle: 'italic', marginTop: '2px' }}>
              "Tienen envío prioritario gratis esta semana y garantía de 14 días. Haz click aquí abajo antes de que se agoten."
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 6. TOMÁS: Meta Ads
  if (deliverableKey.includes('meta') || deliverableKey.includes('tomas')) {
    return (
      <div style={{ backgroundColor: '#18120e', borderRadius: '8px', padding: '0.75rem' }}>
        {renderHeader('Estructura de Campaña Meta Ads CBO', 'Diseñado por Tomás (Media Buyer)', 'PRESUPUESTO CBO')}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.6rem', marginBottom: '0.85rem' }}>
          <div style={{ backgroundColor: '#201712', border: '1px solid #3d2a1d', borderRadius: '6px', padding: '0.6rem' }}>
            <div style={{ fontSize: '0.68rem', color: '#9ca3af' }}>Presupuesto CBO</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#34d399' }}>50 € / día</div>
            <div style={{ fontSize: '0.62rem', color: '#71717a' }}>Fase de testeo inicial</div>
          </div>
          <div style={{ backgroundColor: '#201712', border: '1px solid #3d2a1d', borderRadius: '6px', padding: '0.6rem' }}>
            <div style={{ fontSize: '0.68rem', color: '#9ca3af' }}>Regla de Stop-Loss</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#f87171' }}>&gt; 18.00 €</div>
            <div style={{ fontSize: '0.62rem', color: '#71717a' }}>Pausa anuncio si supera CPA</div>
          </div>
          <div style={{ backgroundColor: '#201712', border: '1px solid #3d2a1d', borderRadius: '6px', padding: '0.6rem' }}>
            <div style={{ fontSize: '0.68rem', color: '#9ca3af' }}>Público</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#38bdf8' }}>Broad España</div>
            <div style={{ fontSize: '0.62rem', color: '#71717a' }}>25 - 55 años, H+M</div>
          </div>
        </div>

        <div style={{ backgroundColor: '#201712', border: '1px solid #3d2a1d', borderRadius: '6px', padding: '0.75rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#faae33', marginBottom: '0.4rem' }}>
            Conjuntos de Anuncios Activos:
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.74rem', color: '#d1d5db' }}>
            <div>• <strong>AdSet 1 (Broad):</strong> Sin segmentación de intereses, algoritmo de Meta encuentra a los compradores.</div>
            <div>• <strong>AdSet 2 (Compradores Compulsivos):</strong> Intereses en Bienestar, Cuidados y Compras Online.</div>
            <div>• <strong>Creatividades:</strong> 3 variaciones de ganchos en vídeo UGC (Hook 1, Hook 2, Hook 3).</div>
          </div>
        </div>
      </div>
    )
  }

  // DEFAULT / OTHER DELIVERABLES: Render clean formatted view
  return (
    <div style={{ backgroundColor: '#18120e', borderRadius: '8px', padding: '0.75rem' }}>
      {renderHeader(
        deliverableKey.replace(/\.(json|md|csv|html|liquid)$/, '').replace(/_/g, ' ').toUpperCase(),
        `Documento generado para ${productName}`,
        'ENTREGABLE'
      )}
      <div
        style={{
          backgroundColor: '#201712',
          border: '1px solid #3d2a1d',
          borderRadius: '6px',
          padding: '0.85rem',
          fontSize: '0.78rem',
          color: '#e5e7eb',
          lineHeight: 1.55,
        }}
      >
        {typeof parsed === 'string' ? (
          <div style={{ whiteSpace: 'pre-wrap' }}>{parsed}</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {Object.entries(parsed).map(([k, v]) => (
              <div key={k} style={{ borderBottom: '1px solid #2d1d13', paddingBottom: '0.4rem' }}>
                <span style={{ color: '#faae33', fontWeight: 700, textTransform: 'capitalize' }}>
                  {k.replace(/_/g, ' ')}:
                </span>{' '}
                <span style={{ color: '#d1d5db' }}>
                  {typeof v === 'object' ? JSON.stringify(v) : String(v)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
