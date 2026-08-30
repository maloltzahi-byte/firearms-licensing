import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumb, HomeFooter, HomeHeader, ServiceSidebar, WhatsAppIcon } from '@/components/gov-shell'
import { phoneHref, site, whatsappHref } from '@/lib/site'

export const metadata: Metadata = {
  title: 'הוצאת רישיון נשק פרטי',
  description: 'בדיקה ראשונית, הכוונה וליווי של עורך דין לאורך תהליך הגשת בקשה לרישיון כלי ירייה פרטי.',
}

const included = [
  ['01', 'בדיקה ראשונית', 'בדיקת התאמה למסלול אפשרי לפני שמתחילים, כדי להבין אם נכון להתקדם.'],
  ['02', 'מסמכים ושלבים', 'הכוונה למסמכים ולשלבים הרלוונטיים למקרה שלכם ולשלב שבו אתם נמצאים.'],
  ['03', 'ליווי של עורך דין', 'המשך אישי מול עורך דין ולא מול מערכת אוטומטית, בהתאם לצורך.'],
  ['04', 'תצהיר כשנדרש', 'חתימה ואימות תצהיר עורך דין כאשר ההליך או המסלול דורשים זאת.'],
] as const

const reasons = [
  ['בדיקה לפני שמתחילים', 'ממקדים את המסלול האפשרי מראש ומצמצמים פעולות, טעויות ועיכובים מיותרים.'],
  ['הכוונה למסמכים ולשלבים', 'מבינים מה רלוונטי למקרה שלכם ומהו השלב הבא בתהליך, במקום לפעול בלי סדר.'],
  ['ליווי של עורך דין', 'כשצריך להמשיך, עוברים לשיחה אישית עם עורך דין שמכיר את התהליך ומלווה לפי הצורך.'],
] as const

export default function HomePage() {
  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'LegalService', name: site.name, url: site.url,
    telephone: site.phone, areaServed: { '@type': 'Country', name: 'Israel' },
    serviceType: 'ליווי והכוונה בהליך הוצאת רישיון כלי ירייה פרטי',
  }
  return <>
    <HomeHeader />
    <Breadcrumb current="ליווי בהגשת בקשה" />
    <main id="main" className="home-main">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="service-layout">
        <ServiceSidebar />
        <div className="service-content">
          <section className="service-intro">
            <span className="hero-label">שירות פרטי בליווי משפטי אישי</span>
            <h1>הוצאת רישיון נשק פרטי</h1>
            <h2>בדיקה ראשונית, הכוונה וליווי של עורך דין לאורך שלבי התהליך</h2>
            <p>השירות מיועד למי ששוקל להגיש בקשה לרישיון נשק פרטי ורוצה להבין בצורה מסודרת מה נדרש, אילו שלבים צפויים בהמשך, ומתי יש צורך בתצהיר או בליווי נוסף.</p>
            <div className="action-row">
              <Link className="btn btn-primary" href="/check">בדיקה ראשונית</Link>
              <a className="btn btn-whatsapp" href={whatsappHref()} target="_blank" rel="noreferrer">דברו איתנו ב-WhatsApp <WhatsAppIcon /></a>
            </div>
            <div className="hero-trust-line">הבדיקה הראשונית באתר ללא עלות. המשך ליווי, ככל שיידרש, יתומחר ויסוכם מראש.</div>
            <p className="hero-disclaimer">הבדיקה באתר מספקת אינדיקציה ראשונית בלבד. הרישיון ניתן על ידי הרשות המוסמכת ובהתאם לדין.</p>
          </section>

          <section className="included-card interactive-section" id="included">
            <span className="section-kicker">ליווי מסודר, צעד אחר צעד</span>
            <h2>מה כולל הליווי?</h2>
            <div className="interactive-card-grid">
              {included.map(([index,title,body]) => <details className="interactive-card" key={title}>
                <summary><span className="feature-index">{index}</span><span className="feature-title">{title}</span><span className="feature-plus" aria-hidden="true">+</span></summary>
                <p>{body}</p>
              </details>)}
            </div>
          </section>

          <section className="why-section" id="why">
            <span className="section-kicker">שירות פרטי, לא מערכת אוטומטית</span>
            <h2>למה לבחור בשירות שלנו?</h2>
            <div className="why-grid">
              {reasons.map(([title,body]) => <details className="why-card" key={title}>
                <summary><span className="feature-title">{title}</span><span className="feature-plus" aria-hidden="true">+</span></summary>
                <p>{body}</p>
              </details>)}
            </div>
            <div className="pricing-note">הבדיקה הראשונית באתר ללא עלות. אם יהיה צורך בהמשך ליווי, היקף השירות ושכר הטרחה יסוכמו מראש.</div>
          </section>

          <section className="faq-stack" id="faq">
            <details className="gov-accordion" open><summary>איך השירות עובד?</summary><p>עונים על 5 שאלות קצרות, מקבלים אינדיקציה ראשונית ולאחר מכן, אם רוצים, ממשיכים לשיחה אישית עם עורך דין. הבדיקה אינה מחליפה החלטה רשמית של הרשות.</p></details>
            <details className="gov-accordion"><summary>מי יכול להגיש בקשה?</summary><p>מי שעומד בתנאי הסף ובאחד התבחינים הקבועים בדין יכול לשקול הגשת בקשה. הבדיקה באתר נועדה רק למקד את הבירור הראשוני.</p></details>
            <details className="gov-accordion"><summary>אילו מסמכים עשויים להידרש?</summary><p>המסמכים משתנים לפי התבחין והנסיבות. במסגרת הליווי נסביר אילו אישורים ומסמכים רלוונטיים למקרה שלכם.</p></details>
            <details className="gov-accordion"><summary>מה קורה לאחר הבדיקה הראשונית?</summary><p>ניתן לפנות ישירות ב-WhatsApp או בטלפון ולהמשיך לבדיקה פרטנית וליווי בהתאם לצורך.</p></details>
          </section>

          <section className="lawyer-card" id="contact">
            <h2>ליווי אישי של עורך דין</h2>
            <p>לאחר הבדיקה הראשונית ניתן להמשיך לשיחה אישית עם עורך דין, להבין את המסלול האפשרי, המסמכים והשלבים הרלוונטיים ולהחליט אם יש צורך בהמשך ליווי.</p>
            <div className="office-endorsement">בליווי משרד עורכי דין צחי מלול</div>
            <div className="action-row compact"><a className="btn btn-outline" href={phoneHref()}>התקשרו עכשיו</a><a className="btn btn-whatsapp" href={whatsappHref()} target="_blank" rel="noreferrer">WhatsApp <WhatsAppIcon /></a></div>
          </section>
        </div>
      </div>
    </main>
    <HomeFooter />
  </>
}
