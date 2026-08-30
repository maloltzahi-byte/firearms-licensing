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
    telephone: site.phone, email: site.email, areaServed: { '@type': 'Country', name: 'Israel' },
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
            <h2>ליווי מקצועי של משרד עו״ד צחי מלול לאורך כל התהליך</h2>
            <p>שירות פרטי המיועד למי שמעוניין להגיש בקשה לרישיון כלי ירייה פרטי ולקבל ליווי, הכוונה ובדיקה ראשונית לפני ובמהלך ההליך.</p>
            <div className="action-row">
              <a className="btn btn-whatsapp" href={whatsappHref()} target="_blank" rel="noreferrer">שלחו הודעה ב-WhatsApp <WhatsAppIcon /></a>
              <Link className="btn btn-primary" href="/check">התחילו בדיקה ראשונית</Link>
            </div>
          </section>
          <div className="info-banner"><strong>i</strong><span>הבדיקה באתר מספקת אינדיקציה ראשונית בלבד. הרישיון ניתן על ידי הרשות המוסמכת ובהתאם לתנאים הקבועים בדין.</span></div>
          <div className="single-action"><Link className="btn btn-primary" href="/check">התחילו בבדיקה</Link></div>
          <section className="included-card" id="included">
            <div className="blue-rule" /><h2>מה כולל הליווי?</h2>
            <ul><li>בדיקה ראשונית של התאמה למסלול אפשרי</li><li>הכוונה לגבי שלבי הבקשה והמסמכים הנדרשים</li><li>ליווי אישי מול עורך הדין לאורך התהליך</li><li>חתימה ואימות תצהיר עו״ד כאשר ההליך דורש זאת</li></ul>
          </section>
          <section className="faq-stack" id="faq">
            <details className="gov-accordion" open><summary>איך השירות עובד?</summary><p>עונים על 5 שאלות קצרות, מקבלים אינדיקציה ראשונית ולאחר מכן ממשיכים לשיחה אישית עם עורך הדין. הבדיקה אינה מחליפה החלטה רשמית של הרשות.</p></details>
            <details className="gov-accordion"><summary>מי יכול להגיש בקשה?</summary><p>מי שעומד בתנאי הסף ובאחד התבחינים הקבועים בדין יכול לשקול הגשת בקשה. הבדיקה באתר נועדה רק למקד את הבירור הראשוני.</p></details>
            <details className="gov-accordion"><summary>אילו מסמכים עשויים להידרש?</summary><p>המסמכים משתנים לפי התבחין והנסיבות. במסגרת הליווי נסביר אילו אישורים ומסמכים רלוונטיים למקרה שלכם.</p></details>
            <details className="gov-accordion"><summary>מה קורה לאחר הבדיקה הראשונית?</summary><p>ניתן לפנות ישירות ב-WhatsApp, בטלפון או באימייל ולהמשיך לבדיקה פרטנית וליווי בהתאם לצורך.</p></details>
          </section>
          <section className="lawyer-card" id="contact">
            <h2>ליווי עו״ד לאורך התהליך</h2>
            <p>השירות אינו מציג כאילו קיימת חובה לשכור עורך דין לצורך עצם הגשת הבקשה. מטרת הליווי היא לעשות סדר, לצמצם טעויות, לסייע בהבנת הדרישות ולטפל ברכיבים משפטיים כאשר הם נדרשים.</p>
            <div className="action-row compact"><a className="btn btn-outline" href={phoneHref()}>{site.phone}</a><a className="btn btn-whatsapp" href={whatsappHref()} target="_blank" rel="noreferrer">WhatsApp <WhatsAppIcon /></a></div>
          </section>
        </div>
      </div>
    </main>
    <HomeFooter />
  </>
}
