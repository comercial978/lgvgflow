import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Camera,
  Check,
  ChevronRight,
  Crosshair,
  Download,
  EyeOff,
  FileDown,
  Gauge,
  Landmark,
  MessageCircle,
  ScanLine,
  ShieldCheck,
  Sparkles,
  TimerOff,
  TrendingUp,
} from 'lucide-react'

import { FadeObserver } from '@/components/FadeObserver'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { LocaleSuggestion } from '@/components/LocaleSuggestion'
import { NewsGrid } from '@/components/NewsGrid'
import { SectionTitle } from '@/components/SectionTitle'
import { StructuredData } from '@/components/StructuredData'
import { VideoFacade } from '@/components/VideoFacade'
import type { Dictionary, Locale } from '@/lib/i18n'
import { marketNews } from '@/lib/news'
import { homeSchemas } from '@/lib/schema'
import { getManualFileName, getManualUrl, siteConfig, whatsappUrl } from '@/lib/site'

type Props = {
  dictionary: Dictionary
  locale: Locale
}

const problemIcons = [TimerOff, AlertTriangle, Gauge, EyeOff]
const solutionIcons = [Activity, ShieldCheck, Landmark, ScanLine]
const ecosystemBrands = [
  { name: 'B3', src: '/assets/ecosystem/b3.png', className: 'brand-b3' },
  { name: 'Nelogica', src: '/assets/ecosystem/nelogica-symbol.webp', className: 'brand-nelogica' },
  { name: 'Profit', src: '/assets/ecosystem/profit.webp', className: 'brand-profit' },
  { name: 'Genial Investimentos', src: '/assets/ecosystem/genial.webp', className: 'brand-genial' },
]

