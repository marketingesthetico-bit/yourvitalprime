import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";

export function AuthorBox({ lang }: { lang: Locale }) {
  const isEs = lang === "es";
  return (
    <aside
      className="my-12 py-8 px-1"
      style={{
        borderTop: "1px solid var(--color-border)",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      <p
        className="eyebrow eyebrow-accent mb-3"
        style={{ marginBottom: "0.75rem" }}
      >
        {isEs ? "Quién escribió esto" : "Who wrote this"}
      </p>
      <h3
        style={{
          fontSize: "1.375rem",
          margin: 0,
          color: "var(--color-primary)",
          letterSpacing: "-0.015em",
          lineHeight: 1.25,
        }}
      >
        {isEs
          ? "El equipo editorial de YourVitalPrime"
          : "The YourVitalPrime editorial team"}
      </h3>
      <p
        className="mt-3 text-[1.0625rem] leading-relaxed max-w-2xl"
        style={{ color: "var(--color-text-soft)", margin: "0.75rem 0 0" }}
      >
        {isEs
          ? "Investigamos estudios revisados por pares, descartamos lo que no aguanta el escrutinio, y escribimos lo que nos hubiera gustado encontrar para nuestros padres. Cada artículo se actualiza cuando aparece evidencia nueva relevante. "
          : "We dig through peer-reviewed research, throw out what doesn't hold up, and write what we wish was waiting for our parents. Every piece gets updated when meaningful new evidence lands. "}
        <Link href={`/${lang}/about`}>
          {isEs ? "Cómo trabajamos." : "How we work."}
        </Link>
      </p>
      <p
        className="mt-4 italic text-sm"
        style={{
          fontFamily: "var(--font-display)",
          color: "var(--color-text-muted)",
        }}
      >
        {isEs ? "— Madrid" : "— Madrid"}
      </p>
    </aside>
  );
}
