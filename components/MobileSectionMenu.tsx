'use client'

import { ChevronRight, Menu, X } from 'lucide-react'
import { useEffect, useId, useState } from 'react'

import type { Locale } from '@/lib/i18n-config'

type MenuLabels = {
  sections: string
  openSections: string
  closeSections: string
  home: string
  demo: string
  solution: string
  backtest: string
  guides: string
  pricing: string
  downloads: string
  ecosystem: string
  news: string
  developer: string
}

type Props = {
  labels: MenuLabels
  locale: Locale
}

export function MobileSectionMenu({ labels, locale }: Props) {
  const [open, setOpen] = useState(false)
  const menuId = useId()

  useEffect(() => {
    if (!open) return

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [open])

  const sections = [
    { label: labels.home, href: `/${locale}/#home` },
    { label: labels.demo, href: `/${locale}/#demo` },
    { label: labels.solution, href: `/${locale}/#solution` },
    { label: labels.backtest, href: `/${locale}/results/` },
    { label: labels.guides, href: `/${locale}/guides/` },
    { label: labels.pricing, href: `/${locale}/#pricing` },
    { label: labels.downloads, href: `/${locale}/#downloads` },
    { label: labels.ecosystem, href: `/${locale}/#ecosystem` },
    { label: labels.news, href: `/${locale}/#news` },
    { label: labels.developer, href: `/${locale}/#developer` },
  ]

  return (
    <div className="mobile-section-menu">
      <button
        className="mobile-menu-trigger"
        type="button"
        aria-controls={menuId}
        aria-expanded={open}
        aria-label={open ? labels.closeSections : labels.openSections}
        title={open ? labels.closeSections : labels.openSections}
        onClick={() => setOpen((current) => !current)}
      >
        {open ? <X aria-hidden="true" size={20} /> : <Menu aria-hidden="true" size={20} />}
      </button>

      {open ? (
        <>
          <button className="mobile-menu-backdrop" type="button" aria-label={labels.closeSections} onClick={() => setOpen(false)} />
          <nav className="mobile-menu-panel" id={menuId} aria-label={labels.sections}>
            <div className="mobile-menu-heading">
              <span>{labels.sections}</span>
              <button type="button" aria-label={labels.closeSections} title={labels.closeSections} onClick={() => setOpen(false)}>
                <X aria-hidden="true" size={18} />
              </button>
            </div>
            <div className="mobile-menu-links">
              {sections.map((section) => (
                <a href={section.href} key={section.href} onClick={() => setOpen(false)}>
                  <span>{section.label}</span><ChevronRight aria-hidden="true" size={17} />
                </a>
              ))}
            </div>
          </nav>
        </>
      ) : null}
    </div>
  )
}
