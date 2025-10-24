/**
 * Document Ingestion Script
 *
 * Usage:
 *   pnpm ingest             # Ingest all documents in knowledge-base/
 *   pnpm ingest path/to/doc.pdf  # Ingest specific document
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import { readdirSync } from 'fs'
import { join } from 'path'

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') })

import { ingestDocuments } from '../src/lib/rag/ingest'

// Define knowledge base documents
const KNOWLEDGE_BASE_DIR = 'knowledge-base'

const DOCUMENTS = [
  {
    filePath: 'knowledge-base/expected-value.md',
    metadata: {
      module: 'Module_1_Foundations',
      topic: 'Expected Value',
      author: 'PlayGPT EDU Team',
      date: '2025-01',
    },
  },
  {
    filePath: 'knowledge-base/probability-basics.md',
    metadata: {
      module: 'Module_1_Foundations',
      topic: 'Probability Fundamentals',
      author: 'PlayGPT EDU Team',
      date: '2025-01',
    },
  },
  {
    filePath: 'knowledge-base/cognitive-biases.md',
    metadata: {
      module: 'Module_1_Foundations',
      topic: 'Cognitive Biases',
      author: 'PlayGPT EDU Team',
      date: '2025-01',
    },
  },
  {
    filePath: 'knowledge-base/bankroll-management.md',
    metadata: {
      module: 'Module_2_Strategy',
      topic: 'Bankroll Management',
      author: 'PlayGPT EDU Team',
      date: '2025-01',
    },
  },
]

/**
 * Discover all documents in knowledge-base directory
 */
function discoverDocuments(): typeof DOCUMENTS {
  console.log(`🔍 Scanning ${KNOWLEDGE_BASE_DIR} directory...\n`)

  try {
    const files = readdirSync(KNOWLEDGE_BASE_DIR)
    const documents = files
      .filter(file => {
        const ext = file.split('.').pop()?.toLowerCase()
        return ext === 'pdf' || ext === 'txt' || ext === 'md'
      })
      .map(file => {
        const filePath = join(KNOWLEDGE_BASE_DIR, file)
        const fileName = file.replace(/\.[^/.]+$/, '') // Remove extension

        // Try to match with predefined documents
        const predefined = DOCUMENTS.find(d => d.filePath.includes(file))

        if (predefined) {
          return predefined
        }

        // Generate metadata from filename
        return {
          filePath,
          metadata: {
            module: 'Module_1_Foundations',
            topic: fileName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            author: 'PlayGPT EDU Team',
            date: new Date().toISOString().split('T')[0],
          },
        }
      })

    console.log(`   Found ${documents.length} documents\n`)

    return documents
  } catch {
    console.log(`   ⚠️  Directory ${KNOWLEDGE_BASE_DIR} not found or empty\n`)
    return []
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('╔══════════════════════════════════════════════════════════╗')
  console.log('║        PlayGPT EDU - Document Ingestion Pipeline        ║')
  console.log('╚══════════════════════════════════════════════════════════╝\n')

  // Check environment variables
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ Missing OPENAI_API_KEY environment variable')
    console.error('   Add it to your .env.local file\n')
    process.exit(1)
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Missing Supabase credentials')
    console.error('   Check your .env.local file\n')
    process.exit(1)
  }

  try {
    // Get documents to ingest
    const documentsToIngest = discoverDocuments()

    if (documentsToIngest.length === 0) {
      console.log('⚠️  No documents found to ingest!')
      console.log('\n📝 To add documents:')
      console.log('   1. Create a "knowledge-base/" directory')
      console.log('   2. Add PDF, TXT, or MD files')
      console.log('   3. Run this script again\n')
      console.log('Or see the example documents created in knowledge-base/\n')
      return
    }

    // Display documents to be ingested
    console.log('📚 Documents to ingest:\n')
    documentsToIngest.forEach((doc, index) => {
      console.log(`   ${index + 1}. ${doc.filePath}`)
      console.log(`      Topic: ${doc.metadata.topic}`)
      console.log(`      Module: ${doc.metadata.module}\n`)
    })

    // Confirm before proceeding
    console.log('⏳ Starting ingestion in 2 seconds...\n')
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Ingest all documents
    const startTime = Date.now()
    const result = await ingestDocuments(documentsToIngest)
    const duration = ((Date.now() - startTime) / 1000).toFixed(2)

    // Summary
    console.log('\n╔══════════════════════════════════════════════════════════╗')
    console.log('║                    Ingestion Complete                    ║')
    console.log('╚══════════════════════════════════════════════════════════╝\n')
    console.log(`⏱️  Duration: ${duration}s`)
    console.log(`✅ Success: ${result.success}/${documentsToIngest.length} documents`)
    console.log(`📦 Total chunks: ${result.totalChunks}`)
    console.log(`❌ Failed: ${result.failed}`)

    if (result.failed > 0) {
      console.log('\n⚠️  Some documents failed to ingest. Check the logs above.')
    }

    console.log('\n🔍 Verify in Supabase:')
    console.log('   https://supabase.com/dashboard/project/svrffjmuiscuitcuhuhy/editor')
    console.log('   SELECT COUNT(*) FROM documents;\n')

    console.log('✅ Ready to continue with Session 1.4: RAG Retrieval!\n')

  } catch (error) {
    console.error('\n❌ Ingestion failed:', error)
    process.exit(1)
  }
}

// Run
main()
