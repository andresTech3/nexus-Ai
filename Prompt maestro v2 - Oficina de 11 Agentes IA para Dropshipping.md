# Prompt maestro v2: Oficina de 11 Agentes IA para Branded Dropshipping

Cómo usarlo: copia todo lo que hay entre «INICIO DEL PROMPT» y «FIN DEL PROMPT» y pégalo en Claude (idealmente en Claude Code, o en un chat nuevo con Artifacts). Al final del documento tienes la lista de lo que debes conectar y las correcciones que hice a tu versión original.

---

## INICIO DEL PROMPT

# 0. ROL Y OBJETIVO

Actúa como Arquitecto de Software Principal, Ingeniero de Sistemas Multi-Agente y Diseñador de Interfaces en tiempo real. Construye "AUTONOMOUS DROPSHIPPING OFFICE": una aplicación web de una sola página (SPA) donde el usuario VE una oficina virtual viva con una CEO y 10 empleados de IA trabajando en cadena para lanzar una marca de branded dropshipping (demo: parches de microcristales "NuBae"). Cada empleado tiene habilidades, herramientas y conexiones propias, visibles y verificables en la interfaz. Nada pasa a producción sin aprobación humana.

Restricción económica: TODO debe funcionar con herramientas gratuitas, open source o con cuotas gratuitas que se renuevan cada día. Cero suscripciones obligatorias. Sin API key la app debe funcionar igualmente en modo simulación.

# 1. PRINCIPIOS NO NEGOCIABLES

1. Código completo y ejecutable. Sin "TODO", sin placeholders, sin "aquí iría el resto". Si algo no cabe en una respuesta, entrégalo por fases (sección 11) pero cada fase debe correr sola.
2. Cálculos deterministas en código, nunca inventados por el LLM. Márgenes, ROAS, CPA y packs los calcula una función JavaScript pura; el LLM solo redacta la interpretación.
3. Todo dato simulado se etiqueta visiblemente como "SIMULADO". Está prohibido presentar cifras de ventas, creadores o reseñas inventadas como si fueran reales.
4. Humano en el circuito: 4 checkpoints obligatorios. Nada se publica, gasta dinero ni se envía a terceros automáticamente.
5. Cumplimiento: ningún texto, guion ni anuncio puede prometer resultados médicos, "sin agujas", "elimina arrugas" ni afirmaciones de salud no demostrables; no se inventan testimonios, reseñas ni "before/after" falsos. Dora rechaza cualquier entrega que incumpla esto (ver sección 9).
6. Degradación elegante: si un proveedor falla o se agota la cuota, el sistema cambia al siguiente sin romper el flujo y lo muestra en pantalla.
7. Las API keys viven solo en el navegador del usuario (IndexedDB), nunca en el código, nunca en logs, nunca se exportan en los ZIP.

# 2. ARQUITECTURA Y STACK

- Frontend: HTML5 + Tailwind CSS (CDN) + JavaScript modular ES Modules, sin build step. Un solo `index.html` más módulos en `/src`, o un único archivo si se publica como artifact.
- Oficina en tiempo real: Canvas 2D con estilo pixel-art/isométrico simple (no 3D pesado). Opcional: Three.js solo si el usuario lo pide.
- Bus de eventos interno (`EventBus`) con eventos tipados: `agent:status`, `agent:log`, `agent:handoff`, `agent:deliverable`, `checkpoint:open`, `checkpoint:resolved`, `quota:update`, `provider:fallback`.
- Estado global en un store único (patrón reducer) persistido en IndexedDB: oficinas (cada una con su producto, marca, ejecuciones y entregables), cuotas globales, configuración.
- Validación: cada salida de agente se valida contra su JSON Schema (validador propio ligero). Si falla, un reintento con el error como feedback; si falla de nuevo, Dora pausa y pide intervención.
- Exportación: JSZip (cdnjs) para descargar todos los archivos de la marca en un ZIP.
- Estructura sugerida:
  - `src/core/` (eventBus, store, scheduler, schemaValidator, quotaManager, officeManager)
  - `src/providers/` (llm/gemini, llm/groq, llm/openrouter, llm/ollama, llm/mock, image/pollinations, image/huggingface)
  - `src/agents/` (un archivo por agente: prompt, skills, tools, schema, función `run()`)
  - `src/finance/` (calculadora determinista de unit economics)
  - `src/ui/` (office canvas, agent panel, checkpoint modal, deliverable explorer, settings)
  - `src/data/` (datos mock realistas para modo simulación)

# 3. LA OFICINA EN TIEMPO REAL (EL CORAZÓN VISUAL)

Diseña un plano de oficina en Canvas con 5 zonas: Dirección (Dora), Producto (Iván, Lucas, Eva), Marketing (Sofía, Carlos, Marco), Ecommerce (Leo, Diego, Tomás) y Operaciones (Marta). Cada empleado es un sprite con escritorio, pantalla y nombre.

Comportamiento visual obligatorio:

