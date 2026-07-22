import type { Locale } from '@/lib/i18n-config'

const manualFiles: Record<Locale, string> = {
  pt: 'Manual_do_Usuario_LGVG_Flow.pdf',
  en: 'LGVG_Flow_User_Manual_EN.pdf',
  es: 'Manual_de_Usuario_LGVG_Flow_ES.pdf',
}

export const siteConfig = {
  name: 'LGVG Flow',
  company: 'UAI SOFTWARE LTDA',
  url: 'https://lgvgflow.uaisoftware.com.br',
  instagramUrl: 'https://www.instagram.com/lgustavovguimaraes/',
  instagramHandle: '@lgustavovguimaraes',
  whatsappNumber: '5534988977879',
  formUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSfdH3nec0sdMpS15OdDpwI27jw399riITLsoplia8DA0DghBg/viewform',
  checkoutUrl: 'https://chk.eduzz.com/D0RAN6E29Y',
  indicatorUrl: '/download/LGVGFLOWATUAL.psf',
  videoId: 'BKrsKYGemhg',
} as const

export const getManualFileName = (locale: Locale) => manualFiles[locale]

export const getManualUrl = (locale: Locale) =>
  `/manual/${getManualFileName(locale)}`

export const whatsappUrl = (message: string) =>
  `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`
