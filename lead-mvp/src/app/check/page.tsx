import type { Metadata } from 'next'
import { Questionnaire } from '@/components/screening/questionnaire'

export const metadata: Metadata = {
  title: 'בדיקת תבחין ראשונית',
  description: 'חמש שאלות קצרות לבדיקת בסיס ראשוני למסלול רישוי כלי ירייה פרטי.',
  robots: { index: false, follow: false },
}

export default function CheckPage() {
  return <Questionnaire />
}
