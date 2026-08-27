'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function updatePassword(formData: FormData) {
  const parsed = z.string().min(10).max(128).safeParse(formData.get('password'))
  if (!parsed.success) redirect('/auth/update-password?error=invalid')
  const supabase = await createSupabaseServerClient()
  const { data } = await supabase.auth.getClaims()
  if (!data?.claims) redirect('/login')
  const { error } = await supabase.auth.updateUser({ password: parsed.data })
  if (error) redirect('/auth/update-password?error=invalid')
  redirect('/app')
}
