import Link from 'next/link'

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link href="/" className="brand" aria-label="RFL — עמוד הבית">
          <strong>RFL</strong>
          <span>רישוי כלי ירייה פרטי</span>
        </Link>
        <nav aria-label="ניווט ראשי" className="desktop-nav">
          <Link href="/#how">איך זה עובד</Link>
          <Link href="/#criteria">תבחינים</Link>
          <Link href="/#faq">שאלות נפוצות</Link>
          <Link href="/#contact">יצירת קשר</Link>
        </nav>
        <Link className="header-cta" href="/check">בדקו אם מתקיים תבחין</Link>
      </div>
    </header>
  )
}
