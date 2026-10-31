'use client'

import React, { useState } from 'react'
import { useOfficeStore } from '@/lib/office/store'

export function ConnectionsManager() {
  const store = useOfficeStore()
  const quotas = store.quotas

  const [testingProvider, setTestingProvider] = useState<string | null>(null)
  const [testResult, setTestResult] = useState<{ provider: string; success: boolean; message: string } | null>(null)

  const providers = [
    {
      id: 'freellmapi',
      name: 'FreeLLMAPI (Router Unificado)',
      badge: 'CONEXIÓN INTERNA INCLUIDA',
      description: 'Conector inteligente interno incluido en el servidor. Las personas pueden subir su propia API Key opcionalmente aquí, o dejarlo vacío para usar la pasarela predeterminada.',
      endpoint: quotas.freellmapi?.hostUrl || 'http://127.0.0.1:31415/v1',
      defaultModel: quotas.freellmapi?.modelName || 'gpt-4o-mini',
      models: [
        { id: 'gpt-4o-mini', name: 'GPT-4o Mini (Rápido y Preciso)' },
        { id: 'deepseek-v4-flash', name: 'DeepSeek V4 Flash (Razonamiento)' },
        { id: 'claude-sonnet-4-5', name: 'Claude Sonnet 4.5' },
        { id: 'gemini-3.7-flash', name: 'Gemini 3.7 Flash' },
        { id: 'qwen3.8-flash', name: 'Qwen 3.8 Flash' },
      ],
      placeholderKey: 'Opcional: ingresa tu propia clave o déjalo vacío',
      isConfigured: true,
    },
    {
      id: 'openai',
      name: 'OpenAI (ChatGPT)',
      badge: 'OFICIAL OPENAI',
      description: 'Conecta directamente tu cuenta de OpenAI para usar GPT-4o o GPT-4o-mini.',
      defaultModel: quotas.openai?.modelName || 'gpt-4o-mini',
      models: [
        { id: 'gpt-4o-mini', name: 'GPT-4o Mini (Económico & Rápido)' },
        { id: 'gpt-4o', name: 'GPT-4o (Máxima Capacidad)' },
        { id: 'o3-mini', name: 'o3-mini (Razonamiento Lógico)' },
      ],
      placeholderKey: 'sk-proj-...',
      isConfigured: Boolean(quotas.openai?.apiKey),
    },
    {
      id: 'claude',
      name: 'Anthropic Claude',
      badge: 'CLAUDE 3.7 / 3.5',
      description: 'Conecta tu clave de Anthropic Console para redacción de copy y análisis de alto nivel.',
      defaultModel: quotas.claude?.modelName || 'claude-3-7-sonnet-20250219',
      models: [
        { id: 'claude-3-7-sonnet-20250219', name: 'Claude 3.7 Sonnet (Líder en Copy & Estrategia)' },
        { id: 'claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku (Ultra Veloz)' },
      ],
      placeholderKey: 'sk-ant-api03-...',
      isConfigured: Boolean(quotas.claude?.apiKey),
    },
    {
      id: 'deepseek',
      name: 'DeepSeek AI',
      badge: 'ALTA EFICIENCIA',
      description: 'Conecta tu API key de DeepSeek para razonamiento financiero y cálculo de márgenes.',
      defaultModel: quotas.deepseek?.modelName || 'deepseek-chat',
      models: [
        { id: 'deepseek-chat', name: 'DeepSeek Chat (V3)' },
        { id: 'deepseek-reasoner', name: 'DeepSeek Reasoner (R1)' },
      ],
      placeholderKey: 'sk-...',
      isConfigured: Boolean(quotas.deepseek?.apiKey),
    },
    {
      id: 'opensource',
      name: 'IA Código Abierto (Groq / Ollama / OpenRouter)',
      badge: '100% GRATIS / LOCAL',
      description: 'Ejecuta modelos Open Source mediante Ollama en tu PC (http://localhost:11434) o API gratuita de Groq.',
      defaultModel: quotas.opensource?.modelName || 'qwen2.5:7b',
      models: [
        { id: 'qwen2.5:7b', name: 'Qwen 2.5 7B (Ollama Local)' },
        { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B (Groq Cloud)' },
        { id: 'meta-llama/llama-3.2-3b-instruct:free', name: 'Llama 3.2 3B Free (OpenRouter)' },
      ],
      placeholderKey: 'http://localhost:11434 o gsk_...',
      isConfigured: Boolean(quotas.opensource?.apiKey),
    },
  ]

  const handleTest = async (providerId: string) => {
    setTestingProvider(providerId)
    setTestResult(null)

    const q = quotas[providerId]
    try {
      const res = await fetch('/api/v1/office/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: providerId,
          apiKey: q?.apiKey,
          hostUrl: q?.hostUrl,
          modelName: q?.modelName,
          systemPrompt: 'Responde brevemente confirmando conexion.',
          userPrompt: 'Di "CONEXION_EXITOSA" y tu modelo.',
        }),
      })

      if (res.ok) {
        const data = await res.json()
        setTestResult({
          provider: providerId,
          success: true,
          message: `✓ Conexión exitosa con ${providerId.toUpperCase()}. Respuesta del modelo: "${data.reply || 'OK'}" (${data.model})`,
        })
      } else {
        const err = await res.json()
        setTestResult({
          provider: providerId,
          success: false,
          message: `✕ Error al conectar con ${providerId}: ${err.error || 'Revisa tu API Key o endpoint'}`,
        })
      }
    } catch (e: any) {
      setTestResult({
        provider: providerId,
        success: false,
        message: `✕ Error de red: ${e.message}`,
      })
    } finally {
      setTestingProvider(null)
    }
  }

  const handleResetCleanProject = () => {
    if (confirm('¿Estás seguro de que deseas limpiar el proyecto? Se borrarán los datos previos y quedará completamente vacío y listo para trabajar desde cero.')) {
      localStorage.removeItem('nexus-autonomous-office-v5-clean')
      localStorage.removeItem('nexus-autonomous-office-v3-clean')
      localStorage.removeItem('nexus-autonomous-office-v2')
      window.location.reload()
    }
  }

  return (
    <div
      style={{
        backgroundColor: '#16110e',
        border: '1px solid #3d2a1d',
        borderRadius: '12px',
        padding: '1.5rem',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid #332418', paddingBottom: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span style={{ backgroundColor: 'rgba(250, 174, 51, 0.15)', color: '#faae33', fontSize: '0.72rem', fontWeight: 800, padding: '2px 8px', borderRadius: '4px' }}>
              CONFIGURACIÓN DE CONECTORES
            </span>
            <span style={{ fontSize: '0.72rem', color: '#9ca3af' }}>
              Gestión Simplificada de Modelos y API Keys
            </span>
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#fff', margin: 0 }}>
            Conectores de Inteligencia Artificial para tu Negocio
          </h2>
          <p style={{ fontSize: '0.8rem', color: '#9ca3af', margin: '4px 0 0 0' }}>
            Conecta tus API Keys de Claude, ChatGPT, DeepSeek, FreeLLMAPI o modelos locales. Las claves se guardan únicamente de forma privada en tu navegador.
          </p>
        </div>

        {/* Clean Project Action */}
        <button
          onClick={handleResetCleanProject}
          style={{
            background: '#201612',
            border: '1px solid #f87171',
            color: '#f87171',
            borderRadius: '6px',
            padding: '0.5rem 0.9rem',
            fontSize: '0.78rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
          title="Elimina datos previos y deja el proyecto 100% limpio"
        >
          <span>🗑️</span>
          <span>Dejar Proyecto Vacío / Reiniciar</span>
        </button>
      </div>

      {/* Global Feedback Banner */}
      {testResult && (
        <div
          style={{
            backgroundColor: testResult.success ? 'rgba(52, 211, 153, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            border: `1px solid ${testResult.success ? '#34d399' : '#ef4444'}`,
            borderRadius: '8px',
            padding: '0.85rem 1rem',
            marginBottom: '1.25rem',
            fontSize: '0.82rem',
            color: testResult.success ? '#34d399' : '#f87171',
            fontWeight: 700,
          }}
        >
          {testResult.message}
        </div>
      )}

      {/* Connectors Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.25rem' }}>
        {providers.map((p) => {
          const quota = quotas[p.id] || {}
          const isTesting = testingProvider === p.id

          return (
            <div
              key={p.id}
              style={{
                backgroundColor: '#1b1410',
                border: `1px solid ${p.id === 'freellmapi' ? '#faae33' : '#3d2a1d'}`,
                borderRadius: '10px',
                padding: '1.15rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                {/* Provider Title & Status */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                      {p.name}
                    </h3>
                    <span style={{ fontSize: '0.65rem', color: '#faae33', fontWeight: 800 }}>
                      {p.badge}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: (p.id === 'freellmapi' || p.isConfigured) ? '#34d399' : '#6b7280',
                      background: (p.id === 'freellmapi' || p.isConfigured) ? 'rgba(52, 211, 153, 0.1)' : 'rgba(107, 114, 128, 0.1)',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: (p.id === 'freellmapi' || p.isConfigured) ? '#34d399' : '#6b7280' }} />
                    {p.id === 'freellmapi'
                      ? (quota.apiKey ? 'Clave Propia Activa' : 'Servidor Interno Activo')
                      : (p.isConfigured ? 'Configurado' : 'Sin Clave')}
                  </span>
                </div>

                <p style={{ fontSize: '0.74rem', color: '#9ca3af', margin: '0 0 1rem 0', lineHeight: 1.4 }}>
                  {p.description}
                </p>

                {/* API Key Input */}
                <div style={{ marginBottom: '0.85rem' }}>
                  <label style={{ display: 'block', fontSize: '0.72rem', color: '#d1d5db', fontWeight: 700, marginBottom: '0.25rem' }}>
                    API Key / Token:
                  </label>
                  <input
                    type="password"
                    value={quota.apiKey || ''}
                    placeholder={p.placeholderKey}
                    onChange={(e) => store.setProviderApiKey(p.id, e.target.value)}
                    style={{
                      width: '100%',
                      backgroundColor: '#120d09',
                      border: '1px solid #4a3424',
                      borderRadius: '6px',
                      padding: '0.45rem 0.65rem',
                      fontSize: '0.78rem',
                      color: '#fff',
                      fontFamily: 'monospace',
                    }}
                  />
                </div>

                {/* Model Selector */}
                <div style={{ marginBottom: '0.85rem' }}>
                  <label style={{ display: 'block', fontSize: '0.72rem', color: '#d1d5db', fontWeight: 700, marginBottom: '0.25rem' }}>
                    Modelo Activo:
                  </label>
                  <select
                    value={quota.modelName || p.defaultModel}
                    onChange={(e) => store.setProviderModel(p.id, e.target.value)}
                    style={{
                      width: '100%',
                      backgroundColor: '#120d09',
                      border: '1px solid #4a3424',
                      borderRadius: '6px',
                      padding: '0.45rem 0.65rem',
                      fontSize: '0.78rem',
                      color: '#faae33',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {p.models.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Action: Test Connection */}
              <div style={{ borderTop: '1px solid #332418', paddingTop: '0.85rem', marginTop: '0.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => handleTest(p.id)}
                  disabled={isTesting || (!quota.apiKey && p.id !== 'freellmapi')}
                  style={{
                    background: p.id === 'freellmapi' ? 'linear-gradient(135deg, #faae33, #d98216)' : '#261b14',
                    border: p.id === 'freellmapi' ? 'none' : '1px solid #4a3424',
                    color: p.id === 'freellmapi' ? '#181008' : '#faae33',
                    borderRadius: '6px',
                    padding: '0.45rem 0.9rem',
                    fontSize: '0.76rem',
                    fontWeight: 800,
                    cursor: isTesting ? 'wait' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    opacity: !quota.apiKey && p.id !== 'freellmapi' ? 0.5 : 1,
                  }}
                >
                  <span>{isTesting ? '⏳' : '⚡'}</span>
                  <span>{isTesting ? 'Probando...' : 'Probar Conexión'}</span>
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
