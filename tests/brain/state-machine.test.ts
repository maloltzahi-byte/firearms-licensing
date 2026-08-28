import { describe, it, expect } from 'vitest'
import stateMachine from '@/data/state-machine.json'

describe('state machine data integrity', () => {
  it('has 22 states', () => {
    expect(stateMachine.states.length).toBe(22)
  })

  it('has exactly one initial state', () => {
    const initials = stateMachine.states.filter((s) => s.kind === 'initial')
    expect(initials.length).toBe(1)
    expect(initials[0]!.id).toBe('INTAKE_OPEN')
  })

  it('every transition references known states', () => {
    const ids = new Set(stateMachine.states.map((s) => s.id))
    for (const t of stateMachine.transitions) {
      expect(ids.has(t.from), `unknown from-state ${t.from}`).toBe(true)
      expect(ids.has(t.to), `unknown to-state ${t.to}`).toBe(true)
    }
  })

  it('READY_TO_FILE is reachable only from RISK_REVIEW (R7)', () => {
    const rtfIncoming = stateMachine.transitions.filter((t) => t.to === 'READY_TO_FILE')
    expect(rtfIncoming.length).toBe(1)
    expect(rtfIncoming[0]!.from).toBe('RISK_REVIEW')
    expect(rtfIncoming[0]!.trigger).toBe('no_open_warnings')
  })

  it('every terminal state has no outgoing transitions', () => {
    const terminals = stateMachine.states.filter((s) => s.terminal)
    for (const t of terminals) {
      const outgoing = stateMachine.transitions.filter((tr) => tr.from === t.id)
      expect(outgoing.length, `terminal ${t.id} has outgoing transitions`).toBe(0)
    }
  })
})