- Estados con animación y color: En espera (gris, sprite quieto), Analizando (azul pulsante, teclea), Generando (amarillo, pantalla con barra de progreso), Requiere tu aprobación (rojo/naranja parpadeante con icono de alerta), Finalizado (verde con check), Error/Cuota agotada (rojo fijo con icono de enchufe).
- Globos de diálogo en vivo: cada log del agente aparece como burbuja sobre su cabeza durante 4 segundos y se acumula en un feed lateral con hora.
- Traspasos animados: cuando un agente termina, un sobre/documento animado viaja por la oficina hasta el siguiente agente (evento `agent:handoff`), y la línea de conexión entre ambos se ilumina.
- Dora camina o gira hacia el agente cuya entrega está revisando; si detecta discrepancias, aparece un globo rojo con el motivo.
- Controles: reproducir/pausar, velocidad 1x/2x/5x (los tiempos simulados se acortan, las llamadas reales a API no), y modo "cámara" que enfoca al agente activo.
- Clic en un empleado abre su Ficha lateral con: foto/avatar, cargo, habilidades (chips), herramientas y conexiones (con semáforo verde/amarillo/rojo según estén configuradas), proveedor LLM que está usando ahora, tokens y peticiones consumidas hoy, últimos 20 logs, y su último entregable.
- Panel superior: nombre de la plataforma, selector de flujo, estado global (EN EJECUCIÓN / PAUSADO POR CHECKPOINT), cuota de cada proveedor y cuenta atrás hasta la recarga diaria.
- Accesible y responsive: la oficina se adapta a móvil (zoom por zonas) y los estados no dependen solo del color (también icono y texto).

# 3 BIS. MULTI-OFICINA: VARIAS OFICINAS INDEPENDIENTES

El usuario puede crear tantas oficinas como quiera. Cada oficina es una instancia aislada con los mismos 11 empleados, pero con su propio producto, marca, estado, entregables y checkpoints. Cada oficina se puede encender, apagar, cambiar de producto, duplicar, archivar o eliminar sin afectar a las demás.

## Modelo de datos de una oficina

```json
{
  "id": "off_01",
  "name": "Oficina NuBae",
  "status": "ON | OFF | PAUSED_CHECKPOINT | WAITING_QUOTA | ERROR | ARCHIVED",
  "product": { "name": "string", "niche": "string", "source": "USER_PROVIDED | IVAN_SELECTED | DEMO" },
  "brand": { "name": "string", "style": "string" },
  "workflow": "LAUNCH | MORNING",
  "currentStep": "string",
  "agentStates": { "dora": "IDLE", "ivan": "DONE" },
  "deliverables": {},
  "checkpointHistory": [],
  "settings": { "market": "ES", "currency": "EUR", "speed": 1, "priority": "NORMAL", "agentOverrides": {} },
  "productHistory": [],
  "createdAt": "ISO8601",
  "updatedAt": "ISO8601"
}
```

Los empleados son plantillas globales (prompts, habilidades, herramientas, esquemas): se definen una sola vez y las oficinas solo guardan su estado y sus entregables. Opcionalmente, una oficina puede sobrescribir el prompt de un empleado concreto con `agentOverrides`.

## Acciones por oficina

| Acción | Qué hace | Confirmación |
| --- | --- | --- |
| Crear | Nombre, producto o nicho (opcional: lo puede proponer Iván), mercado y plantilla de partida: vacía, demo NuBae o copia de otra oficina | No |
| Encender | Activa el scheduler de esa oficina y reanuda desde el último paso guardado. Nunca salta un checkpoint pendiente | No |
| Apagar | Cancela de forma segura la llamada en curso, marca ese paso como pendiente, guarda el estado y deja de consumir cuota. Visualmente: luces apagadas, empleados dormidos (zzz), tarjeta en gris | No |
| Cambiar producto | Modal con 2 modos: (a) regenerar todo desde cero, (b) conservar marca y estilo y regenerar desde el Checkpoint 1. Antes de aplicar, muestra qué entregables se reemplazan y guarda un snapshot en `productHistory` con botón "Deshacer cambio de producto" | Sí |
| Renombrar | Cambia solo el nombre visible | No |
| Duplicar | Copia producto y entregables como borrador en una oficina nueva y apagada | No |
| Archivar | Oculta la oficina y la apaga; recuperable desde "Archivadas" | No |
| Eliminar | Borra solo los datos de esa oficina. Pide escribir su nombre para confirmar y la mueve a una papelera recuperable 7 días | Sí, escribiendo el nombre |
| Exportar/Importar | Descarga o carga una oficina completa como ZIP/JSON (sin API keys) | No |

Acciones globales: "Encender todas", "Apagar todas" y un límite configurable de oficinas encendidas a la vez (por defecto 2) para proteger la cuota gratuita.

## Aislamiento

- Datos en IndexedDB con espacio de nombres `office:{id}:*`. Eliminar una oficina nunca toca las demás ni las API keys.
- Todos los eventos del bus llevan `officeId` (`agent:status`, `agent:log`, `agent:handoff`, `checkpoint:open`, etc.).
- Cada oficina tiene su propia cola de tareas y su propio scheduler. Un error en una oficina no detiene a las otras.

## Cuotas compartidas entre oficinas

