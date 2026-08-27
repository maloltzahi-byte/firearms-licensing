'use server'

import { redirect } from 'next/navigation'
import { requireProfile } from '@/lib/auth/guards'

export async function createCase() {
  const { supabase, claims } = await requireProfile()
  const { data, error } = await supabase
    .from('cases')
    .insert({
      client_user_id: claims.sub,
      created_by: claims.sub,
      request_type: 'new',
    })
    .select('id')
    .single()

  if (error || !data) redirect('/app?error=create-case')
  redirect(`/app/questionnaire/${data.id}`)
}
