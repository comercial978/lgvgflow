export const supportedLocales = ['pt', 'en', 'es'] as const
export type Locale = (typeof supportedLocales)[number]

export const localeConfig: Record<Locale, {
  flag: string
  htmlLang: string
  ogLocale: string
  dir: 'ltr' | 'rtl'
}> = {
  pt: { flag: '🇧🇷', htmlLang: 'pt-BR', ogLocale: 'pt_BR', dir: 'ltr' },
  en: { flag: '🇺🇸', htmlLang: 'en', ogLocale: 'en_US', dir: 'ltr' },
  es: { flag: '🇪🇸', htmlLang: 'es', ogLocale: 'es_ES', dir: 'ltr' },
}

export const isLocale = (value: string): value is Locale =>
  supportedLocales.includes(value as Locale)

export const localizedPath = (locale: Locale, path = '') =>
  `/${locale}${path ? `/${path.replace(/^\//, '')}` : ''}`

export const languageAlternates = (path = '') => ({
  'pt-BR': localizedPath('pt', path),
  en: localizedPath('en', path),
  es: localizedPath('es', path),
  'x-default': localizedPath('en', path),
})
