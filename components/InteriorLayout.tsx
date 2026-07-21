import { ArrowLeft } from 'lucide-react'
import type { ReactNode } from 'react'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import type { Dictionary, Locale } from '@/lib/i18n'

type Props = {
  children: ReactNode
  dictionary: Dictionary
  eyebrow?: string
  intro?: string
  locale: Locale
  title: string
}

export function InteriorLayout({ children, dictionary, eyebrow, intro, locale, title }: Props) {
  return (
    <>
      <Header locale={locale} dictionary={dictionary} />
      <main className="interior-main">
        <div className="container">
          <a className="back-link" href={`/${locale}/`}><ArrowLeft aria-hidden="true" size={16} />{dictionary.manual.back}</a>
          <header className="interior-header">
            {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
            <h1>{title}</h1>
            {intro ? <p>{intro}</p> : null}
          </header>
          {children}
        </div>
      </main>
      <Footer locale={locale} dictionary={dictionary} />
    </>
  )
}
