import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Pillar } from "@/content/pillars";

type PillarCardProps = {
  lang: Locale;
  pillar: Pillar;
  name: string;
  question: string;
};

export function PillarCard({ lang, pillar, name, question }: PillarCardProps) {
  const accentVar =
    pillar.accent === "primary"
      ? "var(--color-primary)"
      : pillar.accent === "secondary"
        ? "var(--color-secondary)"
        : "var(--color-accent)";
  const accentBg =
    pillar.accent === "primary"
      ? "var(--color-primary-50)"
      : pillar.accent === "secondary"
        ? "var(--color-secondary-50)"
        : "var(--color-accent-50)";

  return (
    <Link
      href={`/${lang}/${pillar.slug}`}
      className="card group block p-6 lg:p-7 no-underline h-full"
      style={{ color: "var(--color-text)" }}
    >
      <div
        className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-5"
        style={{ backgroundColor: accentBg, color: accentVar }}
        aria-hidden="true"
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
          <path d={pillar.iconPath} />
        </svg>
      </div>
      <h3
        className="mb-2"
        style={{ fontSize: "1.375rem", color: "var(--color-primary)" }}
      >
        {name}
      </h3>
      <p
        className="text-[1rem] leading-relaxed"
        style={{ color: "var(--color-text-soft)" }}
      >
        {question}
      </p>
      <span
        className="mt-5 inline-flex items-center gap-1.5 text-[0.95rem] font-medium"
        style={{ fontFamily: "var(--font-ui)", color: accentVar }}
      >
        {lang === "es" ? "Explorar" : "Explore"}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M5 12h14M13 6l6 6-6 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </Link>
  );
}
