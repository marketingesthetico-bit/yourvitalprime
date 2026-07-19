import { FieldValue } from "firebase-admin/firestore";
import { getOpenAI, OPENAI_TEXT_MODEL, isOpenAIConfigured } from "@/lib/openai";
import { getDb, isFirebaseConfigured } from "@/lib/firebase";
import type { CompetitorAnalysis } from "@/agents/article-writer";

export interface CompetitorSpyResult {
  keyword: string;
  analysis: CompetitorAnalysis;
  opportunity: "high" | "medium" | "low";
  rationale: string;
}

/**
 * Phase 4 competitor analysis. Real SERP scraping (SerpAPI/DataForSEO) is a
 * future upgrade — for now this uses the LLM's knowledge of how health
 * content typically ranks for a given query to estimate competitor
 * structure and gaps, same "creative estimator" approach as
 * keyword-researcher.ts until a real SERP API key is added.
 *
 * Writes one doc per keyword to the `competitor_analysis` collection, which
 * generate-article's getCompetitorAnalysis() already reads before falling
 * back to a hardcoded default.
 */
export async function analyzeCompetitor(
  keyword: string,
  pillar: string
): Promise<CompetitorSpyResult> {
  if (!isOpenAIConfigured()) {
    throw new Error("OPENAI_API_KEY not set; cannot run competitor analysis.");
  }

  const completion = await getOpenAI().chat.completions.create({
    model: OPENAI_TEXT_MODEL,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You are an SEO competitor analyst for a health and longevity publication targeting adults 50+.
Given a search query, estimate what the current top-10 Google results for that query in the "${pillar}" topic
typically look like, based on how this kind of health query is usually answered online (WebMD, Healthline,
Mayo Clinic, and independent health blogs).
Return ONLY JSON: {
  "avg_word_count": number,
  "content_gaps": string[] (3-5 specific things most existing articles on this topic fail to cover well),
  "top_headings": string[] (4-6 H2-style headings competitors commonly use),
  "serp_features": string[] (subset of: "featured_snippet", "people_also_ask", "video_carousel", "local_pack"),
  "opportunity": "high" | "medium" | "low" (how beatable the current results likely are for a well-researched, well-structured new article),
  "rationale": string (1-2 sentences on why)
}`,
      },
      {
        role: "user",
        content: `Query: "${keyword}"`,
      },
    ],
  });

  const raw = completion.choices[0]?.message?.content ?? "{}";
  let parsed: Partial<CompetitorAnalysis> & {
    opportunity?: string;
    rationale?: string;
  };
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Competitor spy returned invalid JSON.");
  }

  const analysis: CompetitorAnalysis = {
    avg_word_count: Number(parsed.avg_word_count ?? 1800),
    content_gaps: Array.isArray(parsed.content_gaps) ? parsed.content_gaps : [],
    top_headings: Array.isArray(parsed.top_headings) ? parsed.top_headings : [],
    serp_features: Array.isArray(parsed.serp_features) ? parsed.serp_features : [],
  };

  const opportunity: CompetitorSpyResult["opportunity"] =
    parsed.opportunity === "high" || parsed.opportunity === "low"
      ? parsed.opportunity
      : "medium";

  return {
    keyword,
    analysis,
    opportunity,
    rationale: typeof parsed.rationale === "string" ? parsed.rationale : "",
  };
}

export interface CompetitorSpyBatchResult {
  analyzed: number;
  skipped_existing: number;
  results: CompetitorSpyResult[];
}

/**
 * Runs analyzeCompetitor for queued keywords that don't have a
 * competitor_analysis doc yet, up to `limit` per invocation to bound cost
 * and cron duration.
 */
export async function analyzeQueuedKeywords(
  limit = 10
): Promise<CompetitorSpyBatchResult> {
  if (!isFirebaseConfigured()) {
    throw new Error("Firebase not configured.");
  }
  const db = getDb();

  const queuedSnapshot = await db
    .collection("keywords")
    .where("status", "==", "queued")
    .where("lang", "==", "en")
    .orderBy("opportunity_score", "desc")
    .limit(limit * 2) // headroom in case some already have analysis
    .get();

  const results: CompetitorSpyResult[] = [];
  let skipped = 0;

  for (const doc of queuedSnapshot.docs) {
    if (results.length >= limit) break;
    const { keyword, pillar } = doc.data() as { keyword: string; pillar: string };

    const existing = await db
      .collection("competitor_analysis")
      .where("keyword", "==", keyword)
      .limit(1)
      .get();
    if (!existing.empty) {
      skipped += 1;
      continue;
    }

    const result = await analyzeCompetitor(keyword, pillar);
    await db.collection("competitor_analysis").add({
      keyword: result.keyword,
      ...result.analysis,
      opportunity: result.opportunity,
      rationale: result.rationale,
      analyzed_at: FieldValue.serverTimestamp(),
      source: "competitor-spy-llm",
    });
    results.push(result);
  }

  return { analyzed: results.length, skipped_existing: skipped, results };
}
