import type { Dictionary, Locale } from '@/lib/i18n'
import { localeConfig } from '@/lib/i18n'
import { siteConfig } from '@/lib/site'

export function homeSchemas(locale: Locale, dictionary: Dictionary) {
  const pageUrl = `${siteConfig.url}/${locale}/`

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': `${siteConfig.url}/#organization`,
      name: siteConfig.company,
      url: siteConfig.url,
      brand: { '@type': 'Brand', name: siteConfig.name },
      sameAs: [siteConfig.instagramUrl],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${siteConfig.url}/#website`,
      name: siteConfig.name,
      url: siteConfig.url,
      inLanguage: localeConfig[locale].htmlLang,
      publisher: { '@id': `${siteConfig.url}/#organization` },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      '@id': `${pageUrl}#software`,
      name: siteConfig.name,
      applicationCategory: dictionary.schema.applicationCategory,
      operatingSystem: dictionary.schema.operatingSystem,
      description: dictionary.meta.description,
      url: pageUrl,
      offers: {
        '@type': 'Offer',
        name: dictionary.schema.offerName,
        price: '1000.00',
        priceCurrency: 'BRL',
        availability: 'https://schema.org/InStock',
        url: siteConfig.checkoutUrl,
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      '@id': `${pageUrl}#product`,
      name: siteConfig.name,
      brand: { '@type': 'Brand', name: siteConfig.name },
      description: dictionary.hero.description,
      category: dictionary.schema.applicationCategory,
      offers: {
        '@type': 'Offer',
        name: dictionary.schema.offerName,
        price: '1000.00',
        priceCurrency: 'BRL',
        url: siteConfig.checkoutUrl,
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: dictionary.faq.items.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    },
    breadcrumbSchema(locale, [{ name: siteConfig.name, path: '' }]),
  ]
}

export function breadcrumbSchema(locale: Locale, items: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}/${locale}/${item.path ? `${item.path}/` : ''}`,
    })),
  }
}
