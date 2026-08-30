import type { ReactNode } from 'react'
import { Breadcrumb, FlowHeader, LegalFooter, LegalSidebar } from '@/components/gov-shell'

type Section = { title: string; body: ReactNode }

export function LegalPage({ title, sections }: { title: string; sections: Section[] }) {
  return <>
    <FlowHeader />
    <Breadcrumb current={title} />
    <main id="main" className="legal-layout">
      <LegalSidebar />
      <article className="legal-content">
        <div className="blue-rule" />
        <h1>{title}</h1>
        <p className="legal-updated">עודכן לאחרונה: 30 באוגוסט 2026</p>
        {sections.map((section) => <section className="legal-section" key={section.title}>
          <h2>{section.title}</h2>
          <div>{section.body}</div>
        </section>)}
      </article>
    </main>
    <LegalFooter />
  </>
}
