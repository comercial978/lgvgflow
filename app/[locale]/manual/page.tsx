import type { Metadata } from 'next'
import { Check, Download } from 'lucide-react'
import { notFound } from 'next/navigation'

import { InteriorLayout } from '@/components/InteriorLayout'
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
  return buildMetadata({ locale, dictionary, path: 'manual', title: dictionary.manual.metaTitle, description: dictionary.manual.metaDescription })
}

export default async function ManualPage({ params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const dictionary = await getDictionary(locale)

  return (
    <>
      <StructuredData data={breadcrumbSchema(locale, [{ name: siteConfig.name, path: '' }, { name: dictionary.manual.title, path: 'manual' }])} />
      <InteriorLayout dictionary={dictionary} locale={locale} eyebrow={dictionary.manual.label} title={dictionary.manual.title} intro={dictionary.manual.intro}>
        <div className="manual-grid">
          <section className="manual-panel"><h2>{dictionary.manual.requirementsTitle}</h2><ul className="check-list">{dictionary.manual.requirements.map((item) => <li key={item}><Check aria-hidden="true" size={17} />{item}</li>)}</ul></section>
          <section className="manual-panel manual-steps"><h2>{dictionary.manual.stepsTitle}</h2><ol>{dictionary.manual.steps.map((step, index) => <li key={step.title}><span>{index + 1}</span><div><h3>{step.title}</h3><p>{step.text}</p></div></li>)}</ol></section>
          <section className="risk-panel"><h2>{dictionary.manual.riskTitle}</h2><p>{dictionary.manual.riskText}</p></section>
        </div>
        <div className="manual-actions">
          <a className="button button-primary" href={siteConfig.manualUrl} target="_blank" rel="noopener noreferrer" data-ga-event="download_manual" data-ga-file-name="Manual_do_Usuario_LGVG_Flow.pdf"><Download aria-hidden="true" size={18} />{dictionary.manual.pdf}</a>
          <a className="button button-secondary" href={siteConfig.indicatorUrl} download data-ga-event="download_indicador" data-ga-file-name="LGVGFLOWATUAL.psf"><Download aria-hidden="true" size={18} />{dictionary.manual.indicator}</a>
        </div>
      </InteriorLayout>
    </>
  )
}
