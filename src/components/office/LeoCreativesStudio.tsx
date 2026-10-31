'use client'

import React, { useState } from 'react'
import JSZip from 'jszip'
import { useOfficeStore } from '@/lib/office/store'

interface CreativeFormat {
  id: string
  title: string
  format: '1:1' | '9:16'
  aspectRatioLabel: string
  placement: string
  basePrompt: string
  headline: string
  primaryText: string
  ctaText: string
  urgencyBadge?: string
  width: number
  height: number
  script?: {
    hook: string
    body: string
    cta: string
  }
}

export function LeoCreativesStudio() {
  const store = useOfficeStore()
  const activeOffice = store.offices[store.activeOfficeId]
  const productName = activeOffice?.product?.name || 'Anillo Inteligente de Titanio'
  const brandName = activeOffice?.brand?.name || 'AuraTitanium'
  const niche = activeOffice?.product?.niche || 'Wellness y Joyería Inteligente'

  // Style selector
  const [styleMode, setStyleMode] = useState<'lujo' | 'nordico' | 'cyber' | 'calido'>('lujo')
  const [seedMap, setSeedMap] = useState<Record<string, number>>({})
  const [isZipping, setIsZipping] = useState(false)
  const [customEdits, setCustomEdits] = useState<Record<string, string>>({})
  const [activeTab, setActiveTab] = useState<'all' | 'meta' | 'tiktok' | 'infographic'>('all')

  const getStyleModifier = () => {
    switch (styleMode) {
      case 'nordico':
        return 'scandinavian minimalist design, light oak wood and white plaster background, soft natural daylight, peaceful neutral tones'
      case 'cyber':
        return 'sleek dark obsidian aesthetic, subtle cyan and amber rim lighting, futuristic titanium tech backdrop, moody contrast'
      case 'calido':
        return 'warm sunset golden hour sunlight, cozy organic Mediterranean home textures, terracotta and linen, premium lifestyle feel'
      case 'lujo':
      default:
        return 'luxury high-end commercial packaging photography, travertine marble stone pedestal, museum studio lighting, pristine clean reflection, 8k award-winning d2c advertising'
    }
  }

  const creatives: CreativeFormat[] = [
    {
      id: 'hero_packshot',
      title: 'Fotografía Hero de Packshot & Packaging (1:1)',
      format: '1:1',
      aspectRatioLabel: '1:1 Cuadrado (800x800)',
      placement: 'Feed de Instagram & Facebook / Encabezado de Landing',
      width: 800,
      height: 800,
      basePrompt: `luxury premium magnetic gift box with metallic embossed "${brandName}" branding, showcasing the product "${productName}" resting on a honed travertine stone block, cinematic soft commercial lighting, high-end cosmetics packaging aesthetic, ultra detailed, photorealistic`,
      headline: `Diseñado para quienes buscan excelencia: Conoce ${brandName}`,
      primaryText: `Olvídate de las copias plásticas y las suscripciones abusivas. ${brandName} te ofrece ingeniería de precisión en un acabado que despierta miradas desde el primer unboxing.`,
      ctaText: 'Ver Colección Exclusiva',
    },
    {
      id: 'lifestyle_in_use',
      title: 'Lifestyle Aspiracional en Escenario Real (1:1)',
      format: '1:1',
      aspectRatioLabel: '1:1 Cuadrado (800x800)',
      placement: 'Anuncios de Prospección / Carrusel Slide 2',
      width: 800,
      height: 800,
      basePrompt: `candid photorealistic lifestyle shot of an attractive confident European professional using "${productName}" during a calm morning coffee ritual in a luxury designer loft, natural sunlight, organic tones, authentic, elegant aesthetic`,
      headline: `Tu rutina diaria, elevada al siguiente nivel`,
      primaryText: `La verdadera sofisticación no interrumpe tu día: se integra con él de manera natural. Siente la ligereza y el confort de ${brandName} las 24 horas del día.`,
      ctaText: 'Pedir con Envío Gratis',
    },
    {
      id: 'macro_mechanism',
      title: 'Macro Demostración: Mecanismo de Acción <3s (1:1)',
      format: '1:1',
      aspectRatioLabel: '1:1 Cuadrado (800x800)',
      placement: 'Retargeting / Anuncios de Prueba Científica & Confianza',
      width: 800,
      height: 800,
      basePrompt: `extreme macro lens close-up of "${productName}", highlighting the microscopic interior precision components and high grade medical material finish, subtle glowing indicators, high tech aerospace engineering, depth of field`,
      headline: `Ingeniería de grado aeroespacial en cada milímetro`,
      primaryText: `¿Por qué ${brandName} supera a cualquier alternativa del mercado? Inspecciona los detalles internos que garantizan máxima durabilidad y precisión clínica comprobada.`,
      ctaText: 'Descubrir la Tecnología',
    },
    {
      id: 'tiktok_vertical_ad',
      title: 'Anuncio Vertical TikTok & Reels de Alto Impacto (9:16)',
      format: '9:16',
      aspectRatioLabel: '9:16 Vertical (576x1024)',
      placement: 'TikTok Ads / Instagram Reels / YouTube Shorts',
      width: 576,
      height: 1024,
      urgencyBadge: '🔥 -40% LANZAMIENTO',
      basePrompt: `POV smartphone selfie video frame of a creator holding and showing "${productName}" with pure surprise, aesthetic modern bedroom background, bright dynamic ring light, viral TikTok ugc aesthetic`,
      headline: `"La mejor decisión que he tomado este año... sin pagar 6€ al mes"`,
      primaryText: `Guión UGC probado: Gancho visual en 2.8s + demostración del unboxing + comparación directa con marcas sobrevaloradas.`,
      ctaText: 'Comprar con 40% OFF',
      script: {
        hook: '00:00-00:03: "¿Sigues pagando suscripciones mensuales por medir tu cuerpo? Tienes que ver esto..."',
        body: '00:03-00:10: Muestra el unboxing de la caja magnética. Se lo pone en el dedo y enseña la app sincronizada en tiempo real sin pantallas molestas.',
        cta: '00:10-00:15: "Tienen un 40% de descuento solo esta semana con 3 años de garantía española. Clic abajo."',
      },
    },
    {
      id: 'comparison_infographic',
      title: 'Infografía Comparativa: Nuestra Marca vs Genéricos (1:1)',
      format: '1:1',
      aspectRatioLabel: '1:1 Cuadrado (800x800)',
      placement: 'Landing Page Sezione Comparativa / Meta Feed',
      width: 800,
      height: 800,
      basePrompt: `commercial side-by-side product studio comparison, luxury sleek "${productName}" on the left side with radiant green checkmarks vs cheap generic plastic counterpart on the right side with red warning symbols, clear modern marketing infographic graphic design`,
      headline: `Por qué ${brandName} vs Las Copias Baratas de 15€`,
      primaryText: `1. Titanio Grado 5 auténtico (vs plástico pintado). 2. Cero suscripciones mensuales de por vida. 3. Garantía oficial europea de 3 años con reemplazo express.`,
      ctaText: 'Elegir Calidad Garantizada',
    },
    {
      id: 'meta_direct_response',
      title: 'Banner Publicitario Meta de Alta Conversión (1:1)',
      format: '1:1',
      aspectRatioLabel: '1:1 Cuadrado (800x800)',
      placement: 'Feed de Meta Ads / Campañas CBO de Tomás',
      width: 800,
      height: 800,
      basePrompt: `high converting commercial advertisement poster for "${productName}", premium dark obsidian podium, clean gold typography accents, direct response luxury d2c e-commerce product poster`,
      headline: `⭐ ⭐ ⭐ ⭐ ⭐ 4.9/5 por más de 1.400 clientes en España`,
      primaryText: `Pack de lanzamiento exclusivo con estuche rígido de viaje y cargador inalámbrico de regalo. Cupos limitados a las primeras 100 unidades del lote nacional.`,
      ctaText: 'Reclamar Oferta de Lanzamiento',
    },
  ]

  const getImageUrl = (creative: CreativeFormat) => {
    const seed = seedMap[creative.id] || 42
    const custom = customEdits[creative.id]
    const fullPrompt = custom || `${creative.basePrompt}, ${getStyleModifier()}`
    const encoded = encodeURIComponent(fullPrompt)
    return `https://image.pollinations.ai/prompt/${encoded}?width=${creative.width}&height=${creative.height}&seed=${seed}&nologo=true`
  }

  const handleRegenerate = (id: string) => {
    setSeedMap((prev) => ({
      ...prev,
      [id]: Math.floor(Math.random() * 999999),
    }))
  }

  const handleDownloadSingle = async (creative: CreativeFormat) => {
    const url = getImageUrl(creative)
    try {
      const res = await fetch(url)
      const blob = await res.blob()
      const blobUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = blobUrl
      a.download = `${brandName.toLowerCase()}_${creative.id}_${creative.format.replace(':', 'x')}.jpg`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(blobUrl)
    } catch (err) {
      // Direct link fallback
      window.open(url, '_blank')
    }
  }

  const handleDownloadAllZip = async () => {
    setIsZipping(true)
    try {
      const zip = new JSZip()
      const folder = zip.folder(`${brandName.replace(/\s+/g, '_')}_Creativos_Leo`) || zip

      // Add image downloads
      for (const cr of creatives) {
        const url = getImageUrl(cr)
        try {
          const res = await fetch(url)
          const blob = await res.blob()
          folder.file(`${cr.id}_${cr.format.replace(':', 'x')}.jpg`, blob)
        } catch {
          // fallback placeholder text if fetch fails
          folder.file(`${cr.id}_url.txt`, `URL del creativo: ${url}\nPrompt: ${cr.basePrompt}`)
        }
      }

      // Add comprehensive advertising copy file
      const copyDoc = `============================================================
${brandName.toUpperCase()} — PAQUETE DE CREATIVOS PUBLICITARIOS (LEO)
Producto: ${productName} (${niche})
Generados para Campañas de Escala en Meta Ads & TikTok
============================================================

${creatives
  .map(
    (c, idx) => `
------------------------------------------------------------
FORMATO ${idx + 1}: ${c.title.toUpperCase()}
Ubicación: ${c.placement}
Relación de Aspecto: ${c.aspectRatioLabel}
------------------------------------------------------------
TITULAR (HEADLINE):
${c.headline}

TEXTO PRINCIPAL (PRIMARY COPY):
${c.primaryText}

LLAMADA A LA ACCIÓN (CTA):
${c.ctaText}

${
  c.script
    ? `GUIÓN PUBLICITARIO UGC (15s):
Hook (0-3s): ${c.script.hook}
Desarrollo (3-10s): ${c.script.body}
Cierre CTA (10-15s): ${c.script.cta}
`
    : ''
}
PROMPT VISUAL UTILIZADO:
${c.basePrompt}
`
  )
  .join('\n')}`

      folder.file('COPIES_Y_GUIONES_ANUNCIOS.txt', copyDoc)

      const content = await zip.generateAsync({ type: 'blob' })
      const zipUrl = URL.createObjectURL(content)
      const a = document.createElement('a')
      a.href = zipUrl
      a.download = `${brandName.replace(/\s+/g, '_')}_Creativos_Completos_HD.zip`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(zipUrl)
    } catch (err) {
      console.error('Error zipping creatives:', err)
    } finally {
      setIsZipping(false)
    }
  }

  const filteredCreatives = creatives.filter((c) => {
    if (activeTab === 'meta') return c.format === '1:1' && c.id !== 'tiktok_vertical_ad'
    if (activeTab === 'tiktok') return c.format === '9:16'
    if (activeTab === 'infographic') return c.id === 'comparison_infographic' || c.id === 'macro_mechanism'
    return true
  })

  return (
    <div
      style={{
        backgroundColor: '#16110e',
        border: '1px solid #3d2a1d',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      }}
    >
      {/* Studio Header Bar */}
      <div
        style={{
          padding: '1.25rem 1.5rem',
          background: 'linear-gradient(180deg, #241812, #18120e)',
          borderBottom: '1px solid #332418',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span
              style={{
                backgroundColor: 'rgba(250, 174, 51, 0.15)',
                color: '#faae33',
                fontSize: '0.72rem',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '4px',
                border: '1px solid rgba(250, 174, 51, 0.3)',
              }}
            >
              ESTUDIO CREATIVO DE LEO
            </span>
            <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 700 }}>
              ● 6 Formatos Listos para Campaña
            </span>
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#fff', margin: 0 }}>
            Creativos Visuales de Alta Conversión para {brandName}
          </h2>
          <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '2px' }}>
            Producto activo: <strong style={{ color: '#faae33' }}>{productName}</strong> ({niche})
          </div>
        </div>

        {/* Global Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Style Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#201612', padding: '4px 8px', borderRadius: '6px', border: '1px solid #3d2a1d' }}>
            <span style={{ fontSize: '0.72rem', color: '#9ca3af' }}>Ángulo:</span>
            <select
              value={styleMode}
              onChange={(e) => setStyleMode(e.target.value as any)}
              style={{
                background: '#140f0c',
                border: '1px solid #4a3424',
                color: '#faae33',
                fontSize: '0.75rem',
                padding: '3px 6px',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              <option value="lujo">Estudio de Lujo &amp; Mármol</option>
              <option value="nordico">Nórdico Minimalista</option>
              <option value="cyber">Cyberpunk &amp; Obsidiana</option>
              <option value="calido">Cálido / Luz Natural</option>
            </select>
          </div>

          {/* Download All as ZIP */}
          <button
            onClick={handleDownloadAllZip}
            disabled={isZipping}
            style={{
              background: 'linear-gradient(135deg, #faae33, #d98216)',
              color: '#181008',
              border: 'none',
              borderRadius: '6px',
              padding: '0.6rem 1.1rem',
              fontSize: '0.82rem',
              fontWeight: 800,
              cursor: isZipping ? 'wait' : 'pointer',
              boxShadow: '0 4px 14px rgba(250, 174, 51, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <span>📦</span>
            <span>{isZipping ? 'Comprimiendo HD...' : 'Descargar los 6 Creativos (ZIP)'}</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div
        style={{
          display: 'flex',
          backgroundColor: '#120d0a',
          borderBottom: '1px solid #332418',
          padding: '0 1rem',
          overflowX: 'auto',
        }}
      >
        <button
          onClick={() => setActiveTab('all')}
          style={{
            padding: '0.7rem 1.1rem',
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'all' ? '2px solid #faae33' : '2px solid transparent',
            color: activeTab === 'all' ? '#faae33' : '#9ca3af',
            fontSize: '0.8rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Todos los Creativos (6)
        </button>
        <button
          onClick={() => setActiveTab('meta')}
          style={{
            padding: '0.7rem 1.1rem',
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'meta' ? '2px solid #faae33' : '2px solid transparent',
            color: activeTab === 'meta' ? '#faae33' : '#9ca3af',
            fontSize: '0.8rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Meta Ads &amp; Feed 1:1 (4)
        </button>
        <button
          onClick={() => setActiveTab('tiktok')}
          style={{
            padding: '0.7rem 1.1rem',
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'tiktok' ? '2px solid #faae33' : '2px solid transparent',
            color: activeTab === 'tiktok' ? '#faae33' : '#9ca3af',
            fontSize: '0.8rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          TikTok &amp; Reels 9:16 (1)
        </button>
        <button
          onClick={() => setActiveTab('infographic')}
          style={{
            padding: '0.7rem 1.1rem',
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'infographic' ? '2px solid #faae33' : '2px solid transparent',
            color: activeTab === 'infographic' ? '#faae33' : '#9ca3af',
            fontSize: '0.8rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Prueba de Mecanismo &amp; Comparativas (2)
        </button>
      </div>

      {/* Creatives Grid */}
      <div style={{ padding: '1.25rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>
        {filteredCreatives.map((creative) => {
          const imgUrl = getImageUrl(creative)
          const isVertical = creative.format === '9:16'

          return (
            <div
              key={creative.id}
              style={{
                backgroundColor: '#1e1611',
                border: '1px solid #3d2a1d',
                borderRadius: '10px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s ease, border-color 0.2s ease',
              }}
            >
              {/* Media Container */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: isVertical ? '480px' : '320px',
                  backgroundColor: '#120d0a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={imgUrl}
                  alt={creative.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: isVertical ? 'contain' : 'cover',
                    backgroundColor: '#0a0806',
                  }}
                  loading="lazy"
                  onError={(e) => {
                    // Fallback visually if offline
                    (e.target as HTMLElement).style.opacity = '0.5'
                  }}
                />

                {/* Aspect Ratio Badge */}
                <span
                  style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    background: 'rgba(0, 0, 0, 0.75)',
                    backdropFilter: 'blur(4px)',
                    color: '#faae33',
                    border: '1px solid rgba(250, 174, 51, 0.4)',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    padding: '3px 8px',
                    borderRadius: '4px',
                  }}
                >
                  {creative.aspectRatioLabel}
                </span>

                {/* Urgency Badge if present */}
                {creative.urgencyBadge && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: 'rgba(239, 68, 68, 0.9)',
                      color: '#fff',
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: '4px',
                      boxShadow: '0 2px 8px rgba(239, 68, 68, 0.5)',
                    }}
                  >
                    {creative.urgencyBadge}
                  </span>
                )}

                {/* Quick Action Overlay Buttons */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '10px',
                    right: '10px',
                    display: 'flex',
                    gap: '0.4rem',
                  }}
                >
                  <button
                    onClick={() => handleRegenerate(creative.id)}
                    title="Regenerar con nuevo ángulo y variación"
                    style={{
                      background: 'rgba(24, 16, 12, 0.85)',
                      backdropFilter: 'blur(4px)',
                      color: '#faae33',
                      border: '1px solid #4a3424',
                      borderRadius: '6px',
                      padding: '5px 10px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    ⚡ Regenerar
                  </button>
                  <button
                    onClick={() => handleDownloadSingle(creative)}
                    title="Descargar imagen en alta resolución"
                    style={{
                      background: 'rgba(250, 174, 51, 0.9)',
                      color: '#181008',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '5px 10px',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
                  >
                    📥 Descargar HD
                  </button>
                </div>
              </div>

              {/* Copy & Strategy Content */}
              <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                    {creative.placement}
                  </div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff', margin: '0 0 0.5rem 0' }}>
                    {creative.title}
                  </h3>

                  {/* Ad Copy Box */}
                  <div
                    style={{
                      backgroundColor: '#140f0c',
                      border: '1px solid #332418',
                      borderRadius: '6px',
                      padding: '0.75rem',
                      marginBottom: '0.75rem',
                    }}
                  >
                    <div style={{ fontSize: '0.72rem', color: '#faae33', fontWeight: 700, marginBottom: '0.25rem' }}>
                      Titular Gancho:
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#fff', fontWeight: 700, marginBottom: '0.5rem' }}>
                      {creative.headline}
                    </div>

                    <div style={{ fontSize: '0.72rem', color: '#9ca3af', fontWeight: 700, marginBottom: '0.25rem' }}>
                      Cuerpo del Anuncio:
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#d1d5db', lineHeight: 1.4 }}>
                      {creative.primaryText}
                    </div>
                  </div>

                  {/* TikTok Script Box if vertical */}
                  {creative.script && (
                    <div
                      style={{
                        backgroundColor: '#161a22',
                        border: '1px solid #233142',
                        borderRadius: '6px',
                        padding: '0.75rem',
                        marginBottom: '0.75rem',
                      }}
                    >
                      <div style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 800, marginBottom: '0.4rem' }}>
                        🎬 Guión UGC para Creador (15s):
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#cbd5e1', lineHeight: 1.4 }}>
                        <p style={{ margin: '0 0 0.3rem 0' }}>
                          <strong style={{ color: '#38bdf8' }}>Hook:</strong> {creative.script.hook}
                        </p>
                        <p style={{ margin: '0 0 0.3rem 0' }}>
                          <strong style={{ color: '#38bdf8' }}>Cuerpo:</strong> {creative.script.body}
                        </p>
                        <p style={{ margin: 0 }}>
                          <strong style={{ color: '#38bdf8' }}>CTA:</strong> {creative.script.cta}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer with CTA and Prompt Details */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #332418', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      color: '#34d399',
                      fontWeight: 700,
                      background: 'rgba(52, 211, 153, 0.1)',
                      padding: '2px 8px',
                      borderRadius: '4px',
                    }}
                  >
                    CTA: {creative.ctaText}
                  </span>

                  <button
                    onClick={() => {
                      const newPrompt = prompt('Editar prompt de IA:', creative.basePrompt)
                      if (newPrompt) {
                        setCustomEdits((prev) => ({ ...prev, [creative.id]: newPrompt }))
                        handleRegenerate(creative.id)
                      }
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#9ca3af',
                      fontSize: '0.72rem',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                    }}
                  >
                    Ajustar Prompt
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
