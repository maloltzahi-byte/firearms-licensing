/**
 * Guidance-brain types.
 *
 * The brain is advisory. It never determines legal eligibility and never
 * substitutes the lawyer's professional judgment.
 */

export type ServiceStatus =
  | 'combat_1yr'
  | 'regular_2yr'
  | 'civil_service'
  | 'no_service'
  | 'wounded_operational'
  | 'combat_medical_discharge'
  | 'unknown'

export type Citizenship =
  | 'citizen'
  | 'permanent_resident'
  | 'oleh'
  | 'unknown'

export type RiskSeverity = 'info' | 'warn' | 'block'
export type FlagStatus = 'open' | 'resolved'

export type ClientProfile = {
  fullNameHe: string
  idNumber: string
  dateOfBirth: string
  citizenship: Citizenship
  residenceYears: number
  serviceStatus: ServiceStatus
  serviceRole?: string
  serviceEndYear?: number
  city?: string
  hebrewLevel: 'native' | 'high' | 'basic' | 'insufficient'
  policeRecord: boolean
  activeRestrainingOrder: boolean
  mentalHealthRestriction: boolean
  existingLicense: 'none' | 'private' | 'special' | 'authorization_cert'
}

export type RouteFacts = Record<string, Record<string, unknown>>

export type DocumentStatus =
  | 'missing'
  | 'requested'
  | 'partial'
  | 'received'
  | 'verified'
  | 'rejected'

export type DocumentEntry = {
  documentId: string
  status: DocumentStatus
}

export type FlagEntry = {
  flagId: string
  severity: RiskSeverity
  status: FlagStatus
  note?: string
}

export type CaseStateId =
  | 'INTAKE_OPEN'
  | 'QUESTIONNAIRE_IN_PROGRESS'
  | 'QUESTIONNAIRE_COMPLETE'
  | 'HARD_GATE_FAILED'
  | 'HARD_GATE_PASSED'
  | 'ROUTE_SELECTED'
  | 'STRENGTHEN'
  | 'DOCUMENTS_REQUESTED'
  | 'DOCUMENTS_PARTIAL'
  | 'DOCUMENTS_COMPLETE'
  | 'RISK_REVIEW'
  | 'READY_TO_FILE'
  | 'FILED'
  | 'AWAITING_INTERVIEW'
  | 'INTERVIEW_SCHEDULED'
  | 'INTERVIEW_COMPLETED'
  | 'CONDITIONAL_APPROVAL'
  | 'TRAINING_PENDING'
  | 'LICENSE_ISSUED'
  | 'REJECTED'
  | 'APPEAL_FILED'
  | 'TRIBUNAL_ESCALATED'

export type CaseState = {
  caseId: string
  client: ClientProfile
  routeFacts: RouteFacts
  documents: DocumentEntry[]
  flags: FlagEntry[]
  state: CaseStateId
  selectedRouteId?: string
}

export type AuditEntry = {
  ruleId: string
  layer: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
  when: string
  input: unknown
  output: unknown
  flagsRaised: string[]
  flagsResolved: string[]
}

export type NextAction =
  | { kind: 'request_document'; documentId: string; reason?: string }
  | { kind: 'ask_question'; routeId: string; questionId: string; reason?: string }
  | { kind: 'lawyer_review'; reason: string }
  | { kind: 'verify_locality'; locality: string; reason: string }
  | { kind: 'review_route'; routeId: string; reason: string }
  | { kind: 'transition_state'; target: CaseStateId; trigger: string }

export type RouteScore = {
  routeId: string
  score: number
  reasoning: string
  missingDocuments: string[]
  openFlags: string[]
  answeredFacts: number
  positiveFacts: number
}

export type GuidanceLevel = 'promising' | 'needs_strengthening' | 'needs_review'

export type GuidanceSummary = {
  level: GuidanceLevel
  headline: string
  explanation: string
  lawyerNote: string
}

export type BrainOutput = {
  state: CaseState
  audit: AuditEntry[]
  nextActions: NextAction[]
  selectedRoute?: RouteScore
  alternatives: RouteScore[]
  allRouteScores: RouteScore[]
  guidance: GuidanceSummary
  requiredDocuments: string[]
  missingDocuments: string[]
  openFlags: FlagEntry[]
}
