import type {ReactNode} from 'react'
import {Breadcrumb,FlowHeader,LegalFooter,LegalSidebar} from '@/components/gov-shell'
type Section={title?:string;body:ReactNode}
export function LegalPage({title,sections}:{title:string;sections:Section[]}){return <div className="legal-page-final"><FlowHeader/><Breadcrumb current={title}/><main id="main" className="legal-layout-final"><LegalSidebar/><article className="legal-content-final"><i className="blue-rule"/><h1>{title}</h1><p className="legal-updated-final">עודכן לאחרונה: 31 באוגוסט 2026</p>{sections.map((s,i)=><section className="legal-section-final" key={`${s.title||'section'}-${i}`}>{s.title&&<h2>{s.title}</h2>}<p>{s.body}</p></section>)}</article></main><LegalFooter/></div>}
