'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { AgentOrbitCarousel, AGENT_DISHES } from '@/components/ui/agent-orbit-carousel'
import type { Dish } from '@/components/ui/dish-orbit-carousel'

interface AgentDetail {
  id: string
  name: string
  role: string
  category: string
  description: string
  inputs: string[]
  outputs: string[]
  tools: string[]
  accent: string
}

const AGENT_TECH_SPECS: Record<string, AgentDetail> = {
  'Iván': {
    id: 'ivan',
    name: 'Iván',
    role: 'Cazador de Tendencias Virales',
    category: 'Investigación de Mercado',
    description: 'Rastrea más de 20.000 productos cada 24 horas en TikTok Creative Center, AliExpress y Google Trends. Filtra productos con más de 3x de margen y descarta modas ya saturadas.',
    inputs: ['TikTok Creative Center Ads', 'Catálogo de CJ Dropshipping', 'Índices Google Trends (90 días)', 'Precios de Mercado en España'],
    outputs: ['Score de Potencial Viral (0-100)', 'Matriz de Demanda & Saturación', 'Precios de Referencia Recomendados', 'Ficha de Viabilidad Preliminar'],
    tools: ['Algoritmo Anti-Saturación', 'Extractor de Tendencias', 'Scanner de Catálogo CJ', 'Radar de Búsquedas'],
    accent: '#f59e0b',
  },
  'Valeria': {
    id: 'valeria',
    name: 'Valeria',
    role: 'Estratega de Nicho & Audiencia',
    category: 'Psicología de Compra',
    description: 'Define con precisión quirúrgica el perfil demográfico y psicológico del comprador. Identifica los 3 dolores urgentes y el deseo emocional que hace que el usuario compre en el primer impacto.',
    inputs: ['Categoría de Producto', 'Comentarios en Vídeos Virales', 'Datos Demográficos de Compradores', 'Motivaciones de Compra'],
    outputs: ['Buyer Persona Primario & Secundario', '3 Ángulos Emocionales de Venta', 'Lista de Objeciones y Contra-Argumentos', 'Nivel de Sofisticación del Mercado'],
    tools: ['Mapa de Empatía D2C', 'Análisis de Sentimiento de Reseñas', 'Estructurador de Deseos', 'Matriz de Objeciones'],
    accent: '#10b981',
  },
  'Clara': {
    id: 'clara',
    name: 'Clara',
    role: 'Espía de Competencia',
    category: 'Inteligencia de Mercado',
    description: 'Audita los anuncios activos de los principales competidores en Meta y TikTok. Extrae las reseñas de 1 y 2 estrellas de sus compradores para descubrir qué hacen mal y superarlos.',
    inputs: ['Meta Ad Library', 'TikTok Ads Explorer', 'Reseñas de Tiendas Competidoras', 'Páginas de Producto en Vivo'],
    outputs: ['Análisis de Ofertas de la Competencia', 'Catálogo de Quejas Frecuentes', 'Estrategia de Diferenciación Única', 'Comparativa de Precios y Envíos'],
    tools: ['Inspector de Biblioteca de Anuncios', 'Scraper de Quejas de Clientes', 'Matriz de Brechas de Mercado', 'Auditor de Promociones'],
    accent: '#8b5cf6',
  },
  'Diego': {
    id: 'diego',
    name: 'Diego',
    role: 'Sourcing & Costes de Fábrica',
    category: 'Logística de Proveedores',
    description: 'Conecta con la API de CJ Dropshipping para verificar existencias en tiempo real, auditar costes de fabricación en lotes unitarios y asegurar rutas de envío de 7 a 10 días a Europa.',
    inputs: ['API CJ Dropshipping', 'Tarifas de Envíos Internacionales', 'Peso y Dimensiones de Paquete', 'Plazos de Tránsito a España/EU'],
    outputs: ['Coste Unitario de Fábrica Verificado', 'Línea de Envío Rápido Confirmada', 'Cálculo de Tiempos de Entrega', 'Filtro de Fiabilidad del Proveedor'],
    tools: ['Conector API CJ Dropshipping', 'Calculadora de Flete Aéreo', 'Auditor de Embalaje', 'Monitor de Inventario'],
    accent: '#3b82f6',
  },
  'Eva': {
    id: 'eva',
    name: 'Eva',
    role: 'CFO de Rentabilidad',
    category: 'Finanzas Deterministas',
    description: 'Calcula con rigor matemático el margen neto por pedido deduciendo COGS, pasarelas Stripe/PayPal, embalaje, envíos y CPA publicitario máximo para garantizar un negocio rentable.',
    inputs: ['Precio de Venta Sugerido (PVP)', 'Coste de Fábrica + Envío', 'Comisiones de Pasarela (1.5% + 0.25€)', 'Tasa Estimada de Reembolsos (2%)'],
    outputs: ['CPA Máximo de Equilibrio (Break-Even)', 'Beneficio Neto Limpio por Pedido', 'Multiplicador de Margen (Mínimo 3x)', 'Sensibilidad a Diferentes Escalas'],
    tools: ['Simulador Unit Economics', 'Calculadora de Break-Even ROAS', 'Optimizador de Margen', 'Auditor de Pérdidas'],
    accent: '#ec4899',
  },
  'Lucas': {
    id: 'lucas',
    name: 'Lucas',
    role: 'Copywriter Persuasivo',
    category: 'Textos & Conversión',
    description: 'Redacta ganchos de 3 segundos, titulares magnéticos y descripciones directas enfocadas en beneficios, diseñadas para compras impulsivas desde smartphones.',
    inputs: ['Ángulos de Valeria', 'Debilidades detectadas por Clara', 'Características Físicas del Producto', 'Tono de Marca'],
    outputs: ['Titulares Hero Above-the-Fold', '3 Bloques de Beneficios Inmediatos', 'Textos de Llamada a la Acción (CTA)', 'Guiones de Garantía y Confianza'],
    tools: ['Fórmula Hook-Story-Offer', 'Escritura Anti-Aburrimiento', 'Adaptador para Lectura Rápida', 'Generador de Micro-Copy'],
    accent: '#06b6d4',
  },
  'Leo': {
    id: 'leo',
    name: 'Leo',
    role: 'Director Creativo 3D',
    category: 'Estudio Visual',
    description: 'Genera fotografías de producto en alta resolución con iluminación de estudio sobre fondo blanco o entornos realistas, listas para feed 1:1 y anuncios verticales 9:16.',
    inputs: ['Fotos Crudas del Proveedor', 'Paleta de Color de la Marca', 'Formato Requerido (9:16 o 1:1)', 'Instrucciones de Iluminación'],
    outputs: ['Packshots de Estudio HD en Fondo Limpio', 'Composiciones con Entorno de Uso', 'Creativos de Alto Impacto para Ads', 'Texturas y Detalles en Alta Fidelidad'],
    tools: ['Motor de Render 3D', 'Corrector de Sombras Fotorrealistas', 'Optimizador WebP/PNG', 'Adaptador de Proporciones'],
    accent: '#f97316',
  },
  'Sofía': {
    id: 'sofia',
    name: 'Sofía',
    role: 'Arquitecta de Tienda',
    category: 'Shopify Liquid',
    description: 'Ensambla código Liquid nativo para el tema Dawn de Shopify. Optimiza el proceso de compra directa en móvil con selector de packs (1, 2 y 3 unidades) para aumentar el ticket medio.',
    inputs: ['Textos de Lucas', 'Creativos de Leo', 'Estructura de Packs (1, 2 y 3 unidades)', 'Tema Base Shopify Dawn'],
    outputs: ['Secciones Shopify Liquid Listas', 'Selectores de Cantidad con Descuento', 'Badges de Confianza y Urgencia Suave', 'Código CSS Ligero (Carga < 1s)'],
    tools: ['Generador de Secciones Liquid', 'Optimizador de Conversión Móvil', 'Inyector de Direct-to-Checkout', 'Validador de Carga Rápida'],
    accent: '#14b8a6',
  },
  'Tomás': {
    id: 'tomas',
    name: 'Tomás',
    role: 'Media Buyer',
    category: 'Publicidad de Pago',
    description: 'Diseña la estructura de campaña en Meta Ads con segmentación amplia (Broad), presupuesto controlado y reglas automáticas de stop-loss para pausar anuncios no rentables en 48 horas.',
    inputs: ['CPA Máximo de Eva', 'Creativos de Leo y Textos de Lucas', 'Presupuesto Inicial de Pruebas', 'Píxel / Conversions API'],
    outputs: ['Estructura de Campaña CBO / ABO', 'Reglas Automáticas Anti-Pérdidas', 'Presupuesto Diario Sugerido', 'Métricas Objetivo (CTR, CPC, CPA)'],
    tools: ['Diseñador de Campañas Meta', 'Calculador de Stop-Loss', 'Planificador de Escala Progresiva', 'Algoritmo de Control de Riesgo'],
    accent: '#6366f1',
  },
  'Mateo': {
    id: 'mateo',
    name: 'Mateo',
    role: 'Especialista en Tráfico Viral',
    category: 'TikTok & Reels Orgánico',
    description: 'Genera guiones de 15 a 30 segundos sincronizados con audios en tendencia para publicar en TikTok y Reels sin gastar presupuesto publicitario.',
    inputs: ['Tendencias de Audio en TikTok', 'Ganchos Visuales de Producto', 'Comportamiento de la Generación Z', 'Formato Vertical 9:16'],
    outputs: ['Calendario de Contenidos para 30 Días', 'Guiones con Audio y Acción Segundo a Segundo', 'Hashtags Optimizados para Descubrimiento', 'Ángulos de Repetición Viral'],
    tools: ['Radar de Audios Virales', 'Estructurador de Retención (0-3s)', 'Optimizador de Hashtags', 'Planificador Orgánico'],
    accent: '#f43f5e',
  },
  'Dora': {
    id: 'dora',
    name: 'Dora',
    role: 'Directora de Calidad',
    category: 'Auditoría Pre-Lanzamiento',
    description: 'Inspecciona meticulosamente cada entregable antes de dar luz verde. Verifica que los precios cuadren, que no haya enlaces rotos y que los anuncios cumplan las políticas de Meta y TikTok.',
    inputs: ['Entregables de los 10 Especialistas', 'Políticas Publicitarias de Plataformas', 'Verificación de Enlaces y Precios', 'Checklist de Lanzamiento'],
    outputs: ['Informe de Aprobación de Calidad', 'Checklist de 18 Puntos Verificados', 'Alertas de Riesgo Detectadas', 'Sello Oficial de Certificación'],
    tools: ['Escáner de Políticas Publicitarias', 'Verificador de Consistencia de Datos', 'Auditor de Enlaces de Checkout', 'Validador de Precios'],
    accent: '#eab308',
  },
}

