import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Assistant } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { site } from '@/lib/site'
import './globals.css'
import './conversion.css'
import './figma-final.css'
import './approved-figma.css'
import './launch-final.css'
import './lead-flow-final.css'
import './figma-sync-2026-09-01.css'
import './rc-figma-1to1.css'

const assistant = Assistant({
  subsets: ['hebrew', 'latin'],
  weight: ['300', '400', '600', '700', '800'],
  display: 'swap',
  variable: '--font-assistant',
})

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: 'הוצאת רישיון נשק פרטי | בליווי משרד עורכי דין צחי מלול', template: '%s | רישיון נשק פרטי' },
  description: site.description,
  openGraph: {
    type: 'website',
    locale: 'he_IL',
    siteName: site.name,
    title: 'הוצאת רישיון נשק פרטי | בליווי משרד עורכי דין צחי מלול',
    description: site.description,
    url: site.url,
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="he" dir="rtl"><body className={assistant.className}><a className="skip-link" href="#main">דלגו לתוכן הראשי</a>{children}<Analytics /></body></html>
}
