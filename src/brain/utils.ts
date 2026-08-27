import type {
  AuditEntry,
  CaseState,
  DocumentEntry,
  FlagEntry,
  RiskSeverity,
} from '@/types/brain'

export function cloneState(state: CaseState): CaseState {
  return JSON.parse(JSON.stringify(state)) as CaseState
}

export function nowIso(): string {
  return new Date().toISOString()
}

export function audit(
  layer: AuditEntry['layer'],
  ruleId: string,
  input: unknown,
  output: unknown,
  flagsRaised: string[] = [],
  flagsResolved: string[] = [],
): AuditEntry {
  return {
    ruleId,
    layer,
    when: nowIso(),
    input,
    output,
    flagsRaised,
    flagsResolved,
  }
}

export function upsertFlag(
  flags: FlagEntry[],
  flagId: string,
  severity: RiskSeverity,
  note?: string,
): FlagEntry[] {
  const copy = [...flags]
  const index = copy.findIndex((f) => f.flagId === flagId)
  const entry: FlagEntry = { flagId, severity, status: 'open', note }
  if (index >= 0) copy[index] = entry
  else copy.push(entry)
  return copy
}

export function documentStatus(
  documents: DocumentEntry[],
  documentId: string,
): DocumentEntry['status'] {
  return documents.find((d) => d.documentId === documentId)?.status ?? 'missing'
}

export function isDocumentCovered(status: DocumentEntry['status']): boolean {
  return status === 'received' || status === 'verified'
}

export function isPositiveAnswer(value: unknown): boolean {
  if (value === true) return true
  if (typeof value === 'number') return value > 0
  if (typeof value !== 'string') return false
  const normalized = value.trim().toLowerCase()
  return [
    'כן',
    'yes',
    'true',
    'פעיל',
    'בתוקף',
    'verified',
    'מאומת',
  ].includes(normalized)
}
