import familyCheck from '../../data/family-check.json'
import type { AuditEntry, CaseState } from '@/types/brain'
import { audit, cloneState, isPositiveAnswer, upsertFlag } from './utils'

export type FamilyResult = { state: CaseState; audit: AuditEntry[] }

export function runFamilyCheck(state: CaseState): FamilyResult {
  const next = cloneState(state)
  const facts = next.routeFacts.__family__ ?? {}
  const raised: string[] = []

  for (const question of familyCheck.questions) {
    if (!isPositiveAnswer(facts[question.id])) continue
    next.flags = upsertFlag(
      next.flags,
      question.on_yes_flag,
      question.on_yes_severity as 'info' | 'warn' | 'block',
      question.he,
    )
    raised.push(question.on_yes_flag)
  }

  return {
    state: next,
    audit: [
      audit(4, 'FAMILY_GUIDANCE_REVIEW', facts, { raised, advisoryOnly: true }, raised),
    ],
  }
}
