/**
 * SISTEMA DE PROTECCIÓN ANTI-BOTS Y DETECCIÓN DE MÚLTIPLES IPs SIMULTÁNEAS
 * 
 * Reglas de Protección Inteligente:
 * 1. Whitelist de Navegadores Humanos Legítimos (Chrome, Safari, Firefox, Edge, Opera, iOS, Android):
 *    Un usuario navegando normalmente NUNCA debe ser bloqueado por falsos positivos.
 *    Si una IP fue previamente marcada por una herramienta de pruebas o bot temporal,
 *    la llegada de un navegador legítimo la desmarca y permite el acceso inmediato.
 * 2. Whitelist de Desarrollo Local y Redes Privadas (127.0.0.1, ::1, localhost, 192.168.*, 10.*).
 * 3. Detección estricta de bots automatizados no autorizados (python-requests, curl, sqlmap, puppeteer, etc.) en rutas sensibles.
 * 4. Detección de concurrencia sospechosa de múltiples IPs públicas en una misma cuenta/sesión (robo de credenciales / botnet distribuida).
 * 5. Bloqueo instantáneo con mensaje de advertencia visual (Estilo Hungry Tiger) y código HTTP 403.
 */

interface RequestRecord {
  ip: string
  timestamp: number
  userAgent: string
}

interface BlockedEntity {
  blockedUntil: number
  reason: string
}

// Registro en memoria de peticiones recientes (sliding window)
const requestHistory: RequestRecord[] = []
// Registro de IPs asociadas a un identificador (usuario o sesión)
const userIpHistory = new Map<string, { ips: Set<string>; lastSeen: number }>()
// Lista de bloqueos activos
const blockedEntities = new Map<string, BlockedEntity>()

// Firmas de User-Agent conocidas de bots maliciosos y scrapers no autorizados
export const MALICIOUS_BOT_PATTERNS = [
  /python-requests/i,
  /aiohttp/i,
  /scrapy/i,
  /sqlmap/i,
  /headlesschrome/i,
  /puppeteer/i,
  /phantomjs/i,
  /selenium/i,
  /curl\//i,
  /wget/i,
  /gobuster/i,
  /nikto/i,
  /zgrab/i,
  /masscan/i,
]

// Rutas críticas que deben protegerse fuertemente contra bots no autorizados
const SENSITIVE_ROUTES = ['/dashboard', '/login', '/register', '/api/']

export interface SecurityCheckResult {
  blocked: boolean
  reason?: string
}

/**
 * Verifica si una dirección IP pertenece a localhost o redes privadas locales
 */
export function isPrivateOrLocalIp(ip: string): boolean {
  if (!ip) return true
  const cleanIp = ip.trim().toLowerCase()
  return (
    cleanIp === '127.0.0.1' ||
    cleanIp === '::1' ||
    cleanIp === 'localhost' ||
    cleanIp.startsWith('192.168.') ||
    cleanIp.startsWith('10.') ||
    cleanIp.startsWith('172.16.') ||
    cleanIp.startsWith('172.17.') ||
    cleanIp.startsWith('172.18.') ||
    cleanIp.startsWith('172.19.') ||
    cleanIp.startsWith('172.20.') ||
    cleanIp.startsWith('172.21.') ||
    cleanIp.startsWith('172.22.') ||
    cleanIp.startsWith('172.23.') ||
    cleanIp.startsWith('172.24.') ||
    cleanIp.startsWith('172.25.') ||
    cleanIp.startsWith('172.26.') ||
    cleanIp.startsWith('172.27.') ||
    cleanIp.startsWith('172.28.') ||
    cleanIp.startsWith('172.29.') ||
    cleanIp.startsWith('172.30.') ||
    cleanIp.startsWith('172.31.')
  )
}

/**
 * Verifica si el User-Agent proviene de un navegador web humano legítimo
 */
export function isLegitimateBrowser(userAgent: string): boolean {
  if (!userAgent || typeof userAgent !== 'string') return false
  const ua = userAgent.toLowerCase()

  // Si contiene alguna firma explícita de bot malicioso o scraper, NO es legítimo
  if (MALICIOUS_BOT_PATTERNS.some((pattern) => pattern.test(userAgent))) {
    return false
  }

  // Verifica que tenga la estructura estándar de navegador moderno
  const hasMozilla = ua.includes('mozilla/')
  const hasBrowserEngine =
    ua.includes('chrome') ||
    ua.includes('safari') ||
    ua.includes('firefox') ||
    ua.includes('edg') ||
    ua.includes('edge') ||
    ua.includes('opr') ||
    ua.includes('opera') ||
    ua.includes('mobile') ||
    ua.includes('android') ||
    ua.includes('iphone') ||
    ua.includes('ipad') ||
    ua.includes('webkit')

  return hasMozilla && hasBrowserEngine
}

