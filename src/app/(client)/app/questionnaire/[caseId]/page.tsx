import Link from 'next/link'
import { notFound } from 'next/navigation'
import { QuestionnaireForm } from '@/components/app/questionnaire-form'
import { requireProfile } from '@/lib/auth/guards'
import type { JsonValue } from '@/types/json'

type Props = { params: Promise<{ caseId: string }> }

export default async function ClientQuestionnairePage({ params }: Props) {
  const { caseId } = await params
  const { supabase } = await requireProfile()
  const { data: caseRow } = await supabase.from('cases').select('id, case_number').eq('id', caseId).maybeSingle()
  if (!caseRow) notFound()
  const { data: answers } = await supabase
    .from('questionnaire_answers')
    .select('field_key, value')
    .eq('case_id', caseId)

  return (
    <main className="mx-auto max-w-7xl px-5 py-8 sm:py-12">
      <Link href={`/app/cases/${caseId}`} className="text-sm font-bold text-[#173b6d]">← חזרה לתיק {caseRow.case_number}</Link>
      <div className="mt-6">
        <QuestionnaireForm
          caseId={caseId}
          initialAnswers={(answers ?? []).map((answer) => ({ field_key: answer.field_key, value: answer.value as JsonValue }))}
        />
      </div>
    </main>
  )
}
