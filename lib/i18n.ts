import 'server-only'

import ptDictionary from '@/locales/pt-BR.json'
import type { Locale } from '@/lib/i18n-config'

export type Dictionary = typeof ptDictionary

export { isLocale, languageAlternates, localeConfig, localizedPath, supportedLocales } from '@/lib/i18n-config'
export type { Locale } from '@/lib/i18n-config'

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  pt: () => import('@/locales/pt-BR.json').then((module) => module.default),
  en: () => import('@/locales/en.json').then((module) => module.default as Dictionary),
  es: () => import('@/locales/es.json').then((module) => module.default as Dictionary),
}

export const getDictionary = async (locale: Locale) => dictionaries[locale]()