/**
 * Desbloquea explícitamente una entidad (IP o identificador de sesión)
 */
export function unblockEntity(id: string): void {
  if (id) {
    blockedEntities.delete(id)
    userIpHistory.delete(id)
  }
}

/**
 * Limpia todos los registros y bloqueos en memoria
 */
export function clearAllBlocks(): void {
  blockedEntities.clear()
  userIpHistory.clear()
  requestHistory.length = 0
}

/**
 * Evalúa peticiones entrantes contra bots maliciosos y concurrencia anómala de IPs
 */
export function checkBotAndMultiIpSecurity(
  ip: string,
  userAgent: string,
  pathname: string,
  userIdOrSession?: string
): SecurityCheckResult {
  const now = Date.now()
  const isLocal = isPrivateOrLocalIp(ip)
  const isRealBrowser = isLegitimateBrowser(userAgent)

  // 1. REGLA DE ORO: Si es un navegador legítimo real, auto-desbloquear cualquier IP residual
  // Esto previene que un usuario legítimo se quede bloqueado por pruebas previas en la misma red
  if (isRealBrowser) {
    if (blockedEntities.has(ip)) {
      blockedEntities.delete(ip)
    }
  }

  // 2. Tráfico de desarrollo local o redes privadas nunca se bloquea
  if (isLocal) {
    return { blocked: false }
  }

  // 3. Verificar si la IP está explícitamente bloqueada (solo aplica a no-navegadores / bots)
  const activeBlock = blockedEntities.get(ip)
  if (activeBlock) {
    if (now < activeBlock.blockedUntil) {
      if (!isRealBrowser) {
        return { blocked: true, reason: activeBlock.reason }
      } else {
        blockedEntities.delete(ip)
      }
    } else {
      blockedEntities.delete(ip)
    }
  }

  // 4. Verificar si la cuenta/sesión específica está bloqueada por ataque de secuestro
  if (userIdOrSession) {
    const userBlock = blockedEntities.get(userIdOrSession)
    if (userBlock) {
      if (now < userBlock.blockedUntil) {
        return { blocked: true, reason: userBlock.reason }
      } else {
        blockedEntities.delete(userIdOrSession)
      }
    }
  }

  // Limpiar historial antiguo (> 15 segundos)
  const windowStart = now - 15000
  while (requestHistory.length > 0 && requestHistory[0].timestamp < windowStart) {
    requestHistory.shift()
  }

  // Registrar petición actual
  requestHistory.push({ ip, timestamp: now, userAgent })

  // 5. DETECCIÓN DE BOT POR USER-AGENT en rutas sensibles (/api, /dashboard, /login, /register)
  const isSensitive = SENSITIVE_ROUTES.some((route) => pathname.startsWith(route))
  const isMaliciousBot = MALICIOUS_BOT_PATTERNS.some((pattern) => pattern.test(userAgent))

  if (isSensitive && isMaliciousBot) {
    const reason = 'Firma de bot automatizado o herramienta de escaneo no autorizada detectada'
    blockedEntities.set(ip, { blockedUntil: now + 1800000, reason }) // 30 min
    return { blocked: true, reason }
  }

  // 6. DETECCIÓN DE MÚLTIPLES IPs SIMULTÁNEAS EN UNA MISMA CUENTA / SESIÓN
  // Si una misma sesión es operada concurrentemente desde 4 o más IPs distintas en menos de 1 minuto:
  if (userIdOrSession) {
    let entry = userIpHistory.get(userIdOrSession)
    if (!entry || now - entry.lastSeen > 60000) {
      entry = { ips: new Set<string>(), lastSeen: now }
      userIpHistory.set(userIdOrSession, entry)
    }

    entry.ips.add(ip)
    entry.lastSeen = now

    if (entry.ips.size >= 4) {
      const reason = `Ataque distribuido detectado: Múltiples IPs (${Array.from(entry.ips).join(', ')}) accediendo concurrentemente a la misma sesión`
      blockedEntities.set(userIdOrSession, { blockedUntil: now + 900000, reason }) // Bloqueo de sesión 15m
      return { blocked: true, reason }
    }
  }

  // 7. DETECCIÓN DE RÁFAGAS DISTRIBUIDAS DE BOTS (Botnet en capa de aplicación)
  const recentStart = now - 5000
  const recentRequests = requestHistory.filter((r) => r.timestamp >= recentStart)
  const nonBrowserRequests = recentRequests.filter((r) => !isLegitimateBrowser(r.userAgent))

  // Si hay más de 40 peticiones automatizadas sin navegador provenientes de 5+ IPs distintas:
  const distinctBotIps = new Set(nonBrowserRequests.map((r) => r.ip))
  if (isSensitive && nonBrowserRequests.length > 40 && distinctBotIps.size >= 5) {
    const reason = 'Ataque coordinado de botnet detectado: Ráfagas simultáneas desde múltiples IPs'
    blockedEntities.set(ip, { blockedUntil: now + 1800000, reason })
    return { blocked: true, reason }
  }

  // 8. RÁFAGA INDIVIDUAL ANÓMALA (Flood control)
  // Para navegadores reales el umbral es alto (150 req / 5s) para permitir navegación fluida y assets
  // Para scripts / no navegadores el umbral es 25 req / 5s
  const requestsFromThisIp = recentRequests.filter((r) => r.ip === ip).length
  const floodLimit = isRealBrowser ? 150 : 25

  if (requestsFromThisIp > floodLimit) {
    const reason = 'Tráfico no humano detectado: Ráfaga excesiva de peticiones automatizadas'
    blockedEntities.set(ip, { blockedUntil: now + 300000, reason }) // 5 min
    return { blocked: true, reason }
  }

  return { blocked: false }
}

