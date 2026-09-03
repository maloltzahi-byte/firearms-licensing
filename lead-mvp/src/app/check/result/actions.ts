'use server'

import { headers } from 'next/headers'
import { Resend } from 'resend'
import { z } from 'zod'
import { leadSchema } from '@/lib/lead-schema'
import { allowSubmission } from '@/lib/rate-limit'
import { getScreeningConfig } from '@/lib/screening-data'
import { computeScreeningResult, labels, routeFamilyOptions, type RouteFamily, type ScreeningAnswers } from '@/lib/screening'

export type LeadState = { status: 'idle' | 'ok' | 'discarded' | 'error'; message: string }
export const initialLeadState: LeadState = { status: 'idle', message: '' }

type HeaderReader = { get(name: string): string | null }
type MailInput = Parameters<Resend['emails']['send']>[0]
const OFFICE_LEAD_EMAIL = 'tzahimaloladv@gmail.com'
const normalizePhone = (value: unknown) => typeof value === 'string' ? value.replace(/[\s()-]/g, '') : value
const callbackSchema = z.object({
  fullName: z.string().trim().min(2).max(100),
  phone: z.preprocess(normalizePhone, z.string().regex(/^(?:\+972|972|0)[2-9]\d{7,8}$/)),
  privacy: z.literal('on'),
  website: z.string().max(200).optional().default(''),
  startedAt: z.coerce.number().int().positive(),
  source: z.enum(['home', 'result']).optional().default('home'),
})

const genericServerError: LeadState = { status: 'error', message: 'לא הצלחנו לשלוח את הפנייה כרגע. אפשר לפנות ב-WhatsApp או בטלפון ולנסות שוב בעוד מספר רגעים.' }

function getIp(headersList: HeaderReader) {
  return headersList.get('x-forwarded-for')?.split(',')[0]?.trim() || headersList.get('x-real-ip')?.trim() || 'unknown'
}

async function sendSafely(resend: Resend, input: MailInput) {
  try { const response = await resend.emails.send(input); return !response.error } catch { return false }
}

function mailSetup() { return { apiKey: process.env.RESEND_API_KEY, from: process.env.LEAD_EMAIL_FROM, to: OFFICE_LEAD_EMAIL } }

export async function submitCallback(_previous: LeadState, formData: FormData): Promise<LeadState> {
  try {
    const parsed = callbackSchema.safeParse(Object.fromEntries(formData.entries()))
    if (!parsed.success) return { status: 'error', message: 'לא הצלחנו לאמת את הפרטים. בדקו את השם והטלפון ונסו שוב.' }
    if (parsed.data.website) return { status: 'discarded', message: 'הפנייה התקבלה.' }
    const ip = getIp(await headers())
    if (!allowSubmission(ip)) return { status: 'error', message: 'הגעתם למגבלת השליחות הזמנית. אפשר לפנות ב-WhatsApp או בטלפון.' }
    const { apiKey, from, to } = mailSetup()
    if (!apiKey || !from) return { status: 'error', message: 'הטופס עדיין לא מחובר לשירות המייל. אפשר לפנות ב-WhatsApp או בטלפון.' }
    const received = new Intl.DateTimeFormat('he-IL', { timeZone: 'Asia/Jerusalem', dateStyle: 'short', timeStyle: 'short' }).format(new Date())
    const resend = new Resend(apiKey)
    const delivered = await sendSafely(resend, { from, to, subject: `ליד חדש — בקשת חזרה — ${parsed.data.fullName}`, text: `שם: ${parsed.data.fullName}\nטלפון: ${parsed.data.phone}\nמקור: ${parsed.data.source}\nהתקבל: ${received}` })
    return delivered ? { status: 'ok', message: 'הפנייה נשלחה בהצלחה.' } : { status: 'error', message: 'שליחת הפנייה נכשלה. אפשר לפנות ב-WhatsApp או בטלפון.' }
  } catch (error) { console.error('submitCallback failed', error); return genericServerError }
}

