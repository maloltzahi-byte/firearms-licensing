import type { Metadata } from 'next'
import Link from 'next/link'
import { HomeFooter, HomeHeader, PhoneIcon, ServiceSidebar, WhatsAppIcon } from '@/components/gov-shell'
import { HomeFaq } from '@/components/home/home-faq'
import { LeadForm } from '@/components/screening/lead-form'
import { phoneHref, site, whatsappHref } from '@/lib/site'

export const metadata: Metadata = { title: 'הוצאת רישיון נשק פרטי', description: site.description }

const benefits = [
  ['01', 'בדיקה ראשונית', 'בודקים אם יש טעם להתקדם ומה נכון לבדוק כבר בתחילת הדרך, כולל עמידה בתנאי הסף הנדרשים.', true],
  ['02', 'סדר במסמכים', 'מבינים אילו מסמכים עשויים להיות רלוונטיים ואיך להתארגן נכון כדי למנוע דחיות ועיכובים מיותרים.', false],
  ['03', 'מיקוד בתהליך', 'מקבלים תמונה מסודרת של השלבים האפשריים במקום לפעול בחוסר ודאות מול המערכת הבירוקרטית.', false],
  ['04', 'אימות תצהיר מול עורך דין', 'אם בהמשך עולה צורך בתצהיר משפטי חתום, ניתן להשלים אותו במהירות ובאופן מסודר מול עורך דין.', true],
] as const

const faqs = [
  ['איך השירות עובד?', 'עונים על 5 שאלות קצרות, ממלאים שם וטלפון בשלב הסיום, ותשובות השאלון נשלחות למשרד יחד עם פרטי הקשר. לאחר השליחה מוצגת תוצאה ראשונית, והבדיקה אינה מחליפה החלטה רשמית של הרשות.'],
  ['מי יכול להגיש בקשה?', 'מי שעומד בתנאי הסף ובאחד התבחינים הקבועים בדין יכול לשקול הגשת בקשה. הבדיקה באתר נועדה למקד את הבירור הראשוני.'],
  ['אילו מסמכים עשויים להידרש?', 'המסמכים משתנים לפי התבחין והנסיבות. במסגרת השירות נסביר אילו אישורים ומסמכים רלוונטיים למקרה שלכם.'],
  ['מה קורה לאחר הבדיקה הראשונית?', 'לאחר השלמת השאלון ופרטי הקשר, המידע נשלח למשרד לצורך בדיקה וחזרה אליכם. ניתן גם לפנות ישירות בוואטסאפ או בטלפון.'],
] as const

export default function HomePage() {
  return <div className="home-final">
    <HomeHeader />
    <div className="home-breadcrumb-spacer" aria-hidden="true" />
    <main id="main" className="home-layout">
      <ServiceSidebar />
      <div className="home-content-final">
        <section className="home-hero-final" aria-labelledby="home-title">
          <h1 id="home-title">הוצאת רישיון נשק פרטי</h1>
          <h2>בדיקה ראשונית והכוונה מקצועית של עורך דין לכל אורך התהליך והגשת הבקשה</h2>
          <i className="hero-rule" aria-hidden="true" />
          <p>השירות מיועד למי ששוקל להגיש בקשה לרישיון נשק פרטי ורוצה להבין בצורה מסודרת מה נדרש, אילו שלבים צפויים בהמשך, ומתי יש צורך בתצהיר או בבדיקה משפטית נוספת.</p>
          <Link className="home-primary" href="/check">התחילו בדיקה ראשונית</Link>
        </section>

        <div className="info-banner-final"><span>הבדיקה הראשונית באתר ללא עלות. המשך ליווי, ככל שיידרש, יתומחר ויסוכם מראש.</span><b className="info-dot" aria-hidden="true">i</b></div>

        <section id="included" className="benefits-final" aria-labelledby="benefits-title">
          <header className="section-head-final"><h2 id="benefits-title">מה מקבלים בפועל?</h2><p>בדיקה ראשונית, סדר בתהליך והכוונה ברורה להמשך.</p></header>
          <div className="benefits-grid-final">{benefits.map(([number, title, body, primary]) => <article className={`benefit-final${primary ? ' primary' : ''}`} key={number}><div className="benefit-head-final"><span className="num">{number}</span><h3>{title}</h3></div><hr /><p>{body}</p></article>)}</div>
        </section>

        <section id="faq" className="faq-final" aria-labelledby="faq-title">
          <header className="faq-title-final"><h2 id="faq-title">שאלות נפוצות</h2><i aria-hidden="true" /></header>
          <HomeFaq items={faqs} />
        </section>

        <section id="contact" className="lawyer-callback-final" aria-labelledby="lawyer-title">
          <header className="lawyer-head-final">
            <h2 id="lawyer-title">עורך דין לצדכם בהמשך התהליך</h2>
            <p>הכוונה מסודרת והמשך טיפול בהתאם לצורך</p>
          </header>
          <div className="lawyer-body-final">
            <h3 className="lawyer-body-title-final">מענה אישי של עורך דין</h3>
            <p>לאחר הבדיקה הראשונית אפשר להמשיך למענה אישי של עורך דין, כדי להבין את המסלול האפשרי, את המסמכים הנדרשים ואת הצעדים הבאים בצורה מסודרת וברורה.</p>
            <div className="contact-split-final">
              <div className="direct-buttons-final"><Link className="rfl-btn home-primary" href="/check">התחילו בדיקה ראשונית</Link><a className="rfl-btn rfl-whatsapp" href={whatsappHref()} target="_blank" rel="noreferrer"><span>וואטסאפ</span><WhatsAppIcon /></a><a className="rfl-btn rfl-call" href={phoneHref()}><span>התקשרו עכשיו</span><PhoneIcon /></a></div>
              <div className="contact-label-final"><h3>צרו קשר ישיר:</h3><p>מענה מהיר ומקצועי על ידי צוות המשרד</p><span className="trust-pill">עמידה קפדנית בכל דרישות החוק</span></div>
            </div>
          </div>
          <div className="callback-wrap-final"><LeadForm /></div>
        </section>
      </div>
    </main>
    <HomeFooter />
  </div>
}
