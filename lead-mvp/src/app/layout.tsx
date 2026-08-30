import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Noto_Sans_Hebrew } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { site } from '@/lib/site'
import './globals.css'

const noto = Noto_Sans_Hebrew({
  subsets: ['hebrew', 'latin'],
  display: 'swap',
  variable: '--font-noto-hebrew',
})

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: 'הוצאת רישיון נשק פרטי | בליווי עו״ד צחי מלול', template: '%s | רישיון נשק פרטי' },
  description: site.description,
  openGraph: {
    type: 'website',
    locale: 'he_IL',
    siteName: site.name,
    title: 'הוצאת רישיון נשק פרטי | בליווי עו״ד צחי מלול',
    description: site.description,
    url: site.url,
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <body className={noto.className}>
        <a className="skip-link" href="#main">דלגו לתוכן הראשי</a>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
