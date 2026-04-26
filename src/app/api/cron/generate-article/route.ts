import { NextRequest, NextResponse } from "next/server";
import { FieldValue, type Firestore } from "firebase-admin/firestore";
import { generateArticle, type CompetitorAnalysis } from "@/agents/article-writer";
import { humanizeArticle } from "@/agents/humanizer";
import { auditArticleSEO } from "@/agents/seo-auditor";
import { generateArticleImages } from "@/agents/image-generator";
import { submitUrlToIndex } from "@/agents/gsc-indexer";
import { getDb, isFirebaseConfigured } from "@/lib/firebase";
import { isAnthropicConfigured } from "@/lib/anthropic";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

type QueuedKeyword = {
  id: string;
  keyword: string;
  keyword_secondary?: string[];
  pillar: string;
  kd_est: number;
  volume_est: number;
};

const DEFAULT_COMPETITOR_ANALYSIS: CompetitorAnalysis = {
  avg_word_count: 1800,
  content_gaps: [
    "Specific dosage recommendations",
    "What to expect in the first 30 days",
    "Common mistakes and how to avoid them",
    "When results are not as expected",
  ],
  top_headings: [],
  serp_features: ["featured_snippet", "people_also_ask"],
};

function authorized(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false; // refuse to run without a secret in production
  const auth = request.headers.get("authorization");
  if (auth === `Bearer ${secret}`) return true;
  // Vercel Cron sets ?cronSecret or x-vercel-cron header in some configs; fall back to query
  const url = new URL(request.url);
  return url.searchParams.get("secret") === secret;
}

