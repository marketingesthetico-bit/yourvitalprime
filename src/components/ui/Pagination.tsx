import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";

type PaginationProps = {
  lang: Locale;
  /** 1-indexed current page */
  page: number;
  totalPages: number;
  /** Base path without query string, e.g. "/en/blog" */
  basePath: string;
};

/**
 * Editorial-style pagination: "Page N of M" with Older/Newer, not numbered
 * pill buttons. Server-rendered links only — no client JS, no layout shift.
 */
export function Pagination({ lang, page, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null;
  const isEs = lang === "es";
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  const hrefFor = (p: number) => (p <= 1 ? basePath : `${basePath}?page=${p}`);

  return (
    <nav
      aria-label={isEs ? "Paginación de artículos" : "Article pagination"}
      className="mt-14 flex items-center justify-between gap-4"
      style={{
        fontFamily: "var(--font-ui)",
        borderTop: "1px solid var(--color-border)",
        paddingTop: "1.75rem",
      }}
    >
      {hasPrev ? (
        <Link
          href={hrefFor(page - 1)}
          className="inline-flex items-center gap-2 no-underline font-medium"
          style={{ color: "var(--color-primary)", minHeight: 48 }}
        >
          <span aria-hidden="true">←</span>
          {isEs ? "Más recientes" : "Newer"}
        </Link>
      ) : (
        <span aria-hidden="true" />
      )}

      <span className="eyebrow" style={{ letterSpacing: "0.1em" }}>
        {isEs
          ? `Página ${page} de ${totalPages}`
          : `Page ${page} of ${totalPages}`}
      </span>

      {hasNext ? (
        <Link
          href={hrefFor(page + 1)}
          className="inline-flex items-center gap-2 no-underline font-medium"
          style={{ color: "var(--color-primary)", minHeight: 48 }}
        >
          {isEs ? "Más antiguos" : "Older"}
          <span aria-hidden="true">→</span>
        </Link>
      ) : (
        <span aria-hidden="true" />
      )}
    </nav>
  );
}
