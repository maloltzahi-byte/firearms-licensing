import { NextResponse } from 'next/server'
import { z } from 'zod'
import routesData from '@/data/routes.json'
import universalData from '@/data/universal-questions.json'
import questionnaireRoutes from '@/data/questionnaire-routes.json'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { JsonValue } from '@/types/json'

type Context = { params: Promise<{ caseId: string }> }

const answerSchema = z.object({
  fieldKey: z.string().min(1).max(160),
  value: z.union([z.string(), z.number(), z.boolean(), z.null()]),
})

const canonicalRoutes = new Set(routesData.routes.map((route) => route.id))
const universalById = new Map(universalData.questions.map((question) => [question.id, question]))
const routeQuestionIds = new Set(
  questionnaireRoutes.routes.flatMap((route) => route.questions.map((question) => question.id)),
)

function sensitivityFor(fieldKey: string) {
  const question = universalById.get(fieldKey)
  return question?.sensitivity ?? 'normal'
}

async function authorizedCase(caseId: string) {
  const supabase = await createSupabaseServerClient()
  const { data: claimsData } = await supabase.auth.getClaims()
  if (!claimsData?.claims?.sub) return { supabase, authorized: false, userId: null }
  const { data } = await supabase.from('cases').select('id').eq('id', caseId).maybeSingle()
  return { supabase, authorized: Boolean(data), userId: claimsData.claims.sub }
}

export async function GET(_request: Request, { params }: Context) {
  const { caseId } = await params
  const { supabase, authorized } = await authorizedCase(caseId)
  if (!authorized) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const { data, error } = await supabase
    .from('questionnaire_answers')
    .select('field_key, value, updated_at')
    .eq('case_id', caseId)
  if (error) return NextResponse.json({ error: 'read_failed' }, { status: 500 })
  return NextResponse.json({ answers: data ?? [] })
}

export async function PATCH(request: Request, { params }: Context) {
  const { caseId } = await params
  const parsed = answerSchema.safeParse(await request.json())
  if (!parsed.success) return NextResponse.json({ error: 'invalid_answer' }, { status: 400 })

  const { fieldKey, value } = parsed.data
  const allowed =
    universalById.has(fieldKey) ||
    routeQuestionIds.has(fieldKey) ||
    fieldKey === 'selected-route-id'
  if (!allowed) return NextResponse.json({ error: 'unknown_field' }, { status: 400 })
  if (fieldKey === 'selected-route-id' && typeof value === 'string' && !canonicalRoutes.has(value)) {
    return NextResponse.json({ error: 'unknown_route' }, { status: 400 })
  }

  const { supabase, authorized, userId } = await authorizedCase(caseId)
  if (!authorized || !userId) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { error } = await supabase.from('questionnaire_answers').upsert(
    {
      case_id: caseId,
      field_key: fieldKey,
      value: value as JsonValue,
      sensitivity: sensitivityFor(fieldKey),
      source: 'client',
      created_by: userId,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'case_id,field_key' },
  )
  if (error) return NextResponse.json({ error: 'save_failed' }, { status: 500 })
  return NextResponse.json({ ok: true, savedAt: new Date().toISOString() })
}

export async function POST(_request: Request, { params }: Context) {
  const { caseId } = await params
  const { supabase, authorized, userId } = await authorizedCase(caseId)
  if (!authorized || !userId) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('questionnaire_answers')
    .select('field_key, value')
    .eq('case_id', caseId)
  if (error) return NextResponse.json({ error: 'read_failed' }, { status: 500 })

  const values = new Map((data ?? []).map((answer) => [answer.field_key, answer.value]))
  const missing = universalData.questions
    .filter((question) => question.required && !values.has(question.id))
    .map((question) => question.id)
  const selectedRoute = values.get('selected-route-id')
  if (typeof selectedRoute !== 'string' || !canonicalRoutes.has(selectedRoute)) missing.push('selected-route-id')
  if (typeof selectedRoute === 'string') {
    const block = questionnaireRoutes.routes.find((route) => route.route_id === selectedRoute)
    for (const question of block?.questions ?? []) {
      if (question.required && !values.has(question.id)) missing.push(question.id)
    }
  }

  if (missing.length) return NextResponse.json({ ok: false, missing }, { status: 422 })

  const { error: submitError } = await supabase.from('questionnaire_answers').upsert(
    {
      case_id: caseId,
      field_key: 'questionnaire-submitted-at',
      value: new Date().toISOString(),
      sensitivity: 'normal',
      source: 'client',
      created_by: userId,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'case_id,field_key' },
  )
  if (submitError) return NextResponse.json({ error: 'submit_failed' }, { status: 500 })
  return NextResponse.json({ ok: true })
}
