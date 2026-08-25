'use client'

import { ChevronDown, ChevronRight } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'

import type { Locale } from '@/lib/i18n-config'

type MenuLabels = {
  more: string
  sections: string
  solution: string
  backtest: string
  pricing: string
  downloads: string
  ecosystem: string
  developer: string
}

type Props = {
  labels: MenuLabels
  locale: Locale
}

export function DesktopMoreMenu({ labels, locale }: Props) {
  const [open, setOpen] = useState(false)
  const menuId = useId()
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    const closeOutside = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }

    document.addEventListener('keydown', closeOnEscape)
    document.addEventListener('pointerdown', closeOutside)
    return () => {
      document.removeEventListener('keydown', closeOnEscape)
      document.removeEventListener('pointerdown', closeOutside)
    }
  }, [open])

  const sections = [
    { label: labels.solution, href: `/${locale}/#solution` },
    { label: labels.backtest, href: `/${locale}/#backtest` },
    { label: labels.pricing, href: `/${locale}/#pricing` },
    { label: labels.downloads, href: `/${locale}/#downloads` },
    { label: labels.ecosystem, href: `/${locale}/#ecosystem` },
    { label: labels.developer, href: `/${locale}/#developer` },
  ]

  return (
    <div className="desktop-more-menu" ref={rootRef}>
      <button
        type="button"
        aria-controls={menuId}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        {labels.more}<ChevronDown aria-hidden="true" size={15} />
      </button>
      {open ? (
        <div className="desktop-more-panel" id={menuId} role="menu" aria-label={labels.sections}>
          {sections.map((section) => (
            <a href={section.href} key={section.href} role="menuitem" onClick={() => setOpen(false)}>
              <span>{section.label}</span><ChevronRight aria-hidden="true" size={15} />
            </a>
          ))}
        </div>
      ) : null}
    </div>
  )
}
