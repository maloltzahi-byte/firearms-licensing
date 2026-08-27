import type { CaseState, RouteScore } from '@/types/brain'
import { documentStatus, isDocumentCovered, isPositiveAnswer } from './utils'

export type RouteDefinition = {
  id: string
  criterion_id: string
  he: string
  description: string
  regulatory_ref: string
  required_documents: string[]
}

export function scoreRoute(route: RouteDefinition, state: CaseState): RouteScore {
  const facts = state.routeFacts[route.id] ?? {}
  const values = Object.values(facts)
  const answeredFacts = values.filter((v) => v !== '' && v !== null && v !== undefined).length
  const positiveFacts = values.filter(isPositiveAnswer).length

  const required = route.required_documents ?? []
  const covered = required.filter((id) =>
    isDocumentCovered(documentStatus(state.documents, id)),
  )
  const missingDocuments = required.filter(
    (id) => !isDocumentCovered(documentStatus(state.documents, id)),
  )

  let score = 15
  if (state.selectedRouteId === route.id) score += 35
  score += Math.min(25, positiveFacts * 10)
  score += Math.min(15, answeredFacts * 3)
  if (required.length > 0) score += Math.round((covered.length / required.length) * 10)

  const routeFlags = state.flags
    .filter((f) => f.status === 'open')
    .map((f) => f.flagId)

  score -= routeFlags.filter((id) => id === 'LOCALITY_UNVERIFIED').length * 5
  score -= routeFlags.filter((id) => id === 'TENURE_INSUFFICIENT').length * 8
  score = Math.max(0, Math.min(100, score))

  const reasoningParts: string[] = []
  if (state.selectedRouteId === route.id) reasoningParts.push('הלקוח בחר במסלול זה')
  if (positiveFacts > 0) reasoningParts.push(`נמצאו ${positiveFacts} תשובות תומכות`)
  if (answeredFacts === 0) reasoningParts.push('טרם נאספו שאלות עומק למסלול')
  if (missingDocuments.length > 0) reasoningParts.push(`חסרים ${missingDocuments.length} מסמכים`)
  if (covered.length > 0) reasoningParts.push(`${covered.length} מסמכים כבר מכוסים`)

  return {
    routeId: route.id,
    score,
    reasoning: reasoningParts.join(' · ') || 'נדרש איסוף נתונים נוסף',
    missingDocuments,
    openFlags: routeFlags,
    answeredFacts,
    positiveFacts,
  }
}
