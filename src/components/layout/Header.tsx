import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { getStrings } from "@/lib/i18n/strings";
import { Logo } from "./Logo";
import { Navigation } from "./Navigation";

type HeaderProps = { lang: Locale };

export function Header({ lang }: HeaderProps) {
  const strings = getStrings(lang);

  return (
    <header
      className="sticky top-0 z-40 backdrop-blur-md"
      style={{
        backgroundColor: "color-mix(in srgb, var(--color-surface) 92%, transparent)",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-3 focus:py-2 focus:rounded"
        style={{
          backgroundColor: "var(--color-primary)",
          color: "var(--color-surface)",
          fontFamily: "var(--font-ui)",
        }}
      >
        {strings.nav.skipToContent}
      </a>
      <div className="container-wide flex items-center justify-between h-16 lg:h-20">
        <Logo lang={lang} />
        <div className="flex items-center gap-4">
          <Navigation lang={lang} strings={strings} />
          <Link
            href={`/${lang}/contact`}
            className="hidden lg:inline-flex btn-secondary"
            style={{ padding: "0.625rem 1.125rem", fontSize: "0.95rem" }}
          >
            {strings.nav.contact}
          </Link>
        </div>
      </div>
    </header>
  );
}
