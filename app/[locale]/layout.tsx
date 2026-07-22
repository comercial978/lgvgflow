import type { ReactNode } from 'react'
import { notFound } from 'next/navigation'

import '@/app/globals.css'
import { GoogleAnalytics } from '@/components/GoogleAnalytics'
import { GoogleAnalyticsEvents } from '@/components/GoogleAnalyticsEvents'
import { isLocale, localeConfig, supportedLocales } from '@/lib/i18n'

export const dynamicParams = false

export function generateStaticParams() {
  return supportedLocales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  return <html lang={localeConfig[locale].htmlLang} dir={localeConfig[locale].dir}><head><GoogleAnalytics /></head><body>{children}<GoogleAnalyticsEvents /></body></html>
}
