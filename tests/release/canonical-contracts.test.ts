import { describe, expect, it } from 'vitest'
import contracts from '@/../stage11/screen-contracts.json'
import {
  CLIENT_SCREEN_BY_PATH,
  GUIDED_SCREEN_BY_ROUTE,
  OFFICE_SCREEN_BY_PATH,
  PUBLIC_SCREEN_BY_SLUG,
} from '@/lib/canonical'

describe('canonical screen inventory', () => {
  it('keeps the locked 98-screen inventory', () => {
    expect(contracts.count).toBe(98)
    expect(contracts.contracts).toHaveLength(98)
    expect(contracts.desktop).toBe(74)
    expect(contracts.mobile).toBe(19)
    expect(contracts.tablet).toBe(5)
  })

  it('maps every desktop contract to a reachable product surface', () => {
    const ids = new Set(contracts.contracts.map((contract) => contract.id))

    expect(ids.has('01')).toBe(true)
    for (const id of Object.values(PUBLIC_SCREEN_BY_SLUG)) expect(ids.has(id)).toBe(true)

    const guidedIds = Object.values(GUIDED_SCREEN_BY_ROUTE).map((index) => String(index + 15).padStart(2, '0'))
    for (const id of guidedIds) expect(ids.has(id)).toBe(true)

    for (const id of Object.values(CLIENT_SCREEN_BY_PATH)) expect(ids.has(String(id))).toBe(true)
    for (const id of Object.values(OFFICE_SCREEN_BY_PATH)) expect(ids.has(String(id))).toBe(true)
  })

  it('contains all responsive contracts', () => {
    const ids = new Set(contracts.contracts.map((contract) => contract.id))
    for (let screen = 75; screen <= 93; screen += 1) expect(ids.has(String(screen))).toBe(true)
    for (const tablet of ['T01', 'T02', 'T03', 'T04', 'T05']) expect(ids.has(tablet)).toBe(true)
  })
})
