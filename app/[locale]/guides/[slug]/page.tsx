import type { Metadata } from 'next'
import { ArrowRight, BookOpen, Check, Download } from 'lucide-react'
import { notFound } from 'next/navigation'

import { InteriorLayout } from '@/components/InteriorLayout'
import { StructuredData } from '@/components/StructuredData'
import {
  getGuideId,
  guideIds,
  guideLanguagePaths,
  guideMetadataPath,
  guideModifiedAt,
  guidePath,
  guidePublishedAt,
  guideSlug,
} from '@/lib/guides'
import { getDictionary, isLocale, localeConfig, supportedLocales } from '@/lib/i18n'
import { buildMetadata } from '@/lib/metadata'
import { breadcrumbSchema } from '@/lib/schema'
import { siteConfig } from '@/lib/site'

type Props = { params: Promise<{ locale: string; slug: string }> }

export function generateStaticParams() {
  return supportedLocales.flatMap((locale) =>
    guideIds.map((guideId) => ({ locale, slug: guideSlug(locale, guideId) })),
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}
  const guideId = getGuideId(locale, slug)
  if (!guideId) return {}
  const dictionary = await getDictionary(locale)
  const guide = dictionary.guides.items[guideId]
  return buildMetadata({
    locale,
    dictionary,
    path: guideMetadataPath(locale, guideId),
    title: guide.metaTitle,
    description: guide.metaDescription,
    languagePaths: guideLanguagePaths(guideId),
  })
}

export default async function GuidePage({ params }: Props) {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()
  const guideId = getGuideId(locale, slug)
  if (!guideId) notFound()
  const dictionary = await getDictionary(locale)
  const guide = dictionary.guides.items[guideId]
  const pagePath = guidePath(locale, guideId)
  const pageUrl = `${siteConfig.url}${pagePath}`
  const schemas = [
    breadcrumbSchema(locale, [
      { name: siteConfig.name, path: '' },
      { name: dictionary.guides.indexTitle, path: 'guides' },
      { name: guide.title, path: guideMetadataPath(locale, guideId) },
    ]),
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: guide.title,
      description: guide.metaDescription,
      url: pageUrl,
      mainEntityOfPage: pageUrl,
      inLanguage: localeConfig[locale].htmlLang,
      datePublished: guidePublishedAt(guideId),
      dateModified: guideModifiedAt,
      image: `${siteConfig.url}/assets/video/lgvg-flow-demo.webp`,
      author: {
        '@type': 'Person',
        name: dictionary.authority.name,
        url: `${siteConfig.url}/${locale}/#developer`,
        sameAs: [siteConfig.instagramUrl],
      },
      publisher: {
        '@type': 'Organization',
        name: siteConfig.company,
        url: siteConfig.url,
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: guide.faq.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    },
  ]
  const relatedGuides = guideIds.filter((item) => item !== guideId)

  return (
    <>
      <StructuredData data={schemas} />
      <InteriorLayout
        dictionary={dictionary}
        locale={locale}
        eyebrow={guide.eyebrow}
        title={guide.title}
        intro={guide.intro}
      >
        <article className="guide-article">
          <p className="guide-byline">
            <span>{dictionary.guides.byline}</span>
            <span aria-hidden="true">·</span>
            <time dateTime={guideModifiedAt}>{dictionary.guides.reviewed}</time>
          </p>
          <nav className="guide-toc" aria-label={dictionary.guides.contents}>
            <strong><BookOpen aria-hidden="true" size={18} />{dictionary.guides.contents}</strong>
            <ol>
              {guide.sections.map((section, index) => (
                <li key={section.title}><a href={`#guide-section-${index + 1}`}>{section.title}</a></li>
              ))}
            </ol>
          </nav>

          {guide.sections.map((section, index) => (
            <section className="guide-article-section" id={`guide-section-${index + 1}`} key={section.title}>
              <h2>{section.title}</h2>
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {section.items.length ? (
                <ul>{section.items.map((item) => <li key={item}><Check aria-hidden="true" size={17} />{item}</li>)}</ul>
              ) : null}
            </section>
          ))}

          <section className="guide-faq" aria-labelledby="guide-faq-title">
            <h2 id="guide-faq-title">{dictionary.guides.faqTitle}</h2>
            <div className="faq-list">
              {guide.faq.map((item) => (
                <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>
              ))}
            </div>
          </section>

          <aside className="risk-panel guide-risk">
            <h2>{dictionary.guides.riskTitle}</h2>
            <p>{dictionary.guides.riskText}</p>
          </aside>

          <section className="guide-cta" aria-labelledby="guide-cta-title">
            <div>
              <p className="eyebrow">LGVG Flow</p>
              <h2 id="guide-cta-title">{dictionary.guides.ctaTitle}</h2>
              <p>{dictionary.guides.ctaText}</p>
            </div>
            <a className="button button-primary" href={`/${locale}/#downloads`}>
              <Download aria-hidden="true" size={18} />{dictionary.guides.ctaButton}
            </a>
          </section>

          <section className="guide-related" aria-labelledby="guide-related-title">
            <h2 id="guide-related-title">{dictionary.guides.relatedTitle}</h2>
            <div className="guide-related-grid">
              {relatedGuides.map((relatedId) => (
                <a href={guidePath(locale, relatedId)} key={relatedId}>
                  <span>{dictionary.guides.items[relatedId].cardTitle}</span>
                  <ArrowRight aria-hidden="true" size={16} />
                </a>
              ))}
            </div>
          </section>
        </article>
      </InteriorLayout>
    </>
  )
}
