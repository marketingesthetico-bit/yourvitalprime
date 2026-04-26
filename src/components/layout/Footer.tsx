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

  return (
    <footer
      className="mt-24 pt-16 pb-10"
      style={{
        backgroundColor: "var(--color-primary)",
        color: "color-mix(in srgb, var(--color-surface) 85%, transparent)",
      }}
    >
      <div className="container-wide">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <div style={{ color: "var(--color-surface)" }}>
              <Logo lang={lang} />
            </div>
            <p
              className="mt-4 max-w-md text-[1rem] leading-relaxed"
              style={{ color: "color-mix(in srgb, var(--color-surface) 75%, transparent)" }}
            >
              {strings.footer.description}
            </p>

            {/* Language switcher */}
            <div
              className="mt-6 flex items-center gap-2 text-sm"
              style={{
                fontFamily: "var(--font-ui)",
                color: "color-mix(in srgb, var(--color-surface) 60%, transparent)",
              }}
            >
              <span aria-hidden="true">🌐</span>
              {locales.map((loc, i) => (
                <span key={loc} className="flex items-center gap-2">
                  {i > 0 && <span aria-hidden="true">·</span>}
                  <Link
                    href={`/${loc}`}
                    aria-current={loc === lang ? "page" : undefined}
                    className="no-underline hover:underline"
                    style={{
                      color:
                        loc === lang
                          ? "var(--color-secondary)"
                          : "color-mix(in srgb, var(--color-surface) 80%, transparent)",
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

        <div
          className="mt-14 pt-8 border-t flex flex-col gap-4 text-sm"
          style={{
            borderColor: "color-mix(in srgb, var(--color-surface) 18%, transparent)",
            fontFamily: "var(--font-ui)",
          }}
        >
          <p
            className="leading-relaxed max-w-3xl"
            style={{ color: "color-mix(in srgb, var(--color-surface) 65%, transparent)" }}
          >
            <strong style={{ color: "var(--color-surface)" }}>
              {lang === "es" ? "Aviso médico:" : "Medical disclaimer:"}
            </strong>{" "}
            {strings.footer.medicalDisclaimer}
          </p>
          <p style={{ color: "color-mix(in srgb, var(--color-surface) 55%, transparent)" }}>
            {strings.footer.copyright.replace("{year}", String(year))}
          </p>
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
          letterSpacing: "0.08em",
          color: "var(--color-surface)",
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
                color: "color-mix(in srgb, var(--color-surface) 80%, transparent)",
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
