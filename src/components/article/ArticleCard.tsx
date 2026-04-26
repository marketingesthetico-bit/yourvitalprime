import Link from "next/link";
import type { Article } from "@/lib/articles";
import type { Locale } from "@/lib/i18n/config";
import { getStrings } from "@/lib/i18n/strings";

type Props = {
  article: Article;
  lang: Locale;
  variant?: "default" | "compact" | "featured";
};

export function ArticleCard({ article, lang, variant = "default" }: Props) {
  const s = getStrings(lang);
  const isFeatured = variant === "featured";
  const isCompact = variant === "compact";

  return (
    <Link
      href={`/${lang}/blog/${article.slug}`}
      className="card group block no-underline overflow-hidden"
      style={{ color: "var(--color-text)" }}
    >
      {article.featured_image_url && (
        <div
          className={`relative overflow-hidden ${isFeatured ? "aspect-[16/9]" : "aspect-[16/10]"}`}
          style={{ backgroundColor: "var(--color-surface-2)" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.featured_image_url}
            alt=""
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
      )}
      <div className={isFeatured ? "p-7 lg:p-8" : isCompact ? "p-4" : "p-5 lg:p-6"}>
        <span
          className="badge mb-3"
          style={{
            backgroundColor: "var(--color-secondary-50)",
            color: "var(--color-secondary-700)",
          }}
        >
          {s.pillars[article.pillar].name}
        </span>
        <h3
          style={{
            fontSize: isFeatured ? "1.625rem" : isCompact ? "1.0625rem" : "1.25rem",
            color: "var(--color-primary)",
            margin: 0,
            lineHeight: 1.25,
            letterSpacing: "-0.01em",
          }}
        >
          {article.title}
        </h3>
        {!isCompact && (
          <p
            className="mt-3 text-[0.95rem] leading-relaxed"
            style={{ color: "var(--color-text-soft)" }}
          >
            {article.meta_description}
          </p>
        )}
        <div
          className="mt-4 flex items-center gap-3 text-sm"
          style={{
            fontFamily: "var(--font-ui)",
            color: "var(--color-text-muted)",
          }}
        >
          <time dateTime={article.published_at ?? undefined}>
            {formatDate(article.published_at, lang)}
          </time>
          <span aria-hidden="true">·</span>
          <span>
            {article.reading_time_min} {lang === "es" ? "min de lectura" : "min read"}
          </span>
        </div>
      </div>
    </Link>
  );
}

function formatDate(iso: string | null | undefined, lang: Locale): string {
  if (!iso) return "";
  try {
    return new Intl.DateTimeFormat(lang === "es" ? "es-ES" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(iso));
  } catch {
    return "";
  }
}
