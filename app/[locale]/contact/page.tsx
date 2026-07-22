import type { Metadata } from 'next'
import { Camera, FileText, MessageCircle } from 'lucide-react'
import { notFound } from 'next/navigation'

import { InteriorLayout } from '@/components/InteriorLayout'
import { StructuredData } from '@/components/StructuredData'
import { getDictionary, isLocale } from '@/lib/i18n'
import { buildMetadata } from '@/lib/metadata'
import { breadcrumbSchema } from '@/lib/schema'
import { siteConfig, whatsappUrl } from '@/lib/site'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const dictionary = await getDictionary(locale)
  return buildMetadata({ locale, dictionary, path: 'contact', title: dictionary.contact.metaTitle, description: dictionary.contact.metaDescription })
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const dictionary = await getDictionary(locale)

  return (
    <>
      <StructuredData data={breadcrumbSchema(locale, [{ name: siteConfig.name, path: '' }, { name: dictionary.contact.title, path: 'contact' }])} />
      <InteriorLayout dictionary={dictionary} locale={locale} title={dictionary.contact.title} intro={dictionary.contact.intro}>
        <div className="contact-grid">
          <a href={whatsappUrl(dictionary.cta.whatsappMessage)} target="_blank" rel="noopener noreferrer" data-ga-event="clique_whatsapp" data-ga-file-name="not_applicable"><MessageCircle aria-hidden="true" /><span>{dictionary.contact.whatsapp}</span></a>
          <a href={siteConfig.instagramUrl} target="_blank" rel="noopener noreferrer"><Camera aria-hidden="true" /><span>{dictionary.contact.instagram}</span></a>
          <a href={siteConfig.formUrl} target="_blank" rel="noopener noreferrer"><FileText aria-hidden="true" /><span>{dictionary.contact.form}</span></a>
        </div>
      </InteriorLayout>
    </>
  )
}
