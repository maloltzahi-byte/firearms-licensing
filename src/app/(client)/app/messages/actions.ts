'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { requireProfile } from '@/lib/auth/guards'

export async function sendClientMessage(formData: FormData) {
  const caseId = z.string().uuid().parse(formData.get('caseId'))
  const body = z.string().trim().min(1).max(10000).parse(formData.get('body'))
  const { supabase, claims } = await requireProfile()
  await supabase.from('messages').insert({ case_id: caseId, sender_id: claims.sub, body, is_internal: false, channel: 'in_app' })
  revalidatePath('/app/messages')
}
