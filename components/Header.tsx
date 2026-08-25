import { ArrowUpRight } from 'lucide-react'

import { DesktopMoreMenu } from '@/components/DesktopMoreMenu'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { MobileSectionMenu } from '@/components/MobileSectionMenu'
import { localeConfig, supportedLocales, type Dictionary, type Locale } from '@/lib/i18n'

type Props = {
  locale: Locale
  dictionary: Dictionary
}

export function Header({ locale, dictionary }: Props) {
  const flags = Object.fromEntries(
    supportedLocales.map((item) => [item, localeConfig[item].flag]),
  ) as Record<Locale, string>

  return (
    <header className="site-header">
      <div className="container header-inner">
        <a className="brand" href={`/${locale}/`} aria-label="LGVG Flow">
          <span className="brand-mark" aria-hidden="true">L</span>
          <span>LGVG <strong>Flow</strong></span>
        </a>
        <nav className="main-nav" aria-label={dictionary.nav.menu}>
          <a href={`/${locale}/guides/`}>{dictionary.nav.guides}</a>
          <a href={`/${locale}/#news`}>{dictionary.nav.news}</a>
          <a href={`/${locale}/#downloads`}>{dictionary.nav.test}</a>
          <DesktopMoreMenu locale={locale} labels={dictionary.nav} />
        </nav>
        <div className="header-actions">
          <LanguageSwitcher
            locale={locale}
            label={dictionary.language.selector}
            names={dictionary.language.names}
            flags={flags}
          />
          <MobileSectionMenu locale={locale} labels={dictionary.nav} />
          <a className="button button-small button-primary header-cta" href={`/${locale}/#final-cta`}>
            {dictionary.nav.access}<ArrowUpRight aria-hidden="true" size={16} />
          </a>
        </div>
      </div>
    </header>
  )
}
