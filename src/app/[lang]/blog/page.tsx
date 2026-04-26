import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getStrings } from "@/lib/i18n/strings";
import { PageHeader } from "@/components/layout/PageHeader";
import { ArticleCard } from "@/components/article/ArticleCard";
import { listPublishedArticles } from "@/lib/articles";
import { pillars } from "@/content/pillars";

type PageProps = { params: { lang: string } };

export const dynamic = "force-dynamic";
export const revalidate = 60;

export function generateMetadata({ params }: PageProps): Metadata {
  if (!isLocale(params.lang)) return {};
  return {
    title: params.lang === "es" ? "Blog" : "Blog",
    description:
      params.lang === "es"
        ? "Guías de salud y longevidad para adultos de 50+."
        : "Health and longevity guides for adults 50+.",
    alternates: { canonical: `/${params.lang}/blog` },
  };
}

export default async function BlogIndex({ params }: PageProps) {
  if (!isLocale(params.lang)) notFound();
  const lang: Locale = params.lang;
  const s = getStrings(lang);
  const isEs = lang === "es";

  const articles = await listPublishedArticles({ lang, limit: 24 }).catch(
    () => []
  );

  return (
    <>
      <PageHeader
        title={isEs ? "Todos los artículos" : "All articles"}
        subtitle={
          isEs
            ? "Filtra por tema. Guías nuevas cada dos días."
            : "Filter by topic. New guides every two days."
        }
      />
      <section className="container-wide py-14">
        {/* Pillar filter row */}
        <div
          className="flex flex-wrap gap-2 mb-10"
          style={{ fontFamily: "var(--font-ui)" }}
        >
          {pillars.map((p) => (
            <Link
              key={p.slug}
              href={`/${lang}/${p.slug}`}
              className="badge no-underline transition-colors"
              style={{ padding: "0.5rem 1rem", fontSize: "0.875rem" }}
            >
              {s.pillars[p.slug].name}
            </Link>
          ))}
        </div>

        {articles.length === 0 ? (
          <div
            className="card p-12 text-center max-w-2xl mx-auto"
            style={{
              backgroundColor: "var(--color-surface-2)",
              borderStyle: "dashed",
              borderColor: "var(--color-border-strong)",
            }}
          >
            <p
              className="text-[1.0625rem] m-0"
              style={{ color: "var(--color-text-soft)" }}
            >
              {s.home.emptyArticles}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard
                key={article.slug}
                article={article}
                lang={lang}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
