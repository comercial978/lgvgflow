import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { InteriorLayout } from '@/components/InteriorLayout'
import { NewsGrid } from '@/components/NewsGrid'
import { StructuredData } from '@/components/StructuredData'
import { getDictionary, isLocale, localeConfig } from '@/lib/i18n'
import { buildMetadata } from '@/lib/metadata'
import { formatNewsDate, marketNews } from '@/lib/news'
import { breadcrumbSchema } from '@/lib/schema'
import { siteConfig } from '@/lib/site'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const dictionary = await getDictionary(locale)
  return buildMetadata({ locale, dictionary, path: 'news', title: `${dictionary.news.pageTitle} | LGVG Flow`, description: dictionary.news.pageIntro })
}

export default async function NewsPage({ params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const dictionary = await getDictionary(locale)
  const schemas = [
    breadcrumbSchema(locale, [{ name: siteConfig.name, path: '' }, { name: dictionary.news.pageTitle, path: 'news' }]),
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: dictionary.news.pageTitle,
      description: dictionary.news.pageIntro,
      url: `${siteConfig.url}/${locale}/news/`,
      inLanguage: localeConfig[locale].htmlLang,
    },
  ]

  return (
    <>
      <StructuredData data={schemas} />
      <InteriorLayout dictionary={dictionary} locale={locale} eyebrow={dictionary.news.label} title={dictionary.news.pageTitle} intro={dictionary.news.pageIntro}>
        <p className="news-page-updated">{dictionary.news.updated} {formatNewsDate(marketNews.updatedAt, locale)}</p>
        {locale !== 'pt' ? <p className="source-language-note">{dictionary.news.sourceLanguage}</p> : null}
        <NewsGrid dictionary={dictionary} items={marketNews.items} locale={locale} />
        <p className="legal-notice">{dictionary.news.notice}</p>
      </InteriorLayout>
    </>
  )
}
