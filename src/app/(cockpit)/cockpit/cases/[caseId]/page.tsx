import Link from 'next/link'
import { notFound } from 'next/navigation'
import questionnaireRoutes from '@/data/questionnaire-routes.json'
import universalQuestions from '@/data/universal-questions.json'
import { requireStaff } from '@/lib/auth/guards'
import { HE } from '@/lib/i18n/he'
import { addTask, setCaseStatus, setDecisionGate } from './actions'

type Props = { params: Promise<{ caseId: string }> }
type CaseStatus = keyof typeof HE.caseStatuses
type GateState = keyof typeof HE.gateStates
type ReviewState = keyof typeof HE.reviewStates
type TaskStatus = keyof typeof HE.taskStatuses
type AuditEvent = keyof typeof HE.auditEvents

const gateStates = ['REVIEW', 'NEEDS_INFO', 'BLOCK', 'APPROVED'] as const
const caseStatuses = ['draft', 'needs_info', 'counsel_review', 'approved', 'blocked', 'submitted', 'authority_wait', 'interview', 'appeal', 'closed'] as const
const questionLabels = new Map<string, string>([
  ...universalQuestions.questions.map((question) => [question.id, question.he] as const),
  ...questionnaireRoutes.routes.flatMap((route) => route.questions.map((question) => [question.id, question.he] as const)),
])

function caseStatusLabel(status: string) {
  return status in HE.caseStatuses ? HE.caseStatuses[status as CaseStatus] : 'מצב תיק'
}

function gateStateLabel(state: string) {
  return state in HE.gateStates ? HE.gateStates[state as GateState] : 'בבדיקה'
}

function reviewStateLabel(state: string) {
  return state in HE.reviewStates ? HE.reviewStates[state as ReviewState] : 'מצב בדיקה'
}

function taskStatusLabel(status: string) {
  return status in HE.taskStatuses ? HE.taskStatuses[status as TaskStatus] : 'מצב משימה'
}

