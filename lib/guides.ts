import guideRouteData from '@/data/guide-routes.json'
import type { Locale } from '@/lib/i18n-config'

export const guideIds = [
  'aggressionBalance',
  'volumeProfile',
  'volumeAtPrice',
  'orderFlow',
  'miniIndex',
  'miniDollar',
  'profitNelogica',
] as const
export type GuideId = (typeof guideIds)[number]

export const academyGuideIds = ['aggressionBalance', 'volumeProfile', 'volumeAtPrice'] as const
export type GuideCategory = 'orderFlow' | 'futures' | 'platform'

export const guideCategory: Record<GuideId, GuideCategory> = {
  aggressionBalance: 'orderFlow',
  volumeProfile: 'orderFlow',
  volumeAtPrice: 'orderFlow',
  orderFlow: 'orderFlow',
  miniIndex: 'futures',
  miniDollar: 'futures',
  profitNelogica: 'platform',
}

export const guideImage: Record<GuideId, string> = {
  aggressionBalance: '/assets/academy/saldo-agressao.svg',
  volumeProfile: '/assets/academy/volume-profile.svg',
  volumeAtPrice: '/assets/academy/volume-at-price.svg',
  orderFlow: '/assets/academy/saldo-agressao.svg',
  miniIndex: '/assets/academy/volume-profile.svg',
  miniDollar: '/assets/academy/volume-at-price.svg',
  profitNelogica: '/assets/video/lgvg-flow-demo.webp',
}

export const guideSources: Partial<Record<GuideId, Array<{ label: string; url: string }>>> = {
  aggressionBalance: [
    {
      label: 'Nelogica: Medidores de Agressão',
      url: 'https://ajuda.nelogica.com.br/hc/pt-br/articles/360047155651-Medidores-de-Agress%C3%A3o',
    },
    {
      label: 'Nelogica: Histograma e Saldo de Agressão',
      url: 'https://ajuda.nelogica.com.br/hc/pt-br/articles/360052485332-Plugin-Tape-Reading-Histograma-e-Saldo-de-Agress%C3%A3o',
    },
  ],
  volumeProfile: [
    {
      label: 'Nelogica: Volume Profile',
      url: 'https://ajuda.nelogica.com.br/hc/pt-br/articles/360049696971-Volume-Profile',
    },
    {
      label: 'B3: Futuro de Ibovespa e Mini Índice WIN',
      url: 'https://www.b3.com.br/pt_br/produtos-e-servicos/negociacao/renda-variavel/mercado-de-acoes/futuro-de-ibovespa.htm',
    },
  ],
  volumeAtPrice: [
    {
      label: 'Nelogica: Volume At Price',
      url: 'https://ajuda.nelogica.com.br/hc/pt-br/articles/360047070932-Volume-At-Price',
    },
    {
      label: 'B3: Futuro Mini de Dólar WDO',
      url: 'https://b3.com.br/pt_br/produtos-e-servicos/negociacao/moedas/futuro-mini-de-taxa-de-cambio-de-reais-por-dolar-comercial.htm',
    },
  ],
}

type GuideRouteData = {
  publishedAt: Record<GuideId, string>
  modifiedAt: Record<GuideId, string>
  guides: Record<GuideId, Partial<Record<Locale, string>>>
}

const routeData = guideRouteData as GuideRouteData

export const guidePublishedAt = (guideId: GuideId) => routeData.publishedAt[guideId]
export const guideModifiedAt = (guideId: GuideId) => routeData.modifiedAt[guideId]
export const guidesModifiedAt = Object.values(routeData.modifiedAt).sort().at(-1) ?? '2026-10-14'

export const guideIdsForLocale = (locale: Locale) =>
  guideIds.filter((guideId) => Boolean(routeData.guides[guideId][locale]))

export const guideSlug = (locale: Locale, guideId: GuideId) =>
  routeData.guides[guideId][locale] as string

export const guidePath = (locale: Locale, guideId: GuideId) =>
  `/${locale}/guides/${guideSlug(locale, guideId)}/`

export const guideMetadataPath = (locale: Locale, guideId: GuideId) =>
  `guides/${guideSlug(locale, guideId)}`

export const getGuideId = (locale: Locale, slug: string): GuideId | undefined =>
  guideIdsForLocale(locale).find((guideId) => guideSlug(locale, guideId) === slug)

export const guideLanguagePaths = (guideId: GuideId): Partial<Record<Locale, string>> =>
  Object.fromEntries(
    (Object.keys(routeData.guides[guideId]) as Locale[]).map((locale) => [
      locale,
      guideMetadataPath(locale, guideId),
    ]),
  )
