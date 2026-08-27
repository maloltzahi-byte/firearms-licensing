import Link from 'next/link'
import { HE } from '@/lib/i18n/he'
import { login, requestPasswordReset, signup } from './actions'

type Props = { searchParams: Promise<{ error?: string; notice?: string; next?: string }> }

export default async function LoginPage({ searchParams }: Props) {
  const { error, notice, next } = await searchParams
  const message =
    error === 'required'
      ? HE.auth.required
      : error
        ? HE.auth.invalid
        : notice === 'verify'
          ? HE.auth.verify
          : notice === 'reset'
            ? HE.auth.resetSent
            : null

  return (
    <main className="min-h-screen bg-[#07111f] px-5 py-10 text-white">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl overflow-hidden rounded-[32px] border border-white/10 bg-[#0b1728] shadow-2xl lg:grid-cols-[1.05fr_.95fr]">
        <section className="relative hidden overflow-hidden p-12 lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(240,145,45,.23),transparent_36%),linear-gradient(145deg,#0f2340,#07111f)]" />
          <div className="relative">
            <p className="text-sm font-bold tracking-[0.18em] text-[#f08f2d]">{HE.brand}</p>
            <h1 className="mt-8 max-w-xl font-display text-5xl font-black leading-tight">
              {HE.auth.title}
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-8 text-slate-300">{HE.auth.subtitle}</p>
          </div>
          <p className="relative text-sm text-slate-400">RTL · Supabase Auth · RLS · Audit</p>
        </section>

        <section className="flex items-center bg-white p-6 text-[#111827] sm:p-10 lg:p-14">
          <div className="mx-auto w-full max-w-md">
            <Link href="/" className="text-sm font-bold text-[#173b6d]">← {HE.common.back}</Link>
            <p className="mt-10 text-xs font-black uppercase tracking-[0.2em] text-[#b45309]">{HE.auth.eyebrow}</p>
            <h2 className="mt-3 font-display text-4xl font-black">{next?.startsWith('/cockpit') ? HE.auth.officeTitle : HE.auth.title}</h2>

            {message ? (
              <div className="mt-6 rounded-2xl border border-[#efc48f] bg-[#fff8ef] p-4 text-sm font-medium text-[#7a3d08]" role="status">
                {message}
              </div>
            ) : null}

            <form className="mt-8 space-y-5">
              <input type="hidden" name="next" value={next ?? '/app'} />
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-bold">{HE.auth.email}</label>
                <input id="email" name="email" type="email" autoComplete="email" required className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3.5 outline-none transition focus:border-[#173b6d] focus:ring-4 focus:ring-[#173b6d]/10" />
              </div>
              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-bold">{HE.auth.password}</label>
                <input id="password" name="password" type="password" minLength={8} autoComplete="current-password" required className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3.5 outline-none transition focus:border-[#173b6d] focus:ring-4 focus:ring-[#173b6d]/10" />
              </div>
              <button formAction={login} className="w-full rounded-2xl bg-[#173b6d] px-5 py-4 text-base font-black text-white shadow-lg shadow-[#173b6d]/20 transition hover:bg-[#102c53] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#173b6d]">
                {HE.auth.login}
              </button>
              <button formAction={signup} className="w-full rounded-2xl border border-[#173b6d]/20 bg-[#f4f7fb] px-5 py-3.5 font-bold text-[#173b6d] hover:bg-[#eaf0f8]">
                {HE.auth.signup}
              </button>
              <button formAction={requestPasswordReset} formNoValidate className="w-full py-2 text-sm font-bold text-slate-600 underline-offset-4 hover:text-[#173b6d] hover:underline">
                {HE.auth.forgot}
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  )
}