async function handle(request: NextRequest) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isAnthropicConfigured()) {
    return NextResponse.json(
      { success: false, error: "ANTHROPIC_API_KEY not set." },
      { status: 503 }
    );
  }
  if (!isFirebaseConfigured()) {
    return NextResponse.json(
      { success: false, error: "Firebase not configured." },
      { status: 503 }
    );
  }

  const startTime = Date.now();
  const runId = `run_${Date.now()}`;
  const db = getDb();

  try {
    console.log(`[pipeline ${runId}] selecting keyword`);
    const keyword = await selectTopKeyword(db);
    if (!keyword) {
      return NextResponse.json({
        success: false,
        run_id: runId,
        message: "No keywords queued. Run keyword-researcher or seed-keywords.",
      });
    }
    console.log(
      `[pipeline ${runId}] keyword "${keyword.keyword}" KD=${keyword.kd_est} vol=${keyword.volume_est}`
    );
    await db
      .collection("keywords")
      .doc(keyword.id)
      .update({ status: "in_progress", pipeline_run_id: runId });

    console.log(`[pipeline ${runId}] fetching competitor analysis`);
    const competitorData = await getCompetitorAnalysis(db, keyword.keyword);

    console.log(`[pipeline ${runId}] generating article`);
    const draft = await generateArticle({
      keyword: keyword.keyword,
      keyword_secondary: keyword.keyword_secondary ?? [],
      pillar: keyword.pillar,
      kd_estimate: keyword.kd_est,
      competitor_analysis: competitorData,
      lang: "en",
    });
    console.log(
      `[pipeline ${runId}] draft ${draft.word_count} words: "${draft.title}"`
    );

    console.log(`[pipeline ${runId}] humanizing`);
    const humanized = await humanizeArticle(draft.content_mdx, keyword.keyword);
    console.log(
      `[pipeline ${runId}] humanizer ${humanized.scores.total}/50 (${humanized.passed ? "PASS" : "FAIL"}) revisions=${humanized.revision_count}`
    );

    console.log(`[pipeline ${runId}] SEO audit`);
    const seoAudit = await auditArticleSEO({
      content: humanized.content,
      title: draft.title,
      meta_description: draft.meta_description,
      slug: draft.slug,
      keyword: keyword.keyword,
    });
    console.log(`[pipeline ${runId}] seo ${seoAudit.score}/100`);
    if (seoAudit.score < 60) {
      throw new Error(
        `SEO score too low (${seoAudit.score}). Issues: ${seoAudit.issues.join("; ")}`
      );
    }

    console.log(`[pipeline ${runId}] generating images`);
    const images = await generateArticleImages({
      slug: draft.slug,
      featured_prompt: draft.featured_image_prompt,
      inline_prompts: draft.inline_image_prompts,
    });
    console.log(
      `[pipeline ${runId}] images featured=${!!images.featured_url} inline=${images.inline_urls.length}`
    );

    console.log(`[pipeline ${runId}] publishing to Firestore`);
    const articleData = {
      slug: draft.slug,
      lang: "en",
      title: draft.title,
      meta_description: draft.meta_description,
      keyword_primary: keyword.keyword,
      keywords_secondary: keyword.keyword_secondary ?? [],
      pillar: keyword.pillar,
      content_mdx: humanized.content,
      content_html: humanized.content,
      featured_image_url: images.featured_url || null,
      inline_images: images.inline_urls,
      word_count: draft.word_count,
      seo_score: seoAudit.score,
      seo_issues: seoAudit.issues,
      humanizer_score: humanized.scores.total,
      humanizer_passed: humanized.passed,
      schema_faq: draft.schema_faq,
      status: "published",
      published_at: FieldValue.serverTimestamp(),
      gsc_submitted: false,
      lang_es_ready: false,
      author: "editorial-team",
      reading_time_min: draft.reading_time_min,
      pipeline_run_id: runId,
    };
    await db.collection("articles").doc(draft.slug).set(articleData);
    await db.collection("keywords").doc(keyword.id).update({
      status: "published",
      assigned_to_article: draft.slug,
      published_at: FieldValue.serverTimestamp(),
    });

    console.log(`[pipeline ${runId}] submitting to GSC`);
    const gscResult = await submitUrlToIndex(draft.slug, "en");
    await db.collection("articles").doc(draft.slug).update({
      gsc_submitted: gscResult.success && !gscResult.skipped,
      gsc_skipped: gscResult.skipped ?? null,
      gsc_submitted_at: FieldValue.serverTimestamp(),
    });

    const durationSeconds = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`[pipeline ${runId}] DONE in ${durationSeconds}s`);

    return NextResponse.json({
      success: true,
      run_id: runId,
      duration_seconds: durationSeconds,
      article: {
        slug: draft.slug,
        title: draft.title,
        word_count: draft.word_count,
        seo_score: seoAudit.score,
        humanizer_score: humanized.scores.total,
        humanizer_passed: humanized.passed,
        gsc_submitted: gscResult.success && !gscResult.skipped,
        gsc_skipped: gscResult.skipped ?? null,
        url: `https://yourvitalprime.com/en/blog/${draft.slug}`,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[pipeline ${runId}] error:`, error);
    return NextResponse.json(
      { success: false, run_id: runId, error: message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  return handle(request);
}

export async function GET(request: NextRequest) {
  return handle(request);
}

async function selectTopKeyword(db: Firestore): Promise<QueuedKeyword | null> {
  const snapshot = await db
    .collection("keywords")
    .where("status", "==", "queued")
    .where("lang", "==", "en")
    .orderBy("opportunity_score", "desc")
    .limit(1)
    .get();
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { id: doc.id, ...(doc.data() as Omit<QueuedKeyword, "id">) };
}

async function getCompetitorAnalysis(
  db: Firestore,
  keyword: string
): Promise<CompetitorAnalysis> {
  const snapshot = await db
    .collection("competitor_analysis")
    .where("keyword", "==", keyword)
    .limit(1)
    .get();
  if (snapshot.empty) return DEFAULT_COMPETITOR_ANALYSIS;
  return snapshot.docs[0].data() as CompetitorAnalysis;
}
