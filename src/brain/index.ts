import type { BrainOutput, CaseState, NextAction } from '@/types/brain'
import { runIntake } from './01-intake'
import { runAgeMatrix } from './02-age-matrix'
import { runHardGateGuidance } from './03-hard-gate'
import { runFamilyCheck } from './04-family-check'
import { runRouteSelection } from './05-route-selection'
import { runDocumentChecklist } from './06-document-checklist'
import { runRiskReview } from './07-risk-review'
import { suggestState } from './08-state-transition'
import { emitAudit } from './09-audit-emit'

export function runBrain(input: CaseState): BrainOutput {
  const l1 = runIntake(input)
  const l2 = runAgeMatrix(l1.state)
  const l3 = runHardGateGuidance(l2.state)
  const l4 = runFamilyCheck(l3.state)
  const l5 = runRouteSelection(l4.state)

  const selectedRouteId = l5.selectedRoute?.routeId
  const stateWithRoute: CaseState = {
    ...l5.state,
    selectedRouteId: l5.state.selectedRouteId ?? selectedRouteId,
  }

  const l6 = runDocumentChecklist(stateWithRoute, selectedRouteId)
  const l7 = runRiskReview(l6.state)
  const l8 = suggestState(l7.state, l6.missingDocuments)

  const localityAction: NextAction[] =
    l8.state.client.city &&
    l8.state.flags.some(
      (flag) => flag.flagId === 'LOCALITY_UNVERIFIED' && flag.status === 'open',
    )
      ? [
          {
            kind: 'verify_locality',
            locality: l8.state.client.city,
            reason: 'היישוב טרם אומת מול המחשבון הרשמי.',
          },
        ]
      : []

  const routeAction: NextAction[] = l5.selectedRoute
    ? [
        {
          kind: 'review_route',
          routeId: l5.selectedRoute.routeId,
          reason: l5.selectedRoute.reasoning,
        },
      ]
    : []

  return {
    state: l8.state,
    selectedRoute: l5.selectedRoute,
    alternatives: l5.alternatives,
    allRouteScores: l5.allRouteScores,
    requiredDocuments: l6.requiredDocuments,
    missingDocuments: l6.missingDocuments,
    openFlags: l7.openFlags,
    guidance: l7.guidance,
    nextActions: [
      ...routeAction,
      ...localityAction,
      ...l6.actions,
      ...l7.actions,
      ...l8.actions,
    ],
    audit: emitAudit(
      l1.audit,
      l2.audit,
      l3.audit,
      l4.audit,
      l5.audit,
      l6.audit,
      l7.audit,
      l8.audit,
    ),
  }
}
