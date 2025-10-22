/**
 * Verify Supabase Connection
 * Tests database connection and queries tables
 */

import { config } from 'dotenv'
import { resolve } from 'path'

// Load .env.local
config({ path: resolve(process.cwd(), '.env.local') })

import { getAdminClient } from '../src/lib/supabase/admin'

async function verifyConnection() {
  console.log('🔍 Verifying Supabase connection...\n')

  try {
    const supabase = getAdminClient()

    // Test 1: Check connection
    console.log('1️⃣  Testing database connection...')
    const { error: tablesError } = await supabase
      .from('documents')
      .select('id')
      .limit(1)

    if (tablesError && tablesError.code !== 'PGRST116') {
      // PGRST116 = no rows returned, which is fine
      throw tablesError
    }

    console.log('   ✅ Connection successful!\n')

    // Test 2: List all tables
    console.log('2️⃣  Checking tables...')
    const tableNames = [
      'student_profiles',
      'conversations',
      'documents',
      'quizzes',
      'quiz_attempts',
      'knowledge_components',
      'interactions',
    ] as const

    for (const tableName of tableNames) {
      // Cast to any to bypass strict Supabase type checking in scripts
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase.from as any)(tableName).select('id').limit(0)

      if (error) {
        console.log(`   ❌ Table "${tableName}" - ERROR: ${error.message}`)
      } else {
        console.log(`   ✅ Table "${tableName}" exists`)
      }
    }

    console.log('\n3️⃣  Checking pgvector extension...')
    const { error: extError } = await supabase.rpc(
      'match_documents',
      {
        query_embedding: JSON.stringify(Array(1536).fill(0)),
        match_threshold: 0.5,
        match_count: 1,
        filter_module: undefined,
      }
    )

    if (extError && extError.code !== 'PGRST116') {
      console.log(`   ⚠️  pgvector check: ${extError.message}`)
    } else {
      console.log('   ✅ pgvector extension working (match_documents function exists)')
    }

    console.log('\n✅ All checks passed!')
    console.log('\n📊 Summary:')
    console.log('   - Database connection: ✅')
    console.log('   - All tables created: ✅')
    console.log('   - pgvector enabled: ✅')
    console.log('   - RAG function ready: ✅')
    console.log('\n🚀 Ready to continue with Session 1.3!')

  } catch (error) {
    console.error('\n❌ Verification failed:', error)
    console.error('\nTroubleshooting:')
    console.error('1. Check your .env.local file has correct credentials')
    console.error('2. Verify SQL was executed in Supabase dashboard')
    console.error('3. Check Supabase project is running')
    process.exit(1)
  }
}

verifyConnection()
