import newsPayload from '@/data/market-news.json'
import { localeConfig, type Locale } from '@/lib/i18n'

export type MarketNewsItem = {
  category: string
  source: string
  title: string
  publishedAt: string
  summary: string
  url: string
}

type MarketNews = {
  updatedAt: string
  source: string
  items: MarketNewsItem[]
}

const repairLegacyEncoding = (value: string) => {
  if (!/[ÃÂâ€]/.test(value)) return value

  try {
    return decodeURIComponent(escape(value))
  } catch {
    return value
  }
}

const cleanItem = (item: MarketNewsItem): MarketNewsItem => ({
  ...item,
  category: repairLegacyEncoding(item.category),
  source: repairLegacyEncoding(item.source),
  title: repairLegacyEncoding(item.title),
  summary: repairLegacyEncoding(item.summary),
})

export const marketNews: MarketNews = {
  ...(newsPayload as MarketNews),
  source: repairLegacyEncoding(newsPayload.source),
  items: (newsPayload.items as MarketNewsItem[]).map(cleanItem),
}

export const formatNewsDate = (value: string, locale: Locale) =>
  new Intl.DateTimeFormat(localeConfig[locale].htmlLang, {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Sao_Paulo',
  }).format(new Date(value))
