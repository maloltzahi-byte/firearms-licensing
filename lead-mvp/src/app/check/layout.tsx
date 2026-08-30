import type { ReactNode } from 'react'
import { ScreeningProvider } from '@/components/screening/screening-provider'
import { getScreeningConfig } from '@/lib/screening-data'

export default function CheckLayout({ children }: { children: ReactNode }) {
  return <ScreeningProvider config={getScreeningConfig()}>{children}</ScreeningProvider>
}
