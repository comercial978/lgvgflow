import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outputDir = path.join(rootDir, 'data')

const feeds = [
  {
    category: 'Banco Central',
    source: 'Banco Central do Brasil',
    url: 'https://www.bcb.gov.br/api/feed/sitebcb/sitefeeds/noticias',
    limit: 8,
  },
  {
    category: 'Expectativas de mercado',
    source: 'Relatório Focus - Banco Central do Brasil',
    url: 'https://www.bcb.gov.br/api/feed/sitebcb/sitefeeds/focus',
    limit: 4,
  },
]

const decodeEntities = (value) => {
  let decoded = value
  const named = { amp: '&', apos: "'", gt: '>', lt: '<', nbsp: ' ', quot: '"' }

  for (let index = 0; index < 3; index += 1) {
    const next = decoded
      .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
      .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number.parseInt(code, 10)))
      .replace(/&(amp|apos|gt|lt|nbsp|quot);/g, (_, entity) => named[entity])
    if (next === decoded) break
    decoded = next
  }

  return decoded
}

const plainText = (value) => decodeEntities(value)
  .replace(/<[^>]*>/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()

const elementValue = (entry, tag) => {
  const match = entry.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`, 'i'))
  return match ? plainText(match[1]) : ''
}

const excerpt = (value, maximumLength = 220) => {
  if (value.length <= maximumLength) return value
  return `${value.slice(0, maximumLength).replace(/\s+\S*$/, '').trim()}...`
}

const parseAtom = (xml, feed) => {
  const entries = xml.match(/<entry>[\s\S]*?<\/entry>/gi) ?? []

  return entries.map((entry) => {
    const link = entry.match(/<link\s+[^>]*href="([^"]+)"[^>]*>/i)
    return {
      category: feed.category,
      source: feed.source,
      title: elementValue(entry, 'title'),
      publishedAt: elementValue(entry, 'updated'),
      summary: excerpt(elementValue(entry, 'content') || elementValue(entry, 'summary')),
      url: link ? decodeEntities(link[1]) : '',
    }
  }).filter((item) => item.title && item.publishedAt && item.summary && item.url)
}

const fetchFeed = async (feed) => {
  const response = await fetch(feed.url, {
    headers: { 'User-Agent': 'LGVGFlowNewsBot/2.0 (+https://lgvgflow.uaisoftware.com.br)' },
  })

  if (!response.ok) throw new Error(`Feed indisponível (${response.status}): ${feed.url}`)
  const xml = new TextDecoder('utf-8').decode(await response.arrayBuffer())
  return parseAtom(xml, feed).slice(0, feed.limit)
}

const results = await Promise.all(feeds.map(fetchFeed))
const items = [...new Map(
  results.flat()
    .sort((first, second) => new Date(second.publishedAt) - new Date(first.publishedAt))
    .map((item) => [item.url, item]),
).values()]

if (!items.length) throw new Error('Nenhuma notícia foi encontrada nos feeds oficiais.')

const updatedAt = new Date().toISOString()
await mkdir(outputDir, { recursive: true })
await writeFile(path.join(outputDir, 'market-news.json'), `${JSON.stringify({
  updatedAt,
  source: 'Banco Central do Brasil',
  items,
}, null, 2)}\n`)

console.log(`Atualizadas ${items.length} notícias em ${updatedAt}.`)
