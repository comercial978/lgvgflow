import type { Metadata } from 'next'

import { languageAlternates, localeConfig, type Dictionary, type Locale } from '@/lib/i18n'
import { siteConfig } from '@/lib/site'

type MetadataInput = {
  locale: Locale
  dictionary: Dictionary
  path?: string
  title?: string
  description?: string
  languagePaths?: Partial<Record<Locale, string>>
}

export function buildMetadata({ locale, dictionary, path = '', title, description, languagePaths }: MetadataInput): Metadata {
  const canonicalPath = `/${locale}${path ? `/${path}` : ''}/`
  const pageTitle = title ?? dictionary.meta.title
  const pageDescription = description ?? dictionary.meta.description
  const languages = languagePaths
    ? Object.fromEntries([
        ...(languagePaths.pt ? [['pt-BR', `/pt/${languagePaths.pt}/`]] : []),
        ...(languagePaths.en ? [['en', `/en/${languagePaths.en}/`], ['x-default', `/en/${languagePaths.en}/`]] : []),
        ...(languagePaths.es ? [['es', `/es/${languagePaths.es}/`]] : []),
      ])
    : languageAlternates(path)

  return {
    metadataBase: new URL(siteConfig.url),
    title: pageTitle,
    description: pageDescription,
    keywords: dictionary.meta.keywords,
    authors: [{ name: 'Gustavo Guimarães' }],
    icons: { icon: '/assets/favicon.svg', shortcut: '/assets/favicon.svg' },
    alternates: {
      canonical: canonicalPath,
      languages,
    },
    openGraph: {
      type: 'website',
      siteName: siteConfig.name,
      title: pageTitle,
      description: pageDescription,
      url: canonicalPath,
      locale: localeConfig[locale].ogLocale,
      images: [{ url: '/assets/video/lgvg-flow-demo.webp', width: 405, height: 720, alt: dictionary.video.imageAlt }],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: ['/assets/video/lgvg-flow-demo.webp'],
    },
    robots: { index: true, follow: true },
  }
}
