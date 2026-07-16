import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getStrings } from "@/lib/i18n/strings";
import { PageHeader } from "@/components/layout/PageHeader";
import { ArticleCard } from "@/components/article/ArticleCard";
import { SiteImage } from "@/components/ui/SiteImage";
import { Pagination } from "@/components/ui/Pagination";
import { listPublishedArticles, countPublishedArticles } from "@/lib/articles";
import { pillars, type PillarSlug } from "@/content/pillars";

const PAGE_SIZE = 24;

type PageProps = {
  params: { lang: string; pillar: string };
  searchParams: { page?: string };
};

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

export default async function PillarPage({ params, searchParams }: PageProps) {
  if (!isLocale(params.lang)) notFound();
  if (!isPillarSlug(params.pillar)) notFound();

  const lang: Locale = params.lang;
  const pillarSlug: PillarSlug = params.pillar;
  const s = getStrings(lang);
  const pillarStrings = s.pillars[pillarSlug];
  const isEs = lang === "es";

  const page = Math.max(1, Number(searchParams.page ?? "1") || 1);
  const [articles, total] = await Promise.all([
    listPublishedArticles({
      lang,
      pillar: pillarSlug,
      limit: PAGE_SIZE,
      offset: (page - 1) * PAGE_SIZE,
    }).catch(() => []),
    countPublishedArticles({ lang, pillar: pillarSlug }).catch(() => 0),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <>
      <PageHeader
        meta={isEs ? "Tema" : "Topic"}
        title={pillarStrings.name}
        subtitle={pillarStrings.question}
      />
      <div className="container-wide pt-10">
        <div
          className="overflow-hidden"
          style={{
            borderRadius: "var(--radius-card)",
            boxShadow: "var(--shadow-card)",
            maxWidth: "1024px",
            marginInline: "auto",
          }}
        >
          <SiteImage
            name="pillars-banner.jpg"
            alt=""
            aspect="21/9"
            position="center 40%"
            placeholderLabel={pillarStrings.name}
          />
        </div>
      </div>
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

        <Pagination
          lang={lang}
          page={page}
          totalPages={totalPages}
          basePath={`/${lang}/${pillarSlug}`}
        />
      </section>
    </>
  );
}
