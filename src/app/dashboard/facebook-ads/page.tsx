'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useOfficeStore } from '@/lib/office/store'
import { calculateUnitEconomics } from '@/lib/office/finance/calculator'
import { MetaConnectBanner } from '@/components/meta/MetaConnectBanner'
import { useMetaConnection } from '@/hooks/useMetaConnection'

interface MetaCampaign {
  id: string
  name: string
  objective: 'OUTCOME_SALES'
  budgetType: 'ABO' | 'CBO'
  dailyBudget: number
  targetAudience: string
  status: 'draft' | 'ready' | 'active'
  hookAngle: string
  headline: string
  bodyCopy: string
  cta: string
}

export default function FacebookAdsPage() {
  const store = useOfficeStore()
  const activeOffice = store.offices[store.activeOfficeId]
  const hasProduct = Boolean(activeOffice?.product?.name?.trim())
  const productName = activeOffice?.product?.name?.trim() || ''
  const brandName = activeOffice?.brand?.name?.trim() || 'Mi Marca'

  // Unit economics for stop loss calculation
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

  // Real Meta Ads OAuth connection (replaces the old manual modal)
  const { connected: metaConnected, accountName: metaAccountName, adAccounts } = useMetaConnection('ads')

  // Legacy manual pixel state kept for backward compat (used if OAuth not connected)
  const [adAccountId, setAdAccountId] = useState('')
  const [pixelId, setPixelId] = useState('')
  const [activeTab, setActiveTab] = useState<'campaigns' | 'generator' | 'rules' | 'mcp'>('campaigns')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Campaign Generator Form
  const [campaignType, setCampaignType] = useState<'TESTING' | 'SCALING'>('TESTING')
  const [targetNiche, setTargetNiche] = useState('Salud lumbar, Fitness en casa, Ergonomía de oficina')
  const [hookStyle, setHookStyle] = useState<'PAIN' | 'TRANSFORMATION' | 'MECHANISM'>('PAIN')
  const [copiedId, setCopiedId] = useState<string | null>(null)

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

  // Pre-configured campaigns based on current product
  const [campaigns, setCampaigns] = useState<MetaCampaign[]>([
    {
      id: 'cmp_1',
      name: `[ABO-TEST] ${productName} — 3 Ángulos de Gancho`,
      objective: 'OUTCOME_SALES',
      budgetType: 'ABO',
      dailyBudget: 25,
      targetAudience: 'Broad (España, 25-55 años) + Exclusión de compradores 30d',
      status: 'ready',
      hookAngle: 'Visual 0-3s: Persona encorvada frente a la pantalla con tensión evidente en cuello.',
      headline: 'Alivia la tensión en tu espalda en solo 15 minutos al día.',
      bodyCopy: '¿Pasas más de 6 horas sentado frente al ordenador? Diseñado por especialistas biomecánicos para corregir tu postura de forma natural y sin dolor. Aprovecha un 20% de descuento en el pack de 2 unidades hoy.',
      cta: 'Comprar ahora',
    },
    {
      id: 'cmp_2',
      name: `[CBO-SCALE] ${productName} — Ganadores Validados`,
      objective: 'OUTCOME_SALES',
      budgetType: 'CBO',
      dailyBudget: 60,
      targetAudience: 'Intereses: Ergonomía, Yoga, Teletrabajo + Lookalike 1% Compradores',
      status: 'draft',
      hookAngle: 'Demostración de mecanismo único en 3 segundos (antes vs. después inmediato).',
      headline: 'El soporte ergonómico favorito de quienes trabajan desde casa.',
      bodyCopy: 'Discreto, transpirable y ajustable bajo la ropa. Miles de personas ya han recuperado su bienestar postural diario sin tratamientos costosos.',
      cta: 'Ver Oferta',
    },
  ])

  return (
    <div id="facebook-ads-workspace" style={{ maxWidth: 1200, margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Toast Notification */}
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
                background: 'rgba(24, 119, 242, 0.15)',
                color: '#1877f2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </span>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
              Meta Ads (Facebook & Instagram Ads)
            </h1>
            <span
              style={{
                fontSize: '0.72rem',
                padding: '2px 8px',
                borderRadius: '999px',
                background: metaConnected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                color: metaConnected ? '#34d399' : '#fbbf24',
                fontWeight: 600,
                border: metaConnected ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)',
              }}
            >
              {metaConnected ? '✓ Cuenta Meta conectada' : 'Modo Asistido — Conecta tu cuenta abajo'}
            </span>
          </div>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#a1a1aa' }}>
            Estructuras de campaña de alta conversión, reglas de stop-loss vinculadas al CPA de Eva ({unitEco.cpa_maximo_rentable.toFixed(2)} €) y copys de respuesta directa.
          </p>
        </div>

        {/* OAuth Connect Button — replaced by MetaConnectBanner below */}
        {metaConnected && metaAccountName && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.45rem 0.9rem',
              borderRadius: '6px',
              backgroundColor: '#18181b',
              color: '#34d399',
              border: '1px solid rgba(52, 211, 153, 0.3)',
              fontSize: '0.8rem',
              fontWeight: 600,
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px #22c55e', display: 'inline-block' }} />
            {metaAccountName}
            {adAccounts && adAccounts.length > 0 && (
              <span style={{ color: '#71717a', fontSize: '0.72rem' }}>
                · {adAccounts.length} cuenta{adAccounts.length > 1 ? 's' : ''} publicitaria{adAccounts.length > 1 ? 's' : ''}
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── Meta Ads OAuth Connection Banner ────────────────────────────────── */}
      <div style={{ marginBottom: '1.5rem' }}>
        <MetaConnectBanner mode="ads" />
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
              Tomás (Media Buyer) necesita un producto asignado en tu espacio para estructurar los conjuntos ABO/CBO y fijar las reglas de stop-loss reales.
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

      {/* KPI Cards Ribbon */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          marginBottom: '1.75rem',
        }}
      >
        <div
          style={{
            background: '#121214',
            border: '1px solid #1f1f23',
            borderRadius: '8px',
            padding: '1rem',
          }}
        >
          <div style={{ fontSize: '0.75rem', color: '#71717a', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.25rem' }}>
            CPA Techo Recomendado
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#34d399' }}>
            {unitEco.cpa_maximo_rentable.toFixed(2)} €
          </div>
          <div style={{ fontSize: '0.75rem', color: '#a1a1aa', marginTop: '0.25rem' }}>
            Límite de coste por compra para no perder dinero
          </div>
        </div>

        <div
          style={{
            background: '#121214',
            border: '1px solid #1f1f23',
            borderRadius: '8px',
            padding: '1rem',
          }}
        >
          <div style={{ fontSize: '0.75rem', color: '#71717a', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.25rem' }}>
            ROAS de Equilibrio
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#60a5fa' }}>
            {unitEco.roas_equilibrio.toFixed(2)}x
          </div>
          <div style={{ fontSize: '0.75rem', color: '#a1a1aa', marginTop: '0.25rem' }}>
            Retorno mínimo de inversión publicitaria
          </div>
        </div>

        <div
          style={{
            background: '#121214',
            border: '1px solid #1f1f23',
            borderRadius: '8px',
            padding: '1rem',
          }}
        >
          <div style={{ fontSize: '0.75rem', color: '#71717a', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.25rem' }}>
            Presupuesto Testing (ABO)
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#faae33' }}>
            20 € / día
          </div>
          <div style={{ fontSize: '0.75rem', color: '#a1a1aa', marginTop: '0.25rem' }}>
            3-4 adsets a 5€ cada uno durante 72 horas
          </div>
        </div>

        <div
          style={{
            background: '#121214',
            border: '1px solid #1f1f23',
            borderRadius: '8px',
            padding: '1rem',
          }}
        >
          <div style={{ fontSize: '0.75rem', color: '#71717a', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.25rem' }}>
            Regla de Apagado (Stop-Loss)
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#f87171' }}>
            15.00 € sin ATC
          </div>
          <div style={{ fontSize: '0.75rem', color: '#a1a1aa', marginTop: '0.25rem' }}>
            Apagar anuncio si no añade al carrito
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '1px solid #1f1f23',
          marginBottom: '1.5rem',
        }}
      >
        <button
          onClick={() => setActiveTab('campaigns')}
          style={{
            padding: '0.65rem 1rem',
            fontSize: '0.85rem',
            fontWeight: 600,
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'campaigns' ? '2px solid #1877f2' : '2px solid transparent',
            color: activeTab === 'campaigns' ? '#ffffff' : '#71717a',
            cursor: 'pointer',
          }}
        >
          Estructuras de Campaña ({campaigns.length})
        </button>

        <button
          onClick={() => setActiveTab('generator')}
          style={{
            padding: '0.65rem 1rem',
            fontSize: '0.85rem',
            fontWeight: 600,
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'generator' ? '2px solid #1877f2' : '2px solid transparent',
            color: activeTab === 'generator' ? '#ffffff' : '#71717a',
            cursor: 'pointer',
          }}
        >
          Generador de Copys & Anuncios
        </button>

        <button
          onClick={() => setActiveTab('rules')}
          style={{
            padding: '0.65rem 1rem',
            fontSize: '0.85rem',
            fontWeight: 600,
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'rules' ? '2px solid #1877f2' : '2px solid transparent',
            color: activeTab === 'rules' ? '#ffffff' : '#71717a',
            cursor: 'pointer',
          }}
        >
          Reglas Automáticas de Seguridad
        </button>
      </div>

      {/* Tab: Campaigns */}
      {activeTab === 'campaigns' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {campaigns.map((camp) => (
            <div
              key={camp.id}
              style={{
                backgroundColor: '#121214',
                border: '1px solid #1f1f23',
                borderRadius: '8px',
                padding: '1.5rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '1rem',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: camp.budgetType === 'ABO' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(168, 85, 247, 0.15)',
                        color: camp.budgetType === 'ABO' ? '#38bdf8' : '#c084fc',
                      }}
                    >
                      {camp.budgetType} • {camp.dailyBudget} € / día
                    </span>
                    <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600, color: '#ffffff' }}>
                      {camp.name}
                    </h3>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#71717a' }}>
                    Audiencia: <span style={{ color: '#d4d4d8' }}>{camp.targetAudience}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        `CAMPAÑA META ADS:\nNombre: ${camp.name}\nTipo: ${camp.budgetType} (${camp.dailyBudget}€/día)\nAudiencia: ${camp.targetAudience}\nGancho Visual (0-3s): ${camp.hookAngle}\nTitular: ${camp.headline}\nTexto Principal: ${camp.bodyCopy}\nCTA: ${camp.cta}`,
                        camp.id
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
                    {copiedId === camp.id ? '✓ Copiado' : 'Copiar Ficha Completa'}
                  </button>
                </div>
              </div>

              {/* Ad Creative Breakdown */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '1rem',
                  backgroundColor: '#09090b',
                  padding: '1rem',
                  borderRadius: '6px',
                  border: '1px solid #18181b',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#faae33', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                    1. Gancho Visual (Primeros 3 Segundos)
                  </div>
                  <div style={{ fontSize: '0.825rem', color: '#d4d4d8', lineHeight: 1.5 }}>
                    {camp.hookAngle}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                    2. Titular & Llamada a la Acción
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ffffff', marginBottom: '0.2rem' }}>
                    &ldquo;{camp.headline}&rdquo;
                  </div>
                  <div style={{ fontSize: '0.775rem', color: '#71717a' }}>
                    Botón: <span style={{ color: '#ffffff', fontWeight: 600 }}>[{camp.cta}]</span>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.72rem', color: '#a1a1aa', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                    3. Texto del Anuncio (Copy de Conversión)
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#a1a1aa', lineHeight: 1.45 }}>
                    {camp.bodyCopy}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Generator */}
      {activeTab === 'generator' && (
        <div
          style={{
            backgroundColor: '#121214',
            border: '1px solid #1f1f23',
            borderRadius: '8px',
            padding: '1.5rem',
          }}
        >
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.15rem', color: '#ffffff', fontWeight: 600 }}>
            Generador de Anuncios para {productName}
          </h3>
          <p style={{ margin: '0 0 1.25rem 0', fontSize: '0.825rem', color: '#71717a' }}>
            Configura el ángulo y genera copys móviles estructurados sin relleno innecesario.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.775rem', color: '#a1a1aa', fontWeight: 600, marginBottom: '0.4rem' }}>
                Tipo de Campaña
              </label>
              <select
                value={campaignType}
                onChange={(e) => setCampaignType(e.target.value as 'TESTING' | 'SCALING')}
                style={{
                  width: '100%',
                  background: '#09090b',
                  border: '1px solid #27272a',
                  color: '#ffffff',
                  padding: '0.6rem 0.8rem',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                }}
              >
                <option value="TESTING">Testing de Creativos (ABO - 20€/día)</option>
                <option value="SCALING">Escalado de Ganadores (CBO - 50€+/día)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.775rem', color: '#a1a1aa', fontWeight: 600, marginBottom: '0.4rem' }}>
                Ángulo Psicológico de Gancho
              </label>
              <select
                value={hookStyle}
                onChange={(e) => setHookStyle(e.target.value as 'PAIN' | 'TRANSFORMATION' | 'MECHANISM')}
                style={{
                  width: '100%',
                  background: '#09090b',
                  border: '1px solid #27272a',
                  color: '#ffffff',
                  padding: '0.6rem 0.8rem',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                }}
              >
                <option value="PAIN">Dolor Visceral (Problema agudo actual)</option>
                <option value="TRANSFORMATION">Transformación (Resultado deseado en 7 días)</option>
                <option value="MECHANISM">Mecanismo Único (Por qué otros fallan y este funciona)</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.775rem', color: '#a1a1aa', fontWeight: 600, marginBottom: '0.4rem' }}>
              Intereses / Niche Target
            </label>
            <input
              type="text"
              value={targetNiche}
              onChange={(e) => setTargetNiche(e.target.value)}
              placeholder="Ej. Postura, Teletrabajo, Dolores de espalda, Yoga"
              style={{
                width: '100%',
                background: '#09090b',
                border: '1px solid #27272a',
                color: '#ffffff',
                padding: '0.6rem 0.8rem',
                borderRadius: '6px',
                fontSize: '0.85rem',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <button
            onClick={() => {
              const newCmp: MetaCampaign = {
                id: `cmp_${Date.now()}`,
                name: `[${campaignType}] ${productName} — ${hookStyle}`,
                objective: 'OUTCOME_SALES',
                budgetType: campaignType === 'TESTING' ? 'ABO' : 'CBO',
                dailyBudget: campaignType === 'TESTING' ? 20 : 50,
                targetAudience: targetNiche,
                status: 'ready',
                hookAngle:
                  hookStyle === 'PAIN'
                    ? 'Visual: Primer plano de tensión en zona cervical con gráfico de calor rojo.'
                    : hookStyle === 'TRANSFORMATION'
                    ? 'Visual: Usuario usando el producto con postura erguida natural mientras sonríe.'
                    : 'Visual: Comparativa lateral de columna desalineada vs. alineación perfecta con soporte.',
                headline: `${productName}: Alivio ergonómico diario probado.`,
                bodyCopy: `Diseñado para el ritmo de vida actual. Con ${brandName}, dile adiós a las molestias posturales. Envío rápido y garantía de satisfacción 30 días.`,
                cta: 'Pedir con Descuento',
              }
              setCampaigns([newCmp, ...campaigns])
              setActiveTab('campaigns')
              showToast('Campaña generada y guardada en tus estructuras')
            }}
            style={{
              padding: '0.65rem 1.25rem',
              background: '#1877f2',
              border: 'none',
              borderRadius: '6px',
              color: '#ffffff',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Generar Campaña & Copy con Tomás (Media Buyer)
          </button>
        </div>
      )}

      {/* Tab: Rules */}
      {activeTab === 'rules' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div
            style={{
              backgroundColor: '#121214',
              border: '1px solid #1f1f23',
              borderRadius: '8px',
              padding: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ color: '#ef4444' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </span>
              <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#ffffff', fontWeight: 600 }}>
                Reglas de Stop-Loss Vinculadas al Margen de Eva CFO
              </h3>
            </div>
            <p style={{ margin: '0 0 1.25rem 0', fontSize: '0.825rem', color: '#71717a' }}>
              Estas reglas protegen tu presupuesto publicitario automáticamente para evitar gastar en anuncios perdedores.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div
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
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#ffffff' }}>
                    Regla 1: Stop-Loss por Falta de Intención de Compra
                  </div>
                  <div style={{ fontSize: '0.775rem', color: '#71717a', marginTop: '0.2rem' }}>
                    Si un conjunto de anuncios gasta más de <strong style={{ color: '#f87171' }}>15.00 €</strong> y tiene <strong style={{ color: '#f87171' }}>0 Añadir al Carrito (ATC)</strong>.
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 600 }}>Acción: Pausar Anuncio</span>
                </div>
              </div>

              <div
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
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#ffffff' }}>
                    Regla 2: Límite por CPA Techo Sobrepasado
                  </div>
                  <div style={{ fontSize: '0.775rem', color: '#71717a', marginTop: '0.2rem' }}>
                    Si el coste por compra supera <strong style={{ color: '#f87171' }}>{unitEco.cpa_maximo_rentable.toFixed(2)} €</strong> en una ventana de 3 días con al menos 2 ventas.
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', color: '#fbbf24', fontWeight: 600 }}>Acción: Reducir Presupuesto 30%</span>
                </div>
              </div>

              <div
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
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#ffffff' }}>
                    Regla 3: Escalado de Creativos Ganadores
                  </div>
                  <div style={{ fontSize: '0.775rem', color: '#71717a', marginTop: '0.2rem' }}>
                    Si el ROAS supera <strong style={{ color: '#34d399' }}>{(unitEco.roas_equilibrio * 1.5).toFixed(2)}x</strong> de forma estable durante 48 horas con al menos 5 compras.
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 600 }}>Acción: Incrementar Presupuesto 20%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

