import guideRouteData from '@/data/guide-routes.json'
import type { Locale } from '@/lib/i18n-config'

export const guideIds = ['orderFlow', 'miniIndex', 'profitNelogica'] as const
export type GuideId = (typeof guideIds)[number]

type GuideRouteData = {
  publishedAt: string
  modifiedAt: string
  guides: Record<GuideId, Record<Locale, string>>
}

const routeData = guideRouteData as GuideRouteData

export const guidePublishedAt = routeData.publishedAt
export const guideModifiedAt = routeData.modifiedAt

export const guideSlug = (locale: Locale, guideId: GuideId) =>
  routeData.guides[guideId][locale]

export const guidePath = (locale: Locale, guideId: GuideId) =>
  `/${locale}/guides/${guideSlug(locale, guideId)}/`

export const guideMetadataPath = (locale: Locale, guideId: GuideId) =>
  `guides/${guideSlug(locale, guideId)}`

export const getGuideId = (locale: Locale, slug: string): GuideId | undefined =>
  guideIds.find((guideId) => guideSlug(locale, guideId) === slug)

export const guideLanguagePaths = (guideId: GuideId): Record<Locale, string> => ({
  pt: guideMetadataPath('pt', guideId),
  en: guideMetadataPath('en', guideId),
  es: guideMetadataPath('es', guideId),
})
