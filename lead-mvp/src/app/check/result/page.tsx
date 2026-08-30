'use client'

import Link from 'next/link'
import { FlowHeader, WhatsAppIcon } from '@/components/gov-shell'
import { useScreening } from '@/components/screening/screening-provider'
import { labels } from '@/lib/screening'
import { phoneHref, whatsappHref } from '@/lib/site'

const states = {
  green: { label:'ירוק', title:'נראה שיש בסיס לבדיקה מעמיקה', text:'לפי התשובות שמסרת, ייתכן שקיים בסיס למסלול מתאים. השלב הבא הוא בדיקה פרטנית לפני שמתקדמים.' },
  yellow: { label:'צהוב', title:'ייתכן שקיים מסלול — נדרשת בדיקה פרטנית', text:'לפי התשובות שמסרת ייתכן שקיים מסלול מתאים, אך נדרש בירור פרטני לפני שמתקדמים.' },
  red: { label:'אדום', title:'כרגע לא נראה מסלול ברור', text:'לפי המידע בשאלון לא זוהה מסלול ברור. אם קיימות נסיבות נוספות שלא נשאלו באתר, אפשר עדיין לפנות לבדיקה פרטנית.' },
} as const

export default function ResultPage() {
  const { answers, result, config } = useScreening()
  if (!answers.age || !answers.citizenship || !answers.service || !answers.locality) return <><FlowHeader /><main id="main" className="result-content incomplete-result"><h1>כדי להציג תוצאה צריך להשלים את הבדיקה</h1><p>התחילו את חמש השאלות הקצרות וחזרו לכאן בסיום.</p><Link className="btn btn-primary" href="/check">בדיקה ראשונית</Link></main></>

  const selectedCriteria = config.criteria.filter(c=>answers.criteria.includes(c.id)).map(c=>c.he).join(', ') || 'לא בטוח / אף אחד מהם'
  const state = states[result]
  const message = `שלום צחי,\nביצעתי בדיקה ראשונית באתר בנושא הוצאת רישיון נשק פרטי.\n\nתוצאה ראשונית: ${state.label}\nגיל: ${labels.age[answers.age]}\nמעמד: ${labels.citizenship[answers.citizenship]}\nשירות: ${labels.service[answers.service]}\nיישוב: ${answers.locality}\nתבחינים שסומנו: ${selectedCriteria}\n\nאשמח להמשך ליווי ובדיקה פרטנית.`

  return <>
    <FlowHeader />
    <main id="main" className="result-content">
      <h1>תוצאה ראשונית</h1>
      <p className="result-subtitle">התוצאה היא אינדיקציה בלבד ואינה קביעה רשמית של זכאות.</p>
      <article className={`result-state ${result} active`} aria-label={`התוצאה שלך: ${state.label}`}>
        <span className="state-badge">{state.label}</span>
        <h2>{state.title}</h2>
        <p>{state.text}</p>
      </article>
      <section className="summary-card"><h2>הפרטים שמסרת</h2><dl><div><dt>גיל</dt><dd>{labels.age[answers.age]}</dd></div><div><dt>מעמד</dt><dd>{labels.citizenship[answers.citizenship]}</dd></div><div><dt>שירות</dt><dd>{labels.service[answers.service]}</dd></div><div><dt>יישוב</dt><dd>{answers.locality} — זכאות היישוב לא נבדקה</dd></div><div><dt>תבחינים</dt><dd>{selectedCriteria}</dd></div></dl></section>
      <div className="legal-notice"><strong>חשוב לדעת</strong><span>התוצאה היא אינדיקציה ראשונית בלבד. אין צורך למסור באתר מידע רפואי, עבר פלילי או מידע רגיש; אם הוא רלוונטי, מדברים עליו בשיחה פרטנית.</span></div>
      <h2 style={{margin:0,fontSize:'22px'}}>רוצים שאבדוק את המקרה שלכם?</h2>
      <div className="result-actions"><a className="btn btn-whatsapp" href={whatsappHref(message)} target="_blank" rel="noreferrer">שלחו את התוצאה ב-WhatsApp <WhatsAppIcon /></a><a className="btn btn-outline" href={phoneHref()}>התקשרו עכשיו</a></div>
    </main>
  </>
}
