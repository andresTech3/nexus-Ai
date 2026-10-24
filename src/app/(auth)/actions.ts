'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { loginSchema, registerSchema } from '@/lib/validation/auth.schemas'

/* ============================================================
   SERVER ACTIONS — Auth
   ============================================================
   Las Server Actions son ejecutadas exclusivamente en servidor.
   NUNCA exponen las credenciales de Supabase al cliente.
   Los errores se devuelven como objetos; nunca como excepciones
   visibles al usuario final.
   ============================================================ */

export type ActionResult =
  | { success: true; redirectTo?: string }
  | { success: false; error: string; field?: string }

/**
 * Iniciar sesión con email + contraseña.
 */
export async function loginAction(
  prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const raw = {
    email: formData.get('email'),
    password: formData.get('password'),
  }

  const parsed = loginSchema.safeParse(raw)
  if (!parsed.success) {
    const first = parsed.error.issues[0]
    return { success: false, error: first.message, field: first.path[0] as string }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  })

  if (error) {
    console.error('[loginAction Supabase Error]:', error.message, 'Status:', error.status)
    const message =
      error.status === 400
        ? 'Correo o contraseña incorrectos'
        : (error.message || 'Error al iniciar sesión. Intenta de nuevo.')
    return { success: false, error: message }
  }

  redirect('/dashboard')
}

/**
 * Registrar nueva cuenta.
 * El rol nunca se asigna aquí — se asigna mediante trigger de DB.
 */
export async function registerAction(
  prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const raw = {
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    company: formData.get('company'),
    email: formData.get('email'),
    password: formData.get('password'),
    terms: formData.get('terms') === 'on' ? true : undefined,
  }

  const parsed = registerSchema.safeParse(raw)
  if (!parsed.success) {
    const first = parsed.error.issues[0]
    return { success: false, error: first.message, field: first.path[0] as string }
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      // Datos de perfil inicial — NO contienen roles ni permisos
      data: {
        first_name: parsed.data.firstName,
        last_name: parsed.data.lastName,
        company: parsed.data.company,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/auth/callback`,
    },
  })

  if (error) {
    console.error('[registerAction Supabase Error]:', error.message, 'Status:', error.status)
    if (error.status === 422) {
      return { success: false, error: 'Este correo ya está registrado', field: 'email' }
    }
    return { success: false, error: error.message || 'Error al crear la cuenta. Intenta de nuevo.' }
  }

  if (data?.session) {
    redirect('/dashboard')
  }

  // Redirigir a confirmación de email si el proyecto requiere verificación
  redirect('/register/verify-email')
}

/**
 * Iniciar sesión con proveedor OAuth (Google, GitHub).
 * Solo genera la URL de autorización — la sesión se crea en el callback.
 */
export async function oauthAction(
  provider: 'google' | 'github'
): Promise<ActionResult & { url?: string }> {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/auth/callback`,
    },
  })

  if (error || !data.url) {
    return { success: false, error: `Error al conectar con ${provider}` }
  }

  return { success: true, url: data.url }
}

/**
 * Cerrar sesión del usuario actual.
 */
export async function signOutAction(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
