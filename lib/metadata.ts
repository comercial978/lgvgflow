import type { Metadata } from 'next'

import { languageAlternates, localeConfig, type Dictionary, type Locale } from '@/lib/i18n'
import { siteConfig } from '@/lib/site'

type MetadataInput = {
  locale: Locale
  dictionary: Dictionary
  path?: string
  title?: string
  description?: string
}

export function buildMetadata({ locale, dictionary, path = '', title, description }: MetadataInput): Metadata {
  const canonicalPath = `/${locale}${path ? `/${path}` : ''}`
  const pageTitle = title ?? dictionary.meta.title
  const pageDescription = description ?? dictionary.meta.description

  return {
    metadataBase: new URL(siteConfig.url),
    title: pageTitle,
    description: pageDescription,
    keywords: dictionary.meta.keywords,
    authors: [{ name: 'Gustavo Guimarães' }],
    icons: { icon: '/assets/favicon.svg', shortcut: '/assets/favicon.svg' },
    alternates: {
      canonical: canonicalPath,
      languages: languageAlternates(path),
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
