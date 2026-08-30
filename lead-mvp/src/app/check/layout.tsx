import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { ScreeningProvider } from '@/components/screening/screening-provider'
import { getScreeningConfig } from '@/lib/screening-data'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function CheckLayout({ children }: { children: ReactNode }) {
  return <ScreeningProvider config={getScreeningConfig()}>{children}</ScreeningProvider>
}
