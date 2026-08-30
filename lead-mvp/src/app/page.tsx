import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumb, HomeFooter, HomeHeader, ServiceSidebar, WhatsAppIcon } from '@/components/gov-shell'
import { phoneHref, site, whatsappHref } from '@/lib/site'

export const metadata: Metadata = {
  title: 'הוצאת רישיון נשק פרטי',
  description: 'בדיקה ראשונית וליווי מקצועי לאורך תהליך הגשת בקשה לרישיון כלי ירייה פרטי.',
}

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
            <h1>הוצאת רישיון נשק פרטי</h1>
            <h2>לפני שמגישים בקשה, עושים סדר בתבחין, במסמכים ובשלבים</h2>
            <p>בדיקה ראשונית וליווי מקצועי לאורך התהליך, כדי לצמצם טעויות, להבין מראש מה נדרש ולהתקדם בצורה מסודרת מול ההליך הרשמי.</p>
            <div className="action-row">
              <Link className="btn btn-primary" href="/check">בדיקה ראשונית</Link>
              <a className="btn btn-whatsapp" href={whatsappHref()} target="_blank" rel="noreferrer">דברו איתנו ב-WhatsApp <WhatsAppIcon /></a>
            </div>
          </section>
          <div className="info-banner"><strong>i</strong><span>הבדיקה הראשונית באתר ללא עלות. היא מספקת אינדיקציה בלבד; הרישיון ניתן על ידי הרשות המוסמכת ובהתאם לדין.</span></div>
          <section className="included-card" id="included">
            <div className="blue-rule" /><h2>מה כולל הליווי?</h2>
            <ul><li>בדיקה ראשונית של התאמה למסלול אפשרי</li><li>הכוונה לגבי שלבי הבקשה והמסמכים הנדרשים</li><li>ליווי אישי מול עורך הדין לאורך התהליך</li><li>חתימה ואימות תצהיר עו״ד כאשר ההליך דורש זאת</li></ul>
          </section>
          <section className="included-card" id="why">
            <div className="blue-rule" /><h2>למה לבחור בליווי?</h2>
            <div className="result-states">
              <article className="summary-card"><h3 style={{margin:'0 0 8px'}}>בדיקה לפני שמתחילים</h3><p style={{margin:0}}>ממקדים את המסלול האפשרי לפני שמתקדמים ומצמצמים פעולות מיותרות.</p></article>
              <article className="summary-card"><h3 style={{margin:'0 0 8px'}}>הכוונה למסמכים ולשלבים</h3><p style={{margin:0}}>מבינים מה רלוונטי למקרה שלכם ומהו השלב הבא בתהליך.</p></article>
              <article className="summary-card"><h3 style={{margin:'0 0 8px'}}>ליווי אישי של עו״ד</h3><p style={{margin:0}}>ממשיכים מול עו״ד צחי מלול ולא מול מערכת אוטומטית.</p></article>
            </div>
            <div className="info-banner compact"><strong>₪</strong><span>הבדיקה הראשונית באתר ללא עלות. המשך הליווי, ככל שיידרש, יתומחר ויסוכם מראש.</span></div>
          </section>
          <section className="faq-stack" id="faq">
            <details className="gov-accordion" open><summary>איך השירות עובד?</summary><p>עונים על 5 שאלות קצרות, מקבלים אינדיקציה ראשונית ולאחר מכן ממשיכים לשיחה אישית עם עורך הדין. הבדיקה אינה מחליפה החלטה רשמית של הרשות.</p></details>
            <details className="gov-accordion"><summary>מי יכול להגיש בקשה?</summary><p>מי שעומד בתנאי הסף ובאחד התבחינים הקבועים בדין יכול לשקול הגשת בקשה. הבדיקה באתר נועדה רק למקד את הבירור הראשוני.</p></details>
            <details className="gov-accordion"><summary>אילו מסמכים עשויים להידרש?</summary><p>המסמכים משתנים לפי התבחין והנסיבות. במסגרת הליווי נסביר אילו אישורים ומסמכים רלוונטיים למקרה שלכם.</p></details>
            <details className="gov-accordion"><summary>מה קורה לאחר הבדיקה הראשונית?</summary><p>ניתן לפנות ישירות ב-WhatsApp או בטלפון ולהמשיך לבדיקה פרטנית וליווי בהתאם לצורך.</p></details>
          </section>
          <section className="lawyer-card" id="contact">
            <h2>הליווי מתבצע אישית על ידי עו״ד צחי מלול</h2>
            <p>לאחר הבדיקה הראשונית ממשיכים לשיחה אישית עם עורך הדין, שמסביר את המסלול האפשרי, המסמכים והשלבים הרלוונטיים ומלווה את התהליך לפי הצורך.</p>
            <div className="action-row compact"><a className="btn btn-whatsapp" href={whatsappHref()} target="_blank" rel="noreferrer">WhatsApp <WhatsAppIcon /></a><a className="btn btn-outline" href={phoneHref()}>התקשרו עכשיו</a></div>
          </section>
        </div>
      </div>
    </main>
    <HomeFooter />
  </>
}
