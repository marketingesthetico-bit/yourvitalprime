import { FieldValue } from "firebase-admin/firestore";
import {
  isUnsplashConfigured,
  searchUnsplashPhotos,
  trackUnsplashDownload,
  type StockPhoto as UnsplashPhoto,
} from "@/lib/unsplash";
import {
  isPexelsConfigured,
  searchPexelsPhotos,
  type StockPhoto as PexelsPhoto,
} from "@/lib/pexels";
import { getDb, isFirebaseConfigured } from "@/lib/firebase";

export interface ImageGenInput {
  slug: string;
  featured_query: string;
  inline_queries: [string, string];
}

export interface ArticleImage {
  url: string;
  alt: string;
  credit: {
    photographer: string;
    photographer_url: string;
    source: "unsplash" | "pexels";
  };
}

export interface ImageGenResult {
  featured: ArticleImage | null;
  inline: ArticleImage[];
}

type StockPhoto = UnsplashPhoto | PexelsPhoto;

const USED_IMAGES_COLLECTION = "used_stock_images";

/**
 * Find topic-relevant stock photos for the featured + inline slots of one
 * article, sourced from Unsplash (preferred) with Pexels as fallback.
 * Every pick is checked against every photo already used anywhere on the
 * site so images never repeat across articles.
 */
export async function generateArticleImages(
  input: ImageGenInput
): Promise<ImageGenResult> {
  const usedIds = await getUsedImageIds();

  const featured = await pickAndReserve(
    input.featured_query,
    usedIds,
    input.slug
  );

  const inline: ArticleImage[] = [];
  for (const query of input.inline_queries) {
    const pick = await pickAndReserve(query, usedIds, input.slug);
    if (pick) inline.push(pick);
  }

  return { featured, inline };
}

async function pickAndReserve(
  query: string,
  usedIds: Set<string>,
  slug: string
): Promise<ArticleImage | null> {
  const photo = await pickStockPhoto(query, usedIds);
  if (!photo) {
    console.warn(`[image-gen] no unused stock photo found for "${query}"`);
    return null;
  }

  usedIds.add(`${photo.source}:${photo.id}`);
  await reserveImage(photo, slug);

  if (photo.source === "unsplash") {
    trackUnsplashDownload((photo as UnsplashPhoto).downloadLocation);
  }

  return {
    url: photo.url,
    alt: photo.alt,
    credit: {
      photographer: photo.photographerName,
      photographer_url: photo.photographerUrl,
      source: photo.source,
    },
  };
}

async function pickStockPhoto(
  query: string,
  usedIds: Set<string>
): Promise<StockPhoto | null> {
  if (isUnsplashConfigured()) {
    const results = await searchUnsplashPhotos(query);
    const unused = results.find((p) => !usedIds.has(`unsplash:${p.id}`));
    if (unused) return unused;
  }

  if (isPexelsConfigured()) {
    const results = await searchPexelsPhotos(query);
    const unused = results.find((p) => !usedIds.has(`pexels:${p.id}`));
    if (unused) return unused;
  }

  return null;
}

async function getUsedImageIds(): Promise<Set<string>> {
  if (!isFirebaseConfigured()) return new Set();
  try {
    const refs = await getDb().collection(USED_IMAGES_COLLECTION).listDocuments();
    return new Set(refs.map((r) => r.id));
  } catch (error) {
    console.warn("[image-gen] failed to load used-image ledger:", error);
    return new Set();
  }
}

async function reserveImage(photo: StockPhoto, slug: string): Promise<void> {
  if (!isFirebaseConfigured()) return;
  const id = `${photo.source}_${photo.id}`;
  await getDb()
    .collection(USED_IMAGES_COLLECTION)
    .doc(id)
    .set({
      source: photo.source,
      photo_id: photo.id,
      used_in_slug: slug,
      used_at: FieldValue.serverTimestamp(),
    })
    .catch((error) =>
      console.warn(`[image-gen] failed to reserve ${id}:`, error)
    );
}
