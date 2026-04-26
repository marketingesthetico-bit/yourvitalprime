import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getStrings } from "@/lib/i18n/strings";
import { PageHeader } from "@/components/layout/PageHeader";
import { ArticleCard } from "@/components/article/ArticleCard";
import { listPublishedArticles } from "@/lib/articles";
import { pillars, type PillarSlug } from "@/content/pillars";

type PageProps = { params: { lang: string; pillar: string } };

export const dynamic = "force-dynamic";
export const revalidate = 60;

const PILLAR_SLUGS: readonly PillarSlug[] = pillars.map((p) => p.slug);

function isPillarSlug(value: string): value is PillarSlug {
  return (PILLAR_SLUGS as readonly string[]).includes(value);
}

export function generateStaticParams() {
  return PILLAR_SLUGS.flatMap((pillar) => [
    { lang: "en", pillar },
    { lang: "es", pillar },
  ]);
}

export function generateMetadata({ params }: PageProps): Metadata {
  if (!isLocale(params.lang) || !isPillarSlug(params.pillar)) return {};
  const s = getStrings(params.lang);
  const pillar = s.pillars[params.pillar];
  return {
    title: pillar.name,
    description: pillar.question,
    alternates: { canonical: `/${params.lang}/${params.pillar}` },
  };
}

export default async function PillarPage({ params }: PageProps) {
  if (!isLocale(params.lang)) notFound();
  if (!isPillarSlug(params.pillar)) notFound();

  const lang: Locale = params.lang;
  const pillarSlug: PillarSlug = params.pillar;
  const s = getStrings(lang);
  const pillarStrings = s.pillars[pillarSlug];
  const isEs = lang === "es";

  const articles = await listPublishedArticles({
    lang,
    pillar: pillarSlug,
    limit: 24,
  }).catch(() => []);

  return (
    <>
      <PageHeader
        meta={isEs ? "Tema" : "Topic"}
        title={pillarStrings.name}
        subtitle={pillarStrings.question}
      />
      <section className="container-wide py-14">
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
              {isEs
                ? "Aún no hay artículos publicados en este tema. Vuelve pronto."
                : "No articles published in this topic yet. Check back soon."}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} lang={lang} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
