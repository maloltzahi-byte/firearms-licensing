import { CanonicalFrame } from '@/components/canonical-frame'
import { canonicalPublicSrc } from '@/lib/canonical'

export default function HomePage() {
  return <CanonicalFrame src={canonicalPublicSrc()} title="RFL — מסך הבית" />
}
