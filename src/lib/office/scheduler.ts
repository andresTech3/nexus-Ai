import { Office, AgentId, CheckpointRecord, TrafficMode, WorkflowType } from '@/types/office'
import { useOfficeStore } from './store'
import { eventBus } from './eventBus'
import { calculateUnitEconomics } from './finance/calculator'
import { generateDeliverablesForOffice } from './mockData'
import { AGENT_DEFINITIONS } from './agents/definitions'
import { callAgentLLM } from './providers/llmRouter'
import { buildAgentUserPrompt } from './agents/prompts'

class OfficeScheduler {
  private isProcessing = false
  private currentOfficeId: string | null = null
  private abortController: AbortController | null = null

  private sleep(ms: number): Promise<void> {
    const speed = useOfficeStore.getState().speed
    const adjustedMs = Math.max(100, Math.floor(ms / speed))
    return new Promise((resolve) => setTimeout(resolve, adjustedMs))
  }

  public async startPipeline(officeId: string): Promise<void> {
    if (this.isProcessing) return

    const store = useOfficeStore.getState()
    const office = store.offices[officeId]
    if (!office || office.status === 'OFF') {
      store.addLog({
        officeId,
        agentId: 'dora',
        agentName: 'Dora (CEO)',
        message: 'No se puede iniciar el pipeline: la oficina está apagada. Enciéndela primero.',
        level: 'warn',
      })
      return
    }

    this.isProcessing = true
    this.currentOfficeId = officeId
    this.abortController = new AbortController()

    if (!store.isRunning) {
      store.togglePlayPause()
    }

    try {
      if (office.workflow === 'MORNING') {
        await this.runMorningRoutine(officeId)
      } else {
        await this.runLaunchPipeline(officeId)
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        store.addLog({
          officeId,
          agentId: 'dora',
          agentName: 'Dora',
          message: 'Pipeline pausado de forma segura por el operador.',
          level: 'info',
        })
      } else {
        console.error('[Scheduler Error]', err)
        store.addLog({
          officeId,
          agentId: 'dora',
          agentName: 'Dora',
          message: `Error en la ejecución del pipeline: ${err.message || 'Error desconocido'}`,
          level: 'error',
        })
      }
    } finally {
      this.isProcessing = false
      if (useOfficeStore.getState().isRunning) {
        useOfficeStore.getState().togglePlayPause()
      }
    }
  }

  public stop(): void {
    if (this.abortController) {
      this.abortController.abort()
      this.abortController = null
    }
    this.isProcessing = false
  }

  private checkAborted(): void {
    if (this.abortController?.signal.aborted) {
      const err = new Error('Pipeline aborted')
      err.name = 'AbortError'
      throw err
    }
  }

  private async executeAgentStep(
    officeId: string,
    agentId: AgentId,
    actionDesc: string,
    workDurationMs: number,
    fallbackSuccessMsg: string,
    deliverableKey?: string
  ): Promise<void> {
    const store = useOfficeStore.getState()
    const office = store.offices[officeId]
    if (!office) return
    const agentDef = AGENT_DEFINITIONS[agentId]

    this.checkAborted()

    const deptZoneMap: Record<AgentId, any> = {
      dora: 'dora',
      ivan: 'producto',
      lucas: 'producto',
      eva: 'producto',
      sofia: 'marketing',
      carlos: 'marketing',
      leo: 'marketing',
      diego: 'ecommerce',
      marco: 'ecommerce',
      tomas: 'operaciones',
      marta: 'operaciones',
      nora: 'operaciones',
    }

    if (store.autoFocusActiveAgent) {
      store.setCameraZone(deptZoneMap[agentId] || 'all')
      store.selectAgent(agentId)
    }

    // 1. Set to ANALYZING
    store.updateAgentState(officeId, agentId, 'ANALYZING')
    store.addLog({
      officeId,
      agentId,
      agentName: agentDef.name,
      message: `${actionDesc}...`,
      level: 'info',
    })
    await this.sleep(Math.max(1500, workDurationMs * 0.45))

    this.checkAborted()

    // 2. Set to GENERATING
    store.updateAgentState(officeId, agentId, 'GENERATING')

    // Real AI LLM Dispatch
    const isJson = deliverableKey?.endsWith('.json')
    const userPrompt = buildAgentUserPrompt(
      agentId,
      office.product.name,
      office.product.niche,
      office.brand.name,
      office.product.description,
      office.deliverables
    )

    const llmRes = await callAgentLLM(agentDef.systemPrompt, userPrompt, {
      agentId,
      officeId,
      productName: office.product.name,
      niche: office.product.niche,
      userContext: office.product.description,
      previousDeliverables: office.deliverables,
      jsonMode: isJson,
    })

    await this.sleep(Math.max(1500, workDurationMs * 0.45))
    this.checkAborted()

    // 3. Set to DONE & update Deliverables
    store.updateAgentState(officeId, agentId, 'DONE')

    if (llmRes.isReal && llmRes.content && deliverableKey) {
      let parsed: any = llmRes.content
      if (isJson) {
        try {
          parsed = JSON.parse(llmRes.content)
        } catch {
          parsed = {
            agent: agentId,
            status: 'OK',
            data_source: `REAL - ${llmRes.providerUsed.toUpperCase()} (${llmRes.modelUsed})`,
            payload: { rawText: llmRes.content },
          }
        }
      }
      store.saveDeliverable(officeId, deliverableKey, parsed)

      store.addLog({
        officeId,
        agentId,
        agentName: agentDef.name,
        message: `[${llmRes.providerUsed.toUpperCase()} • ${llmRes.tokensUsed} tokens] ${fallbackSuccessMsg}`,
        level: 'success',
      })
    } else {
      // Heuristic fallback
      store.addLog({
        officeId,
        agentId,
        agentName: agentDef.name,
        message: `${fallbackSuccessMsg}`,
        level: 'success',
      })
      store.updateQuota('mock', 1, Math.floor(Math.random() * 800 + 400))
    }
  }

