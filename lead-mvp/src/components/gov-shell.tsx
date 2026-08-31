import Link from 'next/link'
import { phoneHref, whatsappHref } from '@/lib/site'

type IconVariant = 'outline' | 'filled'
type ShieldVariant = 'white' | 'blue'

export function WhatsAppIcon({ variant = 'outline', size = 20 }: { variant?: IconVariant; size?: number }) {
  const src = variant === 'filled' ? '/figma/whatsapp-filled-20.svg' : '/figma/whatsapp-outline-20.svg'
  return <img className="wa-icon" src={src} width={size} height={size} alt="" aria-hidden="true" />
}

export function ShieldCheckIcon({ variant = 'white', size = 20 }: { variant?: ShieldVariant; size?: number }) {
  const src = variant === 'blue' ? '/figma/shield-check-blue-14.svg' : '/figma/shield-check-white-20.svg'
  return <img className="shield-icon" src={src} width={size} height={size} alt="" aria-hidden="true" />
}

function PhoneIcon() {
  return <img className="phone-icon" src="/figma/phone-white-18.svg" width={18} height={18} alt="" aria-hidden="true" />
}

export function UtilityBar({ exitHref, home = false, flow = false }: { exitHref?: string; home?: boolean; flow?: boolean }) {
  if (flow) {
    return (
      <div className="gov-utility flow-utility">
        <div className="gov-utility-inner">
          {exitHref
            ? <Link href={exitHref} className="flow-utility-action">ביטול ויציאה</Link>
            : <a href={phoneHref()} className="flow-utility-action">התקשרו עכשיו</a>}
        </div>
      </div>
    )
  }

  return (
    <div className={`gov-utility${home ? ' home-utility' : ''}`}>
      <div className="gov-utility-inner">
        {exitHref ? <Link href={exitHref} className="utility-exit">ביטול ויציאה</Link> : <a href={phoneHref()} className="utility-contact">התקשרו עכשיו</a>}
        {home && <span className="utility-note">שירות פרטי • ליווי משפטי והכוונה</span>}
      </div>
      {home && <div className="utility-separator" />}
    </div>
  )
}

export function HomeHeader() {
  return <>
    <UtilityBar home />
    <header className="gov-header home-gov-header">
      <div className="gov-header-inner">
        <nav className="gov-nav home-nav" aria-label="ניווט ראשי">
          <a href="#contact">צור קשר</a>
          <a href="#faq">שאלות נפוצות</a>
          <a href="#included" className="active">מה כולל הליווי</a>
        </nav>
        <Link href="/" className="gov-brand home-brand">
          <strong>הוצאת רישיון נשק פרטי</strong>
          <span>בליווי משרד עורכי דין צחי מלול</span>
        </Link>
      </div>
    </header>
  </>
}

export function FlowHeader({ exit = false }: { exit?: boolean }) {
  return <>
    <UtilityBar exitHref={exit ? '/' : undefined} flow />
    <header className="gov-header flow-header">
      <div className="gov-header-inner">
        {exit
          ? <a className="flow-whatsapp" href={whatsappHref()} target="_blank" rel="noreferrer"><span>וואטסאפ</span><WhatsAppIcon variant="outline" size={18} /></a>
          : <Link className="flow-home" href="/">חזרה לעמוד הבית</Link>}
        <Link href="/" className="gov-brand flow-brand">
          <strong>בדיקה ראשונית לרישיון נשק פרטי</strong>
          <span>{exit ? 'בליווי עו״ד צחי מלול' : 'בליווי משרד עו״ד צחי מלול'}</span>
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
    <div className="sidebar-header-block">
      <h2>הוצאת רישיון נשק פרטי</h2>
      <span className="sidebar-glow-line" aria-hidden="true" />
    </div>
    <div className="sidebar-content-area">
      <div className="sidebar-value-proposition">
        <div className="sidebar-title-row">
          <h3>בדיקה והכוונה אישית</h3>
          <span className="sidebar-icon-badge"><ShieldCheckIcon variant="white" size={20} /></span>
        </div>
        <p>עושים סדר בתנאים, במסמכים ובשלבים. אם נדרש תצהיר, ניתן להשלים אותו מול עורך דין.</p>
      </div>
      <div className="sidebar-divider" aria-hidden="true" />
      <div className="sidebar-actions-group">
        <h4>דברו איתנו:</h4>
        <a className="sidebar-pill sidebar-whatsapp" href={whatsappHref()} target="_blank" rel="noreferrer"><span>וואטסאפ</span><img src="/figma/whatsapp-filled-18.svg" width={18} height={18} alt="" aria-hidden="true" /></a>
        <a className="sidebar-pill sidebar-phone" href={phoneHref()}><span>התקשרו עכשיו</span><PhoneIcon /></a>
      </div>
    </div>
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
