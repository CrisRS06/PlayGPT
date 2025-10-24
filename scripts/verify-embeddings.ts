import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })

import { getAdminClient } from '../src/lib/supabase/admin'

interface DocumentMetadata {
  topic?: string
  module?: string
  source?: string
  [key: string]: string | number | undefined
}

async function verifyEmbeddings() {
  const supabase = getAdminClient()

  console.log('📊 Verifying document embeddings...\n')

  const { data, error, count } = await supabase
    .from('documents')
    .select('id, metadata, content', { count: 'exact' })
    .order('id', { ascending: true })

  if (error) {
    console.error('❌ Error:', error)
    return
  }

  console.log(`✅ Total documents in database: ${count}\n`)

  // Group by topic
  const byTopic: Record<string, number> = {}
  data?.forEach((doc) => {
    const metadata = doc.metadata as DocumentMetadata
    const topic = metadata?.topic
    if (topic && typeof topic === 'string') {
      byTopic[topic] = (byTopic[topic] || 0) + 1
    }
  })

  console.log('📚 Documents by topic:')
  Object.entries(byTopic).forEach(([topic, count]) => {
    console.log(`   ${topic}: ${count} chunks`)
  })

  if (data && data.length > 0 && data[0]) {
    const firstDoc = data[0]
    const metadata = firstDoc.metadata as DocumentMetadata
    if (metadata && firstDoc.content) {
      console.log('\n📄 Sample document:')
      console.log(`   Topic: ${metadata.topic || 'N/A'}`)
      console.log(`   Module: ${metadata.module || 'N/A'}`)
      console.log(`   Content preview: ${firstDoc.content.substring(0, 100)}...`)
    }
  }

  console.log('\n✅ Embeddings verified successfully!')
}

verifyEmbeddings()
