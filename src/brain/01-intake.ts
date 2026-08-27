import type { AuditEntry, CaseState } from '@/types/brain'
import { audit, cloneState } from './utils'

export type LayerResult = { state: CaseState; audit: AuditEntry[] }

function normalizeText(value?: string): string | undefined {
  if (value == null) return value
  return value.trim().replace(/\s+/g, ' ')
}

export function runIntake(state: CaseState): LayerResult {
  const next = cloneState(state)
  const before = {
    fullNameHe: next.client.fullNameHe,
    idNumber: next.client.idNumber,
    city: next.client.city,
  }

  next.client.fullNameHe = normalizeText(next.client.fullNameHe) ?? ''
  next.client.idNumber = next.client.idNumber.replace(/\D/g, '')
  next.client.city = normalizeText(next.client.city)

  return {
    state: next,
    audit: [
      audit(1, 'INTAKE_NORMALIZED', before, {
        fullNameHe: next.client.fullNameHe,
        idNumber: next.client.idNumber,
        city: next.client.city,
      }),
    ],
  }
}
