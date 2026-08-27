'use client'

import { useMemo, useState } from 'react'
import routesData from '@/data/routes.json'
import universalData from '@/data/universal-questions.json'
import questionnaireRoutes from '@/data/questionnaire-routes.json'
import { HE } from '@/lib/i18n/he'
import type { JsonValue } from '@/types/json'

type InitialAnswer = { field_key: string; value: JsonValue }
type Props = { caseId: string; initialAnswers: InitialAnswer[] }

type SaveState = 'idle' | 'saving' | 'saved' | 'error'

function normalizedValue(value: FormDataEntryValue) {
  if (value === 'true') return true
  if (value === 'false') return false
  return value.toString()
}

export function QuestionnaireForm({ caseId, initialAnswers }: Props) {
  const [answers, setAnswers] = useState<Record<string, JsonValue>>(() =>
    Object.fromEntries(initialAnswers.map((answer) => [answer.field_key, answer.value])),
  )
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const [submitMessage, setSubmitMessage] = useState<string | null>(null)
  const selectedRoute = typeof answers['selected-route-id'] === 'string' ? answers['selected-route-id'] : ''
  const routeBlock = questionnaireRoutes.routes.find((route) => route.route_id === selectedRoute)

  const requiredIds = useMemo(() => {
    const ids = universalData.questions.filter((question) => question.required).map((question) => question.id)
    ids.push('selected-route-id')
    for (const question of routeBlock?.questions ?? []) if (question.required) ids.push(question.id)
    return ids
  }, [routeBlock])

  const answeredCount = requiredIds.filter((id) => Object.prototype.hasOwnProperty.call(answers, id)).length
  const progress = Math.round((answeredCount / Math.max(requiredIds.length, 1)) * 100)

  async function save(fieldKey: string, value: JsonValue) {
    setAnswers((current) => ({ ...current, [fieldKey]: value }))
    setSaveState('saving')
    try {
      const response = await fetch(`/api/cases/${caseId}/questionnaire`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fieldKey, value }),
      })
      setSaveState(response.ok ? 'saved' : 'error')
    } catch {
      setSaveState('error')
    }
  }

  async function submit() {
    setSubmitMessage(null)
    const response = await fetch(`/api/cases/${caseId}/questionnaire`, { method: 'POST' })
    if (response.ok) {
      setSubmitMessage('השאלון נשמר ונשלח לבדיקת המשרד. אין בכך קביעה בדבר זכאות.')
      return
    }
    const body = (await response.json()) as { missing?: string[] }
    setSubmitMessage(body.missing?.length ? `יש להשלים ${body.missing.length} שדות לפני השליחה.` : HE.common.error)
  }

  return (
    <div className="grid gap-7 lg:grid-cols-[1fr_300px]">
      <form className="space-y-5 rounded-[28px] border border-[#dce4ee] bg-white p-6 shadow-sm sm:p-8" onSubmit={(event) => event.preventDefault()}>
        <div className="border-b border-slate-100 pb-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-display text-3xl font-black text-[#173b6d]">{HE.client.questionnaire}</h2>
            <span className="text-sm font-bold text-slate-500" aria-live="polite">
              {saveState === 'saving' ? 'שומר…' : saveState === 'saved' ? HE.common.saved : saveState === 'error' ? HE.common.error : ''}
            </span>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100" aria-label={`התקדמות ${progress}%`}>
            <div className="h-full bg-[#ef8c2f] transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div>
          <label htmlFor="selected-route-id" className="mb-2 block text-sm font-black">התבחין שנבדק</label>
          <select id="selected-route-id" value={selectedRoute} onChange={(event) => void save('selected-route-id', event.target.value)} required className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3.5">
            <option value="">בחר תבחין לבדיקה</option>
            {routesData.routes.map((route) => <option key={route.id} value={route.id}>{route.he}</option>)}
          </select>
          <p className="mt-2 text-xs leading-5 text-slate-500">בחירת תבחין כאן אינה קביעה של זכאות; ההתאמה נבדקת לפי המידע והמסמכים.</p>
        </div>

        {universalData.questions.map((question) => {
          const value = answers[question.id]
          return (
            <div key={question.id}>
              <label htmlFor={question.id} className="mb-2 block text-sm font-black">{question.he}</label>
              {question.type === 'boolean' ? (
                <select id={question.id} value={typeof value === 'boolean' ? String(value) : ''} onChange={(event) => void save(question.id, normalizedValue(event.target.value))} required className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3.5">
                  <option value="">בחר תשובה</option>
                  <option value="false">לא</option>
                  <option value="true">כן</option>
                </select>
              ) : (
                <input
                  id={question.id}
                  name={question.id}
                  type={question.type === 'number' ? 'number' : question.type}
                  defaultValue={typeof value === 'string' || typeof value === 'number' ? value : ''}
                  required
                  onBlur={(event) => void save(question.id, question.type === 'number' ? Number(event.target.value) : event.target.value)}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3.5 outline-none focus:border-[#173b6d] focus:ring-4 focus:ring-[#173b6d]/10"
                />
              )}
            </div>
          )
        })}

        {routeBlock?.questions.map((question) => {
          const value = answers[question.id]
          return (
            <div key={question.id} className="rounded-2xl border border-[#f0d2ad] bg-[#fff9f2] p-5">
              <label htmlFor={question.id} className="mb-3 block text-sm font-black leading-6">{question.he}</label>
              <select id={question.id} value={typeof value === 'boolean' ? String(value) : ''} onChange={(event) => void save(question.id, normalizedValue(event.target.value))} required className="w-full rounded-xl border border-[#dfc29e] bg-white px-4 py-3">
                <option value="">בחר תשובה</option>
                <option value="false">לא</option>
                <option value="true">כן</option>
              </select>
            </div>
          )
        })}

        <button type="button" onClick={() => void submit()} className="w-full rounded-2xl bg-[#173b6d] px-6 py-4 font-black text-white hover:bg-[#102c53]">שליחה לבדיקת המשרד</button>
        {submitMessage ? <p className="rounded-2xl bg-[#eef4fb] p-4 text-sm font-bold text-[#173b6d]" role="status">{submitMessage}</p> : null}
      </form>

      <aside className="h-fit rounded-[24px] bg-[#0d2748] p-6 text-white lg:sticky lg:top-24">
        <p className="text-sm font-black text-[#f1a14c]">התקדמות</p>
        <p className="mt-3 font-display text-5xl font-black">{progress}%</p>
        <p className="mt-4 text-sm leading-6 text-slate-300">המידע נשמר אוטומטית וניתן להמשיך מאוחר יותר מאותו חשבון.</p>
      </aside>
    </div>
  )
}
