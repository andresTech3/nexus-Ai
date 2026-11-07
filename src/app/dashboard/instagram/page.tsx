'use client'

import React, { useState, useEffect } from 'react'
import { useOfficeStore } from '@/lib/office/store'

interface ContentPost {
  id: string
  title: string
  type: 'REEL' | 'CAROUSEL' | 'STORY'
  hook3s: string
  caption: string
  hashtags: string[]
  scheduledDay: string
  status: 'DRAFT' | 'APPROVED' | 'PUBLISHED'
  slides?: string[]
}

function generateDynamicInstagramPosts(productName: string, brandName: string): ContentPost[] {
  const pName = productName?.trim() || 'Producto Ganador'
  const pLower = pName.toLowerCase()
  const bName = brandName?.trim() || 'Mi Marca'

  if (pLower.includes('luna') || pLower.includes('lamp') || pLower.includes('lámpara') || pLower.includes('luz')) {
    return [
      {
        id: 'ig_1',
        title: 'Cómo transformar una habitación ordinaria en un templo de paz en 3 segundos',
        type: 'REEL',
        hook3s: 'Visual: Habitación a oscuras + se acerca la mano y la luna comienza a levitar en el aire emitiendo luz cálida suave.',
        caption: `¿Sabías que la luz tenue a 2700K reduce los niveles de cortisol antes de dormir?\n\nDiseñamos ${bName} para crear un ambiente hipnótico sin cables ni ruidos.\n\nComenta "LUNA" y te enviamos por privado un 20% de descuento para tu primer pedido.`,
        hashtags: ['#decoracioninteriores', '#lamparaluna', '#diseñonordico', '#dormitoriopremium', '#bienestarencasa'],
        scheduledDay: 'Lunes — 19:30h',
        status: 'APPROVED',
      },
      {
        id: 'ig_2',
        title: 'Carrusel: 5 Razones por las que tu habitación necesita luz indirecta',
        type: 'CAROUSEL',
        hook3s: 'Portada: Habitación moderna nórdica con texto: "5 razones científicas por las que la luz de tu techo te está arruinando el descanso."',
        caption: `Desliza para descubrir cómo la iluminación correcta mejora tu calidad de sueño y tu estado de ánimo.\n\nGuarda este post para tu próxima remodelación.`,
        hashtags: ['#decohogar', '#iluminacionled', '#estilonordico', '#descansoreparador'],
        scheduledDay: 'Miércoles — 20:30h',
        status: 'DRAFT',
        slides: [
          'Slide 1: 5 razones por las que la luz de techo tradicional arruina tu descanso.',
          'Slide 2: Razón 1 — Inhibe la producción natural de melatonina 2 horas antes de dormir.',
          'Slide 3: Razón 2 — Sombras duras que generan fatiga visual en ojos cansados.',
          'Slide 4: Razón 3 — La luz focalizada cálida crea un santuario de relajación mental.',
          'Slide 5: Levitación magnética: arte en movimiento que hipnotiza y relaja.',
          'Slide 6 (CTA): Descubre la colección completa en el enlace de nuestra biografía.',
        ],
      },
    ]
  }

  if (pLower.includes('mascota') || pLower.includes('perro') || pLower.includes('gato') || pLower.includes('pet') || pLower.includes('pelo')) {
    return [
      {
        id: 'ig_1',
        title: 'El truco para eliminar el pelo muerto de tu mascota sin tirones ni peleas',
        type: 'REEL',
        hook3s: 'Visual: Gato ronroneando feliz mientras una sola pasada del cepillo retira una manta entera de pelo suelto.',
        caption: `El 80% de los pelos que terminan en tu sofá se pueden evitar en solo 3 minutos al día.\n\nEl sistema de vapor suave de ${bName} relaja los folículos y recoge el pelo sin asustar a tu peludo.\n\nComenta "PELOS" para recibir la guía completa de cepillado sin estrés.`,
        hashtags: ['#mascotasfelices', '#gatosdeinstagram', '#perrosdeinstagram', '#cuidadodemascotas', '#petlovers'],
        scheduledDay: 'Lunes — 18:30h',
        status: 'APPROVED',
      },
      {
        id: 'ig_2',
        title: 'Carrusel: 4 Señales de que tu mascota tiene exceso de pelo muerto',
        type: 'CAROUSEL',
        hook3s: 'Portada: Primer plano tierno de mascota con texto: "4 señales silenciosas de que tu perro o gato necesita un cepillado profundo."',
        caption: `Desliza para ver si tu peludo presenta alguna de estas señales.\n\nLa número 3 suele confundirse con alergia pero es solo acumulación de pelo bajo el manto.`,
        hashtags: ['#amorporlasmascotas', '#perrosfelices', '#gatosfelices', '#veterinaria'],
        scheduledDay: 'Jueves — 19:00h',
        status: 'DRAFT',
        slides: [
          'Slide 1: 4 señales de que tu perro o gato tiene exceso de subpelo acumulado.',
          'Slide 2: Señal 1 — Bolas de pelo frecuentes en gatos o caspa en perros.',
          'Slide 3: Señal 2 — Rascado constante sin tener pulgas.',
          'Slide 4: Señal 3 — Pelos pegados en ropa y tapicerías incluso tras pasar la aspiradora.',
          'Slide 5: Cómo el vapor templado atrapa los alérgenos y deja el pelaje brillante.',
          'Slide 6 (CTA): Aprovecha nuestro 2x1 especial en el enlace del perfil.',
        ],
      },
    ]
  }

  return [
    {
      id: 'ig_1',
      title: `Por qué todo el mundo está hablando de ${pName} este mes`,
      type: 'REEL',
      hook3s: `Visual: Demostración inmediata del problema cotidiano resuelto en 3 segundos con ${pName}.`,
      caption: `Si estás buscando la solución definitiva para tu día a día, mira esto.\n\nEn ${bName} diseñamos productos pensados para durar y resolver problemas reales.\n\nComenta "OFERTA" y te enviamos el cupón con 25% de descuento directo a tu bandeja de entrada.`,
      hashtags: ['#tendencias2026', '#dropshippingespana', '#comprasonline', '#gadgetsvirales', '#calidadgarantizada'],
      scheduledDay: 'Lunes — 19:00h',
      status: 'APPROVED',
    },
    {
      id: 'ig_2',
      title: `Carrusel: 5 Razones para elegir ${pName} sobre cualquier imitación barata`,
      type: 'CAROUSEL',
      hook3s: `Portada: Fotografía macro de alta definición: "5 detalles que marcan la diferencia en ${pName}."`,
      caption: `No todas las opciones del mercado son iguales. Desliza para ver la comparativa real de materiales, garantía y acabados.\n\nGuarda este post para tu próxima compra.`,
      hashtags: ['#comparativareal', '#calidadpremium', '#garantiatotal', '#tiendaonline'],
      scheduledDay: 'Miércoles — 20:00h',
      status: 'DRAFT',
      slides: [
        `Slide 1: 5 razones para elegir ${pName} oficial sobre imitaciones genéricas.`,
        'Slide 2: Calidad de materiales: durabilidad testada para uso intensivo.',
        'Slide 3: Soporte técnico y atención personalizada 24/7 en español.',
        'Slide 4: Garantía europea de devolución sin preguntas durante 30 días.',
        'Slide 5: Envío exprés con seguimiento en tiempo real directo a tu puerta.',
        `Slide 6 (CTA): Haz tu pedido hoy con descuento exclusivo en el enlace de la bio.`,
      ],
    },
  ]
}

