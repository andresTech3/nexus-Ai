import { describe, it, expect, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { createApiHandler } from '@/lib/api/handler'
import { createClientSchema, clientQuerySchema } from '@/lib/validation/crm.schemas'
import * as authServer from '@/lib/auth/server'

describe('REST API Security & Middleware Engine (createApiHandler)', () => {
  it('blocks unauthenticated requests with 401 and requestId', async () => {
    // Simular usuario no autenticado
    vi.spyOn(authServer, 'getAuthContext').mockResolvedValueOnce(null)

    const handler = createApiHandler(
      { requireAuth: true },
      async () => Response.json({ success: true })
    )

    const req = new NextRequest('http://localhost:3000/api/v1/crm/clients')
    const response = await handler(req)
    const json = await response.json()

    expect(response.status).toBe(401)
    expect(json.error).toBe('UNAUTHORIZED')
    expect(json).toHaveProperty('requestId')
    expect(response.headers.get('X-Request-ID')).toBe(json.requestId)
    expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff')
  })

  it('blocks client role with 403 when employee role is required', async () => {
    // Simular usuario con rol 'client'
    vi.spyOn(authServer, 'getAuthContext').mockResolvedValueOnce({
      userId: 'user-client-123',
      organizationId: 'org-abc',
      role: 'client',
      email: 'cliente@empresa.com',
    })

    const handler = createApiHandler(
      { requireAuth: true, minRole: 'employee' },
      async () => Response.json({ success: true })
    )

    const req = new NextRequest('http://localhost:3000/api/v1/crm/clients')
    const response = await handler(req)
    const json = await response.json()

    expect(response.status).toBe(403)
    expect(json.error).toBe('FORBIDDEN')
    expect(json.message).toContain('employee')
  })

  it('validates request body with Zod and returns 422 on schema violation', async () => {
    // Simular empleado autenticado
    vi.spyOn(authServer, 'getAuthContext').mockResolvedValueOnce({
      userId: 'user-emp-123',
      organizationId: 'org-abc',
      role: 'employee',
      email: 'dev@nexus.ai',
    })

    const handler = createApiHandler(
      {
        requireAuth: true,
        minRole: 'employee',
        bodySchema: createClientSchema,
      },
      async ({ body }) => Response.json({ data: body })
    )

    // Body sin email y sin nombre
    const req = new NextRequest('http://localhost:3000/api/v1/crm/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ companyName: 'Incompleta Corp' }),
    })

    const response = await handler(req)
    const json = await response.json()

    expect(response.status).toBe(422)
    expect(json.error).toBe('UNPROCESSABLE_ENTITY')
    expect(json.message).toContain('name')
  })

  it('validates query params and converts pagination strings to numbers', () => {
    const valid = clientQuerySchema.safeParse({
      page: '3',
      pageSize: '50',
      status: 'active',
      search: 'Acme',
    })

    expect(valid.success).toBe(true)
    if (valid.success) {
      expect(valid.data.page).toBe(3)
      expect(valid.data.pageSize).toBe(50)
      expect(valid.data.status).toBe('active')
      expect(valid.data.search).toBe('Acme')
    }
  })

  it('clamps pagination limits to prevent memory exhaustion DoS', () => {
    // Si envían pageSize exagerado (ej. 9999), se limita al máximo seguro (100)
    const clamped = clientQuerySchema.safeParse({
      pageSize: '999999',
    })

    expect(clamped.success).toBe(true)
    if (clamped.success) {
      expect(clamped.data.pageSize).toBe(100)
    }
  })
})
