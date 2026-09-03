import type { ScreeningConfig } from './screening-data'

export const ageOptions = ['UNDER_18', '18_20', '21_26', '27_44', '45_PLUS'] as const
export const citizenshipOptions = ['CITIZEN', 'PERMANENT_RESIDENT', 'NEW_IMMIGRANT', 'OTHER'] as const
export const residencyOptions = ['UNDER_3', '3_PLUS'] as const
export const serviceOptions = ['COMBAT', 'REGULAR', 'CIVIL', 'NONE', 'SPECIAL_STATUS'] as const
export const hebrewOptions = ['YES', 'NO_UNSURE'] as const
export const applicationStatusOptions = ['NEW', 'WAITING', 'REFUSED', 'EXISTING'] as const
export const policeBarrierOptions = ['NONE_KNOWN', 'KNOWN', 'UNSURE'] as const
export const routeFamilyOptions = ['RESIDENCE_WORK', 'SECURITY_SERVICE', 'RESCUE_SECURITY', 'PROFESSION_TRAINING', 'POLICE_PRISON', 'HUNT_SPORT_PRO', 'UNSURE'] as const

export type AgeBand = (typeof ageOptions)[number]
export type Citizenship = (typeof citizenshipOptions)[number]
export type ResidencyYears = (typeof residencyOptions)[number]
export type Service = (typeof serviceOptions)[number]
export type HebrewBasic = (typeof hebrewOptions)[number]
export type ApplicationStatus = (typeof applicationStatusOptions)[number]
export type PoliceBarrier = (typeof policeBarrierOptions)[number]
export type RouteFamily = (typeof routeFamilyOptions)[number]
export type ResultColor = 'green' | 'yellow' | 'red'

export type ScreeningAnswers = {
  age: AgeBand | null
  hebrewBasic: HebrewBasic | null
  citizenship: Citizenship | null
  residencyYears: ResidencyYears | null
  service: Service | null
  applicationStatus: ApplicationStatus | null
  policeBarrier: PoliceBarrier | null
  routeFamilies: RouteFamily[]
  locality: string
  criteria: string[]
  unsure: boolean
}

export const initialAnswers: ScreeningAnswers = {
  age: null,
  hebrewBasic: null,
  citizenship: null,
  residencyYears: null,
  service: null,
  applicationStatus: null,
  policeBarrier: null,
  routeFamilies: [],
  locality: '',
  criteria: [],
  unsure: false,
}

export const labels = {
  age: {
    UNDER_18: 'מתחת ל-18',
    '18_20': '18–20',
    '21_26': '21–26',
    '27_44': '27–44',
    '45_PLUS': '45 ומעלה',
  },
  hebrew: { YES: 'כן', NO_UNSURE: 'לא / לא בטוח' },
  citizenship: {
    CITIZEN: 'אזרח ישראלי',
    PERMANENT_RESIDENT: 'תושב קבע',
    NEW_IMMIGRANT: 'עולה חדש',
    OTHER: 'אחר',
  },
  residency: {
    UNDER_3: 'לא, פחות מ-3 שנים ברציפות',
    '3_PLUS': 'כן, 3 שנים ברציפות ומעלה',
  },
  service: {
    COMBAT: 'סיימתי שירות סדיר מלא',
    REGULAR: 'שירות חלקי הרלוונטי לתבחין מגורים / עבודה',
    CIVIL: 'סיימתי שירות אזרחי של שנתיים',
    NONE: 'לא שירתתי',
    SPECIAL_STATUS: 'שירות שלא הושלם / מסלול שירות מיוחד',
  },
  applicationStatus: {
    NEW: 'טרם הגשתי בקשה',
    WAITING: 'הגשתי בקשה ואני ממתין/ה להחלטה',
    REFUSED: 'קיבלתי סירוב',
    EXISTING: 'היה לי רישיון בעבר / יש לי רישיון קיים',
  },
  policeBarrier: {
    NONE_KNOWN: 'לא ידועה לי מניעה',
    KNOWN: 'ידועה לי מניעה',
    UNSURE: 'לא יודע/ת',
  },
  routeFamily: {
    RESIDENCE_WORK: 'מגורים / עבודה או לימודים',
    SECURITY_SERVICE: 'שירות ביטחוני',
    RESCUE_SECURITY: 'הצלה / אבטחה',
    PROFESSION_TRAINING: 'מקצוע או הכשרה',
    POLICE_PRISON: 'משטרה / שב״ס',
    HUNT_SPORT_PRO: 'ציד / ספורט / צורך מקצועי',
    UNSURE: 'לא בטוח — צריך בדיקה',
  },
} as const

function ageBandMinimum(age: AgeBand) {
  if (age === 'UNDER_18') return 0
  if (age === '18_20') return 18
  if (age === '21_26') return 21
  if (age === '27_44') return 27
  return 45
}

function ageBandMaximum(age: AgeBand) {
  if (age === 'UNDER_18') return 17
  if (age === '18_20') return 20
  if (age === '21_26') return 26
  if (age === '27_44') return 44
  return Number.POSITIVE_INFINITY
}

function requiredAge(answers: ScreeningAnswers, config: ScreeningConfig) {
  if (answers.citizenship === 'PERMANENT_RESIDENT' && answers.service === 'NONE') return config.defaultAges.permanentResidentNoService
  if (answers.service === 'CIVIL') return config.defaultAges.civilService
  if (answers.service === 'NONE') return config.defaultAges.noService
  return config.defaultAges.service
}

export function computeScreeningResult(answers: ScreeningAnswers, config: ScreeningConfig): ResultColor {
  if (!answers.age || !answers.hebrewBasic || !answers.citizenship || !answers.service || !answers.applicationStatus || !answers.policeBarrier) return 'yellow'
  if (answers.age === 'UNDER_18' || answers.citizenship === 'OTHER') return 'red'
  if ((answers.citizenship === 'CITIZEN' || answers.citizenship === 'PERMANENT_RESIDENT') && answers.residencyYears === 'UNDER_3') return 'yellow'
  if ((answers.citizenship === 'CITIZEN' || answers.citizenship === 'PERMANENT_RESIDENT') && !answers.residencyYears) return 'yellow'
  if (answers.hebrewBasic === 'NO_UNSURE' || answers.service === 'SPECIAL_STATUS') return 'yellow'
  if (answers.policeBarrier !== 'NONE_KNOWN') return 'yellow'
  if (answers.applicationStatus !== 'NEW') return 'yellow'
  if (!answers.routeFamilies.length || answers.routeFamilies.includes('UNSURE')) return 'yellow'
  if (answers.routeFamilies.includes('RESIDENCE_WORK') && !answers.locality.trim()) return 'yellow'

  const min = ageBandMinimum(answers.age)
  const max = ageBandMaximum(answers.age)
  const threshold = requiredAge(answers, config)
  if (max < threshold) return 'red'
  if (min < threshold) return 'yellow'
  return 'green'
}

export function resultCopy(color: ResultColor) {
  if (color === 'green') return { badge: 'בסיס לבדיקה', title: 'נראה שיש בסיס למסלול שכדאי לבדוק', tone: 'חיובי' }
  if (color === 'yellow') return { badge: 'נדרשת בדיקה', title: 'ייתכן שקיים מסלול — נדרשת בדיקה פרטנית', tone: 'בדיקה' }
  return { badge: 'לא נמצא בסיס ברור', title: 'כרגע לא נראה מסלול ברור', tone: 'ראשוני' }
}
