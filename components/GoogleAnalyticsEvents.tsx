'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

type AnalyticsEvent = 'download_indicador' | 'download_manual' | 'clique_whatsapp'

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag?: (...args: unknown[]) => void
    lgvgLastPageView?: string
  }
}

function ensureGtag() {
  window.dataLayer = window.dataLayer || []
  window.gtag = window.gtag || ((...args: unknown[]) => window.dataLayer.push(args))
}

export function GoogleAnalyticsEvents() {
  const pathname = usePathname()

  useEffect(() => {
    const handleTrackedClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return

      const link = event.target.closest<HTMLAnchorElement>('a[data-ga-event]')
      if (!link) return

      const eventName = link.dataset.gaEvent as AnalyticsEvent | undefined
      if (!eventName) return

      ensureGtag()
      window.gtag?.('event', eventName, {
        file_name: link.dataset.gaFileName || 'not_applicable',
        link_url: link.href,
        page_location: window.location.href,
        page_title: document.title,
      })
    }

    document.addEventListener('click', handleTrackedClick)
    return () => document.removeEventListener('click', handleTrackedClick)
  }, [])

  useEffect(() => {
    const pageLocation = window.location.href
    if (window.lgvgLastPageView === pageLocation) return

    window.lgvgLastPageView = pageLocation
    ensureGtag()
    window.gtag?.('event', 'page_view', {
      page_location: pageLocation,
      page_path: `${window.location.pathname}${window.location.search}`,
      page_title: document.title,
    })
  }, [pathname])

  return null
}
