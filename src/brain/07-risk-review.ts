import type {
  AuditEntry,
  CaseState,
  FlagEntry,
  GuidanceSummary,
  NextAction,
} from '@/types/brain'
import { audit } from './utils'

export type RiskResult = {
  state: CaseState
  audit: AuditEntry[]
  openFlags: FlagEntry[]
  guidance: GuidanceSummary
  actions: NextAction[]
}

export function runRiskReview(state: CaseState): RiskResult {
  const openFlags = state.flags.filter((flag) => flag.status === 'open')
  const blockCount = openFlags.filter((f) => f.severity === 'block').length
  const warnCount = openFlags.filter((f) => f.severity === 'warn').length

  let guidance: GuidanceSummary
  if (blockCount > 0) {
    guidance = {
      level: 'needs_review',
      headline: 'נדרשת בדיקת עורך דין לפני קידום התיק',
      explanation: `זוהו ${blockCount} נקודות מהותיות ו-${warnCount} נקודות אזהרה. המערכת אינה מכריעה במשמעותן המשפטית.`,
      lawyerNote: 'יש לבחון את מקור הדגל, את המסמכים ואת הנסיבות הפרטניות לפני המלצה ללקוח.',
    }
  } else if (warnCount > 0) {
    guidance = {
      level: 'needs_strengthening',
      headline: 'המסלול נראה אפשרי אך דורש חיזוק',
      explanation: `זוהו ${warnCount} נקודות שדורשות השלמה, אימות או הסבר.`,
      lawyerNote: 'מומלץ לסגור את נקודות האזהרה ולתעד את הנימוק המקצועי לפני הגשה.',
    }
  } else {
    guidance = {
      level: 'promising',
      headline: 'התיק מציג התאמה ראשונית טובה למסלול המוביל',
      explanation: 'לא זוהו כרגע דגלים פתוחים, בכפוף לבדיקת מסמכים ולעיון עורך הדין.',
      lawyerNote: 'אין לראות בכך קביעה משפטית; יש להשלים בקרת מקור רשמי ומסמכים.',
    }
  }

  const actions: NextAction[] = openFlags.length
    ? [{ kind: 'lawyer_review', reason: guidance.lawyerNote }]
    : []

  return {
    state,
    openFlags,
    guidance,
    actions,
    audit: [
      audit(
        7,
        'RISK_GUIDANCE_SUMMARY',
        { openFlags },
        { guidance, advisoryOnly: true },
      ),
    ],
  }
}
