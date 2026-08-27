import 'server-only'
import { createClient } from '@supabase/supabase-js'

/**
 * Supabase admin client with service-role key. Bypasses RLS.
 *
 * MUST only be used from server actions, route handlers, or edge functions.
 * The 'server-only' import throws at build time if this file is bundled to the client.
 * See AGENTS.md rule R10.
 */
export function createSupabaseAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { persistSession: false, autoRefreshToken: false },
    },
  )
}
