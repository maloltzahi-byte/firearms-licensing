import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'

type AppRole = 'client' | 'lawyer' | 'reviewer' | 'support' | 'admin'

export async function requireUser() {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase.auth.getClaims()
  const claims = data?.claims
  if (error || !claims?.sub) redirect('/login')
  return { supabase, claims }
}

export async function requireProfile() {
  const { supabase, claims } = await requireUser()
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, role, display_name, is_active')
    .eq('id', claims.sub)
    .maybeSingle()

  if (!profile?.is_active) redirect('/login?error=inactive')
  return { supabase, claims, profile: profile as typeof profile & { role: AppRole } }
}

export async function requireStaff() {
  const context = await requireProfile()
  if (!['lawyer', 'reviewer', 'support', 'admin'].includes(context.profile.role)) {
    redirect('/app')
  }
  return context
}

export async function requireLegalStaff() {
  const context = await requireProfile()
  if (!['lawyer', 'reviewer', 'admin'].includes(context.profile.role)) redirect('/app')
  return context
}

export async function requireAal2() {
  const context = await requireLegalStaff()
  const { data, error } = await context.supabase.auth.mfa.getAuthenticatorAssuranceLevel()
  if (error || data?.currentLevel !== 'aal2') redirect('/cockpit/mfa')
  return context
}