Los proveedores gratuitos (Gemini, Groq, OpenRouter) tienen una cuota única por cuenta, así que el gestor de cuotas es global y reparte turnos entre las oficinas encendidas:

- Reparto por turnos (round-robin) con prioridad por oficina: Alta, Normal o Baja, y porcentaje máximo de cuota opcional.
- Si se agota la cuota, las oficinas pasan a `WAITING_QUOTA` (icono de enchufe) y reanudan solas tras la recarga diaria o al cambiar de proveedor.
- La pantalla "Presupuesto del día" muestra el consumo por oficina y cuántas ejecuciones completas caben todavía.
- La caché de respuestas es compartida: si dos oficinas hacen la misma petición idéntica, no se gasta cuota dos veces.

## Interfaz multi-oficina

1. Panel "Mis oficinas" (barra lateral o pestaña superior): una tarjeta por oficina con nombre, producto, interruptor ON/OFF, estado, paso actual, 11 puntos de color con el estado de cada empleado, consumo de cuota de hoy, alerta si hay un checkpoint pendiente y menú ⋮ con todas las acciones de la tabla.
2. Vista "Todas las oficinas": mosaico de mini-oficinas animadas en miniatura. Las apagadas se ven en gris. Una bandeja unificada muestra todos los checkpoints pendientes ("3 oficinas esperan tu aprobación") y permite abrirlos directamente.
3. Al elegir una oficina se abre su vista completa (sección 3) con sus propias pestañas de entrega activa, archivos, conexiones e historial.
4. Aviso en el título de la pestaña del navegador y badge cuando una oficina requiere aprobación.
5. Al recargar la página se restaura qué oficinas estaban encendidas, pero por defecto se pide confirmación antes de reanudarlas para no gastar cuota sin querer (opción configurable).
6. Dora avisa si dos oficinas tienen el mismo producto o nombres de marca demasiado parecidos.

## Reglas de seguridad

- Encender una oficina nunca aprueba ni salta un checkpoint.
- Cambiar de producto o eliminar siempre requiere confirmación explícita y deja una vía de recuperación.
- Cada oficina pasa por los mismos controles de cumplimiento de Dora (sección 9) con su propio producto.

# 3 TER. MODO DE TRÁFICO: ADS, ORGÁNICO O HÍBRIDO

Cada oficina elige cómo consigue clientes. Se añade al modelo de datos de la oficina el campo `settings.trafficMode` con tres valores posibles: `ADS`, `ORGANIC` o `HYBRID`. El puesto de adquisición lo ocupa uno u otro empleado, o ambos, y el flujo se adapta solo.

## Los tres modos

| Modo | Empleados activos en adquisición | Qué produce Marco (guiones) | Checkpoint 4 | Archivos extra |
| --- | --- | --- | --- | --- |
| ADS | Tomás (media buyer) | Guiones de anuncio 9:16 con oferta y CTA | `CP_ADS_DEPLOY` (Tomás + Dora): presupuesto y blueprint de campaña | `09_estructura_campana_meta_tomas.json` |
| ORGÁNICO | Nora (contenido orgánico) | Guiones nativos sin tono de anuncio y brief para creadores | `CP_ORGANIC_PLAN` (Nora + Dora): calendario de 30 días y política de muestras | `12_plan_contenido_organico_nora.md` |
| HÍBRIDO | Tomás y Nora a la vez, coordinados por Dora | Cada guion en dos versiones: orgánica y anuncio | `CP_TRAFFIC_PLAN` (Tomás + Nora + Dora): plan unificado de orgánico y ads | Ambos archivos y un calendario unificado |

## Puestos activos y vacantes

- En la oficina, el empleado que no participa en el modo elegido muestra su escritorio vacío con el cartel "Puesto libre" (gris, sin consumir cuota).
- Se puede "activar el puesto" con un clic para pasar de ADS a HÍBRIDO, o de ORGÁNICO a HÍBRIDO, y desactivarlo para volver atrás. Cambiar de modo en una oficina ya avanzada solo genera los entregables que falten desde el Checkpoint 3 y conserva el resto, previa confirmación.
- El selector de modo aparece al crear la oficina y en el menú ⋮ de cada oficina. En el panel "Mis oficinas" cada tarjeta muestra una insignia ADS, ORGÁNICO o HÍBRIDO.

## Reglas del modo híbrido (coordina Dora)

1. Marco y Nora comparten ganchos y activos de Leo para mantener un mensaje coherente.
2. Semanas 1 y 2: Nora publica en orgánico para probar ganchos y Tomás arranca con un presupuesto bajo y editable.
3. Regla de promoción: un contenido orgánico que supere umbrales editables (por ejemplo, guardados, compartidos y clics al enlace por cada 1.000 vistas) pasa a Tomás como candidato para anuncio. Los umbrales los define el usuario o Dora los propone como supuestos.
4. Dora detecta contradicciones entre ambos canales (precio, oferta, promesa) antes del checkpoint.

## Cambios en Eva según el modo

