import Link from 'next/link'
import type { ReactNode } from 'react'
import { LegalFooter, LegalSidebar } from '@/components/gov-shell'
import { phoneHref } from '@/lib/site'

type Section = { title?: string; body: ReactNode }

export function LegalPage({ title, sections }: { title: string; sections: Section[] }) {
  return <div className="rc-legal-page">
    <div className="rc-legal-top"><span>שירות פרטי • אינו אתר ממשלתי</span><a href={phoneHref()}>התקשרו עכשיו</a></div>
    <header className="rc-legal-header"><Link href="/">חזרה לעמוד הבית</Link><Link href="/" className="rc-legal-brand"><strong>הוצאת רישיון נשק פרטי</strong><span>בליווי משרד עורכי דין צחי מלול</span></Link></header>
    <div className="rc-breadcrumb">ראשי&nbsp;&nbsp;‹&nbsp;&nbsp;{title}</div>
    <main id="main" className="rc-legal-main"><LegalSidebar/><article className="rc-legal-content"><h1>{title}</h1><p className="rc-legal-updated">עודכן לאחרונה: 31 באוגוסט 2026</p>{sections.map((section,index)=><section className="rc-legal-section" key={`${section.title || 'section'}-${index}`}>{section.title&&<h2>{section.title}</h2>}<p>{section.body}</p></section>)}</article></main>
    <LegalFooter />
  </div>
}
