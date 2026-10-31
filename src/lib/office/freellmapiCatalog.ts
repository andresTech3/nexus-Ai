import { FreeLLMAPIModelInfo } from '@/types/office'

export const FREELLMAPI_CATALOG: FreeLLMAPIModelInfo[] = [
  {
    id: 'auto',
    name: 'Smart Auto Router (34 Proveedores)',
    provider: 'FreeLLMAPI Gateway',
    category: 'auto',
    tag: 'RECOMENDADO',
    contextWindow: 'Automático',
    speed: 'Ultra Rápido',
    description: 'Rotación inteligente y conmutación por error automática entre 34 proveedores gratuitos (Cerebras, Groq, Google, Mistral, etc.) para evitar bloqueos por límite 429.',
    recommendedFor: ['Todos los Agentes', 'Pipeline Completo', 'Dora'],
  },
  {
    id: 'cerebras/llama-3.3-70b',
    name: 'Cerebras Llama 3.3 70B',
    provider: 'Cerebras Cloud',
    category: 'cerebras',
    tag: '~2.000 TPS',
    contextWindow: '8.192 tokens',
    speed: 'Ultra Rápido (instantáneo)',
    description: 'La inferencia más veloz del mundo en chips WSE-3. Genera respuestas y cálculos ejecutivos en menos de 0.5 segundos.',
    recommendedFor: ['Lucas (Proveedores)', 'Eva (Finanzas)', 'Nora (CRO)'],
  },
  {
    id: 'google/gemini-2.0-flash',
    name: 'Google Gemini 2.0 Flash',
    provider: 'Google AI Studio',
    category: 'google',
    tag: '1M CONTEXTO',
    contextWindow: '1.048.576 tokens',
    speed: 'Rápido',
    description: 'Ventana de contexto colosal de 1 millón de tokens. Ideal para que Dora audite todas las entregas juntas y verifique calidad legal sin truncar.',
    recommendedFor: ['Dora (CEO)', 'Tomás (Media Buyer)'],
  },
  {
    id: 'google/gemini-1.5-flash',
    name: 'Google Gemini 1.5 Flash',
    provider: 'Google AI Studio',
    category: 'google',
    tag: '1.500 REQ/DÍA',
    contextWindow: '1.048.576 tokens',
    speed: 'Rápido',
    description: 'Cuota gratuita de 1.500 llamadas diarias sin tarjeta de crédito. Excelente para pruebas continuas.',
    recommendedFor: ['Dora', 'Iván'],
  },
  {
    id: 'groq/llama-3.3-70b-versatile',
    name: 'Groq Llama 3.3 70B Versatile',
    provider: 'Groq Cloud LPU',
    category: 'groq',
    tag: '300 TPS',
    contextWindow: '128.000 tokens',
    speed: 'Muy Rápido',
    description: 'Hardware LPU de Groq con gran versatilidad analítica y redaccional para dropshipping y marketing D2C.',
    recommendedFor: ['Iván (Producto)', 'Carlos (Ofertas)', 'Marco (UGC)'],
  },
  {
    id: 'openrouter/deepseek/deepseek-r1:free',
    name: 'DeepSeek R1 Free (Reasoning)',
    provider: 'OpenRouter Free',
    category: 'openrouter',
    tag: 'RAZONAMIENTO',
    contextWindow: '64.000 tokens',
    speed: 'Normal (Thinking)',
    description: 'Capacidad de razonamiento paso a paso estilo o1. Excelente para contrastar márgenes, ROAS y factibilidad de entrega.',
    recommendedFor: ['Iván (Análisis de Nicho)', 'Eva (Márgenes)'],
  },
  {
    id: 'mistral/mistral-large-latest',
    name: 'Mistral Large 2',
    provider: 'Mistral AI',
    category: 'mistral',
    tag: 'ESPAÑOL PREMIUM',
    contextWindow: '128.000 tokens',
    speed: 'Rápido',
    description: 'El modelo europeo con mejor redacción nativa en español. Tono de marca elegante, persuasivo y sin anglicismos forzados.',
    recommendedFor: ['Sofía (Branding)', 'Marta (Atención al Cliente)'],
  },
  {
    id: 'mistral/codestral-latest',
    name: 'Mistral Codestral',
    provider: 'Mistral AI',
    category: 'mistral',
    tag: 'DEV & LIQUID',
    contextWindow: '256.000 tokens',
    speed: 'Muy Rápido',
    description: 'Optimizado específicamente para desarrollo web, HTML5 responsivo y temas Liquid para Shopify.',
    recommendedFor: ['Diego (Shopify Developer)'],
  },
  {
    id: 'openrouter/meta-llama/llama-3.3-70b-instruct:free',
    name: 'Llama 3.3 70B Instruct (Free)',
    provider: 'OpenRouter Free',
    category: 'openrouter',
    tag: 'OPEN SOURCE',
    contextWindow: '128.000 tokens',
    speed: 'Rápido',
    description: 'Capacidad creativa para generar prompts cinematográficos de Midjourney v6 y ángulos visuales de producto.',
    recommendedFor: ['Leo (Creativo & Midjourney)'],
  },
  {
    id: 'nvidia/meta/llama-3.3-70b-instruct',
    name: 'NVIDIA NIM Llama 3.3 70B',
    provider: 'NVIDIA NIM',
    category: 'nvidia',
    tag: 'TENSORRT-LLM',
    contextWindow: '128.000 tokens',
    speed: 'Muy Rápido',
    description: 'Aceleración en GPUs NVIDIA con inferencia optimizada y alta consistencia en respuestas estructuradas.',
    recommendedFor: ['Tomás (Meta Ads)', 'Carlos (Pricing)'],
  },
  {
    id: 'cohere/command-r-plus',
    name: 'Cohere Command R+',
    provider: 'Cohere',
    category: 'cohere',
    tag: 'RAG & CITAS',
    contextWindow: '128.000 tokens',
    speed: 'Rápido',
    description: 'Especialista en extracción de datos fácticos de catálogos y referencias web sin alucinaciones.',
    recommendedFor: ['Iván (Investigación)', 'Lucas (Catálogos CJ)'],
  },
  {
    id: 'cloudflare/@cf/meta/llama-3.3-70b-instruct',
    name: 'Cloudflare Workers AI Llama 3.3',
    provider: 'Cloudflare Workers',
    category: 'cloudflare',
    tag: 'EDGE GLOBAL',
    contextWindow: '8.192 tokens',
    speed: 'Ultra Rápido',
    description: 'Distribuido en el edge en más de 300 ciudades para latencias mínimas desde cualquier país.',
    recommendedFor: ['Nora (CRO)', 'Marta (Atención al Cliente)'],
  },
  {
    id: 'brave/web-search',
    name: 'Brave Search Live Tool',
    provider: 'Brave Search API',
    category: 'search',
    tag: 'WEB EN VIVO',
    contextWindow: 'Herramienta',
    speed: 'Tiempo Real',
    description: 'Búsqueda web en vivo de tendencias sin anuncios para escanear TikTok Creative Center y AliExpress en directo.',
    recommendedFor: ['Iván (Búsqueda en Vivo)'],
  },
]

