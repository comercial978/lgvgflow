import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { LegalPage } from '@/components/LegalPage'
import { StructuredData } from '@/components/StructuredData'
import { getDictionary, isLocale } from '@/lib/i18n'
import { buildMetadata } from '@/lib/metadata'
import { breadcrumbSchema } from '@/lib/schema'
import { siteConfig } from '@/lib/site'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const dictionary = await getDictionary(locale)
  return buildMetadata({ locale, dictionary, path: 'terms', title: dictionary.terms.metaTitle, description: dictionary.terms.metaDescription })
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const dictionary = await getDictionary(locale)
  return <><StructuredData data={breadcrumbSchema(locale, [{ name: siteConfig.name, path: '' }, { name: dictionary.terms.title, path: 'terms' }])} /><LegalPage dictionary={dictionary} locale={locale} page="terms" /></>
}
