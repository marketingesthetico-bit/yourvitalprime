import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { isLocale } from "@/lib/i18n/config";
import { getStrings } from "@/lib/i18n/strings";
import { PageHeader } from "@/components/layout/PageHeader";
import { pillars } from "@/content/pillars";

type PageProps = { params: { lang: string } };

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

export default function BlogIndex({ params }: PageProps) {
  if (!isLocale(params.lang)) notFound();
  const lang = params.lang;
  const s = getStrings(lang);
  const isEs = lang === "es";

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
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mb-12">
          {pillars.map((p) => (
            <Link
              key={p.slug}
              href={`/${lang}/${p.slug}`}
              className="card p-5 no-underline"
              style={{ color: "var(--color-text)" }}
            >
              <h3 style={{ fontSize: "1.125rem", margin: 0 }}>
                {s.pillars[p.slug].name}
              </h3>
              <p
                className="mt-1 text-[0.95rem]"
                style={{
                  color: "var(--color-text-muted)",
                  fontFamily: "var(--font-ui)",
                  marginBottom: 0,
                }}
              >
                {s.pillars[p.slug].question}
              </p>
            </Link>
          ))}
        </div>

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
      </section>
    </>
  );
}
