import Link from 'next/link'
import { phoneHref, whatsappHref } from '@/lib/site'

export function WhatsAppIcon({ size=18 }: { size?: number }) { return <img src="/figma/whatsapp-filled-18.svg" width={size} height={size} alt="" aria-hidden="true" /> }
export function PhoneIcon({ size=18 }: { size?: number }) { return <img src="/figma/phone-white-18.svg" width={size} height={size} alt="" aria-hidden="true" /> }

function Brand() { return <Link href="/" className="brand-block"><strong>הוצאת רישיון נשק פרטי</strong><span>בליווי משרד עורכי דין צחי מלול</span></Link> }

export function HomeHeader(){return <header className="home-header"><nav className="home-nav" aria-label="ניווט ראשי"><a href="#contact">צור קשר</a><a href="#faq">שאלות נפוצות</a><a href="#included" className="active">מה מקבלים בפועל</a></nav><div className="home-brand"><Brand /></div></header>}

export function FlowHeader({ exit=false }: { exit?: boolean }){
  if(exit) return <><div className="flow-topbar"><Link href="/">ביטול ויציאה</Link><span /></div><header className="flow-header-final"><a className="header-whatsapp" href={whatsappHref()} target="_blank" rel="noreferrer"><span>וואטסאפ</span><WhatsAppIcon /></a><Brand /></header></>
  return <><div className="legal-topbar"><a className="call-top" href={phoneHref()}>התקשרו עכשיו</a><span className="private-note">שירות פרטי • אינו אתר ממשלתי</span></div><header className="legal-header-final"><Link className="header-back" href="/">חזרה לעמוד הבית</Link><Brand /></header></>
}

export function Breadcrumb({current}:{current:string}){return <div className="breadcrumb-final">ראשי&nbsp;&nbsp;‹&nbsp;&nbsp;{current}</div>}

export function ServiceSidebar(){return <aside className="home-sidebar-final"><div className="top-rule"/><h2>הוצאת רישיון נשק פרטי</h2><a className="rfl-btn rfl-whatsapp" href={whatsappHref()} target="_blank" rel="noreferrer"><span>וואטסאפ</span><WhatsAppIcon /></a><a className="rfl-btn rfl-call" href={phoneHref()}><span>התקשרו עכשיו</span><PhoneIcon /></a><Link className="rfl-btn home-primary" href="/check">התחילו בדיקה ראשונית</Link></aside>}

export function LegalSidebar(){return <aside className="legal-sidebar-final"><div className="top-rule"/><h2>הוצאת רישיון נשק פרטי</h2><a className="rfl-btn rfl-whatsapp" href={whatsappHref()} target="_blank" rel="noreferrer"><span>וואטסאפ</span><WhatsAppIcon /></a><a className="rfl-btn rfl-call" href={phoneHref()}><span>התקשרו עכשיו</span><PhoneIcon /></a><Link className="rfl-btn home-primary" href="/check">התחילו בדיקה ראשונית</Link></aside>}

export function HomeFooter(){return <footer className="home-footer-final"><nav><Link href="/privacy">מדיניות פרטיות</Link><span>|</span><Link href="/accessibility">הצהרת נגישות</Link><span>|</span><Link href="/terms">תנאי שימוש</Link></nav><span>בליווי משרד עורכי דין צחי מלול</span></footer>}
export function LegalFooter(){return <footer className="legal-footer-final"><nav><Link href="/privacy">מדיניות פרטיות</Link><span>|</span><Link href="/accessibility">נגישות</Link><span>|</span><Link href="/terms">תנאי שימוש</Link></nav><span>שירות פרטי • אינו אתר ממשלתי</span></footer>}
