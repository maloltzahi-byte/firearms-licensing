'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { track } from '@vercel/analytics'
import { FlowHeader } from '@/components/gov-shell'
import { useScreening } from './screening-provider'
import {
  labels,
  type AgeBand,
  type ApplicationStatus,
  type Citizenship,
  type HebrewBasic,
  type PoliceBarrier,
  type ResidencyYears,
  type RouteFamily,
  type Service,
} from '@/lib/screening'

const TOTAL_STEPS = 5
const progressLabels = ['תנאי בסיס', 'מעמד', 'שירות', 'מצב הבקשה', 'מסלול']

function Radio({ selected }: { selected: boolean }) {
  return <i className="rc-radio" data-selected={selected || undefined} aria-hidden="true" />
}

function Progress({ step }: { step: number }) {
  return <aside className="rc-progress-side" aria-label={`שלב ${step} מתוך ${TOTAL_STEPS}`}>
    <h2>בדיקה ראשונית</h2><div className="count">שלב {step} מתוך {TOTAL_STEPS}</div>
    <div className="rc-progress-rows">{progressLabels.map((label,index)=>{
      const n=index+1
      const state=n<step?'done':n===step?'active':''
      return <div className={`rc-progress-row ${state}`} key={label}><span>{label}</span><i /></div>
    })}</div>
  </aside>
}

function Choice({ selected, children, onClick, tall = false }: { selected: boolean; children: React.ReactNode; onClick: () => void; tall?: boolean }) {
  return <button type="button" className={`rc-choice${selected?' selected':''}${tall?' tall':''}`} onClick={onClick}><span className="label">{children}</span><Radio selected={selected} /></button>
}

