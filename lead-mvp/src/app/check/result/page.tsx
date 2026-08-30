'use client'

import Link from 'next/link'
import { LeadForm } from '@/components/screening/lead-form'
import { useScreening } from '@/components/screening/screening-provider'
import { labels, resultCopy } from '@/lib/screening'

export default function ResultPage() {
  const { answers, result, config } = useScreening()
  if (!answers.age || !answers.citizenship || !answers.service || !answers.locality) {
    return <main id="main" className="check-shell"><section className="result-card"><h1>כדי להציג תוצאה צריך להשלים את הבדיקה</h1><p className="question-help">הנתונים נשמרים בזיכרון הדפדפן רק במהלך התהליך הנוכחי ואינם נשמרים לאחריו.</p><Link className="button-primary" href="/check">התחלת בדיקה</Link></section></main>
  }
  const copy = resultCopy(result)
  const selectedCriteria = config.criteria.filter((criterion) => answers.criteria.includes(criterion.id)).map((criterion) => criterion.he).join(', ')

  return (
    <main id="main" className="check-shell">
      <section className="result-card">
        <span className={`result-badge ${result}`}>תוצאה ראשונית — {copy.tone}</span>
        <h1>{copy.title}</h1>
        <p className="question-help">הבדיקה נועדה למקד את השיחה הבאה. היא אינה קובעת זכאות ואינה בודקת את כלל התנאים המשפטיים.</p>
        <div className="result-summary">
          <div><strong>גיל</strong>{labels.age[answers.age]}</div>
          <div><strong>מעמד</strong>{labels.citizenship[answers.citizenship]}</div>
          <div><strong>שירות</strong>{labels.service[answers.service]}</div>
          <div><strong>יישוב</strong>{answers.locality} — זכאות לא נבדקה</div>
          <div style={{gridColumn:'1 / -1'}}><strong>תבחינים שסומנו</strong>{selectedCriteria || 'לא בטוח / אף אחד מהם'}</div>
        </div>
        <div className="notice">שים לב: עבר פלילי, צו הרחקה בתוקף או הגבלה רפואית עשויים להשפיע על הבקשה. נדבר על כך בשיחה.</div>
        <p className="disclaimer">תוצאה זו היא כלי עזר ראשוני בלבד ואינה חוות דעת משפטית. אין להסתמך עליה. בדיקה מלאה מתבצעת על ידי עורך דין.</p>
        <LeadForm />
      </section>
    </main>
  )
}
