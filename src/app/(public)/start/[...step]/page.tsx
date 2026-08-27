import { notFound } from 'next/navigation'
import { CanonicalFrame } from '@/components/canonical-frame'
import { GUIDED_SCREEN_BY_ROUTE, canonicalGuidedSrc } from '@/lib/canonical'

type Props = { params: Promise<{ step: string[] }> }

export default async function GuidedCanonicalPage({ params }: Props) {
  const { step } = await params
  const route = step.join('/')
  const index = GUIDED_SCREEN_BY_ROUTE[route as keyof typeof GUIDED_SCREEN_BY_ROUTE]
  if (index === undefined) notFound()
  return <CanonicalFrame src={canonicalGuidedSrc(index)} title={`RFL — ${route}`} />
}