export function Questionnaire() {
  const router = useRouter()
  const { answers, setAnswers, config } = useScreening()
  const [step, setStep] = useState(1)
  const [localityQuery, setLocalityQuery] = useState(answers.locality)
  const [localityError, setLocalityError] = useState('')

  const suggestions = useMemo(() => {
    const q = localityQuery.trim()
    return q ? config.localities.filter((name) => name.includes(q)).slice(0, 8) : []
  }, [config.localities, localityQuery])

  const needsResidencyContinuity = answers.citizenship === 'CITIZEN' || answers.citizenship === 'PERMANENT_RESIDENT'
  const needsLocality = answers.routeFamilies.includes('RESIDENCE_WORK')

  const canContinue = step === 1 ? Boolean(answers.age && answers.hebrewBasic)
    : step === 2 ? Boolean(answers.citizenship && (!needsResidencyContinuity || answers.residencyYears))
    : step === 3 ? Boolean(answers.service)
    : step === 4 ? Boolean(answers.applicationStatus && answers.policeBarrier)
    : step === 5 ? Boolean(answers.routeFamilies.length && (!needsLocality || config.localities.includes(localityQuery.trim())))
    : false

  function next() {
    if (!canContinue) return
    if (step === 5) {
      if (needsLocality) {
        const locality = config.localities.find((name) => name === localityQuery.trim())
        if (!locality) {
          setLocalityError('יש לבחור יישוב מתוך רשימת ההשלמה האוטומטית.')
          return
        }
        setAnswers((current) => ({ ...current, locality }))
      }
      track('screening_completed', { step: 5 })
      router.push('/check/result')
      return
    }
    track('screening_step', { step })
    setStep((current) => current + 1)
  }

  function toggleRoute(route: RouteFamily) {
    setLocalityError('')
    setAnswers((current) => {
      if (route === 'UNSURE') return { ...current, routeFamilies: current.routeFamilies.includes('UNSURE') ? [] : ['UNSURE'], locality: '' }
      const withoutUnsure = current.routeFamilies.filter((item) => item !== 'UNSURE')
      const selected = withoutUnsure.includes(route)
      const routeFamilies = selected ? withoutUnsure.filter((item) => item !== route) : [...withoutUnsure, route]
      return { ...current, routeFamilies, locality: routeFamilies.includes('RESIDENCE_WORK') ? current.locality : '' }
    })
  }

  const progress = <div className="rc-q-progress">
    <div className="rc-q-progress-labels"><span>שלב {step} מתוך 5</span><span>שלב הסינון והבדיקה</span></div>
    <div className="rc-q-track"><i style={{width:`${step*20}%`}} /></div>
  </div>

  const body = <>
    {step === 1 && <>
      <header className="rc-question-head"><h1>מה טווח הגיל שלך?</h1><p>הגיל הרלוונטי משתנה לפי המעמד, סוג והיקף השירות ולעיתים גם לפי התבחין. אין צורך למסור תאריך לידה.</p></header>
      <div className="rc-options">{Object.entries(labels.age).map(([value,label])=><Choice key={value} selected={answers.age===value} onClick={()=>setAnswers((current)=>({...current,age:value as AgeBand}))}><bdi dir={/^\d/.test(label)?'ltr':'rtl'}>{label}</bdi></Choice>)}</div>
      <div className="rc-hebrew-follow"><h3>האם יש לך שליטה בסיסית בעברית?</h3><p>מספיק כדי להבין שאלות והוראות בסיסיות.</p><div className="rc-hebrew-buttons">{Object.entries(labels.hebrew).map(([value,label])=><button type="button" key={value} className={answers.hebrewBasic===value?'selected':''} onClick={()=>setAnswers((current)=>({...current,hebrewBasic:value as HebrewBasic}))}>{label}</button>)}</div></div>
    </>}

    {step === 2 && <>
      <header className="rc-question-head"><h1>מה המעמד שלך בישראל?</h1><p>אזרח ישראלי או תושב קבע נדרשים, ככלל, לשהייה רציפה בישראל בשלוש השנים שקדמו להגשת הבקשה. לעולה חדש עשוי לחול חריג בתבחין מקום מגורים.</p></header>
      <div className="rc-options">{Object.entries(labels.citizenship).map(([value,label])=><Choice key={value} selected={answers.citizenship===value} onClick={()=>setAnswers((current)=>({...current,citizenship:value as Citizenship,residencyYears:(value==='CITIZEN'||value==='PERMANENT_RESIDENT')?current.residencyYears:null}))}>{label}</Choice>)}</div>
      {needsResidencyContinuity&&<div className="rc-follow"><h3>האם שהית בישראל ברציפות בשלוש השנים שקדמו להגשת הבקשה?</h3><div className="rc-follow-actions">{Object.entries(labels.residency).map(([value,label])=><Choice key={value} selected={answers.residencyYears===value} onClick={()=>setAnswers((current)=>({...current,residencyYears:value as ResidencyYears}))}>{label}</Choice>)}</div></div>}
    </>}

    {step === 3 && <>
      <header className="rc-question-head"><h1>מהו סטטוס השירות שלך?</h1><p>בחרו את האפשרות המתארת בצורה הטובה ביותר את סוג והיקף השירות. במקרים של שירות חלקי או סיום מוקדם נדרשת בדיקה פרטנית.</p></header>
      <div className="rc-options">{Object.entries(labels.service).map(([value,label])=><Choice tall={value==='REGULAR'||value==='CIVIL'||value==='SPECIAL_STATUS'} key={value} selected={answers.service===value} onClick={()=>setAnswers((current)=>({...current,service:value as Service}))}>{label}</Choice>)}</div>
    </>}

    {step === 4 && <>
      <header className="rc-question-head"><h1>מה מצב הבקשה שלך היום?</h1><p>כך נדע אם מדובר בהגשה חדשה, בקשה קיימת או מסלול שדורש טיפול אחר.</p></header>
      <div className="rc-app-status">{Object.entries(labels.applicationStatus).map(([value,label])=><Choice key={value} selected={answers.applicationStatus===value} onClick={()=>setAnswers((current)=>({...current,applicationStatus:value as ApplicationStatus}))}>{label}</Choice>)}</div>
      <div className="rc-barrier"><h3>האם ידועה לך מניעה משטרתית או ביטחונית בנוגע לקבלת רישיון?</h3><div className="rc-barrier-options">{Object.entries(labels.policeBarrier).map(([value,label])=><Choice key={value} selected={answers.policeBarrier===value} onClick={()=>setAnswers((current)=>({...current,policeBarrier:value as PoliceBarrier}))}>{label}</Choice>)}</div></div>
    </>}

    {step === 5 && <>
      <header className="rc-question-head"><h1>מה עשוי להיות הבסיס לבקשה שלך?</h1><p>בחרו קבוצה אחת או יותר. אנחנו ממפים מאחור את התבחין המדויק; אין צורך להכיר את כל הרשימה.</p></header>
      <div className="rc-route-grid">{Object.entries(labels.routeFamily).map(([value,label])=>{
        const route=value as RouteFamily
        const selected=answers.routeFamilies.includes(route)
        return <button type="button" key={value} className={`rc-check${selected?' selected':''}${route==='UNSURE'?' full':''}`} aria-pressed={selected} onClick={()=>toggleRoute(route)}><span>{label}</span><i aria-hidden="true" /></button>
      })}<div className="rc-route-note">אחרי הבחירה נציג 1–3 שאלות קצרות שמבדילות בין המסלולים הרלוונטיים. זה נשאר בתוך שלב 5.</div></div>
      {needsLocality&&<div className="rc-follow rc-locality-depth"><h3>מגורים / עבודה או לימודים — שאלות המשך</h3><label className="rc-locality-label">מה היישוב הרלוונטי?<input value={localityQuery} onChange={(event)=>{setLocalityQuery(event.target.value);setLocalityError('')}} placeholder="הקלידו שם יישוב" autoComplete="off" /></label>{suggestions.length>0&&!config.localities.includes(localityQuery.trim())&&<div className="rc-locality-suggestions">{suggestions.map((name)=><button type="button" key={name} onClick={()=>{setLocalityQuery(name);setAnswers((current)=>({...current,locality:name}));setLocalityError('')}}>{name}</button>)}</div>}{localityError&&<p className="form-error" role="alert">{localityError}</p>}</div>}
    </>}
  </>

  const nav = <><div className="rc-q-nav"><button className={`rc-btn rc-btn-primary ${step===5?'result':'next'}`} type="button" disabled={!canContinue} onClick={next}>{step===5?'הצגת תוצאה ראשונית':'המשך'}</button><button className="rc-btn rc-btn-outline" type="button" onClick={()=>step===1?router.push('/'):setStep((current)=>current-1)}>חזור</button></div><p className="rc-q-disc">בדיקה ראשונית בלבד. השאלון אינו בודק את מלוא תנאי הסף, ובכלל זה כשירות רפואית, הכשרה ובדיקת משטרה.</p></>

  return <div className="rc-flow-page"><FlowHeader exit />{step===5
    ? <main id="main" className="rc-step5-stage"><section className="rc-question-card step5">{progress}{body}{nav}</section></main>
    : <main id="main" className="rc-wizard"><Progress step={step}/><section className={`rc-question-card step${step}`}>{progress}{body}{nav}</section></main>}
  </div>
}
