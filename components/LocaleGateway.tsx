'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import type { Locale } from '@/lib/i18n-config'

type Props = {
  fallbackPath: string
  loadingLabel: string
  path?: string
}

export function LocaleGateway({ fallbackPath, loadingLabel, path = '' }: Props) {
  const router = useRouter()

  useEffect(() => {
    const saved = localStorage.getItem('lgvg.locale') as Locale | null
    router.replace(saved && ['pt', 'en', 'es'].includes(saved) ? `/${saved}${path}` : fallbackPath)
  }, [fallbackPath, path, router])

  return <p className="gateway-status">{loadingLabel}</p>
}
