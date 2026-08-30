import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Assistant } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { site } from '@/lib/site'
import './globals.css'

const assistant = Assistant({
  subsets: ['hebrew', 'latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: 'רישוי כלי ירייה פרטי | עו״ד צחי מלול', template: '%s | עו״ד צחי מלול' },
  description: site.description,
  openGraph: {
    type: 'website',
    locale: 'he_IL',
    siteName: site.name,
    title: 'רישוי כלי ירייה פרטי | עו״ד צחי מלול',
    description: site.description,
    url: site.url,
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <body className={assistant.className}>
        <a className="skip-link" href="#main">דלגו לתוכן הראשי</a>
        <SiteHeader />
        {children}
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  )
}
