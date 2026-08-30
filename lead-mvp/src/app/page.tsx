import type { Metadata } from 'next'
import { ScreeningStartLink } from '@/components/screening-start-link'
import { getScreeningConfig } from '@/lib/screening-data'
import { phoneHref, site, whatsappHref } from '@/lib/site'

export const metadata: Metadata = {
  title: 'בדיקה ראשונית לרישוי כלי ירייה פרטי',
  description: 'בדיקה ראשונית של תבחינים אפשריים וליווי משפטי אישי בהליך רישוי כלי ירייה פרטי בישראל.',
  openGraph: {
    title: 'בדיקה ראשונית לרישוי כלי ירייה פרטי',
    description: 'חמש שאלות קצרות לבדיקת בסיס ראשוני למסלול רישוי, ולאחר מכן בדיקה פרטנית עם עורך דין.',
  },
}

const faqs = [
  ['האם הבדיקה באתר קובעת שאני זכאי?', 'לא. זו בדיקה ראשונית בלבד. ההכרעה אם קיים מסלול מתאים דורשת בדיקה פרטנית של הדין, הנסיבות והמסמכים.'],
  ['כמה זמן לוקחת הבדיקה הראשונית?', 'השאלון כולל חמש שאלות קצרות ונועד להסתיים בתוך דקות ספורות, בלי העלאת מסמכים ובלי הרשמה.'],
  ['האם אתם מבקשים תעודת זהות או מידע רפואי?', 'לא בשלב הזה. האתר אינו מבקש מספר תעודת זהות, עבר פלילי, מידע רפואי או פרטי צווי הרחקה.'],
  ['איך נקבעת זכאות לפי יישוב?', 'היישוב שתקלידו משמש רק לזיהוי שם המקום. האתר אינו קובע זכאות יישוב; בדיקה כזו נעשית מול המקור הממשלתי הרשמי או במסגרת הבדיקה המשפטית.'],
  ['מה קורה אחרי השארת פרטים?', 'הפנייה נשלחת למשרד במייל. עורך הדין בוחן את פרטי הסינון וחוזר אליכם לצורך בדיקה פרטנית.'],
  ['האם משלמים באתר?', 'לא. אין באתר סליקה או חיוב. אם תחליטו להתקדם, שכר הטרחה והיקף הטיפול יסוכמו מראש ובכתב.'],
]

export default function HomePage() {
  const { criteria } = getScreeningConfig()
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    name: site.lawyerName,
    url: site.url,
    telephone: site.phone || undefined,
    address: site.address || undefined,
    areaServed: { '@type': 'Country', name: 'Israel' },
    serviceType: 'ליווי משפטי בהליכי רישוי כלי ירייה פרטי',
  }

  return (
    <main id="main">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="hero">
        <div className="shell hero-copy">
          <span className="eyebrow">RFL / בדיקה ראשונית וליווי משפטי</span>
          <h1>לפני שמתחילים הליך, בודקים אם יש בכלל מסלול.</h1>
          <p>חמש שאלות קצרות יסייעו לזהות אם קיים בסיס ראשוני לבדיקה מעמיקה. בלי הרשמה, בלי מסמכים ובלי קביעה אוטומטית של זכאות.</p>
          <ScreeningStartLink />
          <p className="hero-note">הבדיקה היא כלי עזר ראשוני בלבד ואינה חוות דעת משפטית.</p>
        </div>
      </section>

      <section className="section white" id="how">
        <div className="shell">
          <div className="section-head"><h2>איך זה עובד</h2><p>תהליך קצר שנועד לחסוך זמן ולהגיע לשיחה עם מידע ממוקד.</p></div>
          <div className="steps-grid">
            {[
              ['01', 'עונים על 5 שאלות', 'גיל בטווח, מעמד, שירות, יישוב וקבוצת תבחין.'],
              ['02', 'מקבלים אינדיקציה', 'ירוק, צהוב או אדום — בלי ניסוח של זכאות ובלי הבטחת תוצאה.'],
              ['03', 'משאירים פרטים', 'שם, טלפון ואימייל בלבד, עם אפשרות להוסיף הערה קצרה.'],
              ['04', 'עורך הדין בודק', 'הבדיקה המשפטית המלאה נעשית בשיחה ולא על ידי האלגוריתם.'],
            ].map(([num, title, text]) => <article className="step-card" key={num}><span className="num">{num}</span><h3>{title}</h3><p>{text}</p></article>)}
          </div>
        </div>
      </section>

      <section className="section" id="criteria">
        <div className="shell">
          <div className="section-head"><h2>התבחינים העיקריים</h2><p>השאלון נשען על 15 קבוצות התבחין שבבסיס הרגולטורי של הפרויקט. הבחירה בקבוצה אינה קביעה שהמסלול מתקיים בפועל.</p></div>
          <div className="criteria-grid">
            {criteria.map((criterion, index) => <article className="criterion-card" key={criterion.id}><span>{String(index + 1).padStart(2, '0')}</span><h3>{criterion.he}</h3></article>)}
          </div>
        </div>
      </section>

      <section className="section white">
        <div className="shell about-grid">
          <div className="about-panel"><span className="eyebrow" style={{color:'var(--blue)'}}>ליווי אישי</span><h2>{site.lawyerName}</h2><p>האתר נועד לבצע סינון ראשוני בלבד. לאחר הפנייה, הבדיקה עוברת לעורך הדין לצורך בחינת המסלול הרלוונטי, המסמכים הנדרשים והצעדים האפשריים.</p></div>
          <aside className="instrument-card"><strong>העיקרון המנחה</strong><div className="line"/><p>המערכת אינה מחליפה שיקול דעת מקצועי, אינה מכריעה בזכאות ואינה מתחייבת לקבלת רישיון.</p></aside>
        </div>
      </section>

      <section className="section" id="faq">
        <div className="shell"><div className="section-head"><h2>שאלות נפוצות</h2></div><div className="faq-grid">{faqs.map(([q,a]) => <article className="faq-card" key={q}><h3>{q}</h3><p>{a}</p></article>)}</div></div>
      </section>

      <section className="section white">
        <div className="shell"><div className="section-head"><h2>מחיר ומה כלול</h2><p>האתר אינו גובה תשלום. לאחר הבדיקה הראשונית והשיחה, ואם יש הצדקה להתקדם, תקבלו מראש הצעת שכר טרחה ברורה ובכתב.</p></div><div className="value-grid"><article className="value-card"><h3>בדיקה פרטנית</h3><p>בחינת הנתונים שנמסרו מול המסלול המשפטי האפשרי.</p></article><article className="value-card"><h3>הגדרת מסמכים</h3><p>הבהרה אילו מסמכים נדרשים כדי לבדוק ולהתקדם במסלול.</p></article><article className="value-card"><h3>תוכנית פעולה</h3><p>הסבר ברור על הצעדים הבאים לפני התחייבות לטיפול.</p></article></div></div>
      </section>

      <section className="section dark">
        <div className="shell contact-band"><div className="section-head" style={{marginBottom:0}}><h2>רוצים לבדוק את המקרה שלכם?</h2><p>אפשר להתחיל בשאלון או לפנות ישירות למשרד.</p></div><div className="contact-actions"><ScreeningStartLink />{site.phone ? <a className="button-secondary" href={phoneHref()}>התקשרו למשרד</a> : null}{site.whatsapp ? <a className="button-secondary" href={whatsappHref()} target="_blank" rel="noreferrer">וואטסאפ</a> : null}</div></div>
      </section>
    </main>
  )
}
