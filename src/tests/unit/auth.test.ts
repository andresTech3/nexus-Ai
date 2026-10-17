import { describe, it, expect } from 'vitest'
import { hasMinRole, generateRequestId, errorResponse } from '@/lib/auth/server'
import { loginSchema, registerSchema, updateProfileSchema } from '@/lib/validation/auth.schemas'
import type { AuthContext } from '@/types'

describe('RBAC & Role Hierarchy (RF-01)', () => {
  const adminCtx: AuthContext = {
    userId: 'user-admin-1',
    organizationId: 'org-1',
    role: 'admin',
    email: 'admin@nexus.test',
  }

  const employeeCtx: AuthContext = {
    userId: 'user-emp-1',
    organizationId: 'org-1',
    role: 'employee',
    email: 'emp@nexus.test',
  }

  const clientCtx: AuthContext = {
    userId: 'user-cli-1',
    organizationId: 'org-1',
    role: 'client',
    email: 'client@nexus.test',
  }

  it('admin should satisfy admin, employee, and client requirements', () => {
    expect(hasMinRole(adminCtx, 'admin')).toBe(true)
    expect(hasMinRole(adminCtx, 'employee')).toBe(true)
    expect(hasMinRole(adminCtx, 'client')).toBe(true)
  })

  it('employee should satisfy employee and client, but not admin', () => {
    expect(hasMinRole(employeeCtx, 'admin')).toBe(false)
    expect(hasMinRole(employeeCtx, 'employee')).toBe(true)
    expect(hasMinRole(employeeCtx, 'client')).toBe(true)
  })

  it('client should only satisfy client, not employee or admin', () => {
    expect(hasMinRole(clientCtx, 'admin')).toBe(false)
    expect(hasMinRole(clientCtx, 'employee')).toBe(false)
    expect(hasMinRole(clientCtx, 'client')).toBe(true)
  })
})

describe('Error Handling Uniformity & Security (RF-14)', () => {
  it('generateRequestId produces distinct identifiers with req_ prefix', () => {
    const id1 = generateRequestId()
    const id2 = generateRequestId()
    expect(id1).toMatch(/^req_\d+_[a-z0-9]+$/)
    expect(id2).toMatch(/^req_\d+_[a-z0-9]+$/)
    expect(id1).not.toBe(id2)
  })

  it('errorResponse formats response cleanly without leaking internal traces or SQL', async () => {
    const reqId = generateRequestId()
    const response = errorResponse('Acceso no autorizado', 401, reqId)
    const json = await response.json()

    expect(response.status).toBe(401)
    expect(json).toEqual({
      error: 'UNAUTHORIZED',
      message: 'Acceso no autorizado',
      requestId: reqId,
      statusCode: 401,
    })
    // Invariante de seguridad: jamás filtrar stack traces ni sentencias SQL
    expect(json).not.toHaveProperty('stack')
    expect(json).not.toHaveProperty('sql')
    expect(json).not.toHaveProperty('query')
  })
})

describe('Validation Schemas (Zod)', () => {
  it('validates correct login credentials', () => {
    const valid = loginSchema.safeParse({
      email: 'usuario@nexusai.com',
      password: 'Password123!',
    })
    expect(valid.success).toBe(true)
  })

  it('rejects invalid email formats in login', () => {
    const invalid = loginSchema.safeParse({
      email: 'not-an-email',
      password: 'Password123!',
    })
    expect(invalid.success).toBe(false)
  })

  it('rejects short passwords in login', () => {
    const invalid = loginSchema.safeParse({
      email: 'test@example.com',
      password: '123',
    })
    expect(invalid.success).toBe(false)
  })

  it('validates registration input requiring full name, strong password and terms acceptance', () => {
    const valid = registerSchema.safeParse({
      firstName: 'Carlos',
      lastName: 'Mendoza',
      company: 'Empresa Demo',
      email: 'carlos@agencia.com',
      password: 'SecurePass987!',
      terms: true,
    })
    expect(valid.success).toBe(true)
  })

  it('rejects registration if terms are not accepted', () => {
    const invalid = registerSchema.safeParse({
      firstName: 'Carlos',
      lastName: 'Mendoza',
      company: 'Empresa Demo',
      email: 'carlos@agencia.com',
      password: 'SecurePass987!',
      terms: false,
    })
    expect(invalid.success).toBe(false)
  })

  it('validates profile update input allowing optional avatar url', () => {
    const valid = updateProfileSchema.safeParse({
      firstName: 'Ana',
      lastName: 'Gómez',
      avatarUrl: 'https://example.com/avatar.png',
    })
    expect(valid.success).toBe(true)
  })
})
