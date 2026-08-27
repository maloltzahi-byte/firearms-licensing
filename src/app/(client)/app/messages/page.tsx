import Link from 'next/link'
import { requireProfile } from '@/lib/auth/guards'
import { sendClientMessage } from './actions'

type Props = { searchParams: Promise<{ case?: string }> }

export default async function ClientMessagesPage({ searchParams }: Props) {
  const { case: requestedCase } = await searchParams
  const { supabase } = await requireProfile()
  const { data: cases } = await supabase.from('cases').select('id,case_number').order('updated_at', { ascending: false })
  const selected = cases?.find((item) => item.id === requestedCase) ?? cases?.[0]
  const { data: messages } = selected
    ? await supabase.from('messages').select('id,body,sender_id,created_at').eq('case_id', selected.id).eq('is_internal', false).order('created_at', { ascending: true })
    : { data: [] }

  return <main className="mx-auto max-w-5xl px-5 py-8 sm:py-12">
    <h1 className="font-display text-4xl font-black text-[#173b6d]">הודעות</h1>
    <div className="mt-5 flex flex-wrap gap-2">{cases?.map((item) => <Link key={item.id} href={`/app/messages?case=${item.id}`} className={`rounded-full px-4 py-2 text-sm font-bold ${selected?.id === item.id ? 'bg-[#173b6d] text-white' : 'border bg-white'}`}>{item.case_number}</Link>)}</div>
    <section className="mt-7 rounded-[28px] border bg-white p-6 shadow-sm">
      <div className="space-y-3">{messages?.length ? messages.map((message) => <article key={message.id} className="rounded-2xl bg-[#f4f7fb] p-4 text-sm leading-6">{message.body}</article>) : <p className="text-sm text-slate-500">אין הודעות.</p>}</div>
      {selected ? <form className="mt-6 border-t pt-6"><input type="hidden" name="caseId" value={selected.id} /><label htmlFor="body" className="mb-2 block text-sm font-black">הודעה למשרד</label><textarea id="body" name="body" required maxLength={10000} className="min-h-28 w-full rounded-2xl border p-4" /><button formAction={sendClientMessage} className="mt-3 rounded-2xl bg-[#173b6d] px-5 py-3 font-black text-white">שליחה</button></form> : null}
    </section>
  </main>
}
