import { LegalLayout, LegalSection } from '@/components/legal/legal-layout'

export default function PrivacyPage() {
  return <LegalLayout eyebrow="12 / PRIVACY" title="מדיניות פרטיות" intro="המערכת מנהלת תיק משפטי ולכן עשויה לכלול מידע אישי ואף מידע בעל רגישות מיוחדת. המדיניות מתארת את פעולות המערכת בפועל; היא אינה מרחיבה את סמכויותיה מעבר לדין.">
    <LegalSection title="איזה מידע עשוי להישמר"><p>פרטי זיהוי ויצירת קשר, פרטי שירות ומגורים שנמסרו בשאלון, תשובות הנוגעות לתבחין הנבדק, מסמכים שהמשתמש מעלה, הודעות ופעולות בתיק, נתוני סטטוס ואירועי ביקורת.</p><p>מידע רפואי מסווג במערכת כמידע רפואי ומוגן בהרשאות מצומצמות יותר. המערכת אינה מסיקה כשירות רפואית אוטומטית.</p></LegalSection>
    <LegalSection title="מטרות השימוש"><p>המידע משמש לפתיחת וניהול תיק, שמירת שאלון והמשך מאוחר יותר, בדיקת מסמכים ופערים, תקשורת עם הלקוח, תיעוד החלטות מקצועיות והכנת פעולות משפטיות לאחר בדיקת עורך דין.</p></LegalSection>
    <LegalSection title="אחסון והרשאות"><p>המערכת משתמשת ב־Supabase לצורך מסד נתונים, הזדהות ואחסון מסמכים וב־Vercel לצורך הפעלת יישום האינטרנט. הגישה לתיק נאכפת גם באמצעות Row Level Security; מסמכי תיק נשמרים ב־Storage פרטי.</p><p>מפתח בעל הרשאות שירות אינו נשלח לדפדפן. פעולות רגישות בקוקפיט דורשות הרשאת תפקיד, ובפעולות החלטה גם אימות דו־שלבי.</p></LegalSection>
    <LegalSection title="פניות בנושא מידע אישי"><p>ניתן לפנות באמצעות עמוד "צור קשר" בכל בקשה הנוגעת למידע שנמסר למערכת. הבקשה תיבחן בהתאם לחוק הגנת הפרטיות, התשמ״א–1981 ולדין החל.</p></LegalSection>
    <LegalSection title="מקורות רשמיים"><ul className="list-disc space-y-2 pr-5"><li><a className="font-bold text-[#0b6f9c] underline" href="https://main.knesset.gov.il/apps/legislation/main/laws/2000234" rel="noreferrer">חוק הגנת הפרטיות, התשמ״א–1981 — מאגר החקיקה הלאומי</a></li><li><a className="font-bold text-[#0b6f9c] underline" href="https://www.gov.il/he/pages/tikun13_qa?chapterIndex=6" rel="noreferrer">הרשות להגנת הפרטיות — שאלות ותשובות לתיקון 13</a></li><li><a className="font-bold text-[#0b6f9c] underline" href="https://www.gov.il/he/service/notice-obligation" rel="noreferrer">הרשות להגנת הפרטיות — חובת הודעה על מאגר מידע</a></li></ul></LegalSection>
  </LegalLayout>
}
