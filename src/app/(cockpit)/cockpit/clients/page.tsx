import Link from 'next/link'
import { requireStaff } from '@/lib/auth/guards'

export default async function CockpitClientsPage() {
  const { supabase } = await requireStaff()
  const { data: cases } = await supabase.from('cases').select('id,case_number,client_user_id,status,updated_at').not('client_user_id','is',null).order('updated_at',{ascending:false})
  const grouped = new Map<string, typeof cases>()
  for (const item of cases ?? []) {
    if (!item.client_user_id) continue
    grouped.set(item.client_user_id, [...(grouped.get(item.client_user_id) ?? []), item])
  }
  return <main className="p-5 sm:p-8 lg:p-10"><h1 className="font-display text-4xl font-black">לקוחות</h1><p className="mt-2 text-sm text-slate-400">הרשימה מוצגת לפי התיקים שאליהם יש למשתמש המחובר הרשאה.</p><div className="mt-6 grid gap-4 lg:grid-cols-2">{[...grouped.entries()].map(([userId,userCases], index)=><article key={userId} className="rounded-[24px] border border-white/10 bg-white/5 p-5"><p className="text-sm font-black">לקוח {index + 1}</p><p className="mt-2 text-sm text-slate-400">{userCases?.length ?? 0} תיקים</p><div className="mt-4 flex flex-wrap gap-2">{userCases?.map((item)=><Link key={item.id} href={`/cockpit/cases/${item.id}`} className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold">{item.case_number}</Link>)}</div></article>)}</div></main>
}
