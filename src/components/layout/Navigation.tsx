"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import type { StringSet } from "@/lib/i18n/strings";

type NavItem = { href: string; label: string };

type NavigationProps = {
  lang: Locale;
  strings: StringSet;
};

export function Navigation({ lang, strings }: NavigationProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close on Esc + lock body scroll while menu open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const items: NavItem[] = [
    { href: `/${lang}/blog`, label: strings.nav.blog },
    { href: `/${lang}/muscle-strength`, label: strings.pillars["muscle-strength"].name },
    { href: `/${lang}/hormonal-health`, label: strings.pillars["hormonal-health"].name },
    { href: `/${lang}/supplementation`, label: strings.pillars.supplementation.name },
    { href: `/${lang}/longevity`, label: strings.pillars.longevity.name },
    { href: `/${lang}/about`, label: strings.nav.about },
  ];

  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(`${href}/`);

  return (
    <>
      {/* Desktop */}
      <nav
        aria-label="Primary"
        className="hidden lg:flex items-center gap-1"
        style={{ fontFamily: "var(--font-ui)" }}
      >
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="px-3 py-2 rounded-lg text-[0.95rem] font-medium no-underline transition-colors"
            style={{
              color: isActive(item.href) ? "var(--color-secondary)" : "var(--color-text)",
            }}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Mobile trigger */}
      <button
        type="button"
        aria-label={open ? strings.nav.closeMenu : strings.nav.openMenu}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((v) => !v)}
        className="lg:hidden inline-flex items-center justify-center rounded-lg p-2 -mr-2"
        style={{ color: "var(--color-primary)", minWidth: 48, minHeight: 48 }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          {open ? (
            <path
              d="M6 6l12 12M6 18L18 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          ) : (
            <>
              <path d="M4 7h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M4 12h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </>
          )}
        </svg>
      </button>

      {/* Mobile menu */}
      {open && (
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          className="lg:hidden fixed inset-0 z-50"
        >
          <div
            className="absolute inset-0"
            style={{ background: "rgba(26,26,46,0.4)" }}
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div
            className="absolute right-0 top-0 h-full w-[88%] max-w-sm shadow-2xl flex flex-col"
            style={{ backgroundColor: "var(--color-surface)" }}
          >
            <div
              className="flex items-center justify-between px-5 py-4 border-b"
              style={{ borderColor: "var(--color-border)" }}
            >
              <span
                className="text-sm uppercase tracking-wider"
                style={{
                  fontFamily: "var(--font-ui)",
                  color: "var(--color-text-muted)",
                  letterSpacing: "0.08em",
                }}
              >
                {strings.nav.pillars}
              </span>
              <button
                type="button"
                aria-label={strings.nav.closeMenu}
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center rounded-lg"
                style={{
                  color: "var(--color-primary)",
                  minWidth: 48,
                  minHeight: 48,
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M6 6l12 12M6 18L18 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
            <nav
              aria-label="Primary mobile"
              className="flex-1 overflow-y-auto px-2 py-4"
              style={{ fontFamily: "var(--font-ui)" }}
            >
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center px-4 py-3 rounded-lg text-[1.0625rem] no-underline"
                  style={{
                    color: isActive(item.href)
                      ? "var(--color-secondary)"
                      : "var(--color-text)",
                    fontWeight: isActive(item.href) ? 600 : 500,
                  }}
                >
                  {item.label}
                </Link>
              ))}
              <div
                className="mt-4 pt-4 border-t px-4"
                style={{ borderColor: "var(--color-border)" }}
              >
                <Link
                  href={`/${lang}/contact`}
                  className="flex items-center px-0 py-3 text-[1.0625rem] no-underline"
                  style={{ color: "var(--color-text)", fontWeight: 500 }}
                >
                  {strings.nav.contact}
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
