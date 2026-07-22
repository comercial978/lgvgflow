import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import '@/app/globals.css'
import { GoogleAnalytics } from '@/components/GoogleAnalytics'
import { GoogleAnalyticsEvents } from '@/components/GoogleAnalyticsEvents'

export const metadata: Metadata = {
  robots: { index: false, follow: true },
}

export default function RootGatewayLayout({ children }: { children: ReactNode }) {
  return <html lang="pt-BR"><head><GoogleAnalytics /></head><body>{children}<GoogleAnalyticsEvents /></body></html>
}