export function HomePage({ dictionary, locale }: Props) {
  const whatsapp = whatsappUrl(dictionary.cta.whatsappMessage)
  const manualFileName = getManualFileName(locale)
  const manualUrl = getManualUrl(locale)

  return (
    <>
      <StructuredData data={homeSchemas(locale, dictionary)} />
      <FadeObserver />
      <Header locale={locale} dictionary={dictionary} />
      {locale === 'pt' ? (
        <LocaleSuggestion
          names={dictionary.language.names}
          detectedTemplate={dictionary.language.detected}
          question={dictionary.language.question}
          yes={dictionary.language.yes}
          continueLabel={dictionary.language.continue}
          never={dictionary.language.never}
        />
      ) : null}

      <style>{`
        .hero-cro-note {
          max-width: 660px;
          text-align: center;
        }

        .hero-mobile-notice {
          display: none;
          margin-top: 10px;
        }

        @media (max-width: 760px) {
          .hero-mobile-notice {
            display: block;
          }
        }
      `}</style>

      <main>
        <section className="hero" id="home">
          <img className="hero-chart" src="/assets/video/lgvg-flow-demo.webp" alt="" width="405" height="720" aria-hidden="true" />
          <div className="hero-overlay" aria-hidden="true" />
          <div className="container hero-content">
            <p className="eyebrow hero-eyebrow"><TrendingUp aria-hidden="true" size={16} />{dictionary.hero.eyebrow}</p>
            <h1>{dictionary.hero.title}</h1>
            <p className="hero-headline">{dictionary.hero.headline.prefix}<em>{dictionary.hero.headline.highlight}</em>{dictionary.hero.headline.suffix}</p>
            <p className="hero-description">{dictionary.hero.description}</p>
            <div className="hero-actions">
              <a className="button button-primary" href={siteConfig.indicatorUrl} download data-ga-event="download_indicador" data-ga-file-name="LGVGFLOWATUAL.psf">{dictionary.hero.primary}<ArrowRight aria-hidden="true" size={18} /></a>
              <a className="button button-secondary" href={manualUrl} target="_blank" rel="noopener noreferrer" data-ga-event="download_manual" data-ga-file-name={manualFileName}>{dictionary.hero.secondary}</a>
            </div>
            <p className="download-note hero-cro-note">{dictionary.hero.trialDetails}</p>
            <p className="download-note hero-cro-note hero-mobile-notice">{dictionary.hero.mobileNotice}</p>
            <dl className="hero-stats">
              {dictionary.hero.stats.map((stat) => (
                <div key={stat.label}><dt>{stat.value}</dt><dd>{stat.label}</dd></div>
              ))}
            </dl>
          </div>
        </section>

        <section className="section video-section" id="demo">
          <div className="container video-layout">
            <div className="fade-up">
              <SectionTitle label={dictionary.video.label} title={dictionary.video.title} description={dictionary.video.description} align="left" />
              <p className="inline-badge"><Sparkles aria-hidden="true" size={16} />{dictionary.video.badge}</p>
            </div>
            <div className="video-frame fade-up">
              <VideoFacade
                videoId={siteConfig.videoId}
                playLabel={dictionary.video.play}
                ariaLabel={dictionary.video.aria}
                imageAlt={dictionary.video.imageAlt}
                iframeTitle={dictionary.video.iframeTitle}
              />
            </div>
          </div>
        </section>

        <section className="section" id="problem">
          <div className="container">
            <SectionTitle label={dictionary.problem.label} title={dictionary.problem.title} description={dictionary.problem.description} />
            <div className="feature-grid feature-grid-four">
              {dictionary.problem.cards.map((card, index) => {
                const Icon = problemIcons[index]
                return <article className="feature-card fade-up" key={card.title}><Icon aria-hidden="true" /><h3>{card.title}</h3><p>{card.text}</p></article>
              })}
            </div>
            <figure className="market-quote fade-up">
              <blockquote>{dictionary.problem.quote}</blockquote>
              <figcaption>{dictionary.problem.quoteBy}</figcaption>
            </figure>
          </div>
        </section>

        <section className="section section-alt" id="solution">
          <div className="container">
            <SectionTitle label={dictionary.solution.label} title={dictionary.solution.title} description={dictionary.solution.description} />
            <div className="feature-grid feature-grid-four">
              {dictionary.solution.cards.map((card, index) => {
                const Icon = solutionIcons[index]
                return <article className="feature-card solution-card fade-up" key={card.title}><Icon aria-hidden="true" /><h3>{card.title}</h3><p>{card.text}</p></article>
              })}
            </div>
          </div>
        </section>

        <section className="section technical-section" id="technical">
          <div className="container split-layout">
            <div className="fade-up">
              <SectionTitle label={dictionary.technical.label} title={dictionary.technical.title} align="left" />
              {dictionary.technical.paragraphs.map((paragraph) => <p className="body-copy" key={paragraph}>{paragraph}</p>)}
              <ul className="check-list">
                {dictionary.technical.features.map((item) => <li key={item}><Check aria-hidden="true" size={17} />{item}</li>)}
              </ul>
            </div>
            <aside className="spec-panel fade-up">
              <p className="spec-title">{dictionary.technical.specsTitle}</p>
              <dl>
                {dictionary.technical.specs.map((spec) => <div key={spec.label}><dt>{spec.label}</dt><dd>{spec.value}</dd></div>)}
              </dl>
            </aside>
          </div>
        </section>

        <section className="section section-alt" id="compatibility">
          <div className="container">
            <SectionTitle label={dictionary.compatibility.label} title={dictionary.compatibility.title} description={dictionary.compatibility.description} />
            <div className="compatibility-grid">
              {dictionary.compatibility.cards.map((card) => (
                <article className="compatibility-card fade-up" key={card.name}>
                  <div className="platform-icon"><Activity aria-hidden="true" size={24} /></div>
                  <p>{card.title}</p><h3>{card.name}</h3><span>{card.text}</span>
                </article>
              ))}
            </div>
            <div className="notice-box fade-up"><AlertTriangle aria-hidden="true" size={20} /><div><strong>{dictionary.compatibility.noticeTitle}</strong><p>{dictionary.compatibility.noticeText}</p></div></div>
          </div>
        </section>

        <section className="section" id="audience">
          <div className="container split-layout audience-layout">
            <SectionTitle label={dictionary.audience.label} title={dictionary.audience.title} description={dictionary.audience.description} align="left" />
            <ul className="audience-list">
              {dictionary.audience.items.map((item) => <li className="fade-up" key={item}><Check aria-hidden="true" size={18} />{item}</li>)}
            </ul>
          </div>
        </section>

        <section className="section section-alt" id="faq">
          <div className="container narrow-container">
            <SectionTitle label={dictionary.faq.label} title={dictionary.faq.title} />
            <div className="faq-list fade-up">
              {dictionary.faq.items.map((item) => (
                <details key={item.question}><summary>{item.question}<ChevronRight aria-hidden="true" size={18} /></summary><p>{item.answer}</p></details>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="pricing">
          <div className="container">
            <SectionTitle label={dictionary.pricing.label} title={dictionary.pricing.title} description={dictionary.pricing.description} />
            <div className="pricing-grid">
              <article className="pricing-card fade-up">
                <p className="pricing-subtitle">{dictionary.pricing.indicator.subtitle}</p>
                <h3>{dictionary.pricing.indicator.title}</h3>
                <p className="price">{dictionary.pricing.indicator.price}</p>
                <p className="pricing-note">{dictionary.pricing.indicator.note}</p>
                <ul>{dictionary.pricing.indicator.features.map((item) => <li key={item}><Check aria-hidden="true" size={17} />{item}</li>)}</ul>
                <a className="button button-secondary button-full" href="#downloads">{dictionary.pricing.indicator.button}</a>
              </article>
              <article className="pricing-card pricing-featured fade-up">
                <p className="pricing-badge">{dictionary.pricing.mentoring.badge}</p>
                <p className="pricing-subtitle">{dictionary.pricing.mentoring.subtitle}</p>
                <h3>{dictionary.pricing.mentoring.title}</h3>
                <p className="price">{dictionary.pricing.mentoring.price}</p>
                <p className="pricing-note">{dictionary.pricing.mentoring.note}</p>
                <ul>{dictionary.pricing.mentoring.features.map((item) => <li key={item}><Check aria-hidden="true" size={17} />{item}</li>)}</ul>
                <a className="button button-primary button-full" href={siteConfig.checkoutUrl} target="_blank" rel="noopener noreferrer">{dictionary.pricing.mentoring.button}<ArrowRight aria-hidden="true" size={18} /></a>
              </article>
            </div>
            <p className="pricing-quote fade-up">{dictionary.pricing.quote} <strong>{dictionary.pricing.quoteHighlight}</strong></p>
          </div>
        </section>

        <section className="section section-alt" id="downloads">
          <div className="container">
            <SectionTitle label={dictionary.downloads.label} title={dictionary.downloads.title} description={dictionary.downloads.description} />
            <div className="download-grid">
              <article className="download-item fade-up">
                <div className="download-icon"><FileDown aria-hidden="true" size={26} /></div>
                <div><h3>{dictionary.downloads.indicatorTitle}</h3><p>{dictionary.downloads.indicatorText}</p></div>
                <a className="button button-primary" href={siteConfig.indicatorUrl} download data-ga-event="download_indicador" data-ga-file-name="LGVGFLOWATUAL.psf"><Download aria-hidden="true" size={18} />{dictionary.downloads.indicatorButton}</a>
              </article>
              <article className="download-item fade-up">
                <div className="download-icon"><BookOpen aria-hidden="true" size={26} /></div>
                <div><h3>{dictionary.downloads.manualTitle}</h3><p>{dictionary.downloads.manualText}</p></div>
                <a className="button button-secondary" href={manualUrl} target="_blank" rel="noopener noreferrer" data-ga-event="download_manual" data-ga-file-name={manualFileName}><BookOpen aria-hidden="true" size={18} />{dictionary.downloads.manualButton}</a>
              </article>
            </div>
            <p className="download-note"><ShieldCheck aria-hidden="true" size={17} />{dictionary.downloads.note}</p>
          </div>
        </section>

        <section className="section" id="developer">
          <div className="container developer-layout">
            <div className="developer-monogram fade-up" aria-hidden="true">GG</div>
            <div className="fade-up">
              <SectionTitle label={dictionary.developer.label} title={dictionary.developer.title} align="left" />
              <h3>{dictionary.developer.name}</h3>
              <p className="developer-role">{dictionary.developer.role}</p>
              {dictionary.developer.paragraphs.map((paragraph) => <p className="body-copy" key={paragraph}>{paragraph}</p>)}
              <a className="text-link" href={siteConfig.instagramUrl} target="_blank" rel="noopener noreferrer"><Camera aria-hidden="true" size={17} />{siteConfig.instagramHandle}</a>
            </div>
          </div>
        </section>

        <section className="final-cta" id="final-cta">
          <div className="container final-cta-inner fade-up">
            <p className="eyebrow">{dictionary.cta.label}</p>
            <h2>{dictionary.cta.title.prefix}<em>{dictionary.cta.title.highlight}</em>{dictionary.cta.title.suffix}</h2>
            <p>{dictionary.cta.description}</p>
            <div className="cta-actions">
              <a className="button button-primary" href={siteConfig.checkoutUrl} target="_blank" rel="noopener noreferrer">{dictionary.cta.buy}<ArrowRight aria-hidden="true" size={18} /></a>
              <a className="button button-secondary" href={whatsapp} target="_blank" rel="noopener noreferrer" data-ga-event="clique_whatsapp" data-ga-file-name="not_applicable"><MessageCircle aria-hidden="true" size={18} />{dictionary.cta.whatsapp}</a>
              <a className="text-link" href={siteConfig.formUrl} target="_blank" rel="noopener noreferrer">{dictionary.cta.info}</a>
            </div>
          </div>
        </section>

        <section className="section ecosystem-section" id="ecosystem" aria-labelledby="ecosystem-title">
          <div className="container">
            <SectionTitle label={dictionary.ecosystem.label} title={dictionary.ecosystem.title} id="ecosystem-title" />
            <p className="ecosystem-lead fade-up">{dictionary.ecosystem.lead}</p>
            <p className="ecosystem-copy fade-up">{dictionary.ecosystem.text}</p>
            <div className="ecosystem-grid fade-up">
              {ecosystemBrands.map((brand) => <div className={`ecosystem-card ${brand.className}`} key={brand.name}><img src={brand.src} alt={brand.name} loading="lazy" decoding="async" /></div>)}
            </div>
            <p className="ecosystem-disclaimer">{dictionary.ecosystem.disclaimer}</p>
          </div>
        </section>

        <section className="section section-alt" id="news">
          <div className="container">
            <SectionTitle label={dictionary.news.label} title={dictionary.news.title} description={dictionary.news.description} />
            <div className="fade-up"><NewsGrid dictionary={dictionary} items={marketNews.items.slice(0, 3)} locale={locale} /></div>
            <div className="section-action fade-up">
              <span>{dictionary.news.updated}</span>
              <a className="text-link" href={`/${locale}/news/`}>{dictionary.news.all}<ArrowRight aria-hidden="true" size={16} /></a>
            </div>
          </div>
        </section>
      </main>

      <Footer locale={locale} dictionary={dictionary} />
      <a className="whatsapp-float" href={whatsapp} target="_blank" rel="noopener noreferrer" aria-label={dictionary.cta.whatsapp} title={dictionary.cta.whatsapp} data-ga-event="clique_whatsapp" data-ga-file-name="not_applicable">
        <MessageCircle aria-hidden="true" size={23} />
      </a>
    </>
  )
}
