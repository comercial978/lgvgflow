import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outDir = path.join(root, 'out')
const siteUrl = 'https://lgvgflow.uaisoftware.com.br'
const locales = ['pt', 'en', 'es']
const pages = ['', 'news', 'manual', 'privacy', 'terms', 'contact']
const today = new Date().toISOString().slice(0, 10)

const alternateLinks = (page) => locales
  .map((locale) => `    <xhtml:link rel="alternate" hreflang="${locale === 'pt' ? 'pt-BR' : locale}" href="${siteUrl}/${locale}/${page ? `${page}/` : ''}" />`)
  .concat(`    <xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}/en/${page ? `${page}/` : ''}" />`)
  .join('\n')

for (const locale of locales) {
  const urls = pages.map((page) => `  <url>
    <loc>${siteUrl}/${locale}/${page ? `${page}/` : ''}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page === 'news' ? 'daily' : 'weekly'}</changefreq>
    <priority>${page === '' ? '1.0' : page === 'news' ? '0.8' : '0.6'}</priority>
${alternateLinks(page)}
  </url>`).join('\n')

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
${locales.map((locale) => `  <sitemap><loc>${siteUrl}/${locale}/sitemap.xml</loc><lastmod>${today}</lastmod></sitemap>`).join('\n')}
</sitemapindex>
`

await writeFile(path.join(outDir, 'sitemap.xml'), index)
console.log('International sitemaps generated.')
