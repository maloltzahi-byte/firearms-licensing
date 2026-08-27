import { LegalLayout, LegalSection } from '@/components/legal/legal-layout'

export default function AccessibilityPage() {
  return <LegalLayout eyebrow="14 / ACCESSIBILITY" title="הצהרת נגישות" intro="המערכת נבנית ומתוחזקת במטרה לאפשר שימוש נגיש גם לאנשים עם מוגבלות. הצהרה זו מתארת את היעד וההתאמות שיושמו; אישור סופי לעמידה מלאה יינתן רק לאחר השלמת בדיקות הנגישות של גרסת ה־RC.">
    <LegalSection title="התאמות בממשק"><ul className="list-disc space-y-2 pr-5"><li>מבנה RTL מלא ותוכן בעברית.</li><li>שדות טופס עם תוויות תוכנתיות והודעות מצב.</li><li>פעולות עיקריות ניתנות להפעלה באמצעות מקלדת.</li><li>מצבי focus נשמרים ברכיבים האינטראקטיביים.</li><li>הממשק נבנה לתצוגה במסכי Desktop, Tablet ו־Mobile.</li></ul></LegalSection>
    <LegalSection title="דיווח על קושי"><p>אם נתקלתם בקושי נגישות, ניתן לדווח באמצעות עמוד "צור קשר" ולציין את הדף, הפעולה שניסיתם לבצע, הדפדפן והטכנולוגיה המסייעת ככל שנעשה בה שימוש.</p></LegalSection>
    <LegalSection title="בסיס רשמי"><p>מקורות ממשלתיים מציינים את תקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע״ג–2013 ואת ת״י 5568 כבסיס להנגשת שירותי אינטרנט ברמת AA.</p><a className="font-bold text-[#0b6f9c] underline" href="https://content.justice.gov.il/Accessibility/declaration1.html" rel="noreferrer">הצהרת הנגישות של משרד המשפטים</a></LegalSection>
  </LegalLayout>
}
