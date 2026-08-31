'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { track } from '@vercel/analytics'
import { FlowHeader } from '@/components/gov-shell'
import { QuestionnaireLeadForm } from './lead-form'
import { useScreening } from './screening-provider'
import { labels, type AgeBand, type Citizenship, type ResidencyYears, type Service } from '@/lib/screening'

const TOTAL_QUESTIONS = 5
const TOTAL_STEPS = 6
const progressLabels = ['גיל', 'מעמד', 'שירות', 'יישוב', 'תבחין', 'פרטים']
const criterionLabels = ['מקום מגורים','עבודה או לימודים','מורה דרך','כבאות והצלה','גופי הצלה','חקלאות','הובלת חומרי נפץ','ממונה ביטחון','מדריך ירי','שירות בכוחות הביטחון','שירות במשטרה','הכשרות אבטחה','ספורט ירי','ציד','וטרינריה / הדברה']

function Radio({ selected }: { selected: boolean }) {
  return <i className={`radio-final${selected ? ' selected' : ''}`} aria-hidden="true" />
}

function ageLabel(label: string) {
  return /^\d+[–-]\d+$/.test(label) ? <bdi dir="ltr">{label}</bdi> : label
}

function Progress({ step }: { step: number }) {
  return <aside className="progress-final" aria-label={`שלב ${step} מתוך ${TOTAL_STEPS}`}>
    <i className="top-rule" />
    <h2>בדיקה ראשונית</h2>
    <div className="step-label">שלב {step} מתוך {TOTAL_STEPS}</div>
    <div className="progress-list-final">
      {progressLabels.map((label, index) => {
        const n = index + 1
        const state = n < step ? 'done' : n === step ? 'active' : ''
        return <div className={`progress-row-final ${state}`} key={label}><span>{label}</span><i /></div>
      })}
    </div>
  </aside>
}

