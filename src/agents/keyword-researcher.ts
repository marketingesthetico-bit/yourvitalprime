import { FieldValue } from "firebase-admin/firestore";
import { getOpenAI, OPENAI_TEXT_MODEL, isOpenAIConfigured } from "@/lib/openai";
import { getDb, isFirebaseConfigured } from "@/lib/firebase";

export interface DiscoveredKeyword {
  keyword: string;
  keyword_secondary: string[];
  pillar: string;
  volume_est: number;
  kd_est: number;
  cpc_est: number;
  tier: 2 | 3 | 4;
  opportunity_score: number;
  rationale: string;
}

export interface KeywordResearchResult {
  discovered: DiscoveredKeyword[];
  written_to_firestore: number;
}

const PILLAR_OPTIONS = [
  "muscle-strength",
  "hormonal-health",
  "supplementation",
  "longevity",
  "mental-vitality",
] as const;

/**
 * Phase 4 will plug in DataForSEO/SerpAPI for real volume + KD data. For now we
 * use the LLM as a "creative seed generator": it proposes plausible long-tail
 * keywords for our 50+ niche with educated estimates, and we score and store them.
 *
 * Run weekly via cron. Results are written to Firestore `keywords` collection
 * with status="queued" so the article writer can pick them up.
 */
export async function discoverKeywords(opts?: {
  count?: number;
  pillar?: (typeof PILLAR_OPTIONS)[number];
}): Promise<KeywordResearchResult> {
  if (!isOpenAIConfigured()) {
    throw new Error("OPENAI_API_KEY not set; cannot run keyword discovery.");
  }

  const count = opts?.count ?? 10;
  const pillarHint = opts?.pillar
    ? `Focus on the "${opts.pillar}" pillar.`
    : "Spread across the five pillars (muscle-strength, hormonal-health, supplementation, longevity, mental-vitality).";

  const completion = await getOpenAI().chat.completions.create({
    model: OPENAI_TEXT_MODEL,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You are an SEO researcher for YourVitalPrime.com, a health and longevity blog for adults 50+.
You suggest long-tail keywords that adults 50+ would actually search.
Return ONLY JSON with shape: { "keywords": [ { "keyword": string, "keyword_secondary": string[], "pillar": string, "volume_est": number, "kd_est": number, "cpc_est": number, "tier": 2|3|4, "rationale": string } ] }.
Tier 4 = ultra-low competition (KD < 20, vol < 1500). Tier 3 = low (KD 20-40). Tier 2 = mid.
Prefer Tier 3 and Tier 4. Avoid medical-emergency or money-yielding-life topics that violate AdSense YMYL rules without strong sourcing.`,
      },
      {
        role: "user",
        content: `Propose ${count} fresh keyword opportunities for an English audience. ${pillarHint}
Each keyword must be a natural search query a 50+ reader would actually type into Google.
Return strict JSON.`,
      },
    ],
  });

  const raw = completion.choices[0]?.message?.content ?? "{}";
  let parsed: { keywords?: Partial<DiscoveredKeyword>[] };
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Keyword researcher returned invalid JSON.");
  }

  const discovered: DiscoveredKeyword[] = (parsed.keywords ?? [])
    .filter((k): k is Required<Partial<DiscoveredKeyword>> & { keyword: string } => !!k.keyword)
    .map((k) => {
      const volume = Number(k.volume_est ?? 800);
      const kd = Number(k.kd_est ?? 30);
      const tier = (k.tier ?? (kd < 20 ? 4 : kd < 40 ? 3 : 2)) as 2 | 3 | 4;
      const pillar =
        typeof k.pillar === "string" &&
        (PILLAR_OPTIONS as readonly string[]).includes(k.pillar)
          ? (k.pillar as string)
          : "muscle-strength";
      return {
        keyword: k.keyword!,
        keyword_secondary: Array.isArray(k.keyword_secondary)
          ? (k.keyword_secondary as string[])
          : [],
        pillar,
        volume_est: volume,
        kd_est: kd,
        cpc_est: Number(k.cpc_est ?? 2.5),
        tier,
        opportunity_score: Math.round((volume * (100 - kd)) / 100),
        rationale: typeof k.rationale === "string" ? (k.rationale as string) : "",
      };
    });

  let written = 0;
  if (isFirebaseConfigured() && discovered.length > 0) {
    const db = getDb();
    const batch = db.batch();
    for (const kw of discovered) {
      const id = slugify(kw.keyword);
      const ref = db.collection("keywords").doc(id);
      const snapshot = await ref.get();
      if (snapshot.exists) continue; // Skip duplicates
      batch.set(ref, {
        ...kw,
        status: "queued",
        lang: "en",
        assigned_to_article: null,
        created_at: FieldValue.serverTimestamp(),
        source: "keyword-researcher-llm",
      });
      written += 1;
    }
    if (written > 0) await batch.commit();
  }

  return { discovered, written_to_firestore: written };
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
}
