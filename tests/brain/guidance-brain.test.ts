import { describe, expect, it } from 'vitest'
import { runBrain } from '@/brain'
import type { CaseState } from '@/types/brain'

const baseCase: CaseState = {
  caseId: 'case-1',
  client: {
    fullNameHe: '  ישראל   ישראלי ',
    idNumber: '123-456-789',
    dateOfBirth: '1990-01-01',
    citizenship: 'citizen',
    residenceYears: 10,
    serviceStatus: 'regular_2yr',
    city: ' באר שבע ',
    hebrewLevel: 'native',
    policeRecord: false,
    activeRestrainingOrder: false,
    mentalHealthRestriction: false,
    existingLicense: 'none',
  },
  routeFacts: {
    residence: {
      centerOfLife: 'כן',
      localityVerified: 'כן',
    },
  },
  documents: [],
  flags: [],
  state: 'QUESTIONNAIRE_COMPLETE',
  selectedRouteId: 'residence',
}

describe('guidance brain', () => {
  it('returns advisory guidance and never an eligibility verdict', () => {
    const output = runBrain(baseCase)
    expect(output.selectedRoute?.routeId).toBe('residence')
    expect(output.alternatives).toHaveLength(3)
    expect(output.guidance.headline).not.toMatch(/זכאי|אינו זכאי/)
    expect(output.audit.length).toBeGreaterThanOrEqual(8)
  })

  it('normalizes intake values', () => {
    const output = runBrain(baseCase)
    expect(output.state.client.fullNameHe).toBe('ישראל ישראלי')
    expect(output.state.client.idNumber).toBe('123456789')
    expect(output.state.client.city).toBe('באר שבע')
  })

  it('requests missing documents without rejecting the case', () => {
    const output = runBrain(baseCase)
    expect(output.missingDocuments.length).toBeGreaterThan(0)
    expect(output.nextActions.some((a) => a.kind === 'request_document')).toBe(true)
    expect(output.state.state).toBe('DOCUMENTS_REQUESTED')
  })

  it('surfaces gate issues for lawyer review rather than deciding the case', () => {
    const output = runBrain({
      ...baseCase,
      client: {
        ...baseCase.client,
        dateOfBirth: '2015-01-01',
      },
    })
    expect(output.openFlags.some((f) => f.flagId === 'AGE_UNDER_THRESHOLD')).toBe(true)
    expect(output.guidance.level).toBe('needs_review')
    expect(output.nextActions.some((a) => a.kind === 'lawyer_review')).toBe(true)
  })
})
