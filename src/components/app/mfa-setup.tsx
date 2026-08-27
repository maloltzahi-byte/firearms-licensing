'use client'

import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

type Factor = { id: string; friendly_name?: string; status: string }

export function MfaSetup() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), [])
  const [factors, setFactors] = useState<Factor[]>([])
  const [factorId, setFactorId] = useState('')
  const [qr, setQr] = useState('')
  const [secret, setSecret] = useState('')
  const [code, setCode] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    void supabase.auth.mfa.listFactors().then(({ data }) => {
      setFactors((data?.totp ?? []) as Factor[])
      const verified = data?.totp.find((factor) => factor.status === 'verified')
      if (verified) setFactorId(verified.id)
    })
  }, [supabase])

  async function enroll() {
    setMessage('')
    const { data, error } = await supabase.auth.mfa.enroll({ factorType: 'totp', friendlyName: 'RFL Office' })
    if (error || !data) {
      setMessage('לא ניתן להתחיל רישום אימות דו־שלבי.')
      return
    }
    setFactorId(data.id)
    setQr(data.totp.qr_code)
    setSecret(data.totp.secret)
  }

  async function verify() {
    setMessage('')
    if (!factorId || code.length < 6) return
    const challenge = await supabase.auth.mfa.challenge({ factorId })
    if (challenge.error || !challenge.data) {
      setMessage('לא ניתן ליצור אתגר אימות.')
      return
    }
    const result = await supabase.auth.mfa.verify({ factorId, challengeId: challenge.data.id, code })
    if (result.error) {
      setMessage('קוד האימות אינו תקין.')
      return
    }
    window.location.href = '/cockpit'
  }

  const verified = factors.some((factor) => factor.status === 'verified')

  return <div className="mx-auto max-w-xl rounded-[28px] border border-white/10 bg-white/5 p-6 sm:p-8">
    <h1 className="font-display text-3xl font-black">אימות דו־שלבי</h1>
    <p className="mt-3 text-sm leading-6 text-slate-400">פעולות משפטיות רגישות בקוקפיט מחייבות רמת אימות AAL2.</p>
    {!factorId ? <button onClick={() => void enroll()} className="mt-6 rounded-xl bg-[#ef8c2f] px-5 py-3 font-black text-[#111827]">הגדרת אפליקציית אימות</button> : null}
    {qr ? <div className="mt-6 rounded-2xl bg-white p-5 text-slate-900"><Image src={qr} alt="קוד QR להגדרת אימות דו־שלבי" width={220} height={220} unoptimized className="mx-auto"/><p className="mt-4 break-all text-center text-xs">{secret}</p></div> : null}
    {factorId ? <div className="mt-6"><label htmlFor="mfa-code" className="mb-2 block text-sm font-bold">קוד בן 6 ספרות</label><div className="flex gap-2"><input id="mfa-code" inputMode="numeric" autoComplete="one-time-code" value={code} onChange={(event)=>setCode(event.target.value.replace(/\D/g,'').slice(0,6))} className="min-w-0 flex-1 rounded-xl border border-white/15 bg-[#07111f] px-4 py-3"/><button onClick={() => void verify()} className="rounded-xl bg-[#ef8c2f] px-5 font-black text-[#111827]">{verified?'אימות':'רישום ואימות'}</button></div></div> : null}
    {message ? <p role="status" className="mt-4 rounded-xl bg-red-950/40 p-3 text-sm text-red-200">{message}</p> : null}
  </div>
}
