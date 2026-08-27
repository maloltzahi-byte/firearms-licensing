import Link from 'next/link'
import { notFound } from 'next/navigation'
import { HE } from '@/lib/i18n/he'
import { requireProfile } from '@/lib/auth/guards'

type Props = { params: Promise<{ caseId: string }> }

type CaseStatusKey = keyof typeof HE.caseStatuses

export default async function ClientCasePage({ params }: Props) {
  const { caseId } = await params
  const { supabase } = await requireProfile()
  const [{ data: caseRow }, { data: gate }, { data: documents }, { data: tasks }] = await Promise.all([
    supabase.from('cases').select('*').eq('id', caseId).maybeSingle(),
    supabase.from('decision_gates').select('state, rationale, updated_at').eq('case_id', caseId).maybeSingle(),
    supabase.from('documents').select('id, file_name, review_status, created_at').eq('case_id', caseId).order('created_at', { ascending: false }),
    supabase.from('tasks').select('id, title, status, due_at').eq('case_id', caseId).order('created_at', { ascending: false }),
  ])
  if (!caseRow) notFound()

  const caseStatus = HE.caseStatuses[caseRow.status as CaseStatusKey] ?? caseRow.status

  return (
    <main className="mx-auto max-w-7xl px-5 py-8 sm:py-12">
      <Link href="/app" className="text-sm font-bold text-[#173b6d]">← {HE.common.back}</Link>
      <section className="mt-5 rounded-[30px] bg-[#0d2748] p-7 text-white sm:p-10">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <p className="text-sm font-bold text-[#f1a14c]">{HE.client.caseNumber}</p>
            <h1 className="mt-2 font-display text-4xl font-black">{caseRow.case_number}</h1>
          </div>
          <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold">{caseStatus}</span>
        </div>
        <p className="mt-7 max-w-3xl text-slate-300">{caseRow.next_action ?? HE.common.none}</p>
      </section>

      <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <Link href={`/app/questionnaire/${caseId}`} className="rounded-[22px] border bg-white p-6 shadow-sm hover:shadow-md"><strong className="text-[#173b6d]">{HE.client.questionnaire}</strong></Link>
        <Link href={`/app/documents?case=${caseId}`} className="rounded-[22px] border bg-white p-6 shadow-sm hover:shadow-md"><strong className="text-[#173b6d]">{HE.client.documents}</strong><p className="mt-2 text-sm text-slate-500">{documents?.length ?? 0}</p></Link>
        <Link href={`/app/tasks?case=${caseId}`} className="rounded-[22px] border bg-white p-6 shadow-sm hover:shadow-md"><strong className="text-[#173b6d]">{HE.client.tasks}</strong><p className="mt-2 text-sm text-slate-500">{tasks?.filter((task) => task.status !== 'done').length ?? 0}</p></Link>
        <Link href={`/app/status?case=${caseId}`} className="rounded-[22px] border bg-white p-6 shadow-sm hover:shadow-md"><strong className="text-[#173b6d]">{HE.client.authorityStatus}</strong><p className="mt-2 text-sm text-slate-500">{caseRow.authority_status ?? gate?.state ?? HE.common.none}</p></Link>
      </div>
    </main>
  )
}