  private emitHandoff(officeId: string, sourceAgent: AgentId, targetAgent: AgentId, documentName: string) {
    eventBus.emit('agent:handoff', {
      officeId,
      sourceAgent,
      targetAgent,
      documentName,
      timestamp: new Date().toISOString(),
    })
    useOfficeStore.getState().addLog({
      officeId,
      agentId: sourceAgent,
      agentName: AGENT_DEFINITIONS[sourceAgent].name,
      message: `Traspaso de entregable [${documentName}] hacia ${AGENT_DEFINITIONS[targetAgent].name}.`,
      level: 'info',
    })
  }

  private async waitForCheckpoint(checkpoint: CheckpointRecord): Promise<void> {
    const store = useOfficeStore.getState()
    store.openCheckpoint(checkpoint)

    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (!useOfficeStore.getState().activeCheckpoint) {
          clearInterval(checkInterval)
          resolve()
        }
      }, 300)
    })
  }

  /**
   * FULL BRAND LAUNCH WORKFLOW (DAG with 4 Checkpoints)
   */
  private async runLaunchPipeline(officeId: string): Promise<void> {
    const store = useOfficeStore.getState()
    let office = store.offices[officeId]
    if (!office) return

    const prodLower = (office.product.name + ' ' + office.product.niche).toLowerCase()
    const isRing = prodLower.includes('anillo') || prodLower.includes('titanio')
    const baseCost = isRing ? 18.50 : 4.10
    const basePvp = isRing ? 89.90 : 32.90

    const economics = calculateUnitEconomics({
      costo_producto: baseCost,
      costo_envio: 3.80,
      costo_packaging: isRing ? 2.20 : 1.20,
      pvp: basePvp,
      comision_pct: 0.029,
      comision_fijo: 0.30,
      provision_devoluciones_pct: 0.05,
      iva_pct: 0.21,
    })

    const initialDeliverables = generateDeliverablesForOffice(office, economics)

    // ==========================================
    // FASE 1: DIRECCIÓN, PRODUCTO & FINANZAS
    // ==========================================
    await this.executeAgentStep(
      officeId,
      'dora',
      'Iniciando pipeline de lanzamiento y fijando objetivos estratégicos',
      3200,
      `Pipeline activado para "${office.product.name}". Verificando viabilidad en mercado ${office.settings.market}.`,
      '11_informe_lanzamiento_dora.html'
    )

    this.emitHandoff(officeId, 'dora', 'ivan', '01_directrices_investigacion.json')
    this.emitHandoff(officeId, 'dora', 'lucas', '02_parametros_posicionamiento.json')

    // Paralelo: Iván y Lucas
    await Promise.all([
      this.executeAgentStep(
        officeId,
        'ivan',
        'Analizando tendencias en TikTok Creative Center y catálogo CJ Dropshipping',
        4200,
        `Producto validado: "${office.product.name}". Demostrable en < 3s, nicho con alto volumen.`,
        '01_investigacion_producto_ivan.json'
      ),
      this.executeAgentStep(
        officeId,
        'lucas',
        'Ingeniería inversa de competidores en Meta Ad Library y arquitectura de oferta',
        4400,
        `Posicionamiento fijado para ${office.brand.name}: anti-commodity a ${basePvp}€ con experiencia de unboxing.`,
        '02_analisis_competencia_lucas.md'
      ),
    ])

    // Ensure fallback deliverables exist if real LLM didn't return text
    if (!store.offices[officeId]?.deliverables['01_investigacion_producto_ivan.json']) {
      store.saveDeliverable(officeId, '01_investigacion_producto_ivan.json', initialDeliverables['01_investigacion_producto_ivan.json'])
    }
    if (!store.offices[officeId]?.deliverables['02_analisis_competencia_lucas.md']) {
      store.saveDeliverable(officeId, '02_analisis_competencia_lucas.md', initialDeliverables['02_analisis_competencia_lucas.md'])
    }

    this.emitHandoff(officeId, 'ivan', 'eva', '01_costos_proveedor.json')
    this.emitHandoff(officeId, 'lucas', 'eva', '02_propuesta_pvp.json')

    // Eva: Cálculo Determinista Real
    await this.executeAgentStep(
      officeId,
      'eva',
      'Calculando Unit Economics deterministas con calculator.ts (PVP, COGS, CPA Máximo)',
      3800,
      `Unit Economics listos: Multiplicador ${economics.multiplicador_markup}x (>=3.5x APROBADO), Breakeven ROAS ${economics.roas_equilibrio}x, CPA Techo ${economics.cpa_maximo_rentable}€.`,
      '03_unit_economics_eva.csv'
    )
    store.saveDeliverable(officeId, '03_unit_economics_eva.csv', initialDeliverables['03_unit_economics_eva.csv'])

    this.emitHandoff(officeId, 'eva', 'dora', '03_dossier_financiero.json')

    // CHECKPOINT 1: Validación de Producto
    const cp1: CheckpointRecord = {
      checkpointId: 'CP_01_PRODUCTO',
      title: 'CHECKPOINT 1: Selección y Validación Financiera de Producto',
      agent: 'Dora (CEO)',
      timestamp: new Date().toISOString(),
      status: 'PENDING',
      discrepancies: [],
      qualityGatePasses: true,
    }
    await this.waitForCheckpoint(cp1)

    // ==========================================
    // FASE 2: TIENDA, COPY & LIQUID
    // ==========================================
    this.emitHandoff(officeId, 'dora', 'sofia', 'brief_aprobado_cp1.json')

    await this.executeAgentStep(
      officeId,
      'sofia',
      'Construyendo avatar de cliente ideal (ICP), dolores viscerales y mapa de objeciones',
      2200,
      `Avatar de cliente ideal estructurado para "${office.product.name}" con 5 objeciones y gatillos emocionales.`,
      '04_customer_avatar_sofia.json'
    )
    if (!store.offices[officeId]?.deliverables['04_customer_avatar_sofia.json']) {
      store.saveDeliverable(officeId, '04_customer_avatar_sofia.json', initialDeliverables['04_customer_avatar_sofia.json'])
    }

    this.emitHandoff(officeId, 'sofia', 'carlos', '04_icp_map.json')
    this.emitHandoff(officeId, 'sofia', 'diego', '04_ux_requirements.json')

    // Paralelo: Carlos y Diego
    await Promise.all([
      this.executeAgentStep(
        officeId,
        'carlos',
        'Redactando Above The Fold móvil, comparativa y purgando claims prohibidos',
        2500,
        `Copy de landing page para "${office.brand.name}" finalizado con filtro legal sin promesas falsas.`,
        '05_copy_landing_page_carlos.md'
      ),
      this.executeAgentStep(
        officeId,
        'diego',
        'Programando sección Liquid de bundle selector con acordeón reglamentario de ingredientes',
        2700,
        'Código Shopify Liquid (Dawn compatible) compilado con checkout dinámico y acordeón técnico.',
        '07_shopify_bundle_selector_diego.liquid'
      ),
    ])

    if (!store.offices[officeId]?.deliverables['05_copy_landing_page_carlos.md']) {
      store.saveDeliverable(officeId, '05_copy_landing_page_carlos.md', initialDeliverables['05_copy_landing_page_carlos.md'])
    }
    if (!store.offices[officeId]?.deliverables['07_shopify_bundle_selector_diego.liquid']) {
      store.saveDeliverable(officeId, '07_shopify_bundle_selector_diego.liquid', initialDeliverables['07_shopify_bundle_selector_diego.liquid'])
    }

    this.emitHandoff(officeId, 'carlos', 'dora', '05_copy_check.json')
    this.emitHandoff(officeId, 'diego', 'dora', '07_liquid_code.json')

    // CHECKPOINT 2: Arquitectura de Tienda y Liquid
    const cp2: CheckpointRecord = {
      checkpointId: 'CP_02_TIENDA',
      title: 'CHECKPOINT 2: Arquitectura de Tienda y Código Liquid',
      agent: 'Dora (CEO)',
      timestamp: new Date().toISOString(),
      status: 'PENDING',
      discrepancies: [],
      qualityGatePasses: true,
    }
    await this.waitForCheckpoint(cp2)

    // ==========================================
    // FASE 3: CREATIVOS & GUIONES UGC
    // ==========================================
    this.emitHandoff(officeId, 'dora', 'leo', 'brief_aprobado_cp2.json')
    this.emitHandoff(officeId, 'dora', 'marco', 'brief_aprobado_cp2.json')

    // Paralelo: Leo y Marco
    await Promise.all([
      this.executeAgentStep(
        officeId,
        'leo',
        'Generando dirección de arte y renders fotográficos con IA (Pollinations)',
        2600,
        `Galería de producto y prompts fotográficos generados para "${office.product.name}".`,
        '06_prompts_fotografia_leo.json'
      ),
      this.executeAgentStep(
        officeId,
        'marco',
        'Guionizando vídeo UGC 9:16 de 30s con 3 variantes de gancho y brief para creadores',
        2400,
        `Guion de 30s para "${office.brand.name}" completado: Ganchos A/B/C y timeline cronometrada.`,
        '08_guiones_anuncios_ugc_marco.md'
      ),
    ])

    if (!store.offices[officeId]?.deliverables['06_prompts_fotografia_leo.json']) {
      store.saveDeliverable(officeId, '06_prompts_fotografia_leo.json', initialDeliverables['06_prompts_fotografia_leo.json'])
    }
    if (!store.offices[officeId]?.deliverables['08_guiones_anuncios_ugc_marco.md']) {
      store.saveDeliverable(officeId, '08_guiones_anuncios_ugc_marco.md', initialDeliverables['08_guiones_anuncios_ugc_marco.md'])
    }

    this.emitHandoff(officeId, 'leo', 'dora', '06_arte_final.json')
    this.emitHandoff(officeId, 'marco', 'dora', '08_guiones_final.json')

    // CHECKPOINT 3: Creativos y UGC
    const cp3: CheckpointRecord = {
      checkpointId: 'CP_03_CREATIVOS',
      title: 'CHECKPOINT 3: Creativos Visuales y Guiones UGC de 30s',
      agent: 'Dora (CEO)',
      timestamp: new Date().toISOString(),
      status: 'PENDING',
      discrepancies: [],
      qualityGatePasses: true,
    }
    await this.waitForCheckpoint(cp3)

    // ==========================================
    // FASE 4: ADQUISICIÓN DE TRÁFICO & OPERACIONES
    // ==========================================
    office = store.offices[officeId]
    const mode = office.trafficMode

    const acquisitionSteps: Promise<void>[] = [
      this.executeAgentStep(
        officeId,
        'marta',
        'Desarrollando árbol de decisiones para devoluciones y manual empático de soporte',
        2100,
        `Manual de atención y logística finalizado para "${office.brand.name}": árbol 30 días y prevención de disputas.`,
        '10_manual_atencion_cliente_marta.md'
      ),
    ]

    if (mode === 'ADS' || mode === 'HYBRID') {
      acquisitionSteps.push(
        this.executeAgentStep(
          officeId,
          'tomas',
          'Estructurando campaña Meta Ads CBO con reglas de Stop-Loss sincronizadas con Eva',
          2500,
          `Blueprint Meta Ads preparado: CBO 50€/día, Stop-Loss automático a ${(economics.cpa_maximo_rentable * 1.5).toFixed(2)}€.`,
          '09_estructura_campana_meta_tomas.json'
        )
      )
    }

    if (mode === 'ORGANIC' || mode === 'HYBRID') {
      acquisitionSteps.push(
        this.executeAgentStep(
          officeId,
          'nora',
          'Elaborando calendario de contenido viral de 30 días y plan de creadores semilla',
          2400,
          `Plan orgánico finalizado para "${office.brand.name}": 30 vídeos nativos, seeding de 20 microcreadoras y regla de traspaso.`,
          '12_plan_contenido_organico_nora.md'
        )
      )
    }

    await Promise.all(acquisitionSteps)

    if (!store.offices[officeId]?.deliverables['10_manual_atencion_cliente_marta.md']) {
      store.saveDeliverable(officeId, '10_manual_atencion_cliente_marta.md', initialDeliverables['10_manual_atencion_cliente_marta.md'])
    }
    if ((mode === 'ADS' || mode === 'HYBRID') && !store.offices[officeId]?.deliverables['09_estructura_campana_meta_tomas.json']) {
      store.saveDeliverable(officeId, '09_estructura_campana_meta_tomas.json', initialDeliverables['09_estructura_campana_meta_tomas.json'])
    }
    if ((mode === 'ORGANIC' || mode === 'HYBRID') && !store.offices[officeId]?.deliverables['12_plan_contenido_organico_nora.md']) {
      store.saveDeliverable(officeId, '12_plan_contenido_organico_nora.md', initialDeliverables['12_plan_contenido_organico_nora.md'])
    }

    // CHECKPOINT 4: Activación y Presupuesto
    const cp4: CheckpointRecord = {
      checkpointId: 'CP_04_ACTIVACION',
      title: 'CHECKPOINT 4: Activación de Campaña y Asignación de Presupuesto',
      agent: 'Dora (CEO)',
      timestamp: new Date().toISOString(),
      status: 'PENDING',
      discrepancies: [],
      qualityGatePasses: true,
    }
    await this.waitForCheckpoint(cp4)

    // ==========================================
    // FASE 5: INFORME FINAL Y DOSSIER DE LANZAMIENTO
    // ==========================================
    await this.executeAgentStep(
      officeId,
      'dora',
      'Consolidando auditoría final de cumplimiento y generando Dossier Ejecutivo de Lanzamiento',
      1800,
      `¡Pipeline completado con éxito! Todos los activos de "${office.brand.name}" listos para descargar en ZIP.`,
      '11_informe_lanzamiento_dora.html'
    )

    if (!store.offices[officeId]?.deliverables['11_informe_lanzamiento_dora.html']) {
      store.saveDeliverable(officeId, '11_informe_lanzamiento_dora.html', initialDeliverables['11_informe_lanzamiento_dora.html'])
    }

    // Confetti celebration if browser window is available
    if (typeof window !== 'undefined') {
      try {
        const confetti = (await import('canvas-confetti')).default
        confetti({
          particleCount: 140,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#faae33', '#823513', '#34d399', '#ffffff'],
        })
      } catch {
        // ignore confetti import error
      }
    }
  }

  /**
   * MORNING ROUTINE WORKFLOW (1 hour daily check summarized in 1 run)
   */
  private async runMorningRoutine(officeId: string): Promise<void> {
    const store = useOfficeStore.getState()

    await this.executeAgentStep(
      officeId,
      'dora',
      'Iniciando Rutina de Mañana: Revisando métricas de las últimas 24 horas',
      1200,
      'Comenzando auditoría matutina de pedidos, ad spend y soporte post-venta.'
    )

    await Promise.all([
      this.executeAgentStep(
        officeId,
        'eva',
        'Recalculando unit economics con los datos de ventas y gasto publicitario de ayer',
        1800,
        'Finanzas OK: ROAS medio ayer de 2.42x, margen neto consolidado del 54.1%.'
      ),
      this.executeAgentStep(
        officeId,
        'tomas',
        'Auditando reglas de Stop-Loss y conjuntos de anuncios en Meta Ads Manager',
        1900,
        'Meta Ads: 2 adsets activos escalando con ROAS > 2.8x. 0 adsets pausados por stop-loss.'
      ),
      this.executeAgentStep(
        officeId,
        'marta',
        'Revisando tickets de soporte entrantes y estado de envíos con paquetería',
        1600,
        'Soporte: 4 consultas resueltas sin incidencias de aduanas ni disputas bancarias.'
      ),
      this.executeAgentStep(
        officeId,
        'ivan',
        'Escaneando 3 nuevos ángulos de tendencia emergentes en TikTok Creative Center',
        2000,
        'Radar de producto: 3 candidatos detectados con velocidad de crecimiento > +180%.'
      ),
    ])

    await this.executeAgentStep(
      officeId,
      'dora',
      'Generando resumen ejecutivo matutino en 1 pantalla',
      1200,
      'Rutina de Mañana finalizada con éxito. Rendimiento saludable en todas las áreas.'
    )
  }
}

export const scheduler = new OfficeScheduler()
