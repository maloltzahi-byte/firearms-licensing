import { NextResponse } from 'next/server'
import { z } from 'zod'
import { runBrain } from '@/brain'
import type { CaseState } from '@/types/brain'

export const dynamic = 'force-dynamic'

const inputSchema = z.object({
  caseId: z.string().min(1).max(160),
  client: z.object({
    fullNameHe: z.string().max(200),
    idNumber: z.string().max(20),
    dateOfBirth: z.string().max(40),
    citizenship: z.enum(['citizen','permanent_resident','oleh','unknown']),
    residenceYears: z.number().min(0).max(130),
    serviceStatus: z.enum(['combat_1yr','regular_2yr','civil_service','no_service','wounded_operational','combat_medical_discharge','unknown']),
    serviceRole: z.string().max(300).optional(),
    serviceEndYear: z.number().int().min(1900).max(2200).optional(),
    city: z.string().max(200).optional(),
    hebrewLevel: z.enum(['native','high','basic','insufficient']),
    policeRecord: z.boolean(),
    activeRestrainingOrder: z.boolean(),
    mentalHealthRestriction: z.boolean(),
    existingLicense: z.enum(['none','private','special','authorization_cert']),
  }),
  routeFacts: z.record(z.string(), z.record(z.string(), z.unknown())),
  documents: z.array(z.object({ documentId: z.string().max(160), status: z.enum(['missing','requested','partial','received','verified','rejected']) })).max(200),
  flags: z.array(z.object({ flagId: z.string().max(160), severity: z.enum(['info','warn','block']), status: z.enum(['open','resolved']), note: z.string().max(2000).optional() })).max(100),
  state: z.string().max(80),
  selectedRouteId: z.string().max(160).optional(),
})

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get('content-length') ?? '0')
  if (contentLength > 128_000) return NextResponse.json({ error: 'payload_too_large' }, { status: 413 })

  try {
    const body: unknown = await request.json()
    const parsed = inputSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: 'invalid_guidance_request' }, { status: 400 })
    const response = NextResponse.json(runBrain(parsed.data as CaseState), { status: 200 })
    response.headers.set('Cache-Control', 'no-store')
    return response
  } catch {
    return NextResponse.json({ error: 'invalid_guidance_request' }, { status: 400 })
  }
}
