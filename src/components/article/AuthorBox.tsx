import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";

export function AuthorBox({ lang }: { lang: Locale }) {
  const isEs = lang === "es";
  return (
    <aside
      className="my-12 p-6 lg:p-8 rounded-2xl"
      style={{
        backgroundColor: "var(--color-surface-2)",
        border: "1px solid var(--color-border)",
      }}
    >
      <div className="flex items-start gap-4">
        <div
          className="shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
          style={{
            backgroundColor: "var(--color-primary)",
            color: "var(--color-surface)",
            fontFamily: "var(--font-display)",
            fontSize: "1.25rem",
            fontWeight: 600,
          }}
          aria-hidden="true"
        >
          YV
        </div>
        <div>
          <p
            className="text-sm uppercase mb-1"
            style={{
              fontFamily: "var(--font-ui)",
              color: "var(--color-text-muted)",
              letterSpacing: "0.08em",
              fontWeight: 500,
            }}
          >
            {isEs ? "Equipo editorial" : "Editorial team"}
          </p>
          <h3
            style={{
              fontSize: "1.125rem",
              margin: 0,
              color: "var(--color-primary)",
            }}
          >
            YourVitalPrime
          </h3>
          <p
            className="mt-2 text-[0.95rem] leading-relaxed"
            style={{ color: "var(--color-text-soft)", margin: 0 }}
          >
            {isEs
              ? "Nuestro equipo investiga estudios revisados por pares y los traduce a guías prácticas para adultos de 50+. Cada artículo se redacta, revisa y actualiza cuando aparece evidencia nueva. "
              : "Our team digs through peer-reviewed research and translates it into practical guides for adults 50+. Every article is written, reviewed, and updated when meaningful new evidence lands. "}
            <Link href={`/${lang}/about`}>
              {isEs ? "Cómo trabajamos." : "How we work."}
            </Link>
          </p>
        </div>
      </div>
    </aside>
  );
}
