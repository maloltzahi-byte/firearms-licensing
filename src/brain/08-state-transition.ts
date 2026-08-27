import type {
  AuditEntry,
  CaseState,
  CaseStateId,
  NextAction,
} from '@/types/brain'
import { audit, cloneState } from './utils'

export type TransitionResult = {
  state: CaseState
  audit: AuditEntry[]
  actions: NextAction[]
}

export function suggestState(
  state: CaseState,
  missingDocuments: string[],
): TransitionResult {
  const next = cloneState(state)
  const openFlags = next.flags.filter((flag) => flag.status === 'open')

  let target: CaseStateId = next.state
  let trigger = 'no_change'

  if (!next.selectedRouteId) {
    target = 'QUESTIONNAIRE_COMPLETE'
    trigger = 'route_review_required'
  } else if (missingDocuments.length > 0) {
    target = 'DOCUMENTS_REQUESTED'
    trigger = 'documents_missing'
  } else if (openFlags.length > 0) {
    target = 'RISK_REVIEW'
    trigger = 'lawyer_review_required'
  } else {
    target = 'RISK_REVIEW'
    trigger = 'pre_filing_review_recommended'
  }

  next.state = target

  return {
    state: next,
    actions: [
      {
        kind: 'transition_state',
        target,
        trigger,
      },
    ],
    audit: [
      audit(
        8,
        'STATE_GUIDANCE_SUGGESTION',
        { from: state.state, missingDocuments, openFlags },
        { target, trigger, advisoryOnly: true },
      ),
    ],
  }
}
