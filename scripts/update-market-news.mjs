import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const siteUrl = 'https://lgvgflow.uaisoftware.com.br';
const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputDir = path.join(rootDir, 'data');
const newsDir = path.join(rootDir, 'noticias');

const feeds = [
    {
        category: 'Banco Central',
        source: 'Banco Central do Brasil',
        url: 'https://www.bcb.gov.br/api/feed/sitebcb/sitefeeds/noticias',
        limit: 8
    },
    {
        category: 'Expectativas de mercado',
        source: 'Relatorio Focus - Banco Central do Brasil',
        url: 'https://www.bcb.gov.br/api/feed/sitebcb/sitefeeds/focus',
        limit: 4
    }
];

const decodeEntities = (value) => {
    let decoded = value;
    const entities = {
        '&amp;': '&',
        '&apos;': "'",
        '&gt;': '>',
        '&lt;': '<',
        '&nbsp;': ' ',
        '&quot;': '"'
    };

    for (let index = 0; index < 3; index += 1) {
        const next = decoded
            .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
            .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number.parseInt(code, 10)))
            .replace(/&(amp|apos|gt|lt|nbsp|quot);/g, (entity) => entities[entity]);

        if (next === decoded) break;
        decoded = next;
    }

    return decoded;
};

const plainText = (value) => decodeEntities(value)
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const htmlEscape = (value) => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const elementValue = (entry, tag) => {
    const match = entry.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`, 'i'));
    return match ? plainText(match[1]) : '';
};

const excerpt = (value, maximumLength = 220) => {
    if (value.length <= maximumLength) return value;
    return `${value.slice(0, maximumLength).replace(/\s+\S*$/, '').trim()}...`;
};

const parseAtom = (xml, feed) => {
    const entries = xml.match(/<entry>[\s\S]*?<\/entry>/gi) ?? [];

    return entries.map((entry) => {
        const link = entry.match(/<link\s+[^>]*href="([^"]+)"[^>]*>/i);
        const title = elementValue(entry, 'title');
        const publishedAt = elementValue(entry, 'updated');
        const summary = excerpt(elementValue(entry, 'content') || elementValue(entry, 'summary'));

        return {
            category: feed.category,
            source: feed.source,
            title,
            publishedAt,
            summary,
            url: link ? decodeEntities(link[1]) : ''
        };
    }).filter((item) => item.title && item.publishedAt && item.summary && item.url);
};

const fetchFeed = async (feed) => {
    const response = await fetch(feed.url, {
        headers: {
            'User-Agent': 'LGVGFlowNewsBot/1.0 (+https://lgvgflow.uaisoftware.com.br)'
        }
    });

    if (!response.ok) {
        throw new Error(`Feed indisponivel (${response.status}): ${feed.url}`);
    }

    const xml = new TextDecoder('utf-8').decode(await response.arrayBuffer());
    return parseAtom(xml, feed).slice(0, feed.limit);
};

const formatDate = (value) => new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Sao_Paulo'
}).format(new Date(value));

const renderNewsCards = (items) => items.map((item) => `
                <article class="news-card">
                    <p class="news-meta">${htmlEscape(item.category)} | ${htmlEscape(formatDate(item.publishedAt))}</p>
                    <h2>${htmlEscape(item.title)}</h2>
                    <p class="news-summary">${htmlEscape(item.summary)}</p>
                    <p class="news-source">Fonte: ${htmlEscape(item.source)}</p>
                    <a href="${htmlEscape(item.url)}" target="_blank" rel="noopener noreferrer">Ler publicacao original</a>
                </article>`).join('');

const renderNewsPage = (items, updatedAt) => `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Noticias do Mercado Financeiro | LGVG Flow</title>
    <meta name="description" content="Radar de mercado do LGVG Flow com comunicados do Banco Central do Brasil e Relatorio Focus atualizados automaticamente.">
    <meta name="robots" content="index, follow, max-snippet:-1">
    <link rel="canonical" href="${siteUrl}/noticias/">
    <link rel="alternate" hreflang="pt-BR" href="${siteUrl}/noticias/">
    <meta property="og:type" content="website">
    <meta property="og:title" content="Noticias do Mercado Financeiro | LGVG Flow">
    <meta property="og:description" content="Comunicados e expectativas de mercado atualizados diretamente pela fonte oficial.">
    <meta property="og:url" content="${siteUrl}/noticias/">
    <meta property="og:site_name" content="LGVG Flow">
    <meta property="og:locale" content="pt_BR">
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Noticias do Mercado Financeiro",
      "url": "${siteUrl}/noticias/",
      "description": "Radar de mercado com comunicados e expectativas publicados pelo Banco Central do Brasil.",
      "inLanguage": "pt-BR",
      "isPartOf": {
        "@type": "WebSite",
        "name": "LGVG Flow",
        "url": "${siteUrl}/"
      }
    }
    </script>
    <style>
        :root { --bg: #090B10; --panel: #13171F; --text: #E8EAF0; --muted: #A4ABC0; --gold: #F5C842; --border: rgba(245, 200, 66, 0.18); }
        * { box-sizing: border-box; }
        body { background: var(--bg); color: var(--text); font-family: Arial, sans-serif; line-height: 1.6; margin: 0; }
        a { color: inherit; }
        .container { margin: 0 auto; max-width: 1120px; padding: 0 24px; }
        header { border-bottom: 1px solid var(--border); padding: 22px 0; }
        .brand { color: var(--gold); font-size: 1.1rem; font-weight: 800; letter-spacing: 0.04em; text-decoration: none; }
        main { padding: 72px 0; }
        .eyebrow { color: var(--gold); font-size: 0.76rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; }
        h1 { font-size: clamp(2rem, 5vw, 3.6rem); line-height: 1.1; margin: 14px 0; }
        .intro { color: var(--muted); font-size: 1.05rem; max-width: 720px; }
        .updated { color: var(--muted); font-size: 0.84rem; margin: 24px 0 34px; }
        .news-grid { display: grid; gap: 16px; grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .news-card { background: var(--panel); border: 1px solid var(--border); border-radius: 8px; display: flex; flex-direction: column; min-height: 290px; padding: 24px; }
        .news-card h2 { font-size: 1.1rem; line-height: 1.35; margin: 12px 0; }
        .news-meta, .news-source { color: var(--gold); font-size: 0.76rem; font-weight: 700; letter-spacing: 0.04em; margin: 0; text-transform: uppercase; }
        .news-summary { color: var(--muted); font-size: 0.92rem; margin: 0 0 18px; }
        .news-source { color: var(--muted); font-size: 0.75rem; margin-top: auto; }
        .news-card a { color: var(--gold); font-size: 0.86rem; font-weight: 700; margin-top: 12px; text-decoration: none; }
        .notice { border-left: 3px solid var(--gold); color: var(--muted); font-size: 0.88rem; margin-top: 48px; padding-left: 16px; }
        footer { border-top: 1px solid var(--border); color: var(--muted); font-size: 0.82rem; padding: 28px 0; }
        @media (max-width: 820px) { .news-grid { grid-template-columns: 1fr; } }
    </style>
</head>
<body>
    <header>
        <div class="container"><a class="brand" href="/">LGVG Flow</a></div>
    </header>
    <main class="container">
        <p class="eyebrow">Radar de Mercado</p>
        <h1>Noticias do mercado financeiro</h1>
        <p class="intro">Comunicados e expectativas que ajudam a acompanhar o contexto do mercado. Os links levam sempre a publicacao original.</p>
        <p class="updated">Atualizado em ${htmlEscape(formatDate(updatedAt))}.</p>
        <section class="news-grid" aria-label="Noticias mais recentes">
${renderNewsCards(items)}
        </section>
        <p class="notice">Este radar e informativo e nao constitui recomendacao de investimento. Operacoes no mercado financeiro envolvem riscos.</p>
    </main>
    <footer><div class="container">LGVG Flow | Dados e publicacoes atribuidos ao Banco Central do Brasil.</div></footer>
</body>
</html>
`;

const renderSitemap = (updatedAt) => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${updatedAt.slice(0, 10)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${siteUrl}/noticias/</loc>
    <lastmod>${updatedAt.slice(0, 10)}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
`;

const results = await Promise.all(feeds.map(fetchFeed));
const uniqueItems = [...new Map(results.flat()
    .sort((first, second) => new Date(second.publishedAt) - new Date(first.publishedAt))
    .map((item) => [item.url, item])).values()];

if (!uniqueItems.length) {
    throw new Error('Nenhuma noticia foi encontrada nos feeds oficiais.');
}

const updatedAt = new Date().toISOString();
const payload = {
    updatedAt,
    source: 'Banco Central do Brasil',
    items: uniqueItems
};

await Promise.all([
    mkdir(outputDir, { recursive: true }),
    mkdir(newsDir, { recursive: true })
]);

await Promise.all([
    writeFile(path.join(outputDir, 'market-news.json'), `${JSON.stringify(payload, null, 2)}\n`),
    writeFile(path.join(newsDir, 'index.html'), renderNewsPage(uniqueItems, updatedAt)),
    writeFile(path.join(rootDir, 'sitemap.xml'), renderSitemap(updatedAt))
]);

console.log(`Atualizadas ${uniqueItems.length} noticias em ${updatedAt}.`);
