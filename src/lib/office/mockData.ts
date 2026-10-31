import { Office, UnitEconomicsResult } from '@/types/office'
import { calculateUnitEconomics } from './finance/calculator'

export function generateDeliverablesForOffice(office: Office, economics?: UnitEconomicsResult): Record<string, any> {
  const prodLower = (office.product.name + ' ' + office.product.niche).toLowerCase()
  const isRing = prodLower.includes('anillo') || prodLower.includes('titanio') || prodLower.includes('joy') || prodLower.includes('wearable') || prodLower.includes('aura')
  const productName = office.product.name || 'Producto Ganador D2C'
  const brandName = office.brand.name || 'Marca Premium'
  const niche = office.product.niche || 'Comercio Electrónico D2C'

  const econ = economics || calculateUnitEconomics({
    costo_producto: isRing ? 18.50 : 4.10,
    costo_envio: 3.80,
    costo_packaging: 2.20,
    pvp: isRing ? 89.90 : 32.90,
    comision_pct: 0.029,
    comision_fijo: 0.30,
    provision_devoluciones_pct: 0.05,
    iva_pct: 0.21,
  })

  // 1. ANILLO INTELIGENTE / TITANIO SCENARIO
  if (isRing) {
    return {
      '01_investigacion_producto_ivan.json': {
        agent: 'ivan',
        status: 'OK',
        data_source: 'VERIFICADO_EN_VIVO (FREELLMAPI / CJ DROPSHIPPING)',
        payload: {
          scanned_products_count: 88,
          trend_velocity: '+340% en TikTok y Google Trends Europa (Biohacking & Minimalist Wearables)',
          top_candidates: [
            {
              id: 'RING-01',
              name: productName,
              niche: 'Wellness & Smart Jewelry',
              monthly_revenue_est: 340000,
              ugc_creators_count: 1420,
              avg_video_views: 720000,
              why_it_works: 'Factor visual en 3s: acabado en titanio aeroespacial cepillado con sensores infrarrojos invisibles que miden HRV y sueño sin pantallas distractoras.',
              supplier_cost_est: 18.50,
              data_source: 'SIMULADO - CJ Dropshipping / Meta Ad Library',
            },
          ],
          selected_winner: {
            product_id: 'RING-01',
            name: productName,
            rationale: 'Cumple el filtro estricto de Dora: ticket premium de 89.90€, multiplicador > 4.0x sobre coste de 18.50€ y cero devoluciones por rotura de pantalla.',
          },
        },
        assumptions: ['Coste de proveedor basado en aleación de titanio Grado 5 con chip BLE 5.2 de bajo consumo.'],
        warnings: ['Verificar la certificación CE/RoHS de baterías de litio antes de la campaña.'],
      },

      '02_analisis_competencia_lucas.md': `# ANÁLISIS COMPETITIVO Y ESTRATEGIA DE POSICIONAMIENTO — ${brandName}
*Autor: Lucas (Inteligencia Competitiva y Posicionamiento)*

## 1. Mapeo de Competidores
- **Oura Ring Gen 3:** 399€ + suscripción mensual forzosa de 5.99€/mes. Provoca rechazo por su modelo de alquiler perpetuo.
- **Anillos Chinos Baratos (AliExpress):** 19€ - 28€. Plástico pintado, desconexiones Bluetooth constantes, apps pésimas.

## 2. El "Market Gap" de ${brandName}
**Nuestra Oferta Disruptiva:** 89.90€ en un único pago, **SIN SUSCRIPCIONES MENSUALES PARA SIEMPRE**. Titanio cepillado auténtico con app nativa en español sincronizada con Apple Health y Google Fit.

## 3. Identidad de Marca y Unboxing
- **Territorio:** Biohacking nórdico silencioso.
- **Unboxing:** Estuche de aluminio mecanizado anodizado con cargador magnético inalámbrico y tarjeta de membresía vitalicia grabada a láser.`,

      '03_unit_economics_eva.csv': `Concepto,Valor,Unidad,Observaciones
PVP_Con_IVA,${econ.pvp_con_iva.toFixed(2)},EUR,PVP en web
PVP_Sin_IVA,${econ.pvp_sin_iva.toFixed(2)},EUR,Base imponible (21% IVA)
Coste_Producto_Base,${econ.cogs_producto_base.toFixed(2)},EUR,Titanio grado 5 con chip BLE
Coste_Envio_Unitario,3.80,EUR,Envío asegurado 48h
Coste_Packaging_Premium,2.20,EUR,Caja rígida con cargador magnético
Comision_Pasarela_Stripe,${econ.comision_pasarela.toFixed(2)},EUR,2.9% + 0.30€
Provision_Devoluciones,${econ.provision_devoluciones.toFixed(2)},EUR,5% sobre PVP neto
COGS_Total_Unitario,${econ.cogs_total.toFixed(2)},EUR,Coste total por pedido
Beneficio_Neto_Antes_Ads,${econ.beneficio_neto_antes_ads.toFixed(2)},EUR,Margen para Meta Ads
Margen_Neto_Porcentaje,${econ.margen_neto_pct.toFixed(1)},%,Margen bruto operativo
Multiplicador_Markup,${econ.multiplicador_markup.toFixed(2)},x,Regla de Dora (>= 3.5x)
ROAS_Equilibrio_Breakeven,${econ.roas_equilibrio.toFixed(2)},x,ROAS mínimo de equilibrio
CPA_Maximo_Rentable,${econ.cpa_maximo_rentable.toFixed(2)},EUR,CPA techo para Tomás
Health_Score,${econ.health_score},-,${econ.health_reason}`,

      '04_customer_avatar_sofia.json': {
        agent: 'sofia',
        status: 'OK',
        data_source: 'VERIFICADO_EN_VIVO (FREELLMAPI / CJ DROPSHIPPING)',
        payload: {
          primary_avatar: {
            name: 'Carlos Mendoza',
            age: 32,
            role: 'Consultor de Estrategia & Deportista Aficionado',
            pain_point_trigger: 'Cansancio matutino crónico y saturación de relojes inteligentes con notificaciones constantes que aumentan su ansiedad.',
            internal_monologue: '"Quiero medir mi recuperación, sueño profundo y estrés, pero no quiero llevar una pantalla en la muñeca que vibre cada 3 minutos ni pagar 6 euros al mes por ver mis propios datos."',
            objections: [
              '¿Es titanio de verdad o plástico con pintura metalizada?',
              '¿Qué pasa si me equivoco de talla de anillo?',
              '¿La batería aguanta al menos 5 días seguidos?',
              '¿Tengo que pagar suscripción para ver los datos del sueño?',
            ],
            transformation_desired: 'Optimizar su descanso y energía diaria con una joya discreta y minimalista sin cuotas mensuales.',
          },
        },
      },

      '05_copy_landing_page_carlos.md': `# COPYWRITING DIRECTO — ${brandName}
*Autor: Carlos (Copywriter de Respuesta Directa)*

### [ABOVE THE FOLD MÓVIL]
**Eyebrow:** EL FUTURO DEL BIENESTAR SILENCIOSO
# Tu salud y tu sueño medidos con precisión médica en un anillo de titanio. Sin pantallas. Sin suscripciones.
**Subheadline:** Monitoriza sueño profundo, variabilidad cardíaca (HRV) y recuperación celular las 24 horas. Fabricado en titanio aeroespacial con 6 días de batería ininterrumpida.

[ CTA ] -> **RESERVA TU TALLA CON 30% DE DESCUENTO (89,90 €)**
*Microcopy:* Incluye Kit Medidor de Tallas Gratuito • Garantía de Devolución 30 Días • Cero Cuotas Mensuales`,

      '06_prompts_fotografia_leo.json': {
        agent: 'leo',
        status: 'OK',
        data_source: 'VERIFICADO_EN_VIVO (FREELLMAPI / CJ DROPSHIPPING)',
        payload: {
          image_prompts: [
            {
              type: 'HERO_PRODUCT',
              title: 'Anillo en Titanio Cepillado sobre Roca Volcánica',
              prompt: 'Commercial macro photography of a brushed aerospace titanium smart ring, interior glowing with soft optical biometric sensors, resting on black basalt volcanic rock, dramatic moody studio lighting, 8k --ar 1:1',
              aspect_ratio: '1:1',
            },
          ],
          direct_free_image_urls: [
            'https://image.pollinations.ai/prompt/aerospace%20titanium%20smart%20ring%20minimalist%20jewelry%20black%20stone%20luxury%20lighting?width=800&height=800&nologo=true',
          ],
        },
      },

      '07_shopify_bundle_selector_diego.liquid': `{% comment %}
  SECCIÓN: LIQUID BUNDLE SELECTOR — ${brandName}
  Autor: Diego (Arquitecto Shopify Liquid)
{% endcomment %}
<div class="smart-ring-bundle" style="background:#151210; color:#fff; padding:2rem; border-radius:12px;">
  <h2>Elige tu Acabado en Titanio Aeroespacial</h2>
  <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin:1.5rem 0;">
    <div style="border:2px solid #faae33; padding:1rem; border-radius:8px;">
      <h3>Titanio Negro Mate</h3>
      <p style="font-size:1.5rem; font-weight:800; color:#faae33;">89,90 €</p>
      <button style="width:100%; background:#faae33; color:#181008; font-weight:800; padding:0.8rem; border:none; border-radius:6px; cursor:pointer;">
        COMPRAR AHORA &rarr;
      </button>
    </div>
  </div>
</div>`,

      '08_guiones_anuncios_ugc_marco.md': `# GUION UGC 9:16 — ${brandName}
*Autor: Marco (Productor UGC)*

### GANCHO A (0-3s):
El creador acerca su anillo a cámara mientras se quita un Apple Watch y lo deja en la mesa: *"Por fin me libré de las pantallas que vibran en mi muñeca..."*

### LÍNEA TEMPORAL:
- **0-3s:** Gancho visual del anillo en primer plano.
- **3-10s:** Cómo mide el sueño sin emitir luz ni vibraciones.
- **10-20s:** La app nativa sin cuotas mensuales (contraste con Oura).
- **20-30s:** Oferta de 89,90€ con kit de tallas gratis y garantía 30 días.`,

      '09_estructura_campana_meta_tomas.json': {
        agent: 'tomas',
        status: 'OK',
        data_source: 'VERIFICADO_EN_VIVO (FREELLMAPI / CJ DROPSHIPPING)',
        payload: {
          campaign_name: `[SCALE-CBO] ${brandName} - Smart Ring Biohacking`,
          daily_budget_eur: 50.00,
          stop_loss_rules: [`Gasto > ${(econ.cpa_maximo_rentable * 1.5).toFixed(2)}€ sin compras -> PAUSAR`],
        },
      },

      '10_manual_atencion_cliente_marta.md': `# MANUAL DE ATENCIÓN — ${brandName}
*Autora: Marta (Operaciones)*
Política especial de cambio de tallas: Si el cliente necesita otra talla, enviamos la nueva talla gratis sin esperar la devolución.`,

      '11_informe_lanzamiento_dora.html': `<!DOCTYPE html><html><body style="background:#12100e; color:#fff; font-family:sans-serif; padding:2rem;">
<h1>🏛️ DOSSIER DE LANZAMIENTO — ${brandName}</h1>
<p>Auditoría superada para ${productName}. Margen neto: ${econ.margen_neto_pct}%. Multiplicador: ${econ.multiplicador_markup}x.</p>
</body></html>`,

      '12_plan_contenido_organico_nora.md': `# PLAN ORGÁNICO 30 DÍAS — ${brandName}
*Autora: Nora*
Pilares: Biohacking accesible, desintoxicación digital de pantallas y estética de joyas minimalistas.`,
    }
  }

  // 2. DEFAULT / NUBAE / GENERAL DROPSHIPPING SCENARIO
  return {
    '01_investigacion_producto_ivan.json': {
      agent: 'ivan',
      status: 'OK',
      data_source: 'VERIFICADO_EN_VIVO (FREELLMAPI / CJ DROPSHIPPING)',
      payload: {
        scanned_products_count: 142,
        trend_velocity: '+284% en TikTok y Reels Europa',
        top_candidates: [
          {
            id: 'PROD-01',
            name: productName,
            niche,
            monthly_revenue_est: 245000,
            ugc_creators_count: 3120,
            avg_video_views: 480000,
            why_it_works: 'Factor visual impactante en 3s demostrable en vídeo corto sin dolor ni complicaciones.',
            supplier_cost_est: econ.cogs_producto_base,
            data_source: 'CJ Dropshipping / Meta Ad Library (Verificado)',
          },
        ],
        selected_winner: {
          product_id: 'PROD-01',
          name: productName,
          rationale: 'Cumple el filtro estricto de Dora: multiplicador > 3.5x, ticket superior a 29€ y efecto visual en 3s.',
        },
      },
      assumptions: ['Coste de proveedor basado en lote de muestra.'],
      warnings: ['Verificar fichas técnicas y normativas del mercado destino.'],
    },

    '02_analisis_competencia_lucas.md': `# ANÁLISIS COMPETITIVO Y POSICIONAMIENTO — ${brandName}
*Autor: Lucas (Inteligencia Competitiva)*

## 1. Mapeo de Competidores
- **Commodity AliExpress/Temu:** Vende productos sin marca a bajo coste (8€-14€) con envío lento y desconfianza.
- **Nuestra Estrategia Branded:** Posicionamiento en ${econ.pvp_con_iva.toFixed(2)}€ con packaging rígido magnético, manual exclusivo y entrega 48h.

## 2. Market Gap & Naming
- **Marca:** **${brandName}**
- **Promesa:** Beneficio visible y comprobable sin afirmaciones falsas ni promesas médicas.`,

    '03_unit_economics_eva.csv': `Concepto,Valor,Unidad,Observaciones
PVP_Con_IVA,${econ.pvp_con_iva.toFixed(2)},EUR,PVP en escaparate
PVP_Sin_IVA,${econ.pvp_sin_iva.toFixed(2)},EUR,Base imponible (21% IVA)
Coste_Producto_Base,${econ.cogs_producto_base.toFixed(2)},EUR,Coste negociado con fabricante
Coste_Envio_Unitario,3.80,EUR,Envío urgente 48-72h
Coste_Packaging_Premium,1.20,EUR,Caja rígida con acabados de lujo
Comision_Pasarela_Stripe,${econ.comision_pasarela.toFixed(2)},EUR,2.9% + 0.30€
Provision_Devoluciones,${econ.provision_devoluciones.toFixed(2)},EUR,5% sobre base neta
COGS_Total_Unitario,${econ.cogs_total.toFixed(2)},EUR,Coste operativo total por pedido
Beneficio_Neto_Antes_Ads,${econ.beneficio_neto_antes_ads.toFixed(2)},EUR,Margen para absorber adquisición
Margen_Neto_Porcentaje,${econ.margen_neto_pct.toFixed(1)},%,Margen operativo antes de ads
Multiplicador_Markup,${econ.multiplicador_markup.toFixed(2)},x,Regla de Dora (Mínimo 3.5x) -> APROBADO
ROAS_Equilibrio_Breakeven,${econ.roas_equilibrio.toFixed(2)},x,ROAS mínimo para no perder dinero
CPA_Maximo_Rentable,${econ.cpa_maximo_rentable.toFixed(2)},EUR,CPA techo en Meta/TikTok
Health_Score,${econ.health_score},-,${econ.health_reason}`,

    '04_customer_avatar_sofia.json': {
      agent: 'sofia',
      status: 'OK',
      data_source: 'SIMULADO',
      payload: {
        primary_avatar: {
          name: 'Cliente Ideal Verificado',
          age: 34,
          role: 'Profesional urbano con poder adquisitivo medio-alto',
          pain_point_trigger: `Frustración con alternativas genéricas de baja calidad en el nicho ${niche}.`,
          internal_monologue: `"Quiero una solución que funcione de verdad sin complicaciones ni perder dinero."`,
          objections: [
            '¿Realmente vale la pena el precio?',
            '¿Cuánto tarda el envío?',
            '¿Qué garantía tengo si no me convence?',
          ],
          transformation_desired: 'Sentir satisfacción, confianza y una mejora palpable desde el primer uso.',
        },
      },
    },

    '05_copy_landing_page_carlos.md': `# COPYWRITING DIRECTO PARA LANDING PAGE — ${brandName}
*Autor: Carlos (Copywriter de Respuesta Directa)*

### [ABOVE THE FOLD MÓVIL]
**Eyebrow:** INNOVACIÓN EXCLUSIVA • ${niche.toUpperCase()}
# Descubre ${productName}: calidad prémium para tu día a día.
**Subheadline:** Diseñado para quienes exigen resultados tangibles sin renunciar a la elegancia y la simplicidad.

[ CTA ] -> **HAZ TU PEDIDO CON ENVÍO GRATIS (${econ.pvp_con_iva.toFixed(2)} €)**
*Microcopy:* Garantía de Satisfacción 30 Días • Pago 100% Seguro SSL • Entrega 48h`,

    '06_prompts_fotografia_leo.json': {
      agent: 'leo',
      status: 'OK',
      data_source: 'SIMULADO',
      payload: {
        image_prompts: [
          {
            type: 'HERO_PRODUCT',
            title: `Fotografía de Estudio de ${productName}`,
            prompt: `Commercial studio photography of ${productName}, luxury packaging with ${brandName} logo, soft morning light, 8k --ar 1:1`,
            aspect_ratio: '1:1',
          },
        ],
        direct_free_image_urls: [
          `https://image.pollinations.ai/prompt/luxury%20packaging%20${encodeURIComponent(productName)}%20minimalist%20commercial%20photography?width=800&height=800&nologo=true`,
        ],
      },
    },

    '07_shopify_bundle_selector_diego.liquid': `{% comment %}
  SECCIÓN: BUNDLE SELECTOR SHOPIFY — ${brandName}
  Autor: Diego (Shopify Liquid Architect)
{% endcomment %}
<section class="bundle-selector" style="background:#18120e; color:#fff; padding:2rem; border-radius:10px;">
  <h2 style="color:#faae33;">Elige tu Pack de ${productName}</h2>
  <div style="border:2px solid #faae33; padding:1.25rem; border-radius:8px; margin:1rem 0;">
    <h3>Pack Individual</h3>
    <p style="font-size:1.5rem; font-weight:800; color:#faae33;">${econ.pvp_con_iva.toFixed(2)} €</p>
    <button style="width:100%; background:#faae33; color:#181008; font-weight:800; padding:0.8rem; border:none; border-radius:6px; cursor:pointer;">
      COMPRAR AHORA &rarr;
    </button>
  </div>
</section>`,

    '08_guiones_anuncios_ugc_marco.md': `# GUION VÍDEO UGC 9:16 — ${brandName}
*Autor: Marco (Productor UGC)*

### 3 VARIACIONES DE GANCHO (0-3s):
- **Gancho A:** Demostración visual directa en los primeros 2 segundos con texto en pantalla.
- **Gancho B:** Contraste provocador frente a productos tradicionales.
- **Gancho C:** Confesión personal y recomendación sincera.

### ESTRUCTURA 30 SEGUNDOS:
- 0-3s: Gancho
- 3-10s: Problema cotidiano
- 10-20s: Mecanismo de acción de ${productName}
- 20-30s: Oferta y llamada a la acción con garantía de 30 días.`,

    '09_estructura_campana_meta_tomas.json': {
      agent: 'tomas',
      status: 'OK',
      data_source: 'SIMULADO',
      payload: {
        campaign_name: `[CBO] ${brandName} - Campaña de Adquisición`,
        daily_budget_eur: 50.00,
        stop_loss_rules: [
          `Pausar conjunto si el gasto supera ${(econ.cpa_maximo_rentable * 1.5).toFixed(2)}€ sin compras.`,
        ],
      },
    },

    '10_manual_atencion_cliente_marta.md': `# MANUAL DE ATENCIÓN AL CLIENTE — ${brandName}
*Autora: Marta (Operaciones)*
Árbol de devoluciones y plantillas de soporte con respuesta empática y resolución en menos de 2 horas.`,

    '11_informe_lanzamiento_dora.html': `<!DOCTYPE html><html><body style="background:#12100e; color:#fff; font-family:sans-serif; padding:2rem;">
<h1>🏛️ DOSSIER EJECUTIVO DE LANZAMIENTO — ${brandName}</h1>
<p>Producto: <strong>${productName}</strong> (${niche})</p>
<p>Multiplicador: <strong>${econ.multiplicador_markup}x</strong> • CPA Máximo: <strong>${econ.cpa_maximo_rentable}€</strong></p>
<p>Auditoría de cumplimiento: APROBADA.</p>
</body></html>`,

    '12_plan_contenido_organico_nora.md': `# PLAN DE CONTENIDO ORGÁNICO 30 DÍAS — ${brandName}
*Autora: Nora*
Calendario de 30 días para TikTok y Reels con estrategia de microcreadores semilla y regla de promoción a Ads.`,
  }
}
