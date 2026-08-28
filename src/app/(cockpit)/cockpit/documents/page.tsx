import Link from 'next/link'
import { requireStaff } from '@/lib/auth/guards'
import { HE } from '@/lib/i18n/he'

type Props = { searchParams: Promise<{ status?: string }> }
type ReviewState = keyof typeof HE.reviewStates
type SensitivityLevel = keyof typeof HE.sensitivityLevels
const reviewStates = ['pending', 'review', 'needs_info', 'approved', 'rejected'] as const

function reviewStateLabel(state: string) {
  return state in HE.reviewStates ? HE.reviewStates[state as ReviewState] : 'מצב בדיקה'
}

function sensitivityLabel(level: string) {
  return level in HE.sensitivityLevels ? HE.sensitivityLevels[level as SensitivityLevel] : 'מידע בתיק'
}

export default async function CockpitDocumentsPage({ searchParams }: Props) {
  const { status = '' } = await searchParams
  const { supabase } = await requireStaff()
  let query = supabase.from('documents').select('id,case_id,file_name,mime_type,size_bytes,sensitivity,review_status,created_at').order('created_at', { ascending: false }).limit(150)
  if (reviewStates.includes(status as typeof reviewStates[number])) query = query.eq('review_status', status)
  const { data: docs } = await query
  return <main className="p-5 sm:p-8 lg:p-10"><h1 className="font-display text-4xl font-black">מסמכים</h1><form className="mt-5 flex gap-2"><label className="sr-only" htmlFor="doc-status">סינון לפי מצב בדיקה</label><select id="doc-status" name="status" defaultValue={status} className="rounded-xl border border-white/15 bg-[#07111f] px-4 py-3"><option value="">כל מצבי הבדיקה</option>{reviewStates.map((state)=><option key={state} value={state}>{reviewStateLabel(state)}</option>)}</select><button className="rounded-xl bg-[#ef8c2f] px-5 font-black text-[#111827]">סינון</button></form><section className="mt-6 overflow-hidden rounded-[24px] border border-white/10 bg-white/5"><div className="divide-y divide-white/10">{docs?.length?docs.map(doc=><Link key={doc.id} href={`/cockpit/cases/${doc.case_id}`} className="grid gap-2 px-5 py-4 md:grid-cols-[1fr_150px_160px]"><strong className="truncate">{doc.file_name}</strong><span className="text-xs text-slate-400">{sensitivityLabel(doc.sensitivity)}</span><span className="text-xs font-bold text-[#ef8c2f]">{reviewStateLabel(doc.review_status)}</span></Link>):<p className="p-8 text-slate-400">אין מסמכים.</p>}</div></section></main>
}
