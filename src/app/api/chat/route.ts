/**
 * Chat API Endpoint with RAG
 *
 * This endpoint:
 * 1. Receives user messages
 * 2. Searches the knowledge base using RAG
 * 3. Generates contextual responses using OpenAI
 * 4. Streams the response back to the client
 */

import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'
import { searchDocuments, formatSearchResultsAsContext } from '@/lib/rag/search'
import { chatRateLimiter, getRateLimitIdentifier, createRateLimitResponse, addRateLimitHeaders } from '@/lib/rate-limit'
import { getUser } from '@/lib/auth/actions'
import { logger } from '@/lib/utils/logger'

export const runtime = 'nodejs'
export const maxDuration = 30

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ChatRequest {
  messages: Message[]
}

export async function POST(req: Request) {
  try {
    // Rate limiting
    const user = await getUser()
    const identifier = getRateLimitIdentifier(req, user?.id)
    const rateLimitResult = await chatRateLimiter.check(identifier)

    if (!rateLimitResult.success) {
      return createRateLimitResponse(rateLimitResult)
    }

    const { messages }: ChatRequest = await req.json()

    if (!messages || messages.length === 0) {
      return new Response('Messages are required', { status: 400 })
    }

    // Get the latest user message
    const lastMessage = messages[messages.length - 1]

    if (lastMessage.role !== 'user') {
      return new Response('Last message must be from user', { status: 400 })
    }

    // Step 1: Search knowledge base using RAG
    logger.info('🔍 Searching knowledge base for:', lastMessage.content)

    const searchResults = await searchDocuments(lastMessage.content, {
      matchThreshold: 0.6, // Lower threshold for better recall
      matchCount: 5,
    })

    // Step 2: Format context from search results
    const context = formatSearchResultsAsContext(searchResults)

    logger.info(`📚 Found ${searchResults.length} relevant documents`)

    // Step 3: Build system prompt with context
    const systemPrompt = `Eres PlayGPT EDU, un asistente educativo experto en juego responsable, probabilidad, valor esperado y gestión de bankroll.

Tu objetivo es ayudar a los estudiantes a comprender conceptos matemáticos y psicológicos relacionados con el juego de manera clara y educativa.

CONTEXTO RELEVANTE DE LA BASE DE CONOCIMIENTO:
${context}

INSTRUCCIONES:
1. Usa el contexto proporcionado para responder la pregunta del usuario
2. Si el contexto no contiene información suficiente, usa tu conocimiento general pero indícalo claramente
3. Explica conceptos de forma clara, usando ejemplos cuando sea apropiado
4. Si mencionas fórmulas o cálculos, explica paso a paso
5. Mantén un tono educativo, profesional pero amigable
6. Si la pregunta no está relacionada con juego responsable, redirige amablemente al tema
7. Siempre enfatiza la importancia del juego responsable

Responde en español de forma clara y estructurada.`

    // Step 4: Stream response using Vercel AI SDK
    const result = streamText({
      model: openai('gpt-4o-mini'),
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
      ],
      temperature: 0.7,
    })

    // Add rate limit headers to the response
    const response = result.toTextStreamResponse()
    addRateLimitHeaders(response.headers, rateLimitResult)

    return response
  } catch (error) {
    logger.error('❌ Chat API error:', error)

    return new Response(
      JSON.stringify({
        error: 'Failed to process chat request',
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
