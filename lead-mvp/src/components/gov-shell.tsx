import Link from 'next/link'
import { phoneHref, whatsappHref } from '@/lib/site'

const CROSSHAIR_ASSET = 'https://www.figma.com/api/mcp/asset/68edcd3f-e132-48cb-a909-7e89495631d6.svg'

export function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return <img src="/figma/whatsapp-filled-18.svg" width={size} height={size} alt="" aria-hidden="true" />
}

export function PhoneIcon({ size = 18 }: { size?: number }) {
  return <img src="/figma/phone-white-18.svg" width={size} height={size} alt="" aria-hidden="true" />
}

function Brand() {
  return <Link href="/" className="brand-block"><strong>הוצאת רישיון נשק פרטי</strong><span>בליווי משרד עורכי דין צחי מלול</span></Link>
}

function OfficeBrand({ footer = false }: { footer?: boolean }) {
  return <Link href="/" className={`office-brand-final${footer ? ' footer' : ''}`}><span>משרד עורכי דין צחי מלול</span><img src={CROSSHAIR_ASSET} width={footer ? 28 : 32} height={footer ? 28 : 36} alt="" aria-hidden="true" /></Link>
}

const officialCriteria = [
  'מקום מגורים',
  'מקום עבודה או לימודים',
  'מורה דרך',
  'כבאי',
  'עובדים ומתנדבים בגופי הצלה',
  'חקלאי מוכר',
  'מוביל חומרי נפץ',
  'ממונה ביטחון או מנהל אבטחה',
  'מדריך ירי',
  'שירות בכוחות הביטחון',
  'שירות במשטרת ישראל',
  'שירות בשירות בתי הסוהר',
  'הכשרה ייחודית',
  'ספורטאי – יורה פעיל',
  'צייד',
  'צרכים וטרינריים',
  'מדביר',
] as const

const baseDocuments = [
  ['הצהרת בריאות', 'חתומה על ידי רופא משפחה'],
  ['צילום תעודת זהות + ספח', 'צילום ברור ועדכני'],
  ['אישור שירות / פטור', 'צבאי, לאומי, אזרחי או פטור'],
  ['מסמכים לפי התבחין', 'משתנים בהתאם למסלול הרלוונטי'],
] as const

export function HomeHeader() {
  return <header className="home-header"><nav className="home-nav" aria-label="ניווט ראשי"><a href="#contact">צור קשר</a><a href="#faq">שאלות נפוצות</a><a href="#included" className="active">מה מקבלים בפועל</a></nav><OfficeBrand /></header>
}

export function FlowHeader({ exit = false }: { exit?: boolean }) {
  if (exit) return <>
    <div className="flow-topbar"><Link href="/">ביטול ויציאה</Link></div>
    <header className="flow-header-final"><Brand /><a className="header-whatsapp" href={whatsappHref()} target="_blank" rel="noreferrer"><span>וואטסאפ</span><WhatsAppIcon /></a></header>
  </>

  return <>
    <div className="legal-topbar"><a className="call-top" href={phoneHref()}>התקשרו עכשיו</a><span className="private-note">שירות פרטי • אינו אתר ממשלתי</span></div>
    <header className="legal-header-final"><Link className="header-back" href="/">חזרה לעמוד הבית</Link><Brand /></header>
  </>
}

export function Breadcrumb({ current }: { current: string }) {
  return <div className="breadcrumb-final">ראשי&nbsp;&nbsp;‹&nbsp;&nbsp;{current}</div>
}

function ContactCard({ compact = false }: { compact?: boolean }) {
  return <div className={compact ? 'legal-sidebar-card' : 'home-contact-card'}>
    <div className="top-rule" />
    <h2>הוצאת רישיון נשק פרטי</h2>
    <a className="rfl-btn rfl-whatsapp" href={whatsappHref()} target="_blank" rel="noreferrer"><span>וואטסאפ</span><WhatsAppIcon /></a>
    <a className="rfl-btn rfl-call" href={phoneHref()}><span>התקשרו עכשיו</span><PhoneIcon /></a>
    <Link className="rfl-btn home-primary" href="/check">התחילו בדיקה ראשונית</Link>
  </div>
}

function DocumentsCard() {
  return <div className="documents-card-final">
    <div className="top-rule" />
    <h2>מה כדאי להכין מראש?</h2>
    <div className="doc-list-final">
      {baseDocuments.map(([title, body]) => <div className="doc-row-final" key={title}><div className="doc-copy-final"><strong>{title}</strong><small>{body}</small></div><span className="doc-check-final" aria-hidden="true">✓</span></div>)}
    </div>
    <details className="criteria-accordion-final">
      <summary><img src="/figma/chevron-down-14.svg" width={14} height={14} alt="" aria-hidden="true" /><span>כל התבחינים</span></summary>
      <div className="criteria-open-final">{officialCriteria.map((criterion) => <div key={criterion}>{criterion}</div>)}</div>
    </details>
  </div>
}

export function ServiceSidebar() {
  return <aside className="home-side-stack"><ContactCard /><DocumentsCard /></aside>
}

export function LegalSidebar() {
  return <aside className="legal-sidebar-final"><ContactCard compact /></aside>
}

export function HomeFooter() {
  return <footer className="home-footer-final"><nav><Link href="/privacy">מדיניות פרטיות</Link><span>|</span><Link href="/accessibility">הצהרת נגישות</Link><span>|</span><Link href="/terms">תנאי שימוש</Link></nav><OfficeBrand footer /></footer>
}

export function LegalFooter() {
  return <footer className="legal-footer-final"><nav><Link href="/privacy">מדיניות פרטיות</Link><span>|</span><Link href="/accessibility">נגישות</Link><span>|</span><Link href="/terms">תנאי שימוש</Link></nav><span>שירות פרטי • אינו אתר ממשלתי</span></footer>
}
