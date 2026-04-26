import { getDb, isFirebaseConfigured } from "@/lib/firebase";
import type { Locale } from "@/lib/i18n/config";
import type { PillarSlug } from "@/content/pillars";

export type FaqItem = { question: string; answer: string };

export type Article = {
  slug: string;
  lang: Locale;
  title: string;
  meta_description: string;
  keyword_primary: string;
  keywords_secondary?: string[];
  pillar: PillarSlug;
  content_mdx: string;
  content_html?: string | null;
  featured_image_url?: string | null;
  inline_images?: string[];
  word_count: number;
  reading_time_min: number;
  seo_score?: number;
  humanizer_score?: number;
  schema_faq?: FaqItem[];
  status: "published" | "draft";
  published_at?: string | null;
  author?: string;
};

type FirestoreTimestamp = {
  toDate?: () => Date;
  _seconds?: number;
  seconds?: number;
};

function toIso(value: unknown): string | null {
  if (!value) return null;
  if (typeof value === "string") return value;
  if (value instanceof Date) return value.toISOString();
  const ts = value as FirestoreTimestamp;
  if (typeof ts.toDate === "function") return ts.toDate().toISOString();
  if (typeof ts._seconds === "number") return new Date(ts._seconds * 1000).toISOString();
  if (typeof ts.seconds === "number") return new Date(ts.seconds * 1000).toISOString();
  return null;
}

function normalize(raw: Record<string, unknown>): Article {
  return {
    slug: String(raw.slug),
    lang: (raw.lang as Locale) ?? "en",
    title: String(raw.title ?? ""),
    meta_description: String(raw.meta_description ?? ""),
    keyword_primary: String(raw.keyword_primary ?? ""),
    keywords_secondary: Array.isArray(raw.keywords_secondary)
      ? (raw.keywords_secondary as string[])
      : [],
    pillar: (raw.pillar as PillarSlug) ?? "muscle-strength",
    content_mdx: String(raw.content_mdx ?? ""),
    content_html: (raw.content_html as string | null) ?? null,
    featured_image_url: (raw.featured_image_url as string | null) ?? null,
    inline_images: Array.isArray(raw.inline_images)
      ? (raw.inline_images as string[])
      : [],
    word_count: Number(raw.word_count ?? 0),
    reading_time_min: Number(raw.reading_time_min ?? 1),
    seo_score: typeof raw.seo_score === "number" ? raw.seo_score : undefined,
    humanizer_score:
      typeof raw.humanizer_score === "number" ? raw.humanizer_score : undefined,
    schema_faq: Array.isArray(raw.schema_faq)
      ? (raw.schema_faq as FaqItem[])
      : [],
    status: (raw.status as "published" | "draft") ?? "draft",
    published_at: toIso(raw.published_at),
    author: typeof raw.author === "string" ? raw.author : "editorial-team",
  };
}

export async function getArticleBySlug(
  slug: string,
  lang: Locale
): Promise<Article | null> {
  if (!isFirebaseConfigured()) return null;
  const db = getDb();
  const snapshot = await db.collection("articles").doc(slug).get();
  if (!snapshot.exists) return null;
  const data = snapshot.data();
  if (!data) return null;
  if (data.status !== "published") return null;
  if (data.lang && data.lang !== lang) return null;
  return normalize({ ...data, slug });
}

export type ListOptions = {
  lang: Locale;
  pillar?: PillarSlug;
  limit?: number;
  excludeSlug?: string;
};

export async function listPublishedArticles(
  opts: ListOptions
): Promise<Article[]> {
  if (!isFirebaseConfigured()) return [];
  const db = getDb();
  let query = db
    .collection("articles")
    .where("status", "==", "published")
    .where("lang", "==", opts.lang) as FirebaseFirestore.Query;

  if (opts.pillar) {
    query = query.where("pillar", "==", opts.pillar);
  }

  query = query.orderBy("published_at", "desc");
  if (opts.limit) query = query.limit(opts.limit);

  const snapshot = await query.get();
  return snapshot.docs
    .map((doc) => normalize({ ...doc.data(), slug: doc.id }))
    .filter((article) => article.slug !== opts.excludeSlug);
}

/**
 * Lightweight slug+lastmod listing for sitemap. Avoids full content fetch.
 */
export async function listSlugsForSitemap(): Promise<
  { slug: string; lang: Locale; lastModified: Date }[]
> {
  if (!isFirebaseConfigured()) return [];
  const db = getDb();
  const snapshot = await db
    .collection("articles")
    .where("status", "==", "published")
    .get();
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    const iso = toIso(data.published_at) ?? new Date().toISOString();
    return {
      slug: doc.id,
      lang: (data.lang as Locale) ?? "en",
      lastModified: new Date(iso),
    };
  });
}
