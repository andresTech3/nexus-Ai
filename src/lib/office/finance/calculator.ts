import { UnitEconomicsInputs, UnitEconomicsResult, BundleTier } from '@/types/office'

/**
 * Deterministic Unit Economics Calculator (Eva - CFO Agent)
 * Implements Section 6.3 of Autonomous Dropshipping Office spec.
 * LLMs do NOT invent numbers; they comment on this deterministic output.
 */
export function calculateUnitEconomics(inputs: UnitEconomicsInputs): UnitEconomicsResult {
  const {
    costo_producto = 4.1,
    costo_envio = 3.8,
    costo_packaging = 1.2,
    pvp = 32.9,
    comision_pct = 0.029,
    comision_fijo = 0.3,
    provision_devoluciones_pct = 0.05,
    iva_pct = 0.21,
    creator_sample_cost = 8.5,
    creator_samples_count = 20,
  } = inputs

  // PVP sin IVA
  const pvp_sin_iva = Number((pvp / (1 + iva_pct)).toFixed(2))

  // Pasarela de pago: calculada sobre PVP final pagado por el cliente
  const comision_pasarela = Number((pvp * comision_pct + comision_fijo).toFixed(2))

  // Provisión de devoluciones estimada sobre ingreso neto de IVA
  const provision_devoluciones = Number((pvp_sin_iva * provision_devoluciones_pct).toFixed(2))

  // COGS Total
  const cogs_total = Number(
    (
      costo_producto +
      costo_envio +
      costo_packaging +
      comision_pasarela +
      provision_devoluciones
    ).toFixed(2)
  )

  // Beneficio neto antes de inversión publicitaria (CAC / CPA)
  const beneficio_neto_antes_ads = Number((pvp_sin_iva - cogs_total).toFixed(2))

  // Margen neto %
  const margen_neto_pct =
    pvp_sin_iva > 0
      ? Number(((beneficio_neto_antes_ads / pvp_sin_iva) * 100).toFixed(1))
      : 0

  // Multiplicador Markup (Regla de Dora: >= 3.5x)
  const multiplicador_markup =
    costo_producto > 0 ? Number((pvp_sin_iva / costo_producto).toFixed(2)) : 0

  // ROAS de equilibrio (Breakeven ROAS): pvp_sin_iva / beneficio_neto_antes_ads
  const roas_equilibrio =
    beneficio_neto_antes_ads > 0
      ? Number((pvp_sin_iva / beneficio_neto_antes_ads).toFixed(2))
      : 99.9

  // CPA Máximo Rentable: igual al beneficio antes de ads
  const cpa_maximo_rentable = Math.max(0, beneficio_neto_antes_ads)

  // Calificación del Semáforo de Salud Financiera
  let health_score: 'RED' | 'YELLOW' | 'GREEN' = 'GREEN'
  let health_reason = 'Márgenes sólidos y multiplicador por encima del umbral de Dora (3.5x).'

  if (multiplicador_markup < 3.0 || margen_neto_pct < 40) {
    health_score = 'RED'
    health_reason =
      'Crítico: Multiplicador < 3.0x o margen < 40%. Insuficiente colchón para absorber costes publicitarios en Meta/TikTok.'
  } else if (multiplicador_markup < 3.5 || margen_neto_pct < 50) {
    health_score = 'YELLOW'
    health_reason =
      'Precaución: Multiplicador entre 3.0x y 3.5x. Rentable pero vulnerable ante fluctuaciones de CPM.'
  }

  // Modelado de Packs (Bundles)
  // Pack 30 días: 1 unidad base
  const bundle_30d: BundleTier = {
    days: 30,
    units: 1,
    pvp_total: pvp,
    discount_pct: 0,
    shipping_cost: costo_envio,
    packaging_cost: costo_packaging,
    cogs_total,
    net_profit_before_ads: beneficio_neto_antes_ads,
    net_margin_pct: margen_neto_pct,
    roas_breakeven: roas_equilibrio,
    max_cpa: cpa_maximo_rentable,
  }

  // Pack 60 días: 2 unidades con 15% de descuento
  const pvp_60d = Number((pvp * 2 * 0.85).toFixed(2))
  const pvp_60d_sin_iva = Number((pvp_60d / (1 + iva_pct)).toFixed(2))
  const comision_60d = Number((pvp_60d * comision_pct + comision_fijo).toFixed(2))
  const dev_60d = Number((pvp_60d_sin_iva * provision_devoluciones_pct).toFixed(2))
  // El envío se prorratea (un solo paquete con ligero sobrepeso +20%)
  const envio_60d = Number((costo_envio * 1.2).toFixed(2))
  const packaging_60d = Number((costo_packaging * 1.5).toFixed(2))
  const prod_60d = costo_producto * 2
  const cogs_60d = Number((prod_60d + envio_60d + packaging_60d + comision_60d + dev_60d).toFixed(2))
  const profit_60d = Number((pvp_60d_sin_iva - cogs_60d).toFixed(2))

  const bundle_60d: BundleTier = {
    days: 60,
    units: 2,
    pvp_total: pvp_60d,
    discount_pct: 15,
    shipping_cost: envio_60d,
    packaging_cost: packaging_60d,
    cogs_total: cogs_60d,
    net_profit_before_ads: profit_60d,
    net_margin_pct: pvp_60d_sin_iva > 0 ? Number(((profit_60d / pvp_60d_sin_iva) * 100).toFixed(1)) : 0,
    roas_breakeven: profit_60d > 0 ? Number((pvp_60d_sin_iva / profit_60d).toFixed(2)) : 99.9,
    max_cpa: Math.max(0, profit_60d),
  }

  // Pack 90 días: 3 unidades ("Compra 2 y Llévate 1 Gratis" o 30% descuento)
  const pvp_90d = Number((pvp * 2.2).toFixed(2)) // ~27% descuento efectivo
  const pvp_90d_sin_iva = Number((pvp_90d / (1 + iva_pct)).toFixed(2))
  const comision_90d = Number((pvp_90d * comision_pct + comision_fijo).toFixed(2))
  const dev_90d = Number((pvp_90d_sin_iva * provision_devoluciones_pct).toFixed(2))
  const envio_90d = Number((costo_envio * 1.35).toFixed(2))
  const packaging_90d = Number((costo_packaging * 1.8).toFixed(2))
  const prod_90d = costo_producto * 3
  const cogs_90d = Number((prod_90d + envio_90d + packaging_90d + comision_90d + dev_90d).toFixed(2))
  const profit_90d = Number((pvp_90d_sin_iva - cogs_90d).toFixed(2))

  const bundle_90d: BundleTier = {
    days: 90,
    units: 3,
    pvp_total: pvp_90d,
    discount_pct: 27,
    shipping_cost: envio_90d,
    packaging_cost: packaging_90d,
    cogs_total: cogs_90d,
    net_profit_before_ads: profit_90d,
    net_margin_pct: pvp_90d_sin_iva > 0 ? Number(((profit_90d / pvp_90d_sin_iva) * 100).toFixed(1)) : 0,
    roas_breakeven: profit_90d > 0 ? Number((pvp_90d_sin_iva / profit_90d).toFixed(2)) : 99.9,
    max_cpa: Math.max(0, profit_90d),
  }

  // Análisis de Sensibilidad
  const sensitivity = {
    cpa_plus_20: {
      profit: Number((beneficio_neto_antes_ads - cpa_maximo_rentable * 0.2).toFixed(2)),
      margin: Number(
        (
          ((beneficio_neto_antes_ads - cpa_maximo_rentable * 0.2) / pvp_sin_iva) *
          100
        ).toFixed(1)
      ),
    },
    cpa_minus_20: {
      profit: Number((beneficio_neto_antes_ads + cpa_maximo_rentable * 0.2).toFixed(2)),
      margin: Number(
        (
          ((beneficio_neto_antes_ads + cpa_maximo_rentable * 0.2) / pvp_sin_iva) *
          100
        ).toFixed(1)
      ),
    },
    pvp_minus_10: {
      multiplier: Number(((pvp_sin_iva * 0.9) / costo_producto).toFixed(2)),
      margin: Number(
        (
          ((pvp_sin_iva * 0.9 - cogs_total) / (pvp_sin_iva * 0.9)) *
          100
        ).toFixed(1)
      ),
    },
  }

  // Escenario Orgánico (Nora)
  const creator_sample_budget = Number((creator_sample_cost * creator_samples_count).toFixed(2))
  const units_to_breakeven_samples =
    beneficio_neto_antes_ads > 0
      ? Math.ceil(creator_sample_budget / beneficio_neto_antes_ads)
      : 999
  const views_needed_at_1pct_cvr = units_to_breakeven_samples * 100 * 50 // 2% click rate, 1% cvr

  return {
    pvp_con_iva: pvp,
    pvp_sin_iva,
    cogs_producto_base: costo_producto,
    comision_pasarela,
    provision_devoluciones,
    cogs_total,
    beneficio_neto_antes_ads,
    margen_neto_pct,
    multiplicador_markup,
    roas_equilibrio,
    cpa_maximo_rentable,
    health_score,
    health_reason,
    bundles: {
      bundle_30d,
      bundle_60d,
      bundle_90d,
    },
    sensitivity,
    organic_scenario: {
      creator_sample_budget,
      units_to_breakeven_samples,
      views_needed_at_1pct_cvr,
    },
  }
}

/**
 * Self-test suite to verify formulas match expected NuBae demo data
 */
export function runUnitEconomicsSelfTest(): boolean {
  const result = calculateUnitEconomics({
    costo_producto: 4.1,
    costo_envio: 3.8,
    costo_packaging: 1.2,
    pvp: 32.9,
    comision_pct: 0.029,
    comision_fijo: 0.3,
    provision_devoluciones_pct: 0.05,
    iva_pct: 0.21,
  })

  const pvp_sin_iva_ok = Math.abs(result.pvp_sin_iva - 27.19) < 0.1
  const comision_ok = Math.abs(result.comision_pasarela - 1.25) < 0.1
  const markup_ok = result.multiplicador_markup >= 6.0 // 27.19 / 4.10 ~= 6.63x

  const allPassed = pvp_sin_iva_ok && comision_ok && markup_ok
  if (!allPassed) {
    console.warn('[Eva SelfTest] Calculator sanity check failed:', { result })
  }
  return allPassed
}
