import { z } from 'zod'

export const createQuoteSchema = z.object({
  clientId: z.string().uuid().optional().nullable(),
  clientName: z.string().min(1, 'El nombre del cliente es obligatorio').max(100),
  serviceName: z.string().min(1, 'El servicio es obligatorio').max(150),
  price: z.union([z.number(), z.string()]).transform((val) => {
    if (typeof val === 'number') return val
    return parseFloat(String(val).replace(/[^0-9.]/g, '')) || 0
  }),
  currency: z.string().default('USD'),
  validDays: z.number().int().min(1).max(90).default(15),
  status: z.enum(['draft', 'sent', 'accepted', 'rejected', 'expired']).default('sent'),
  notes: z.string().max(500).optional().nullable(),
})

export const updateQuoteStatusSchema = z.object({
  status: z.enum(['draft', 'sent', 'accepted', 'rejected', 'expired']),
})

export const quoteQuerySchema = z.object({
  page: z.string().default('1').transform((val) => Math.max(1, parseInt(val, 10) || 1)),
  pageSize: z.string().default('20').transform((val) => Math.min(100, Math.max(1, parseInt(val, 10) || 20))),
  status: z.enum(['draft', 'sent', 'accepted', 'rejected', 'expired']).optional(),
  search: z.string().max(100).optional(),
})

export type CreateQuoteInput = z.infer<typeof createQuoteSchema>
export type UpdateQuoteStatusInput = z.infer<typeof updateQuoteStatusSchema>
export type QuoteQueryInput = z.infer<typeof quoteQuerySchema>
