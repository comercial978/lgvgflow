import { LocaleGateway } from '@/components/LocaleGateway'
import { getDictionary } from '@/lib/i18n'

export default async function RootPage() {
  const dictionary = await getDictionary('pt')
  return <main className="gateway"><LocaleGateway fallbackPath="/pt" loadingLabel={dictionary.meta.title} /></main>
}
