import Link from 'next/link'
import { HE } from '@/lib/i18n/he'

export function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f3f6fa] text-[#121a26]">
      <header className="sticky top-0 z-20 border-b border-[#dbe3ed] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-4">
          <Link href="/app" className="font-display text-xl font-black text-[#12345f]">{HE.brand}</Link>
          <nav className="hidden items-center gap-6 text-sm font-bold text-slate-600 md:flex" aria-label="ניווט אזור אישי">
            <Link href="/app">{HE.nav.clientHome}</Link>
            <Link href="/app/documents">{HE.nav.documents}</Link>
            <Link href="/app/tasks">{HE.nav.tasks}</Link>
            <Link href="/app/messages">{HE.nav.messages}</Link>
          </nav>
          <form action="/auth/signout" method="post">
            <button className="rounded-xl border border-[#d6dee8] px-4 py-2 text-sm font-bold hover:border-[#173b6d]">{HE.nav.logout}</button>
          </form>
        </div>
      </header>
      {children}
    </div>
  )
}
