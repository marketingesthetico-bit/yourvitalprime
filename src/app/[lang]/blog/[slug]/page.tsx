import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getStrings } from "@/lib/i18n/strings";
import { getArticleBySlug, listPublishedArticles } from "@/lib/articles";
import { renderArticleMarkdown } from "@/lib/markdown";
import { ArticleSchema } from "@/components/article/ArticleSchema";
import { TableOfContents } from "@/components/article/TableOfContents";
import { ReadingProgress } from "@/components/article/ReadingProgress";
import { AuthorBox } from "@/components/article/AuthorBox";
import { FaqSection } from "@/components/article/FaqSection";
import { RelatedArticles } from "@/components/article/RelatedArticles";

type PageProps = { params: { lang: string; slug: string } };

export const dynamic = "force-dynamic";
export const revalidate = 60;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  if (!isLocale(params.lang)) return {};
  const article = await getArticleBySlug(params.slug, params.lang).catch(
    () => null
  );
  if (!article) {
    return { title: "Article not found", robots: { index: false, follow: false } };
  }
  const url = `https://yourvitalprime.com/${params.lang}/blog/${params.slug}`;
  return {
    title: article.title,
    description: article.meta_description,
    alternates: {
      canonical: url,
      languages: {
        en: `https://yourvitalprime.com/en/blog/${params.slug}`,
        es: `https://yourvitalprime.com/es/blog/${params.slug}`,
      },
    },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.meta_description,
      url,
      images: article.featured_image_url
        ? [{ url: article.featured_image_url }]
        : undefined,
      publishedTime: article.published_at ?? undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.meta_description,
      images: article.featured_image_url
        ? [article.featured_image_url]
        : undefined,
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  if (!isLocale(params.lang)) notFound();
  const lang: Locale = params.lang;
  const s = getStrings(lang);

  const article = await getArticleBySlug(params.slug, lang).catch(() => null);
  if (!article) notFound();

  const { html, headings } = await renderArticleMarkdown(article.content_mdx);

  const related = await listPublishedArticles({
    lang,
    pillar: article.pillar,
    limit: 4,
    excludeSlug: article.slug,
  }).catch(() => []);

  const url = `https://yourvitalprime.com/${lang}/blog/${article.slug}`;
  const isEs = lang === "es";

  return (
    <>
      <ReadingProgress />
      <ArticleSchema article={article} url={url} />

      {/* Hero */}
      <header
        className="border-b"
        style={{
          backgroundColor: "var(--color-surface-2)",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="container-narrow py-10 lg:py-14">
          <nav
            aria-label="Breadcrumb"
            className="mb-6 text-sm"
            style={{
              fontFamily: "var(--font-ui)",
              color: "var(--color-text-muted)",
            }}
          >
            <Link
              href={`/${lang}/blog`}
              style={{ color: "var(--color-text-muted)" }}
            >
              {isEs ? "Todos los artículos" : "All articles"}
            </Link>
            <span aria-hidden="true" className="mx-2">›</span>
            <Link
              href={`/${lang}/${article.pillar}`}
              style={{ color: "var(--color-text-muted)" }}
            >
              {s.pillars[article.pillar].name}
            </Link>
          </nav>
          <h1
            style={{
              fontSize: "var(--text-h1)",
              color: "var(--color-primary)",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              marginBottom: "1rem",
            }}
          >
            {article.title}
          </h1>
          <p
            className="max-w-2xl"
            style={{
              fontSize: "var(--text-body-lg)",
              color: "var(--color-text-soft)",
              lineHeight: 1.55,
              marginBottom: "1.5rem",
            }}
          >
            {article.meta_description}
          </p>
          <div
            className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm"
            style={{
              fontFamily: "var(--font-ui)",
              color: "var(--color-text-muted)",
            }}
          >
            <span>
              {isEs ? "Equipo editorial" : "Editorial team"}
            </span>
            <span aria-hidden="true">·</span>
            <time dateTime={article.published_at ?? undefined}>
              {formatDate(article.published_at, lang)}
            </time>
            <span aria-hidden="true">·</span>
            <span>
              {article.reading_time_min}{" "}
              {isEs ? "min de lectura" : "min read"}
            </span>
            <span aria-hidden="true">·</span>
            <span>
              {article.word_count.toLocaleString(lang === "es" ? "es-ES" : "en-US")}{" "}
              {isEs ? "palabras" : "words"}
            </span>
          </div>
        </div>
      </header>

      {/* Featured image */}
      {article.featured_image_url && (
        <div
          className="container-wide py-8 lg:py-10"
          style={{ backgroundColor: "var(--color-surface)" }}
        >
          <div
            className="relative aspect-[16/9] overflow-hidden rounded-2xl mx-auto"
            style={{
              maxWidth: "1024px",
              backgroundColor: "var(--color-surface-2)",
              boxShadow: "var(--shadow-card)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.featured_image_url}
              alt={article.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Body + TOC */}
      <div className="container-wide pb-12">
        <div className="grid gap-10 lg:grid-cols-[240px_minmax(0,720px)] lg:gap-12 justify-center">
          {/* Sticky TOC */}
          <aside
            className="hidden lg:block"
            style={{ position: "sticky", top: "6rem", alignSelf: "start" }}
          >
            <TableOfContents
              headings={headings}
              label={isEs ? "En esta página" : "On this page"}
            />
          </aside>

          <article
            data-article
            className="prose-vital max-w-none"
          >
            <div dangerouslySetInnerHTML={{ __html: html }} />

            <FaqSection faq={article.schema_faq ?? []} lang={lang} />

            <AuthorBox lang={lang} />

            <p
              className="text-sm"
              style={{
                fontFamily: "var(--font-ui)",
                color: "var(--color-text-muted)",
                marginTop: "2rem",
              }}
            >
              <strong>
                {isEs ? "Aviso médico:" : "Medical disclaimer:"}
              </strong>{" "}
              {isEs
                ? "Este artículo es educativo y no sustituye el consejo de un profesional sanitario. "
                : "This article is educational and does not replace professional medical advice. "}
              <Link href={`/${lang}/disclaimer`}>
                {isEs ? "Léelo entero." : "Read the full disclaimer."}
              </Link>
            </p>

            <RelatedArticles articles={related} lang={lang} />
          </article>
        </div>
      </div>
    </>
  );
}

function formatDate(iso: string | null | undefined, lang: Locale): string {
  if (!iso) return "";
  try {
    return new Intl.DateTimeFormat(lang === "es" ? "es-ES" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(iso));
  } catch {
    return "";
  }
}
