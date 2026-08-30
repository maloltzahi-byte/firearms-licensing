import type { Metadata } from 'next'
import Link from 'next/link'
import { phoneHref, site } from '@/lib/site'

export const metadata: Metadata = { title: 'תודה', robots: { index: false, follow: false } }

export default function ThanksPage() {
  return <main id="main" className="check-shell"><section className="result-card"><span className="result-badge green">הפנייה התקבלה</span><h1>תודה, נחזור אליכם בתוך יום עסקים.</h1><p className="question-help">אם הנושא דחוף, אפשר לפנות ישירות למשרד.</p><div className="contact-actions">{site.phone ? <a className="button-primary" href={phoneHref()}>התקשרו למשרד</a> : null}<Link className="button-secondary" href="/">חזרה לעמוד הבית</Link></div></section></main>
}
