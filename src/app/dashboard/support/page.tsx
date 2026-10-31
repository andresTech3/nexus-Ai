'use client'

export default function SupportPage() {
  return (
    <div id="support-page" style={{ maxWidth: 900 }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, color: 'white', marginBottom: '0.375rem' }}>
          Centro de Ayuda, Soporte & Documentación
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)' }}>
          Recursos de desarrollo, contratos de API REST, arquitectura y resolución de dudas comunes.
        </p>
      </div>

      {/* Quick Access Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '1rem',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ width: 36, height: 36, borderRadius: '0.5rem', background: 'rgba(250, 174, 51, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem', color: '#faae33' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', marginBottom: '0.25rem' }}>
            Guía de Inicio Rápido
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5, flex: 1 }}>
            Aprende a configurar tu primer cliente, crear agentes autónomos y conectar automatizaciones paso a paso.
          </p>
          <div style={{ color: '#faae33', fontSize: '0.8rem', fontWeight: 600, marginTop: '1rem' }}>
            Tutoriales para Agencia AI
          </div>
        </div>

        <div
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '1rem',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ width: 36, height: 36, borderRadius: '0.5rem', background: 'rgba(56, 189, 248, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem', color: '#38bdf8' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', marginBottom: '0.25rem' }}>
            Especificación REST OpenAPI
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5, flex: 1 }}>
            Consulta la documentación técnica completa del proyecto ubicada en <code>docs/api/REST_API_SPEC.md</code>.
          </p>
          <div style={{ color: '#38bdf8', fontSize: '0.8rem', fontWeight: 600, marginTop: '1rem' }}>
            19 tablas y 12 módulos documentados
          </div>
        </div>

        <div
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '1rem',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ width: 36, height: 36, borderRadius: '0.5rem', background: 'rgba(74, 222, 128, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem', color: '#4ade80' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', marginBottom: '0.25rem' }}>
            Aislamiento Multi-Tenant
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5, flex: 1 }}>
            Garantía de aislamiento estricto por <code>organization_id</code> y Row Level Security (RLS) en todas las consultas.
          </p>
          <div style={{ color: '#4ade80', fontSize: '0.8rem', fontWeight: 600, marginTop: '1rem' }}>
            Zero-Leak Invariant Activo
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '1rem',
          padding: '2rem',
        }}
      >
        <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'white', marginBottom: '1.25rem' }}>
          Preguntas Frecuentes (FAQ)
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'white', marginBottom: '0.25rem' }}>
              ¿Cómo funciona el límite de llamadas gratuitas a Gemini?
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>
              El sistema utiliza el modelo <code>gemini-2.0-flash</code> bajo el Free Tier de Google AI Studio, que permite hasta 15 solicitudes por minuto sin costo. El adaptador de API reserva cuota localmente para garantizar que nunca se generen cargos inesperados.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'white', marginBottom: '0.25rem' }}>
              ¿Dónde se almacenan los datos de mis clientes y proyectos?
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>
              Todos los datos están en la base de datos PostgreSQL de Supabase en el proyecto <code>sleisgocuwawjguoxkxy</code>. Cada registro está protegido por políticas de RLS vinculadas a la membresía de tu organización.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'white', marginBottom: '0.25rem' }}>
              ¿Cómo agregar a un miembro de mi equipo con rol de Empleado o Cliente?
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>
              En la sección de <strong>Configuración</strong>, puedes invitar miembros asignando su rol correspondiente. Los administradores tienen acceso global, los empleados pueden gestionar tareas y CRM, y los clientes solo ven sus propios proyectos y cotizaciones.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
