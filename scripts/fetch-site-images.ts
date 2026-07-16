/**
 * YourVitalPrime — Site Chrome Image Fetcher
 * Run: tsx --env-file=.env.local scripts/fetch-site-images.ts
 *
 * Replaces the AI-generated site images (hero, section banners, OG default)
 * with real photos searched from Unsplash (primary) and Pexels (fallback).
 * Every pick is checked against the same Firestore `used_stock_images`
 * ledger the article pipeline uses, so site chrome and article photos never
 * repeat each other either.
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { initializeApp, cert, type ServiceAccount } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

const OUTPUT_DIR = path.resolve(process.cwd(), "public", "images");
const USED_IMAGES_COLLECTION = "used_stock_images";

type Spec = {
  name: string;
  query: string;
  orientation: "landscape" | "portrait" | "squarish";
  width: number;
};

const specs: Spec[] = [
  {
    name: "hero-home.jpg",
    query: "senior couple coffee kitchen morning conversation",
    orientation: "landscape",
    width: 2400,
  },
  {
    name: "letter-section.jpg",
    query: "notebook pen reading glasses coffee desk",
    orientation: "squarish",
    width: 1600,
  },
  {
    name: "pillars-banner.jpg",
    query: "senior woman walking city park afternoon",
    orientation: "landscape",
    width: 2400,
  },
  {
    name: "newsletter-bg.jpg",
    query: "wooden table coffee newspaper flat lay morning",
    orientation: "landscape",
    width: 2400,
  },
  {
    name: "about-detail.jpg",
    query: "journal notebook coffee desk workspace",
    orientation: "squarish",
    width: 1600,
  },
  {
    name: "og-default.jpg",
    query: "hands holding warm coffee mug",
    orientation: "landscape",
    width: 1792,
  },
];

function loadServiceAccount(): ServiceAccount {
  const fromPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  if (!fromPath) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_PATH not set in env.");
  }
  const abs = path.isAbsolute(fromPath)
    ? fromPath
    : path.resolve(process.cwd(), fromPath);
  const json = JSON.parse(fs.readFileSync(abs, "utf8"));
  return {
    projectId: json.project_id,
    clientEmail: json.client_email,
    privateKey: json.private_key,
  };
}

type Candidate = {
  id: string;
  source: "unsplash" | "pexels";
  downloadUrl: string;
  photographer: string;
  photographerUrl: string;
  downloadLocation?: string;
};

async function searchUnsplash(spec: Spec): Promise<Candidate[]> {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) return [];
  const url = new URL("https://api.unsplash.com/search/photos");
  url.searchParams.set("query", spec.query);
  url.searchParams.set("per_page", "10");
  url.searchParams.set("orientation", spec.orientation);
  url.searchParams.set("content_filter", "high");

  const res = await fetch(url, { headers: { Authorization: `Client-ID ${key}` } });
  if (!res.ok) {
    console.warn(`[unsplash] search failed (${res.status}) for "${spec.query}"`);
    return [];
  }
  const data = (await res.json()) as {
    results?: {
      id: string;
      urls: { raw: string };
      user: { name: string; links: { html: string } };
      links: { download_location: string };
    }[];
  };
  return (data.results ?? []).map((p) => ({
    id: p.id,
    source: "unsplash" as const,
    downloadUrl: `${p.urls.raw}&w=${spec.width}&q=82&fm=jpg&fit=crop`,
    photographer: p.user.name,
    photographerUrl: p.user.links.html,
    downloadLocation: p.links.download_location,
  }));
}

async function searchPexels(spec: Spec): Promise<Candidate[]> {
  const key = process.env.PEXELS_API_KEY;
  if (!key) return [];
  const url = new URL("https://api.pexels.com/v1/search");
  url.searchParams.set("query", spec.query);
  url.searchParams.set("per_page", "10");
  url.searchParams.set(
    "orientation",
    spec.orientation === "squarish" ? "square" : spec.orientation
  );

  const res = await fetch(url, { headers: { Authorization: key } });
  if (!res.ok) {
    console.warn(`[pexels] search failed (${res.status}) for "${spec.query}"`);
    return [];
  }
  const data = (await res.json()) as {
    photos?: {
      id: number;
      src: { original: string };
      photographer: string;
      photographer_url: string;
    }[];
  };
  return (data.photos ?? []).map((p) => ({
    id: String(p.id),
    source: "pexels" as const,
    downloadUrl: `${p.src.original}?auto=compress&cs=tinysrgb&w=${spec.width}`,
    photographer: p.photographer,
    photographerUrl: p.photographer_url,
  }));
}

async function main() {
  const serviceAccount = loadServiceAccount();
  initializeApp({ credential: cert(serviceAccount) });
  const db = getFirestore();

  const usedRefs = await db.collection(USED_IMAGES_COLLECTION).listDocuments();
  const usedIds = new Set(usedRefs.map((r) => r.id));

  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const credits: Record<string, { photographer: string; photographerUrl: string; source: string }> = {};

  for (const spec of specs) {
    console.log(`[searching] ${spec.name} — "${spec.query}"`);
    const unsplashResults = await searchUnsplash(spec);
    const pexelsResults = await searchPexels(spec);
    const candidates = [...unsplashResults, ...pexelsResults];

    const pick = candidates.find((c) => !usedIds.has(`${c.source}:${c.id}`));
    if (!pick) {
      console.error(`[skip] ${spec.name}: no unused candidate found`);
      continue;
    }

    const res = await fetch(pick.downloadUrl);
    if (!res.ok) {
      console.error(`[error] ${spec.name}: download failed (${res.status})`);
      continue;
    }
    const bytes = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(path.join(OUTPUT_DIR, spec.name), bytes);

    usedIds.add(`${pick.source}:${pick.id}`);
    await db
      .collection(USED_IMAGES_COLLECTION)
      .doc(`${pick.source}_${pick.id}`)
      .set({
        source: pick.source,
        photo_id: pick.id,
        used_in_slug: `site:${spec.name}`,
        used_at: FieldValue.serverTimestamp(),
      });

    if (pick.source === "unsplash" && pick.downloadLocation) {
      const key = process.env.UNSPLASH_ACCESS_KEY;
      fetch(pick.downloadLocation, { headers: { Authorization: `Client-ID ${key}` } }).catch(
        () => undefined
      );
    }

    credits[spec.name] = {
      photographer: pick.photographer,
      photographerUrl: pick.photographerUrl,
      source: pick.source,
    };

    console.log(`[done] ${spec.name} ← ${pick.source}:${pick.id} by ${pick.photographer}`);
  }

  fs.writeFileSync(
    path.join(OUTPUT_DIR, "credits.json"),
    JSON.stringify(credits, null, 2)
  );
  console.log("\nWrote public/images/credits.json. Commit the images + credits file.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
