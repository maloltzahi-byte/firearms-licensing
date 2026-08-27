import { HE } from '@/lib/i18n/he'
import { updatePassword } from './actions'

type Props = { searchParams: Promise<{ error?: string }> }

export default async function UpdatePasswordPage({ searchParams }: Props) {
  const { error } = await searchParams
  return (
    <main className="grid min-h-screen place-items-center bg-[#07111f] p-5 text-white">
      <form className="w-full max-w-md rounded-[28px] bg-white p-8 text-slate-900 shadow-2xl">
        <h1 className="font-display text-3xl font-black">{HE.auth.resetTitle}</h1>
        {error ? <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{HE.common.error}</p> : null}
        <label htmlFor="password" className="mb-2 mt-7 block text-sm font-bold">{HE.auth.newPassword}</label>
        <input id="password" name="password" type="password" minLength={10} required autoComplete="new-password" className="w-full rounded-2xl border border-slate-300 px-4 py-3.5" />
        <button formAction={updatePassword} className="mt-5 w-full rounded-2xl bg-[#173b6d] px-5 py-4 font-black text-white">{HE.auth.updatePassword}</button>
      </form>
    </main>
  )
}