export const FREELLMAPI_CATEGORIES = [
  { id: 'all', name: 'Todos los Modelos' },
  { id: 'auto', name: '🌟 Smart Failover' },
  { id: 'cerebras', name: '⚡ Cerebras' },
  { id: 'google', name: '🧠 Google Gemini' },
  { id: 'groq', name: '🚀 Groq' },
  { id: 'mistral', name: '🇫🇷 Mistral' },
  { id: 'openrouter', name: '🌐 OpenRouter' },
  { id: 'nvidia', name: '🟢 NVIDIA NIM' },
  { id: 'cohere', name: '📚 Cohere' },
  { id: 'cloudflare', name: '☁️ Cloudflare' },
  { id: 'search', name: '🔎 Búsqueda Web' },
]

export function getRecommendedModelForAgent(agentId: string): string {
  switch (agentId) {
    case 'dora':
      return 'google/gemini-2.0-flash'
    case 'ivan':
      return 'groq/llama-3.3-70b-versatile'
    case 'lucas':
      return 'cerebras/llama-3.3-70b'
    case 'eva':
      return 'cerebras/llama-3.3-70b'
    case 'sofia':
      return 'mistral/mistral-large-latest'
    case 'carlos':
      return 'groq/llama-3.3-70b-versatile'
    case 'leo':
      return 'openrouter/meta-llama/llama-3.3-70b-instruct:free'
    case 'diego':
      return 'mistral/codestral-latest'
    case 'marco':
      return 'groq/llama-3.3-70b-versatile'
    case 'tomas':
      return 'google/gemini-2.0-flash'
    case 'marta':
      return 'mistral/mistral-large-latest'
    case 'nora':
      return 'cerebras/llama-3.3-70b'
    default:
      return 'auto'
  }
}
