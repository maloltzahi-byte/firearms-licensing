import { notFound } from 'next/navigation'
import { CanonicalFrame } from '@/components/canonical-frame'
import { OFFICE_SCREEN_BY_PATH, canonicalOfficeSrc } from '@/lib/canonical'
import { requireStaff } from '@/lib/auth/guards'

type Props={params:Promise<{section:string}>}
export default async function CockpitCanonicalSection({params}:Props){await requireStaff();const {section}=await params;const screen=OFFICE_SCREEN_BY_PATH[section as keyof typeof OFFICE_SCREEN_BY_PATH];if(screen===undefined)notFound();return <main className="min-h-[calc(100vh-73px)] bg-[#07111f]"><CanonicalFrame src={canonicalOfficeSrc(screen)} title={`RFL Office — ${section}`}/></main>}
