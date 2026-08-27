import Link from 'next/link'

export function LegalLayout({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro: string; children: React.ReactNode }) {
  return <main className="min-h-screen bg-[#f7f9fb] text-[#07182b]"><header className="bg-[#0b223d] text-white"><div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5"><Link href="/" className="font-display text-xl font-black">עו״ד צחי מלול / RFL</Link><Link href="/contact" className="rounded-xl bg-[#ff6a1a] px-4 py-2 text-sm font-black text-[#07182b]">צור קשר</Link></div></header><div className="mx-auto max-w-4xl px-5 py-12 sm:py-16"><p className="text-xs font-black tracking-[.18em] text-[#0b6f9c]">{eyebrow}</p><h1 className="mt-4 font-display text-4xl font-black leading-tight sm:text-5xl">{title}</h1><p className="mt-6 text-lg leading-8 text-[#526171]">{intro}</p><div className="mt-10 space-y-8">{children}</div><p className="mt-12 border-t pt-6 text-sm text-[#526171]">עדכון אחרון: 27.08.2026</p></div></main>
}

export function LegalSection({ title, children }: { title: string; children: React.ReactNode }) { return <section className="rounded-[24px] border border-[#dce3e9] bg-white p-6 shadow-sm sm:p-8"><h2 className="font-display text-2xl font-black">{title}</h2><div className="mt-4 space-y-3 text-base leading-7 text-[#526171]">{children}</div></section> }
