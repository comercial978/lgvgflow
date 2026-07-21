import { ArrowUpRight, CalendarDays } from 'lucide-react'

import type { Dictionary, Locale } from '@/lib/i18n'
import { formatNewsDate, type MarketNewsItem } from '@/lib/news'

type Props = {
  dictionary: Dictionary
  items: MarketNewsItem[]
  locale: Locale
}

export function NewsGrid({ dictionary, items, locale }: Props) {
  if (!items.length) return <p className="empty-state">{dictionary.news.empty}</p>

  return (
    <div className="news-grid">
      {items.map((item) => (
        <article className="news-card" key={item.url}>
          <div className="news-card-meta">
            <span>{item.category}</span>
            <time dateTime={item.publishedAt}><CalendarDays aria-hidden="true" size={14} />{formatNewsDate(item.publishedAt, locale)}</time>
          </div>
          <h3>{item.title}</h3>
          <p>{item.summary}</p>
          <div className="news-card-footer">
            <small>{dictionary.news.source}: {item.source}</small>
            <a href={item.url} target="_blank" rel="noopener noreferrer">
              {dictionary.news.read}<ArrowUpRight aria-hidden="true" size={15} />
            </a>
          </div>
        </article>
      ))}
    </div>
  )
}
