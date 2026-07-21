import { InteriorLayout } from '@/components/InteriorLayout'
import type { Dictionary, Locale } from '@/lib/i18n'

type Props = {
  dictionary: Dictionary
  locale: Locale
  page: 'privacy' | 'terms'
}

export function LegalPage({ dictionary, locale, page }: Props) {
  const content = dictionary[page]

  return (
    <InteriorLayout dictionary={dictionary} locale={locale} title={content.title} intro={content.updated}>
      <div className="legal-sections">
        {content.sections.map((section) => (
          <section key={section.title}><h2>{section.title}</h2><p>{section.text}</p></section>
        ))}
      </div>
    </InteriorLayout>
  )
}
