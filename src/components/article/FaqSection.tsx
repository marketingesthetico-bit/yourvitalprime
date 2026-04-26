import type { FaqItem } from "@/lib/articles";
import type { Locale } from "@/lib/i18n/config";

type Props = {
  faq: FaqItem[];
  lang: Locale;
};

export function FaqSection({ faq, lang }: Props) {
  if (!faq || faq.length === 0) return null;
  const isEs = lang === "es";
  return (
    <section
      id="faq"
      className="my-14 pt-10 border-t"
      style={{ borderColor: "var(--color-border)" }}
    >
      <h2
        style={{
          fontSize: "1.875rem",
          color: "var(--color-primary)",
          marginTop: 0,
          marginBottom: "1.5rem",
        }}
      >
        {isEs ? "Preguntas frecuentes" : "Frequently asked questions"}
      </h2>
      <div className="space-y-3">
        {faq.map((item, i) => (
          <details
            key={i}
            className="rounded-xl group"
            style={{
              backgroundColor: "var(--color-surface-2)",
              border: "1px solid var(--color-border)",
            }}
          >
            <summary
              className="cursor-pointer list-none px-5 py-4 flex items-start justify-between gap-4 font-medium"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.0625rem",
                color: "var(--color-primary)",
                lineHeight: 1.4,
              }}
            >
              <span>{item.question}</span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
                className="shrink-0 mt-0.5 transition-transform group-open:rotate-45"
                style={{ color: "var(--color-secondary)" }}
              >
                <path
                  d="M12 5v14M5 12h14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </summary>
            <div
              className="px-5 pb-5 text-[1.0625rem] leading-relaxed"
              style={{ color: "var(--color-text-soft)" }}
            >
              {item.answer}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
