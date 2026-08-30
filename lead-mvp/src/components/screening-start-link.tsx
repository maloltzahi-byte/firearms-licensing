'use client'

import Link from 'next/link'
import { track } from '@vercel/analytics'

export function ScreeningStartLink({ className = 'button-primary' }: { className?: string }) {
  return (
    <Link href="/check" className={className} onClick={() => track('screening_started')}>
      בדקו אם מתקיים תבחין
    </Link>
  )
}
