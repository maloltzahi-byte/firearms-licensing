import type { Metadata } from 'next'
import Link from 'next/link'
import { HomeHeader } from '@/components/gov-shell'
import { HomeFaq } from '@/components/home/home-faq'
import { LeadForm } from '@/components/screening/lead-form'
import { phoneHref, site, whatsappHref } from '@/lib/site'

export const metadata: Metadata = { title: 'הוצאת רישיון נשק פרטי', description: site.description }

const services = [
  ['01', 'בדיקה ראשונית', 'בדיקה מסודרת של הנתונים והמסלול האפשרי.'],
  ['02', 'ריכוז ובדיקת מסמכים', 'מרכזים את המסמכים הנדרשים ובודקים שאין חוסרים.'],
  ['03', 'אימות תצהיר, ככל שנדרש', 'מכינים ומאמתים תצהיר רק אם הוא נדרש במקרה שלכם.'],
  ['04', 'ליווי הגשה ומעקב מול הרשות', 'מכינים את התיק להגשה וממשיכים עם השלמות ככל שנדרש.'],
] as const

const faqs = [
  ['איך יודעים אם יש טעם להתקדם?', 'הבדיקה נותנת אינדיקציה ראשונית. אם נראה שיש מסלול רלוונטי, אפשר להעביר את המקרה לבדיקה פרטנית במשרד.'],
  ['האם חייבים עורך דין?', 'אין חובה כללית להיעזר בעורך דין לצורך עצם הגשת הבקשה. השירות נועד למי שמעדיף ריכוז, בדיקה וליווי מקצועי של התהליך.'],
  ['כמה זמן לוקח להתחיל?', 'הבדיקה הראשונית באתר קצרה וניתן להתחיל מיד. המשך הטיפול נקבע לפי הנתונים והמסמכים הרלוונטיים למקרה.'],
  ['מה קורה אם לא נמצא מסלול ברור?', 'התוצאה באתר היא אינדיקציה בלבד. אם קיימות נסיבות נוספות, ניתן להעביר את המקרה לבדיקה פרטנית במשרד.'],
] as const

function MiniQuestionnaire() {
  const ages = ['מתחת ל-18', '18–20', '21–26', '27–44', '45 ומעלה']
  return <div className="rc-preview" aria-hidden="true">
    <div className="rc-mini-top">ביטול ויציאה</div>
    <div className="rc-mini-head"><span className="rc-mini-pill wa">וואטסאפ</span><span className="rc-mini-pill call">התקשרו עכשיו</span><strong className="rc-mini-brand">משרד עורכי דין צחי מלול | רישוי כלי ירייה</strong></div>
    <aside className="rc-mini-side"><h4>בדיקה ראשונית</h4><small>שלב 1 מתוך 5</small>{['תנאי בסיס','מעמד','שירות','מצב הבקשה','מסלול'].map((label,index)=><div className={`rc-mini-step${index===0?' active':''}`} key={label}><span>{label}</span><i className="rc-mini-dot" /></div>)}</aside>
    <div className="rc-mini-card">
      <div className="rc-mini-progress-labels"><span>שלב 1 מתוך 5</span><span>שלב הסינון והבדיקה</span></div><div className="rc-mini-progress" />
      <h3>מה טווח הגיל שלך?</h3><p className="help">הגיל הרלוונטי משתנה לפי המעמד, סוג והיקף השירות ולעיתים גם לפי התבחין. אין צורך למסור תאריך לידה.</p>
      <div className="rc-mini-options">{ages.map((age)=><div className={`rc-mini-option${age==='21–26'?' selected':''}`} key={age}><span>{age}</span><i className="rc-mini-radio" /></div>)}</div>
      <div className="rc-mini-hebrew">האם יש לך שליטה בסיסית בעברית?<small>מספיק כדי להבין שאלות והוראות בסיסיות.</small><div className="rc-mini-hebrew-buttons"><span>כן</span><span>לא / לא בטוח</span></div></div>
      <div className="rc-mini-nav"><span className="next">המשך</span><span>חזור</span></div><div className="rc-mini-disc">בדיקה ראשונית בלבד. השאלון אינו בודק את מלוא תנאי הסף, ובכלל זה כשירות רפואית, הכשרה ובדיקת משטרה.</div>
    </div>
  </div>
}

