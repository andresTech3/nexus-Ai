import { z } from 'zod'

/* ============================================================
   AUTH SCHEMAS — Validación con Zod
   ============================================================ */

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El correo es obligatorio')
    .email('Introduce un correo válido')
    .max(254, 'El correo es demasiado largo'),
  password: z
    .string()
    .min(1, 'La contraseña es obligatoria')
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(72, 'La contraseña es demasiado larga'),
})

export const registerSchema = z.object({
  firstName: z
    .string()
    .min(1, 'El nombre es obligatorio')
    .max(50, 'El nombre es demasiado largo')
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'El nombre contiene caracteres no válidos'),
  lastName: z
    .string()
    .min(1, 'El apellido es obligatorio')
    .max(50, 'El apellido es demasiado largo')
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'El apellido contiene caracteres no válidos'),
  company: z
    .string()
    .min(1, 'La empresa es obligatoria')
    .max(100, 'El nombre de empresa es demasiado largo'),
  email: z
    .string()
    .min(1, 'El correo es obligatorio')
    .email('Introduce un correo válido')
    .max(254, 'El correo es demasiado largo'),
  password: z
    .string()
    .min(1, 'La contraseña es obligatoria')
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(72, 'La contraseña es demasiado larga')
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número'),
  terms: z.literal(true, {
    message: 'Debes aceptar los términos de servicio',
  }),
})

export const updateProfileSchema = z.object({
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  company: z.string().min(1).max(100).optional(),
  avatarUrl: z.string().url().optional().nullable(),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
