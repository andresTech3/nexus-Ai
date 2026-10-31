import { useOfficeStore } from '../store'
import { AgentId } from '@/types/office'

export interface LLMRequestOptions {
  agentId: AgentId
  officeId: string
  productName: string
  niche: string
  userContext?: string
  previousDeliverables?: Record<string, any>
  jsonMode?: boolean
}

export interface LLMResponseResult {
  content: string
  isReal: boolean
  providerUsed: string
  modelUsed: string
  tokensUsed: number
}

export async function callAgentLLM(
  systemPrompt: string,
  userPrompt: string,
  options: LLMRequestOptions
): Promise<LLMResponseResult> {
  const store = useOfficeStore.getState()
  const quotas = store.quotas

  // Clean Executive Router: Check user configured providers
  // 1. Claude, 2. OpenAI, 3. DeepSeek, 4. FreeLLMAPI (Unified), 5. Open Source (Groq/Ollama/OpenRouter)
  let selectedProvider: 'claude' | 'openai' | 'deepseek' | 'freellmapi' | 'opensource' | 'cerebras' | 'gemini' | 'groq' | 'openrouter' | 'ollama' | 'mock' = 'mock'
  let apiKey = ''
  let modelName = ''
  let hostUrl = ''

  if (quotas.claude?.apiKey && quotas.claude.apiKey.trim().startsWith('sk-ant-')) {
    selectedProvider = 'claude'
    apiKey = quotas.claude.apiKey.trim()
    modelName = quotas.claude.modelName || 'claude-3-7-sonnet-20250219'
  } else if (quotas.openai?.apiKey && quotas.openai.apiKey.trim().startsWith('sk-')) {
    selectedProvider = 'openai'
    apiKey = quotas.openai.apiKey.trim()
    modelName = quotas.openai.modelName || 'gpt-4o-mini'
  } else if (quotas.deepseek?.apiKey && quotas.deepseek.apiKey.trim() !== '') {
    selectedProvider = 'deepseek'
    apiKey = quotas.deepseek.apiKey.trim()
    modelName = quotas.deepseek.modelName || 'deepseek-chat'
  } else if (quotas.freellmapi && quotas.freellmapi.isHealthy !== false) {
    selectedProvider = 'freellmapi'
    apiKey = quotas.freellmapi.apiKey?.trim() || ''
    modelName = quotas.freellmapi.modelName || 'gpt-4o-mini'
    hostUrl = quotas.freellmapi.hostUrl || 'http://127.0.0.1:31415/v1'
  } else if (quotas.opensource?.apiKey && quotas.opensource.apiKey.trim() !== '') {
    selectedProvider = 'opensource'
    apiKey = quotas.opensource.apiKey.trim()
    modelName = quotas.opensource.modelName || 'qwen2.5:7b'
    hostUrl = apiKey.startsWith('http') ? apiKey : ''
  } else if (quotas.cerebras?.apiKey && quotas.cerebras.isHealthy) {
    selectedProvider = 'cerebras'
    apiKey = quotas.cerebras.apiKey
    modelName = quotas.cerebras.modelName || 'llama-3.3-70b'
  } else if (quotas.gemini?.apiKey && quotas.gemini.isHealthy) {
    selectedProvider = 'gemini'
    apiKey = quotas.gemini.apiKey
    modelName = quotas.gemini.modelName || 'gemini-2.0-flash'
  } else if (quotas.groq?.apiKey && quotas.groq.isHealthy) {
    selectedProvider = 'groq'
    apiKey = quotas.groq.apiKey
    modelName = quotas.groq.modelName || 'llama-3.3-70b-versatile'
  }

  // Call the server API endpoint
  try {
    const res = await fetch('/api/v1/office/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        provider: selectedProvider,
        apiKey,
        modelName,
        hostUrl,
        systemPrompt,
        userPrompt,
        jsonMode: options.jsonMode,
      }),
    })

    if (res.ok) {
      const data = await res.json()
      if (data.isReal && data.reply) {
        store.updateQuota(data.provider, 1, data.tokensUsed || 750)
        return {
          content: data.reply,
          isReal: true,
          providerUsed: data.provider,
          modelUsed: data.model,
          tokensUsed: data.tokensUsed || 750,
        }
      }
    }
  } catch (err) {
    console.warn('[LLM Router] Error invoking /api/v1/office/chat:', err)
  }

  // Fallback to intelligent dynamic generation
  return {
    content: '',
    isReal: false,
    providerUsed: 'mock',
    modelUsed: 'heuristic-generator-v2',
    tokensUsed: 400,
  }
}
