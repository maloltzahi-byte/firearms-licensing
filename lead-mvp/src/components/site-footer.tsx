import Link from 'next/link'
import { site, phoneHref } from '@/lib/site'

export function SiteFooter() {
  return (
    <footer className="site-footer" id="contact">
      <div className="shell footer-grid">
        <div>
          <strong>{site.lawyerName}</strong>
          <p>ליווי משפטי בהליכי רישוי כלי ירייה פרטי.</p>
        </div>
        <div>
          <strong>פרטי משרד</strong>
          <p>מספר רישיון: {site.license || 'יוגדר לפני העלייה לאוויר'}</p>
          <p>כתובת: {site.address || 'תוגדר לפני העלייה לאוויר'}</p>
          <p><a href={phoneHref()}>{site.phone || 'טלפון המשרד יוגדר לפני העלייה לאוויר'}</a></p>
          {site.email ? <p><a href={`mailto:${site.email}`}>{site.email}</a></p> : null}
        </div>
        <nav aria-label="קישורים משפטיים">
          <strong>מידע משפטי</strong>
          <Link href="/privacy">מדיניות פרטיות</Link>
          <Link href="/accessibility">הצהרת נגישות</Link>
          <Link href="/terms">תנאי שימוש</Link>
        </nav>
      </div>
      <div className="shell footer-bottom">© {new Date().getFullYear()} {site.lawyerName}. כל הזכויות שמורות.</div>
    </footer>
  )
}
