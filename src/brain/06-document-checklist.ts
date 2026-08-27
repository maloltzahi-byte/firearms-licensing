import routesData from '../../data/routes.json'
import type { AuditEntry, CaseState, NextAction } from '@/types/brain'
import { audit, documentStatus, isDocumentCovered } from './utils'

type RouteDefinition = {
  id: string
  required_documents: string[]
}

export type DocumentResult = {
  state: CaseState
  audit: AuditEntry[]
  requiredDocuments: string[]
  missingDocuments: string[]
  actions: NextAction[]
}

export function runDocumentChecklist(
  state: CaseState,
  selectedRouteId?: string,
): DocumentResult {
  const route = (routesData.routes as RouteDefinition[]).find(
    (item) => item.id === selectedRouteId,
  )
  const requiredDocuments = route?.required_documents ?? []
  const missingDocuments = requiredDocuments.filter(
    (id) => !isDocumentCovered(documentStatus(state.documents, id)),
  )
  const actions: NextAction[] = missingDocuments.map((documentId) => ({
    kind: 'request_document',
    documentId,
    reason: 'המסמך מופיע ברשימת הדרישות של המסלול המוביל וטרם אומת.',
  }))

  return {
    state,
    requiredDocuments,
    missingDocuments,
    actions,
    audit: [
      audit(
        6,
        'DOCUMENT_GUIDANCE_CHECKLIST',
        { selectedRouteId, documentCount: state.documents.length },
        { requiredDocuments, missingDocuments },
      ),
    ],
  }
}
