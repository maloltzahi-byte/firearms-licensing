import { describe, expect, it } from 'vitest'
import { getScreeningConfig } from './screening-data'

describe('canonical screening data', () => {
  it('exposes exactly 15 criterion groups from routes.json', () => {
    expect(getScreeningConfig().criteria).toHaveLength(15)
  })

  it('exposes the 1,298 locality names only as strings', () => {
    const config = getScreeningConfig()
    expect(config.localities).toHaveLength(1298)
    expect(config.localities.every((value) => typeof value === 'string')).toBe(true)
  })

  it('reads age thresholds from the canonical route source', () => {
    const config = getScreeningConfig()
    expect(config.defaultAges).toEqual({ service: 21, civilService: 21, noService: 27, permanentResidentNoService: 45 })
    expect(config.specialUnitMinAge).toBe(18)
  })
})
