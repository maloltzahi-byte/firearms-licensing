export const PUBLIC_SCREEN_BY_SLUG = {
  'how-it-works': '02',
  'what-is-checked': '03',
  'legal-support': '04',
  routes: '05',
  appeal: '06',
  medical: '07',
  pricing: '08',
  faq: '09',
  about: '10',
  contact: '11',
  privacy: '12',
  terms: '13',
  accessibility: '14',
} as const

export const GUIDED_SCREEN_BY_ROUTE = {
  'request-type': 0,
  identity: 1,
  contact: 2,
  basics: 3,
  service: 4,
  residence: 5,
  employment: 6,
  activity: 7,
  health: 8,
  sensitive: 9,
  documents: 10,
  'documents/identity': 11,
  'documents/service': 12,
  'documents/health': 13,
  'documents/support': 14,
  review: 15,
  missing: 16,
  'lawyer-handoff': 17,
  assessment: 18,
  payment: 19,
} as const

export const CLIENT_SCREEN_BY_PATH = {
  'payment/success': 35,
  'payment/failed': 36,
  receipt: 37,
  dashboard: 38,
  case: 39,
  timeline: 40,
  documents: 41,
  messages: 42,
  tasks: 43,
  status: 44,
  interview: 45,
  conditional: 46,
  final: 47,
  'new-case': 48,
} as const

export const OFFICE_SCREEN_BY_PATH = {
  login: 49,
  session: 50,
  dashboard: 51,
  inquiries: 52,
  cases: 53,
  'case-360': 54,
  client: 55,
  identity: 56,
  criteria: 57,
  questionnaire: 58,
  documents: 59,
  evidence: 60,
  medical: 61,
  risks: 62,
  decision: 63,
  queue: 64,
  submissions: 65,
  interviews: 66,
  appeals: 67,
  payments: 68,
  messages: 69,
  content: 70,
  users: 71,
  audit: 72,
  reports: 73,
  settings: 74,
} as const

export function canonicalPublicSrc(slug?: string) {
  return `/canonical/public.html${slug ? `?p=${encodeURIComponent(slug)}` : ''}`
}

export function canonicalGuidedSrc(index: number) {
  return `/canonical/guided.html?i=${index}`
}

export function canonicalClientSrc(screen: number) {
  return `/canonical/client.html?screen=${screen}`
}

export function canonicalOfficeSrc(screen: number) {
  return `/canonical/office.html?screen=${screen}`
}

export function canonicalResponsiveSrc(screen: string) {
  return `/canonical/responsive.html?screen=${encodeURIComponent(screen)}`
}
