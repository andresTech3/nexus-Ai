'use client'

import React, { useState, useEffect, useCallback } from 'react'
import type { CompetitorAd } from '@/lib/meta/adLibrary'
import { MetaAdDeepDiveModal } from '@/components/meta/MetaAdDeepDiveModal'
import { useCurrency } from '@/hooks/useCurrency'

interface MetaAdLibrarySpyProps {
  initialQuery?: string
  initialCountry?: string
}

const COUNTRIES = [
  { code: 'ES', label: '🇪🇸 España' },
  { code: 'US', label: '🇺🇸 Estados Unidos' },
  { code: 'MX', label: '🇲🇽 México' },
  { code: 'CO', label: '🇨🇴 Colombia' },
  { code: 'ALL', label: '🌐 Todos los Países' },
]

export function MetaAdLibrarySpy({ initialQuery = 'lampara luna', initialCountry = 'ES' }: MetaAdLibrarySpyProps) {
  const { formatMoney } = useCurrency()
  const [query, setQuery] = useState(initialQuery)
  const [country, setCountry] = useState(initialCountry)
  const [mediaType, setMediaType] = useState<'ALL' | 'VIDEO' | 'IMAGE'>('ALL')
  const [isLoading, setIsLoading] = useState(false)
  const [ads, setAds] = useState<CompetitorAd[]>([])
  const [webUrl, setWebUrl] = useState<string>('')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [selectedAdForModal, setSelectedAdForModal] = useState<CompetitorAd | null>(null)

  const handleSearch = useCallback(async (searchQuery: string, searchCountry: string, searchMedia: string) => {
    if (!searchQuery.trim()) return
    setIsLoading(true)

    try {
      const res = await fetch(
        `/api/v1/meta/ad-library?query=${encodeURIComponent(searchQuery.trim())}&country=${encodeURIComponent(
          searchCountry
        )}&mediaType=${encodeURIComponent(searchMedia)}`
      )
      const data = await res.json()

      if (data.success) {
        setAds(data.ads || [])
        setWebUrl(data.adLibraryWebUrl || '')
      }
    } catch (err) {
      console.error('Error querying Meta Ad Library API:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery, initialCountry, 'ALL')
    }
  }, [initialQuery, initialCountry, handleSearch])

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch(query, country, mediaType)
  }

  const copyHook = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div
      style={{
        background: '#111113',
        border: '1px solid #27272a',
        borderRadius: '12px',
        padding: '1.5rem',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <span
              style={{
                fontSize: '0.72rem',
                color: '#38bdf8',
                background: 'rgba(56, 189, 248, 0.12)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                padding: '2px 8px',
                borderRadius: '6px',
                fontWeight: 700,
              }}
            >
              META AD LIBRARY EN VIVO
            </span>
            <span style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: 600 }}>
              ● Anuncios Activos en Facebook &amp; Instagram
            </span>
          </div>

          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
            Espía de Anuncios y Competencia de Meta
          </h3>
          <p style={{ fontSize: '0.825rem', color: '#a1a1aa', margin: '0.25rem 0 0 0', maxWidth: 640 }}>
            Descubre qué anuncios de tu producto están corriendo ahora mismo en Meta. Si un competidor lleva más de 20 días con un anuncio activo, significa que es <strong>rentable y está facturando</strong>.
          </p>
        </div>

        {webUrl && (
          <a
            href={webUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: '#1877f2',
              color: '#ffffff',
              padding: '0.6rem 1.1rem',
              borderRadius: '8px',
              fontSize: '0.825rem',
              fontWeight: 700,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              boxShadow: '0 4px 14px rgba(24, 119, 242, 0.3)',
            }}
          >
            <span>↗</span>
            <span>Abrir Biblioteca Oficial de Meta</span>
          </a>
        )}
      </div>

      {/* Filter Bar */}
      <form onSubmit={onSubmit} style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
        <input
          type="text"
          placeholder="Buscar producto o marca competidora..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            flex: 2,
            minWidth: 220,
            background: '#09090b',
            border: '1px solid #27272a',
            color: '#ffffff',
            padding: '0.65rem 0.9rem',
            borderRadius: '6px',
            fontSize: '0.85rem',
          }}
        />

        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          style={{
            flex: 1,
            minWidth: 140,
            background: '#09090b',
            border: '1px solid #27272a',
            color: '#ffffff',
            padding: '0.65rem 0.9rem',
            borderRadius: '6px',
            fontSize: '0.85rem',
            cursor: 'pointer',
          }}
        >
          {COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.label}
            </option>
          ))}
        </select>

        <select
          value={mediaType}
          onChange={(e) => setMediaType(e.target.value as any)}
          style={{
            flex: 1,
            minWidth: 140,
            background: '#09090b',
            border: '1px solid #27272a',
            color: '#ffffff',
            padding: '0.65rem 0.9rem',
            borderRadius: '6px',
            fontSize: '0.85rem',
            cursor: 'pointer',
          }}
        >
          <option value="ALL">Todos los Formatos</option>
          <option value="VIDEO">Solo Videos (Reels/Feed)</option>
          <option value="IMAGE">Solo Imágenes / Carruseles</option>
        </select>

        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          style={{
            background: '#27272a',
            border: '1px solid #3f3f46',
            color: '#ffffff',
            padding: '0.65rem 1.25rem',
            borderRadius: '6px',
            fontSize: '0.85rem',
            fontWeight: 700,
            cursor: !query.trim() || isLoading ? 'not-allowed' : 'pointer',
            opacity: !query.trim() || isLoading ? 0.6 : 1,
          }}
        >
          {isLoading ? 'Buscando...' : 'Espiar Anuncios'}
        </button>
      </form>

      {/* Results List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {ads.map((ad) => {
          const isWinner = ad.profitabilityScore === 'SUPER_GANADOR'
          const metrics = ad.metrics || {
            estimatedReach: '150.000+ personas',
            estimatedSpend: '1.200€+',
            engagementRate: '4.5%',
            audienceDemographic: '25-45 años',
            trendScore: 88,
          }

          return (
            <div
              key={ad.id}
              style={{
                background: '#09090b',
                border: `1px solid ${isWinner ? 'rgba(52, 211, 153, 0.4)' : '#1f1f23'}`,
                borderRadius: '12px',
                padding: '1.25rem',
                display: 'grid',
                gridTemplateColumns: 'minmax(200px, 260px) 1fr',
                gap: '1.25rem',
                boxShadow: isWinner ? '0 0 20px rgba(52, 211, 153, 0.08)' : 'none',
              }}
            >
              {/* Left Column: Visual Media & Video Preview */}
              <div
                onClick={() => setSelectedAdForModal(ad)}
                style={{
                  position: 'relative',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  background: '#121214',
                  border: '1px solid #27272a',
                  minHeight: 220,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                }}
              >
                {/* Thumbnail Image */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `url(${ad.thumbnailUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'brightness(0.85)',
                  }}
                />

                {/* Format & Duration Badges */}
                <div
                  style={{
                    position: 'relative',
                    zIndex: 2,
                    padding: '0.6rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span
                    style={{
                      background: 'rgba(0, 0, 0, 0.75)',
                      backdropFilter: 'blur(4px)',
                      color: ad.mediaType === 'VIDEO' ? '#38bdf8' : '#a78bfa',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: '4px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    {ad.mediaType === 'VIDEO' ? '🎬 VIDEO AD' : '🖼️ IMAGEN'}
                  </span>

                  {ad.videoDuration && (
                    <span
                      style={{
                        background: 'rgba(0, 0, 0, 0.75)',
                        color: '#f4f4f5',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: '4px',
                      }}
                    >
                      {ad.videoDuration.split(' ')[0]}
                    </span>
                  )}
                </div>

                {/* Center Play Button for Video */}
                {ad.mediaType === 'VIDEO' && (
                  <div
                    style={{
                      position: 'relative',
                      zIndex: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.3rem',
                      margin: 'auto 0',
                    }}
                  >
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        background: 'rgba(24, 119, 242, 0.85)',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
                        border: '2px solid rgba(255,255,255,0.4)',
                        cursor: 'pointer',
                      }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                      </svg>
                    </div>
                    <span
                      style={{
                        background: 'rgba(0,0,0,0.8)',
                        color: '#e4e4e7',
                        fontSize: '0.65rem',
                        padding: '2px 6px',
                        borderRadius: '4px',
                      }}
                    >
                      Fórmula 3s Hook
                    </span>
                  </div>
                )}

                {/* Bottom Hook Type Bar */}
                <div
                  style={{
                    position: 'relative',
                    zIndex: 2,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
                    padding: '0.75rem 0.6rem 0.5rem 0.6rem',
                  }}
                >
                  <div style={{ fontSize: '0.68rem', color: '#fbbf24', fontWeight: 700 }}>
                    🎯 {ad.visualHookType}
                  </div>
                </div>
              </div>

              {/* Right Column: Copy, Metrics & Timeline */}
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '0.85rem' }}>
                {/* Header: Page Name & Status */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: '50%',
                        background: '#1877f2',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '0.85rem',
                      }}
                    >
                      {ad.pageName.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ffffff' }}>
                        {ad.pageName}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#71717a' }}>
                        Canales: {ad.platforms.join(' · ')}
                      </div>
                    </div>
                  </div>

                  {/* Days Active Badge */}
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '3px 10px',
                      borderRadius: '6px',
                      background:
                        ad.profitabilityScore === 'SUPER_GANADOR'
                          ? 'rgba(52, 211, 153, 0.15)'
                          : ad.profitabilityScore === 'ESCALANDO'
                          ? 'rgba(56, 189, 248, 0.15)'
                          : 'rgba(250, 174, 51, 0.15)',
                      color:
                        ad.profitabilityScore === 'SUPER_GANADOR'
                          ? '#34d399'
                          : ad.profitabilityScore === 'ESCALANDO'
                          ? '#38bdf8'
                          : '#faae33',
                      border: `1px solid ${
                        ad.profitabilityScore === 'SUPER_GANADOR'
                          ? 'rgba(52, 211, 153, 0.3)'
                          : 'rgba(56, 189, 248, 0.3)'
                      }`,
                    }}
                  >
                    {ad.profitabilityScore === 'SUPER_GANADOR'
                      ? `🔥 SUPER GANADOR (${ad.daysActive} días activo)`
                      : ad.profitabilityScore === 'ESCALANDO'
                      ? `🚀 ESCALANDO (${ad.daysActive} días activo)`
                      : `🧪 TESTEANDO (${ad.daysActive} días activo)`}
                  </span>
                </div>

                {/* Ad Copy */}
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f4f4f5', marginBottom: '0.35rem' }}>
                    {ad.headline}
                  </div>
                  <div style={{ fontSize: '0.825rem', color: '#a1a1aa', lineHeight: 1.5 }}>
                    {ad.bodyText}
                  </div>
                </div>

                {/* Metrics Grid */}
                <div
                  style={{
                    background: '#121214',
                    border: '1px solid #1f1f23',
                    borderRadius: '8px',
                    padding: '0.75rem',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                    gap: '0.6rem',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.68rem', color: '#71717a' }}>Alcance Estimado</div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#38bdf8' }}>
                      {metrics.estimatedReach}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.68rem', color: '#71717a' }}>Inversión Estimada</div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#34d399' }}>
                      {metrics.estimatedSpend}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.68rem', color: '#71717a' }}>Interacción (CTR)</div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fbbf24' }}>
                      {metrics.engagementRate}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.68rem', color: '#71717a' }}>Demografía Principal</div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#e4e4e7' }}>
                      {metrics.audienceDemographic}
                    </div>
                  </div>
                </div>

                {/* Traction & Scaling Bar */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#71717a', marginBottom: '3px' }}>
                    <span>Tracción Publicitaria ({ad.daysActive} días continuos)</span>
                    <span style={{ color: isWinner ? '#34d399' : '#38bdf8', fontWeight: 700 }}>
                      Score de Rentabilidad: {metrics.trendScore}/100
                    </span>
                  </div>
                  <div style={{ width: '100%', height: 6, background: '#1c1c20', borderRadius: 3, overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${Math.min(100, (ad.daysActive / 35) * 100)}%`,
                        height: '100%',
                        background: isWinner
                          ? 'linear-gradient(90deg, #34d399, #10b981)'
                          : 'linear-gradient(90deg, #38bdf8, #2563eb)',
                        borderRadius: 3,
                      }}
                    />
                  </div>
                </div>

                {/* Footer Actions */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                    borderTop: '1px solid #18181b',
                    paddingTop: '0.75rem',
                  }}
                >
                  <div style={{ fontSize: '0.72rem', color: '#71717a' }}>
                    ID Meta Ads: <code>{ad.id}</code>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => setSelectedAdForModal(ad)}
                      style={{
                        background: 'linear-gradient(135deg, #a855f7, #9333ea)',
                        border: 'none',
                        color: '#ffffff',
                        padding: '5px 12px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                      }}
                    >
                      <span>🎬</span>
                      <span>Ver Video & Métricas</span>
                    </button>

                    <button
                      onClick={() => copyHook(`${ad.headline}\n\n${ad.bodyText}`, ad.id)}
                      style={{
                        background: '#18181b',
                        border: '1px solid #27272a',
                        color: copiedId === ad.id ? '#34d399' : '#d4d4d8',
                        padding: '5px 12px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      {copiedId === ad.id ? '✓ Gancho Copiado' : 'Copiar Gancho'}
                    </button>

                    <a
                      href={ad.snapshotUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        background: 'rgba(24, 119, 242, 0.15)',
                        border: '1px solid rgba(24, 119, 242, 0.35)',
                        color: '#60a5fa',
                        padding: '5px 12px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                      }}
                    >
                      <span>Meta Library</span>
                      <span>&rarr;</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Interactive Ad Deep-Dive Modal */}
      <MetaAdDeepDiveModal
        ad={selectedAdForModal}
        onClose={() => setSelectedAdForModal(null)}
      />
    </div>
  )
}

