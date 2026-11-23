'use client'

import { CheckCircle2, LoaderCircle, PhoneCall, ShieldCheck, X } from 'lucide-react'
import { type FormEvent, useEffect, useId, useRef, useState } from 'react'

import type { Locale } from '@/lib/i18n-config'
import { siteConfig, whatsappUrl } from '@/lib/site'

type LeadCallbackCopy = {
  body: string
  close: string
  consent: string
  error: string
  helper: string
  kicker: string
  nameLabel: string
  namePlaceholder: string
  phoneLabel: string
  phonePlaceholder: string
  privacy: string
  sending: string
  submit: string
  successText: string
  successTitle: string
  title: string
  trigger: string
  trust: string
  whatsapp: string
}

type Props = {
  copy: LeadCallbackCopy
  locale: Locale
}

type SubmitStatus = 'idle' | 'sending' | 'success' | 'error'

const dismissStorageKey = 'lgvg_callback_dismissed_until'
const successStorageKey = 'lgvg_callback_submitted_until'
const dayInMilliseconds = 24 * 60 * 60 * 1000

const readStorageDate = (key: string) => {
  try {
    return Number(window.localStorage.getItem(key) || 0)
  } catch {
    return 0
  }
}

const writeStorageDate = (key: string, value: number) => {
  try {
    window.localStorage.setItem(key, String(value))
  } catch {
    // Storage can be unavailable in private browsing; the form still works.
  }
}

const track = (eventName: string, parameters: Record<string, string> = {}) => {
  window.gtag?.('event', eventName, {
    ...parameters,
    page_location: window.location.href,
    page_title: document.title,
  })
}

export function LeadCallbackWidget({ copy, locale }: Props) {
  const titleId = useId()
  const panelId = useId()
  const [isReady, setIsReady] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const [status, setStatus] = useState<SubmitStatus>('idle')
  const autoOpenCancelled = useRef(false)
  const trackedOpen = useRef(false)
  const formStartedAt = useRef(Date.now())

  useEffect(() => {
    setIsReady(true)

    if (readStorageDate(successStorageKey) > Date.now()) {
      setIsHidden(true)
      return
    }

    if (readStorageDate(dismissStorageKey) > Date.now()) return

    const showPanel = () => {
      if (!autoOpenCancelled.current) setIsOpen(true)
    }
    const timer = window.setTimeout(showPanel, 12000)
    const handleScroll = () => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight
      if (scrollableHeight > 0 && window.scrollY / scrollableHeight >= 0.24) showPanel()
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    if (!isOpen || trackedOpen.current) return
    trackedOpen.current = true
    track('lead_callback_open', { content_language: locale })
  }, [isOpen, locale])

  useEffect(() => {
    if (!isOpen) return
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closePanel()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  })

  const closePanel = () => {
    autoOpenCancelled.current = true
    setIsOpen(false)
    writeStorageDate(dismissStorageKey, Date.now() + 3 * dayInMilliseconds)
    track('lead_callback_close', { content_language: locale })
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    if (!form.reportValidity()) return

    const formData = new FormData(form)
    if (String(formData.get('botcheck') || '')) {
      setStatus('success')
      return
    }

    setStatus('sending')
    formData.set('access_key', siteConfig.leadFormAccessKey)
    formData.set('subject', 'Novo pedido de ligação - LGVG Flow')
    formData.set('from_name', 'LGVG Flow - Site')
    formData.set('Solicitação', 'Pedido de ligação pelo site LGVG Flow')
    formData.set('Início do preenchimento', String(formStartedAt.current))
    formData.set('Página de origem', window.location.href)
    formData.set('Título da página', document.title)
    formData.set('Idioma', locale)
    formData.set('Data e hora', new Intl.DateTimeFormat(locale, {
      dateStyle: 'full',
      timeStyle: 'long',
    }).format(new Date()))

    track('lead_callback_submit', { content_language: locale })

    try {
      const response = await fetch(siteConfig.leadFormEndpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData,
      })
      const result = await response.json().catch(() => null) as { success?: boolean } | null
      if (!response.ok || result?.success !== true) {
        throw new Error('Lead submission failed')
      }

      setStatus('success')
      writeStorageDate(successStorageKey, Date.now() + 30 * dayInMilliseconds)
      track('lead_callback_success', { content_language: locale })
      window.setTimeout(() => setIsHidden(true), 8000)
    } catch {
      setStatus('error')
      track('lead_callback_error', { content_language: locale })
    }
  }

  if (!isReady || isHidden) return null

  return (
    <aside className={`lead-callback${isOpen ? ' is-open' : ''}`} aria-label={copy.title}>
      {!isOpen ? (
        <button
          className="lead-callback-trigger"
          type="button"
          aria-expanded="false"
          aria-controls={panelId}
          onClick={() => setIsOpen(true)}
        >
          <PhoneCall aria-hidden="true" size={19} />
          <span>{copy.trigger}</span>
        </button>
      ) : (
        <div id={panelId} className="lead-callback-panel" role="dialog" aria-modal="false" aria-labelledby={titleId}>
          <button className="lead-callback-close" type="button" onClick={closePanel} aria-label={copy.close} title={copy.close}>
            <X aria-hidden="true" size={18} />
          </button>

          {status === 'success' ? (
            <div className="lead-callback-feedback" role="status">
              <CheckCircle2 aria-hidden="true" size={34} />
              <h2 id={titleId}>{copy.successTitle}</h2>
              <p>{copy.successText}</p>
            </div>
          ) : (
            <>
              <div className="lead-callback-heading">
                <span className="lead-callback-icon"><PhoneCall aria-hidden="true" size={21} /></span>
                <div>
                  <p>{copy.kicker}</p>
                  <h2 id={titleId}>{copy.title}</h2>
                </div>
              </div>
              <p className="lead-callback-copy">{copy.body}</p>

              <form action={siteConfig.leadFormEndpoint} method="POST" onSubmit={handleSubmit}>
                <div className="lead-callback-field">
                  <label htmlFor="callback-name">{copy.nameLabel}</label>
                  <input id="callback-name" name="Nome" type="text" autoComplete="name" placeholder={copy.namePlaceholder} minLength={2} maxLength={80} required />
                </div>
                <div className="lead-callback-field">
                  <label htmlFor="callback-phone">{copy.phoneLabel}</label>
                  <input
                    id="callback-phone"
                    name="Telefone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder={copy.phonePlaceholder}
                    pattern="[0-9+() .-]{8,22}"
                    maxLength={22}
                    required
                  />
                  <small>{copy.helper}</small>
                </div>
                <input className="lead-callback-honey" type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden="true" />
                <label className="lead-callback-consent">
                  <input name="Consentimento" type="checkbox" value="Autorizado" required />
                  <span>{copy.consent} <a href={`/${locale}/privacy/`}>{copy.privacy}</a>.</span>
                </label>
                <button className="button button-primary lead-callback-submit" type="submit" disabled={status === 'sending'}>
                  {status === 'sending' ? <LoaderCircle className="lead-callback-spinner" aria-hidden="true" size={18} /> : <PhoneCall aria-hidden="true" size={18} />}
                  {status === 'sending' ? copy.sending : copy.submit}
                </button>
                {status === 'error' ? (
                  <p className="lead-callback-error" role="alert">
                    {copy.error} <a href={whatsappUrl(copy.body)} target="_blank" rel="noopener noreferrer">{copy.whatsapp}</a>
                  </p>
                ) : null}
              </form>
              <p className="lead-callback-trust"><ShieldCheck aria-hidden="true" size={15} />{copy.trust}</p>
            </>
          )}
        </div>
      )}
    </aside>
  )
}
