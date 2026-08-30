import type { ScreeningConfig } from './screening-data'

export const ageOptions = ['UNDER_18', '18_20', '21_26', '27_44', '45_PLUS'] as const
export const citizenshipOptions = ['CITIZEN', 'PERMANENT_RESIDENT', 'NEW_IMMIGRANT', 'OTHER'] as const
export const residencyOptions = ['UNDER_3', '3_PLUS'] as const
export const serviceOptions = ['COMBAT', 'REGULAR', 'CIVIL', 'NONE', 'MEDICAL_OPERATIONAL_EXEMPTION'] as const

export type AgeBand = (typeof ageOptions)[number]
export type Citizenship = (typeof citizenshipOptions)[number]
export type ResidencyYears = (typeof residencyOptions)[number]
export type Service = (typeof serviceOptions)[number]
export type ResultColor = 'green' | 'yellow' | 'red'

export type ScreeningAnswers = {
  age: AgeBand | null
  citizenship: Citizenship | null
  residencyYears: ResidencyYears | null
  service: Service | null
  locality: string
  criteria: string[]
  unsure: boolean
}

export const initialAnswers: ScreeningAnswers = {
  age: null,
  citizenship: null,
  residencyYears: null,
  service: null,
  locality: '',
  criteria: [],
  unsure: false,
}

export const labels = {
  age: {
    UNDER_18: 'מתחת ל־18',
    '18_20': '18–20',
    '21_26': '21–26',
    '27_44': '27–44',
    '45_PLUS': '45 ומעלה',
  },
  citizenship: {
    CITIZEN: 'אזרח ישראלי',
    PERMANENT_RESIDENT: 'תושב קבע',
    NEW_IMMIGRANT: 'עולה חדש',
    OTHER: 'אחר',
  },
  residency: {
    UNDER_3: 'פחות מ־3 שנים',
    '3_PLUS': '3 שנים ומעלה',
  },
  service: {
    COMBAT: 'שירות קרבי (שנה ומעלה)',
    REGULAR: 'שירות סדיר (שנתיים ומעלה)',
    CIVIL: 'שירות אזרחי־לאומי',
    NONE: 'לא שירתתי',
    MEDICAL_OPERATIONAL_EXEMPTION: 'פטור רפואי מבצעי / נכה פעולות איבה',
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
  if (answers.citizenship === 'PERMANENT_RESIDENT' && answers.service === 'NONE') {
    return config.defaultAges.permanentResidentNoService
  }
  if (answers.service === 'CIVIL') return config.defaultAges.civilService
  if (answers.service === 'NONE') return config.defaultAges.noService
  return config.defaultAges.service
}

export function computeScreeningResult(answers: ScreeningAnswers, config: ScreeningConfig): ResultColor {
  if (!answers.age || !answers.citizenship || !answers.service) return 'yellow'
  if (answers.citizenship === 'OTHER') return 'red'
  if (answers.citizenship === 'PERMANENT_RESIDENT' && !answers.residencyYears) return 'yellow'
  if (answers.citizenship === 'PERMANENT_RESIDENT' && answers.residencyYears === 'UNDER_3') return 'yellow'
  if (answers.unsure || answers.criteria.length === 0) return 'yellow'

  const min = ageBandMinimum(answers.age)
  const max = ageBandMaximum(answers.age)
  const threshold = requiredAge(answers, config)

  if (max < threshold) {
    const possibleSpecialUnit =
      answers.criteria.includes('idf_service') &&
      max >= config.specialUnitMinAge &&
      answers.service !== 'NONE' &&
      answers.service !== 'CIVIL'
    return possibleSpecialUnit ? 'yellow' : 'red'
  }

  if (min < threshold) return 'yellow'
  return 'green'
}

export function resultCopy(color: ResultColor) {
  if (color === 'green') return { title: 'נראה שיש בסיס לבדיקה מעמיקה', tone: 'חיובי' }
  if (color === 'yellow') return { title: 'ייתכן שקיים מסלול — נדרשת בדיקה פרטנית', tone: 'בדיקה' }
  return { title: 'כרגע לא נראה שמתקיים תבחין', tone: 'ראשוני' }
}
