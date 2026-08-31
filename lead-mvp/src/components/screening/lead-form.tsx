'use client'

import { useActionState, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { track } from '@vercel/analytics'
import { initialLeadState, submitCallback, submitLead } from '@/app/check/result/actions'
import { useScreening } from './screening-provider'

function HiddenScreeningFields() {
  const { answers } = useScreening()
  return <>
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
}

function HomeLeadForm() {
  const [startedAt] = useState(() => Date.now())
  const [state, formAction, pending] = useActionState(submitCallback, initialLeadState)

  useEffect(() => {
    if (state.status === 'ok') track('lead_submitted', { placement: 'home' })
  }, [state.status])

  if (state.status === 'ok') return <div className="lead-success-final" role="status">הפרטים התקבלו. נחזור אליכם בהקדם.</div>

  return <form action={formAction} className="callback-form-final home-callback-form">
    <div className="callback-heading-final"><h2>רוצים שנחזור אליכם?</h2><p className="help">השאירו שם וטלפון ונחזור אליכם בהקדם האפשרי.</p></div>
    <div className="hp-field" aria-hidden="true"><input name="website" tabIndex={-1} autoComplete="off" /></div>
    <input type="hidden" name="startedAt" value={startedAt} />
    <input type="hidden" name="privacy" value="on" />
    <input type="hidden" name="source" value="home" />
    <div className="callback-row-final">
      <button className="callback-submit" type="submit" disabled={pending}>{pending ? 'שולחים…' : 'שלחו פרטים'}</button>
      <label className="callback-field-final"><span>טלפון</span><input name="phone" required inputMode="tel" autoComplete="tel" placeholder="050-0000000" /></label>
      <label className="callback-field-final"><span>שם מלא</span><input name="fullName" required minLength={2} maxLength={100} autoComplete="name" placeholder="הקלידו שם מלא" /></label>
    </div>
    <p className="callback-note">* בשליחה אני מאשר/ת את מדיניות הפרטיות ואת העברת פרטי הפנייה למשרד לצורך יצירת קשר.</p>
    {state.status === 'error' ? <p className="form-error" role="alert">{state.message}</p> : null}
  </form>
}

export function QuestionnaireLeadForm({ onBack }: { onBack: () => void }) {
  const router = useRouter()
  const { result } = useScreening()
  const [startedAt] = useState(() => Date.now())
  const [state, formAction, pending] = useActionState(submitLead, initialLeadState)

  useEffect(() => {
    if (state.status !== 'ok') return
    track('lead_submitted', { placement: 'questionnaire', result })
    track('screening_completed', { result })
    router.push('/check/result')
  }, [state.status, result, router])

  return <form action={formAction} className="screening-contact-form-final">
    <header className="question-title-final screening-contact-title-final">
      <h1>פרטים לחזרה</h1>
      <p>זהו השלב האחרון. מלאו שם וטלפון, ובשליחה תשובות השאלון ופרטי הקשר יועברו למשרד לצורך בדיקה וחזרה אליכם.</p>
    </header>

    <div className="hp-field" aria-hidden="true"><input name="website" tabIndex={-1} autoComplete="off" /></div>
    <input type="hidden" name="startedAt" value={startedAt} />
    <input type="hidden" name="privacy" value="on" />
    <HiddenScreeningFields />

    <div className="screening-contact-fields-final">
      <label className="screening-contact-field-final"><span>שם מלא</span><input name="fullName" required minLength={2} maxLength={100} autoComplete="name" placeholder="הקלידו שם מלא" /></label>
      <label className="screening-contact-field-final"><span>טלפון</span><input name="phone" required inputMode="tel" autoComplete="tel" placeholder="050-0000000" /></label>
    </div>

    <div className="screening-submit-note-final">בלחיצה על הכפתור יישלחו למשרד פרטי הקשר וכל התשובות שמילאתם בשאלון.</div>

    <div className="nav-final screening-contact-nav-final">
      <button className="nav-btn next" type="submit" disabled={pending}>{pending ? 'שולחים…' : 'שלחו והציגו תוצאה'}</button>
      <button className="nav-btn back" type="button" onClick={onBack} disabled={pending}>חזור</button>
    </div>
    <p className="callback-note">בשליחה אני מאשר/ת את מדיניות הפרטיות ואת העברת פרטי הפנייה ותשובות השאלון למשרד לצורך יצירת קשר ובדיקה ראשונית.</p>
    {state.status === 'error' ? <p className="form-error" role="alert">{state.message}</p> : null}
  </form>
}

export function LeadForm() {
  return <HomeLeadForm />
}
