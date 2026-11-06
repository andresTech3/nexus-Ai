'use client'

import React, { useMemo } from 'react'
import { useMetaConnection } from '@/hooks/useMetaConnection'

/**
 * InstagramProfileAnalyzer
 *
 * Shows real Instagram profile metrics pulled from the Graph API.
 * When not connected, renders nothing (parent shows <MetaConnectBanner>).
 * Based on sergebulaev/instagram-skills:
 * - Engagement rate calculation
 * - Content type distribution (Reels vs Carousels vs Posts)
 * - Best performing posts
 * - Bio quality score
 * - Posting consistency
 */
export function InstagramProfileAnalyzer() {
  const { connected, loading, igProfile, igMedia } = useMetaConnection('instagram')

  const followers = igProfile?.followers_count ?? 0
  const mediaCount = igMedia?.length ?? 0

  // ── Engagement rate (avg likes+comments / followers) ─────────────────────
  const engagementRate = useMemo(() => {
    if (!igMedia || igMedia.length === 0 || followers === 0) return 0
    const totalEngagement = igMedia.reduce(
      (acc, m) => acc + (m.like_count ?? 0) + (m.comments_count ?? 0),
      0
    )
    return ((totalEngagement / igMedia.length / followers) * 100).toFixed(2)
  }, [igMedia, followers])

  // ── Content distribution ──────────────────────────────────────────────────
  const distribution = useMemo(() => {
    if (!igMedia) return { VIDEO: 0, CAROUSEL_ALBUM: 0, IMAGE: 0 }
    return igMedia.reduce(
      (acc, m) => {
        acc[m.media_type] = (acc[m.media_type] ?? 0) + 1
        return acc
      },
      { VIDEO: 0, CAROUSEL_ALBUM: 0, IMAGE: 0 } as Record<string, number>
    )
  }, [igMedia])

  // ── Top 3 posts by engagement ─────────────────────────────────────────────
  const topPosts = useMemo(() => {
    if (!igMedia) return []
    return [...igMedia]
      .sort((a, b) => (b.like_count + b.comments_count) - (a.like_count + a.comments_count))
      .slice(0, 3)
  }, [igMedia])

  // ── Bio quality score ─────────────────────────────────────────────────────
  const bioScore = useMemo(() => {
    const bio = igProfile?.biography ?? ''
    let score = 0
    if (bio.length > 50) score += 20
    if (bio.includes('http') || igProfile?.website) score += 20
    if (bio.includes('\n')) score += 15 // has line breaks
    if (/[🎯💡🚀✅🔥]/.test(bio)) score += 15 // has emojis
    if (bio.length > 100) score += 15
    if (igProfile?.website) score += 15
    return Math.min(score, 100)
  }, [igProfile])

  // ── Posting frequency ────────────────────────────────────────────────────
  const postingFrequency = useMemo(() => {
    if (!igMedia || igMedia.length < 2) return null
    const sorted = [...igMedia].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
    const newest = new Date(sorted[0].timestamp)
    const oldest = new Date(sorted[sorted.length - 1].timestamp)
    const daySpan = Math.max(1, (newest.getTime() - oldest.getTime()) / 86400000)
    return (igMedia.length / daySpan * 7).toFixed(1) // posts per week
  }, [igMedia])

  if (loading || !connected || !igProfile) return null

  const engNum = parseFloat(String(engagementRate))
  const engLabel = engNum >= 3 ? '🔥 Excelente' : engNum >= 1.5 ? '✅ Bueno' : '⚠️ Mejorable'
  const engColor = engNum >= 3 ? '#22c55e' : engNum >= 1.5 ? '#faae33' : '#f87171'

  return (
    <div
      style={{
        background: '#111113',
        border: '1px solid #27272a',
        borderRadius: '12px',
        overflow: 'hidden',
        marginBottom: '1.5rem',
      }}
    >
      {/* Profile header */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(240, 148, 51, 0.1), rgba(188, 24, 136, 0.1))',
          borderBottom: '1px solid #27272a',
          padding: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
        }}
      >
        {igProfile.profile_picture_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={igProfile.profile_picture_url}
            alt={igProfile.username}
            style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover', border: '2px solid #e1306c' }}
          />
        ) : (
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: 'linear-gradient(45deg, #f09433, #bc1888)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              color: '#fff',
              fontWeight: 700,
            }}
          >
            {(igProfile.username ?? igProfile.name ?? '?').charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
            @{igProfile.username}
          </div>
          <div style={{ fontSize: '0.82rem', color: '#a1a1aa', marginTop: 2 }}>
            {igProfile.name}
            {igProfile.website && (
              <a
                href={igProfile.website}
                target="_blank"
                rel="noopener noreferrer"
                style={{ marginLeft: '0.75rem', color: '#faae33', textDecoration: 'none' }}
              >
                {igProfile.website}
              </a>
            )}
          </div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '1.5rem' }}>
          <Metric label="Seguidores" value={formatNum(followers)} />
          <Metric label="Siguiendo" value={formatNum(igProfile.follows_count)} />
          <Metric label="Publicaciones" value={formatNum(igProfile.media_count)} />
        </div>
      </div>

      {/* KPI grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '1px',
          background: '#27272a',
        }}
      >
        <KpiCard
          label="Engagement Rate"
          value={`${engagementRate}%`}
          tag={engLabel}
          tagColor={engColor}
        />
        <KpiCard
          label="Reels publicados"
          value={String(distribution.VIDEO)}
          tag={`${mediaCount > 0 ? Math.round((distribution.VIDEO / mediaCount) * 100) : 0}% del contenido`}
          tagColor="#a78bfa"
        />
        <KpiCard
          label="Carruseles"
          value={String(distribution.CAROUSEL_ALBUM)}
          tag={`${mediaCount > 0 ? Math.round((distribution.CAROUSEL_ALBUM / mediaCount) * 100) : 0}% del contenido`}
          tagColor="#60a5fa"
        />
        <KpiCard
          label="Frecuencia"
          value={postingFrequency ? `${postingFrequency}/sem` : '—'}
          tag={
            postingFrequency
              ? parseFloat(postingFrequency) >= 4
                ? '✅ Consistente'
                : '⚠️ Publicar más'
              : 'Sin datos'
          }
          tagColor={
            postingFrequency && parseFloat(postingFrequency) >= 4 ? '#22c55e' : '#f59e0b'
          }
        />
        <KpiCard
          label="Calidad de Bio"
          value={`${bioScore}/100`}
          tag={bioScore >= 70 ? '✅ Optimizada' : '⚠️ Mejorar bio'}
          tagColor={bioScore >= 70 ? '#22c55e' : '#f59e0b'}
        />
      </div>

      {/* Bio analyzer */}
      {igProfile.biography && (
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #1f1f23' }}>
          <div style={{ fontSize: '0.75rem', color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
            Tu biografía actual
          </div>
          <div
            style={{
              background: '#18181b',
              border: '1px solid #27272a',
              borderRadius: '8px',
              padding: '0.75rem 1rem',
              fontSize: '0.875rem',
              color: '#d4d4d8',
              whiteSpace: 'pre-line',
              lineHeight: 1.6,
            }}
          >
            {igProfile.biography}
          </div>
          {bioScore < 70 && (
            <div
              style={{
                marginTop: '0.75rem',
                background: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                borderRadius: '8px',
                padding: '0.75rem 1rem',
                fontSize: '0.82rem',
                color: '#fcd34d',
              }}
            >
              <strong>💡 Optimización sugerida:</strong> Tu bio puede mejorar. Ve a la pestaña <strong>"Optimizador de Bio"</strong> para que el agente te genere una versión de alto impacto basada en tu perfil real.
            </div>
          )}
        </div>
      )}

      {/* Top posts */}
      {topPosts.length > 0 && (
        <div style={{ padding: '1rem 1.25rem' }}>
          <div style={{ fontSize: '0.75rem', color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
            Tus 3 publicaciones con mayor engagement
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {topPosts.map((post, i) => (
              <a
                key={post.id}
                href={post.permalink}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  flex: '1 1 260px',
                  background: '#18181b',
                  border: '1px solid #27272a',
                  borderRadius: '8px',
                  padding: '0.75rem',
                  textDecoration: 'none',
                }}
              >
                <span
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '6px',
                    background: 'linear-gradient(45deg, #f09433, #bc1888)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    flexShrink: 0,
                  }}
                >
                  #{i + 1}
                </span>
                <div>
                  <div style={{ fontSize: '0.78rem', color: '#a1a1aa' }}>
                    {post.media_type === 'VIDEO' ? '🎬 Reel' : post.media_type === 'CAROUSEL_ALBUM' ? '📑 Carrusel' : '🖼 Imagen'}
                    {' · '}
                    {new Date(post.timestamp).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#d4d4d8', marginTop: 2 }}>
                    ❤️ {formatNum(post.like_count)} · 💬 {formatNum(post.comments_count)}
                  </div>
                  {post.caption && (
                    <div style={{ fontSize: '0.75rem', color: '#71717a', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>
                      {post.caption.slice(0, 60)}...
                    </div>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>{value}</div>
      <div style={{ fontSize: '0.72rem', color: '#71717a' }}>{label}</div>
    </div>
  )
}

function KpiCard({
  label,
  value,
  tag,
  tagColor,
}: {
  label: string
  value: string
  tag: string
  tagColor: string
}) {
  return (
    <div style={{ background: '#111113', padding: '1rem 1.25rem' }}>
      <div style={{ fontSize: '0.72rem', color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
        {label}
      </div>
      <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginBottom: '0.3rem' }}>
        {value}
      </div>
      <div style={{ fontSize: '0.72rem', color: tagColor, fontWeight: 600 }}>{tag}</div>
    </div>
  )
}

function formatNum(n: number): string {
  if (!n) return '0'
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return String(n)
}