- ADS: calcula CPA máximo y ROAS de equilibrio, como en el agente 4.
- ORGÁNICO: no hay gasto en anuncios, así que Eva calcula el costo de las muestras enviadas a creadores, las ventas mensuales necesarias para cubrir ese costo y un escenario conservador de conversión sobre vistas, con todos los valores editables y marcados como supuestos.
- HÍBRIDO: calcula ambos y un resultado combinado.

## Presupuesto de cuota

El modo HÍBRIDO usa un empleado más, así que gasta más cuota por ejecución. La pantalla "Presupuesto del día" muestra el costo de cada modo antes de ejecutar.

# 4. LOS 11 AGENTES: HABILIDADES, HERRAMIENTAS Y CONEXIONES

Cada agente se define con: `id`, `name`, `role`, `department`, `systemPrompt`, `skills[]`, `tools[]`, `connections[]`, `inputs`, `outputSchema`, `qualityGates[]`. Todos devuelven JSON válido dentro de un sobre común:

```json
{ "agent": "string", "status": "OK|NEEDS_REVIEW|BLOCKED", "data_source": "REAL|SIMULATED|USER_PROVIDED", "payload": {}, "assumptions": ["string"], "warnings": ["string"] }
```

**AGENTE 1: DORA, CEO y Orquestadora**

- Habilidades: planificación de pipeline, revisión cruzada de consistencia (nombre de marca, precios, promesas), detección de cuellos de botella, control de cumplimiento, redacción de resúmenes ejecutivos.
- Herramientas/conexiones: scheduler interno, validador de esquemas, gestor de cuotas, cola de tareas. No necesita API externa.
- Quality gates: multiplicador de PVP sobre costo de producto >= 3.5x; ficha de ingredientes presente; gancho visual de 3 segundos; cero afirmaciones médicas; coherencia de precio entre Lucas, Eva, Carlos y Diego.
- System prompt: "Eres Dora, CEO y supervisora del pipeline. Garantizas que ninguna marca salga sin cumplir estándares de branded dropshipping y de cumplimiento publicitario. Si una entrega omite ingredientes, margen mínimo, gancho visual o contiene promesas no demostrables, pausas el flujo y pides corrección concreta. Eres estricta, ejecutiva y metódica."
- Salida: `workflow_status` (PAUSED\_FOR\_HUMAN\_REVIEW | PROCESSING | APPROVED), `checkpoint_id` (CP\_PRODUCT\_SELECTION | CP\_STORE\_DESIGN | CP\_CREATIVES | CP\_ADS\_DEPLOY), `current_agent`, `executive_summary`, `discrepancies_found[]`, `next_action_required`.

**AGENTE 2: IVÁN, Investigador de tendencias y producto**

- Habilidades: minería de nichos de alto valor percibido (skincare, joyería en acero/titanio, bienestar), puntuación de productos, detección de formato demostrable en 3 segundos, estimación de saturación.
- Herramientas/conexiones gratuitas: TikTok Creative Center (Top Ads y Trend Discovery, gratuito con navegador), Google Trends (gratuito), Meta Ad Library (gratuita), catálogo de CJ Dropshipping (cuenta gratuita), importación manual de CSV/pegado desde el usuario, dataset mock. IMPORTANTE: Kalodata es de pago; no se integra. En su lugar, la UI ofrece un cuadro "pega aquí tus datos de tendencia" y Iván los analiza. No hacer scraping de sitios que lo prohíban.
- Filtros: ventas estimadas del nicho > 150.000 USD/mes, > 1.000 creadores UGC, demostrable en 3 s. Descarta productos genéricos o electrónica barata.
- Salida: `scanned_products_count`, `top_candidates[]` (id, name, niche, monthly\_revenue\_est, ugc\_creators\_count, avg\_video\_views, why\_it\_works, supplier\_cost\_est, data\_source), `selected_winner`.

**AGENTE 3: LUCAS, Inteligencia competitiva y posicionamiento**

- Habilidades: análisis de huecos de mercado, arquitectura de oferta, naming de marca, estrategia de packaging y unboxing, política de precios.
- Herramientas/conexiones: Meta Ad Library (consulta manual o pegado del usuario), búsqueda web gratuita opcional, mock.
- Regla: nunca competir por precio con el genérico (\~14 USD); ticket individual en 29-34 USD; bundles de alto valor.
- Salida: `competitors_analyzed[]` (name, price, angle), `market_gap`, `brand_name_proposal`, `brand_promise` (sin promesas médicas), `packaging_and_unboxing`.

**AGENTE 4: EVA, CFO y modelado financiero**

- Habilidades: unit economics, modelado de packs, ROAS de equilibrio, CPA máximo, análisis de sensibilidad.
- Herramientas: módulo `src/finance/calculator.js` (determinista). Eva NO calcula con el LLM; llama a la función y el LLM solo comenta el resultado.
- Fórmulas implementadas en código (ver sección 6.3).
- Salida: `unit_breakdown_single`, `bundle_modeling` (30/60/90 días), `target_blended_aov`, `max_profitable_cpa`, `breakeven_roas`, `financial_health_score` (RED | YELLOW | GREEN), `sensitivity` (qué pasa si el CPA sube 20%).

**AGENTE 5: SOFÍA, Cliente ideal y psicología de compra**

