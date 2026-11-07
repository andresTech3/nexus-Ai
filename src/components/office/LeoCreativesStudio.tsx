'use client'

import React, { useState } from 'react'
import { useOfficeStore } from '@/lib/office/store'

interface CreativeFormat {
  id: string
  title: string
  format: '1:1' | '9:16'
  aspectRatioLabel: string
  placement: string
  cameraSpecs: string
  lightingSetup: string
  basePrompt: string
  negativePrompt: string
  headline: string
  primaryText: string
  ctaText: string
  urgencyBadge?: string
  script?: {
    hook: string
    body: string
    cta: string
  }
}

export function LeoCreativesStudio() {
  const store = useOfficeStore()
  const activeOffice = store.offices[store.activeOfficeId]
  const productName = activeOffice?.product?.name || ''
  const brandName = activeOffice?.brand?.name || 'Mi Marca'
  const niche = activeOffice?.product?.niche || 'Ecommerce'

  // Style selector
  const [styleMode, setStyleMode] = useState<'lujo' | 'nordico' | 'cyber' | 'calido'>('lujo')
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'all' | 'meta' | 'tiktok' | 'infographic'>('all')

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2200)
  }

  if (!productName) {
    return (
      <div style={{ padding: '3rem 2rem', textAlign: 'center', background: '#111113', borderRadius: '10px', border: '1px solid #1f1f23' }}>
        <div style={{ width: 44, height: 44, margin: '0 auto 0.75rem auto', borderRadius: '8px', backgroundColor: '#18181b', border: '1px solid #27272a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#faae33' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
        </div>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>Estudio de Prompts Creativos (Leo)</h3>
        <p style={{ fontSize: '0.85rem', color: '#9ca3af', maxWidth: 500, margin: '0 auto' }}>
          Asigna un producto en tu espacio de trabajo para que Leo diseñe los prompts fotográficos de alta gama, esquemas de iluminación y guiones de anuncios.
        </p>
      </div>
    )
  }

  const getStyleModifier = () => {
    switch (styleMode) {
      case 'nordico':
        return 'scandinavian minimalist design, light oak wood and white plaster background, soft natural morning daylight, peaceful neutral warm gray tones, organic lifestyle atmosphere'
      case 'cyber':
        return 'sleek dark obsidian aesthetic, subtle cyan and amber rim lighting, futuristic titanium tech backdrop, moody contrast, high-tech luxury'
      case 'calido':
        return 'warm sunset golden hour sunlight, cozy organic Mediterranean home textures, terracotta and linen, premium lifestyle feel, sunbeam caustics'
      case 'lujo':
      default:
        return 'luxury high-end commercial packaging photography, honed travertine marble stone pedestal, museum studio softbox lighting, pristine clean glass reflections, award-winning d2c advertising aesthetic'
    }
  }

  const creatives: CreativeFormat[] = [
    {
      id: 'hero_packshot',
      title: 'Fotografía Hero de Packshot & Packaging (1:1)',
      format: '1:1',
      aspectRatioLabel: '1:1 Cuadrado (Feed & Landing)',
      placement: 'Feed de Instagram & Facebook / Encabezado de Tienda',
      cameraSpecs: 'Hasselblad H6D-100c, 85mm f/1.4 lens, 1/125s, ISO 64',
      lightingSetup: 'Key softbox 45° con grid, rim light cálido en bordes y reflector inferior',
      basePrompt: `Commercial studio hero packshot of "${productName}" from the luxury brand "${brandName}". Resting on a honed stone pedestal with magnetic embossed packaging box next to it. Crisp product contours, hyper-detailed material textures, subtle clean reflections, 8k award-winning d2c product advertising photography.`,
      negativePrompt: '--no text distortion, bad proportions, blurry, cartoon, oversaturated, lowres, extra objects, dirty lens, cheap plastic reflection',
      headline: `Diseñado para quienes buscan excelencia: Conoce ${brandName}`,
      primaryText: `Olvídate de las copias plásticas y las alternativas genéricas. ${brandName} te ofrece ingeniería de precisión en un acabado que despierta miradas desde el primer unboxing.`,
      ctaText: 'Ver Colección Exclusiva',
    },
    {
      id: 'lifestyle_in_use',
      title: 'Lifestyle Aspiracional en Escenario Real (1:1)',
      format: '1:1',
      aspectRatioLabel: '1:1 Cuadrado (Carrusel & Prospección)',
      placement: 'Anuncios de Prospección / Carrusel Slide 2',
      cameraSpecs: 'Sony A7R V, 50mm f/1.2 GM, shallow depth of field',
      lightingSetup: 'Luz natural lateral a través de cortina de lino con suave contraluz',
      basePrompt: `Authentic editorial candid lifestyle photograph of an attractive confident individual gracefully using "${productName}" during a calm morning routine in a modern minimalist designer apartment. Authentic skin texture, natural soft daylight, organic tones, quiet luxury lifestyle photography.`,
      negativePrompt: '--no artificial plastic look, doll skin, oversaturated, deformed hands, extra fingers, blurry, watermark, ugly backdrop',
      headline: `Tu rutina diaria, elevada al siguiente nivel`,
      primaryText: `La verdadera sofisticación no interrumpe tu día: se integra con él de manera natural. Siente el confort y la calidad de ${brandName} en cada uso.`,
      ctaText: 'Pedir con Envío Gratis',
    },
    {
      id: 'macro_mechanism',
      title: 'Macro Demostración: Mecanismo de Acción <3s (1:1)',
      format: '1:1',
      aspectRatioLabel: '1:1 Cuadrado (Prueba Científica)',
      placement: 'Retargeting / Anuncios de Prueba de Mecanismo',
      cameraSpecs: 'Canon 100mm f/2.8L Macro IS USM, focus stacking 1:1 reproduction',
      lightingSetup: 'Doble rim light fibra óptica para resaltar bordes y micro-mecanismos',
      basePrompt: `Extreme macro close-up photograph of "${productName}". Capturing microscopic craftsmanship, precision engineering details, medical grade matte surface finish, subtle high-tech glowing status indicators. Razor-sharp focal plane with silky bokeh backdrop.`,
      negativePrompt: '--no blur on key mechanisms, digital noise, chromatic aberration, scratches, cheap mold lines, cartoonish colors',
      headline: `Ingeniería de máxima precisión en cada milímetro`,
      primaryText: `¿Por qué ${brandName} supera a cualquier alternativa del mercado? Inspecciona los detalles internos que garantizan máxima durabilidad y efectividad comprobada en segundos.`,
      ctaText: 'Descubrir la Tecnología',
    },
    {
      id: 'tiktok_vertical_ad',
      title: 'Anuncio Vertical TikTok & Reels de Alto Impacto (9:16)',
      format: '9:16',
      aspectRatioLabel: '9:16 Vertical (Reels, TikTok, Shorts)',
      placement: 'TikTok Ads / Instagram Reels / YouTube Shorts',
      urgencyBadge: 'FÓRMULA 3S HOOK',
      cameraSpecs: 'Smartphone POV 4K 60fps / iPhone 16 Pro Max estilo creador UGC nativo',
      lightingSetup: 'Aro de luz frontal suave con iluminación de fondo ambiental cálida',
      basePrompt: `First person POV vertical video frame of an authentic UGC creator holding "${productName}" with a genuine expression of amazement. Modern clean room background, dynamic real-world unboxing setting, crisp mobile native video frame, high retention social media ad aesthetic.`,
      negativePrompt: '--no fake stock photo actors, exaggerated fake expressions, corporate look, bad hands, low resolution compression',
      headline: `"La mejor decisión que he tomado este año... sin pagar suscripciones absurdas"`,
      primaryText: `Estructura 30s validada: 0-3s gancho visual con prueba inmediata + unboxing de la caja magnética + demostración en uso real + oferta de lanzamiento.`,
      ctaText: 'Comprar con Oferta Limitada',
      script: {
        hook: '00:00-00:03 (Gancho): "Si estás cansado de gastar dinero en copias que se rompen al mes, tienes que ver esto..."',
        body: '00:03-00:15 (Demostración): Muestra el unboxing de la caja de apertura magnética. Hace la prueba en directo en menos de 3 segundos demostrando el beneficio.',
        cta: '00:15-00:25 (Oferta): "Tienen un 40% de descuento solo esta semana con envío rápido desde España y 30 días de prueba sin compromiso."',
      },
    },
    {
      id: 'comparison_infographic',
      title: 'Infografía Comparativa: Nuestra Marca vs Genéricos (1:1)',
      format: '1:1',
      aspectRatioLabel: '1:1 Cuadrado (Comparativa)',
      placement: 'Landing Page Sección Comparativa / Feed Meta Ads',
      cameraSpecs: 'Studio flat lay / clean orthogonal perspective',
      lightingSetup: 'Luz cenital homogénea sin sombras duras',
      basePrompt: `Commercial split comparison studio photography. Left side: premium elegant "${productName}" by "${brandName}" with radiant green checkmarks, impeccable build quality. Right side: faded, cheap generic plastic imitation with red warning indicators. Modern high-converting D2C marketing graphic design.`,
      negativePrompt: '--no cluttered background, illegible text, messy composition, unaligned split',
      headline: `Por qué ${brandName} vs Las Copias Baratas del Mercado`,
      primaryText: `1. Materiales de primera calidad certificados. 2. Cero costes ocultos de por vida. 3. Garantía oficial con reemplazo exprés en 24-48 horas.`,
      ctaText: 'Elegir Calidad Garantizada',
    },
    {
      id: 'meta_direct_response',
      title: 'Banner Publicitario Meta de Alta Conversión (1:1)',
      format: '1:1',
      aspectRatioLabel: '1:1 Cuadrado (Feed & Retargeting)',
      placement: 'Feed de Meta Ads / Campañas CBO de Tomás',
      cameraSpecs: 'Medium format commercial digital camera, 85mm prime lens',
      lightingSetup: 'Contraste dramático con iluminación lateral y acentos dorados',
      basePrompt: `High converting commercial social media product advertisement for "${productName}". Premium dark pedestal, clean minimalist layout, direct response D2C luxury advertising composition, photorealistic, sharp focus.`,
      negativePrompt: '--no blurry product, cheap graphics, neon glare, distorted typography',
      headline: `Valoración 4.9/5 por más de 1.400 clientes satisfechos`,
      primaryText: `Pack de lanzamiento exclusivo con estuche rígido de viaje de regalo. Cupos limitados para los primeros pedidos del mes.`,
      ctaText: 'Reclamar Oferta de Lanzamiento',
    },
  ]

  const filteredCreatives = creatives.filter((c) => {
    if (activeTab === 'meta') return c.format === '1:1' && c.id !== 'comparison_infographic'
    if (activeTab === 'tiktok') return c.format === '9:16'
    if (activeTab === 'infographic') return c.id === 'comparison_infographic' || c.id === 'macro_mechanism'
    return true
  })

  const handleCopyAllPrompts = () => {
    const fullDoc = creatives
      .map((c, i) => {
        const fullPrompt = `${c.basePrompt} Style: ${getStyleModifier()}. Camera: ${c.cameraSpecs}. Lighting: ${c.lightingSetup} --ar ${c.format} --v 6.0 --stylize 250`
        return `============================================================
#${i + 1}. ${c.title.toUpperCase()} [${c.format}]
Ubicación: ${c.placement}
------------------------------------------------------------
[PROMPT MIDJOURNEY / FLUX / SDXL]:
${fullPrompt}

[NEGATIVE PROMPT]:
${c.negativePrompt}

[COPY / TITULAR]:
${c.headline}
${c.primaryText}
CTA: ${c.ctaText}
${c.script ? `\n[GUION 30S]:\n- Gancho: ${c.script.hook}\n- Cuerpo: ${c.script.body}\n- CTA: ${c.script.cta}` : ''}`
      })
      .join('\n\n')

    copyToClipboard(fullDoc, 'all_prompts')
  }

  return (
    <div
      style={{
        background: '#161311',
        border: '1px solid #3d2a1d',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
      }}
    >
      {/* ── HEADER DE CONTROL ─────────────────────────────────────────── */}
      <div
        style={{
          background: 'linear-gradient(135deg, #241812, #18100c)',
          borderBottom: '1px solid #3d2a1d',
          padding: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
            <span
              style={{
                backgroundColor: 'rgba(250, 174, 51, 0.15)',
                color: '#faae33',
                fontSize: '0.72rem',
                fontWeight: 800,
                padding: '3px 8px',
                borderRadius: '6px',
                border: '1px solid rgba(250, 174, 51, 0.3)',
              }}
            >
              DIRECCIÓN DE ARTE DE LEO
            </span>
            <span style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: 700 }}>
              ● Prompts Calibrados para Midjourney v6 &amp; FLUX.1 Pro
            </span>
          </div>

          <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
            Estudio de Prompts Fotográficos &amp; Creativos Publicitarios
          </h2>
          <p style={{ fontSize: '0.825rem', color: '#a1a1aa', margin: '0.25rem 0 0 0' }}>
            Prompts estructurados con cámaras, ópticas, esquemas de iluminación de estudio y directivas de relación de aspecto. Listos para pegar en tu generador favorito.
          </p>
        </div>

        {/* Global Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Style Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#1c1410', padding: '6px 10px', borderRadius: '8px', border: '1px solid #3d2a1d' }}>
            <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Atmósfera:</span>
            <select
              value={styleMode}
              onChange={(e) => setStyleMode(e.target.value as any)}
              style={{
                background: '#120d0a',
                border: '1px solid #4a3424',
                color: '#faae33',
                fontSize: '0.78rem',
                fontWeight: 700,
                padding: '4px 8px',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              <option value="lujo">Estudio de Lujo &amp; Mármol</option>
              <option value="nordico">Nórdico Minimalista</option>
              <option value="cyber">Cyberpunk &amp; Obsidiana</option>
              <option value="calido">Cálido / Luz Natural</option>
            </select>
          </div>

          {/* Copy All Prompts Button */}
          <button
            onClick={handleCopyAllPrompts}
            style={{
              background: copiedKey === 'all_prompts' ? '#16a34a' : 'linear-gradient(135deg, #faae33, #d98216)',
              color: '#181008',
              border: 'none',
              borderRadius: '8px',
              padding: '0.65rem 1.2rem',
              fontSize: '0.85rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(250, 174, 51, 0.35)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            {copiedKey === 'all_prompts' ? '✓ Todos los Prompts Copiados' : '📋 Copiar Pack Completo de Prompts'}
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div
        style={{
          display: 'flex',
          backgroundColor: '#140f0c',
          borderBottom: '1px solid #332418',
          padding: '0 1.25rem',
          overflowX: 'auto',
          gap: '0.5rem',
        }}
      >
        {[
          { key: 'all', label: 'Todos los Creativos (6)' },
          { key: 'meta', label: 'Meta Ads Feed 1:1 (3)' },
          { key: 'tiktok', label: 'TikTok & Reels 9:16 (1)' },
          { key: 'infographic', label: 'Prueba de Mecanismo & Comparativa (2)' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            style={{
              padding: '0.75rem 1rem',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === tab.key ? '2px solid #faae33' : '2px solid transparent',
              color: activeTab === tab.key ? '#faae33' : '#a1a1aa',
              fontSize: '0.825rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Creatives Grid */}
      <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1.5rem' }}>
        {filteredCreatives.map((creative) => {
          const isVertical = creative.format === '9:16'
          const fullPrompt = `${creative.basePrompt} Atmosphere: ${getStyleModifier()}. Camera: ${creative.cameraSpecs}. Lighting: ${creative.lightingSetup} --ar ${creative.format} --v 6.0 --stylize 250`

          return (
            <div
              key={creative.id}
              style={{
                backgroundColor: '#1b140f',
                border: '1px solid #38261b',
                borderRadius: '12px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                padding: '1.25rem',
                boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
              }}
            >
              {/* Header Info */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span
                      style={{
                        background: isVertical ? 'rgba(56, 189, 248, 0.15)' : 'rgba(250, 174, 51, 0.15)',
                        color: isVertical ? '#38bdf8' : '#faae33',
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        border: `1px solid ${isVertical ? 'rgba(56, 189, 248, 0.3)' : 'rgba(250, 174, 51, 0.3)'}`,
                      }}
                    >
                      {creative.aspectRatioLabel}
                    </span>
                    {creative.urgencyBadge && (
                      <span
                        style={{
                          background: 'rgba(239, 68, 68, 0.2)',
                          color: '#f87171',
                          fontSize: '0.68rem',
                          fontWeight: 800,
                          padding: '2px 6px',
                          borderRadius: '4px',
                        }}
                      >
                        {creative.urgencyBadge}
                      </span>
                    )}
                  </div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                    {creative.title}
                  </h4>
                  <div style={{ fontSize: '0.75rem', color: '#71717a', marginTop: 2 }}>
                    Canal: {creative.placement}
                  </div>
                </div>
              </div>

              {/* Technical Studio Setup Specs */}
              <div
                style={{
                  background: '#120d0a',
                  border: '1px solid #291c13',
                  borderRadius: '8px',
                  padding: '0.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem',
                  fontSize: '0.75rem',
                }}
              >
                <div>
                  <span style={{ color: '#faae33', fontWeight: 700 }}>📷 Óptica / Cámara: </span>
                  <span style={{ color: '#d4d4d8' }}>{creative.cameraSpecs}</span>
                </div>
                <div>
                  <span style={{ color: '#34d399', fontWeight: 700 }}>💡 Iluminación: </span>
                  <span style={{ color: '#d4d4d8' }}>{creative.lightingSetup}</span>
                </div>
              </div>

              {/* Full Structured Prompt Box */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.72rem', color: '#faae33', fontWeight: 700, textTransform: 'uppercase' }}>
                    Prompt Maestro (Midjourney v6 / FLUX.1 Pro)
                  </span>
                  <button
                    onClick={() => copyToClipboard(fullPrompt, `prompt_${creative.id}`)}
                    style={{
                      background: copiedKey === `prompt_${creative.id}` ? '#16a34a' : '#291c13',
                      border: '1px solid #4a3424',
                      color: copiedKey === `prompt_${creative.id}` ? '#fff' : '#faae33',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {copiedKey === `prompt_${creative.id}` ? '✓ Prompt Copiado' : 'Copiar Prompt'}
                  </button>
                </div>

                <div
                  style={{
                    background: '#0d0907',
                    border: '1px solid #2a1c13',
                    borderRadius: '8px',
                    padding: '0.75rem',
                    fontSize: '0.78rem',
                    color: '#e4e4e7',
                    lineHeight: 1.5,
                    fontFamily: 'monospace',
                    maxHeight: '120px',
                    overflowY: 'auto',
                  }}
                >
                  {fullPrompt}
                </div>
              </div>

              {/* Negative Prompt */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                  <span style={{ fontSize: '0.7rem', color: '#71717a', fontWeight: 700 }}>
                    Parámetros &amp; Negative Prompt
                  </span>
                  <button
                    onClick={() => copyToClipboard(creative.negativePrompt, `neg_${creative.id}`)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: copiedKey === `neg_${creative.id}` ? '#34d399' : '#9ca3af',
                      fontSize: '0.7rem',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                    }}
                  >
                    {copiedKey === `neg_${creative.id}` ? '✓ Copiado' : 'Copiar negativo'}
                  </button>
                </div>
                <div
                  style={{
                    background: '#120d0a',
                    border: '1px solid #201610',
                    borderRadius: '6px',
                    padding: '0.5rem 0.75rem',
                    fontSize: '0.72rem',
                    color: '#a1a1aa',
                    fontFamily: 'monospace',
                  }}
                >
                  {creative.negativePrompt}
                </div>
              </div>

              {/* Advertising Copy & UGC Script Section */}
              <div
                style={{
                  background: '#140f0c',
                  border: '1px solid #2c1d14',
                  borderRadius: '8px',
                  padding: '0.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 700 }}>
                    Copy de Conversión para Tomás (Media Buyer)
                  </span>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        `${creative.headline}\n\n${creative.primaryText}\n\nCTA: ${creative.ctaText}${
                          creative.script ? `\n\nGuión UGC:\n${creative.script.hook}\n${creative.script.body}\n${creative.script.cta}` : ''
                        }`,
                        `copy_${creative.id}`
                      )
                    }
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: copiedKey === `copy_${creative.id}` ? '#34d399' : '#38bdf8',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textDecoration: 'underline',
                    }}
                  >
                    {copiedKey === `copy_${creative.id}` ? '✓ Copy Copiado' : 'Copiar Copy'}
                  </button>
                </div>

                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ffffff' }}>
                  {creative.headline}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#a1a1aa', lineHeight: 1.4 }}>
                  {creative.primaryText}
                </div>

                {/* UGC 30s Script Breakdown if available */}
                {creative.script && (
                  <div
                    style={{
                      marginTop: '0.25rem',
                      background: '#0a0806',
                      border: '1px solid #22160f',
                      borderRadius: '6px',
                      padding: '0.6rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.35rem',
                      fontSize: '0.72rem',
                    }}
                  >
                    <div style={{ color: '#fbbf24', fontWeight: 700 }}>🎬 Guión UGC Cronometrado:</div>
                    <div style={{ color: '#d4d4d8' }}>{creative.script.hook}</div>
                    <div style={{ color: '#a1a1aa' }}>{creative.script.body}</div>
                    <div style={{ color: '#34d399', fontWeight: 600 }}>{creative.script.cta}</div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
