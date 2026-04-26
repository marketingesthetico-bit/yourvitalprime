"use client";

import { useEffect, useState } from "react";
import type { Heading } from "@/lib/markdown";

type TOCProps = {
  headings: Heading[];
  label: string;
};

export function TableOfContents({ headings, label }: TOCProps) {
  const [activeId, setActiveId] = useState<string | null>(
    headings[0]?.id ?? null
  );

  useEffect(() => {
    if (headings.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-100px 0px -70% 0px", threshold: 0 }
    );

    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav
      aria-label={label}
      className="text-[0.95rem]"
      style={{ fontFamily: "var(--font-ui)" }}
    >
      <h3
        className="text-sm uppercase mb-3"
        style={{
          letterSpacing: "0.08em",
          color: "var(--color-text-muted)",
          fontWeight: 600,
        }}
      >
        {label}
      </h3>
      <ul className="space-y-1.5 list-none p-0 m-0">
        {headings.map((h) => (
          <li
            key={h.id}
            style={{
              paddingLeft: h.level === 3 ? "0.875rem" : 0,
            }}
          >
            <a
              href={`#${h.id}`}
              className="block py-1 leading-snug no-underline transition-colors"
              style={{
                color:
                  activeId === h.id
                    ? "var(--color-secondary)"
                    : "var(--color-text-soft)",
                fontWeight: activeId === h.id ? 600 : 400,
                borderLeft:
                  activeId === h.id
                    ? "2px solid var(--color-secondary)"
                    : "2px solid transparent",
                paddingLeft: "0.5rem",
                marginLeft: "-0.625rem",
              }}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
