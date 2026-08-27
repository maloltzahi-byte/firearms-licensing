import type { AuditEntry, CaseState, ServiceStatus } from '@/types/brain'
import { audit, cloneState, upsertFlag } from './utils'

export type AgeResult = {
  state: CaseState
  audit: AuditEntry[]
  age: number | null
  suggestedMinimumAge: number
}

export function calculateAge(dateOfBirth: string, today = new Date()): number | null {
  const birth = new Date(dateOfBirth)
  if (Number.isNaN(birth.getTime())) return null
  let age = today.getFullYear() - birth.getFullYear()
  const monthDelta = today.getMonth() - birth.getMonth()
  if (monthDelta < 0 || (monthDelta === 0 && today.getDate() < birth.getDate())) age--
  return age
}

export function minimumAge(
  serviceStatus: ServiceStatus,
  citizenship: CaseState['client']['citizenship'],
): number {
  if (serviceStatus === 'wounded_operational' || serviceStatus === 'combat_medical_discharge') return 18
  if (serviceStatus === 'combat_1yr' || serviceStatus === 'regular_2yr' || serviceStatus === 'civil_service') return 21
  if (citizenship === 'permanent_resident') return 45
  return 27
}

export function runAgeMatrix(state: CaseState): AgeResult {
  const next = cloneState(state)
  const age = calculateAge(next.client.dateOfBirth)
  const suggestedMinimumAge = minimumAge(next.client.serviceStatus, next.client.citizenship)
  const raised: string[] = []

  if (age == null || age < suggestedMinimumAge) {
    next.flags = upsertFlag(
      next.flags,
      'AGE_UNDER_THRESHOLD',
      'block',
      age == null
        ? 'תאריך הלידה אינו מאפשר חישוב גיל; נדרשת בדיקת עורך דין.'
        : `הגיל המחושב הוא ${age}; סף ההכוונה המחושב הוא ${suggestedMinimumAge}.`,
    )
    raised.push('AGE_UNDER_THRESHOLD')
  }

  return {
    state: next,
    age,
    suggestedMinimumAge,
    audit: [
      audit(
        2,
        'AGE_MATRIX_GUIDANCE',
        {
          dateOfBirth: next.client.dateOfBirth,
          serviceStatus: next.client.serviceStatus,
          citizenship: next.client.citizenship,
        },
        { age, suggestedMinimumAge, advisoryOnly: true },
        raised,
      ),
    ],
  }
}
