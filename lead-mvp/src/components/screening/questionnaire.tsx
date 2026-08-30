'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { track } from '@vercel/analytics'
import { FlowHeader } from '@/components/gov-shell'
import { useScreening } from './screening-provider'
import { labels, type AgeBand, type Citizenship, type ResidencyYears, type Service } from '@/lib/screening'

const TOTAL = 5
const progressLabels = ['גיל', 'מעמד', 'שירות', 'יישוב', 'תבחין']
const criterionLabels = ['מקום מגורים','עבודה או לימודים','מורה דרך','כבאות והצלה','גופי הצלה','חקלאות','הובלת חומרי נפץ','ממונה ביטחון','מדריך ירי','שירות בכוחות הביטחון','שירות במשטרה','הכשרות אבטחה','ספורט ירי','ציד','וטרינריה / הדברה']

function Radio({ selected }: { selected: boolean }) {
  return <span className={`radio-mark${selected ? ' selected' : ''}`} aria-hidden="true"><span /></span>
}

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

  function next() {
    if (step === 4) {
      const normalized = config.localities.find((name) => name === query.trim())
      if (!normalized) { setLocalityError('יש לבחור יישוב מתוך רשימת ההשלמה האוטומטית.'); return }
      setAnswers((current) => ({ ...current, locality: normalized }))
    }
    track('screening_step', { step })
    if (step < TOTAL) setStep((current) => current + 1)
    else { track('screening_completed', { result }); router.push('/check/result') }
  }

  const canContinue = (() => {
    if (step === 1) return Boolean(answers.age)
    if (step === 2) return Boolean(answers.citizenship) && (answers.citizenship !== 'PERMANENT_RESIDENT' || Boolean(answers.residencyYears))
    if (step === 3) return Boolean(answers.service)
    if (step === 4) return config.localities.includes(query.trim())
    return answers.unsure || answers.criteria.length > 0
  })()

  function toggleCriterion(id: string) {
    setAnswers((current) => ({ ...current, unsure: false, criteria: current.criteria.includes(id) ? current.criteria.filter((item) => item !== id) : [...current.criteria, id] }))
  }

  return <>
    <FlowHeader exit />
    <main id="main" className={`wizard-stage${step === 5 ? ' q5-stage' : ''}`}>
      {step !== 5 && <aside className="progress-sidebar" aria-label={`שלב ${step} מתוך ${TOTAL}`}>
        <div className="blue-rule" /><h2>בדיקה ראשונית</h2><p className="step-number">שלב {step} מתוך 5</p>
        <div className="progress-list">{progressLabels.map((label,index) => {
          const n=index+1; const state=n<step?'done':n===step?'active':'future'
          return <div className={`progress-item ${state}`} key={label}><span>{label}</span><i aria-hidden="true" /></div>
        })}</div>
      </aside>}
      <section className={`question-card${step === 5 ? ' q5-card' : ''}`}>
        <div className="question-progress">
          <div className="question-progress-labels"><span>שאלה {step} מתוך 5</span><strong>שלב הסינון והבדיקה</strong></div>
          <div className="question-progress-track"><span style={{width:`${step*20}%`}} /></div>
        </div>
        {step === 1 && <>
          <header className="question-heading"><h1>מה טווח הגיל שלך?</h1><p>בחרו טווח גיל. אין צורך למסור תאריך לידה מלא.</p></header>
          <div className="option-stack">{Object.entries(labels.age).map(([value,label]) => <button type="button" className={`screen-option${answers.age===value?' selected':''}`} key={value} onClick={()=>setAnswers(c=>({...c,age:value as AgeBand}))}><span>{label}</span><Radio selected={answers.age===value}/></button>)}</div>
        </>}
        {step === 2 && <>
          <header className="question-heading"><h1>מה המעמד שלך בישראל?</h1><p>בחרו את המעמד המתאים. תושב קבע יתבקש לציין גם את משך המגורים בישראל.</p></header>
          <div className="option-stack">{Object.entries(labels.citizenship).map(([value,label]) => <button type="button" className={`screen-option${answers.citizenship===value?' selected':''}`} key={value} onClick={()=>setAnswers(c=>({...c,citizenship:value as Citizenship,residencyYears:value==='PERMANENT_RESIDENT'?c.residencyYears:null}))}><span>{label}</span><Radio selected={answers.citizenship===value}/></button>)}</div>
          {answers.citizenship === 'PERMANENT_RESIDENT' && <div className="resident-follow"><strong>כמה שנים אתה מתגורר בישראל?</strong><div className="resident-options">{Object.entries(labels.residency).map(([value,label]) => <button type="button" className={`screen-option${answers.residencyYears===value?' selected':''}`} key={value} onClick={()=>setAnswers(c=>({...c,residencyYears:value as ResidencyYears}))}><span>{label}</span><Radio selected={answers.residencyYears===value}/></button>)}</div></div>}
        </>}
        {step === 3 && <>
          <header className="question-heading"><h1>מהו סטטוס השירות שלך?</h1><p>בחרו את האפשרות המתארת בצורה הטובה ביותר את מצבכם.</p></header>
          <div className="option-stack">{Object.entries(labels.service).map(([value,label]) => <button type="button" className={`screen-option${answers.service===value?' selected':''}`} key={value} onClick={()=>setAnswers(c=>({...c,service:value as Service}))}><span>{label}</span><Radio selected={answers.service===value}/></button>)}</div>
        </>}
        {step === 4 && <>
          <header className="question-heading"><h1>מהו יישוב המגורים שלך?</h1><p>שם היישוב משמש לזיהוי ראשוני בלבד. זכאות לפי יישוב אינה נקבעת באתר.</p></header>
          <div className="locality-field-wrap"><label className="sr-only" htmlFor="locality">יישוב מגורים</label><div className="locality-input"><span aria-hidden="true">⌕</span><input id="locality" value={query} autoComplete="off" onChange={(e)=>{setQuery(e.target.value);setLocalityError('')}} placeholder="הקלידו שם יישוב" /></div>{suggestions.length>0 && !config.localities.includes(query.trim()) && <ul className="locality-suggestions">{suggestions.map((name)=><li key={name}><button type="button" onClick={()=>{setQuery(name);setAnswers(c=>({...c,locality:name}));setLocalityError('')}}>{name}</button></li>)}</ul>}</div>
          <div className="info-banner compact"><strong>i</strong><span>זכאות היישוב לא נבדקה בשלב זה ותיבחן בנפרד מול המקור הרשמי.</span></div>
          {localityError && <p className="error-message" role="alert">{localityError}</p>}
        </>}
        {step === 5 && <>
          <header className="question-heading"><h1>האם מתקיים אצלך אחד מהמצבים הבאים?</h1><p>בחרו את המצבים שמתאימים לכם. אפשר לבחור יותר מאפשרות אחת.</p></header>
          <div className="criteria-select-grid">{config.criteria.map((criterion,index)=>{const selected=answers.criteria.includes(criterion.id); return <button type="button" key={criterion.id} className={`criteria-choice${selected?' selected':''}`} aria-pressed={selected} onClick={()=>toggleCriterion(criterion.id)}><span>{criterionLabels[index] || criterion.he}</span><i aria-hidden="true">{selected?'✓':''}</i></button>})}</div>
          <button type="button" className={`none-choice${answers.unsure?' selected':''}`} aria-pressed={answers.unsure} onClick={()=>setAnswers(c=>({...c,unsure:!c.unsure,criteria:[]}))}><span>לא בטוח / אף אחד מהם</span><i aria-hidden="true">{answers.unsure?'✓':''}</i></button>
        </>}
        <div className="question-nav">
          <button className="nav-btn back" type="button" onClick={()=>step===1?router.push('/'):setStep(current=>current-1)}>חזור</button>
          <button className="nav-btn next" type="button" disabled={!canContinue} onClick={next}>{step===TOTAL?'הצגת תוצאה ראשונית':'המשך'}</button>
        </div>
        <p className="question-disclaimer">הבדיקה היא כלי עזר ראשוני בלבד ואינה החלטה רשמית.</p>
      </section>
    </main>
  </>
}
