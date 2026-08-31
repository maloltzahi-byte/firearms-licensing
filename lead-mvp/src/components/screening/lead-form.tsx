'use client'

import { useActionState, useEffect, useState } from 'react'
import { track } from '@vercel/analytics'
import { initialLeadState, submitCallback, submitLead } from '@/app/check/result/actions'
import { useScreening } from './screening-provider'

type Variant = 'home' | 'result'

export function LeadForm({ variant = 'home' }: { variant?: Variant }) {
  const { answers, result } = useScreening()
  const [startedAt] = useState(() => Date.now())
  const action = variant === 'home' ? submitCallback : submitLead
  const [state, formAction, pending] = useActionState(action, initialLeadState)

  useEffect(() => {
    if (state.status === 'ok' || state.status === 'discarded') track('lead_submitted', { result, placement: variant })
  }, [state.status, result, variant])

  if (state.status === 'ok' || state.status === 'discarded') return <div className="lead-success-final" role="status">הפרטים התקבלו. נחזור אליכם בהקדם.</div>

  const screening = variant === 'result' ? <>
    <input type="hidden" name="age" value={answers.age || ''} />
    <input type="hidden" name="citizenship" value={answers.citizenship || ''} />
    <input type="hidden" name="residencyYears" value={answers.residencyYears || ''} />
    <input type="hidden" name="service" value={answers.service || ''} />
    <input type="hidden" name="locality" value={answers.locality} />
    <input type="hidden" name="criteria" value={answers.criteria.join(',')} />
    <input type="hidden" name="unsure" value={String(answers.unsure)} />
    <input type="hidden" name="email" value="" />
    <input type="hidden" name="note" value="" />
  </> : null

  return <form action={formAction} className={`callback-form-final ${variant}-callback-form`}>
    <div className="callback-heading-final"><h2>רוצים שנחזור אליכם?</h2><p className="help">{variant === 'home' ? 'השאירו שם וטלפון ונחזור אליכם בהקדם האפשרי.' : 'השאירו שם וטלפון ונחזור אליכם.'}</p></div>
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
