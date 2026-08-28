import { describe, it, expect } from 'vitest'
import routes from '@/data/routes.json'

describe('R5: route count invariant', () => {
  it('exactly 45 routes exist', () => {
    expect(routes.routes.length).toBe(45)
  })

  it('exactly 15 criteria exist', () => {
    expect(routes.criteria.length).toBe(15)
  })

  it('every route id is unique', () => {
    const ids = routes.routes.map((r) => r.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('every route criterion_id belongs to a listed criterion', () => {
    const known = new Set(routes.criteria.map((c) => c.id))
    for (const r of routes.routes) expect(known.has(r.criterion_id)).toBe(true)
  })
})