export async function submitLead(_previous: LeadState, formData: FormData): Promise<LeadState> {
  try {
    const parsed = leadSchema.safeParse(Object.fromEntries(formData.entries()))
    if (!parsed.success) return { status: 'error', message: 'לא הצלחנו לאמת את הפרטים. בדקו את השדות ונסו שוב.' }
    if (parsed.data.website) return { status: 'discarded', message: 'הפנייה התקבלה.' }
    const ip = getIp(await headers())
    if (!allowSubmission(ip)) return { status: 'error', message: 'הגעתם למגבלת השליחות הזמנית. אפשר לפנות ישירות ב-WhatsApp או בטלפון.' }

    const config = getScreeningConfig()
    const routeFamilies = parsed.data.routeFamilies.split(',').filter(Boolean) as RouteFamily[]
    const allowedRoutes = new Set<string>(routeFamilyOptions)
    if (!routeFamilies.length || routeFamilies.some((route) => !allowedRoutes.has(route))) return { status: 'error', message: 'נתוני הסינון אינם תקינים. יש להתחיל את הבדיקה מחדש.' }
    if (routeFamilies.includes('RESIDENCE_WORK') && !config.localities.includes(parsed.data.locality)) return { status: 'error', message: 'יש לבחור יישוב תקין במסלול מגורים / עבודה או לימודים.' }
    if (parsed.data.locality && !config.localities.includes(parsed.data.locality)) return { status: 'error', message: 'נתוני היישוב אינם תקינים.' }

    const answers: ScreeningAnswers = {
      age: parsed.data.age,
      hebrewBasic: parsed.data.hebrewBasic,
      citizenship: parsed.data.citizenship,
      residencyYears: parsed.data.residencyYears,
      service: parsed.data.service,
      applicationStatus: parsed.data.applicationStatus,
      policeBarrier: parsed.data.policeBarrier,
      routeFamilies,
      locality: parsed.data.locality,
      criteria: [],
      unsure: routeFamilies.includes('UNSURE'),
    }
    const color = computeScreeningResult(answers, config)
    const colorHe = color === 'green' ? 'ירוק' : color === 'yellow' ? 'צהוב' : 'אדום'
    const residencyHe = answers.residencyYears ? labels.residency[answers.residencyYears] : 'לא רלוונטי'
    const routesHe = routeFamilies.map((route) => labels.routeFamily[route]).join(', ')
    const localityHe = answers.locality || 'לא נדרש במסלול שנבחר'
    const { apiKey, from, to } = mailSetup()
    if (!apiKey || !from) return { status: 'error', message: 'הטופס עדיין לא מחובר לשירות המייל. אפשר לפנות ב-WhatsApp או בטלפון.' }
    const received = new Intl.DateTimeFormat('he-IL', { timeZone: 'Asia/Jerusalem', dateStyle: 'short', timeStyle: 'short' }).format(new Date())
    const resend = new Resend(apiKey)
    const text = `ליד חדש מאתר רישיון נשק\n\n--- פרטי קשר ---\nשם: ${parsed.data.fullName}\nטלפון: ${parsed.data.phone}\n\n--- תשובות הבדיקה הקצרה ---\nגיל: ${labels.age[answers.age!]}\nעברית בסיסית: ${labels.hebrew[answers.hebrewBasic!]}\nמעמד: ${labels.citizenship[answers.citizenship!]}\nשהייה רציפה: ${residencyHe}\nשירות: ${labels.service[answers.service!]}\nמצב הבקשה: ${labels.applicationStatus[answers.applicationStatus!]}\nמניעה ידועה: ${labels.policeBarrier[answers.policeBarrier!]}\nמסלול: ${routesHe}\nיישוב: ${localityHe}\n\n--- תוצאה ראשונית ---\n${colorHe}\n\nהתקבל: ${received}`
    const delivered = await sendSafely(resend, { from, to, subject: `ליד חדש — ${colorHe} — ${parsed.data.fullName} — ${parsed.data.phone}`, text })
    return delivered ? { status: 'ok', message: 'הפנייה נשלחה בהצלחה.' } : { status: 'error', message: 'שליחת הפנייה נכשלה. אפשר לפנות ב-WhatsApp או בטלפון.' }
  } catch (error) { console.error('submitLead failed', error); return genericServerError }
}
