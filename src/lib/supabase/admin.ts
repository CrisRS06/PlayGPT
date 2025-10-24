/**
 * Supabase Admin Client
 * Use this for server-side operations that require elevated privileges
 * WARNING: Never expose this client to the browser
 */

import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

// Singleton instance
let adminClient: ReturnType<typeof createClient<Database>> | null = null

export function getAdminClient() {
  if (adminClient) {
    return adminClient
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      'Missing Supabase credentials. Check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY'
    )
  }

  adminClient = createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  return adminClient
}
