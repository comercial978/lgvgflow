import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { AcademyGuideGrid } from '@/components/AcademyGuideGrid'
import { InteriorLayout } from '@/components/InteriorLayout'
import { StructuredData } from '@/components/StructuredData'
import {
  academyGuideIds,
  guideCategory,
  guideIdsForLocale,
  guideImage,
  guidePath,
  guidesModifiedAt,
  type GuideId,
} from '@/lib/guides'
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
  const availableGuideIds = guideIdsForLocale(locale)
  const academyIds = new Set<GuideId>(academyGuideIds)
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
      dateModified: guidesModifiedAt,
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: availableGuideIds.map((guideId, index) => ({
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
        <AcademyGuideGrid
          searchLabel={dictionary.guides.searchLabel}
          searchPlaceholder={dictionary.guides.searchPlaceholder}
          noResults={dictionary.guides.noResults}
          featuredLabel={dictionary.guides.featuredLabel}
          categories={[
            { id: 'orderFlow', label: dictionary.guides.categories.orderFlow },
            { id: 'futures', label: dictionary.guides.categories.futures },
            { id: 'platform', label: dictionary.guides.categories.platform },
          ]}
          cards={availableGuideIds.map((guideId) => {
            const guide = dictionary.guides.items[guideId]
            return {
              category: guideCategory[guideId],
              description: guide.cardText,
              featured: academyIds.has(guideId),
              href: guidePath(locale, guideId),
              image: guideImage[guideId],
              imageAlt: `${dictionary.guides.imageAltPrefix}: ${guide.cardTitle}`,
              readLabel: dictionary.guides.read,
              title: guide.cardTitle,
            }
          })}
        />
      </InteriorLayout>
    </>
  )
}
