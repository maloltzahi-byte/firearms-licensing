import type { AuditEntry, CaseState } from '@/types/brain'
import { audit, cloneState, upsertFlag } from './utils'

export type GateResult = { state: CaseState; audit: AuditEntry[] }

export function runHardGateGuidance(state: CaseState): GateResult {
  const next = cloneState(state)
  const raised: string[] = []

  const add = (flagId: string, severity: 'info' | 'warn' | 'block', note: string) => {
    next.flags = upsertFlag(next.flags, flagId, severity, note)
    raised.push(flagId)
  }

  if (next.client.citizenship === 'unknown' || next.client.residenceYears < 3) {
    add('RESIDENCY_INSUFFICIENT', 'block', 'נדרש בירור מעמד ורצף שהייה; המנוע אינו מכריע.')
  }
  if (next.client.hebrewLevel === 'insufficient') {
    add('HEBREW_PROFICIENCY_INSUFFICIENT', 'warn', 'נדרשת בדיקה אנושית של יכולת הבנת הוראות.')
  }
  if (next.client.policeRecord) {
    add('POLICE_OBJECTION_POTENTIAL', 'warn', 'נדרש בירור פרטני; אין מסקנה אוטומטית.')
  }
  if (next.client.activeRestrainingOrder) {
    add('POLICE_OBJECTION_POTENTIAL', 'block', 'קיים צו פעיל; יש להפנות לבדיקת עורך דין.')
  }
  if (next.client.mentalHealthRestriction) {
    add('HEALTH_DECLARATION_MISSING', 'block', 'נדרשת בדיקה רפואית/משפטית פרטנית.')
  }
  if (next.client.existingLicense === 'special') {
    add('DUAL_LICENSE_CONFLICT', 'warn', 'נדרש לבדוק התאמה בין רישיון מיוחד לרישיון פרטי.')
  }

  return {
    state: next,
    audit: [
      audit(
        3,
        'HARD_GATE_ADVISORY_REVIEW',
        { client: next.client },
        { raised, terminal: false, lawyerDecisionRequired: raised.length > 0 },
        raised,
      ),
    ],
  }
}
