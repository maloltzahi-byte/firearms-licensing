import type { Metadata } from 'next'
import { site } from '@/lib/site'

export const metadata: Metadata = { title: 'תנאי שימוש', description: 'תנאי השימוש באתר הבדיקה הראשונית RFL.' }

export default function TermsPage() {
  return <main id="main" className="shell legal-shell"><h1>תנאי שימוש</h1><p className="legal-intro">עודכן לאחרונה: 30 באוגוסט 2026.</p>
    <section className="legal-section"><h2>מטרת האתר</h2><p>האתר מספק כלי סינון ראשוני ומידע כללי לצורך יצירת קשר עם {site.lawyerName}. השימוש באתר אינו יוצר כשלעצמו יחסי עורך דין–לקוח ואינו מחליף ייעוץ משפטי פרטני.</p></section>
    <section className="legal-section"><h2>אין קביעה של זכאות</h2><p>תוצאת הסינון אינה קביעה כי משתמש זכאי או אינו זכאי לרישיון כלי ירייה, אינה הבטחה לקבלת רישיון ואינה חוות דעת משפטית. החלטות הרשות המוסמכת מתקבלות לפי הדין והנתונים המלאים שבפניה.</p></section>
    <section className="legal-section"><h2>דיוק המידע</h2><p>אנו פועלים לעדכן את המידע, אך דינים, נהלים ופרשנות עשויים להשתנות. לפני פעולה משפטית נדרשת בדיקה פרטנית ועדכנית.</p></section>
    <section className="legal-section"><h2>שליחת פנייה</h2><p>שליחת פרטים אינה מבטיחה קבלת טיפול ואינה מהווה הסכם שכר טרחה. ככל שיוחלט להתקדם, היקף השירות ושכר הטרחה יוסכמו בנפרד ובכתב לפני גבייה.</p></section>
    <section className="legal-section"><h2>שימוש ראוי</h2><p>אין לעשות באתר שימוש אוטומטי, להעמיס על טופס הפניות, לנסות לעקוף מנגנוני הגנה או למסור פרטים של אדם אחר ללא הרשאה כדין.</p></section>
  </main>
}
