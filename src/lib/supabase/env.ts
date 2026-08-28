const DEFAULT_SUPABASE_URL = 'https://lcvshepgzizrlqbzvjoe.supabase.co'
const DEFAULT_SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_44F1VklC5ZfK3q1IFzdIJQ_e-1xUwJT'

/**
 * Public Supabase configuration.
 *
 * Supabase publishable keys are intentionally safe for browser/source-code use.
 * Environment variables override these project-specific public defaults so the
 * application can still be pointed at a different Supabase project in CI/UAT.
 * Server secrets (service-role/secret keys) must never be added here.
 */
export function getSupabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL ?? DEFAULT_SUPABASE_URL
}

export function getSupabasePublishableKey() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    DEFAULT_SUPABASE_PUBLISHABLE_KEY
  )
}
