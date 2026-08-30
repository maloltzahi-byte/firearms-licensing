import { describe, expect, it } from 'vitest'
import { computeScreeningResult, type ScreeningAnswers } from './screening'
import type { ScreeningConfig } from './screening-data'

const config: ScreeningConfig = {
  criteria: [{ id: 'idf_service', he: 'שירות בכוחות הביטחון', route_ids: ['idf-special-unit-fighter'] }, { id: 'sports', he: 'ספורטאי יורה פעיל', route_ids: ['sports-olympic'] }],
  localities: ['באר שבע'],
  defaultAges: { service: 21, civilService: 21, noService: 27, permanentResidentNoService: 45 },
  specialUnitMinAge: 18,
}

function answers(overrides: Partial<ScreeningAnswers> = {}): ScreeningAnswers {
  return { age: '27_44', citizenship: 'CITIZEN', residencyYears: null, service: 'REGULAR', locality: 'באר שבע', criteria: ['sports'], unsure: false, ...overrides }
}

describe('screening result', () => {
  it('returns green when the basic age, status and criterion checks are met', () => {
    expect(computeScreeningResult(answers(), config)).toBe('green')
  })

  it('returns red below the no-service age threshold', () => {
    expect(computeScreeningResult(answers({ age: '21_26', service: 'NONE' }), config)).toBe('red')
  })

  it('returns red for other citizenship or residency status', () => {
    expect(computeScreeningResult(answers({ citizenship: 'OTHER' }), config)).toBe('red')
  })

  it('returns yellow when the user is unsure about a criterion', () => {
    expect(computeScreeningResult(answers({ criteria: [], unsure: true }), config)).toBe('yellow')
  })

  it('keeps the age-18 special-unit possibility yellow rather than declaring eligibility', () => {
    expect(computeScreeningResult(answers({ age: '18_20', service: 'COMBAT', criteria: ['idf_service'] }), config)).toBe('yellow')
  })

  it('returns yellow for a permanent resident under three years', () => {
    expect(computeScreeningResult(answers({ citizenship: 'PERMANENT_RESIDENT', residencyYears: 'UNDER_3' }), config)).toBe('yellow')
  })

  it('keeps an unspecified exemption or special service status yellow without collecting a medical reason', () => {
    expect(computeScreeningResult(answers({ service: 'SPECIAL_STATUS' }), config)).toBe('yellow')
  })
})
