import type { AuditEntry } from '@/types/brain'

export function emitAudit(...groups: AuditEntry[][]): AuditEntry[] {
  return groups.flat().sort((a, b) => a.layer - b.layer)
}
