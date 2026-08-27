import Link from 'next/link'
import { requireProfile } from '@/lib/auth/guards'
import { HE } from '@/lib/i18n/he'

type Props = { searchParams: Promise<{ case?: string }> }
type CaseStatusKey = keyof typeof HE.caseStatuses

export default async function ClientStatusPage({ searchParams }: Props) {
  const query = await searchParams
  const { supabase } = await requireProfile()
  const { data: cases } = await supabase
    .from('cases')
    .select('id,case_number,status,next_action,authority_status,authority_status_source,authority_status_observed_at,updated_at')
    .order('updated_at', { ascending: false })
  const selected = cases?.find((item) => item.id === query.case) ?? cases?.[0]
  const selectedStatus = selected
    ? HE.caseStatuses[selected.status as CaseStatusKey] ?? selected.status
    : null

  return (
    <main className="mx-auto max-w-5xl px-5 py-8 sm:py-12">
      <h1 className="font-display text-4xl font-black text-[#173b6d]">סטטוס התיק</h1>
      <div className="mt-5 flex flex-wrap gap-2">
        {cases?.map((item) => (
          <Link
            key={item.id}
            href={`/app/status?case=${item.id}`}
            className={`rounded-full px-4 py-2 text-sm font-bold ${selected?.id === item.id ? 'bg-[#173b6d] text-white' : 'border bg-white'}`}
          >
            {item.case_number}
          </Link>
        ))}
      </div>
      {selected ? (
        <section className="mt-7 grid gap-4 md:grid-cols-2">
          <article className="rounded-[24px] bg-[#0d2748] p-7 text-white">
            <p className="text-xs font-black text-[#f1a14c]">מצב פנימי</p>
            <p className="mt-3 font-display text-3xl font-black">{selectedStatus}</p>
            <p className="mt-5 text-sm text-slate-300">{selected.next_action ?? HE.common.none}</p>
          </article>
          <article className="rounded-[24px] border bg-white p-7 shadow-sm">
            <p className="text-xs font-black text-[#d66f12]">מידע שנקלט לגבי הרשות</p>
            <p className="mt-3 text-2xl font-black">{selected.authority_status ?? HE.common.none}</p>
            <p className="mt-4 text-sm text-slate-500">{selected.authority_status_source ?? 'לא צוין מקור עדכון'}</p>
          </article>
        </section>
      ) : (
        <p className="mt-7 rounded-2xl bg-white p-7 text-slate-500">אין תיק פעיל.</p>
      )}
    </main>
  )
}