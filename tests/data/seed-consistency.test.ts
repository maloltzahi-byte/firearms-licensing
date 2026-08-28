import { describe, it, expect } from 'vitest'
import routes from '@/data/routes.json'
import documents from '@/data/documents.json'
import localities from '@/data/localities.json'
import stateMachine from '@/data/state-machine.json'
import riskFlags from '@/data/risk-flags.json'
import familyCheck from '@/data/family-check.json'
import hardGate from '@/data/hard-gate.json'
import pdfMappings from '@/data/pdf-mappings.json'

describe('seed data consistency (SUMMARY.md source of truth)', () => {
  it('has exactly 15 criteria', () => {
    expect(routes.criteria).toHaveLength(15)
  })

  it('has exactly 45 routes (R5)', () => {
    expect(routes.routes).toHaveLength(45)
  })

  it('every criterion.route_ids maps to an existing route', () => {
    const known = new Set(routes.routes.map((r) => r.id))
    for (const c of routes.criteria) {
      for (const rid of c.route_ids) {
        expect(known.has(rid), `unknown route id ${rid} in criterion ${c.id}`).toBe(true)
      }
    }
  })

  it('every route.criterion_id maps to an existing criterion', () => {
    const known = new Set(routes.criteria.map((c) => c.id))
    for (const r of routes.routes) {
      expect(known.has(r.criterion_id), `unknown criterion ${r.criterion_id} in route ${r.id}`).toBe(true)
    }
  })

  it('has exactly 100 documents', () => {
    expect(documents.documents).toHaveLength(100)
  })

  it('every required_document in a route exists in documents.json', () => {
    const known = new Set(documents.documents.map((d) => d.id))
    for (const r of routes.routes) {
      for (const did of r.required_documents) {
        expect(known.has(did), `unknown document ${did} in route ${r.id}`).toBe(true)
      }
    }
  })

  it('has exactly 1298 localities (all UNVERIFIED, R4)', () => {
    expect(localities.localities).toHaveLength(1298)
    for (const l of localities.localities) expect(l.eligibility_status).toBe('UNVERIFIED')
  })

  it('has exactly 22 case states', () => {
    expect(stateMachine.states).toHaveLength(22)
  })

  it('has exactly 18 risk flags', () => {
    expect(riskFlags.flags).toHaveLength(18)
  })

  it('has exactly 5 family-check questions', () => {
    expect(familyCheck.questions).toHaveLength(5)
  })

  it('has exactly 9 immediate + 1 deferred hard-gate checks', () => {
    expect(hardGate.immediate).toHaveLength(9)
    expect(hardGate.deferred).toHaveLength(1)
  })

  it('has exactly 28 PDF mappings', () => {
    expect(pdfMappings.mappings).toHaveLength(28)
  })

  it('every PDF mapping route_id resolves to an existing route', () => {
    const known = new Set(routes.routes.map((r) => r.id))
    for (const m of pdfMappings.mappings) {
      expect(known.has(m.route_id), `unknown route ${m.route_id} in mapping ${m.id}`).toBe(true)
    }
  })
})
