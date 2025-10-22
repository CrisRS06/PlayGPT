/**
 * RAG Document Search Pipeline
 *
 * This module handles:
 * 1. Converting user queries to embeddings
 * 2. Searching vector database for similar documents
 * 3. Returning ranked, relevant chunks
 */

import { OpenAI } from 'openai'
import { getAdminClient } from '@/lib/supabase/admin'

// Configuration
const EMBEDDING_MODEL = 'text-embedding-3-small'
const EMBEDDING_DIMENSIONS = 1536
const DEFAULT_MATCH_THRESHOLD = 0.7 // Cosine similarity threshold (0-1)
const DEFAULT_MATCH_COUNT = 5 // Number of results to return

// Lazy OpenAI client initialization
let openaiClient: OpenAI | null = null

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }
  return openaiClient
}

export interface SearchResult {
  id: number
  content: string
  metadata: {
    source: string
    module: string
    topic: string
    chunk_index?: number
    total_chunks?: number
    author?: string
    date?: string
    [key: string]: string | number | undefined
  }
  similarity: number
}

export interface SearchOptions {
  matchThreshold?: number
  matchCount?: number
  filterModule?: string
}

/**
 * Generate embedding for a search query
 */
export async function generateQueryEmbedding(query: string): Promise<number[]> {
  console.log(`🔮 Generating embedding for query: "${query.substring(0, 50)}..."`)

  try {
    const openai = getOpenAIClient()
    const response = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: query,
      dimensions: EMBEDDING_DIMENSIONS,
    })

    console.log('   ✅ Query embedding generated')
    return response.data[0].embedding
  } catch (error) {
    console.error('❌ Error generating query embedding:', error)
    throw error
  }
}

/**
 * Search for similar documents using vector similarity
 */
export async function searchDocuments(
  query: string,
  options: SearchOptions = {}
): Promise<SearchResult[]> {
  const {
    matchThreshold = DEFAULT_MATCH_THRESHOLD,
    matchCount = DEFAULT_MATCH_COUNT,
    filterModule,
  } = options

  console.log(`\n🔍 Searching for: "${query}"`)
  console.log(`   Match threshold: ${matchThreshold}`)
  console.log(`   Max results: ${matchCount}`)
  if (filterModule) {
    console.log(`   Filter module: ${filterModule}`)
  }

  try {
    // Step 1: Generate embedding for the query
    const queryEmbedding = await generateQueryEmbedding(query)

    // Step 2: Search Supabase using the match_documents function
    const supabase = getAdminClient()

    const { data, error } = await supabase.rpc('match_documents', {
      query_embedding: JSON.stringify(queryEmbedding),
      match_threshold: matchThreshold,
      match_count: matchCount,
      filter_module: filterModule || undefined,
    })

    if (error) {
      console.error('❌ Error searching documents:', error)
      throw error
    }

    console.log(`   ✅ Found ${data?.length || 0} matching documents\n`)

    // Step 3: Format and return results
    const results: SearchResult[] = (data || []).map((item) => ({
      id: item.id as number,
      content: item.content as string,
      metadata: item.metadata as SearchResult['metadata'],
      similarity: item.similarity as number,
    }))

    return results
  } catch (error) {
    console.error('❌ Search failed:', error)
    throw error
  }
}

/**
 * Search with detailed logging (for debugging)
 */
export async function searchDocumentsVerbose(
  query: string,
  options: SearchOptions = {}
): Promise<SearchResult[]> {
  console.log('\n' + '='.repeat(60))
  console.log('RAG SEARCH DEBUG')
  console.log('='.repeat(60))

  const results = await searchDocuments(query, options)

  console.log('\n📊 Search Results:')
  results.forEach((result, index) => {
    console.log(`\n${index + 1}. Similarity: ${(result.similarity * 100).toFixed(1)}%`)
    console.log(`   Topic: ${result.metadata.topic}`)
    console.log(`   Module: ${result.metadata.module}`)
    console.log(`   Source: ${result.metadata.source}`)
    console.log(`   Content: ${result.content.substring(0, 150)}...`)
  })

  console.log('\n' + '='.repeat(60) + '\n')

  return results
}

/**
 * Get context string from search results (for LLM prompts)
 */
export function formatSearchResultsAsContext(results: SearchResult[]): string {
  if (results.length === 0) {
    return 'No relevant documents found.'
  }

  const contextParts = results.map((result, index) => {
    return `[Document ${index + 1}] (Topic: ${result.metadata.topic}, Similarity: ${(result.similarity * 100).toFixed(1)}%)
${result.content}
`
  })

  return contextParts.join('\n---\n\n')
}

/**
 * Get unique topics from search results
 */
export function getTopicsFromResults(results: SearchResult[]): string[] {
  const topics = new Set<string>()
  results.forEach(result => {
    if (result.metadata.topic) {
      topics.add(result.metadata.topic)
    }
  })
  return Array.from(topics)
}

/**
 * Filter results by minimum similarity
 */
export function filterByMinSimilarity(
  results: SearchResult[],
  minSimilarity: number
): SearchResult[] {
  return results.filter(result => result.similarity >= minSimilarity)
}

/**
 * Get top N results
 */
export function getTopResults(
  results: SearchResult[],
  n: number
): SearchResult[] {
  return results.slice(0, n)
}
