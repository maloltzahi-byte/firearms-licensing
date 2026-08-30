import type { Metadata } from 'next'
import { site } from '@/lib/site'

export const metadata: Metadata = { title: 'מדיניות פרטיות', description: 'מדיניות הפרטיות של אתר הבדיקה הראשונית RFL.' }

export default function PrivacyPage() {
  return <main id="main" className="shell legal-shell"><h1>מדיניות פרטיות</h1><p className="legal-intro">עודכן לאחרונה: 30 באוגוסט 2026. מדיניות זו מתייחסת לאתר הלידים והבדיקה הראשונית בלבד.</p>
    <section className="legal-section"><h2>איזה מידע נאסף</h2><p>במהלך הבדיקה עשויים להימסר טווח גיל, מעמד אזרחי או תושבות, סוג שירות, שם יישוב וקבוצות תבחין שסומנו. אם בוחרים להשאיר פנייה, נאספים גם שם מלא, טלפון, כתובת אימייל והערה חופשית, אם נכתבה.</p></section>
    <section className="legal-section"><h2>איזה מידע איננו מבקשים</h2><p>באתר זה איננו מבקשים מספר תעודת זהות, תאריך לידה מדויק, מידע רפואי, מידע על בריאות נפש, עבר פלילי או פרטים על צו הרחקה. אנא אל תכתבו מידע כזה בשדה ההערה.</p></section>
    <section className="legal-section"><h2>אין מסד נתונים באתר</h2><p>תשובות הסינון נשמרות בזיכרון הדפדפן רק במהלך התהליך ואינן נכתבות למסד נתונים. בעת שליחת פנייה, הפרטים ותוצאת הסינון נשלחים במייל למשרד עורך הדין. הפנייה עשויה להישמר בתיבת הדואר של המשרד בהתאם לצורכי הטיפול ולחובות הדין.</p></section>
    <section className="legal-section"><h2>ספק שליחת המייל</h2><p>לצורך מסירת הפנייה נעשה שימוש ב־Resend, שירות של Plus Five Five, Inc. לפי מסמכי הספק, נתוני לקוחות ותוכן הודעות נשמרים ומעובדים בעיקר בארצות הברית, והספק נעזר בספקי משנה לצורך מתן השירות. מידע נוסף זמין במסמכי הפרטיות וה־DPA של Resend.</p><p><a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noreferrer" style={{textDecoration:'underline'}}>מדיניות הפרטיות של Resend</a> · <a href="https://resend.com/legal/dpa" target="_blank" rel="noreferrer" style={{textDecoration:'underline'}}>הסכם עיבוד הנתונים</a></p></section>
    <section className="legal-section"><h2>מטרת השימוש</h2><p>המידע משמש לביצוע סינון ראשוני, יצירת קשר בעקבות הפנייה, בדיקה משפטית פרטנית, תיאום שיחה וניהול ההתכתבות עם המשרד. האתר אינו מבצע החלטה משפטית אוטומטית ואינו קובע זכאות לרישיון.</p></section>
    <section className="legal-section"><h2>עיון, תיקון ומחיקה</h2><p>ניתן לפנות למשרד בבקשה לעיין במידע שנמסר, לתקנו או לבקש את מחיקתו, בכפוף לדין ולחובות שמירת מסמכים החלות על המשרד. {site.email ? <>לפניות: <a href={`mailto:${site.email}`} style={{textDecoration:'underline'}}>{site.email}</a>.</> : 'כתובת המייל לפניות תפורסם לפני העלייה לאוויר.'}</p></section>
    <section className="legal-section"><h2>מקור משפטי</h2><p>הטיפול במידע נעשה בהתאם לדין החל, ובכלל זה חוק הגנת הפרטיות, התשמ״א–1981.</p><p><a href="https://main.knesset.gov.il/apps/legislation/main/laws/2000234" target="_blank" rel="noreferrer" style={{textDecoration:'underline'}}>חוק הגנת הפרטיות — מאגר החקיקה הלאומי</a></p></section>
  </main>
}
