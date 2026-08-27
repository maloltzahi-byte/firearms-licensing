import { notFound } from 'next/navigation'
import { CanonicalFrame } from '@/components/canonical-frame'
import { canonicalResponsiveSrc } from '@/lib/canonical'

type Props = { params: Promise<{ surface: string; screen: string }> }

export default async function ResponsivePreviewPage({ params }: Props) {
  const { surface, screen } = await params
  const mobile = surface === 'mobile' && /^\d{2}$/.test(screen) && Number(screen) >= 75 && Number(screen) <= 93
  const tablet = surface === 'tablet' && /^T0[1-5]$/.test(screen)
  if (!mobile && !tablet) notFound()
  return <CanonicalFrame src={canonicalResponsiveSrc(screen)} title={`RFL — ${surface} ${screen}`} />
}
