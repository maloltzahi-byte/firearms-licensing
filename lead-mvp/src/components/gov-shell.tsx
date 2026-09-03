import Image from 'next/image'
import Link from 'next/link'
import { phoneHref, whatsappHref } from '@/lib/site'

export function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return <Image src="/figma/whatsapp-filled-18.svg" width={size} height={size} alt="" aria-hidden="true" />
}

export function PhoneIcon({ size = 18 }: { size?: number }) {
  return <Image src="/figma/phone-white-18.svg" width={size} height={size} alt="" aria-hidden="true" />
}

export function HomeHeader() {
  return <header className="rc-home-header">
    <Link href="/" className="rc-home-brand">משרד עורכי דין צחי מלול | רישוי כלי ירייה</Link>
    <nav className="rc-home-nav" aria-label="ניווט ראשי">
      <a href="#services">מה אנחנו עושים</a><i>·</i><a href="#preflight">מסמכים</a><i>·</i><a href="#faq">שאלות נפוצות</a><i>·</i><a href="#contact">צור קשר</a>
    </nav>
    <button className="rc-home-menu" type="button" aria-label="פתיחת תפריט">☰</button>
  </header>
}

export function FlowHeader({ exit = false }: { exit?: boolean }) {
  if (exit) return <>
    <div className="rc-flow-topbar"><Link href="/">ביטול ויציאה</Link></div>
    <header className="rc-flow-header">
      <Link href="/" className="rc-flow-brand">משרד עורכי דין צחי מלול | רישוי כלי ירייה</Link>
      <div className="rc-flow-actions">
        <a className="rc-btn rc-btn-wa" href={whatsappHref()} target="_blank" rel="noreferrer"><span>וואטסאפ</span><WhatsAppIcon /></a>
        <a className="rc-btn rc-btn-call" href={phoneHref()}>התקשרו עכשיו</a>
      </div>
    </header>
  </>

  return <>
    <div className="rc-public-top"><a href={phoneHref()}>התקשרו עכשיו</a><span>שירות פרטי • אינו אתר ממשלתי</span></div>
    <header className="rc-public-header"><Link href="/">חזרה לעמוד הבית</Link><Link className="rc-public-brand" href="/">משרד עורכי דין צחי מלול | רישוי כלי ירייה</Link></header>
  </>
}

export function Breadcrumb({ current }: { current: string }) {
  return <div className="rc-breadcrumb">ראשי&nbsp;&nbsp;‹&nbsp;&nbsp;{current}</div>
}

function ContactCard() {
  return <aside className="rc-legal-sidebar">
    <h2>הוצאת רישיון נשק פרטי</h2>
    <a className="rc-btn rc-btn-wa" href={whatsappHref()} target="_blank" rel="noreferrer"><span>וואטסאפ</span><WhatsAppIcon /></a>
    <a className="rc-btn rc-btn-call" href={phoneHref()}><span>התקשרו עכשיו</span><PhoneIcon /></a>
    <Link className="rc-btn rc-btn-primary" href="/check">התחילו בדיקה ראשונית</Link>
  </aside>
}

export function ServiceSidebar() { return null }
export function LegalSidebar() { return <ContactCard /> }

export function HomeFooter() { return null }

export function LegalFooter() {
  return <footer className="rc-legal-footer">
    <nav><Link href="/privacy">מדיניות פרטיות</Link><span>|</span><Link href="/accessibility">נגישות</Link><span>|</span><Link href="/terms">תנאי שימוש</Link></nav>
    <span>שירות פרטי • אינו אתר ממשלתי</span>
    <div className="rc-legal-footer-actions" style={{display:'none'}}>
      <a className="rc-btn rc-btn-wa" href={whatsappHref()} target="_blank" rel="noreferrer">וואטסאפ</a>
      <a className="rc-btn rc-btn-call" href={phoneHref()}>התקשרו עכשיו</a>
    </div>
  </footer>
}
