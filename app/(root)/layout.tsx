import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import '@/app/globals.css'

export const metadata: Metadata = {
  robots: { index: false, follow: true },
}

export default function RootGatewayLayout({ children }: { children: ReactNode }) {
  return <html lang="pt-BR"><body>{children}</body></html>
}
