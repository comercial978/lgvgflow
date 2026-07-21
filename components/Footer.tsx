import { Camera } from 'lucide-react'

import type { Dictionary, Locale } from '@/lib/i18n'
import { siteConfig } from '@/lib/site'

type Props = {
  locale: Locale
  dictionary: Dictionary
}

export function Footer({ locale, dictionary }: Props) {
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div className="footer-brand-block">
          <a className="brand" href={`/${locale}/`} aria-label="LGVG Flow">
            <span className="brand-mark" aria-hidden="true">L</span>
            <span>LGVG <strong>Flow</strong></span>
          </a>
          <p>{dictionary.footer.tagline}</p>
        </div>
        <div className="footer-social">
          <p>{dictionary.footer.socialTitle}</p>
          <a href={siteConfig.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label={dictionary.footer.instagram}>
            <Camera aria-hidden="true" size={18} />
            <span>{siteConfig.instagramHandle}</span>
          </a>
        </div>
        <nav className="footer-links" aria-label={dictionary.nav.menu}>
          <a href={`/${locale}/manual/`}>{dictionary.footer.manual}</a>
          <a href={`/${locale}/privacy/`}>{dictionary.footer.privacy}</a>
          <a href={`/${locale}/terms/`}>{dictionary.footer.terms}</a>
          <a href={`/${locale}/contact/`}>{dictionary.footer.contact}</a>
        </nav>
      </div>
      <div className="container footer-bottom">
        <p>© {new Date().getFullYear()} {siteConfig.company}. {dictionary.footer.rights}.</p>
      </div>
    </footer>
  )
}