export function Questionnaire() {
  const router = useRouter()
  const { answers, setAnswers, config } = useScreening()
  const [step, setStep] = useState(1)
  const [query, setQuery] = useState(answers.locality)
  const [localityError, setLocalityError] = useState('')

  const suggestions = useMemo(() => {
    const q = query.trim()
    return q ? config.localities.filter((name) => name.includes(q)).slice(0, 8) : []
  }, [config.localities, query])

  function next() {
    if (step === 4) {
      const normalized = config.localities.find((name) => name === query.trim())
      if (!normalized) {
        setLocalityError('יש לבחור יישוב מתוך רשימת ההשלמה האוטומטית.')
        return
      }
      setAnswers((current) => ({ ...current, locality: normalized }))
    }
    track('screening_step', { step })
    if (step < TOTAL_STEPS) setStep((current) => current + 1)
  }

  const canContinue = step === 1 ? Boolean(answers.age)
    : step === 2 ? Boolean(answers.citizenship) && (answers.citizenship !== 'PERMANENT_RESIDENT' || Boolean(answers.residencyYears))
    : step === 3 ? Boolean(answers.service)
    : step === 4 ? config.localities.includes(query.trim())
    : step === 5 ? answers.unsure || answers.criteria.length > 0
    : false

  function toggleCriterion(id: string) {
    setAnswers((current) => ({ ...current, unsure: false, criteria: current.criteria.includes(id) ? current.criteria.filter((item) => item !== id) : [...current.criteria, id] }))
  }

  const progress = <div className="question-progress-final">
    <div className="question-progress-labels-final">
      <span>{step <= TOTAL_QUESTIONS ? `שאלה ${step} מתוך ${TOTAL_QUESTIONS}` : 'שלב סיום'}</span>
      <strong>{step <= TOTAL_QUESTIONS ? 'שלב הסינון והבדיקה' : 'פרטי קשר ושליחה למשרד'}</strong>
    </div>
    <div className="progress-track-final"><span style={{ width: `${(step / TOTAL_STEPS) * 100}%` }} /></div>
  </div>

  const body = <>
    {step === 1 && <>
      <header className="question-title-final"><h1>מה טווח הגיל שלך?</h1><p>הגיל הוא אחד מתנאי הסף ומשתנה בהתאם לסטטוס השירות. אין צורך למסור תאריך לידה.</p></header>
      <div className="options-final">{Object.entries(labels.age).map(([value, label]) => <button type="button" className={`screen-choice${answers.age === value ? ' selected' : ''}`} key={value} onClick={() => setAnswers((current) => ({ ...current, age: value as AgeBand }))}><span className="choice-label">{ageLabel(label)}</span><Radio selected={answers.age === value} /></button>)}</div>
    </>}

    {step === 2 && <>
      <header className="question-title-final"><h1>מה המעמד שלך בישראל?</h1><p>בחרו את המעמד המתאים. תושב קבע יתבקש לציין גם את משך המגורים בישראל.</p></header>
      <div className="options-final">{Object.entries(labels.citizenship).map(([value, label]) => <button type="button" className={`screen-choice${answers.citizenship === value ? ' selected' : ''}`} key={value} onClick={() => setAnswers((current) => ({ ...current, citizenship: value as Citizenship, residencyYears: value === 'PERMANENT_RESIDENT' ? current.residencyYears : null }))}><span className="choice-label">{label}</span><Radio selected={answers.citizenship === value} /></button>)}</div>
      {answers.citizenship === 'PERMANENT_RESIDENT' && <div className="resident-final"><strong>כמה שנים אתה מתגורר בישראל?</strong><div className="resident-options-final">{Object.entries(labels.residency).map(([value, label]) => <button type="button" className={`screen-choice${answers.residencyYears === value ? ' selected' : ''}`} key={value} onClick={() => setAnswers((current) => ({ ...current, residencyYears: value as ResidencyYears }))}><span className="choice-label">{label}</span><Radio selected={answers.residencyYears === value} /></button>)}</div></div>}
    </>}

    {step === 3 && <>
      <header className="question-title-final"><h1>מהו סטטוס השירות שלך?</h1><p>בחרו את האפשרות המתארת בצורה הטובה ביותר את סטטוס השירות. אין צורך לציין סיבה רפואית או מידע רגיש.</p></header>
      <div className="options-final">{Object.entries(labels.service).map(([value, label]) => <button type="button" className={`screen-choice${answers.service === value ? ' selected' : ''}`} key={value} onClick={() => setAnswers((current) => ({ ...current, service: value as Service }))}><span className="choice-label">{label}</span><Radio selected={answers.service === value} /></button>)}</div>
    </>}

    {step === 4 && <>
      <header className="question-title-final"><h1>מהו יישוב המגורים שלך?</h1><p>שם היישוב משמש לזיהוי ראשוני בלבד. זכאות לפי יישוב אינה נקבעת באתר.</p></header>
      <div className="locality-search-final">
        <div className="locality-input-final"><input value={query} autoComplete="off" onChange={(event) => { setQuery(event.target.value); setLocalityError('') }} placeholder="הקלידו שם יישוב" /><span className="locality-search-icon" aria-hidden="true">⌕</span></div>
        {suggestions.length > 0 && !config.localities.includes(query.trim()) && <ul className="locality-suggestions-final">{suggestions.map((name, index) => <li key={name}><button type="button" className={index === 0 ? 'highlighted' : ''} onClick={() => { setQuery(name); setAnswers((current) => ({ ...current, locality: name })); setLocalityError('') }}>{name}</button></li>)}</ul>}
      </div>
      <div className="locality-notice-final"><b>i</b><span>זכאות היישוב לא נבדקה בשלב זה ותיבחן בנפרד מול המקור הרשמי.</span></div>
      {localityError && <p className="form-error" role="alert">{localityError}</p>}
    </>}

    {step === 5 && <>
      <header className="question-title-final"><h1>האם מתקיים אצלך אחד מהמצבים הבאים?</h1><p>בחרו את המצבים שמתאימים לכם. אפשר לבחור יותר מאפשרות אחת.</p></header>
      <div className="criteria-grid-final">{config.criteria.map((criterion, index) => { const selected = answers.criteria.includes(criterion.id); return <button type="button" key={criterion.id} className={`criteria-choice-final${selected ? ' selected' : ''}`} aria-pressed={selected} onClick={() => toggleCriterion(criterion.id)}><span>{criterionLabels[index] || criterion.he}</span><i aria-hidden="true" /></button> })}</div>
      <button type="button" className={`none-choice-final${answers.unsure ? ' selected' : ''}`} aria-pressed={answers.unsure} onClick={() => setAnswers((current) => ({ ...current, unsure: !current.unsure, criteria: [] }))}><span>לא בטוח / אף אחד מהם</span><i aria-hidden="true" /></button>
    </>}

    {step === 6 && <QuestionnaireLeadForm onBack={() => setStep(5)} />}
  </>

  const nav = step <= TOTAL_QUESTIONS ? <>
    <div className="nav-final">
      <button className="nav-btn next" type="button" disabled={!canContinue} onClick={next}>{step === TOTAL_QUESTIONS ? 'המשך לפרטי קשר' : 'המשך'}</button>
      <button className="nav-btn back" type="button" onClick={() => step === 1 ? router.push('/') : setStep((current) => current - 1)}>חזור</button>
    </div>
    <p className="question-disclaimer-final">הבדיקה היא כלי עזר ראשוני בלבד ואינה החלטה רשמית.</p>
  </> : null

  return <div className="questionnaire-page"><FlowHeader exit />{step === 5
    ? <main id="main" className="q5-stage-final"><section className="q5-question-final">{progress}{body}{nav}</section></main>
    : <main id="main" className="wizard-final"><Progress step={step} /><section className="question-final">{progress}{body}{nav}</section></main>}
  </div>
}
