import Link from "next/link";
import type { Metadata } from "next";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getStrings } from "@/lib/i18n/strings";
import { pillars } from "@/content/pillars";
import { PillarCard } from "@/components/home/PillarCard";
import { NewsletterForm } from "@/components/home/NewsletterForm";
import { notFound } from "next/navigation";

type PageProps = { params: { lang: string } };

export function generateMetadata({ params }: PageProps): Metadata {
  if (!isLocale(params.lang)) return {};
  const s = getStrings(params.lang);
  return {
    title: s.home.heroTitle,
    description: s.home.heroSubtitle,
    alternates: {
      canonical: `/${params.lang}`,
      languages: {
        en: "/en",
        es: "/es",
      },
    },
  };
}

export default function HomePage({ params }: PageProps) {
  if (!isLocale(params.lang)) notFound();
  const lang: Locale = params.lang;
  const s = getStrings(lang);

  return (
    <>
      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, var(--color-surface-2) 0%, var(--color-surface) 100%)",
        }}
      >
        <div className="container-wide pt-16 pb-20 lg:pt-24 lg:pb-28">
          <div className="max-w-3xl">
            <span
              className="badge mb-6"
              style={{
                backgroundColor: "var(--color-secondary-50)",
                color: "var(--color-secondary-700)",
              }}
            >
              {s.home.heroEyebrow}
            </span>
            <h1
              className="mb-6"
              style={{
                fontSize: "var(--text-hero)",
                lineHeight: 1.08,
                letterSpacing: "-0.02em",
                color: "var(--color-primary)",
              }}
            >
              {s.home.heroTitle}
            </h1>
            <p
              className="mb-8 max-w-2xl"
              style={{
                fontSize: "var(--text-body-lg)",
                lineHeight: 1.6,
                color: "var(--color-text-soft)",
              }}
            >
              {s.home.heroSubtitle}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href={`/${lang}/blog`} className="btn-primary">
                {s.home.heroCtaPrimary}
              </Link>
              <Link href={`/${lang}/blog`} className="btn-secondary">
                {s.home.heroCtaSecondary}
              </Link>
            </div>

            {/* Trust signals */}
            <div
              className="mt-10 flex flex-wrap gap-x-6 gap-y-3"
              style={{
                fontFamily: "var(--font-ui)",
                color: "var(--color-text-muted)",
              }}
            >
              <TrustSignal label={s.home.trustEvidence} />
              <TrustSignal label={s.home.trustReal} />
              <TrustSignal label={s.home.trustArticles} />
            </div>
          </div>
        </div>
      </section>

      {/* Featured / latest empty state */}
      <section className="container-wide py-20">
        <SectionHeader title={s.home.latestTitle} subtitle={s.home.latestSubtitle} />
        <div
          className="card p-12 lg:p-16 text-center max-w-3xl mx-auto"
          style={{
            backgroundColor: "var(--color-surface-2)",
            borderStyle: "dashed",
            borderColor: "var(--color-border-strong)",
          }}
        >
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5"
            style={{
              backgroundColor: "var(--color-accent-50)",
              color: "var(--color-accent-700)",
            }}
            aria-hidden="true"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <p className="text-[1.125rem]" style={{ color: "var(--color-text-soft)" }}>
            {s.home.emptyArticles}
          </p>
        </div>
      </section>

      {/* Pillars */}
      <section
        className="py-20"
        style={{ backgroundColor: "var(--color-surface-2)" }}
      >
        <div className="container-wide">
          <SectionHeader
            title={s.home.pillarsTitle}
            subtitle={s.home.pillarsSubtitle}
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {pillars.map((p) => (
              <PillarCard
                key={p.slug}
                lang={lang}
                pillar={p}
                name={s.pillars[p.slug].name}
                question={s.pillars[p.slug].question}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="container-wide py-24">
        <div className="max-w-2xl mx-auto text-center">
          <h2
            className="mb-3"
            style={{ fontSize: "var(--text-h2)", color: "var(--color-primary)" }}
          >
            {s.home.newsletterTitle}
          </h2>
          <p
            className="mb-8"
            style={{
              fontSize: "1.125rem",
              color: "var(--color-text-soft)",
              lineHeight: 1.6,
            }}
          >
            {s.home.newsletterSubtitle}
          </p>
          <NewsletterForm strings={s.home} />
          <p
            className="mt-4 text-sm"
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

function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="max-w-2xl mb-10 lg:mb-12">
      <h2
        className="mb-3"
        style={{
          fontSize: "var(--text-h2)",
          color: "var(--color-primary)",
          letterSpacing: "-0.015em",
        }}
      >
        {title}
      </h2>
      <p
        style={{
          fontSize: "1.125rem",
          color: "var(--color-text-soft)",
          lineHeight: 1.6,
        }}
      >
        {subtitle}
      </p>
    </div>
  );
}

function TrustSignal({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-[0.95rem]">
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        style={{ color: "var(--color-accent)" }}
      >
        <path
          d="M5 12.5l4 4 10-10"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {label}
    </span>
  );
}
