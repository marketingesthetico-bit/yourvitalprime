export type PillarSlug =
  | "muscle-strength"
  | "hormonal-health"
  | "supplementation"
  | "longevity"
  | "mental-vitality";

export type Pillar = {
  slug: PillarSlug;
  /** Tailwind/CSS color token name from globals.css */
  accent: "primary" | "secondary" | "accent";
  /** Inline SVG icon string (rendered in pillar card). Single path, currentColor. */
  iconPath: string;
};

/**
 * The five YourVitalPrime content pillars.
 * Localized name + question come from src/lib/i18n/strings.ts.
 */
export const pillars: Pillar[] = [
  {
    slug: "muscle-strength",
    accent: "secondary",
    iconPath:
      "M6 6h2v12H6zM10 4h2v16h-2zM14 7h2v10h-2zM18 5h2v14h-2z",
  },
  {
    slug: "hormonal-health",
    accent: "accent",
    iconPath:
      "M12 2a5 5 0 0 0-5 5c0 2.5 2 4 2 6v2h6v-2c0-2 2-3.5 2-6a5 5 0 0 0-5-5zM9 17h6v2a3 3 0 0 1-6 0v-2z",
  },
  {
    slug: "supplementation",
    accent: "primary",
    iconPath:
      "M10.5 3.5a5 5 0 0 1 7 7l-7 7a5 5 0 1 1-7-7l7-7zm0 2.83-5.59 5.59a3 3 0 0 0 4.24 4.24L14.74 10.57 10.5 6.33z",
  },
  {
    slug: "longevity",
    accent: "accent",
    iconPath:
      "M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z",
  },
  {
    slug: "mental-vitality",
    accent: "primary",
    iconPath:
      "M12 3a4 4 0 0 0-4 4v.5A3.5 3.5 0 0 0 6 11a3.5 3.5 0 0 0 1.5 2.87V16a3 3 0 0 0 3 3v2h3v-2a3 3 0 0 0 3-3v-2.13A3.5 3.5 0 0 0 18 11a3.5 3.5 0 0 0-2-3.5V7a4 4 0 0 0-4-4z",
  },
];
