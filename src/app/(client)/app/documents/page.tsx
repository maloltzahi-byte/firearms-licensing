import Link from 'next/link'
import { DocumentManager } from '@/components/app/document-manager'
import { requireProfile } from '@/lib/auth/guards'

type Props = { searchParams: Promise<{ case?: string }> }

export default async function ClientDocumentsPage({ searchParams }: Props) {
  const { case: requestedCase } = await searchParams
  const { supabase, claims } = await requireProfile()
  const { data: cases } = await supabase.from('cases').select('id,case_number').order('updated_at', { ascending: false })
  const selected = cases?.find((item) => item.id === requestedCase) ?? cases?.[0]
  const { data: documents } = selected
    ? await supabase.from('documents').select('id,file_name,storage_path,review_status,sensitivity,uploaded_by,created_at').eq('case_id', selected.id).order('created_at', { ascending: false })
    : { data: [] }

  return (
    <main className="mx-auto max-w-6xl px-5 py-8 sm:py-12">
      <h1 className="font-display text-4xl font-black text-[#173b6d]">מסמכים</h1>
      <div className="mt-5 flex flex-wrap gap-2">
        {cases?.map((item) => (
          <Link key={item.id} href={`/app/documents?case=${item.id}`} className={`rounded-full px-4 py-2 text-sm font-bold ${selected?.id === item.id ? 'bg-[#173b6d] text-white' : 'border bg-white text-slate-600'}`}>{item.case_number}</Link>
        ))}
      </div>
      <div className="mt-7">
        {selected ? <DocumentManager caseId={selected.id} userId={claims.sub} initialDocuments={documents ?? []} /> : <p className="rounded-2xl bg-white p-8 text-slate-500">יש לפתוח תיק לפני העלאת מסמכים.</p>}
      </div>
    </main>
  )
}