/**
 * Genera la respuesta visual de advertencia de bloqueo instantáneo (Estilo Hungry Tiger)
 */
export function createBlockedResponse(reason: string, isApi: boolean): Response {
  if (isApi) {
    return new Response(
      JSON.stringify({
        error: 'ACCESO_BLOQUEADO_INSTANTANEAMENTE',
        mensaje: '⚠️ ADVERTENCIA DE SEGURIDAD: Tu acceso ha sido bloqueado instantáneamente debido a actividad automatizada de bot o solicitudes concurrentes desde múltiples direcciones IP.',
        motivo: reason,
        accion: 'Sesión invalidada y dirección IP restringida.',
        soporte: 'contacto@nexusai.com',
        timestamp: new Date().toISOString(),
      }),
      {
        status: 403,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': '300',
        },
      }
    )
  }

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Acceso Bloqueado — Nexus AI Security</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;700&family=Syne:wght@800&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: #281006;
      color: #faae33;
      font-family: 'Plus Jakarta Sans', sans-serif;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .card {
      background: #402011;
      border: 2px solid #d1255c;
      border-radius: 16px;
      max-width: 640px;
      width: 100%;
      padding: 40px;
      text-align: center;
      box-shadow: 0 20px 60px rgba(0,0,0,0.6);
    }
    .badge {
      display: inline-block;
      background: #d1255c;
      color: #ffffff;
      padding: 6px 16px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      margin-bottom: 24px;
    }
    h1 {
      font-family: 'Syne', sans-serif;
      font-size: 28px;
      font-weight: 800;
      color: #ffffff;
      line-height: 1.1;
      margin-bottom: 16px;
      text-transform: uppercase;
    }
    p {
      color: rgba(255, 255, 255, 0.85);
      font-size: 14px;
      line-height: 1.6;
      margin-bottom: 24px;
    }
    .reason-box {
      background: #281006;
      border: 1px solid #6b2e12;
      border-radius: 8px;
      padding: 16px;
      color: #faae33;
      font-size: 13px;
      font-weight: 600;
      margin-bottom: 28px;
      text-align: left;
    }
    .btn {
      display: inline-block;
      background: #faae33;
      color: #281006;
      font-weight: 700;
      font-size: 13px;
      padding: 12px 24px;
      border-radius: 9999px;
      text-decoration: none;
      text-transform: uppercase;
      letter-spacing: 0.02em;
      transition: transform 0.2s, background 0.2s;
    }
    .btn:hover {
      background: #ffffff;
      transform: translateY(-2px);
    }
    .footer-note {
      margin-top: 24px;
      font-size: 11px;
      color: rgba(250, 174, 51, 0.6);
    }
  </style>
</head>
<body>
  <div class="card">
    <span class="badge">Bloqueo de Seguridad Activo</span>
    <h1>⚠️ Acceso Bloqueado Instantáneamente</h1>
    <p>
      El sistema de monitoreo en tiempo real ha detectado un comportamiento anómalo que coincide con
      <strong>tráfico automatizado de bots</strong> o <strong>múltiples direcciones IP interactuando de forma simultánea</strong>.
    </p>
    <div class="reason-box">
      <strong>Motivo del Bloqueo:</strong><br>
      ${reason}
    </div>
    <a href="/login?unblock=true" class="btn">Volver al Inicio Seguro</a>
    <div class="footer-note">
      ID de Incidente: SEC-${Date.now().toString(36).toUpperCase()} • Si consideras que es un falso positivo, el sistema se reactiva automáticamente al acceder con un navegador normal.
    </div>
  </div>
</body>
</html>`

  return new Response(html, {
    status: 403,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Retry-After': '300',
    },
  })
}
