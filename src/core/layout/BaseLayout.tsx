import { IBM_Plex_Sans_Thai } from 'next/font/google'
import FlyonuiScript from '@/core/flyonui/FlyonuiScript'
import type { ReactNode } from 'react'

const ibmPlexSansThai = IBM_Plex_Sans_Thai({
  variable: '--font-ibm-plex-thai',
  subsets: ['thai', 'latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700'],
})

interface BaseLayoutProps {
  lang: string
  children: ReactNode
}

// The <html>/<body> both root layouts build on (consumer app/[locale], admin app/admin):
// font, base classes and the FlyonUI JS that re-inits its components on every route change
export function BaseLayout({ lang, children }: BaseLayoutProps) {
  return (
    <html lang={lang} className={`${ibmPlexSansThai.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <FlyonuiScript />
        {children}
      </body>
    </html>
  )
}
