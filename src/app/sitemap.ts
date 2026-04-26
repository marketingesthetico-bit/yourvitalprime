import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/config";
import { listSlugsForSitemap } from "@/lib/articles";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://yourvitalprime.com";

const STATIC_PATHS = [
  "",
  "/blog",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/disclaimer",
  "/muscle-strength",
  "/hormonal-health",
  "/supplementation",
  "/longevity",
  "/mental-vitality",
] as const;

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = locales.flatMap((lang) =>
    STATIC_PATHS.map((path) => ({
      url: `${SITE_URL}/${lang}${path}`,
      lastModified: now,
      changeFrequency:
        path === ""
          ? ("daily" as const)
          : path === "/blog"
            ? ("daily" as const)
            : ("monthly" as const),
      priority: path === "" ? 1 : path === "/blog" ? 0.9 : 0.6,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${SITE_URL}/${l}${path}`])
        ),
      },
    }))
  );

  const articleEntries: MetadataRoute.Sitemap = await listSlugsForSitemap()
    .then((rows) =>
      rows.map((row) => ({
        url: `${SITE_URL}/${row.lang}/blog/${row.slug}`,
        lastModified: row.lastModified,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }))
    )
    .catch(() => []);

  return [...staticEntries, ...articleEntries];
}
