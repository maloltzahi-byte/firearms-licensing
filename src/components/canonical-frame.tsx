'use client'

import { useCallback } from 'react'

type CanonicalFrameProps = {
  src: string
  title: string
}

const INTERMEDIATE_VIEWPORT_PATCH = `
@media (min-width: 901px) and (max-width: 1399px) {
  .instrument { left: 290px !important; width: calc(100vw - 330px) !important; }
  .footer-back { left: 290px !important; }
  .footer-next { left: auto !important; right: 40px !important; }
  .save { left: 455px !important; width: min(320px, calc(100vw - 760px)) !important; }
  .main-code, .main-title, .main-body { right: 60px !important; max-width: calc(100vw - 410px) !important; }
  .accent { right: 60px !important; }
  .choice .cs { width: calc(100% - 340px) !important; }
}
`

const PUBLIC_COPY_REPLACEMENTS: ReadonlyArray<readonly [string, string]> = [
  ['RFL / OPTIC COUNSEL / GUIDED LEGAL INTAKE', 'בדיקת זכאות וליווי משפטי'],
  ['CASE READINESS / לפני שמתקדמים', 'לפני שמתקדמים'],
  ['EVIDENCE MAP / SAMPLE CASE', 'דוגמה לתמונת מצב'],
  ['NO AUTO-VERDICT', 'החלטה לאחר בדיקה'],
  ['FORM FOLLOWS EVIDENCE', 'מתחילים מהמידע והמסמכים'],
  ['CASE JOURNEY ENGINE / CONTEXT PRESERVED', 'מעקב לאורך כל התהליך'],
  ['APPEAL / DEADLINE IS PART OF THE FILE', 'השגה, ערר ומועדים'],
  ['DECISION MEMO / COUNSEL GATE', 'בדיקת עורך דין'],
  ['COUNSEL-IN-LOOP / AUTHORITY WITH EVIDENCE', 'בדיקה משפטית לפני פעולה'],
  ['START WITH THE CASE', 'מתחילים בבדיקה'],
  ['SOURCE POINTER', 'מקור לבדיקה'],
  ['02 / HOW IT WORKS', 'איך זה עובד'],
  ['03 / WHAT WE CHECK', 'מה נבדק'],
  ['04 / LEGAL SUPPORT', 'ליווי משפטי'],
  ['05 / ROUTES / CRITERIA', 'מסלולים ותבחינים'],
  ['06 / APPEAL', 'השגה וערר'],
  ['07 / MEDICAL ROUTE', 'מידע רפואי'],
  ['08 / SERVICE SCOPE', 'היקף השירות'],
  ['09 / FAQ / DECISION SUPPORT', 'שאלות נפוצות'],
  ['10 / ABOUT / COUNSEL FIRST', 'אודות'],
  ['11 / CONTACT / CASE FIRST', 'יצירת קשר'],
  ['12 / PRIVACY', 'פרטיות'],
  ['13 / TERMS', 'תנאי שימוש'],
  ['14 / ACCESSIBILITY', 'נגישות'],
  ['SOURCE', 'מקור'],
  ['EVIDENCE', 'מסמך תומך'],
  ['STATUS', 'מצב'],
  ['COUNSEL', 'בדיקת עורך דין'],
  [
    'AI יכול לסייע בחילוץ, מיון וטיוטה. פרשנות משפטית, אסטרטגיה והחלטה אם וכיצד לפעול נשארות אצל עורך הדין.',
    'המערכת מרכזת ומסדרת את חומרי התיק. פרשנות משפטית, אסטרטגיה והחלטה אם וכיצד לפעול נשארות אצל עורך הדין.',
  ],
]

function replacePublicCopy(doc: Document) {
  const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT)
  let current = walker.nextNode()

  while (current) {
    if (current.nodeValue) {
      let value = current.nodeValue
      for (const [from, to] of PUBLIC_COPY_REPLACEMENTS) {
        value = value.replaceAll(from, to)
      }
      current.nodeValue = value
    }
    current = walker.nextNode()
  }
}

export function CanonicalFrame({ src, title }: CanonicalFrameProps) {
  const handleLoad = useCallback((event: React.SyntheticEvent<HTMLIFrameElement>) => {
    const frame = event.currentTarget

    try {
      const doc = frame.contentDocument
      if (!doc) return

      if (src.includes('/canonical/public.html')) {
        replacePublicCopy(doc)
      }

      if (src.includes('/canonical/guided.html') && !doc.getElementById('rfl-intermediate-viewport-patch')) {
        const style = doc.createElement('style')
        style.id = 'rfl-intermediate-viewport-patch'
        style.textContent = INTERMEDIATE_VIEWPORT_PATCH
        doc.head.appendChild(style)
      }
    } catch {
      // Canonical assets are same-origin in production. If that ever changes,
      // the frame must remain usable without broadening cross-origin permissions.
    }
  }, [src])

  return (
    <main className="h-[100dvh] w-full overflow-hidden bg-[#f7f9fb]">
      <iframe
        className="h-full w-full border-0"
        src={src}
        title={title}
        sandbox="allow-forms allow-modals allow-popups allow-same-origin allow-scripts allow-downloads allow-top-navigation-by-user-activation"
        onLoad={handleLoad}
      />
    </main>
  )
}
