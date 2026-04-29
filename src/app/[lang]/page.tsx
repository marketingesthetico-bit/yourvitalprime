import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getStrings } from "@/lib/i18n/strings";
import { pillars } from "@/content/pillars";
import { PillarCard } from "@/components/home/PillarCard";
import { NewsletterForm } from "@/components/home/NewsletterForm";
import { ArticleCard } from "@/components/article/ArticleCard";
import { SiteImage } from "@/components/ui/SiteImage";
import { listPublishedArticles } from "@/lib/articles";

type PageProps = { params: { lang: string } };

export const dynamic = "force-dynamic";
export const revalidate = 60;

export function generateMetadata({ params }: PageProps): Metadata {
  if (!isLocale(params.lang)) return {};
  const s = getStrings(params.lang);
  return {
    title: s.home.heroTitle,
    description: s.home.heroSubtitle,
    alternates: {
      canonical: `/${params.lang}`,
      languages: { en: "/en", es: "/es" },
    },
  };
}

export default async function HomePage({ params }: PageProps) {
  if (!isLocale(params.lang)) notFound();
  const lang: Locale = params.lang;
  const s = getStrings(lang);

  const articles = await listPublishedArticles({ lang, limit: 7 }).catch(
    () => []
  );
  const [feature, ...rest] = articles;
  const secondary = rest.slice(0, 6);

  return (
    <>
      {/* ── Hero — full-bleed editorial cover ──────────────────── */}
      <section
        className="relative w-full"
        style={{
          /* Sit under the sticky header without a hard seam */
          marginTop: "-1px",
        }}
      >
        {/* Background photo */}
        <div className="absolute inset-0">
          <SiteImage
            name="hero-home.jpg"
            alt=""
            aspect="auto"
            position="center 35%"
            loading="eager"
            fetchPriority="high"
            className="absolute inset-0 w-full h-full"
            placeholderLabel="From the editors · Madrid"
          />
        </div>

        {/* Editorial overlay — left-weighted gradient for legibility */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(95deg, color-mix(in srgb, var(--color-surface-ink) 78%, transparent) 0%, color-mix(in srgb, var(--color-surface-ink) 55%, transparent) 38%, color-mix(in srgb, var(--color-surface-ink) 18%, transparent) 65%, transparent 100%)",
          }}
          aria-hidden="true"
        />

        {/* Subtle paper grain over the whole hero */}
        <div
          className="absolute inset-0 mix-blend-soft-light opacity-30 pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.95  0 0 0 0 0.92  0 0 0 0 0.85  0 0 0 0.55 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
          }}
          aria-hidden="true"
        />

        <div
          className="relative container-wide grid items-end"
          style={{
            minHeight: "min(78vh, 720px)",
            paddingTop: "8rem",
            paddingBottom: "4.5rem",
          }}
        >
          <div className="max-w-2xl" style={{ color: "var(--color-surface)" }}>
            <p
              className="eyebrow mb-5"
              style={{
                color: "var(--color-secondary-100)",
              }}
            >
              {s.home.heroDateline}
            </p>
            <h1
              className="max-w-[18ch]"
              style={{
                fontSize: "clamp(2.5rem, 5.8vw, 4.25rem)",
                lineHeight: 1.04,
                letterSpacing: "-0.025em",
                color: "var(--color-surface)",
                fontWeight: 600,
                marginBottom: "1.5rem",
                textShadow:
                  "0 1px 2px rgba(0,0,0,0.18), 0 8px 24px rgba(0,0,0,0.18)",
              }}
            >
              {s.home.heroTitle}
            </h1>
            <p
              className="max-w-xl"
              style={{
                fontSize: "clamp(1.0625rem, 1.6vw, 1.25rem)",
                lineHeight: 1.55,
                color: "color-mix(in srgb, var(--color-surface) 92%, transparent)",
                fontFamily: "var(--font-body)",
                marginBottom: "2rem",
              }}
            >
              {s.home.heroSubtitle}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href={`/${lang}/blog`} className="btn-primary">
                {s.home.heroCtaPrimary}
              </Link>
              <Link
                href={`/${lang}/blog`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-[10px] no-underline transition-colors"
                style={{
                  fontFamily: "var(--font-ui)",
                  fontSize: "1.0625rem",
                  fontWeight: 500,
                  color: "var(--color-surface)",
                  border:
                    "1.5px solid color-mix(in srgb, var(--color-surface) 50%, transparent)",
                  minHeight: 48,
                }}
              >
                {s.home.heroCtaSecondary}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust line — separated below the hero */}
      <section
        className="border-b"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="container-wide py-6">
          <p
            className="max-w-3xl text-[0.95rem] leading-relaxed"
            style={{
              color: "var(--color-text-muted)",
              fontFamily: "var(--font-ui)",
            }}
          >
            {s.home.trustLine}
          </p>
        </div>
      </section>

      {/* ── Recently / Latest ───────────────────────────────────── */}
      <section
        className="py-16 lg:py-20"
        style={{ backgroundColor: "var(--color-surface)" }}
      >
        <div className="container-wide">
          <SectionHead
            eyebrow={s.home.latestEyebrow}
            title={s.home.latestTitle}
            subtitle={s.home.latestSubtitle}
          />

          {articles.length === 0 ? (
            <p
              className="max-w-xl text-[1.0625rem] italic mt-6"
              style={{
                color: "var(--color-text-soft)",
                fontFamily: "var(--font-body)",
              }}
            >
              {s.home.emptyArticles}
            </p>
          ) : (
            <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] mt-10">
              {feature && (
                <ArticleCard article={feature} lang={lang} variant="featured" />
              )}
              <div className="flex flex-col">
                {secondary.map((article, i) => (
                  <Link
                    key={article.slug}
                    href={`/${lang}/blog/${article.slug}`}
                    className="block py-5 no-underline transition-colors"
                    style={{
                      color: "var(--color-text)",
                      borderTop:
                        i === 0
                          ? "none"
                          : "1px solid var(--color-border)",
                    }}
                  >
                    <p
                      className="eyebrow mb-2"
                      style={{ color: "var(--color-secondary)" }}
                    >
                      {s.pillars[article.pillar].name}
                    </p>
                    <h3
                      style={{
                        fontSize: "1.1875rem",
                        margin: 0,
                        color: "var(--color-primary)",
                        lineHeight: 1.3,
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {article.title}
                    </h3>
                    <p
                      className="mt-2 text-sm"
                      style={{
                        color: "var(--color-text-muted)",
                        fontFamily: "var(--font-ui)",
                      }}
                    >
                      {article.reading_time_min}{" "}
                      {lang === "es" ? "min de lectura" : "min read"}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {articles.length > 0 && (
            <div className="mt-10">
              <Link
                href={`/${lang}/blog`}
                className="inline-flex items-center gap-2 no-underline"
                style={{
                  fontFamily: "var(--font-ui)",
                  fontSize: "0.95rem",
                  fontWeight: 500,
                  color: "var(--color-secondary)",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                {lang === "es" ? "Ver todos los artículos" : "Browse all articles"}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── Editorial letter — text + still life image ────────── */}
      <section
        className="py-20 lg:py-28 border-y"
        style={{
          backgroundColor: "var(--color-surface-2)",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="container-wide">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20 items-center">
            <div>
              <p className="eyebrow eyebrow-accent mb-5">
                {s.home.letterEyebrow}
              </p>
              <h2
                className="mb-7 max-w-[20ch]"
                style={{
                  fontSize: "clamp(1.875rem, 3.6vw, 2.5rem)",
                  color: "var(--color-primary)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.15,
                }}
              >
                {s.home.letterTitle}
              </h2>
              <p
                className="max-w-xl"
                style={{
                  fontSize: "1.1875rem",
                  lineHeight: 1.7,
                  color: "var(--color-text-soft)",
                  fontFamily: "var(--font-body)",
                }}
              >
                {s.home.letterBody}
              </p>
              <p
                className="mt-6 italic"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.0625rem",
                  color: "var(--color-text-muted)",
                }}
              >
                {s.home.letterSignature}
              </p>
            </div>
            <div className="lg:order-first">
              <div
                className="overflow-hidden"
                style={{
                  borderRadius: "var(--radius-card)",
                  boxShadow: "var(--shadow-card)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <SiteImage
                  name="letter-section.jpg"
                  alt={
                    lang === "es"
                      ? "Cuaderno abierto sobre una mesa de madera con luz cálida"
                      : "Open notebook on a wooden desk in warm window light"
                  }
                  aspect="1/1"
                  placeholderLabel={lang === "es" ? "Madrid" : "Madrid"}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pillars ─────────────────────────────────────────────── */}
      <section
        className="py-20 lg:py-28"
        style={{ backgroundColor: "var(--color-surface)" }}
      >
        <div className="container-narrow">
          <SectionHead
            eyebrow={s.home.pillarsEyebrow}
            title={s.home.pillarsTitle}
            subtitle={s.home.pillarsSubtitle}
          />

          {/* Banner image above the list */}
          <div
            className="mt-10 mb-14 overflow-hidden"
            style={{
              borderRadius: "var(--radius-card)",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <SiteImage
              name="pillars-banner.jpg"
              alt={
                lang === "es"
                  ? "Persona caminando por una calle de Madrid en luz cálida"
                  : "Person walking through Madrid in warm afternoon light"
              }
              aspect="21/9"
              position="center 40%"
              placeholderLabel={lang === "es" ? "En movimiento" : "In motion"}
            />
          </div>

          <div>
            {pillars.map((p) => (
              <PillarCard
                key={p.slug}
                lang={lang}
                pillar={p}
                name={s.pillars[p.slug].name}
                question={s.pillars[p.slug].question}
                blurb={s.pillars[p.slug].blurb}
              />
            ))}
            <div
              style={{ borderTop: "1px solid var(--color-border)", marginTop: 0 }}
            />
          </div>
        </div>
      </section>

      {/* ── Newsletter — image background ────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{ backgroundColor: "var(--color-surface-ink)" }}
      >
        <div className="absolute inset-0 opacity-50">
          <SiteImage
            name="newsletter-bg.jpg"
            alt=""
            aspect="auto"
            position="center"
            className="absolute inset-0 w-full h-full"
          />
        </div>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(180deg, color-mix(in srgb, var(--color-surface-ink) 78%, transparent) 0%, color-mix(in srgb, var(--color-surface-ink) 86%, transparent) 100%)",
          }}
          aria-hidden="true"
        />
        <div className="relative py-20 lg:py-28">
          <div className="container-narrow text-center">
            <p
              className="eyebrow mb-5"
              style={{ color: "var(--color-secondary-100)" }}
            >
              {s.home.newsletterEyebrow}
            </p>
            <h2
              className="mb-4 max-w-[18ch] mx-auto"
              style={{
                fontSize: "clamp(1.875rem, 3.6vw, 2.5rem)",
                color: "var(--color-surface)",
                letterSpacing: "-0.02em",
                lineHeight: 1.15,
              }}
            >
              {s.home.newsletterTitle}
            </h2>
            <p
              className="mb-8 max-w-xl mx-auto"
              style={{
                fontSize: "1.0625rem",
                lineHeight: 1.65,
                color:
                  "color-mix(in srgb, var(--color-surface) 86%, transparent)",
              }}
            >
              {s.home.newsletterSubtitle}
            </p>
            <NewsletterForm strings={s.home} />
            <p
              className="mt-5 text-sm"
              style={{
                fontFamily: "var(--font-ui)",
                color:
                  "color-mix(in srgb, var(--color-surface) 65%, transparent)",
              }}
            >
              {s.home.newsletterDisclaimer}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

function SectionHead({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="eyebrow eyebrow-accent mb-4">{eyebrow}</p>
      <h2
        className="mb-3"
        style={{
          fontSize: "clamp(1.875rem, 3.6vw, 2.5rem)",
          color: "var(--color-primary)",
          letterSpacing: "-0.02em",
          lineHeight: 1.15,
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          style={{
            fontSize: "1.125rem",
            color: "var(--color-text-soft)",
            lineHeight: 1.55,
            margin: 0,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
