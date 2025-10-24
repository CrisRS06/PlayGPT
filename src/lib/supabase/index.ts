/**
 * Supabase Clients
 *
 * Usage:
 * - Browser: import { createClient } from '@/lib/supabase/client'
 * - Server: import { createClient } from '@/lib/supabase/server'
 * - Admin: import { getAdminClient } from '@/lib/supabase/admin'
 */

export { createClient as createBrowserClient } from './client'
export { createClient as createServerClient } from './server'
export { getAdminClient } from './admin'
