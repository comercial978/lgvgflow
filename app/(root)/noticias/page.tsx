import { LocaleGateway } from '@/components/LocaleGateway'
import { getDictionary } from '@/lib/i18n'

export default async function LegacyNewsPage() {
  const dictionary = await getDictionary('pt')
  return <main className="gateway"><LocaleGateway fallbackPath="/pt/news" loadingLabel={dictionary.news.pageTitle} path="/news" /></main>
}
