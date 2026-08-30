'use client'

import Link from 'next/link'
import { FlowHeader, WhatsAppIcon } from '@/components/gov-shell'
import { useScreening } from '@/components/screening/screening-provider'
import { labels } from '@/lib/screening'
import { phoneHref, site, whatsappHref } from '@/lib/site'

const states = {
  green: { label:'ירוק', title:'נראה שיש בסיס לבדיקה מעמיקה', text:'לפי התשובות שנמסרו, ייתכן שקיים בסיס למסלול מתאים. השלב הבא הוא בדיקה פרטנית מול עורך הדין.' },
  yellow: { label:'צהוב', title:'ייתכן שקיים מסלול — נדרשת בדיקה', text:'המידע שנמסר אינו מאפשר מסקנה ראשונית ברורה. מומלץ לבצע בדיקה פרטנית לפני פעולה נוספת.' },
  red: { label:'אדום', title:'כרגע לא נראה מסלול ברור', text:'לפי המידע בשאלון לא זוהה מסלול ברור, אך ניתן לפנות אם קיימות נסיבות נוספות שלא נשאלו באתר.' },
} as const

export default function ResultPage() {
  const { answers, result, config } = useScreening()
  if (!answers.age || !answers.citizenship || !answers.service || !answers.locality) return <><FlowHeader /><main id="main" className="result-content incomplete-result"><h1>כדי להציג תוצאה צריך להשלים את הבדיקה</h1><p>התחילו את חמש השאלות הקצרות וחזרו לכאן בסיום.</p><Link className="btn btn-primary" href="/check">התחלת בדיקה</Link></main></>

  const selectedCriteria = config.criteria.filter(c=>answers.criteria.includes(c.id)).map(c=>c.he).join(', ') || 'לא בטוח / אף אחד מהם'
  const message = `שלום צחי,\nביצעתי בדיקה ראשונית באתר בנושא הוצאת רישיון נשק פרטי.\n\nתוצאה ראשונית: ${states[result].label}\nגיל: ${labels.age[answers.age]}\nמעמד: ${labels.citizenship[answers.citizenship]}\nשירות: ${labels.service[answers.service]}\nיישוב: ${answers.locality}\nתבחינים שסומנו: ${selectedCriteria}\n\nאשמח להמשך ליווי ובדיקה פרטנית.`
  const emailHref = `mailto:${site.email}?subject=${encodeURIComponent('המשך ליווי — בדיקה ראשונית לרישיון נשק')}&body=${encodeURIComponent(message)}`

  return <>
    <FlowHeader />
    <main id="main" className="result-content">
      <h1>תוצאה ראשונית</h1><p className="result-subtitle">התוצאה היא אינדיקציה בלבד ואינה קביעה רשמית של זכאות.</p>
      <div className="result-states" aria-label={`התוצאה שלך: ${states[result].label}`}>
        {(Object.entries(states) as Array<[keyof typeof states,(typeof states)[keyof typeof states]]>).map(([key,state]) => <article className={`result-state ${key}${result===key?' active':''}`} key={key} aria-current={result===key?'true':undefined}><span className="state-badge">{state.label}</span><h2>{state.title}</h2><p>{state.text}</p></article>)}
      </div>
      <section className="summary-card"><h2>סיכום הבדיקה</h2><dl><div><dt>גיל</dt><dd>{labels.age[answers.age]}</dd></div><div><dt>מעמד</dt><dd>{labels.citizenship[answers.citizenship]}</dd></div><div><dt>שירות</dt><dd>{labels.service[answers.service]}</dd></div><div><dt>יישוב</dt><dd>{answers.locality} — זכאות היישוב לא נבדקה</dd></div><div><dt>תבחינים</dt><dd>{selectedCriteria}</dd></div></dl></section>
      <div className="legal-notice"><strong>חשוב לדעת</strong><span>עבר פלילי, צו הרחקה בתוקף או מגבלה רפואית עשויים להשפיע על הבקשה. אין צורך למסור מידע כזה באתר. ניתן לדון בכך ישירות עם עורך הדין בשיחה.</span></div>
      <div className="result-actions"><a className="btn btn-whatsapp" href={whatsappHref(message)} target="_blank" rel="noreferrer">שלחו את התוצאה ב-WhatsApp <WhatsAppIcon /></a><a className="btn btn-outline" href={phoneHref()}>התקשרו עכשיו</a><a className="btn btn-primary" href={emailHref}>שלחו אימייל</a></div>
    </main>
  </>
}
