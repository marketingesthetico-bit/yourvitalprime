import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { locales } from "@/lib/i18n/config";
import { getStrings } from "@/lib/i18n/strings";
import { Logo } from "./Logo";

type FooterProps = { lang: Locale };

export function Footer({ lang }: FooterProps) {
  const strings = getStrings(lang);
  const year = new Date().getFullYear();

  const exploreLinks = [
    { href: `/${lang}/blog`, label: strings.footer.links.blog },
    { href: `/${lang}/muscle-strength`, label: strings.pillars["muscle-strength"].name },
    { href: `/${lang}/hormonal-health`, label: strings.pillars["hormonal-health"].name },
    { href: `/${lang}/supplementation`, label: strings.pillars.supplementation.name },
    { href: `/${lang}/longevity`, label: strings.pillars.longevity.name },
    { href: `/${lang}/mental-vitality`, label: strings.pillars["mental-vitality"].name },
  ];

  const aboutLinks = [
    { href: `/${lang}/about`, label: strings.footer.links.about },
    { href: `/${lang}/contact`, label: strings.footer.links.contact },
  ];

  const legalLinks = [
    { href: `/${lang}/privacy`, label: strings.footer.links.privacy },
    { href: `/${lang}/terms`, label: strings.footer.links.terms },
    { href: `/${lang}/disclaimer`, label: strings.footer.links.disclaimer },
  ];

  const baseTextColor = "color-mix(in srgb, var(--color-surface) 78%, transparent)";
  const subTextColor = "color-mix(in srgb, var(--color-surface) 55%, transparent)";

  return (
    <footer
      className="mt-24 pt-16 pb-10"
      style={{
        backgroundColor: "var(--color-surface-ink)",
        color: baseTextColor,
      }}
    >
      <div className="container-wide">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <div style={{ color: "var(--color-surface)" }}>
              <Logo lang={lang} />
            </div>
            <p
              className="mt-5 max-w-md text-[1rem] leading-relaxed"
              style={{ color: baseTextColor }}
            >
              {strings.footer.description}
            </p>

            {/* Language switcher — quieter */}
            <div
              className="mt-6 flex items-center gap-3 text-sm"
              style={{
                fontFamily: "var(--font-ui)",
                color: subTextColor,
              }}
            >
              {locales.map((loc, i) => (
                <span key={loc} className="flex items-center gap-3">
                  {i > 0 && <span aria-hidden="true">/</span>}
                  <Link
                    href={`/${loc}`}
                    aria-current={loc === lang ? "page" : undefined}
                    className="no-underline hover:underline"
                    style={{
                      color:
                        loc === lang
                          ? "var(--color-secondary)"
                          : baseTextColor,
                      fontWeight: loc === lang ? 600 : 400,
                    }}
                  >
                    {loc === "en" ? "English" : "Español"}
                  </Link>
                </span>
              ))}
            </div>
          </div>

          <FooterColumn
            title={strings.footer.sections.explore}
            links={exploreLinks}
          />
          <FooterColumn
            title={strings.footer.sections.connect}
            links={aboutLinks}
          />
          <FooterColumn
            title={strings.footer.sections.legal}
            links={legalLinks}
          />
        </div>

        {/* Editorial signature line */}
        <div
          className="mt-14 pt-8"
          style={{
            borderTop: "1px solid color-mix(in srgb, var(--color-surface) 12%, transparent)",
            fontFamily: "var(--font-ui)",
          }}
        >
          <p
            className="leading-relaxed max-w-3xl text-sm"
            style={{ color: baseTextColor }}
          >
            <strong style={{ color: "var(--color-surface)" }}>
              {lang === "es" ? "Aviso médico:" : "Medical disclaimer:"}
            </strong>{" "}
            {strings.footer.medicalDisclaimer}
          </p>
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p
              className="text-sm italic"
              style={{
                color: subTextColor,
                fontFamily: "var(--font-display)",
                fontSize: "0.95rem",
              }}
            >
              {strings.footer.signature}
            </p>
            <p className="text-sm" style={{ color: subTextColor }}>
              {strings.footer.copyright.replace("{year}", String(year))}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h3
        className="text-sm uppercase mb-4"
        style={{
          fontFamily: "var(--font-ui)",
          fontWeight: 600,
          letterSpacing: "0.12em",
          color: "var(--color-secondary)",
        }}
      >
        {title}
      </h3>
      <ul className="flex flex-col gap-2.5" style={{ fontFamily: "var(--font-ui)" }}>
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-[0.95rem] no-underline transition-colors"
              style={{
                color: "color-mix(in srgb, var(--color-surface) 78%, transparent)",
              }}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
