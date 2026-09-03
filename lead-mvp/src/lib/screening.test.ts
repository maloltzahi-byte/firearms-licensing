import { describe, expect, it } from 'vitest'
import { computeScreeningResult, type ScreeningAnswers } from './screening'
import type { ScreeningConfig } from './screening-data'

const config: ScreeningConfig = {
  criteria: [],
  localities: ['באר שבע'],
  defaultAges: { service: 21, civilService: 21, noService: 27, permanentResidentNoService: 45 },
  specialUnitMinAge: 18,
}

function answers(overrides: Partial<ScreeningAnswers> = {}): ScreeningAnswers {
  return {
    age: '27_44', hebrewBasic: 'YES', citizenship: 'CITIZEN', residencyYears: '3_PLUS', service: 'REGULAR',
    applicationStatus: 'NEW', policeBarrier: 'NONE_KNOWN', routeFamilies: ['HUNT_SPORT_PRO'], locality: '', criteria: [], unsure: false,
    ...overrides,
  }
}

describe('canonical five-step screening result', () => {
  it('returns green when the short-flow checks are met', () => {
    expect(computeScreeningResult(answers(), config)).toBe('green')
  })

  it('returns red below the no-service age threshold', () => {
    expect(computeScreeningResult(answers({ age: '21_26', service: 'NONE' }), config)).toBe('red')
  })

  it('returns red for an unsupported residency status', () => {
    expect(computeScreeningResult(answers({ citizenship: 'OTHER', residencyYears: null }), config)).toBe('red')
  })

  it('returns yellow when the route is unsure', () => {
    expect(computeScreeningResult(answers({ routeFamilies: ['UNSURE'] }), config)).toBe('yellow')
  })

  it('returns yellow when residence/work is selected without a locality', () => {
    expect(computeScreeningResult(answers({ routeFamilies: ['RESIDENCE_WORK'], locality: '' }), config)).toBe('yellow')
  })

  it('returns yellow for a permanent resident under three years', () => {
    expect(computeScreeningResult(answers({ citizenship: 'PERMANENT_RESIDENT', residencyYears: 'UNDER_3' }), config)).toBe('yellow')
  })

  it('keeps a known police/security barrier as a manual-review result', () => {
    expect(computeScreeningResult(answers({ policeBarrier: 'KNOWN' }), config)).toBe('yellow')
  })
})
