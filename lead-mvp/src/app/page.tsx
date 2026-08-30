import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumb, HomeFooter, HomeHeader, ServiceSidebar, ShieldCheckIcon, WhatsAppIcon } from '@/components/gov-shell'
import { phoneHref, site, whatsappHref } from '@/lib/site'

export const metadata: Metadata = {
  title: 'הוצאת רישיון נשק פרטי',
  description: 'בדיקה ראשונית, הכוונה וליווי של עורך דין לאורך תהליך הגשת בקשה לרישיון כלי ירייה פרטי.',
}

const benefits = [
  ['01', 'בדיקה ראשונית', 'בודקים אם יש טעם להתקדם ומה נכון לבדוק כבר בתחילת הדרך, כולל עמידה בתנאי הסף הנדרשים.', true],
  ['02', 'סדר במסמכים', 'מבינים אילו מסמכים עשויים להיות רלוונטיים ואיך להתארגן נכון כדי למנוע דחיות ועיכובים מיותרים.', false],
  ['03', 'מיקוד בתהליך', 'מקבלים תמונה מסודרת של השלבים האפשריים במקום לפעול בחוסר ודאות מול המערכת הבירוקרטית.', false],
  ['04', 'תצהיר כשנדרש', 'אם בהמשך עולה צורך בתצהיר משפטי חתום, ניתן להשלים אותו במהירות ובאופן מסודר מול עורך דין.', true],
] as const

const faqs = [
  ['01', 'איך השירות עובד?', 'עונים על 5 שאלות קצרות, מקבלים אינדיקציה ראשונית ולאחר מכן ממשיכים לשיחה אישית עם עורך דין. הבדיקה אינה מחליפה החלטה רשמית של הרשות.'],
  ['02', 'מי יכול להגיש בקשה?', 'מי שעומד בתנאי הסף ובאחד התבחינים הקבועים בדין יכול לשקול הגשת בקשה. הבדיקה באתר נועדה למקד את הבירור הראשוני.'],
  ['03', 'אילו מסמכים עשויים להידרש?', 'המסמכים משתנים לפי התבחין והנסיבות. במסגרת השירות נסביר אילו אישורים ומסמכים רלוונטיים למקרה שלכם.'],
  ['04', 'מה קורה לאחר הבדיקה הראשונית?', 'ניתן לפנות ישירות בוואטסאפ או בטלפון ולהמשיך לבדיקה פרטנית בהתאם לצורך.'],
] as const

export default function HomePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    name: site.name,
    url: site.url,
    telephone: site.phone,
    areaServed: { '@type': 'Country', name: 'Israel' },
    serviceType: 'ליווי והכוונה בהליך הוצאת רישיון כלי ירייה פרטי',
  }

  return <>
    <HomeHeader />
    <Breadcrumb current="רישוי כלי ירייה  ‹  ליווי בהגשת בקשה" />
    <main id="main" className="home-main">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="service-layout">
        <ServiceSidebar />

        <div className="service-content">
          <section className="home-hero" aria-labelledby="home-title">
            <div className="home-hero-copy">
              <h1 id="home-title">הוצאת רישיון נשק פרטי</h1>
              <h2>בדיקה ראשונית, הכוונה וליווי של עורך דין לאורך שלבי התהליך</h2>
              <div className="home-hero-rule" aria-hidden="true" />
              <p>השירות מיועד למי ששוקל להגיש בקשה לרישיון נשק פרטי ורוצה להבין בצורה מסודרת מה נדרש, אילו שלבים צפויים בהמשך, ומתי יש צורך בתצהיר או בליווי נוסף.</p>
            </div>
            <div className="home-hero-actions">
              <a className="home-pill home-pill-whatsapp" href={whatsappHref()} target="_blank" rel="noreferrer">
                <span>שלחו הודעה בוואטסאפ</span><WhatsAppIcon variant="outline" size={20} />
              </a>
              <Link className="home-pill home-pill-primary" href="/check">התחילו בדיקה ראשונית</Link>
            </div>
          </section>

          <div className="info-banner home-info-banner">
            <strong aria-hidden="true">i</strong>
            <span>הבדיקה הראשונית באתר ללא עלות. המשך ליווי, ככל שיידרש, יתומחר ויסוכם מראש.</span>
          </div>

          <section className="home-benefits" id="included" aria-labelledby="benefits-title">
            <header className="home-section-heading centered">
              <h2 id="benefits-title">מה מקבלים בפועל?</h2>
              <p>בדיקה ראשונית, סדר בתהליך והכוונה ברורה להמשך.</p>
            </header>
            <div className="benefits-grid">
              {benefits.map(([index, title, body, primary]) => (
                <article className={`benefit-card${primary ? ' is-primary' : ''}`} key={index}>
                  <div className="benefit-head">
                    <span className="benefit-number" aria-hidden="true">{index}</span>
                    <h3>{title}</h3>
                  </div>
                  <div className="benefit-line" aria-hidden="true" />
                  <p>{body}</p>
                </article>
              ))}
            </div>
            <div className="benefits-note"><span className="benefits-dot" aria-hidden="true" /><p>הבדיקה הראשונית באתר ללא עלות. אם יידרש המשך טיפול, היקף השירות יסוכם מראש.</p></div>
          </section>

          <section className="home-faq" id="faq" aria-labelledby="faq-title">
            <header className="home-section-heading faq-heading">
              <h2 id="faq-title">שאלות נפוצות</h2>
              <span className="faq-heading-line" aria-hidden="true" />
            </header>
            <div className="faq-list">
              {faqs.map(([number, question, answer], index) => (
                <details className="faq-card" key={number} open={index === 0}>
                  <summary>
                    <img className="faq-chevron" src="/figma/chevron-down-14.svg" width={14} height={14} alt="" aria-hidden="true" />
                    <span className="faq-question">{question}</span>
                    <span className="faq-number">{number}</span>
                  </summary>
                  <div className="faq-answer"><div className="faq-answer-line" aria-hidden="true" /><p>{answer}</p></div>
                </details>
              ))}
            </div>
          </section>

          <section className="lawyer-split" id="contact" aria-labelledby="lawyer-title">
            <div className="lawyer-actions-panel">
              <div className="lawyer-contact-label">
                <span>מענה מהיר ומקצועי</span>
                <strong>צרו קשר ישיר:</strong>
              </div>
              <div className="lawyer-button-stack">
                <a className="lawyer-action whatsapp" href={whatsappHref()} target="_blank" rel="noreferrer"><span>וואטסאפ</span><WhatsAppIcon variant="filled" size={20} /></a>
                <a className="lawyer-action call" href={phoneHref()}>התקשרו עכשיו</a>
                <Link className="lawyer-action primary" href="/check">התחילו בדיקה ראשונית</Link>
              </div>
              <div className="lawyer-trust"><ShieldCheckIcon variant="blue" size={14} /><span>עמידה קפדנית בכל דרישות החוק</span></div>
            </div>
            <div className="lawyer-copy-panel">
              <div className="lawyer-copy">
                <h2 id="lawyer-title">ליווי אישי של עורך דין</h2>
                <span className="lawyer-copy-rule" aria-hidden="true" />
                <p>לאחר הבדיקה הראשונית ממשיכים לשירות אישי עם עורך דין, שמנהיג את המסלול האפשרי, מהמסמכים והשלבים הרלוונטיים ומלווה את התהליך לפי הצורך.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
    <HomeFooter />
  </>
}
