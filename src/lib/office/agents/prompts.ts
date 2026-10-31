export function buildAgentUserPrompt(
  agentId: string,
  productName: string,
  niche: string,
  brandName: string,
  userRealData?: string,
  previousOutputs?: Record<string, any>
): string {
  const realDataContext = userRealData && userRealData.trim().length > 0
    ? `\n\n--- DATOS REALES APORTADOS POR EL USUARIO (CJ DROPSHIPPING / TIKTOK / COMPETIDOR) ---\n${userRealData}\n--- FIN DATOS REALES ---`
    : ''

  switch (agentId) {
    case 'ivan':
      return `Producto objetivo: "${productName}"
Nicho: "${niche}"${realDataContext}

Tarea: Como Iván (Investigador de Tendencias & Producto), analiza este producto y nicho para branded dropshipping. 
Devuelve un JSON con:
{
  "scanned_products_count": number,
  "trend_velocity": "string con porcentaje y fuente",
  "top_candidates": [
    {
      "id": "PROD-01",
      "name": "${productName}",
      "niche": "${niche}",
      "monthly_revenue_est": number,
      "ugc_creators_count": number,
      "avg_video_views": number,
      "why_it_works": "explicación de mecanismo visual demostrable en 3s",
      "supplier_cost_est": number,
      "data_source": "string"
    }
  ],
  "selected_winner": {
    "product_id": "PROD-01",
    "name": "${productName}",
    "rationale": "por qué cumple margen > 75%, ticket > 29€ y factor visual < 3s"
  }
}
IMPORTANTE: Devuelve exclusivamente el JSON sin texto introductorio ni explicaciones adicionales.`

    case 'lucas':
      return `Producto: "${productName}" | Nicho: "${niche}" | Marca propuesta: "${brandName}"${realDataContext}
Entregable de Iván: ${JSON.stringify(previousOutputs?.['01_investigacion_producto_ivan.json'] || {}).substring(0, 400)}

Tarea: Como Lucas (Posicionamiento & Inteligencia Competitiva), redacta en Markdown profesional:
1. Análisis de competidores genéricos (AliExpress / Temu) vs nuestra propuesta Branded.
2. El "Market Gap" detectado: por qué un PVP entre 29€ y 34€ es el punto dulce.
3. Propuesta de Naming y territorio de marca.
4. Promesa de marca sin afirmaciones médicas prohibidas.
5. Experiencia de unboxing y packaging de alto valor percibido (estuche magnético, regalo, tarjeta de bienvenida).`

    case 'eva':
      return `Producto: "${productName}" | Marca: "${brandName}"
Cálculos deterministas ya ejecutados: ${JSON.stringify(previousOutputs?.['unit_economics_raw'] || {}).substring(0, 500)}

Tarea: Como Eva (CFO), redacta una breve nota ejecutiva financiera comentando:
1. Margen neto y multiplicador sobre coste.
2. ROAS de equilibrio y CPA techo para Meta/TikTok Ads.
3. Justificación de los 3 packs (30, 60 y 90 días).`

    case 'sofia':
      return `Producto: "${productName}" | Nicho: "${niche}" | Marca: "${brandName}"${realDataContext}

Tarea: Como Sofía (Psicología del Comprador), genera un JSON con el perfil psicológico profundo del cliente ideal:
{
  "primary_avatar": {
    "name": "Nombre completo ficticio",
    "age": number,
    "role": "Profesión y contexto vital",
    "pain_point_trigger": "Momento exacto del día donde experimenta la frustración",
    "internal_monologue": "Lo que se dice a sí mismo en silencio sin filtros",
    "objections": ["Objeción 1", "Objeción 2", "Objeción 3", "Objeción 4", "Objeción 5"],
    "transformation_desired": "Estado emocional deseado tras usar el producto"
  }
}
Solo devuelve el JSON sin comentarios.`

    case 'carlos':
      return `Producto: "${productName}" | Marca: "${brandName}"
Avatar de Sofía: ${JSON.stringify(previousOutputs?.['04_customer_avatar_sofia.json'] || {}).substring(0, 400)}

Tarea: Como Carlos (Copywriter de Respuesta Directa), redacta en Markdown:
1. ABOVE THE FOLD móvil: Eyebrow, H1 impactante, Subheadline con mecanismo único, Botón CTA y microcopy de garantía.
2. Tabla comparativa: "${brandName}" vs "Opciones Baratas" vs "Tratamientos Costosos".
3. Copy para los 3 niveles de oferta (Pack 30d, Pack 60d Más Vendido, Pack 90d Máximo Ahorro).
4. Checklist de Claims Compliance: lista de 3 frases prohibidas y cómo las reformulaste para cumplir la normativa publicitaria.`

    case 'leo':
      return `Producto: "${productName}" | Nicho: "${niche}" | Marca: "${brandName}"

Tarea: Como Leo (Director de Arte & Fotografía IA), genera un JSON con 4 prompts fotográficos hiperrealistas para FLUX / SDXL y renderizadores comerciales (1:1 y 9:16):
- Foto 1: HERO_PRODUCT (estudio sobre piedra o mármol)
- Foto 2: MACRO_TEXTURE (detalle extremo de la textura o mecanismo)
- Foto 3: LIFESTYLE (persona usando el producto en ambiente prémium)
- Foto 4: STATIC_AD (pantalla dividida para anuncio de Meta)
Devuelve JSON con array "image_prompts" (type, title, prompt, aspect_ratio).`

    case 'diego':
      return `Producto: "${productName}" | Marca: "${brandName}"
Precios aprobados: Pack 1 (32.90€), Pack 2 (55.90€), Pack 3 (72.40€).

Tarea: Como Diego (Shopify Liquid Architect), redacta el código Liquid puro con CSS y Vanilla JS para la sección de selector de packs (bundle selector) compatible con el tema Dawn de Shopify OS 2.0. Incluye salto a checkout y acordeón con ficha técnica/ingredientes.`

    case 'marco':
      return `Producto: "${productName}" | Marca: "${brandName}"
Copy de Carlos: ${JSON.stringify(previousOutputs?.['05_copy_landing_page_carlos.md'] || '').substring(0, 400)}

Tarea: Como Marco (Productor UGC & Vídeo Ads), redacta en Markdown:
1. 3 VARIANTES DE GANCHO (0-3 segundos): Gancho A (demostración visual), Gancho B (contraste provocador), Gancho C (confesión íntima).
2. LÍNEA TEMPORAL DE 30 SEGUNDOS: tabla con columnas Tiempo, Lo que se VE, Lo que se OYE y Texto en Pantalla.
3. BRIEF TÉCNICO para creadoras UGC reales (iluminación, tono de voz y restricciones de compliance legal).`

    case 'tomas':
      return `Producto: "${productName}" | Marca: "${brandName}"

Tarea: Como Tomás (Media Buyer Meta Ads), diseña en JSON el blueprint de campaña Advantage Campaign Budget (CBO):
{
  "campaign_name": "nombre de campaña",
  "daily_budget_eur": 50,
  "adsets": [
    { "name": "Broad Abierto", "budget_share": "50%" },
    { "name": "Intereses de Nicho", "budget_share": "30%" },
    { "name": "Retargeting", "budget_share": "20%" }
  ],
  "stop_loss_rules": [
    "Regla 1: pausar si el gasto supera 1.5x el CPA máximo sin compras",
    "Regla 2: alerta de ROAS < 1.45"
  ]
}
Solo devuelve el JSON.`

    case 'marta':
      return `Producto: "${productName}" | Marca: "${brandName}"

Tarea: Como Marta (Atención al Cliente & Logística), redacta en Markdown:
1. Árbol de decisiones para solicitudes de devolución bajo garantía de 30 días.
2. 2 Plantillas de respuesta empática por WhatsApp o Email (retraso en transporte, duda de uso/seguridad).
3. Protocolo anti-contracargos y mitigación de disputas bancarias.`

    case 'nora':
      return `Producto: "${productName}" | Nicho: "${niche}" | Marca: "${brandName}"

Tarea: Como Nora (Estratega de Contenido Orgánico), redacta en Markdown:
1. 3 Pilares de contenido viral para TikTok, Reels y Shorts.
2. Plan de creadores semilla (Seed Gifting) con mensaje de contacto no invasivo.
3. Regla matemática de promoción de vídeo orgánico ganador a anuncio de pago con Tomás.`

    case 'dora':
    default:
      return `Producto: "${productName}" | Marca: "${brandName}"

Tarea: Como Dora (CEO), redacta el Dossier Ejecutivo Final de Lanzamiento en formato HTML/Markdown consolidando la auditoría de calidad de los 11 agentes, la viabilidad económica y la hoja de ruta de los próximos pasos para el operador humano.`
  }
}
