import type { Metadata } from 'next'
import { LegalPage } from '@/components/legal/legal-page'

export const metadata: Metadata = { title: 'הצהרת נגישות' }

export default function AccessibilityPage() {
  return <LegalPage title="הצהרת נגישות" sections={[
    { title: 'מחויבות לנגישות', body: <>האתר מתוכנן בעברית RTL ונועד לעמוד בדרישות הנגישות הרלוונטיות ובת״י 5568 ברמה AA ככל שהדבר חל על האתר והשירות.</> },
    { title: 'התאמות עיקריות', body: <>מבנה כותרות ברור, ניגודיות גבוהה, רכיבי פעולה גדולים, מצבי Focus ברורים, ניווט פשוט ושפה בהירה.</> },
    { title: 'פנייה בנושא נגישות', body: <>ניתן לפנות למשרד עורכי דין צחי מלול באמצעות כפתור ״התקשרו עכשיו״ או WhatsApp באתר.</> },
    { title: 'דיווח על קושי', body: <>אם נתקלתם בקושי בשימוש באתר, ניתן לפנות ולציין את העמוד והפעולה שבה נתקלתם בקושי.</> },
  ]} />
}
