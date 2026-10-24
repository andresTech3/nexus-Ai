'use server'

import { redirect } from 'next/navigation'
import { cookies, headers } from 'next/headers'
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
  | { success: false; error: string; field?: string; isConflict?: boolean; activeDevice?: string }

function parseUserAgent(ua: string | null): string {
  if (!ua) return 'Dispositivo desconocido'
  let os = 'Dispositivo'
  if (ua.includes('Windows')) os = 'Windows'
  else if (ua.includes('Macintosh') || ua.includes('Mac OS')) os = 'Mac'
  else if (ua.includes('Linux')) os = 'Linux'
  else if (ua.includes('Android')) os = 'Android'
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iPhone / iPad'

  let browser = 'Navegador'
  if (ua.includes('Chrome') && !ua.includes('Edg')) browser = 'Chrome'
  else if (ua.includes('Edg')) browser = 'Edge'
  else if (ua.includes('Firefox')) browser = 'Firefox'
  else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari'

  return `${browser} en ${os}`
}

/**
 * Iniciar sesión con email + contraseña.
 * Aplica control de sesión única por dispositivo.
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
  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  })

  if (error || !authData.user) {
    console.error('[loginAction Supabase Error]:', error?.message, 'Status:', error?.status)
    let message = error?.message || 'Error al iniciar sesión. Intenta de nuevo.'
    if (error?.message?.toLowerCase().includes('email not confirmed')) {
      message = 'Tu correo electrónico aún no ha sido confirmado en Supabase.'
    } else if (error?.status === 400) {
      message = 'Correo o contraseña incorrectos'
    }
    return { success: false, error: message }
  }

  // ─────────────────────────────────────────────────────────────
  // CONTROL DE SESIÓN ÚNICA POR DISPOSITIVO
  // ─────────────────────────────────────────────────────────────
  const headersList = await headers()
  const cookieStore = await cookies()
  const userAgent = headersList.get('user-agent')
  const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || '127.0.0.1'
  const forceLogin = formData.get('forceLogin') === 'true'

  // Recuperar o generar token único para este navegador
  let sessionToken = cookieStore.get('nexus_session_token')?.value
  if (!sessionToken) {
    sessionToken = crypto.randomUUID()
  }

  const { data: sessionCheck, error: rpcError } = await supabase.rpc('check_and_register_session', {
    p_user_id: authData.user.id,
    p_session_token: sessionToken,
    p_device_info: parseUserAgent(userAgent),
    p_ip: ip,
    p_force: forceLogin,
    p_inactivity_minutes: 30,
  })

  if (rpcError) {
    console.error('[check_and_register_session RPC Error]:', rpcError.message)
  }

  // Si ya hay una sesión activa en otro dispositivo y no se fuerza el cierre:
  if (sessionCheck && sessionCheck.allowed === false) {
    // Cerrar inmediatamente la sesión temporal creada para esta solicitud
    await supabase.auth.signOut()

    const deviceName = sessionCheck.active_device || 'otro dispositivo'
    return {
      success: false,
      error: `No es posible iniciar sesión: ya hay una sesión activa para esta cuenta en ${deviceName}. Por seguridad, solo se permite un dispositivo a la vez.`,
      isConflict: true,
      activeDevice: deviceName,
    }
  }

  // Sesión permitida: guardar el token de sesión en cookie segura
  cookieStore.set('nexus_session_token', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 días
    path: '/',
  })

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
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    await supabase.rpc('terminate_user_session', { p_user_id: user.id })
  }

  const cookieStore = await cookies()
  cookieStore.delete('nexus_session_token')

  await supabase.auth.signOut()
  redirect('/login')
}
