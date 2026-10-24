/**
 * SISTEMA DE PROTECCIÓN ANTI-BOTS Y DETECCIÓN DE MÚLTIPLES IPs SIMULTÁNEAS
 * 
 * Reglas:
 * 1. Detección de Bots automatizados por patrones de User-Agent sospechosos.
 * 2. Detección de ráfagas distribuidas (muchas peticiones desde diferentes IPs en un corto intervalo de tiempo).
 * 3. Detección de concurrencia sospechosa de múltiples IPs en una misma sesión o cuenta.
 * 4. Bloqueo instantáneo con mensaje de advertencia visual y código HTTP 403.
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

// Registro en memoria de peticiones recientes (sliding window de 10 segundos)
const requestHistory: RequestRecord[] = []
// Registro de IPs asociadas a un identificador (usuario o sesión)
const userIpHistory = new Map<string, { ips: Set<string>; lastSeen: number }>()
// Lista de bloqueos activos
const blockedEntities = new Map<string, BlockedEntity>()

// Firmas de User-Agent conocidas de bots maliciosos y scrapers no autorizados
const MALICIOUS_BOT_PATTERNS = [
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

// Rutas críticas que deben protegerse fuertemente
const SENSITIVE_ROUTES = ['/dashboard', '/login', '/register', '/api/']

export interface SecurityCheckResult {
  blocked: boolean
  reason?: string
}

export function checkBotAndMultiIpSecurity(
  ip: string,
  userAgent: string,
  pathname: string,
  userIdOrSession?: string
): SecurityCheckResult {
  const now = Date.now()

  // 1. Verificar si la IP ya está bloqueada
  const activeBlock = blockedEntities.get(ip)
  if (activeBlock) {
    if (now < activeBlock.blockedUntil) {
      return { blocked: true, reason: activeBlock.reason }
    } else {
      blockedEntities.delete(ip)
    }
  }

  // 2. Verificar si el usuario/sesión está bloqueado
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

  // 3. DETECCIÓN DE BOT POR USER-AGENT en rutas sensibles
  const isSensitive = SENSITIVE_ROUTES.some((route) => pathname.startsWith(route))
  if (isSensitive) {
    const isBot = MALICIOUS_BOT_PATTERNS.some((pattern) => pattern.test(userAgent))
    if (isBot) {
      const reason = 'Firma de bot automatizado o herramienta de escaneo detectada'
      blockedEntities.set(ip, { blockedUntil: now + 3600000, reason }) // Bloqueo de 1 hora
      return { blocked: true, reason }
    }
  }

  // 4. DETECCIÓN DE MÚLTIPLES IPs SIMULTÁNEAS EN UNA MISMA CUENTA / SESIÓN
  if (userIdOrSession) {
    let entry = userIpHistory.get(userIdOrSession)
    if (!entry || now - entry.lastSeen > 60000) {
      entry = { ips: new Set<string>(), lastSeen: now }
      userIpHistory.set(userIdOrSession, entry)
    }

    entry.ips.add(ip)
    entry.lastSeen = now

    // Si la misma sesión o usuario se conecta desde más de 2 IPs distintas en menos de 1 minuto:
    if (entry.ips.size >= 3) {
      const reason = `Ataque distribuido detectado: Múltiples IPs (${Array.from(entry.ips).join(', ')}) accediendo concurrentemente a la misma sesión`
      blockedEntities.set(ip, { blockedUntil: now + 3600000, reason })
      blockedEntities.set(userIdOrSession, { blockedUntil: now + 3600000, reason })
      return { blocked: true, reason }
    }
  }

  // 5. DETECCIÓN DE RÁFAGAS DISTRIBUIDAS DE IPs (Botnet / Ataque DDoS en capa de aplicación)
  // Analizar peticiones en los últimos 5 segundos
  const recentStart = now - 5000
  const recentRequests = requestHistory.filter((r) => r.timestamp >= recentStart)

  // Si hay más de 35 peticiones en 5 segundos provenientes de más de 6 IPs distintas en rutas sensibles:
  const distinctIps = new Set(recentRequests.map((r) => r.ip))
  if (isSensitive && recentRequests.length > 35 && distinctIps.size >= 6) {
    const reason = 'Ataque coordinado de botnet detectado: Ráfagas simultáneas desde múltiples IPs'
    blockedEntities.set(ip, { blockedUntil: now + 3600000, reason })
    return { blocked: true, reason }
  }

  // 6. Ráfaga por IP individual (> 30 peticiones en 5 segundos)
  const requestsFromThisIp = recentRequests.filter((r) => r.ip === ip).length
  if (requestsFromThisIp > 30) {
    const reason = 'Tráfico no humano detectado: Ráfaga excesiva de peticiones automatizadas'
    blockedEntities.set(ip, { blockedUntil: now + 3600000, reason })
    return { blocked: true, reason }
  }

  return { blocked: false }
}

/**
 * Genera la respuesta visual de advertencia de bloqueo instantáneo
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
          'Retry-After': '3600',
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
    <a href="/login" class="btn">Volver al Inicio Seguro</a>
    <div class="footer-note">
      ID de Incidente: SEC-${Date.now().toString(36).toUpperCase()} • Si consideras que es un falso positivo, contacta a soporte@nexusai.com
    </div>
  </div>
</body>
</html>`

  return new Response(html, {
    status: 403,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Retry-After': '3600',
    },
  })
}
