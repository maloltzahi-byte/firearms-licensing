'use server'

import { headers } from 'next/headers'
import { Resend } from 'resend'
import { leadSchema } from '@/lib/lead-schema'
import { allowSubmission } from '@/lib/rate-limit'
import { getScreeningConfig } from '@/lib/screening-data'
import { computeScreeningResult, labels, resultCopy, type ScreeningAnswers } from '@/lib/screening'
import { site } from '@/lib/site'

export type LeadState = { status: 'idle' | 'ok' | 'discarded' | 'error'; message: string }
export const initialLeadState: LeadState = { status: 'idle', message: '' }

type HeaderReader = { get(name: string): string | null }
type MailInput = Parameters<Resend['emails']['send']>[0]

function getIp(headerList: HeaderReader) {
  return headerList.get('x-forwarded-for')?.split(',')[0]?.trim() || headerList.get('x-real-ip')?.trim() || 'unknown'
}

async function sendSafely(resend: Resend, input: MailInput) {
  try {
    const response = await resend.emails.send(input)
    return !response.error
  } catch {
    return false
  }
}

export async function submitLead(_previous: LeadState, formData: FormData): Promise<LeadState> {
  const raw = Object.fromEntries(formData.entries())
  const parsed = leadSchema.safeParse(raw)
  if (!parsed.success) return { status: 'error', message: `לא הצלחנו לאמת את הפרטים. בדקו את השדות ונסו שוב. אפשר גם להתקשר או לשלוח WhatsApp ל־${site.phone}.` }

  if (parsed.data.website || Date.now() - parsed.data.startedAt < 3000) {
    return { status: 'discarded', message: 'הפנייה התקבלה.' }
  }

  const headerList = await headers()
  const ip = getIp(headerList)
  if (!allowSubmission(ip)) return { status: 'error', message: `הגעתם למגבלת השליחות הזמנית. אפשר ליצור קשר ישירות ב־${site.phone}.` }

  const config = getScreeningConfig()
  const criterionIds = parsed.data.criteria ? parsed.data.criteria.split(',').filter(Boolean) : []
  const allowedIds = new Set(config.criteria.map((criterion) => criterion.id))
  if (criterionIds.some((id) => !allowedIds.has(id))) return { status: 'error', message: 'נתוני הסינון אינם תקינים. יש להתחיל את הבדיקה מחדש.' }
  if (!config.localities.includes(parsed.data.locality)) return { status: 'error', message: 'שם היישוב אינו תקין. יש להתחיל את הבדיקה מחדש.' }

  const answers: ScreeningAnswers = {
    age: parsed.data.age,
    citizenship: parsed.data.citizenship,
    residencyYears: parsed.data.residencyYears,
    service: parsed.data.service,
    locality: parsed.data.locality,
    criteria: criterionIds,
    unsure: parsed.data.unsure,
  }
  const color = computeScreeningResult(answers, config)
  const colorHe = color === 'green' ? 'ירוק' : color === 'yellow' ? 'צהוב' : 'אדום'
  const criteriaHe = criterionIds.length ? config.criteria.filter((criterion) => criterionIds.includes(criterion.id)).map((criterion) => criterion.he).join(', ') : 'לא בטוח / אף אחד מהם'
  const received = new Intl.DateTimeFormat('he-IL', { timeZone: 'Asia/Jerusalem', dateStyle: 'short', timeStyle: 'short' }).format(new Date())

  const apiKey = process.env.RESEND_API_KEY
  const primary = process.env.LEAD_EMAIL_TO || site.email
  const from = process.env.LEAD_EMAIL_FROM
  if (!apiKey || !from) return { status: 'error', message: `הטופס עדיין לא מחובר לשירות המייל. אפשר ליצור קשר מיידית בטלפון או ב־WhatsApp: ${site.phone}, או במייל ${site.email}.` }

  const subject = `ליד חדש — ${colorHe} — ${parsed.data.fullName}`
  const text = `שם:      ${parsed.data.fullName}\nטלפון:   ${parsed.data.phone}\nאימייל:  ${parsed.data.email}\nהערה:    ${parsed.data.note || 'ללא'}\n\n--- תוצאת הסינון ---\nגיל:      ${labels.age[answers.age]}\nאזרחות:   ${labels.citizenship[answers.citizenship]}\nשירות:    ${labels.service[answers.service]}\nיישוב:    ${answers.locality} — זכאות יישוב לא נבדקה\nתבחינים:  ${criteriaHe}\nתוצאה:    ${colorHe}\n\nהתקבל: ${received}`

  const resend = new Resend(apiKey)
  const delivered = await sendSafely(resend, { from, to: primary, replyTo: parsed.data.email, subject, text })
  if (!delivered) return { status: 'error', message: `שליחת הפנייה נכשלה. אפשר ליצור קשר מיידית בטלפון או ב־WhatsApp: ${site.phone}.` }

  await sendSafely(resend, {
    from,
    to: parsed.data.email,
    subject: 'קיבלנו את פנייתך',
    text: `שלום ${parsed.data.fullName},\n\nקיבלנו את פנייתך בנושא בדיקה ראשונית לרישוי כלי ירייה פרטי. נחזור אליך בתוך יום עסקים.\n\n${resultCopy(color).title}\n\nלתשומת לבך: תוצאת הסינון היא כלי עזר ראשוני בלבד ואינה חוות דעת משפטית.`,
  })

  return { status: 'ok', message: 'הפנייה נשלחה בהצלחה.' }
}
