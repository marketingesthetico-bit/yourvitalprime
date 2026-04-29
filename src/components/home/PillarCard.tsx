import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Pillar } from "@/content/pillars";

type PillarCardProps = {
  lang: Locale;
  pillar: Pillar;
  name: string;
  question: string;
  blurb: string;
};

/**
 * Editorial-style entry. Numbered (01–05), typographic, no abstract icon.
 * Renders as a row in a list — see PillarList below for the container.
 */
export function PillarCard({
  lang,
  pillar,
  name,
  question,
  blurb,
}: PillarCardProps) {
  return (
    <Link
      href={`/${lang}/${pillar.slug}`}
      className="group block py-8 lg:py-10 no-underline border-t transition-colors"
      style={{
        color: "var(--color-text)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="grid gap-4 lg:grid-cols-[88px_minmax(0,1fr)_auto] lg:items-baseline">
        <span
          className="block tabular-nums"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.25rem",
            fontWeight: 500,
            color: "var(--color-secondary)",
            letterSpacing: "0.05em",
          }}
          aria-hidden="true"
        >
          {String(pillar.order).padStart(2, "0")}
        </span>
        <div>
          <h3
            className="transition-colors"
            style={{
              fontSize: "clamp(1.5rem, 2.6vw, 1.875rem)",
              color: "var(--color-primary)",
              margin: 0,
              lineHeight: 1.2,
              letterSpacing: "-0.015em",
              fontWeight: 600,
            }}
          >
            {name}
          </h3>
          <p
            className="mt-2"
            style={{
              fontSize: "1.0625rem",
              color: "var(--color-text-soft)",
              margin: 0,
              lineHeight: 1.55,
              fontStyle: "italic",
              fontFamily: "var(--font-body)",
            }}
          >
            {question}
          </p>
          <p
            className="mt-3 max-w-2xl"
            style={{
              fontSize: "1rem",
              color: "var(--color-text-muted)",
              margin: "0.75rem 0 0",
              lineHeight: 1.6,
            }}
          >
            {blurb}
          </p>
        </div>
        <span
          className="hidden lg:flex items-center gap-2 self-center"
          style={{
            fontFamily: "var(--font-ui)",
            fontSize: "0.85rem",
            fontWeight: 500,
            color: "var(--color-secondary)",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
          aria-hidden="true"
        >
          {lang === "es" ? "Leer" : "Read"}
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            className="transition-transform group-hover:translate-x-1"
          >
            <path
              d="M5 12h14M13 6l6 6-6 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </Link>
  );
}
