import Link from 'next/link'
import { requireStaff } from '@/lib/auth/guards'
import { HE } from '@/lib/i18n/he'

type Props = { searchParams: Promise<{ q?: string; status?: string }> }
type CaseStatus = keyof typeof HE.caseStatuses
type RequestType = keyof typeof HE.requestTypes
const statuses = ['draft','needs_info','counsel_review','approved','blocked','submitted','authority_wait','interview','appeal','closed'] as const

function caseStatusLabel(status: string) {
  return status in HE.caseStatuses ? HE.caseStatuses[status as CaseStatus] : 'מצב תיק'
}

function requestTypeLabel(requestType: string) {
  return requestType in HE.requestTypes ? HE.requestTypes[requestType as RequestType] : 'סוג טיפול'
}

export default async function CockpitCasesPage({ searchParams }: Props) {
  const { q = '', status = '' } = await searchParams
  const { supabase } = await requireStaff()
  let query = supabase.from('cases').select('id,case_number,title,status,request_type,next_action,updated_at').order('updated_at', { ascending: false }).limit(100)
  if (status && statuses.includes(status as typeof statuses[number])) query = query.eq('status', status)
  if (q.trim()) query = query.or(`case_number.ilike.%${q.trim()}%,title.ilike.%${q.trim()}%`)
  const { data: cases } = await query

  return <main className="p-5 sm:p-8 lg:p-10"><h1 className="font-display text-4xl font-black">תיקים</h1><form className="mt-6 grid gap-3 rounded-[24px] border border-white/10 bg-white/5 p-4 md:grid-cols-[1fr_220px_auto]"><label className="sr-only" htmlFor="q">חיפוש</label><input id="q" name="q" defaultValue={q} placeholder="מספר תיק או כותרת" className="rounded-xl border border-white/15 bg-[#07111f] px-4 py-3 text-white"/><label className="sr-only" htmlFor="status">מצב תיק</label><select id="status" name="status" defaultValue={status} className="rounded-xl border border-white/15 bg-[#07111f] px-4 py-3 text-white"><option value="">כל מצבי התיק</option>{statuses.map((item)=><option key={item} value={item}>{caseStatusLabel(item)}</option>)}</select><button className="rounded-xl bg-[#ef8c2f] px-5 py-3 font-black text-[#111827]">סינון</button></form><section className="mt-6 overflow-hidden rounded-[24px] border border-white/10 bg-white/5"><div className="divide-y divide-white/10">{cases?.length?cases.map((item)=><Link href={`/cockpit/cases/${item.id}`} key={item.id} className="grid gap-3 px-5 py-5 hover:bg-white/5 md:grid-cols-[180px_1fr_160px_160px]"><strong>{item.case_number}</strong><span className="text-slate-300">{item.title}</span><span className="text-sm text-slate-400">{requestTypeLabel(item.request_type)}</span><span className="text-xs font-bold text-[#ef8c2f]">{caseStatusLabel(item.status)}</span></Link>):<p className="p-8 text-slate-400">לא נמצאו תיקים.</p>}</div></section></main>
}
