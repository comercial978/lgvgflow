'use client'

import { ArrowRight, Search } from 'lucide-react'
import { useMemo, useState } from 'react'

type AcademyCard = {
  category: string
  description: string
  featured: boolean
  href: string
  image: string
  imageAlt: string
  readLabel: string
  title: string
}

type Category = {
  id: string
  label: string
}

type Props = {
  cards: AcademyCard[]
  categories: Category[]
  featuredLabel: string
  noResults: string
  searchLabel: string
  searchPlaceholder: string
}

const normalize = (value: string) =>
  value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase()

export function AcademyGuideGrid({
  cards,
  categories,
  featuredLabel,
  noResults,
  searchLabel,
  searchPlaceholder,
}: Props) {
  const [query, setQuery] = useState('')
  const normalizedQuery = normalize(query.trim())
  const visibleCards = useMemo(
    () => cards.filter((card) => (
      !normalizedQuery || normalize(`${card.title} ${card.description}`).includes(normalizedQuery)
    )),
    [cards, normalizedQuery],
  )

  return (
    <div className="academy-browser">
      <label className="academy-search">
        <span>{searchLabel}</span>
        <span className="academy-search-control">
          <Search aria-hidden="true" size={19} />
          <input
            type="search"
            value={query}
            placeholder={searchPlaceholder}
            onChange={(event) => setQuery(event.target.value)}
          />
        </span>
      </label>

      {visibleCards.length ? categories.map((category) => {
        const categoryCards = visibleCards.filter((card) => card.category === category.id)
        if (!categoryCards.length) return null

        return (
          <section className="academy-category" key={category.id} aria-labelledby={`academy-category-${category.id}`}>
            <header className="academy-category-heading">
              <h2 id={`academy-category-${category.id}`}>{category.label}</h2>
              <span>{categoryCards.length}</span>
            </header>
            <div className="guide-card-grid academy-card-grid">
              {categoryCards.map((card) => (
                <article className={`guide-card academy-card${card.featured ? ' academy-card-featured' : ''}`} key={card.href}>
                  <a className="academy-card-media" href={card.href} aria-label={card.imageAlt}>
                    <img src={card.image} alt={card.imageAlt} loading="lazy" decoding="async" />
                  </a>
                  <div className="academy-card-body">
                    {card.featured ? <p className="academy-card-label">{featuredLabel}</p> : null}
                    <h3><a href={card.href}>{card.title}</a></h3>
                    <p>{card.description}</p>
                    <a className="text-link" href={card.href} aria-label={`${card.readLabel}: ${card.imageAlt}`}>
                      {card.readLabel}<ArrowRight aria-hidden="true" size={15} />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )
      }) : <p className="academy-empty" role="status">{noResults}</p>}
    </div>
  )
}
