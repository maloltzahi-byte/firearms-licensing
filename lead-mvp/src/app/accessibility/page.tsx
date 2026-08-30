import type { Metadata } from 'next'
import { site } from '@/lib/site'

export const metadata: Metadata = { title: 'הצהרת נגישות', description: 'הצהרת הנגישות של אתר RFL.' }

export default function AccessibilityPage() {
  return <main id="main" className="shell legal-shell"><h1>הצהרת נגישות</h1><p className="legal-intro">עודכן לאחרונה: 30 באוגוסט 2026.</p>
    <section className="legal-section"><h2>מחויבות לנגישות</h2><p>אנו פועלים להנגשת האתר לאנשים עם מוגבלות בהתאם לדרישות הדין ולתקן הישראלי ת״י 5568 ברמה AA, ככל שהדבר חל על האתר והשירות.</p></section>
    <section className="legal-section"><h2>התאמות שבוצעו</h2><ul><li>מבנה כותרות ותוכן סמנטי.</li><li>ניווט באמצעות מקלדת וקישור דילוג לתוכן.</li><li>מצבי מיקוד בולטים לרכיבים אינטראקטיביים.</li><li>התאמה לתצוגות מובייל והגדלת טקסט.</li><li>כיבוד הגדרת reduced motion של מערכת ההפעלה.</li></ul></section>
    <section className="legal-section"><h2>פנייה בנושא נגישות</h2><p>איש קשר: {site.accessibilityCoordinator}.</p><p>טלפון: <a href={`tel:${site.phone.replace(/[^+\d]/g, '')}`}>{site.phone}</a>.</p><p>אימייל: <a href={`mailto:${site.email}`}>{site.email}</a>.</p><p>אם נתקלתם בקושי בשימוש באתר, נשמח לקבל פירוט של העמוד, הפעולה שניסיתם לבצע והטכנולוגיה המסייעת שבה השתמשתם, ככל שרלוונטי.</p></section>
  </main>
}
