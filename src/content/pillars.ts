export type PillarSlug =
  | "muscle-strength"
  | "hormonal-health"
  | "supplementation"
  | "longevity"
  | "mental-vitality";

export type Pillar = {
  slug: PillarSlug;
  /** Display order — drives the numbered editorial labels (01, 02…). */
  order: number;
};

/**
 * The five YourVitalPrime content pillars, in their canonical editorial order.
 * Localized name, question and blurb come from src/lib/i18n/strings.ts.
 */
export const pillars: Pillar[] = [
  { slug: "muscle-strength", order: 1 },
  { slug: "hormonal-health", order: 2 },
  { slug: "supplementation", order: 3 },
  { slug: "longevity", order: 4 },
  { slug: "mental-vitality", order: 5 },
];
