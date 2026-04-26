import type { Article } from "@/lib/articles";

type Props = {
  article: Article;
  url: string;
};

export function ArticleSchema({ article, url }: Props) {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    headline: article.title,
    description: article.meta_description,
    image: article.featured_image_url
      ? [article.featured_image_url]
      : ["https://yourvitalprime.com/og-default.jpg"],
    datePublished: article.published_at ?? undefined,
    dateModified: article.published_at ?? undefined,
    author: {
      "@type": "Organization",
      name: "YourVitalPrime Editorial",
      url: "https://yourvitalprime.com/en/about",
    },
    publisher: {
      "@type": "Organization",
      name: "YourVitalPrime",
      logo: {
        "@type": "ImageObject",
        url: "https://yourvitalprime.com/logo.png",
      },
    },
    keywords: [
      article.keyword_primary,
      ...(article.keywords_secondary ?? []),
    ].join(", "),
    wordCount: article.word_count,
    inLanguage: article.lang,
  };

  const faqSchema =
    article.schema_faq && article.schema_faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: article.schema_faq.map((q) => ({
            "@type": "Question",
            name: q.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: q.answer,
            },
          })),
        }
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
    </>
  );
}
