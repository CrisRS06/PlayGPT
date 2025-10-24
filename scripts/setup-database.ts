import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'

// Load environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:')
  console.error('   NEXT_PUBLIC_SUPABASE_URL')
  console.error('   SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

// Create Supabase client with service role key (for potential future use)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function setupDatabase() {
  console.log('🚀 Starting database setup...\n')

  try {
    // Read SQL file
    const sqlPath = join(process.cwd(), 'supabase-schema.sql')
    const sql = readFileSync(sqlPath, 'utf-8')

    console.log('📄 Read schema file: supabase-schema.sql')
    console.log(`   ${sql.split('\n').length} lines of SQL\n`)

    // Execute SQL using Supabase REST API
    // Note: Supabase doesn't support multi-statement SQL via the JS client
    // We'll need to execute this via the SQL Editor or split it into parts

    console.log('⚠️  SQL file created successfully!')
    console.log('\n📋 Next steps:')
    console.log('   1. Go to your Supabase dashboard:')
    console.log(`      https://supabase.com/dashboard/project/svrffjmuiscuitcuhuhy/editor`)
    console.log('\n   2. Open the SQL Editor')
    console.log('\n   3. Copy and paste the contents of:')
    console.log('      playgpt-edu/supabase-schema.sql')
    console.log('\n   4. Click "Run" to execute the schema')
    console.log('\n   5. After running, come back and generate types with:')
    console.log('      pnpm run generate-types')

  } catch (error) {
    console.error('❌ Error setting up database:', error)
    process.exit(1)
  }
}

setupDatabase()