export default function HomePage() {
  return <div className="rc-site">
    <HomeHeader />
    <main id="main">
      <section className="rc-home-hero">
        <div className="rc-home-hero-inner">
          <div className="rc-hero-copy">
            <h1>הוצאת רישיון נשק פרטי</h1>
            <p className="lead">משרד עורכי דין שמרכז עבורכם את כל הנתונים, מייעץ ומכין את התיק להגשת הבקשה.</p>
            <p className="body">במקום לנהל לבד את הבירוקרטיה, מקבלים טיפול מסודר בתיק וליווי מקצועי עד להגשה ובהמשך במעקב מול הרשות.</p>
            <div className="rc-hero-actions">
              <Link className="rc-btn rc-btn-primary primary" href="/check">התחילו בדיקה ראשונית</Link>
              <a className="rc-btn rc-btn-wa wa" href={whatsappHref()} target="_blank" rel="noreferrer">דברו איתנו ב־WhatsApp</a>
              <a className="rc-btn rc-btn-call call" href={phoneHref()}>התקשרו עכשיו</a>
            </div>
            <p className="rc-hero-micro">5 שלבים קצרים · ללא התחייבות · תוצאה ראשונית</p>
            <p className="rc-hero-disclaimer">הבדיקה באתר מספקת אינדיקציה ראשונית בלבד. ההחלטה בבקשה נתונה לרשות המוסמכת.</p>
            <div className="rc-office-strip"><strong>משרד עורכי דין צחי מלול</strong><span>בדיקה ראשונית · הכנת תיק · ליווי הגשה</span></div>
          </div>
          <MiniQuestionnaire />
        </div>
      </section>

      <section id="services" className="rc-services">
        <div className="rc-services-inner">
          <div className="rc-services-copy">
            <h2>אנחנו מרכזים עבורכם את הבקשה, מהבדיקה ועד ההגשה</h2>
            <p>אתם לא צריכים לנהל לבד את הבירוקרטיה. אנחנו בודקים את המקרה, מרכזים את החומר ומכינים את התיק להמשך.</p>
            <div className="rc-services-trust"><strong>אם יש מסלול שכדאי לבדוק, המקרה עובר לבחינה פרטנית במשרד.</strong><span>הבדיקה הראשונית היא נקודת הכניסה. ההחלטה אם וכיצד להתקדם מתקבלת לאחר בחינת הנתונים.</span></div>
          </div>
          <div className="rc-service-steps">{services.map(([n,title,body])=><article className="rc-service-step" key={n}><b>{n}</b><h3>{title}</h3><p>{body}</p></article>)}</div>
          <div className="rc-mid-cta"><h3>רוצים לדעת אם יש טעם להתקדם?</h3><Link className="rc-btn rc-btn-primary" href="/check">התחילו בדיקה ראשונית</Link></div>
        </div>
      </section>

      <section id="preflight" className="rc-preflight">
        <div className="rc-preflight-inner">
          <h2>לפני שמתחילים</h2><p className="rc-preflight-sub">תבחינים ומסמכים - פותחים רק מה שרלוונטי לכם. אין צורך להכין דבר מראש.</p>
          <div className="rc-support-grid">
            <article className="rc-support-card criteria"><div className="rc-support-head"><h3>תבחינים</h3><span className="meta">16 קבוצות תבחין</span></div><p className="intro">לא בטוחים מה מתאים לכם? השאלון ממפה את המסלול הראשוני.</p><div className="rc-support-list"><div className="rc-support-row"><span>מקום מגורים / עבודה</span><span>←</span></div><div className="rc-support-row"><span>שירות בכוחות הביטחון</span><span>←</span></div><div className="rc-support-row"><span>משטרה / שב״ס</span><span>←</span></div><div className="rc-support-row"><span>מקצוע, ספורט או צורך מיוחד</span><a href="/check">פתחו את כל התבחינים</a></div></div></article>
            <article className="rc-support-card docs"><div className="rc-support-head"><h3>מסמכים</h3><span className="meta">4 קבוצות בסיס</span></div><p className="intro">לא צריך להכין מסמכים כדי להתחיל את הבדיקה הראשונית.</p><div className="rc-support-list"><div className="rc-support-row"><span>תעודת זהות + ספח</span><span>בסיסי</span></div><div className="rc-support-row"><span>הצהרת בריאות</span><span>נדרש</span></div><div className="rc-support-row"><span>אסמכתאות שירות / פטור</span><span>לפי המסלול</span></div><div className="rc-support-row"><span>מסמכים לפי התבחין</span><span>משתנה</span></div></div></article>
          </div>
        </div>
      </section>

      <section id="faq" className="rc-faq"><div className="rc-faq-panel"><h2>שאלות נפוצות</h2><p className="sub">התשובות שחשוב לדעת לפני שמתחילים.</p><HomeFaq items={faqs} /></div></section>

      <section id="contact" className="rc-final"><div className="rc-final-inner">
        <div className="rc-final-copy"><h2>רוצים שנבדוק ונכין את הבקשה?</h2><p>מתחילים בבדיקה ראשונית קצרה. אם יש טעם להתקדם, ממשיכים להכנת התיק וליווי ההגשה.</p><div className="rc-final-actions"><Link className="rc-btn rc-btn-primary primary" href="/check">התחילו בדיקה ראשונית</Link><a className="rc-btn rc-btn-wa wa" href={whatsappHref()} target="_blank" rel="noreferrer">דברו איתנו ב־WhatsApp</a><a className="rc-btn rc-btn-call call" href={phoneHref()}>התקשרו עכשיו</a></div></div>
        <div className="rc-final-form-wrap"><LeadForm /></div><i className="rc-final-rule" aria-hidden="true" />
        <footer className="rc-final-footer"><span>מדיניות פרטיות&nbsp;&nbsp; · &nbsp;&nbsp;הצהרת נגישות&nbsp;&nbsp; · &nbsp;&nbsp;תנאי שימוש</span><strong>משרד עורכי דין צחי מלול | רישוי כלי ירייה</strong></footer>
      </div></section>
    </main>
  </div>
}
