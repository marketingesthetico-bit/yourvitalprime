const API_BASE = "https://api.unsplash.com";

export interface StockPhoto {
  id: string;
  url: string;
  alt: string;
  photographerName: string;
  photographerUrl: string;
  source: "unsplash";
  downloadLocation: string;
}

export function isUnsplashConfigured(): boolean {
  return !!process.env.UNSPLASH_ACCESS_KEY;
}

/**
 * Search Unsplash for photos matching `query`. Returns up to `perPage`
 * candidates so the caller can skip ones already used elsewhere on the site.
 */
export async function searchUnsplashPhotos(
  query: string,
  perPage = 10
): Promise<StockPhoto[]> {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) return [];

  const url = new URL(`${API_BASE}/search/photos`);
  url.searchParams.set("query", query);
  url.searchParams.set("per_page", String(perPage));
  url.searchParams.set("orientation", "landscape");
  url.searchParams.set("content_filter", "high");

  const res = await fetch(url, {
    headers: { Authorization: `Client-ID ${key}` },
  });
  if (!res.ok) {
    console.warn(`[unsplash] search failed (${res.status}) for "${query}"`);
    return [];
  }

  const data = (await res.json()) as {
    results?: {
      id: string;
      alt_description?: string | null;
      description?: string | null;
      urls: { regular: string };
      user: { name: string; links: { html: string } };
      links: { download_location: string };
    }[];
  };

  return (data.results ?? []).map((p) => ({
    id: p.id,
    url: p.urls.regular,
    alt: p.alt_description || p.description || query,
    photographerName: p.user.name,
    photographerUrl: p.user.links.html,
    source: "unsplash" as const,
    downloadLocation: p.links.download_location,
  }));
}

/**
 * Unsplash API guidelines require pinging the photo's download_location
 * whenever it's used in production. Fire-and-forget; never blocks the pipeline.
 */
export function trackUnsplashDownload(downloadLocation: string): void {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) return;
  fetch(downloadLocation, {
    headers: { Authorization: `Client-ID ${key}` },
  }).catch((error) => console.warn("[unsplash] download tracking failed:", error));
}
