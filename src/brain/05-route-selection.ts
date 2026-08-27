import routesData from '../../data/routes.json'
import type { AuditEntry, CaseState, RouteScore } from '@/types/brain'
import { audit } from './utils'
import { scoreRoute, type RouteDefinition } from './route-scoring'

export type RouteSelectionResult = {
  state: CaseState
  audit: AuditEntry[]
  selectedRoute?: RouteScore
  alternatives: RouteScore[]
  allRouteScores: RouteScore[]
}

export function runRouteSelection(state: CaseState): RouteSelectionResult {
  const allRouteScores = (routesData.routes as RouteDefinition[])
    .map((route) => scoreRoute(route, state))
    .sort((a, b) => b.score - a.score || a.routeId.localeCompare(b.routeId))

  const selectedRoute =
    allRouteScores.find((route) => route.routeId === state.selectedRouteId) ??
    allRouteScores[0]

  const alternatives = allRouteScores
    .filter((route) => route.routeId !== selectedRoute?.routeId)
    .slice(0, 3)

  return {
    state,
    selectedRoute,
    alternatives,
    allRouteScores,
    audit: [
      audit(
        5,
        'ROUTE_GUIDANCE_RANKING',
        {
          selectedRouteId: state.selectedRouteId,
          routeFactKeys: Object.keys(state.routeFacts),
        },
        {
          selectedRoute,
          alternatives,
          advisoryOnly: true,
          routeCount: allRouteScores.length,
        },
      ),
    ],
  }
}
