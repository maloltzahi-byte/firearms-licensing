import { notFound } from 'next/navigation'
import { CanonicalFrame } from '@/components/canonical-frame'
import { PUBLIC_SCREEN_BY_SLUG, canonicalPublicSrc } from '@/lib/canonical'

type Props = { params: Promise<{ slug: string }> }

export default async function PublicCanonicalPage({ params }: Props) {
  const { slug } = await params
  if (!(slug in PUBLIC_SCREEN_BY_SLUG)) notFound()
  return <CanonicalFrame src={canonicalPublicSrc(slug)} title={`RFL — ${slug}`} />
}
