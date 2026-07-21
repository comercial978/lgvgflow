'use client'

import { Globe2 } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import type { ChangeEvent } from 'react'

import { supportedLocales, type Locale } from '@/lib/i18n-config'

type Props = {
  locale: Locale
  label: string
  names: Record<Locale, string>
  flags: Record<Locale, string>
}

const persistLocale = (locale: Locale) => {
  localStorage.setItem('lgvg.locale', locale)
  document.cookie = `lgvg_locale=${locale}; Max-Age=31536000; Path=/; SameSite=Lax`
}

export function LanguageSwitcher({ locale, label, names, flags }: Props) {
  const pathname = usePathname()
  const router = useRouter()

  const changeLocale = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = event.target.value as Locale
    const parts = pathname.split('/').filter(Boolean)

    if (parts.length && supportedLocales.includes(parts[0] as Locale)) {
      parts[0] = nextLocale
    } else {
      parts.unshift(nextLocale)
    }

    persistLocale(nextLocale)
    router.push(`/${parts.join('/')}`)
  }

  return (
    <label className="language-switcher">
      <Globe2 aria-hidden="true" size={18} />
      <span className="sr-only">{label}</span>
      <select aria-label={label} onChange={changeLocale} value={locale}>
        {supportedLocales.map((option) => (
          <option key={option} value={option}>
            {flags[option]} {names[option]}
          </option>
        ))}
      </select>
    </label>
  )
}