- Habilidades: avatares, mapas de objeciones, momentos de compra, lenguaje del cliente.
- Herramientas/conexiones: investigación pegada por el usuario (comentarios, reseñas reales), mock.
- Salida: `primary_avatar` (name, age, context, pain\_point\_trigger, internal\_monologue, objections\[\], transformation\_desired) y `secondary_avatar`.

**AGENTE 6: CARLOS, Copywriter de respuesta directa**

- Habilidades: copy móvil conciso, tablas comparativas, ofertas por niveles, microcopy de checkout, cumplimiento de claims.
- Salida: `above_the_fold` (eyebrow, h1, subheadline, cta\_button), `comparison_table`, `bundle_offers_copy[]`, `faq_copy[]`, `claims_check` (lista de frases revisadas y su estado: OK / SUAVIZAR / PROHIBIDO).

**AGENTE 7: LEO, Director de arte y fotografía con IA**

- Habilidades: dirección de arte, prompts fotográficos hiperrealistas, consistencia de marca.
- Herramientas/conexiones gratuitas: Pollinations.ai (endpoint de imagen sin registro; verificar disponibilidad y límites al implementarlo), Hugging Face Inference gratuito con token (FLUX.1-schnell / SDXL, sujeto a cuota), fallback a placeholders SVG generados localmente.
- Entregables: foto hero del producto, macro de textura, escena de ritual nocturno, 3 variantes de ad estático. Las imágenes se muestran como galería con botón de descarga y se marcan "GENERADA CON IA".
- Salida: `image_prompts[]` (type, prompt, aspect\_ratio), `direct_free_image_urls[]` construidas con `encodeURIComponent`.

**AGENTE 8: DIEGO, Arquitecto Shopify Liquid**

- Habilidades: Liquid, CSS responsive mobile-first, JS vanilla, accesibilidad, rendimiento.
- Herramientas/conexiones: generación de archivos de tema (compatible con Dawn); validación sintáctica básica; vista previa en un mockup de teléfono dentro de la app. No publica en Shopify: entrega el código para pegar en el editor de temas (Shopify ofrece prueba gratuita limitada, no depender de ella).
- Entregables: `sections/bundle-selector.liquid` (selector de packs con subtotal dinámico y salto al checkout con la variante elegida), acordeón de "Ingredientes y Formulación" (obligatorio), sección de FAQ.
- Salida: `file_name`, `liquid_code`, `css_code`, `js_logic`, `install_steps[]`.

**AGENTE 9: MARCO, Productor de UGC y video ads 9:16**

- Habilidades: guionización por segundos, ganchos, dirección de arte para creadores, briefs para creadores reales.
- Herramientas/conexiones: ninguna externa obligatoria. Genera guiones y briefs para que un creador real grabe; opcionalmente CapCut gratuito para montaje (manual).
- Estructura de 30 s: 0-3 s hook; 3-10 s problema; 10-20 s mecanismo; 20-30 s prueba real + oferta + CTA. Tres variaciones de hook por guion. Prohibido simular testimonios de clientes inexistentes.
- Salida: `ad_id`, `hook_variations[]`, `full_script_timeline[]` (time, visual, audio), `creator_brief`, `claims_check`.

**AGENTE 10: TOMÁS, Media buyer**

- Habilidades: arquitectura de campañas CBO/ABO, reglas de stop-loss, plan de escalado, lectura de métricas.
- Herramientas/conexiones: ninguna API de pago. Entrega un blueprint para crear a mano en Meta Ads Manager y una plantilla de seguimiento. NUNCA lanza campañas ni toca presupuestos solos.
- Salida: `campaign_name`, `daily_budget`, `objective`, `adsets[]`, `stop_loss_rules[]` (condición/acción, coherentes con el CPA máximo de Eva), `tracking_checklist` (píxel, evento de compra, dominio verificado).

**AGENTE 11: MARTA, Atención al cliente y operaciones**

- Habilidades: FAQs, árboles de decisión de devoluciones, plantillas de respuesta, políticas de envío y garantía.
- Herramientas/conexiones: base de conocimiento generada por el sistema; correo/chat real fuera del alcance (se exporta el manual).
- Salida: `faq_matrix[]`, `returns_decision_tree`, `response_templates[]`, `escalation_policy`.

**AGENTE 12 (OPCIONAL): NORA, Estratega de contenido orgánico y comunidad**

- Habilidades: calendario de contenido de 30 días, ganchos nativos para TikTok, Instagram Reels, YouTube Shorts y Pinterest, SEO de plataformas, reutilización de UGC real, plan de creadores semilla (micro-creadores a los que se envían muestras), análisis de qué contenido orgánico merece pasar a anuncio.
- Herramientas y conexiones gratuitas: TikTok Creative Center, Google Trends, investigación de palabras clave y hashtags (manual o pegada por el usuario), exportación del calendario a CSV, y programadores con plan gratuito para que el usuario publique (verificar los límites vigentes). Nora no publica nada por sí sola.
- Reglas: sin cuentas falsas, sin seguidores ni comentarios comprados, sin reseñas inventadas; las colaboraciones con creadores se etiquetan como publicidad o colaboración según la normativa; las afirmaciones de producto pasan por el mismo control de Dora.
- Salida: `content_pillars[]`, `calendar_30d[]` (día, plataforma, formato, gancho, esquema del guion, CTA, activo necesario), `seed_creator_plan` (criterios, mensaje de contacto, política de muestras), `keyword_map[]`, `organic_kpis` (vistas, guardados, compartidos, visitas al perfil, clics al enlace), `winner_promotion_rule` (umbral para pasar un contenido a Tomás en modo híbrido) y `claims_check`.

