import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";

type LogoProps = {
  lang: Locale;
  className?: string;
};

export function Logo({ lang, className }: LogoProps) {
  return (
    <Link
      href={`/${lang}`}
      aria-label="YourVitalPrime — home"
      className={`group inline-flex items-center gap-2.5 no-underline ${className ?? ""}`}
      style={{ color: "var(--color-primary)" }}
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <circle cx="16" cy="16" r="15" stroke="currentColor" strokeWidth="2" />
        <path
          d="M10 11l4 8 2-4 2 4 4-8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
      <span
        className="text-xl tracking-tight"
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          letterSpacing: "-0.015em",
        }}
      >
        YourVitalPrime
      </span>
    </Link>
  );
}
