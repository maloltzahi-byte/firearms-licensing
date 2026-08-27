/**
 * Domain types — mirror the Postgres schema in supabase/migrations/0001_initial.sql.
 *
 * Generated types (via `supabase gen types typescript`) will replace this file
 * once the schema is applied to the project. For now, hand-written skeletons.
 */

export type ClientRow = {
  id: string
  full_name_he: string
  id_number: string
  phone: string | null
  email: string | null
  city: string | null
  date_of_birth: string | null
  service_status: string
  citizenship: string
  created_at: string
  updated_at: string
}

export type CaseRow = {
  id: string
  client_id: string
  case_number: string
  state: string
  selected_route_id: string | null
  legal_fit_score: number | null
  assigned_to: string | null
  sla_days_in_state: number
  created_at: string
  updated_at: string
}

export type RouteFactsRow = {
  case_id: string
  route_id: string
  question_id: string
  answer: unknown
  source: 'client_input' | 'document_extract' | 'lawyer_override'
  recorded_at: string
}

export type CaseDocumentRow = {
  id: string
  case_id: string
  document_id: string
  status: 'missing' | 'requested' | 'partial' | 'received' | 'verified' | 'rejected'
  storage_path: string | null
  sha256: string | null
  uploaded_at: string | null
  verified_at: string | null
  verified_by: string | null
}

export type RiskFlagRow = {
  id: string
  case_id: string
  flag_id: string
  severity: 'info' | 'warn' | 'block'
  status: 'open' | 'resolved'
  note: string | null
  raised_at: string
  resolved_at: string | null
}

export type AuditLogRow = {
  id: string
  case_id: string | null
  actor_id: string
  event: string
  payload: Record<string, unknown>
  at: string
}