# 5. ORQUESTACIÓN Y CHECKPOINTS

Flujo "Lanzar Marca Completa" (DAG):

1. Dora abre la ejecución y fija objetivos.
2. Iván (producto) con Lucas (competencia) en paralelo; luego Eva (finanzas).
3. Dora consolida: **CHECKPOINT 1, Selección y validación de producto** (Iván + Lucas + Eva).
4. Sofía; luego Carlos y Diego en paralelo.
5. Dora consolida: **CHECKPOINT 2, Arquitectura de tienda y Liquid** (Sofía + Carlos + Diego).
6. Leo y Marco en paralelo.
7. Dora consolida: **CHECKPOINT 3, Creativos y guiones UGC** (Leo + Marco).
8. el agente de tráfico según el modo (Tomás en ADS, Nora en ORGÁNICO, ambos en HÍBRIDO) y Marta en paralelo.
9. Dora consolida: **CHECKPOINT 4, Activación y presupuesto de campaña** (Tomás + Dora).
10. Dora genera el informe final de lanzamiento.

Flujo "Rutina de Mañana (1h)": Dora revisa tareas pendientes, Eva recalcula métricas con los datos que el usuario pegue (gasto, ventas), Tomás aplica las reglas de stop-loss y recomienda acciones, Marta revisa tickets/FAQs pegados, Iván propone 3 productos nuevos a vigilar. Todo con salida resumida de 1 pantalla.

Modal de checkpoint (bloqueante): muestra entregables renderizados, discrepancias detectadas por Dora, y 3 acciones: \[APROBAR Y CONTINUAR\] | \[APROBAR CON CAMBIOS\] (campo de texto con instrucciones que se inyectan al siguiente agente) | \[RECHAZAR Y REGENERAR\] (con motivo). Cada decisión se registra con fecha y se guarda en el historial.

Reglas del scheduler: reintento con backoff (máx. 2), timeout por agente de 60 s, cancelación segura, reanudar desde el último checkpoint tras recargar la página.

# 6. CONECTORES GRATUITOS Y GESTOR DE CUOTAS

## 6.1 Capa LLM con router y fallback automático

Implementa una interfaz única `LLMProvider.chat({system, messages, jsonSchema})` y estos adaptadores. Los nombres de modelo NO van fijos en el código: viven en un archivo de configuración editable en la UI, porque los catálogos gratuitos cambian con frecuencia (verifica los modelos vigentes al configurar).

1. Google Gemini (Google AI Studio, nivel gratuito, solo modelos Flash/Flash-Lite; los modelos Pro y los de imagen/video pueden no estar incluidos). Los límites exactos se consultan en el panel de AI Studio. Aviso en UI: en el nivel gratuito Google puede usar los datos enviados para mejorar sus productos; no pegar datos sensibles.
2. Groq Cloud (nivel gratuito, API compatible con OpenAI, `https://api.groq.com/openai/v1`), con un modelo Llama de la lista vigente.
3. OpenRouter (filtrar modelos con sufijo `:free`; la disponibilidad rota).
4. Ollama local (`http://localhost:11434/v1`), modelos como Qwen o Llama que quepan en el equipo del usuario. Opción 100% offline y sin límites. Documentar CORS: `OLLAMA_ORIGINS=*`.
5. Mock integrado: generador heurístico con datos de muestra coherentes para todos los esquemas; se activa solo si no hay ninguna key o todos los proveedores fallan.

Orden por defecto del router: Ollama (si responde) > Gemini > Groq > OpenRouter > Mock, configurable por arrastre en Ajustes. Asignación por agente: tareas de razonamiento largo (Dora, Eva-comentario, Lucas) al modelo más capaz disponible; tareas cortas y repetitivas (Marta, Carlos-variantes) a los modelos ligeros para ahorrar cuota.

## 6.2 Gestor de cuotas con recarga diaria

- Contador local por proveedor: peticiones y tokens estimados consumidos hoy, límites configurables por el usuario (valores por defecto conservadores, editables).
- Lectura de cabeceras de rate limit cuando existan (`x-ratelimit-*`, `retry-after`) y manejo de HTTP 429: pausar ese proveedor y saltar al siguiente (evento `provider:fallback` visible en la oficina).
- Reloj de recarga: cada proveedor con su hora de reset configurable (Gemini reinicia cuotas diarias a medianoche hora del Pacífico; el resto, según su documentación). Cuenta atrás en la cabecera.
- Optimización de tokens: caché por hash de (agente + prompt + datos) en IndexedDB para no repetir llamadas, prompts compactos, y respuestas JSON sin prosa.
- Pantalla "Presupuesto del día": cuántas ejecuciones completas caben con la cuota restante.

