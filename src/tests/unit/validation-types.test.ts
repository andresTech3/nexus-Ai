import { describe, it, expect } from 'vitest'
import { createClientSchema } from '@/lib/validation/crm.schemas'
import { createProjectSchema } from '@/lib/validation/projects.schemas'
import { createQuoteSchema } from '@/lib/validation/quotes.schemas'
import type { ActionToastData, ISODate, ISOTimestamp } from '@/types'

describe('Strict Data Types & Input Validation', () => {
  describe('CRM Email-First Validation', () => {
    it('rejects client creation when email is missing or invalid', () => {
      const invalidNoEmail = createClientSchema.safeParse({
        name: 'Carlos Gómez',
        companyName: 'DentalPro',
      })
      expect(invalidNoEmail.success).toBe(false)
      if (!invalidNoEmail.success) {
        expect(invalidNoEmail.error.issues.some((i) => i.path.includes('email'))).toBe(true)
      }

      const invalidEmailFormat = createClientSchema.safeParse({
        name: 'Carlos Gómez',
        companyName: 'DentalPro',
        email: 'not-an-email',
      })
      expect(invalidEmailFormat.success).toBe(false)
      if (!invalidEmailFormat.success) {
        expect(invalidEmailFormat.error.issues[0].message).toContain('correo electrónico')
      }
    })

    it('accepts client creation when strict email and required fields are supplied', () => {
      const validClient = createClientSchema.safeParse({
        name: 'Carlos Gómez',
        companyName: 'DentalPro S.A.',
        email: 'carlos@dentalpro.com',
        phone: '+34 600 123 456',
        status: 'prospect',
      })
      expect(validClient.success).toBe(true)
    })
  })

  describe('Project Strict Date Validation (No text, strictly ISODate format)', () => {
    it('rejects project with plain text date instead of standard AAAA-MM-DD date', () => {
      const invalidDate = createProjectSchema.safeParse({
        title: 'Despliegue RAG',
        dueDate: 'fin de mes', // Texto no permitido
      })
      expect(invalidDate.success).toBe(false)
      if (!invalidDate.success) {
        expect(invalidDate.error.issues[0].message).toContain('AAAA-MM-DD')
      }

      const invalidDateSlash = createProjectSchema.safeParse({
        title: 'Despliegue RAG',
        dueDate: '29/10/2026', // Formato con barras no permitido
      })
      expect(invalidDateSlash.success).toBe(false)
    })

    it('accepts project with standard ISO date format (AAAA-MM-DD)', () => {
      const validDate: ISODate = '2026-11-15'
      const validProject = createProjectSchema.safeParse({
        title: 'Despliegue RAG',
        dueDate: validDate,
        startDate: '2026-10-29',
        budget: 3500,
      })
      expect(validProject.success).toBe(true)
    })
  })

  describe('Quote Strict Price and Currency Validation', () => {
    it('transforms string prices to numeric float safely', () => {
      const parsed = createQuoteSchema.safeParse({
        clientName: 'Roberto Martínez',
        serviceName: 'Chatbot Multicanal',
        price: '3,800.00',
        validDays: 15,
      })
      expect(parsed.success).toBe(true)
      if (parsed.success) {
        expect(typeof parsed.data.price).toBe('number')
      }
    })

    it('rejects quote with invalid validDays range', () => {
      const invalidDays = createQuoteSchema.safeParse({
        clientName: 'Roberto Martínez',
        serviceName: 'Chatbot Multicanal',
        price: 2000,
        validDays: 120, // Excede el máximo de 90 días
      })
      expect(invalidDays.success).toBe(false)
    })
  })

  describe('ActionToast Notification Contract', () => {
    it('matches required structure with title, problem, actionRequired, and type', () => {
      const toast: ActionToastData = {
        title: 'Correo Electrónico Obligatorio',
        problem: 'No has introducido el correo electrónico del cliente.',
        actionRequired: 'Introduce una dirección de correo válida antes de guardar el cliente.',
        type: 'error',
      }

      expect(toast.title).toBeDefined()
      expect(toast.problem).toContain('correo')
      expect(toast.actionRequired).toContain('Introduce')
      expect(toast.type).toBe('error')
    })
  })
})
