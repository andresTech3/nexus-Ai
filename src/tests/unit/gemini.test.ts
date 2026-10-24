import { describe, it, expect } from 'vitest'
import { generateGeminiChatResponse } from '@/lib/ai/gemini'

describe('Gemini AI Adapter & Intelligent Fallback Engine (RF-06 & RF-07)', () => {
  it('handles price inquiries with structured agency catalog info', async () => {
    const res = await generateGeminiChatResponse({
      messages: [{ role: 'user', content: '¿Cuánto cuesta un chatbot para WhatsApp?' }],
    })

    expect(res).toHaveProperty('reply')
    expect(res.reply).toContain('Chatbot')
    expect(res.reply).toContain('USD')
    expect(res.tokensUsed.total).toBeGreaterThan(0)
    expect(res.isFallback).toBe(true) // En entorno de pruebas sin API key activa
  })

  it('handles CRM and project questions accurately', async () => {
    const res = await generateGeminiChatResponse({
      messages: [{ role: 'user', content: '¿Cómo puedo ver mis clientes y proyectos?' }],
    })

    expect(res.reply).toContain('CRM')
    expect(res.reply).toContain('Proyectos')
  })

  it('handles general inquiries gracefully without errors', async () => {
    const res = await generateGeminiChatResponse({
      messages: [{ role: 'user', content: 'Hola, buenas tardes.' }],
    })

    expect(res.reply.length).toBeGreaterThan(10)
    expect(res.model).toContain('gemini-2.0-flash')
  })
})
