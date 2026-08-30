import Link from 'next/link'
import { site, phoneHref, whatsappHref } from '@/lib/site'

export function SiteFooter() {
  return (
    <footer className="site-footer" id="contact">
      <div className="shell footer-grid">
        <div>
          <strong>{site.lawyerName}</strong>
          <p>ליווי משפטי בהליכי רישוי כלי ירייה פרטי.</p>
        </div>
        <div>
          <strong>יצירת קשר</strong>
          <p><a href={phoneHref()}>{site.phone}</a></p>
          <p><a href={whatsappHref()} target="_blank" rel="noreferrer">WhatsApp</a></p>
          <p><a href={`mailto:${site.email}`}>{site.email}</a></p>
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
