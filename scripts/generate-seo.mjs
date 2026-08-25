import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outDir = path.join(root, 'out')
const siteUrl = 'https://lgvgflow.uaisoftware.com.br'
const locales = ['pt', 'en', 'es']
const guideRouteData = JSON.parse(await readFile(path.join(root, 'data', 'guide-routes.json'), 'utf8'))
const marketNews = JSON.parse(await readFile(path.join(root, 'data', 'market-news.json'), 'utf8'))
const newsModifiedAt = marketNews.updatedAt.slice(0, 10)
const guideModifiedAt = guideRouteData.modifiedAt
const homeModifiedAt = '2026-08-25'
const sitemapModifiedAt = [newsModifiedAt, guideModifiedAt, homeModifiedAt].sort().at(-1)

const staticPages = [
  { path: '', changefreq: 'weekly', priority: '1.0', lastmod: homeModifiedAt },
  { path: 'guides', changefreq: 'monthly', priority: '0.8', lastmod: guideModifiedAt },
  { path: 'news', changefreq: 'daily', priority: '0.7', lastmod: newsModifiedAt },
  { path: 'manual', changefreq: 'monthly', priority: '0.6' },
  { path: 'privacy', changefreq: 'yearly', priority: '0.3' },
  { path: 'terms', changefreq: 'yearly', priority: '0.3' },
  { path: 'contact', changefreq: 'yearly', priority: '0.4' },
]

const localizedUrl = (locale, page) =>
  `${siteUrl}/${locale}/${page ? `${page}/` : ''}`

const alternateLinks = (paths) => locales
  .map((locale) => `    <xhtml:link rel="alternate" hreflang="${locale === 'pt' ? 'pt-BR' : locale}" href="${localizedUrl(locale, paths[locale])}" />`)
  .concat(`    <xhtml:link rel="alternate" hreflang="x-default" href="${localizedUrl('en', paths.en)}" />`)
  .join('\n')

const renderUrl = ({ locale, path: pagePath, alternatePaths, lastmod, changefreq, priority }) => `  <url>
    <loc>${localizedUrl(locale, pagePath)}</loc>
${lastmod ? `    <lastmod>${lastmod}</lastmod>\n` : ''}    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
${alternateLinks(alternatePaths)}
  </url>`

for (const locale of locales) {
  const staticUrls = staticPages.map((page) => renderUrl({
    ...page,
    locale,
    alternatePaths: Object.fromEntries(locales.map((item) => [item, page.path])),
  }))
  const guideUrls = Object.values(guideRouteData.guides).map((slugs) => renderUrl({
    locale,
    path: `guides/${slugs[locale]}`,
    alternatePaths: Object.fromEntries(locales.map((item) => [item, `guides/${slugs[item]}`])),
    lastmod: guideModifiedAt,
    changefreq: 'monthly',
    priority: '0.8',
  }))
  const urls = [...staticUrls, ...guideUrls].join('\n')

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`

  const localeDir = path.join(outDir, locale)
  await mkdir(localeDir, { recursive: true })
  await writeFile(path.join(localeDir, 'sitemap.xml'), sitemap)
}

const index = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${locales.map((locale) => `  <sitemap><loc>${siteUrl}/${locale}/sitemap.xml</loc><lastmod>${sitemapModifiedAt}</lastmod></sitemap>`).join('\n')}
</sitemapindex>
`

await writeFile(path.join(outDir, 'sitemap.xml'), index)
console.log('International sitemaps generated.')