export default function InstagramGrowthPage() {
  const store = useOfficeStore()
  const activeOffice = store.offices[store.activeOfficeId]
  const productName = activeOffice?.product?.name || ''
  const brandName = activeOffice?.brand?.name || 'AuraWell'

  const [activeTab, setActiveTab] = useState<'reels' | 'carousels' | 'bio' | 'calendar'>('reels')
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const [posts, setPosts] = useState<ContentPost[]>(() =>
    generateDynamicInstagramPosts(productName, brandName)
  )

  useEffect(() => {
    if (productName) {
      setPosts(generateDynamicInstagramPosts(productName, brandName))
    }
  }, [productName, brandName])

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    showToast('Copiado al portapapeles')
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div id="instagram-growth-workspace" style={{ maxWidth: 1200, margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '1.5rem',
            right: '1.5rem',
            background: '#e1306c',
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
                background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </span>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
              Instagram Growth & Skills
            </h1>
            <span
              style={{
                fontSize: '0.72rem',
                padding: '2px 8px',
                borderRadius: '999px',
                background: 'rgba(225, 48, 108, 0.15)',
                color: '#f472b6',
                fontWeight: 600,
                border: '1px solid rgba(225, 48, 108, 0.3)',
              }}
            >
              Skill Engine: sergebulaev/instagram-skills
            </span>
          </div>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#a1a1aa' }}>
            Estrategia de Reels virales con ganchos de 3s, carruseles de alta retención, optimizador de biografía y copys humanizados sin lenguaje de bot.
          </p>
        </div>
      </div>

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
          onClick={() => setActiveTab('reels')}
          style={{
            padding: '0.65rem 1rem',
            fontSize: '0.85rem',
            fontWeight: 600,
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'reels' ? '2px solid #e1306c' : '2px solid transparent',
            color: activeTab === 'reels' ? '#ffffff' : '#71717a',
            cursor: 'pointer',
          }}
        >
          Reels & Ganchos 3s (Marco & Nora)
        </button>

        <button
          onClick={() => setActiveTab('carousels')}
          style={{
            padding: '0.65rem 1rem',
            fontSize: '0.85rem',
            fontWeight: 600,
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'carousels' ? '2px solid #e1306c' : '2px solid transparent',
            color: activeTab === 'carousels' ? '#ffffff' : '#71717a',
            cursor: 'pointer',
          }}
        >
          Arquitecto de Carruseles
        </button>

        <button
          onClick={() => setActiveTab('bio')}
          style={{
            padding: '0.65rem 1rem',
            fontSize: '0.85rem',
            fontWeight: 600,
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'bio' ? '2px solid #e1306c' : '2px solid transparent',
            color: activeTab === 'bio' ? '#ffffff' : '#71717a',
            cursor: 'pointer',
          }}
        >
          Optimizador de Biografía & Perfil
        </button>

        <button
          onClick={() => setActiveTab('calendar')}
          style={{
            padding: '0.65rem 1rem',
            fontSize: '0.85rem',
            fontWeight: 600,
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'calendar' ? '2px solid #e1306c' : '2px solid transparent',
            color: activeTab === 'calendar' ? '#ffffff' : '#71717a',
            cursor: 'pointer',
          }}
        >
          Calendario Editorial & Aprobaciones
        </button>
      </div>

      {/* Tab: Reels & 3s Hooks */}
      {activeTab === 'reels' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div
            style={{
              backgroundColor: '#121214',
              border: '1px solid #1f1f23',
              borderRadius: '8px',
              padding: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#ffffff' }}>
                Regla de Oro de Retención: 0 a 3 Segundos
              </div>
              <div style={{ fontSize: '0.8rem', color: '#71717a', marginTop: '0.2rem' }}>
                El algoritmo de Reels solo premia vídeos que retienen más del 70% del público en los primeros 3 segundos.
              </div>
            </div>
            <button
              onClick={() => showToast('Nueva variación de ganchos generada con Nora')}
              style={{
                padding: '0.45rem 0.9rem',
                background: '#e1306c',
                border: 'none',
                borderRadius: '6px',
                color: '#ffffff',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              + Generar 3 Nuevos Ganchos
            </button>
          </div>

          {posts
            .filter((p) => p.type === 'REEL')
            .map((post) => (
              <div
                key={post.id}
                style={{
                  backgroundColor: '#121214',
                  border: '1px solid #1f1f23',
                  borderRadius: '8px',
                  padding: '1.5rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: 'rgba(225, 48, 108, 0.15)',
                        color: '#f472b6',
                        display: 'inline-block',
                        marginBottom: '0.35rem',
                      }}
                    >
                      REEL VERTICAL 9:16 • {post.scheduledDay}
                    </span>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: '#ffffff' }}>
                      {post.title}
                    </h3>
                  </div>

                  <button
                    onClick={() =>
                      copyToClipboard(
                        `REEL INSTAGRAM:\n${post.title}\n\nGANCHO 0-3s:\n${post.hook3s}\n\nCAPTION:\n${post.caption}\n\nHASHTAGS:\n${post.hashtags.join(' ')}`,
                        post.id
                      )
                    }
                    style={{
                      padding: '0.4rem 0.8rem',
                      background: '#18181b',
                      border: '1px solid #27272a',
                      borderRadius: '6px',
                      color: '#ffffff',
                      fontSize: '0.775rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {copiedId === post.id ? '✓ Copiado' : 'Copiar Guion & Caption'}
                  </button>
                </div>

                {/* 3s Hook Box */}
                <div
                  style={{
                    backgroundColor: '#09090b',
                    border: '1px solid #27272a',
                    borderLeft: '3px solid #e1306c',
                    padding: '0.9rem',
                    borderRadius: '4px',
                    marginBottom: '1rem',
                  }}
                >
                  <div style={{ fontSize: '0.72rem', color: '#e1306c', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                    Gancho Visual & Auditivo (0-3 Segundos)
                  </div>
                  <div style={{ fontSize: '0.825rem', color: '#f4f4f5', lineHeight: 1.5 }}>
                    {post.hook3s}
                  </div>
                </div>

                {/* Caption */}
                <div style={{ backgroundColor: '#09090b', padding: '0.9rem', borderRadius: '4px', border: '1px solid #18181b', marginBottom: '0.75rem' }}>
                  <div style={{ fontSize: '0.72rem', color: '#a1a1aa', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                    Texto de la Publicación (Caption Humanizada)
                  </div>
                  <div style={{ fontSize: '0.825rem', color: '#d4d4d8', whiteSpace: 'pre-line', lineHeight: 1.5 }}>
                    {post.caption}
                  </div>
                </div>

                {/* Hashtags */}
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {post.hashtags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontSize: '0.75rem',
                        color: '#60a5fa',
                        background: 'rgba(59, 130, 246, 0.1)',
                        padding: '2px 8px',
                        borderRadius: '4px',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Tab: Carousels */}
      {activeTab === 'carousels' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {posts
            .filter((p) => p.type === 'CAROUSEL')
            .map((post) => (
              <div
                key={post.id}
                style={{
                  backgroundColor: '#121214',
                  border: '1px solid #1f1f23',
                  borderRadius: '8px',
                  padding: '1.5rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: 'rgba(168, 85, 247, 0.15)',
                        color: '#c084fc',
                        display: 'inline-block',
                        marginBottom: '0.35rem',
                      }}
                    >
                      CARRUSEL EDUCATIVO 1:1 / 4:5 • {post.scheduledDay}
                    </span>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: '#ffffff' }}>
                      {post.title}
                    </h3>
                  </div>

                  <button
                    onClick={() =>
                      copyToClipboard(
                        `CARRUSEL:\n${post.title}\n\nDIAPOSITIVAS:\n${post.slides?.join('\n')}\n\nCAPTION:\n${post.caption}`,
                        post.id
                      )
                    }
                    style={{
                      padding: '0.4rem 0.8rem',
                      background: '#18181b',
                      border: '1px solid #27272a',
                      borderRadius: '6px',
                      color: '#ffffff',
                      fontSize: '0.775rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {copiedId === post.id ? '✓ Copiado' : 'Copiar Todo el Carrusel'}
                  </button>
                </div>

                {/* Slides breakdown */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
                  {post.slides?.map((slide, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: '#09090b',
                        border: '1px solid #27272a',
                        borderRadius: '6px',
                        padding: '0.85rem',
                      }}
                    >
                      <div style={{ fontSize: '0.7rem', color: '#faae33', fontWeight: 700, marginBottom: '0.25rem' }}>
                        Diapositiva {idx + 1}
                      </div>
                      <div style={{ fontSize: '0.775rem', color: '#d4d4d8', lineHeight: 1.45 }}>
                        {slide}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Caption */}
                <div style={{ backgroundColor: '#09090b', padding: '0.9rem', borderRadius: '4px', border: '1px solid #18181b' }}>
                  <div style={{ fontSize: '0.72rem', color: '#a1a1aa', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                    Caption de Cierre & Llamada a Guardar
                  </div>
                  <div style={{ fontSize: '0.825rem', color: '#d4d4d8', whiteSpace: 'pre-line', lineHeight: 1.5 }}>
                    {post.caption}
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Tab: Bio & Profile */}
      {activeTab === 'bio' && (
        <div
          style={{
            backgroundColor: '#121214',
            border: '1px solid #1f1f23',
            borderRadius: '8px',
            padding: '1.5rem',
          }}
        >
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.15rem', color: '#ffffff', fontWeight: 600 }}>
            Optimizador de Biografía para {brandName}
          </h3>
          <p style={{ margin: '0 0 1.25rem 0', fontSize: '0.825rem', color: '#71717a' }}>
            La biografía tiene 3 segundos para responder: ¿Quién eres? ¿A quién ayudas? ¿Qué deben hacer ahora?
          </p>

          <div
            style={{
              background: '#09090b',
              border: '1px solid #27272a',
              borderRadius: '8px',
              padding: '1.25rem',
              maxWidth: 480,
              marginBottom: '1.25rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #faae33, #e1306c)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  color: '#ffffff',
                }}
              >
                {brandName.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>
                  @{brandName.toLowerCase()}.oficial
                </div>
                <div style={{ fontSize: '0.75rem', color: '#71717a' }}>
                  Salud & Bienestar • Comercio Electrónico
                </div>
              </div>
            </div>

            <div style={{ fontSize: '0.85rem', color: '#e4e4e7', lineHeight: 1.6, whiteSpace: 'pre-line', marginBottom: '1rem' }}>
              {`✨ Alivia la tensión en tu espalda al teletrabajar
🩺 Biomecánica ergonómica aprobada por especialistas
📦 Envíos 24/48h | 30 días de prueba sin riesgo
👇 Consigue tu pack con -20% descuento hoy`}
            </div>

            <div style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 600 }}>
              🔗 aurawell.com/oferta-exclusiva
            </div>
          </div>

          <button
            onClick={() =>
              copyToClipboard(
                `✨ Alivia la tensión en tu espalda al teletrabajar\n🩺 Biomecánica ergonómica aprobada por especialistas\n📦 Envíos 24/48h | 30 días de prueba sin riesgo\n👇 Consigue tu pack con -20% descuento hoy\n🔗 aurawell.com/oferta-exclusiva`,
                'bio_copy'
              )
            }
            style={{
              padding: '0.55rem 1rem',
              background: '#e1306c',
              border: 'none',
              borderRadius: '6px',
              color: '#ffffff',
              fontSize: '0.825rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {copiedId === 'bio_copy' ? '✓ Biografía Copiada' : 'Copiar Texto de Biografía'}
          </button>
        </div>
      )}

      {/* Tab: Calendar & Approval */}
      {activeTab === 'calendar' && (
        <div
          style={{
            backgroundColor: '#121214',
            border: '1px solid #1f1f23',
            borderRadius: '8px',
            padding: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#ffffff', fontWeight: 600 }}>
                Flujo de Aprobación Antes de Publicar (Approve-Before-Publish)
              </h3>
              <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.825rem', color: '#71717a' }}>
                Siguiendo el estándar de Publora / instagram-skills: ningún post se sube sin tu visto bueno.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {posts.map((post) => (
              <div
                key={post.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem',
                  backgroundColor: '#09090b',
                  borderRadius: '6px',
                  border: '1px solid #1f1f23',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        padding: '1px 6px',
                        borderRadius: '3px',
                        background: post.status === 'APPROVED' ? 'rgba(52, 211, 153, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        color: post.status === 'APPROVED' ? '#34d399' : '#fbbf24',
                      }}
                    >
                      {post.status === 'APPROVED' ? '✓ APROBADO' : 'PENDIENTE DE REVISIÓN'}
                    </span>
                    <strong style={{ fontSize: '0.875rem', color: '#ffffff' }}>{post.title}</strong>
                  </div>
                  <div style={{ fontSize: '0.775rem', color: '#71717a' }}>
                    Programado para: <span style={{ color: '#d4d4d8' }}>{post.scheduledDay}</span> ({post.type})
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {post.status !== 'APPROVED' ? (
                    <button
                      onClick={() => {
                        setPosts(posts.map((p) => (p.id === post.id ? { ...p, status: 'APPROVED' } : p)))
                        showToast(`Post "${post.title}" aprobado para publicar`)
                      }}
                      style={{
                        padding: '0.4rem 0.8rem',
                        background: '#10b981',
                        border: 'none',
                        borderRadius: '6px',
                        color: '#ffffff',
                        fontSize: '0.775rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Aprobar Post
                    </button>
                  ) : (
                    <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 600 }}>Listo para programar</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