## 6.3 Calculadora financiera determinista (`src/finance/calculator.js`)

Entradas: costo producto, envío, packaging, PVP, comisión de pasarela (porcentaje + fijo, editable; por defecto 2.9% + 0.30), provisión de devoluciones (porcentaje, editable), IVA (editable, por defecto 21% para España y mostrando PVP con IVA incluido).

- `comision = pvp * pct + fijo` (la calcula el código con el PVP real de cada pack).
- `cogs_total = producto + envio + packaging + comision + provision_devoluciones`.
- `beneficio_neto = pvp_sin_iva - cogs_total`.
- `margen_neto_pct = beneficio_neto / pvp_sin_iva`.
- `multiplicador = pvp_sin_iva / costo_producto` (regla de Dora: >= 3.5x).
- `roas_equilibrio = pvp_sin_iva / beneficio_neto_antes_de_publicidad`.
- `cpa_maximo_rentable = beneficio_neto_antes_de_publicidad`.
- Packs: 30 días (1 caja), 60 días (2 cajas con descuento editable), 90 días (3 cajas con descuento o 1 caja gratis). Cada pack recalcula sus costos reales (producto y packaging se multiplican por cajas; el envío se prorratea).
- Tabla editable en la UI: al cambiar cualquier celda, todo se recalcula en tiempo real y la insignia de salud financiera cambia (ROJO < 3.0x o margen < 40%, AMARILLO 3.0-3.5x, VERDE >= 3.5x).
- Incluir pruebas unitarias en consola (casos de ejemplo con resultados esperados) para verificar las fórmulas.

## 6.4 Imágenes

Pollinations.ai como primera opción sin registro; Hugging Face con token gratuito como segunda; placeholder SVG como tercera. Descargar la imagen como blob para guardarla en IndexedDB y poder exportarla.

# 7. INTERFAZ DEL DASHBOARD

1. Cabecera: título "AUTONOMOUS DROPSHIPPING OFFICE - 11 AI WORKERS", selector de flujo \[A\] Rutina de Mañana | \[B\] Lanzar Marca desde Cero, estado global, cuotas y cuenta atrás.
2. Vista central: la oficina en Canvas (sección 3) con feed de actividad lateral.
3. Pestaña "Entrega activa": render del entregable actual (tabla financiera editable, mockup de móvil con la tienda, tarjetas de guion UGC, galería de imágenes).
4. Pestaña "Archivos del flujo": tabla con ver, copiar y descargar (y botón "Descargar todo en ZIP"):
   - `01_investigacion_producto_ivan.json`
   - `02_analisis_competencia_lucas.md`
   - `03_unit_economics_eva.csv`
   - `04_customer_avatar_sofia.json`
   - `05_copy_landing_page_carlos.md`
   - `06_prompts_fotografia_leo.json`
   - `07_shopify_bundle_selector_diego.liquid`
   - `08_guiones_anuncios_ugc_marco.md`
   - `09_estructura_campana_meta_tomas.json`
   - `10_manual_atencion_cliente_marta.md`
   - `11_informe_lanzamiento_dora.html`
5. Pestaña "Conexiones": panel por agente con semáforo de cada herramienta, campos para API keys, botón "Probar conexión", y guía de 3 pasos para obtener cada key gratuita.
6. Pestaña "Historial": marcas creadas, ejecuciones, decisiones en checkpoints, reabrir y duplicar una marca.
7. Ajustes: orden de proveedores, nombres de modelo, límites de cuota, idioma (español por defecto), mercado (España/EUR por defecto), tema claro/oscuro.

# 8. MODO SIMULACIÓN VS. MODO REAL

Cada agente declara `data_source`. En la oficina, un distintivo "SIMULADO" aparece sobre cualquier dato que no venga de una fuente real o del usuario. El informe final de Dora lista qué partes son reales, cuáles simuladas y qué debe verificar el usuario antes de invertir (proveedor, muestra física del producto, normativa de cosméticos, política de devoluciones).

# 9. CUMPLIMIENTO Y GUARDARRAÍLES (VALIDADOS POR DORA)

- Cosmética/salud: nada de afirmaciones de tratamiento médico, "sin agujas", "rellena", "elimina" o equivalentes sin respaldo; usar lenguaje cosmético prudente ("aspecto más descansado", "hidratación") y recomendar revisar el etiquetado y la normativa aplicable en el mercado destino.
- Sin testimonios, reseñas, contadores de ventas ni escasez falsos.
- Publicidad: guiones y copies deben respetar las políticas de anuncios de la plataforma; el campo `claims_check` es obligatorio en Carlos y Marco.
- Datos personales de clientes no se procesan; Marta trabaja con plantillas.
- Aviso permanente: "Esto no es asesoría legal ni financiera. Valida con un profesional antes de invertir."

# 10. CRITERIOS DE ACEPTACIÓN

