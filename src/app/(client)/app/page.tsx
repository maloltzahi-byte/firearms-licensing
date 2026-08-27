import Link from 'next/link'
import { HE } from '@/lib/i18n/he'
import { requireProfile } from '@/lib/auth/guards'
import { createCase } from './actions'

type CaseStatusKey = keyof typeof HE.caseStatuses

export default async function ClientDashboardPage() {
  const { supabase, profile } = await requireProfile()
  const [{ data: cases }, { data: tasks }] = await Promise.all([
    supabase.from('cases').select('id, case_number, status, next_action, updated_at').order('updated_at', { ascending: false }),
    supabase.from('tasks').select('id, case_id, title, status, due_at').neq('status', 'done').order('due_at', { ascending: true }).limit(6),
  ])

  return (
    <main className="mx-auto max-w-7xl px-5 py-8 sm:py-12">
      <section className="overflow-hidden rounded-[30px] bg-[#0d2748] p-7 text-white shadow-xl sm:p-10">
        <p className="text-sm font-black text-[#f1a14c]">{HE.client.title}</p>
        <div className="mt-3 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <h1 className="font-display text-4xl font-black sm:text-5xl">{profile.display_name ?? HE.client.hello}</h1>
            <p className="mt-3 max-w-2xl text-slate-300">{HE.client.hello}</p>
          </div>
          <form>
            <button formAction={createCase} className="rounded-2xl bg-[#ef8c2f] px-6 py-3.5 font-black text-[#182231] shadow-lg shadow-black/15 hover:bg-[#f29b49]">{HE.client.createCase}</button>
          </form>
        </div>
      </section>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.5fr_.8fr]">
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-2xl font-black">{HE.nav.cases}</h2>
            <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-slate-500 shadow-sm">{cases?.length ?? 0}</span>
          </div>
          <div className="space-y-4">
            {cases?.length ? cases.map((item) => {
              const caseStatus = HE.caseStatuses[item.status as CaseStatusKey] ?? item.status
              return (
                <Link key={item.id} href={`/app/cases/${item.id}`} className="group block rounded-[24px] border border-[#dce4ee] bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-[#173b6d]/30 hover:shadow-lg">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-black tracking-wider text-[#d66f12]">{HE.client.caseNumber}</p>
                      <p className="mt-1 font-display text-2xl font-black text-[#173b6d]">{item.case_number}</p>
                    </div>
                    <span className="rounded-full bg-[#eef3f9] px-3 py-1.5 text-xs font-bold text-[#173b6d]">{caseStatus}</span>
                  </div>
                  <div className="mt-5 border-t border-slate-100 pt-4 text-sm text-slate-600">
                    <strong>{HE.client.nextAction}:</strong> {item.next_action ?? HE.common.none}
                  </div>
                </Link>
              )
            }) : (
              <div className="rounded-[24px] border border-dashed border-[#c9d4e2] bg-white p-10 text-center text-slate-500">{HE.client.noCases}</div>
            )}
          </div>
        </section>

        <aside className="rounded-[24px] border border-[#dce4ee] bg-white p-6 shadow-sm">
          <h2 className="font-display text-2xl font-black">{HE.client.tasks}</h2>
          <div className="mt-5 space-y-4">
            {tasks?.length ? tasks.map((task) => (
              <Link key={task.id} href={`/app/cases/${task.case_id}`} className="block rounded-2xl bg-[#f6f8fb] p-4 text-sm font-bold hover:bg-[#edf2f8]">{task.title}</Link>
            )) : <p className="text-sm text-slate-500">{HE.common.none}</p>}
          </div>
        </aside>
      </div>
    </main>
  )
}