import type { Metadata } from 'next'
import { Activity, AlertTriangle, ArrowRight, Check } from 'lucide-react'
import { notFound } from 'next/navigation'

import { FadeObserver } from '@/components/FadeObserver'
import { InteriorLayout } from '@/components/InteriorLayout'
import { StructuredData } from '@/components/StructuredData'
import { backtestAssets, backtestLastModified, backtestSessions } from '@/lib/backtest'
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
    path: 'results',
    title: dictionary.backtest.metaTitle,
    description: dictionary.backtest.metaDescription,
  })
}

export default async function ResultsPage({ params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const dictionary = await getDictionary(locale)
  const pageUrl = `${siteConfig.url}/${locale}/results/`
  const schemas = [
    breadcrumbSchema(locale, [
      { name: siteConfig.name, path: '' },
      { name: dictionary.backtest.pageTitle, path: 'results' },
    ]),
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: dictionary.backtest.pageTitle,
      description: dictionary.backtest.pageIntro,
      url: pageUrl,
      inLanguage: localeConfig[locale].htmlLang,
      dateModified: backtestLastModified,
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: backtestSessions.map((session, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: dictionary.backtest.sessions[index].title,
          url: `${pageUrl}#session-${session.date}`,
        })),
      },
    },
  ]

  return (
    <>
      <StructuredData data={schemas} />
      <FadeObserver />
      <InteriorLayout
        dictionary={dictionary}
        locale={locale}
        eyebrow={dictionary.backtest.label}
        title={dictionary.backtest.pageTitle}
        intro={dictionary.backtest.pageIntro}
      >
        <section className="results-overview" aria-labelledby="results-overview-title">
          <h2 className="sr-only" id="results-overview-title">{dictionary.backtest.overviewTitle}</h2>
          <div className="backtest-context">
            <span><Activity aria-hidden="true" size={17} />{dictionary.backtest.environment}</span>
            <span>{dictionary.backtest.period}</span>
          </div>

          <dl className="backtest-metrics">
            {dictionary.backtest.metrics.map((metric) => (
              <div className="backtest-metric fade-up" key={metric.label}>
                <dt>{metric.value}</dt>
                <dd>{metric.label}</dd>
              </div>
            ))}
          </dl>

          <aside className="backtest-method results-method fade-up">
            <p className="eyebrow">{dictionary.backtest.methodLabel}</p>
            <h2>{dictionary.backtest.methodTitle}</h2>
            <p>{dictionary.backtest.methodText}</p>
            <ul>
              {dictionary.backtest.methodItems.map((item) => (
                <li key={item}><Check aria-hidden="true" size={17} />{item}</li>
              ))}
            </ul>
          </aside>
        </section>

        <section className="results-archive" aria-labelledby="results-archive-title">
          <div className="backtest-gallery-heading fade-up">
            <div>
              <p className="eyebrow">{dictionary.backtest.archiveLabel}</p>
              <h2 id="results-archive-title">{dictionary.backtest.archiveTitle}</h2>
            </div>
            <p>{dictionary.backtest.archiveText}</p>
          </div>

          <div className="results-timeline">
            {backtestSessions.map((session, sessionIndex) => {
              const sessionCopy = dictionary.backtest.sessions[sessionIndex]
              return (
                <article className="results-session" id={`session-${session.date}`} key={session.date}>
                  <header className="results-session-header fade-up">
                    <time dateTime={session.date}>{sessionCopy.date}</time>
                    <h3>{sessionCopy.title}</h3>
                    <p>{sessionCopy.summary}</p>
                  </header>

                  {session.video ? (
                    <figure className="backtest-video results-video fade-up">
                      <video
                        controls
                        playsInline
                        preload="none"
                        poster={session.poster}
                        aria-label={`${dictionary.backtest.videoAria}: ${sessionCopy.date}`}
                      >
                        <source src={session.video} type="video/mp4" />
                        {dictionary.backtest.videoFallback}
                      </video>
                      <figcaption>
                        <strong>{sessionCopy.videoTitle}</strong>
                        <span>{dictionary.backtest.videoText}</span>
                      </figcaption>
                    </figure>
                  ) : null}

                  <div className="backtest-gallery results-session-gallery">
                    {session.assetIndexes.map((assetIndex) => {
                      const asset = backtestAssets[assetIndex]
                      const item = dictionary.backtest.gallery[assetIndex]
                      return (
                        <figure className="backtest-shot fade-up" key={asset.src}>
                          <a href={asset.src} target="_blank" rel="noopener noreferrer" aria-label={`${dictionary.backtest.openImage}: ${item.title}`}>
                            <img
                              src={asset.src}
                              alt={item.alt}
                              width={asset.width}
                              height={asset.height}
                              loading="lazy"
                              decoding="async"
                            />
                            <span>{dictionary.backtest.openImage}<ArrowRight aria-hidden="true" size={15} /></span>
                          </a>
                          <figcaption><strong>{item.title}</strong><span>{item.date}</span></figcaption>
                        </figure>
                      )
                    })}
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        <div className="notice-box backtest-disclaimer fade-up">
          <AlertTriangle aria-hidden="true" size={20} />
          <div><strong>{dictionary.backtest.disclaimerTitle}</strong><p>{dictionary.backtest.disclaimer}</p></div>
        </div>
      </InteriorLayout>
    </>
  )
}