- Abrir `index.html` sin ninguna key y ver la oficina animada completar el flujo en modo simulación con los 4 checkpoints funcionando.
- Con una key gratuita de Gemini o Groq, los agentes generan contenido real y la cuota se descuenta en pantalla.
- Forzar un error 429 y comprobar el fallback automático al siguiente proveedor.
- Las 11 salidas validan contra su esquema; los 11 archivos se pueden ver, copiar, descargar y exportar en ZIP.
- Cambiar el PVP en la tabla de Eva recalcula margen, multiplicador, ROAS y semáforo al instante.
- Recargar la página restaura el estado y reanuda desde el último checkpoint.
- Ninguna key aparece en logs ni exportaciones.

* Multi-oficina: crear 3 oficinas con productos distintos, encender 2 y dejar 1 apagada, cambiar el producto de una y comprobar que las otras no cambian, eliminar una y verificar que solo se borran sus datos, y recargar la página para ver que el estado se restaura.
* Agotar la cuota con 2 oficinas encendidas y comprobar que pasan a "Esperando cuota" y reanudan tras la recarga o el cambio de proveedor.

- Modo de tráfico: crear tres oficinas, una en ADS, una en ORGÁNICO y una en HÍBRIDO, y comprobar que cambian los empleados activos, el Checkpoint 4, los archivos generados y los cálculos de Eva.
- Pasar una oficina de ADS a HÍBRIDO y comprobar que solo se generan los entregables que faltan.

# 11. ENTREGA POR FASES (OBLIGATORIO SI EL CÓDIGO NO CABE EN UNA RESPUESTA)

- Fase 1: núcleo (store, bus de eventos, scheduler, validador, router de proveedores con Mock) + oficina en Canvas con los 11 sprites y estados.
- Fase 2: los 11 agentes más Nora (opcional) con prompts, esquemas y datos mock, y los tres modos de tráfico + calculadora financiera con pruebas.
- Fase 3: checkpoints, explorador de entregables, ZIP, historial, persistencia, gestor multi-oficina (crear, encender/apagar, cambiar producto, duplicar, archivar, eliminar).
- Fase 4: conectores reales (Gemini, Groq, OpenRouter, Ollama), gestor de cuotas, pestaña Conexiones, imágenes.
- Fase 5: pulido (responsive, accesibilidad, rendimiento), Rutina de Mañana, informe final.

Al terminar cada fase, indica qué probar y espera mi confirmación antes de continuar. Entrega el código completo de cada archivo, sin recortes.

## FIN DEL PROMPT

---

# Qué debes conectar (checklist gratuita)

1. **Un LLM como mínimo** (en este orden de facilidad): Google AI Studio (key gratuita, solo cuenta Google), Groq (key gratuita), OpenRouter (key gratuita con modelos `:free`), u Ollama en tu PC (sin límites ni keys, requiere equipo con RAM suficiente). Sin ninguno, funciona en modo simulación.
2. **Imágenes:** Pollinations (sin registro) y, opcional, token gratuito de Hugging Face.
3. **Investigación de producto (manual, gratis):** TikTok Creative Center, Google Trends, Meta Ad Library y catálogo de CJ Dropshipping. Copia/pega los datos en la app para que Iván y Lucas los analicen.
4. **Tienda:** cuenta de Shopify (la prueba gratuita es limitada) o prueba el código Liquid en un tema de desarrollo; Diego solo entrega código, tú lo pegas.
5. **Anuncios:** cuenta de Meta Ads Manager; Tomás entrega el blueprint y tú creas la campaña a mano.

# Cambios que hice sobre tu prompt original

- **Errores de cálculo corregidos.** En tu ejemplo de Eva, el multiplicador 4.2x no cuadra (32.90 / 4.10 = 8.0x) y la comisión de pasarela (2.9% + 0.30) sobre 32.90 da 1.25, no 1.47. Ahora lo calcula una función de código, no el LLM.
- **Kalodata** es de pago, así que lo sustituí por fuentes gratuitas y entrada manual de datos.
- **Cifras inventadas:** ahora todo dato simulado se marca como "SIMULADO".
- **Cumplimiento:** el guion original prometía cosas como "sin agujas" o "rellenar líneas" y testimonios; esto puede violar normas de anuncios y de cosmética, así que Dora lo bloquea.
- **Nombres de modelos configurables:** los catálogos gratuitos cambian a menudo. En mi búsqueda vi que Gemini ya retiró modelos 2.0 y que los límites exactos por modelo se consultan en AI Studio; por eso no van fijos. Verifica también Groq y OpenRouter al configurarlos, porque no los comprobé.
- **Oficina en tiempo real:** ahora es una sección completa (estados, traspasos animados, fichas con habilidades, herramientas y conexiones por empleado, cuotas y recarga diaria).
- **Entrega por fases** para que el código salga completo y funcional.

* Multi-oficina: ahora puedes crear varias oficinas independientes, cada una con su producto, y encenderlas, apagarlas, cambiarles el producto, duplicarlas, archivarlas o eliminarlas por separado (sección 3 BIS).

- Modo de tráfico: cada oficina elige ADS, ORGÁNICO o HÍBRIDO, con un nuevo agente opcional (Nora) para el contenido orgánico (secciones 3 TER y agente 12).
