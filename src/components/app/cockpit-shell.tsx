import Link from 'next/link'
import { HE } from '@/lib/i18n/he'

const links = [
  ['/cockpit', 'לוח ראשי'],
  ['/cockpit/cases', 'תיקים'],
  ['/cockpit/clients', 'לקוחות'],
  ['/cockpit/documents', 'מסמכים'],
  ['/cockpit/inquiries', 'פניות'],
  ['/cockpit/queue', 'תור עבודה'],
  ['/cockpit/audit', 'ביקורת'],
  ['/cockpit/settings', 'הגדרות'],
] as const

export function CockpitShell({ children, displayName, role }: { children: React.ReactNode; displayName?: string | null; role: string }) {
  return (
    <div className="min-h-screen bg-[#07111f] text-slate-100">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#07111f]/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-5 px-5 py-4">
          <Link href="/cockpit" className="font-display text-xl font-black">{HE.cockpit.title}</Link>
          <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
            <span>{displayName ?? role}</span>
            <form action="/auth/signout" method="post"><button className="rounded-xl border border-white/15 px-3 py-2 text-slate-200">{HE.nav.logout}</button></form>
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-[1500px] lg:grid-cols-[230px_1fr]">
        <aside className="hidden min-h-[calc(100vh-73px)] border-l border-white/10 p-4 lg:block">
          <nav className="space-y-1" aria-label="ניווט קוקפיט">
            {links.map(([href, label]) => <Link key={href} href={href} className="block rounded-xl px-4 py-3 text-sm font-bold text-slate-300 hover:bg-white/8 hover:text-white">{label}</Link>)}
          </nav>
        </aside>
        {children}
      </div>
    </div>
  )
}
