import { NextResponse } from 'next/server'
import { META_APP_ID, META_APP_SECRET, getAppUrl, getMetaCallbackUri } from '@/lib/meta/oauth'

/**
 * GET /api/v1/meta/test-credentials
 * Endpoint de diagnóstico para verificar en tiempo real si Vercel tiene las credenciales de Meta y si Meta las acepta.
 */
export async function GET(request: Request) {
  const appUrl = getAppUrl(request)
  const callbackUri = getMetaCallbackUri(appUrl)

  const idPresent = Boolean(META_APP_ID && META_APP_ID.trim().length > 0)
  const secretPresent = Boolean(META_APP_SECRET && META_APP_SECRET.trim().length > 0)

  if (!idPresent || !secretPresent) {
    return NextResponse.json({
      ok: false,
      status: 'MISSING_ENV_VARS',
      titulo: '⚠️ Variables de Entorno Incompletas en Vercel',
      mensaje: 'Tu servidor en Vercel aún no tiene la clave secreta META_APP_SECRET configurada.',
      diagnostico: {
        META_APP_ID_detectado: idPresent ? `${META_APP_ID.slice(0, 4)}...${META_APP_ID.slice(-4)}` : 'NO (FALTA)',
        META_APP_SECRET_detectado: secretPresent ? 'SÍ (Configurado)' : 'NO (FALTA O ESTÁ VACÍO)',
        appUrl,
        callbackUri,
      },
      solucion_paso_a_paso: [
        '1. Abre una nueva pestaña y ve a: https://vercel.com',
        '2. Entra en tu proyecto (nexus-ai).',
        '3. Ve a "Settings" (pestaña arriba a la derecha) -> "Environment Variables".',
        '4. Agrega una variable con Key: META_APP_ID y Value: 1811184963497287 (selecciona Production, Preview, Development).',
        '5. Agrega otra variable con Key: META_APP_SECRET y Value: ebc615a514623030bb4bcd8a69f33e7e (selecciona Production, Preview, Development).',
        '6. IMPORTANTE: En Vercel ve a la pestaña "Deployments", haz clic en los 3 puntos (...) del último despliegue y selecciona "Redeploy".',
      ],
    }, { status: 200 })
  }

  try {
    const res = await fetch(
      `https://graph.facebook.com/v22.0/${META_APP_ID}?access_token=${META_APP_ID}|${META_APP_SECRET}`
    )
    const data = await res.json()

    if (data.error) {
      return NextResponse.json({
        ok: false,
        status: 'META_API_REJECTED',
        titulo: '❌ Meta Graph API rechazó las credenciales',
        error_meta: data.error.message,
        codigo_error: data.error.code,
        diagnostico: {
          app_id_usado: META_APP_ID,
          longitud_secret: META_APP_SECRET.length,
          appUrl,
          callbackUri,
        },
        solucion: 'Verifica en developers.facebook.com > Tu App (nextdev) > Configuración de la app > Básica que la "Clave secreta de la app" coincida exactamente con la que pusiste en Vercel.',
      }, { status: 200 })
    }

    return NextResponse.json({
      ok: true,
      status: 'SUCCESS',
      titulo: '✅ Credenciales Verificadas con Éxito en Meta Graph API',
      mensaje: 'Las credenciales están perfectamente sincronizadas entre Vercel y Meta.',
      datos_app: {
        nombre_app: data.name,
        app_id: data.id,
      },
      appUrl,
      callbackUri,
    }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({
      ok: false,
      status: 'NETWORK_ERROR',
      error: err.message,
    }, { status: 500 })
  }
}
