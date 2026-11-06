'use client'

import React from 'react'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#09090b',
        color: '#f4f4f5',
        fontFamily: 'var(--font-sans, system-ui, -apple-system, sans-serif)',
        overflowX: 'hidden',
      }}
    >
      {/* Top Navbar */}
      <header
        style={{
          borderBottom: '1px solid #18181b',
          backgroundColor: 'rgba(9, 9, 11, 0.85)',
          backdropFilter: 'blur(8px)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          style={{
            maxWidth: 1240,
            margin: '0 auto',
            padding: '0.85rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '6px',
                backgroundColor: '#faae33',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                  stroke="#090807"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
              NEXUS DROPSHIPPING OS
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link
              href="/login"
              style={{
                fontSize: '0.85rem',
                color: '#a1a1aa',
                textDecoration: 'none',
                fontWeight: 600,
                padding: '0.4rem 0.8rem',
              }}
            >
              Iniciar Sesión
            </Link>
            <Link
              href="/dashboard"
              style={{
                fontSize: '0.85rem',
                backgroundColor: '#faae33',
                color: '#090807',
                padding: '0.5rem 1.1rem',
                borderRadius: '6px',
                textDecoration: 'none',
                fontWeight: 700,
                transition: 'opacity 0.2s',
              }}
            >
              Entrar al Centro de Control &rarr;
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section (21st.dev / Linear standard) */}
      <section
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '4.5rem 1.5rem 3rem 1.5rem',
          textAlign: 'center',
        }}
      >
        {/* Live Status Pill */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '4px 12px',
            borderRadius: '999px',
            backgroundColor: 'rgba(250, 174, 51, 0.1)',
            border: '1px solid rgba(250, 174, 51, 0.25)',
            fontSize: '0.78rem',
            fontWeight: 700,
            color: '#faae33',
            marginBottom: '1.5rem',
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#faae33' }}></span>
          Sistema de 12 Agentes Especialistas • Meta Ads &amp; Contenido Orgánico
        </div>

        {/* Main Headline */}
        <h1
          style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.75rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            color: '#ffffff',
            margin: '0 auto 1.25rem auto',
            maxWidth: 900,
          }}
        >
          Lanza y escala tu tienda de Dropshipping con{' '}
          <span style={{ color: '#faae33' }}>Agentes IA Especializados</span>
        </h1>

        {/* Crisp Subtitle (0 filler, understands in 1 second) */}
        <p
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            color: '#a1a1aa',
            lineHeight: 1.6,
            maxWidth: 740,
            margin: '0 auto 2.25rem auto',
          }}
        >
          Investigación de productos ganadores con <strong>gráficas reales de tendencia</strong>, campañas de <strong>Meta Ads con reglas de Stop-Loss</strong>, estrategias para <strong>Instagram</strong> y prompts profesionales para generadores visuales.
        </p>

        {/* Action CTAs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.85rem', flexWrap: 'wrap', marginBottom: '3.5rem' }}>
          <Link
            href="/dashboard"
            style={{
              padding: '0.8rem 1.75rem',
              backgroundColor: '#faae33',
              color: '#090807',
              borderRadius: '8px',
              fontSize: '0.95rem',
              fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 10px 25px rgba(250, 174, 51, 0.25)',
            }}
          >
            Abrir Centro de Control &rarr;
          </Link>
          <Link
            href="/dashboard/facebook-ads"
            style={{
              padding: '0.8rem 1.5rem',
              backgroundColor: '#18181b',
              color: '#ffffff',
              borderRadius: '8px',
              fontSize: '0.95rem',
              fontWeight: 600,
              textDecoration: 'none',
              border: '1px solid #27272a',
            }}
          >
            Ver Módulo de Meta Ads
          </Link>
        </div>

        {/* Visual Proof / UI Sneak Peek Card */}
        <div
          style={{
            background: '#121214',
            border: '1px solid #1f1f23',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6)',
            textAlign: 'left',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #1f1f23', paddingBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#34d399' }}></span>
              <strong style={{ fontSize: '0.85rem', color: '#ffffff' }}>Pipeline en Vivo: Corrector Postural Ergonómico</strong>
              <span style={{ fontSize: '0.75rem', color: '#71717a' }}>• Nicho Salud &amp; Teletrabajo</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: '#faae33', fontWeight: 700 }}>
              Margen Neto: 58,4% • Multiplicador 4.1x
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div style={{ background: '#09090b', padding: '0.85rem', borderRadius: '6px', border: '1px solid #18181b' }}>
              <div style={{ fontSize: '0.7rem', color: '#71717a', textTransform: 'uppercase', fontWeight: 700 }}>1. Meta Ads (Tomás)</div>
              <div style={{ fontSize: '0.85rem', color: '#ffffff', fontWeight: 600, marginTop: '0.2rem' }}>ABO Testing: 20 € / día</div>
              <div style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>Stop-loss a 15 € sin ATC</div>
            </div>

            <div style={{ background: '#09090b', padding: '0.85rem', borderRadius: '6px', border: '1px solid #18181b' }}>
              <div style={{ fontSize: '0.7rem', color: '#71717a', textTransform: 'uppercase', fontWeight: 700 }}>2. Instagram (Nora)</div>
              <div style={{ fontSize: '0.85rem', color: '#ffffff', fontWeight: 600, marginTop: '0.2rem' }}>Reels 3s &amp; Carruseles</div>
              <div style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>Captions humanizadas sin IA slop</div>
            </div>

            <div style={{ background: '#09090b', padding: '0.85rem', borderRadius: '6px', border: '1px solid #18181b' }}>
              <div style={{ fontSize: '0.7rem', color: '#71717a', textTransform: 'uppercase', fontWeight: 700 }}>3. Shopify (Diego)</div>
              <div style={{ fontSize: '0.85rem', color: '#ffffff', fontWeight: 600, marginTop: '0.2rem' }}>Dawn Liquid Snippets</div>
              <div style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>Oferta Pack 2 uds (-20% AOV boost)</div>
            </div>

            <div style={{ background: '#09090b', padding: '0.85rem', borderRadius: '6px', border: '1px solid #18181b' }}>
              <div style={{ fontSize: '0.7rem', color: '#71717a', textTransform: 'uppercase', fontWeight: 700 }}>4. Finanzas (Eva CFO)</div>
              <div style={{ fontSize: '0.85rem', color: '#34d399', fontWeight: 700, marginTop: '0.2rem' }}>CPA Techo: 18,20 €</div>
              <div style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>Fórmulas matemáticas puras</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Pillars Section */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '3rem 1.5rem 5rem 1.5rem' }}>
        <h2 style={{ fontSize: '1.65rem', fontWeight: 800, textAlign: 'center', marginBottom: '2.5rem', color: '#ffffff' }}>
          Tres Canales Clave de Crecimiento
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {/* Card 1 */}
          <div
            style={{
              backgroundColor: '#121214',
              border: '1px solid #1f1f23',
              borderRadius: '10px',
              padding: '1.5rem',
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '8px',
                background: 'rgba(24, 119, 242, 0.15)',
                color: '#1877f2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff', margin: '0 0 0.5rem 0' }}>
              Meta Ads (Facebook &amp; Instagram)
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#a1a1aa', lineHeight: 1.6, margin: '0 0 1rem 0' }}>
              Campañas estructuradas de testing (ABO) y escalado (CBO). Reglas automáticas de stop-loss acopladas al CPA techo calculado por Eva CFO para no quemar presupuesto.
            </p>
            <Link href="/dashboard/facebook-ads" style={{ color: '#1877f2', fontSize: '0.825rem', fontWeight: 700, textDecoration: 'none' }}>
              Explorar Meta Ads &rarr;
            </Link>
          </div>

          {/* Card 2 */}
          <div
            style={{
              backgroundColor: '#121214',
              border: '1px solid #1f1f23',
              borderRadius: '10px',
              padding: '1.5rem',
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '8px',
                background: 'rgba(225, 48, 108, 0.15)',
                color: '#f472b6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              </svg>
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff', margin: '0 0 0.5rem 0' }}>
              Instagram Growth (instagram-skills)
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#a1a1aa', lineHeight: 1.6, margin: '0 0 1rem 0' }}>
              Ganchos visuales de 3 segundos para Reels, carruseles de alta retención diapositiva por diapositiva, optimizador de biografía y copys sin clichés de robot.
            </p>
            <Link href="/dashboard/instagram" style={{ color: '#f472b6', fontSize: '0.825rem', fontWeight: 700, textDecoration: 'none' }}>
              Explorar Instagram Growth &rarr;
            </Link>
          </div>

          {/* Card 3 */}
          <div
            style={{
              backgroundColor: '#121214',
              border: '1px solid #1f1f23',
              borderRadius: '10px',
              padding: '1.5rem',
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '8px',
                background: 'rgba(150, 191, 66, 0.15)',
                color: '#96bf42',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.337 3.095c-.033-.298-.28-.506-.575-.506l-4.22-.002c-.053 0-.104.015-.15.042l-1.65.987a.499.499 0 0 0-.236.435v.06l-.993 3.08-1.52.47c-.41.127-.63.568-.504.978l3.19 10.37c.097.316.386.536.716.536h9.11c.33 0 .62-.22.717-.536l3.19-10.37c.126-.41-.094-.851-.504-.978l-1.52-.47-.993-3.08v-.06a.5.5 0 0 0-.236-.435l-1.65-.987c-.046-.027-.097-.042-.15-.042l-2.02.001c.01-.01.02-.02.03-.03z" />
              </svg>
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff', margin: '0 0 0.5rem 0' }}>
              Shopify Studio &amp; Liquid Dawn
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#a1a1aa', lineHeight: 1.6, margin: '0 0 1rem 0' }}>
              Código Liquid puro para selectores de packs directo a checkout, tabla comparativa nosotros vs. otros y desglose unitario de costes y márgenes.
            </p>
            <Link href="/dashboard/shopify" style={{ color: '#96bf42', fontSize: '0.825rem', fontWeight: 700, textDecoration: 'none' }}>
              Explorar Shopify Studio &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #18181b', padding: '2rem 1.5rem', textAlign: 'center', fontSize: '0.78rem', color: '#71717a' }}>
        <div>Nexus Dropshipping OS • Sistema de Inteligencia para Comercio Electrónico</div>
        <div style={{ marginTop: '0.4rem' }}>Prompts de Ingeniería para Midjourney, FLUX, Kling, Runway, Higgsfield &amp; ElevenLabs.</div>
      </footer>
    </div>
  )
}
