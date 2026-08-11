import type { Metadata } from 'next'
import { ArrowRight, BookOpen } from 'lucide-react'
import { notFound } from 'next/navigation'

import { InteriorLayout } from '@/components/InteriorLayout'
import { StructuredData } from '@/components/StructuredData'
import { guideIds, guideModifiedAt, guidePath } from '@/lib/guides'
import { getDictionary, isLocale, localeConfig } from '@/lib/i18n'
import { buildMetadata } from '@/lib/metadata'
import { breadcrumbSchema } from '@/lib/schema'
import { siteConfig } from '@/lib/site'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const dictionary = await getDictionary(locale)
  return buildMetadata({
    locale,
    dictionary,
    path: 'guides',
    title: dictionary.guides.metaTitle,
    description: dictionary.guides.metaDescription,
  })
}

export default async function GuidesPage({ params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const dictionary = await getDictionary(locale)
  const pageUrl = `${siteConfig.url}/${locale}/guides/`
  const schemas = [
    breadcrumbSchema(locale, [
      { name: siteConfig.name, path: '' },
      { name: dictionary.guides.indexTitle, path: 'guides' },
    ]),
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: dictionary.guides.indexTitle,
      description: dictionary.guides.indexIntro,
      url: pageUrl,
      inLanguage: localeConfig[locale].htmlLang,
      dateModified: guideModifiedAt,
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: guideIds.map((guideId, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: dictionary.guides.items[guideId].cardTitle,
          url: `${siteConfig.url}${guidePath(locale, guideId)}`,
        })),
      },
    },
  ]

  return (
    <>
      <StructuredData data={schemas} />
      <InteriorLayout
        dictionary={dictionary}
        locale={locale}
        eyebrow={dictionary.guides.label}
        title={dictionary.guides.indexTitle}
        intro={dictionary.guides.indexIntro}
      >
        <div className="guide-card-grid">
          {guideIds.map((guideId) => {
            const guide = dictionary.guides.items[guideId]
            return (
              <article className="guide-card" key={guideId}>
                <BookOpen aria-hidden="true" size={24} />
                <h2>{guide.cardTitle}</h2>
                <p>{guide.cardText}</p>
                <a className="text-link" href={guidePath(locale, guideId)}>
                  {dictionary.guides.read}<ArrowRight aria-hidden="true" size={15} />
                </a>
              </article>
            )
          })}
        </div>
      </InteriorLayout>
    </>
  )
}
