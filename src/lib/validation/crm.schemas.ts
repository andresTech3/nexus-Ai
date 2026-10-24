import { z } from 'zod'

export const createClientSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio').max(100),
  companyName: z.string().max(100).optional().nullable(),
  email: z.string().email('Debe ser un correo electrónico válido').max(254),
  phone: z.string().max(30).optional().nullable(),
  status: z.enum(['lead', 'prospect', 'active', 'churned']).default('lead'),
  customFields: z.record(z.string(), z.any()).default({}),
})

export const updateClientSchema = createClientSchema.partial()

export const clientQuerySchema = z.object({
  page: z.string().default('1').transform((val) => Math.max(1, parseInt(val, 10) || 1)),
  pageSize: z.string().default('20').transform((val) => Math.min(100, Math.max(1, parseInt(val, 10) || 20))),
  status: z.enum(['lead', 'prospect', 'active', 'churned']).optional(),
  search: z.string().max(100).optional(),
})

export type CreateClientInput = z.infer<typeof createClientSchema>
export type UpdateClientInput = z.infer<typeof updateClientSchema>
export type ClientQueryInput = z.infer<typeof clientQuerySchema>
