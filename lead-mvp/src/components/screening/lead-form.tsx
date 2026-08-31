'use client'

import { useActionState, useEffect, useState } from 'react'
import { track } from '@vercel/analytics'
import { initialLeadState, submitCallback, submitLead } from '@/app/check/result/actions'
import { useScreening } from './screening-provider'

type Variant = 'home' | 'result'

type SharedFormProps = {
  variant: Variant
  startedAt: number
  state: typeof initialLeadState
  formAction: (payload: FormData) => void
  pending: boolean
  screening?: React.ReactNode
}

function SharedLeadForm({ variant, startedAt, state, formAction, pending, screening = null }: SharedFormProps) {
  if (state.status === 'ok' || state.status === 'discarded') {
    return <div className="lead-success-final" role="status">הפרטים התקבלו. נחזור אליכם בהקדם.</div>
  }

  return <form action={formAction} className={`callback-form-final ${variant}-callback-form`}>
    <div className="callback-heading-final">
      <h2>רוצים שנחזור אליכם?</h2>
      <p className="help">{variant === 'home' ? 'השאירו שם וטלפון ונחזור אליכם בהקדם האפשרי.' : 'השאירו שם וטלפון ונחזור אליכם.'}</p>
    </div>
    <div className="hp-field" aria-hidden="true"><input name="website" tabIndex={-1} autoComplete="off" /></div>
    <input type="hidden" name="startedAt" value={startedAt} />
    <input type="hidden" name="privacy" value="on" />
    <input type="hidden" name="source" value={variant} />
    {screening}
    <div className="callback-row-final">
      <button className="callback-submit" type="submit" disabled={pending}>{pending ? 'שולחים…' : 'שלחו פרטים'}</button>
      <label className="callback-field-final"><span>טלפון</span><input name="phone" required inputMode="tel" autoComplete="tel" placeholder="050-0000000" /></label>
      <label className="callback-field-final"><span>שם מלא</span><input name="fullName" required minLength={2} maxLength={100} autoComplete="name" placeholder="הקלידו שם מלא" /></label>
    </div>
    <p className="callback-note">{variant === 'home' ? '* ' : ''}בשליחה אני מאשר/ת את מדיניות הפרטיות ואת העברת פרטי הפנייה למשרד לצורך יצירת קשר.</p>
    {state.status === 'error' ? <p className="form-error" role="alert">{state.message}</p> : null}
  </form>
}

function HomeLeadForm() {
  const [startedAt] = useState(() => Date.now())
  const [state, formAction, pending] = useActionState(submitCallback, initialLeadState)

  useEffect(() => {
    if (state.status === 'ok' || state.status === 'discarded') track('lead_submitted', { placement: 'home' })
  }, [state.status])

  return <SharedLeadForm variant="home" startedAt={startedAt} state={state} formAction={formAction} pending={pending} />
}

function ResultLeadForm() {
  const { answers, result } = useScreening()
  const [startedAt] = useState(() => Date.now())
  const [state, formAction, pending] = useActionState(submitLead, initialLeadState)

  useEffect(() => {
    if (state.status === 'ok' || state.status === 'discarded') track('lead_submitted', { result, placement: 'result' })
  }, [state.status, result])

  const screening = <>
    <input type="hidden" name="age" value={answers.age || ''} />
    <input type="hidden" name="citizenship" value={answers.citizenship || ''} />
    <input type="hidden" name="residencyYears" value={answers.residencyYears || ''} />
    <input type="hidden" name="service" value={answers.service || ''} />
    <input type="hidden" name="locality" value={answers.locality} />
    <input type="hidden" name="criteria" value={answers.criteria.join(',')} />
    <input type="hidden" name="unsure" value={String(answers.unsure)} />
    <input type="hidden" name="email" value="" />
    <input type="hidden" name="note" value="" />
  </>

  return <SharedLeadForm variant="result" startedAt={startedAt} state={state} formAction={formAction} pending={pending} screening={screening} />
}

export function LeadForm({ variant = 'home' }: { variant?: Variant }) {
  return variant === 'home' ? <HomeLeadForm /> : <ResultLeadForm />
}
