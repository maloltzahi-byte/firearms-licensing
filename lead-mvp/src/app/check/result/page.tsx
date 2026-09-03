'use client'

import Link from 'next/link'
import { FlowHeader } from '@/components/gov-shell'
import { ResultLeadForm } from '@/components/screening/lead-form'
import { useScreening } from '@/components/screening/screening-provider'
import { labels, resultCopy } from '@/lib/screening'
import { phoneHref, whatsappHref } from '@/lib/site'

export default function ResultPage() {
  const { answers, result } = useScreening()
  const complete = Boolean(answers.age && answers.hebrewBasic && answers.citizenship && answers.service && answers.applicationStatus && answers.policeBarrier && answers.routeFamilies.length)
  if (!complete) return <div className="rc-result-page"><FlowHeader/><main id="main" className="rc-result"><h1>כדי להציג תוצאה צריך להשלים את הבדיקה</h1><Link className="rc-btn rc-btn-primary" href="/check">התחלת בדיקה</Link></main></div>

  const copy = resultCopy(result)
  const routes = answers.routeFamilies.map((route) => labels.routeFamily[route]).join(', ')
  const residency = answers.residencyYears ? ` · ${labels.residency[answers.residencyYears]}` : ''
  const base = `${labels.age[answers.age!]} · עברית בסיסית: ${labels.hebrew[answers.hebrewBasic!]}`
  const application = `${labels.applicationStatus[answers.applicationStatus!]} · ${labels.policeBarrier[answers.policeBarrier!]}`
  const message = `שלום, ביצעתי בדיקה ראשונית באתר. התוצאה: ${copy.badge}. אשמח לבדיקה פרטנית.`

  return <div className="rc-result-page"><FlowHeader/><main id="main" className="rc-result">
    <h1>תוצאה ראשונית</h1><p className="rc-result-sub">התוצאה היא אינדיקציה בלבד ואינה קביעה רשמית של זכאות.</p>
    <article className={`rc-result-state ${result}`}><span className="rc-result-badge">{copy.badge}</span><h2>{copy.title}</h2><p>{result==='green'?'לפי התשובות שמסרת זוהה מסלול שיש טעם להעביר לבדיקה פרטנית של עורך דין לפני שמתקדמים.':result==='yellow'?'לפי התשובות שמסרת נדרשת בדיקה פרטנית לפני שמתקדמים. ייתכן שקיים מסלול רלוונטי בהתאם לנתונים המלאים.':'לפי התשובות שמסרת לא זוהה כרגע מסלול ברור. ניתן לפנות לבדיקה פרטנית אם קיימות נסיבות נוספות.'}</p></article>
    <section className="rc-summary"><h2>הפרטים שמסרת</h2><dl>
      <div><dt>תנאי בסיס</dt><dd>{base}</dd></div>
      <div><dt>מעמד</dt><dd>{labels.citizenship[answers.citizenship!]}{residency}</dd></div>
      <div><dt>שירות</dt><dd>{labels.service[answers.service!]}</dd></div>
      <div><dt>מצב הבקשה</dt><dd>{application}</dd></div>
      <div><dt>מסלול</dt><dd>{routes}{answers.locality ? ` · ${answers.locality}` : ''}</dd></div>
    </dl></section>
    <div className="rc-result-legal"><strong>חשוב לדעת</strong><span>התוצאה היא אינדיקציה ראשונית בלבד. השאלון אינו בודק את מלוא תנאי הסף, ובכלל זה כשירות רפואית, הכשרה ובדיקת משטרה. ההחלטה בבקשה נתונה לרשות המוסמכת.</span></div>
    <h2 className="rc-result-cta">רוצים שנבדוק את המקרה שלכם?</h2>
    <div className="rc-result-actions"><a className="rc-btn rc-btn-wa" href={whatsappHref(message)} target="_blank" rel="noreferrer">וואטסאפ</a><a className="rc-btn rc-btn-call" href={phoneHref()}>התקשרו עכשיו</a></div>
    <ResultLeadForm />
  </main></div>
}
