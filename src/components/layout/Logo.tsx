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
      className={`group inline-flex items-baseline gap-1 no-underline ${className ?? ""}`}
      style={{ color: "var(--color-primary)" }}
    >
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          fontSize: "1.375rem",
          letterSpacing: "-0.02em",
          lineHeight: 1,
        }}
      >
        YourVitalPrime
      </span>
      <span
        aria-hidden="true"
        style={{
          fontFamily: "var(--font-display)",
          fontStyle: "italic",
          fontSize: "1.5rem",
          color: "var(--color-secondary)",
          lineHeight: 1,
          marginLeft: "1px",
          transform: "translateY(-1px)",
        }}
      >
        .
      </span>
    </Link>
  );
}
