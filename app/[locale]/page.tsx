import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { HomePage } from '@/components/HomePage'
import { getDictionary, isLocale } from '@/lib/i18n'
import { buildMetadata } from '@/lib/metadata'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const dictionary = await getDictionary(locale)
  return buildMetadata({ locale, dictionary })
}

export default async function LocaleHome({ params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const dictionary = await getDictionary(locale)
  return <HomePage locale={locale} dictionary={dictionary} />
}
