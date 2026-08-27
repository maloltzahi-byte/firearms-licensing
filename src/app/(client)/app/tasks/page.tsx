import Link from 'next/link'
import { requireProfile } from '@/lib/auth/guards'

type Props = { searchParams: Promise<{ case?: string }> }
export default async function ClientTasksPage({ searchParams }: Props) {
  const query = await searchParams
  const { supabase } = await requireProfile()
  const { data: cases } = await supabase.from('cases').select('id,case_number').order('updated_at', { ascending: false })
  const selected = cases?.find((item) => item.id === query.case) ?? cases?.[0]
  const { data: tasks } = selected ? await supabase.from('tasks').select('id,title,description,status,due_at').eq('case_id', selected.id).order('created_at', { ascending: false }) : { data: [] }
  return <main className="mx-auto max-w-5xl px-5 py-8 sm:py-12"><h1 className="font-display text-4xl font-black text-[#173b6d]">פעולות נדרשות</h1><div className="mt-5 flex flex-wrap gap-2">{cases?.map((item)=><Link key={item.id} href={`/app/tasks?case=${item.id}`} className={`rounded-full px-4 py-2 text-sm font-bold ${selected?.id===item.id?'bg-[#173b6d] text-white':'border bg-white'}`}>{item.case_number}</Link>)}</div><div className="mt-7 space-y-3">{tasks?.length?tasks.map((task)=><article key={task.id} className="rounded-2xl border bg-white p-5 shadow-sm"><div className="flex justify-between gap-4"><strong>{task.title}</strong><span className="text-xs font-bold text-slate-500">{task.status}</span></div>{task.description?<p className="mt-2 text-sm text-slate-600">{task.description}</p>:null}</article>):<p className="rounded-2xl bg-white p-7 text-slate-500">אין פעולות פתוחות.</p>}</div></main>
}
