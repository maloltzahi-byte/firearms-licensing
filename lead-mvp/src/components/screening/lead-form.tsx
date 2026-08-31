'use client'

import Link from 'next/link'
import { useActionState, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { track } from '@vercel/analytics'
import { initialLeadState, submitLead } from '@/app/check/result/actions'
import { useScreening } from './screening-provider'

type LeadFormProps = {
  compact?: boolean
  startedAt?: number
}

export function LeadForm({ compact = false, startedAt: externalStartedAt }: LeadFormProps) {
  const router = useRouter()
  const { answers, result } = useScreening()
  const [localStartedAt] = useState(() => Date.now())
  const startedAt = externalStartedAt ?? localStartedAt
  const [state, formAction, pending] = useActionState(submitLead, initialLeadState)

  useEffect(() => {
    if (state.status === 'ok' || state.status === 'discarded') {
      track('lead_submitted', { result, placement: compact ? 'screening_q5' : 'default' })
      if (!compact) router.push('/thanks')
    }
  }, [state.status, result, router, compact])

  const hiddenFields = <>
    <div className="hp-field" aria-hidden="true"><label htmlFor={compact ? 'website-q5' : 'website'}>אתר</label><input id={compact ? 'website-q5' : 'website'} name="website" type="text" tabIndex={-1} autoComplete="off" /></div>
    <input type="hidden" name="startedAt" value={startedAt} />
    <input type="hidden" name="age" value={answers.age || ''} />
    <input type="hidden" name="citizenship" value={answers.citizenship || ''} />
    <input type="hidden" name="residencyYears" value={answers.residencyYears || ''} />
    <input type="hidden" name="service" value={answers.service || ''} />
    <input type="hidden" name="locality" value={answers.locality} />
    <input type="hidden" name="criteria" value={answers.criteria.join(',')} />
    <input type="hidden" name="unsure" value={String(answers.unsure)} />
  </>

  if (compact && (state.status === 'ok' || state.status === 'discarded')) {
    return <div className="q5-lead-success" role="status"><strong>הפרטים התקבלו.</strong><span>נחזור אליכם בהקדם. אפשר להמשיך גם להצגת התוצאה הראשונית.</span></div>
  }

  if (compact) {
    return (
      <form action={formAction} className="q5-lead-form">
        <div className="q5-lead-heading"><h2>רוצים שנחזור אליכם?</h2><p>השאירו שם וטלפון בלבד. תשובות הבדיקה יצורפו לפנייה באופן אוטומטי.</p></div>
        {hiddenFields}
        <input type="hidden" name="email" value="" />
        <input type="hidden" name="note" value="" />
        <div className="q5-lead-grid">
          <div className="q5-lead-field"><label htmlFor="fullName-q5">שם מלא</label><input id="fullName-q5" name="fullName" required minLength={2} maxLength={100} autoComplete="name" /></div>
          <div className="q5-lead-field"><label htmlFor="phone-q5">טלפון</label><input id="phone-q5" name="phone" required inputMode="tel" autoComplete="tel" /></div>
          <button className="q5-lead-submit" type="submit" disabled={pending}>{pending ? 'שולחים…' : 'חזרו אליי'}</button>
        </div>
        <label className="q5-privacy-check"><input type="checkbox" name="privacy" required /><span>אני מאשר/ת את <Link href="/privacy" target="_blank" rel="noreferrer">מדיניות הפרטיות</Link> ואת העברת פרטי הפנייה למשרד לצורך יצירת קשר.</span></label>
        {state.status === 'error' ? <p className="form-error" role="alert">{state.message}</p> : null}
      </form>
    )
  }

  return (
    <form action={formAction} className="lead-form">
      <h2>רוצים שנבדוק לעומק?</h2>
      <p className="question-help">השאירו פרטים ונחזור אליכם. אין צורך לציין בהערה מידע רפואי, עבר פלילי או מספר תעודת זהות.</p>
      {hiddenFields}
      <div className="form-grid">
        <div className="field-group"><label htmlFor="fullName">שם מלא</label><input className="field" id="fullName" name="fullName" required minLength={2} maxLength={100} autoComplete="name" /></div>
        <div className="field-group"><label htmlFor="phone">טלפון</label><input className="field" id="phone" name="phone" required inputMode="tel" autoComplete="tel" /></div>
        <div className="field-group full"><label htmlFor="email">אימייל</label><input className="field" id="email" name="email" type="email" required maxLength={254} autoComplete="email" /></div>
        <div className="field-group full"><label htmlFor="note">הערה, לא חובה</label><textarea className="textarea" id="note" name="note" maxLength={500} /></div>
      </div>
      <label className="privacy-check"><input type="checkbox" name="privacy" required /><span>קראתי ואני מאשר/ת את <Link href="/privacy" target="_blank" rel="noreferrer" style={{textDecoration:'underline'}}>מדיניות הפרטיות</Link> ואת שליחת פרטי הפנייה למשרד.</span></label>
      <button className="button-primary" type="submit" disabled={pending}>{pending ? 'שולחים…' : 'שליחת הפנייה'}</button>
      {state.status === 'error' ? <p className="form-error" role="alert">{state.message}</p> : null}
    </form>
  )
}
