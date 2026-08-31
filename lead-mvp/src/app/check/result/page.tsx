'use client'
import Link from 'next/link'
import { FlowHeader,PhoneIcon,WhatsAppIcon } from '@/components/gov-shell'
import { LeadForm } from '@/components/screening/lead-form'
import { useScreening } from '@/components/screening/screening-provider'
import { labels } from '@/lib/screening'
import { phoneHref,whatsappHref } from '@/lib/site'

const states={
  green:{label:'ירוק',title:'נראה שיש בסיס לבדיקה מעמיקה',text:'לפי התשובות שנמסרו, ייתכן שקיים בסיס למסלול מתאים. השלב הבא הוא בדיקה פרטנית מול עורך דין.'},
  yellow:{label:'צהוב',title:'ייתכן שקיים מסלול — נדרשת בדיקה פרטנית',text:'לפי התשובות שמסרת ייתכן שקיים מסלול מתאים, אך נדרש בירור פרטני לפני שמתקדמים. אפשר להמשיך לשיחה עם עורך דין.'},
  red:{label:'אדום',title:'כרגע לא נראה מסלול ברור',text:'לפי המידע בשאלון לא זוהה מסלול ברור, אך ניתן לפנות אם קיימות נסיבות נוספות שלא נשאלו באתר.'}
} as const

export default function ResultPage(){
  const{answers,result,config}=useScreening()
  if(!answers.age||!answers.citizenship||!answers.service||!answers.locality)return <><FlowHeader/><main id="main" className="result-final"><h1>כדי להציג תוצאה צריך להשלים את הבדיקה</h1><Link className="rfl-btn home-primary" href="/check">התחלת בדיקה</Link></main></>
  const selected=config.criteria.filter(c=>answers.criteria.includes(c.id)).map(c=>c.he).join(', ')||'לא בטוח / אף אחד מהם'
  const s=states[result]
  const msg=`שלום, ביצעתי בדיקה ראשונית באתר. תוצאה: ${s.label}. אשמח לבדיקה פרטנית.`
  return <><FlowHeader/><main id="main" className="result-final">
    <h1>תוצאה ראשונית</h1>
    <p className="result-sub-final">התוצאה היא אינדיקציה בלבד ואינה קביעה רשמית של זכאות.</p>
    <article className={`result-state-final ${result}`}><span className="result-badge-final">{s.label}</span><h2>{s.title}</h2><p>{s.text}</p></article>
    <section className="summary-final"><h2>הפרטים שמסרת</h2><dl>
      <div><dt>גיל</dt><dd><bdi dir="ltr">{labels.age[answers.age]}</bdi></dd></div>
      <div><dt>מעמד</dt><dd>{labels.citizenship[answers.citizenship]}</dd></div>
      <div><dt>שירות</dt><dd>{labels.service[answers.service]}</dd></div>
      <div><dt>יישוב</dt><dd>{answers.locality} — זכאות היישוב לא נבדקה</dd></div>
      <div><dt>תבחינים</dt><dd>{selected}</dd></div>
    </dl></section>
    <div className="legal-notice-final"><strong>חשוב לדעת</strong><span>התוצאה היא אינדיקציה ראשונית בלבד. אין צורך למסור באתר מידע רפואי, עבר פלילי או מידע רגיש; אם הוא רלוונטי, מדברים עליו בשיחה פרטנית.</span></div>
    <h2 className="result-cta-final">רוצים שנבדוק את המקרה שלכם?</h2>
    <div className="result-actions-final"><a className="rfl-btn rfl-whatsapp" href={whatsappHref(msg)} target="_blank" rel="noreferrer"><span>וואטסאפ</span><WhatsAppIcon/></a><a className="rfl-btn rfl-call" href={phoneHref()}><span>התקשרו עכשיו</span><PhoneIcon/></a></div>
    <div className="result-callback-final"><LeadForm variant="result"/></div>
  </main></>
}
