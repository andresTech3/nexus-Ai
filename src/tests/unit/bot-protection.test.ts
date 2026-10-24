import { describe, it, expect, beforeEach } from 'vitest'
import {
  isLegitimateBrowser,
  isPrivateOrLocalIp,
  checkBotAndMultiIpSecurity,
  clearAllBlocks,
  unblockEntity,
} from '@/lib/security/bot-protection'

describe('Bot Protection & Multi-IP Security Logic', () => {
  beforeEach(() => {
    clearAllBlocks()
  })

  describe('isLegitimateBrowser', () => {
    it('identifies standard desktop Chrome as legitimate', () => {
      const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
      expect(isLegitimateBrowser(ua)).toBe(true)
    })

    it('identifies Safari on macOS as legitimate', () => {
      const ua = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15'
      expect(isLegitimateBrowser(ua)).toBe(true)
    })

    it('identifies mobile Safari on iPhone as legitimate', () => {
      const ua = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1'
      expect(isLegitimateBrowser(ua)).toBe(true)
    })

    it('identifies Android Chrome as legitimate', () => {
      const ua = 'Mozilla/5.0 (Linux; Android 14; SM-S928B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.6367.82 Mobile Safari/537.36'
      expect(isLegitimateBrowser(ua)).toBe(true)
    })

    it('identifies Microsoft Edge as legitimate', () => {
      const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0'
      expect(isLegitimateBrowser(ua)).toBe(true)
    })

    it('flags python-requests as NOT legitimate', () => {
      expect(isLegitimateBrowser('python-requests/2.31.0')).toBe(false)
    })

    it('flags curl as NOT legitimate', () => {
      expect(isLegitimateBrowser('curl/8.4.0')).toBe(false)
    })

    it('flags puppeteer / headlesschrome as NOT legitimate', () => {
      expect(isLegitimateBrowser('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 HeadlessChrome/120.0.0.0')).toBe(false)
    })

    it('flags empty or undefined user-agents as NOT legitimate', () => {
      expect(isLegitimateBrowser('')).toBe(false)
    })
  })

  describe('isPrivateOrLocalIp', () => {
    it('recognizes 127.0.0.1 and ::1 as local', () => {
      expect(isPrivateOrLocalIp('127.0.0.1')).toBe(true)
      expect(isPrivateOrLocalIp('::1')).toBe(true)
    })

    it('recognizes private subnet IPs (192.168.*, 10.*)', () => {
      expect(isPrivateOrLocalIp('192.168.1.15')).toBe(true)
      expect(isPrivateOrLocalIp('10.0.0.1')).toBe(true)
    })

    it('recognizes public internet IPs as NOT local', () => {
      expect(isPrivateOrLocalIp('186.84.90.12')).toBe(false)
      expect(isPrivateOrLocalIp('54.210.12.99')).toBe(false)
    })
  })

  describe('checkBotAndMultiIpSecurity behavior', () => {
    const chromeUA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
    const pythonUA = 'python-requests/2.31.0'

    it('allows legitimate human browser on sensitive route', () => {
      const result = checkBotAndMultiIpSecurity('186.84.90.12', chromeUA, '/dashboard')
      expect(result.blocked).toBe(false)
    })

    it('allows legitimate human browser on root landing page', () => {
      const result = checkBotAndMultiIpSecurity('186.84.90.12', chromeUA, '/')
      expect(result.blocked).toBe(false)
    })

    it('blocks malicious python-requests scraper on sensitive route with warning', () => {
      const result = checkBotAndMultiIpSecurity('190.22.44.11', pythonUA, '/api/v1/crm/clients')
      expect(result.blocked).toBe(true)
      expect(result.reason).toContain('bot automatizado')
    })

    it('automatically unblocks IP if legitimate human browser enters from that IP', () => {
      // 1. Simular bot que bloqueó la IP pública
      const botResult = checkBotAndMultiIpSecurity('181.55.33.22', pythonUA, '/api/agents')
      expect(botResult.blocked).toBe(true)

      // 2. El usuario entra con su navegador Chrome real desde esa misma IP
      const humanResult = checkBotAndMultiIpSecurity('181.55.33.22', chromeUA, '/login')
      // DEBE PERMITIRLE ENTRAR Y NO BLOQUEARLE
      expect(humanResult.blocked).toBe(false)
    })

    it('allows unblocking via unblockEntity helper', () => {
      checkBotAndMultiIpSecurity('181.55.33.99', pythonUA, '/api/agents')
      unblockEntity('181.55.33.99')

      const result = checkBotAndMultiIpSecurity('181.55.33.99', chromeUA, '/')
      expect(result.blocked).toBe(false)
    })

    it('detects suspicious multiple concurrent IPs on the same session (RF security requirement)', () => {
      const sessionToken = 'session_xyz_secure_token'

      // Acceso simultáneo desde 4 IPs distintas en menos de 1 minuto
      checkBotAndMultiIpSecurity('200.10.1.1', chromeUA, '/dashboard', sessionToken)
      checkBotAndMultiIpSecurity('200.10.1.2', chromeUA, '/dashboard', sessionToken)
      checkBotAndMultiIpSecurity('200.10.1.3', chromeUA, '/dashboard', sessionToken)
      const attackAttempt = checkBotAndMultiIpSecurity('200.10.1.4', chromeUA, '/dashboard', sessionToken)

      expect(attackAttempt.blocked).toBe(true)
      expect(attackAttempt.reason).toContain('Ataque distribuido')
    })
  })
})
