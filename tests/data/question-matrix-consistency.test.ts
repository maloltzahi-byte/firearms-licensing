import { describe, expect, it } from 'vitest'
import routes from '@/data/routes.json'
import questionnaireRoutes from '@/data/questionnaire-routes.json'

describe('route-specific questionnaire matrix', () => {
  it('covers exactly the canonical 45 routes', () => {
    const canonical = new Set(routes.routes.map((route) => route.id))
    const matrix = new Set(questionnaireRoutes.routes.map((route) => route.route_id))
    expect(matrix).toEqual(canonical)
  })

  it('gives every route at least one sourced question', () => {
    const canonical = new Set(routes.routes.map((route) => route.id))
    for (const route of questionnaireRoutes.routes) {
      expect(canonical.has(route.route_id)).toBe(true)
      expect(route.questions.length).toBeGreaterThan(0)
      for (const question of route.questions) {
        expect(question.source).toBe('data/routes.json')
        expect(question.required).toBe(true)
      }
    }
  })
})
