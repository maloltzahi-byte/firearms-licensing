import Link from 'next/link'
import { requireStaff } from '@/lib/auth/guards'

export default async function CockpitDashboardPage() {
  const { supabase } = await requireStaff()
  const [casesResult, tasksResult, documentsResult] = await Promise.all([
    supabase.from('cases').select('id,case_number,status,title,updated_at').order('updated_at', { ascending: false }).limit(8),
    supabase.from('tasks').select('id,case_id,title,status,due_at').neq('status', 'done').order('due_at', { ascending: true }).limit(8),
    supabase.from('documents').select('id,case_id,file_name,review_status,created_at').eq('review_status', 'pending').order('created_at', { ascending: false }).limit(8),
  ])
  const cases = casesResult.data ?? []
  const tasks = tasksResult.data ?? []
  const documents = documentsResult.data ?? []

  return <main className="p-5 sm:p-8 lg:p-10">
    <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="text-xs font-black tracking-[.2em] text-[#ef8c2f]">OFFICE CONTROL</p><h1 className="mt-2 font-display text-4xl font-black">תמונת מצב משרדית</h1><p className="mt-2 text-sm text-slate-400">נתונים חיים לפי ההרשאות של המשתמש המחובר.</p></div><Link href="/cockpit/cases" className="rounded-2xl bg-[#ef8c2f] px-5 py-3 font-black text-[#111827]">כל התיקים</Link></div>
    <div className="mt-8 grid gap-4 md:grid-cols-3"><Stat label="תיקים שנקלטו" value={cases.length} /><Stat label="משימות פתוחות" value={tasks.length} /><Stat label="מסמכים ממתינים" value={documents.length} /></div>
    <div className="mt-8 grid gap-6 xl:grid-cols-[1.25fr_.75fr]">
      <section className="rounded-[26px] border border-white/10 bg-white/5 p-5 sm:p-6"><h2 className="font-display text-2xl font-black">תיקים אחרונים</h2><div className="mt-4 divide-y divide-white/10">{cases.map((item)=><Link key={item.id} href={`/cockpit/cases/${item.id}`} className="flex items-center justify-between gap-4 py-4"><div><strong>{item.case_number}</strong><p className="mt-1 text-xs text-slate-400">{item.title}</p></div><span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold">{item.status}</span></Link>)}</div></section>
      <section className="rounded-[26px] border border-white/10 bg-white/5 p-5 sm:p-6"><h2 className="font-display text-2xl font-black">עבודה פתוחה</h2><div className="mt-4 space-y-3">{tasks.length?tasks.map((task)=><Link key={task.id} href={`/cockpit/cases/${task.case_id}`} className="block rounded-2xl bg-black/15 p-4 text-sm font-bold">{task.title}</Link>):<p className="text-sm text-slate-400">אין משימות פתוחות.</p>}</div></section>
    </div>
  </main>
}

function Stat({ label, value }: { label: string; value: number }) { return <article className="rounded-[24px] border border-white/10 bg-[#0c1c31] p-6"><p className="text-sm text-slate-400">{label}</p><p className="mt-3 font-display text-4xl font-black text-[#ef8c2f]">{value}</p></article> }
