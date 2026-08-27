'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { requireAal2, requireStaff } from '@/lib/auth/guards'

const gateState = z.enum(['REVIEW','NEEDS_INFO','BLOCK','APPROVED'])
const caseStatus = z.enum(['draft','needs_info','counsel_review','approved','blocked','submitted','authority_wait','interview','appeal','closed'])

export async function setDecisionGate(formData: FormData) {
  const caseId = z.string().uuid().parse(formData.get('caseId'))
  const state = gateState.parse(formData.get('state'))
  const rationale = z.string().trim().min(8).max(4000).parse(formData.get('rationale'))
  const { supabase } = await requireAal2()
  await supabase.rpc('set_case_decision_gate', { p_case_id: caseId, p_state: state, p_rationale: rationale })
  revalidatePath(`/cockpit/cases/${caseId}`)
}

export async function setCaseStatus(formData: FormData) {
  const caseId = z.string().uuid().parse(formData.get('caseId'))
  const status = caseStatus.parse(formData.get('status'))
  const nextAction = z.string().trim().max(2000).parse(formData.get('nextAction') ?? '')
  const { supabase } = await requireAal2()
  await supabase.rpc('set_case_status', { p_case_id: caseId, p_status: status, p_next_action: nextAction || null })
  revalidatePath(`/cockpit/cases/${caseId}`)
}

export async function addTask(formData: FormData) {
  const caseId = z.string().uuid().parse(formData.get('caseId'))
  const title = z.string().trim().min(1).max(500).parse(formData.get('title'))
  const { supabase, claims } = await requireStaff()
  await supabase.from('tasks').insert({ case_id: caseId, title, created_by: claims.sub })
  revalidatePath(`/cockpit/cases/${caseId}`)
}