function auditEventLabel(eventType: string) {
  return eventType in HE.auditEvents ? HE.auditEvents[eventType as AuditEvent] : 'עודכנה רשומת תיק'
}

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
  const canDecide = ['lawyer', 'admin'].includes(profile.role)
  const currentGateState = gateResult.data?.state ?? 'REVIEW'

  return <main className="p-5 sm:p-8 lg:p-10"><Link href="/cockpit/cases" className="text-sm font-bold text-[#ef8c2f]">← חזרה לרשימת תיקים</Link><section className="mt-5 rounded-[28px] border border-white/10 bg-[#0c1c31] p-7"><div className="flex flex-wrap items-start justify-between gap-5"><div><p className="text-xs font-black tracking-wider text-[#ef8c2f]">תיק רישוי</p><h1 className="mt-2 font-display text-4xl font-black">{caseRow.case_number}</h1><p className="mt-2 text-sm text-slate-400">{caseRow.title}</p></div><span className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold">{caseStatusLabel(caseRow.status)}</span></div></section>
  <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1fr]">
    <Panel title="תשובות שאלון">{answersResult.data?.length ? answersResult.data.map((answer) => <div key={answer.field_key} className="border-b border-white/10 py-3"><strong className="block text-sm">{questionLabels.get(answer.field_key) ?? 'פרט שנשמר בתיק'}</strong><pre className="mt-1 whitespace-pre-wrap break-words text-xs text-slate-400">{JSON.stringify(answer.value, null, 2)}</pre></div>) : <Empty/>}</Panel>
    <Panel title="מסמכים">{docsResult.data?.length ? docsResult.data.map((doc) => <div key={doc.id} className="flex justify-between gap-4 border-b border-white/10 py-3"><span>{doc.file_name}</span><span className="text-xs text-slate-400">{reviewStateLabel(doc.review_status)}</span></div>) : <Empty/>}</Panel>
    <Panel title="משימות"><form className="mb-5 flex gap-2"><input type="hidden" name="caseId" value={caseId}/><label className="sr-only" htmlFor="task-title">משימה</label><input id="task-title" name="title" required placeholder="משימה חדשה" className="min-w-0 flex-1 rounded-xl border border-white/15 bg-[#07111f] px-3 py-2"/><button formAction={addTask} className="rounded-xl bg-[#ef8c2f] px-4 font-black text-[#111827]">הוספה</button></form>{tasksResult.data?.length ? tasksResult.data.map((task) => <div key={task.id} className="flex justify-between gap-4 border-b border-white/10 py-3"><span>{task.title}</span><span className="text-xs text-slate-400">{taskStatusLabel(task.status)}</span></div>) : <Empty/>}</Panel>
    <Panel title="הודעות">{messagesResult.data?.length ? messagesResult.data.map((message) => <div key={message.id} className="border-b border-white/10 py-3 text-sm"><span>{message.body}</span>{message.is_internal ? <span className="mr-2 rounded bg-[#ef8c2f]/15 px-2 py-1 text-[10px] text-[#ef8c2f]">פנימי</span> : null}</div>) : <Empty/>}</Panel>
  </div>
  {canDecide ? <div className="mt-6 grid gap-6 xl:grid-cols-2"><Panel title={`החלטת עורך דין · ${gateStateLabel(currentGateState)}`}><form className="space-y-3"><input type="hidden" name="caseId" value={caseId}/><label htmlFor="gate-state" className="block text-sm font-bold">מצב ההחלטה</label><select id="gate-state" name="state" defaultValue={currentGateState} className="w-full rounded-xl border border-white/15 bg-[#07111f] px-3 py-2">{gateStates.map((state) => <option key={state} value={state}>{gateStateLabel(state)}</option>)}</select><label htmlFor="rationale" className="block text-sm font-bold">נימוק</label><textarea id="rationale" name="rationale" required minLength={8} className="min-h-28 w-full rounded-xl border border-white/15 bg-[#07111f] p-3"/><button formAction={setDecisionGate} className="rounded-xl bg-[#ef8c2f] px-5 py-3 font-black text-[#111827]">עדכון החלטה באימות דו־שלבי</button></form></Panel><Panel title="שינוי מצב התיק"><form className="space-y-3"><input type="hidden" name="caseId" value={caseId}/><label htmlFor="case-status" className="block text-sm font-bold">מצב התיק</label><select id="case-status" name="status" defaultValue={caseRow.status} className="w-full rounded-xl border border-white/15 bg-[#07111f] px-3 py-2">{caseStatuses.map((status) => <option key={status} value={status}>{caseStatusLabel(status)}</option>)}</select><label htmlFor="next-action" className="block text-sm font-bold">פעולה הבאה</label><textarea id="next-action" name="nextAction" defaultValue={caseRow.next_action ?? ''} className="min-h-24 w-full rounded-xl border border-white/15 bg-[#07111f] p-3"/><button formAction={setCaseStatus} className="rounded-xl bg-[#ef8c2f] px-5 py-3 font-black text-[#111827]">עדכון מצב באימות דו־שלבי</button></form></Panel></div> : null}
  <div className="mt-6"><Panel title="היסטוריית פעולות">{auditResult.data?.length ? auditResult.data.map((event) => <div key={event.id} className="grid gap-1 border-b border-white/10 py-3 md:grid-cols-[220px_1fr]"><span className="text-xs text-slate-400">{new Intl.DateTimeFormat('he-IL', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(event.created_at))}</span><strong className="text-sm">{auditEventLabel(event.event_type)}</strong></div>) : <Empty/>}</Panel></div></main>
}
function Panel({ title, children }: { title: string; children: React.ReactNode }) { return <section className="rounded-[24px] border border-white/10 bg-white/5 p-5 sm:p-6"><h2 className="font-display text-2xl font-black">{title}</h2><div className="mt-4">{children}</div></section> }
function Empty() { return <p className="text-sm text-slate-400">אין מידע.</p> }
