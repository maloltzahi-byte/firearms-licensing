'use client'

import { useActionState, useEffect, useState } from 'react'
import { track } from '@vercel/analytics'
import { initialLeadState, submitCallback, submitLead } from '@/app/check/result/actions'
import { useScreening } from './screening-provider'

function HiddenScreeningFields() {
  const { answers } = useScreening()
  return <>
    <input type="hidden" name="age" value={answers.age || ''} />
    <input type="hidden" name="hebrewBasic" value={answers.hebrewBasic || ''} />
    <input type="hidden" name="citizenship" value={answers.citizenship || ''} />
    <input type="hidden" name="residencyYears" value={answers.residencyYears || ''} />
    <input type="hidden" name="service" value={answers.service || ''} />
    <input type="hidden" name="applicationStatus" value={answers.applicationStatus || ''} />
    <input type="hidden" name="policeBarrier" value={answers.policeBarrier || ''} />
    <input type="hidden" name="routeFamilies" value={answers.routeFamilies.join(',')} />
    <input type="hidden" name="locality" value={answers.locality} />
    <input type="hidden" name="criteria" value="" />
    <input type="hidden" name="unsure" value={String(answers.routeFamilies.includes('UNSURE'))} />
    <input type="hidden" name="email" value="" />
    <input type="hidden" name="note" value="" />
  </>
}

function HomeLeadForm() {
  const [startedAt] = useState(() => Date.now())
  const [state, formAction, pending] = useActionState(submitCallback, initialLeadState)
  useEffect(() => { if (state.status === 'ok') track('lead_submitted', { placement: 'home' }) }, [state.status])

  if (state.status === 'ok') return <div className="rc-home-callback"><div className="lead-success-final" role="status">הפרטים התקבלו. נחזור אליכם בהקדם.</div></div>

  return <form action={formAction} className="callback-form-final home-callback-form rc-home-callback">
    <div className="callback-heading-final"><h2>השאירו פרטים<br/>ונחזור אליכם.</h2><p className="help">שם וטלפון בלבד. אין צורך למסור כאן פרטים רגישים.</p></div>
    <div className="hp-field" aria-hidden="true"><input name="website" tabIndex={-1} autoComplete="off" /></div>
    <input type="hidden" name="startedAt" value={startedAt} /><input type="hidden" name="privacy" value="on" /><input type="hidden" name="source" value="home" />
    <div className="callback-row-final">
      <label className="callback-field-final"><span>שם מלא</span><input name="fullName" required minLength={2} maxLength={100} autoComplete="name" placeholder="הקלידו שם מלא" /></label>
      <label className="callback-field-final"><span>טלפון</span><input name="phone" required inputMode="tel" autoComplete="tel" placeholder="050-0000000" /></label>
      <button className="callback-submit" type="submit" disabled={pending}>{pending ? 'שולחים…' : 'שלחו פרטים'}</button>
    </div>
    <p className="callback-note">הפרטים ישמשו לצורך חזרה אליכם בלבד.</p>
    {state.status === 'error' ? <p className="form-error" role="alert">{state.message}</p> : null}
  </form>
}

export function ResultLeadForm() {
  const { result } = useScreening()
  const [startedAt] = useState(() => Date.now())
  const [state, formAction, pending] = useActionState(submitLead, initialLeadState)
  useEffect(() => { if (state.status === 'ok') track('lead_submitted', { placement: 'result', result }) }, [state.status, result])

  if (state.status === 'ok') return <div className="rc-result-callback"><div className="lead-success-final" role="status">הפרטים התקבלו. נחזור אליכם בהקדם.</div></div>

  return <form action={formAction} className="callback-form-final rc-result-callback">
    <div className="callback-heading-final"><h2>רוצים שנחזור אליכם?</h2><p className="help">השאירו שם וטלפון ונחזור אליכם.</p></div>
    <div className="hp-field" aria-hidden="true"><input name="website" tabIndex={-1} autoComplete="off" /></div>
    <input type="hidden" name="startedAt" value={startedAt} /><input type="hidden" name="privacy" value="on" /><HiddenScreeningFields />
    <div className="callback-row-final">
      <button className="callback-submit" type="submit" disabled={pending}>{pending ? 'שולחים…' : 'שלחו פרטים'}</button>
      <label className="callback-field-final"><span>טלפון</span><input name="phone" required inputMode="tel" autoComplete="tel" placeholder="050-0000000" /></label>
      <label className="callback-field-final"><span>שם מלא</span><input name="fullName" required minLength={2} maxLength={100} autoComplete="name" placeholder="הקלידו שם מלא" /></label>
    </div>
    <p className="callback-note">בשליחה אני מאשר/ת את מדיניות הפרטיות ואת העברת פרטי הפנייה למשרד לצורך יצירת קשר.</p>
    {state.status === 'error' ? <p className="form-error" role="alert">{state.message}</p> : null}
  </form>
}

export function LeadForm() { return <HomeLeadForm /> }
