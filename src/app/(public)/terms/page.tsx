import { LegalLayout, LegalSection } from '@/components/legal/legal-layout'

export default function TermsPage() {
  return <LegalLayout eyebrow="13 / TERMS" title="תנאי שימוש" intro="RFL היא מערכת לניהול וליווי משפטי של הליך רישוי כלי ירייה. היא אינה אתר ממשלתי ואינה רשות מוסמכת להעניק, לדחות או לבטל רישיון.">
    <LegalSection title="גבולות הבדיקה"><p>תוצאות השאלון הן כלי לארגון מידע, מסמכים ופערים לצורך בדיקה מקצועית. אין בהן הבטחה לתוצאה ואין בהן החלטת זכאות של האגף לרישוי כלי ירייה.</p><p>לפני פעולה מהותית יש לאמת את המקור הרשמי העדכני ואת התאמתו לנתוני המקרה.</p></LegalSection>
    <LegalSection title="מידע שנמסר על ידי המשתמש"><p>המשתמש מתבקש למסור מידע נכון ומעודכן ולהעלות רק מסמכים שהוא רשאי למסור לצורך הטיפול. מידע חסר או שגוי עלול למנוע בדיקה מלאה של התיק.</p></LegalSection>
    <LegalSection title="שירות משפטי"><p>פתיחת חשבון או מילוי שאלון אינם כשלעצמם התחייבות לקבלת העניין לייצוג. היקף השירות המשפטי, ככל שיוזמן, נקבע בנפרד ובהתאם להסכמה עם משרד עורך הדין.</p></LegalSection>
    <LegalSection title="המקור הרשמי להליך"><p>הבקשה הממשלתית עצמה מוגשת בשירות המקוון של האגף לרישוי כלי ירייה, לאחר הזדהות ממשלתית ובצירוף המסמכים הנדרשים. ההחלטה המנהלית מתקבלת על ידי הגורמים המוסמכים בלבד.</p><a className="font-bold text-[#0b6f9c] underline" href="https://www.gov.il/he/service/issue_firearms_license_to_a_private_individual" rel="noreferrer">בקשת רישיון לכלי ירייה פרטי — gov.il</a></LegalSection>
  </LegalLayout>
}
