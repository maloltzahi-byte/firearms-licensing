import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireStaff } from '@/lib/auth/guards'
import { addTask, setCaseStatus, setDecisionGate } from './actions'

type Props = { params: Promise<{ caseId: string }> }

export default async function CockpitCasePage({ params }: Props) {
  const { caseId } = await params
  const { supabase, profile } = await requireStaff()
  const [caseResult, answersResult, docsResult, tasksResult, messagesResult, gateResult, auditResult] = await Promise.all([
    supabase.from('cases').select('*').eq('id', caseId).maybeSingle(),
    supabase.from('questionnaire_answers').select('field_key,value,sensitivity,updated_at').eq('case_id', caseId).order('updated_at'),
    supabase.from('documents').select('id,file_name,review_status,sensitivity,created_at').eq('case_id', caseId).order('created_at', { ascending: false }),
    supabase.from('tasks').select('id,title,status,due_at').eq('case_id', caseId).order('created_at', { ascending: false }),
    supabase.from('messages').select('id,body,is_internal,created_at').eq('case_id', caseId).order('created_at', { ascending: false }).limit(20),
    supabase.from('decision_gates').select('*').eq('case_id', caseId).maybeSingle(),
    supabase.from('audit_events').select('id,event_type,object_type,created_at').eq('case_id', caseId).order('created_at', { ascending: false }).limit(30),
  ])
  const caseRow = caseResult.data
  if (!caseRow) notFound()
  const canDecide = ['lawyer','admin'].includes(profile.role)

  return <main className="p-5 sm:p-8 lg:p-10"><Link href="/cockpit/cases" className="text-sm font-bold text-[#ef8c2f]">← חזרה לרשימת תיקים</Link><section className="mt-5 rounded-[28px] border border-white/10 bg-[#0c1c31] p-7"><div className="flex flex-wrap items-start justify-between gap-5"><div><p className="text-xs font-black tracking-wider text-[#ef8c2f]">CASE 360</p><h1 className="mt-2 font-display text-4xl font-black">{caseRow.case_number}</h1><p className="mt-2 text-sm text-slate-400">{caseRow.title}</p></div><span className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold">{caseRow.status}</span></div></section>
  <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1fr]">
    <Panel title="תשובות שאלון">{answersResult.data?.length?answersResult.data.map((answer)=><div key={answer.field_key} className="border-b border-white/10 py-3"><strong className="block text-sm">{answer.field_key}</strong><pre className="mt-1 whitespace-pre-wrap break-words text-xs text-slate-400">{JSON.stringify(answer.value,null,2)}</pre></div>):<Empty/>}</Panel>
    <Panel title="מסמכים">{docsResult.data?.length?docsResult.data.map((doc)=><div key={doc.id} className="flex justify-between gap-4 border-b border-white/10 py-3"><span>{doc.file_name}</span><span className="text-xs text-slate-400">{doc.review_status}</span></div>):<Empty/>}</Panel>
    <Panel title="משימות"><form className="mb-5 flex gap-2"><input type="hidden" name="caseId" value={caseId}/><label className="sr-only" htmlFor="task-title">משימה</label><input id="task-title" name="title" required placeholder="משימה חדשה" className="min-w-0 flex-1 rounded-xl border border-white/15 bg-[#07111f] px-3 py-2"/><button formAction={addTask} className="rounded-xl bg-[#ef8c2f] px-4 font-black text-[#111827]">הוספה</button></form>{tasksResult.data?.length?tasksResult.data.map((task)=><div key={task.id} className="flex justify-between gap-4 border-b border-white/10 py-3"><span>{task.title}</span><span className="text-xs text-slate-400">{task.status}</span></div>):<Empty/>}</Panel>
    <Panel title="הודעות">{messagesResult.data?.length?messagesResult.data.map((message)=><div key={message.id} className="border-b border-white/10 py-3 text-sm"><span>{message.body}</span>{message.is_internal?<span className="mr-2 rounded bg-[#ef8c2f]/15 px-2 py-1 text-[10px] text-[#ef8c2f]">פנימי</span>:null}</div>):<Empty/>}</Panel>
  </div>
  {canDecide?<div className="mt-6 grid gap-6 xl:grid-cols-2"><Panel title={`שער החלטה · ${gateResult.data?.state ?? 'REVIEW'}`}><form className="space-y-3"><input type="hidden" name="caseId" value={caseId}/><label htmlFor="gate-state" className="block text-sm font-bold">מצב שער</label><select id="gate-state" name="state" defaultValue={gateResult.data?.state??'REVIEW'} className="w-full rounded-xl border border-white/15 bg-[#07111f] px-3 py-2">{['REVIEW','NEEDS_INFO','BLOCK','APPROVED'].map((x)=><option key={x}>{x}</option>)}</select><label htmlFor="rationale" className="block text-sm font-bold">נימוק</label><textarea id="rationale" name="rationale" required minLength={8} className="min-h-28 w-full rounded-xl border border-white/15 bg-[#07111f] p-3"/><button formAction={setDecisionGate} className="rounded-xl bg-[#ef8c2f] px-5 py-3 font-black text-[#111827]">עדכון שער (AAL2)</button></form></Panel><Panel title="שינוי סטטוס תיק"><form className="space-y-3"><input type="hidden" name="caseId" value={caseId}/><label htmlFor="case-status" className="block text-sm font-bold">סטטוס</label><select id="case-status" name="status" defaultValue={caseRow.status} className="w-full rounded-xl border border-white/15 bg-[#07111f] px-3 py-2">{['draft','needs_info','counsel_review','approved','blocked','submitted','authority_wait','interview','appeal','closed'].map((x)=><option key={x}>{x}</option>)}</select><label htmlFor="next-action" className="block text-sm font-bold">פעולה הבאה</label><textarea id="next-action" name="nextAction" defaultValue={caseRow.next_action??''} className="min-h-24 w-full rounded-xl border border-white/15 bg-[#07111f] p-3"/><button formAction={setCaseStatus} className="rounded-xl bg-[#ef8c2f] px-5 py-3 font-black text-[#111827]">עדכון סטטוס (AAL2)</button></form></Panel></div>:null}
  <div className="mt-6"><Panel title="Timeline / Audit">{auditResult.data?.length?auditResult.data.map((event)=><div key={event.id} className="grid gap-1 border-b border-white/10 py-3 md:grid-cols-[220px_1fr]"><span className="text-xs text-slate-400">{event.created_at}</span><strong className="text-sm">{event.event_type}</strong></div>):<Empty/>}</Panel></div></main>
}
function Panel({title,children}:{title:string;children:React.ReactNode}){return <section className="rounded-[24px] border border-white/10 bg-white/5 p-5 sm:p-6"><h2 className="font-display text-2xl font-black">{title}</h2><div className="mt-4">{children}</div></section>}
function Empty(){return <p className="text-sm text-slate-400">אין מידע.</p>}
