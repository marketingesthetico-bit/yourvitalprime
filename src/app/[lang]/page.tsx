import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getStrings } from "@/lib/i18n/strings";
import { pillars } from "@/content/pillars";
import { PillarCard } from "@/components/home/PillarCard";
import { NewsletterForm } from "@/components/home/NewsletterForm";
import { ArticleCard } from "@/components/article/ArticleCard";
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
      {/* ── Hero ───────────────────────────────────────────────── */}
      <section
        className="relative"
        style={{ backgroundColor: "var(--color-surface)" }}
      >
        <div className="container-narrow pt-16 pb-12 lg:pt-24 lg:pb-16">
          <p className="eyebrow eyebrow-accent mb-6">
            {s.home.heroDateline}
          </p>
          <h1
            className="max-w-[18ch]"
            style={{
              fontSize: "clamp(2.25rem, 5.4vw, 4rem)",
              lineHeight: 1.04,
              letterSpacing: "-0.025em",
              color: "var(--color-primary)",
              fontWeight: 600,
              marginBottom: "1.5rem",
            }}
          >
            {s.home.heroTitle}
          </h1>
          <p
            className="max-w-2xl"
            style={{
              fontSize: "clamp(1.125rem, 1.8vw, 1.375rem)",
              lineHeight: 1.55,
              color: "var(--color-text-soft)",
              fontFamily: "var(--font-body)",
              marginBottom: "2rem",
            }}
          >
            {s.home.heroSubtitle}
          </p>
          <div className="flex flex-wrap gap-3 mb-10">
            <Link href={`/${lang}/blog`} className="btn-primary">
              {s.home.heroCtaPrimary}
            </Link>
            <Link href={`/${lang}/blog`} className="btn-secondary">
              {s.home.heroCtaSecondary}
            </Link>
          </div>
          <p
            className="max-w-xl text-[0.95rem] leading-relaxed"
            style={{
              color: "var(--color-text-muted)",
              fontFamily: "var(--font-ui)",
              borderTop: "1px solid var(--color-border)",
              paddingTop: "1.25rem",
            }}
          >
            {s.home.trustLine}
          </p>
        </div>
      </section>

      {/* ── Recently / Latest ───────────────────────────────────── */}
      <section
        className="py-16 lg:py-20 border-y"
        style={{
          backgroundColor: "var(--color-surface-2)",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="container-wide">
          <SectionHead
            eyebrow={s.home.latestEyebrow}
            title={s.home.latestTitle}
            subtitle={s.home.latestSubtitle}
          />

          {articles.length === 0 ? (
            <p
              className="max-w-xl text-[1.0625rem] italic"
              style={{
                color: "var(--color-text-soft)",
                fontFamily: "var(--font-body)",
                marginTop: "1.5rem",
              }}
            >
              {s.home.emptyArticles}
            </p>
          ) : (
            <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] mt-10">
              {/* Featured */}
              {feature && (
                <ArticleCard article={feature} lang={lang} variant="featured" />
              )}
              {/* Stack of secondary */}
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

      {/* ── Editorial letter ────────────────────────────────────── */}
      <section className="py-20 lg:py-28">
        <div className="container-narrow">
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
            className="max-w-2xl"
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
      </section>

      {/* ── Pillars ─────────────────────────────────────────────── */}
      <section
        className="py-20 lg:py-28"
        style={{
          backgroundColor: "var(--color-surface-2)",
        }}
      >
        <div className="container-narrow">
          <SectionHead
            eyebrow={s.home.pillarsEyebrow}
            title={s.home.pillarsTitle}
            subtitle={s.home.pillarsSubtitle}
          />
          <div className="mt-10 lg:mt-14">
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
            {/* Closing border */}
            <div
              style={{ borderTop: "1px solid var(--color-border)", marginTop: 0 }}
            />
          </div>
        </div>
      </section>

      {/* ── Newsletter ──────────────────────────────────────────── */}
      <section
        className="py-20 lg:py-28"
        style={{ backgroundColor: "var(--color-surface)" }}
      >
        <div className="container-narrow text-center">
          <p className="eyebrow eyebrow-accent mb-5">
            {s.home.newsletterEyebrow}
          </p>
          <h2
            className="mb-4 max-w-[18ch] mx-auto"
            style={{
              fontSize: "clamp(1.75rem, 3.2vw, 2.25rem)",
              color: "var(--color-primary)",
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
              color: "var(--color-text-soft)",
            }}
          >
            {s.home.newsletterSubtitle}
          </p>
          <NewsletterForm strings={s.home} />
          <p
            className="mt-5 text-sm"
            style={{
              fontFamily: "var(--font-ui)",
              color: "var(--color-text-muted)",
            }}
          >
            {s.home.newsletterDisclaimer}
          </p>
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
