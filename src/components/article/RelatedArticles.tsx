import type { Article } from "@/lib/articles";
import type { Locale } from "@/lib/i18n/config";
import { ArticleCard } from "./ArticleCard";

type Props = {
  articles: Article[];
  lang: Locale;
};

export function RelatedArticles({ articles, lang }: Props) {
  if (!articles || articles.length === 0) return null;
  const isEs = lang === "es";

  return (
    <section
      className="mt-16 pt-12 border-t"
      style={{ borderColor: "var(--color-border)" }}
    >
      <h2
        className="mb-8"
        style={{
          fontSize: "1.875rem",
          color: "var(--color-primary)",
          letterSpacing: "-0.015em",
        }}
      >
        {isEs ? "Sigue leyendo" : "Keep reading"}
      </h2>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {articles.slice(0, 3).map((article) => (
          <ArticleCard key={article.slug} article={article} lang={lang} />
        ))}
      </div>
    </section>
  );
}