export default function HomePage() {
  const [selectedSpec, setSelectedSpec] = useState<AgentDetail | null>(null)

  const handleOpenSpec = (dish: Dish) => {
    const spec = AGENT_TECH_SPECS[dish.title] ?? {
      id: dish.title.toLowerCase(),
      name: dish.title,
      role: dish.subtitle,
      category: dish.eyebrow ?? 'Especialista Autónomo',
      description: dish.description,
      inputs: ['Datos de Mercado en Tiempo Real', 'Parámetros del Producto Asignado'],
      outputs: ['Entregables Técnicos en Español', 'Acciones Autónomas en el Sistema'],
      tools: dish.ingredients ?? ['Automatización Inteligente', 'Control de Calidad'],
      accent: dish.accent,
    }
    setSelectedSpec(spec)
  }

  return (
    <div
      style={{
        minHeight: '100dvh',
        backgroundColor: '#09080d',
        color: '#f4f4f5',
        fontFamily: "'Outfit', ui-sans-serif, system-ui, sans-serif",
        overflowX: 'hidden',
        WebkitFontSmoothing: 'antialiased',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {/* ── TOP MINIMAL NAVIGATION BAR ──────────────────────────────── */}
      <nav
        style={{
          borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
          backgroundColor: 'rgba(9, 8, 13, 0.92)',
          backdropFilter: 'blur(20px)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          height: 64,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: 1280,
            margin: '0 auto',
            padding: '0 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              textDecoration: 'none',
              color: '#ffffff',
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #faae33, #d98216)',
                color: '#09080d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '0.9rem',
                boxShadow: '0 4px 12px rgba(250, 174, 51, 0.25)',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#09080d" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
            </div>
            <span style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
              NEXUS <span style={{ color: '#faae33', fontWeight: 600 }}>OS</span>
            </span>
          </Link>

          {/* Nav links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <Link
              href="/dashboard/catalog"
              style={{
                fontSize: '0.85rem',
                color: '#a1a1aa',
                textDecoration: 'none',
                fontWeight: 600,
                transition: 'color 0.15s',
              }}
            >
              Catálogo de Proveedores
            </Link>
            <Link
              href="/dashboard/agents"
              style={{
                fontSize: '0.85rem',
                color: '#a1a1aa',
                textDecoration: 'none',
                fontWeight: 600,
                transition: 'color 0.15s',
              }}
            >
              Directorio de Agentes
            </Link>
            <Link
              href="/dashboard"
              style={{
                fontSize: '0.85rem',
                background: 'linear-gradient(135deg, #faae33, #d98216)',
                color: '#09080d',
                padding: '0.55rem 1.25rem',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 800,
                letterSpacing: '0.01em',
                boxShadow: '0 4px 14px rgba(250, 174, 51, 0.25)',
              }}
            >
              Entrar al Panel &rarr;
            </Link>
          </div>
        </div>
      </nav>

      {/* ── THE SOLE HERO & MAIN EXPERIENCE: AGENT ORBIT CAROUSEL ────── */}
      <main
        style={{
          flex: 1,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <AgentOrbitCarousel
          height="calc(100vh - 105px)"
          onPlay={handleOpenSpec}
        />
      </main>

      {/* ── MINIMAL EDITORIAL FOOTER ─────────────────────────────────── */}
      <footer
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          padding: '0.85rem 1.5rem',
          textAlign: 'center',
          fontSize: '0.74rem',
          color: '#52525b',
          backgroundColor: '#07060a',
        }}
      >
        &copy; {new Date().getFullYear()} Nexus OS &bull; Sistema Operativo Autónomo de Comercio Electrónico
      </footer>

      {/* ── MODAL: FICHA TÉCNICA DEL AGENTE ──────────────────────────── */}
      {selectedSpec && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(5, 4, 8, 0.85)',
            backdropFilter: 'blur(16px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
          onClick={() => setSelectedSpec(null)}
        >
          <div
            style={{
              backgroundColor: '#110f18',
              border: `1px solid ${selectedSpec.accent}40`,
              borderRadius: '18px',
              maxWidth: '560px',
              width: '100%',
              padding: '2rem',
              boxShadow: `0 25px 60px rgba(0, 0, 0, 0.8), 0 0 40px ${selectedSpec.accent}20`,
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setSelectedSpec(null)}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: 'rgba(255, 255, 255, 0.06)',
                border: 'none',
                color: '#a1a1aa',
                borderRadius: '8px',
                width: 32,
                height: 32,
                cursor: 'pointer',
                display: 'grid',
                placeItems: 'center',
                fontSize: '1.1rem',
                fontWeight: 700,
              }}
            >
              &times;
            </button>

            {/* Category badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.3rem 0.75rem',
                borderRadius: '99px',
                fontSize: '0.72rem',
                fontWeight: 800,
                color: selectedSpec.accent,
                background: `${selectedSpec.accent}15`,
                border: `1px solid ${selectedSpec.accent}30`,
                textTransform: 'uppercase',
                marginBottom: '1rem',
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: selectedSpec.accent }} />
              <span>{selectedSpec.category}</span>
            </div>

            {/* Title & Role */}
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, margin: '0 0 0.35rem 0', color: '#ffffff' }}>
              {selectedSpec.name}
            </h2>
            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: selectedSpec.accent, marginBottom: '1.25rem' }}>
              {selectedSpec.role}
            </div>

            {/* Description */}
            <p style={{ fontSize: '0.9rem', color: '#d4d4d8', lineHeight: 1.6, margin: '0 0 1.5rem 0' }}>
              {selectedSpec.description}
            </p>

            {/* Inputs & Outputs Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ background: '#161421', border: '1px solid #241f33', borderRadius: '10px', padding: '1rem' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#faae33', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  Datos que Analiza
                </div>
                <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.78rem', color: '#a1a1aa', lineHeight: 1.5 }}>
                  {selectedSpec.inputs.map((inp, i) => (
                    <li key={i}>{inp}</li>
                  ))}
                </ul>
              </div>

              <div style={{ background: '#161421', border: '1px solid #241f33', borderRadius: '10px', padding: '1rem' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#34d399', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  Entregables que Produce
                </div>
                <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.78rem', color: '#a1a1aa', lineHeight: 1.5 }}>
                  {selectedSpec.outputs.map((out, i) => (
                    <li key={i}>{out}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Skills pills */}
            <div style={{ marginBottom: '1.75rem' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#71717a', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Habilidades &amp; Herramientas
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                {selectedSpec.tools.map((t, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      color: '#e4e4e7',
                      background: 'rgba(255, 255, 255, 0.06)',
                      padding: '0.3rem 0.7rem',
                      borderRadius: '99px',
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.85rem' }}>
              <button
                type="button"
                onClick={() => setSelectedSpec(null)}
                style={{
                  background: 'transparent',
                  border: '1px solid #2e2840',
                  color: '#a1a1aa',
                  padding: '0.65rem 1.25rem',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                Cerrar
              </button>
              <Link
                href="/dashboard"
                style={{
                  background: 'linear-gradient(135deg, #faae33, #d98216)',
                  color: '#09080d',
                  padding: '0.65rem 1.5rem',
                  borderRadius: '8px',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(250, 174, 51, 0.25)',
                }}
              >
                Abrir en Centro de Control &rarr;
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
