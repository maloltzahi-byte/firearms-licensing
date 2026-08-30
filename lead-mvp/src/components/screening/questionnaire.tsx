'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { track } from '@vercel/analytics'
import { useScreening } from './screening-provider'
import { labels, type AgeBand, type Citizenship, type ResidencyYears, type Service } from '@/lib/screening'

const TOTAL = 5

export function Questionnaire() {
  const router = useRouter()
  const { answers, setAnswers, config, result } = useScreening()
  const [step, setStep] = useState(1)
  const [query, setQuery] = useState(answers.locality)
  const [localityError, setLocalityError] = useState('')

  const suggestions = useMemo(() => {
    const q = query.trim()
    if (!q) return []
    return config.localities.filter((name) => name.includes(q)).slice(0, 8)
  }, [config.localities, query])

  function markStepComplete() {
    track('screening_step', { step })
  }

  function next() {
    if (step === 4) {
      const normalized = config.localities.find((name) => name === query.trim())
      if (!normalized) {
        setLocalityError('יש לבחור יישוב מתוך רשימת ההשלמה האוטומטית.')
        return
      }
      setAnswers((current) => ({ ...current, locality: normalized }))
    }
    markStepComplete()
    if (step < TOTAL) setStep((current) => current + 1)
    else {
      track('screening_completed', { result })
      router.push('/check/result')
    }
  }

  function canContinue() {
    if (step === 1) return Boolean(answers.age)
    if (step === 2) return Boolean(answers.citizenship) && (answers.citizenship !== 'PERMANENT_RESIDENT' || Boolean(answers.residencyYears))
    if (step === 3) return Boolean(answers.service)
    if (step === 4) return Boolean(query.trim())
    return answers.unsure || answers.criteria.length > 0
  }

  function toggleCriterion(id: string) {
    setAnswers((current) => ({ ...current, unsure: false, criteria: current.criteria.includes(id) ? current.criteria.filter((item) => item !== id) : [...current.criteria, id] }))
  }

  return (
    <main id="main" className="check-shell">
      <div className="progress-wrap" aria-label={`שלב ${step} מתוך ${TOTAL}`}>
        <div className="progress-row"><span>בדיקה ראשונית</span><span>{step} / {TOTAL}</span></div>
        <div className="progress-track"><div className="progress-fill" style={{ width: `${(step / TOTAL) * 100}%` }} /></div>
      </div>
      <section className="question-card">
        {step === 1 ? <>
          <h1>מה טווח הגיל שלך?</h1><p className="question-help">אין צורך בתאריך לידה מדויק.</p>
          <div className="option-list">{Object.entries(labels.age).map(([value,label]) => <button type="button" className="option-button" aria-pressed={answers.age===value} key={value} onClick={() => setAnswers((c)=>({...c,age:value as AgeBand}))}>{label}</button>)}</div>
        </> : null}
        {step === 2 ? <>
          <h1>מה המעמד שלך בישראל?</h1><p className="question-help">המידע משמש לסינון ראשוני בלבד.</p>
          <div className="option-list">{Object.entries(labels.citizenship).map(([value,label]) => <button type="button" className="option-button" aria-pressed={answers.citizenship===value} key={value} onClick={() => setAnswers((c)=>({...c,citizenship:value as Citizenship,residencyYears:value==='PERMANENT_RESIDENT'?c.residencyYears:null}))}>{label}</button>)}</div>
          {answers.citizenship === 'PERMANENT_RESIDENT' ? <div style={{marginTop:24}}><h2 style={{fontSize:20}}>כמה שנים אתה מתגורר בישראל?</h2><div className="option-list">{Object.entries(labels.residency).map(([value,label]) => <button type="button" className="option-button" aria-pressed={answers.residencyYears===value} key={value} onClick={() => setAnswers((c)=>({...c,residencyYears:value as ResidencyYears}))}>{label}</button>)}</div></div> : null}
        </> : null}
        {step === 3 ? <>
          <h1>איזה שירות ביצעת?</h1><p className="question-help">בחרו את האפשרות שמתארת בצורה הטובה ביותר את מצבכם.</p>
          <div className="option-list">{Object.entries(labels.service).map(([value,label]) => <button type="button" className="option-button" aria-pressed={answers.service===value} key={value} onClick={() => setAnswers((c)=>({...c,service:value as Service}))}>{label}</button>)}</div>
        </> : null}
        {step === 4 ? <>
          <h1>מה יישוב המגורים שלך?</h1><p className="question-help">היישוב משמש לנרמול שם בלבד. האתר אינו קובע אם היישוב מזכה ברישיון.</p>
          <div className="locality-wrap"><label htmlFor="locality" className="hp-field">יישוב מגורים</label><input id="locality" className="field" value={query} autoComplete="off" onChange={(e)=>{setQuery(e.target.value);setLocalityError('')}} placeholder="התחילו להקליד שם יישוב" />{suggestions.length>0 && !config.localities.includes(query.trim()) ? <ul className="suggestions">{suggestions.map((name)=><li key={name}><button type="button" onClick={()=>{setQuery(name);setAnswers((c)=>({...c,locality:name}));setLocalityError('')}}>{name}</button></li>)}</ul>:null}</div>
          {localityError ? <p className="form-error" role="alert">{localityError}</p> : null}
        </> : null}
        {step === 5 ? <>
          <h1>האם מתקיים אצלך אחד מאלה?</h1><p className="question-help">אפשר לבחור יותר מאפשרות אחת.</p>
          <div className="criteria-options">{config.criteria.map((criterion)=><button type="button" key={criterion.id} className="criterion-option" aria-pressed={answers.criteria.includes(criterion.id)} onClick={()=>toggleCriterion(criterion.id)}>{criterion.he}</button>)}</div>
          <button type="button" className="option-button" style={{marginTop:12}} aria-pressed={answers.unsure} onClick={()=>setAnswers((c)=>({...c,unsure:!c.unsure,criteria:[]}))}>לא בטוח / אף אחד מהם</button>
        </> : null}
        <div className="check-actions">
          <button className="button-secondary" type="button" onClick={()=>step===1?router.push('/'):setStep((current)=>current-1)}>חזרה</button>
          <button className="button-primary" type="button" disabled={!canContinue()} aria-disabled={!canContinue()} onClick={next}>{step===TOTAL?'לתוצאה':'להמשך'}</button>
        </div>
      </section>
    </main>
  )
}
