import { z } from 'zod'

export const createProjectSchema = z.object({
  title: z.string().min(1, 'El título del proyecto es obligatorio').max(150),
  clientId: z.string().uuid('ID de cliente inválido').optional().nullable(),
  clientName: z.string().max(100).optional().nullable(),
  description: z.string().max(1000).optional().nullable(),
  status: z.enum(['planning', 'in_progress', 'review', 'completed', 'cancelled']).default('planning'),
  budget: z.union([z.number(), z.string()]).optional().default(0),
  currency: z.string().default('USD'),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'La fecha de inicio debe tener formato AAAA-MM-DD (ej. 2026-10-29)').optional().nullable(),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'La fecha de entrega debe tener formato AAAA-MM-DD (ej. 2026-11-15)').optional().nullable(),
})

export const updateProjectSchema = createProjectSchema.partial()

export const projectQuerySchema = z.object({
  page: z.string().default('1').transform((val) => Math.max(1, parseInt(val, 10) || 1)),
  pageSize: z.string().default('20').transform((val) => Math.min(100, Math.max(1, parseInt(val, 10) || 20))),
  status: z.enum(['planning', 'in_progress', 'review', 'completed', 'cancelled']).optional(),
  clientId: z.string().uuid().optional(),
  search: z.string().max(100).optional(),
})

export type CreateProjectInput = z.infer<typeof createProjectSchema>
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>
export type ProjectQueryInput = z.infer<typeof projectQuerySchema>
