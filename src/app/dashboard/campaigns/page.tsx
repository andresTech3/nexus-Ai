'use client'

import { useState } from 'react'

interface Campaign {
  id: string
  title: string
  client: string
  channel: 'LinkedIn' | 'Meta Ads' | 'Email Marketing' | 'X (Twitter)'
  status: 'draft' | 'pending_approval' | 'approved' | 'published'
  contentSnippet: string
  scheduledFor: string
}

const INITIAL_CAMPAIGNS: Campaign[] = []

const channelBadges = {
  LinkedIn: { bg: 'rgba(10, 102, 194, 0.2)', text: '#60a5fa', border: 'rgba(10, 102, 194, 0.4)' },
  'Meta Ads': { bg: 'rgba(147, 51, 234, 0.2)', text: '#c084fc', border: 'rgba(147, 51, 234, 0.4)' },
  'Email Marketing': { bg: 'rgba(234, 179, 8, 0.2)', text: '#fde047', border: 'rgba(234, 179, 8, 0.4)' },
  'X (Twitter)': { bg: 'rgba(255, 255, 255, 0.1)', text: '#ffffff', border: 'rgba(255, 255, 255, 0.2)' },
}

const statusMap = {
  draft: { label: 'Borrador', color: 'rgba(255,255,255,0.4)' },
  pending_approval: { label: 'Revisión Cliente', color: '#f59e0b' },
  approved: { label: 'Aprobado', color: '#38bdf8' },
  published: { label: 'Publicado', color: '#4ade80' },
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS)
  const [promptTopic, setPromptTopic] = useState<string>('')
  const [generating, setGenerating] = useState<boolean>(false)
  const [generatedResult, setGeneratedResult] = useState<string | null>(null)

  const handleGenerateCopy = () => {
    if (!promptTopic.trim()) return
    setGenerating(true)
    setTimeout(() => {
      setGeneratedResult(
        `[Copy Publicitario]\n\nTema: ${promptTopic}\n\nEn un entorno empresarial cada vez más exigente, delegar tareas repetitivas en sistemas autónomos marca la diferencia entre estancarse o escalar.\n\nEn NexusAI diseñamos soluciones personalizadas que integran tus datos de forma 100% segura.\n\nComenta "AGENTE" para enviarte una auditoría gratuita.\n\n#InteligenciaArtificial #Automatizacion #Productividad #Tech2026`
      )
      setGenerating(false)
    }, 1000)
  }

  const approveCampaign = (id: string) => {
    setCampaigns(
      campaigns.map((c) =>
        c.id === id ? { ...c, status: c.status === 'pending_approval' ? 'approved' : 'published' } : c
      )
    )
  }

  return (
    <div id="campaigns-page">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, color: 'white', marginBottom: '0.375rem' }}>
            Campañas & Contenido Marketing
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)' }}>
            Generación asistida por IA, flujo de aprobación de clientes y programación multicanal.
          </p>
        </div>
      </div>

      {/* AI Content Generator Box */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.08), rgba(255, 255, 255, 0.02))',
          border: '1px solid rgba(147, 51, 234, 0.25)',
          borderRadius: '1rem',
          padding: '1.5rem',
          marginBottom: '2rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'white' }}>
            Generador de Copys Publicitarios
          </h2>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '1rem' }}>
          Introduce el tema de la campaña o servicio para redactar un post optimizado con tono profesional:
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Ej. Automatización de atención al cliente para concesionarios de coches"
            value={promptTopic}
            onChange={(e) => setPromptTopic(e.target.value)}
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '0.5rem',
              padding: '0.65rem 1rem',
              color: 'white',
              fontSize: '0.9rem',
              outline: 'none',
            }}
          />
          <button
            onClick={handleGenerateCopy}
            disabled={generating || !promptTopic.trim()}
            className="btn btn-primary"
            style={{ padding: '0.65rem 1.25rem' }}
          >
            {generating ? 'Generando...' : 'Generar Copy'}
          </button>
        </div>

        {generatedResult && (
          <div
            style={{
              background: 'rgba(0,0,0,0.4)',
              border: '1px solid rgba(147, 51, 234, 0.3)',
              borderRadius: '0.75rem',
              padding: '1.25rem',
              marginTop: '1rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#c084fc', fontWeight: 600 }}>Propuesta Lista para Publicar</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generatedResult)
                  alert('¡Texto copiado al portapapeles!')
                }}
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', cursor: 'pointer' }}
              >
                Copiar
              </button>
            </div>
            <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: '0.875rem', color: 'rgba(255,255,255,0.9)', lineHeight: 1.6 }}>
              {generatedResult}
            </pre>
          </div>
        )}
      </div>

      {/* Campaigns List */}
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', marginBottom: '1rem' }}>
        Campañas Programadas & Estados
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
        {campaigns.length === 0 ? (
          <div
            style={{
              gridColumn: '1 / -1',
              padding: '3.5rem 2rem',
              textAlign: 'center',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px dashed rgba(147, 51, 234, 0.25)',
              borderRadius: '1rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ width: 44, height: 44, margin: '0 auto 1rem auto', borderRadius: '8px', backgroundColor: '#18181b', border: '1px solid #27272a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#faae33' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f3f4f6', marginBottom: '0.5rem' }}>
              No tienes campañas programadas todavía
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', maxWidth: '420px', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              Usa el generador con Gemini 2.0 arriba para redactar copies persuasivos y programar campañas en LinkedIn, Meta o Email.
            </p>
          </div>
        ) : (
          campaigns.map((camp) => {
            const chBadge = channelBadges[camp.channel]
            const stBadge = statusMap[camp.status]
          return (
            <div
              key={camp.id}
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(147, 51, 234, 0.15)',
                borderRadius: '1rem',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '0.2rem 0.55rem',
                    borderRadius: '0.35rem',
                    background: chBadge.bg,
                    color: chBadge.text,
                    border: `1px solid ${chBadge.border}`,
                  }}
                >
                  {camp.channel}
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: stBadge.color }}>
                  ● {stBadge.label}
                </span>
              </div>

              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'white', marginBottom: '0.25rem' }}>
                {camp.title}
              </h4>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-purple-400)', marginBottom: '0.75rem' }}>
                {camp.client}
              </div>

              <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5, marginBottom: '1.25rem', flex: 1 }}>
                "{camp.contentSnippet}"
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
                  Programado: {camp.scheduledFor}
                </span>
                {camp.status !== 'published' && (
                  <button
                    onClick={() => approveCampaign(camp.id)}
                    style={{
                      background: 'rgba(147, 51, 234, 0.2)',
                      border: '1px solid rgba(147, 51, 234, 0.4)',
                      borderRadius: '0.35rem',
                      padding: '0.3rem 0.65rem',
                      color: 'white',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      fontWeight: 600,
                    }}
                  >
                    {camp.status === 'pending_approval' ? 'Aprobar Contenido' : 'Publicar Ahora'}
                  </button>
                )}
              </div>
            </div>
          )
        }))}
      </div>
    </div>
  )
}
