/**
 * RAG Document Ingestion Pipeline
 *
 * This module handles:
 * 1. Loading documents (PDF, TXT, MD)
 * 2. Chunking text into manageable pieces
 * 3. Generating embeddings using OpenAI
 * 4. Storing in Supabase with metadata
 */

import { readFileSync } from 'fs'
import { join } from 'path'
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters'
import { OpenAI } from 'openai'
import { getAdminClient } from '@/lib/supabase/admin'

// Dynamic import for pdf-parse due to module format issues
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require('pdf-parse')

// Lazy initialization of OpenAI client
let openaiClient: OpenAI | null = null

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }
  return openaiClient
}

// Configuration
const CHUNK_SIZE = 1000 // characters
const CHUNK_OVERLAP = 200 // characters
const EMBEDDING_MODEL = 'text-embedding-3-small'
const EMBEDDING_DIMENSIONS = 1536

export interface DocumentMetadata {
  source: string
  module: string
  topic: string
  author?: string
  date?: string
  chunk_index?: number
  total_chunks?: number
  [key: string]: string | number | undefined
}

export interface DocumentChunk {
  content: string
  metadata: DocumentMetadata
  embedding?: number[]
}

/**
 * Load a document from file
 */
export async function loadDocument(
  filePath: string
): Promise<string> {
  const fullPath = join(process.cwd(), filePath)
  const fileExtension = filePath.split('.').pop()?.toLowerCase()

  console.log(`📄 Loading document: ${filePath}`)

  try {
    if (fileExtension === 'pdf') {
      // Load PDF
      const dataBuffer = readFileSync(fullPath)
      const data = await pdfParse(dataBuffer)
      console.log(`   ✅ Loaded PDF (${data.numpages} pages, ${data.text.length} chars)`)
      return data.text
    } else if (fileExtension === 'txt' || fileExtension === 'md') {
      // Load text file
      const text = readFileSync(fullPath, 'utf-8')
      console.log(`   ✅ Loaded text file (${text.length} chars)`)
      return text
    } else {
      throw new Error(`Unsupported file type: ${fileExtension}`)
    }
  } catch (error) {
    console.error(`   ❌ Error loading document: ${error}`)
    throw error
  }
}

/**
 * Split document into chunks
 */
export async function chunkDocument(text: string): Promise<string[]> {
  console.log(`✂️  Chunking document...`)

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: CHUNK_SIZE,
    chunkOverlap: CHUNK_OVERLAP,
    separators: ['\n\n', '\n', '. ', ' ', ''],
  })

  const chunks = await splitter.splitText(text)

  console.log(`   ✅ Created ${chunks.length} chunks`)
  console.log(`   📊 Avg chunk size: ${Math.round(chunks.reduce((sum, c) => sum + c.length, 0) / chunks.length)} chars`)

  return chunks
}

/**
 * Generate embeddings for a single text
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const openai = getOpenAIClient()
    const response = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: text,
      dimensions: EMBEDDING_DIMENSIONS,
    })

    return response.data[0].embedding
  } catch (error) {
    console.error('❌ Error generating embedding:', error)
    throw error
  }
}

/**
 * Generate embeddings for multiple texts (with rate limiting)
 */
export async function generateEmbeddings(
  texts: string[],
  batchSize: number = 100
): Promise<number[][]> {
  console.log(`🔮 Generating embeddings for ${texts.length} chunks...`)

  const openai = getOpenAIClient()
  const embeddings: number[][] = []

  // Process in batches to avoid rate limits
  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize)

    console.log(`   Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(texts.length / batchSize)}...`)

    const response = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: batch,
      dimensions: EMBEDDING_DIMENSIONS,
    })

    embeddings.push(...response.data.map(item => item.embedding))

    // Small delay between batches
    if (i + batchSize < texts.length) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }

  console.log(`   ✅ Generated ${embeddings.length} embeddings`)

  return embeddings
}

/**
 * Store chunks with embeddings in Supabase
 */
export async function storeChunks(chunks: DocumentChunk[]): Promise<void> {
  console.log(`💾 Storing ${chunks.length} chunks in Supabase...`)

  const supabase = getAdminClient()

  // Prepare data for insertion
  const records = chunks.map(chunk => ({
    content: chunk.content,
    metadata: chunk.metadata,
    embedding: JSON.stringify(chunk.embedding), // Supabase expects embedding as string
  }))

  // Insert in batches of 100
  const batchSize = 100
  let inserted = 0

  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize)

    const { error } = await supabase
      .from('documents')
      .insert(batch)

    if (error) {
      console.error(`❌ Error inserting batch: ${error.message}`)
      throw error
    }

    inserted += batch.length
    console.log(`   ✅ Inserted ${inserted}/${records.length} chunks`)
  }

  console.log(`   ✅ All chunks stored successfully!`)
}

/**
 * Main ingestion pipeline
 */
export async function ingestDocument(
  filePath: string,
  metadata: Omit<DocumentMetadata, 'source'>
): Promise<number> {
  console.log(`\n🚀 Starting ingestion pipeline for: ${filePath}`)
  console.log(`   Module: ${metadata.module}`)
  console.log(`   Topic: ${metadata.topic}\n`)

  try {
    // Step 1: Load document
    const text = await loadDocument(filePath)

    // Step 2: Chunk document
    const chunks = await chunkDocument(text)

    // Step 3: Generate embeddings
    const embeddings = await generateEmbeddings(chunks)

    // Step 4: Prepare chunks with embeddings
    const documentChunks: DocumentChunk[] = chunks.map((content, index) => ({
      content,
      metadata: {
        ...metadata,
        source: filePath,
        chunk_index: index,
        total_chunks: chunks.length,
      } as DocumentMetadata,
      embedding: embeddings[index],
    }))

    // Step 5: Store in Supabase
    await storeChunks(documentChunks)

    console.log(`\n✅ Successfully ingested document: ${filePath}`)
    console.log(`   Total chunks: ${chunks.length}`)
    console.log(`   Total embeddings: ${embeddings.length}\n`)

    return chunks.length
  } catch (error) {
    console.error(`\n❌ Failed to ingest document: ${filePath}`)
    console.error(error)
    throw error
  }
}

/**
 * Ingest multiple documents
 */
export async function ingestDocuments(
  documents: Array<{
    filePath: string
    metadata: Omit<DocumentMetadata, 'source'>
  }>
): Promise<{ success: number; failed: number; totalChunks: number }> {
  console.log(`\n📚 Ingesting ${documents.length} documents...\n`)

  let success = 0
  let failed = 0
  let totalChunks = 0

  for (const doc of documents) {
    try {
      const chunks = await ingestDocument(doc.filePath, doc.metadata)
      success++
      totalChunks += chunks
    } catch {
      failed++
      console.error(`Failed to ingest: ${doc.filePath}`)
    }
  }

  console.log(`\n📊 Ingestion Summary:`)
  console.log(`   ✅ Successful: ${success}/${documents.length}`)
  console.log(`   ❌ Failed: ${failed}/${documents.length}`)
  console.log(`   📦 Total chunks: ${totalChunks}`)

  return { success, failed, totalChunks }
}
