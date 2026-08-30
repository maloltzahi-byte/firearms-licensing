import Link from 'next/link'
import { phoneHref, whatsappHref } from '@/lib/site'

export function WhatsAppIcon() {
  return <img className="wa-icon" src="/whatsapp.svg" width={20} height={20} alt="" aria-hidden="true" />
}

export function UtilityBar({ exitHref }: { exitHref?: string }) {
  return (
    <div className="gov-utility">
      <div className="gov-utility-inner">
        {exitHref ? <Link href={exitHref} className="utility-exit">ביטול ויציאה</Link> : <span><a href={phoneHref()}>התקשרו עכשיו</a> <bdi>|</bdi> <a href={whatsappHref()} target="_blank" rel="noreferrer">WhatsApp</a></span>}
      </div>
    </div>
  )
}

export function HomeHeader() {
  return <>
    <UtilityBar />
    <header className="gov-header">
      <div className="gov-header-inner">
        <nav className="gov-nav" aria-label="ניווט ראשי">
          <a href="#contact">צור קשר</a>
          <a href="#faq">שאלות נפוצות</a>
          <a href="#why">למה השירות</a>
          <a href="#included">מה כולל הליווי</a>
        </nav>
        <Link href="/" className="gov-brand">
          <strong>הוצאת רישיון נשק פרטי</strong>
        </Link>
      </div>
    </header>
  </>
}

export function FlowHeader({ exit = false }: { exit?: boolean }) {
  return <>
    <UtilityBar exitHref={exit ? '/' : undefined} />
    <header className="gov-header flow-header">
      <div className="gov-header-inner">
        {exit ? <a className="flow-phone" href={phoneHref()}>התקשרו עכשיו</a> : <Link className="flow-home" href="/">חזרה לעמוד הבית</Link>}
        <Link href="/" className="gov-brand">
          <strong>בדיקה ראשונית לרישיון נשק פרטי</strong>
        </Link>
      </div>
    </header>
  </>
}

export function Breadcrumb({ current }: { current: string }) {
  return <div className="gov-breadcrumb"><div>ראשי <span>‹</span> {current}</div></div>
}

export function ServiceSidebar() {
  return <aside className="service-sidebar">
    <div className="blue-rule" />
    <h2>ליווי להוצאת רישיון נשק</h2>
    <div className="thin-rule" />
    <h3>ליווי של עורך דין</h3>
    <p>ליווי לאורך תהליך הבקשה, הכוונה למסמכים, בדיקה ראשונית וטיפול בתצהיר עורך דין ככל שנדרש.</p>
    <div className="office-endorsement">בליווי משרד עורכי דין צחי מלול</div>
    <div className="thin-rule muted" />
    <h4>יצירת קשר מהירה</h4>
    <a className="btn btn-whatsapp sidebar-action" href={whatsappHref()} target="_blank" rel="noreferrer">WhatsApp <WhatsAppIcon /></a>
    <a className="btn btn-outline sidebar-action" href={phoneHref()}>התקשרו עכשיו</a>
    <div className="private-notice"><strong>הבהרה</strong><span>זהו שירות פרטי ואינו אתר ממשלתי.</span></div>
  </aside>
}

export function LegalSidebar() {
  return <aside className="legal-sidebar">
    <div className="blue-rule" />
    <h2>הוצאת רישיון נשק פרטי</h2>
    <h3>ליווי של עורך דין</h3>
    <div className="office-endorsement">בליווי משרד עורכי דין צחי מלול</div>
    <a className="btn btn-whatsapp sidebar-action" href={whatsappHref()} target="_blank" rel="noreferrer">WhatsApp <WhatsAppIcon /></a>
    <a className="btn btn-outline sidebar-action" href={phoneHref()}>התקשרו עכשיו</a>
  </aside>
}

export function LegalFooter() {
  return <footer className="legal-footer">
    <nav aria-label="קישורים משפטיים">
      <Link href="/privacy">מדיניות פרטיות</Link><span>|</span><Link href="/accessibility">נגישות</Link><span>|</span><Link href="/terms">תנאי שימוש</Link>
    </nav>
    <span>שירות פרטי • אינו אתר ממשלתי</span>
  </footer>
}

export function HomeFooter() {
  return <footer className="home-footer">
    <nav aria-label="קישורים משפטיים"><Link href="/privacy">מדיניות פרטיות</Link><span>|</span><Link href="/accessibility">הצהרת נגישות</Link><span>|</span><Link href="/terms">תנאי שימוש</Link></nav>
    <span>בליווי משרד עורכי דין צחי מלול</span>
  </footer>
}
