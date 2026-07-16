const API_BASE = "https://api.pexels.com/v1";

export interface StockPhoto {
  id: string;
  url: string;
  alt: string;
  photographerName: string;
  photographerUrl: string;
  source: "pexels";
}

export function isPexelsConfigured(): boolean {
  return !!process.env.PEXELS_API_KEY;
}

export async function searchPexelsPhotos(
  query: string,
  perPage = 10
): Promise<StockPhoto[]> {
  const key = process.env.PEXELS_API_KEY;
  if (!key) return [];

  const url = new URL(`${API_BASE}/search`);
  url.searchParams.set("query", query);
  url.searchParams.set("per_page", String(perPage));
  url.searchParams.set("orientation", "landscape");

  const res = await fetch(url, {
    headers: { Authorization: key },
  });
  if (!res.ok) {
    console.warn(`[pexels] search failed (${res.status}) for "${query}"`);
    return [];
  }

  const data = (await res.json()) as {
    photos?: {
      id: number;
      alt?: string | null;
      src: { large2x: string };
      photographer: string;
      photographer_url: string;
    }[];
  };

  return (data.photos ?? []).map((p) => ({
    id: String(p.id),
    url: p.src.large2x,
    alt: p.alt || query,
    photographerName: p.photographer,
    photographerUrl: p.photographer_url,
    source: "pexels" as const,
  }));
}
