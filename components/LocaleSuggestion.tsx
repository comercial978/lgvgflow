'use client'

import { Languages, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import type { Locale } from '@/lib/i18n-config'

type Props = {
  names: Record<Locale, string>
  detectedTemplate: string
  question: string
  yes: string
  continueLabel: string
  never: string
}

const detectLocale = (): Locale => {
  for (const language of navigator.languages) {
    const normalized = language.toLowerCase()
    if (normalized.startsWith('pt')) return 'pt'
    if (normalized.startsWith('es')) return 'es'
    if (normalized.startsWith('en')) return 'en'
  }
  return 'en'
}

const saveLocale = (locale: Locale) => {
  localStorage.setItem('lgvg.locale', locale)
  document.cookie = `lgvg_locale=${locale}; Max-Age=31536000; Path=/; SameSite=Lax`
}

export function LocaleSuggestion({ names, detectedTemplate, question, yes, continueLabel, never }: Props) {
  const router = useRouter()
  const [detected, setDetected] = useState<Locale | null>(null)

  useEffect(() => {
    if (localStorage.getItem('lgvg.locale') || localStorage.getItem('lgvg.localePrompt') === 'never') return
    const browserLocale = detectLocale()
    if (browserLocale !== 'pt') setDetected(browserLocale)
  }, [])

  if (!detected) return null

  const accept = () => {
    saveLocale(detected)
    router.push(`/${detected}`)
  }

  const continueInPortuguese = () => {
    saveLocale('pt')
    setDetected(null)
  }

  const neverAsk = () => {
    localStorage.setItem('lgvg.localePrompt', 'never')
    setDetected(null)
  }

  return (
    <aside className="locale-suggestion" aria-live="polite">
      <Languages aria-hidden="true" size={22} />
      <div>
        <strong>{detectedTemplate.replace('{language}', names[detected])}</strong>
        <p>{question}</p>
        <div className="locale-suggestion-actions">
          <button className="button button-small button-primary" onClick={accept} type="button">{yes}</button>
          <button className="button button-small button-secondary" onClick={continueInPortuguese} type="button">{continueLabel}</button>
          <button className="text-button" onClick={neverAsk} type="button">{never}</button>
        </div>
      </div>
      <button className="icon-button" aria-label={never} onClick={() => setDetected(null)} title={never} type="button">
        <X aria-hidden="true" size={18} />
      </button>
    </aside>
  )
}
