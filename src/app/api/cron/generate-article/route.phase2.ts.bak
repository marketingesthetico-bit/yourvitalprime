/**
 * YourVitalPrime — Cron: Generate Article
 * Route: /api/cron/generate-article
 * Schedule: Every 2 days at 07:00 Madrid time (05:00 UTC)
 * 
 * Orchestrates: Keyword selection → Article Writer → Humanizer → SEO Audit → Image Gen → Publish → GSC Index
 */

import { NextRequest, NextResponse } from "next/server";
import { generateArticle } from "@/agents/article-writer";
import { humanizeArticle } from "@/agents/humanizer";
import { auditArticleSEO } from "@/agents/seo-auditor";
import { generateArticleImages } from "@/agents/image-generator";
import { submitUrlToIndex } from "@/agents/gsc-indexer";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  doc,
  updateDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

export async function POST(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startTime = Date.now();
  const runId = `run_${Date.now()}`;

  console.log(`[Article Pipeline] Starting run ${runId}`);

  try {
    // ─── Step 1: Select best keyword from queue ───────────────────────────
    console.log("[Step 1] Selecting keyword...");
    const keyword = await selectTopKeyword();

    if (!keyword) {
      return NextResponse.json({
        success: false,
        message: "No keywords in queue. Run keyword-research agent first.",
      });
    }

    console.log(`[Step 1] Selected: "${keyword.keyword}" (KD: ${keyword.kd_est}, Vol: ${keyword.volume_est})`);

    // Mark keyword as in-progress
    await updateDoc(doc(db, "keywords", keyword.id), {
      status: "in_progress",
      pipeline_run_id: runId,
    });

    // ─── Step 2: Get competitor analysis ──────────────────────────────────
    console.log("[Step 2] Fetching competitor analysis...");
    const competitorData = await getCompetitorAnalysis(keyword.keyword);

    // ─── Step 3: Generate article draft ───────────────────────────────────
    console.log("[Step 3] Generating article...");
    const draft = await generateArticle({
      keyword: keyword.keyword,
      keyword_secondary: keyword.keyword_secondary || [],
      pillar: keyword.pillar,
      kd_estimate: keyword.kd_est,
      competitor_analysis: competitorData,
      lang: "en",
    });

    console.log(`[Step 3] Draft: ${draft.word_count} words, title: "${draft.title}"`);

    // ─── Step 4: Humanize (Stop-Slop layer) ───────────────────────────────
    console.log("[Step 4] Humanizing article...");
    const humanized = await humanizeArticle(draft.content_mdx, keyword.keyword);

    console.log(
      `[Step 4] Humanizer score: ${humanized.scores.total}/50 (${humanized.passed ? "PASSED" : "FAILED"}) after ${humanized.revision_count} revisions`
    );

    // ─── Step 5: SEO Audit ─────────────────────────────────────────────────
    console.log("[Step 5] Running SEO audit...");
    const seoAudit = await auditArticleSEO({
      content: humanized.content,
      title: draft.title,
      meta_description: draft.meta_description,
      slug: draft.slug,
      keyword: keyword.keyword,
    });

    console.log(`[Step 5] SEO score: ${seoAudit.score}/100`);

    if (seoAudit.score < 75) {
      console.warn("[Step 5] SEO score below threshold. Issues:", seoAudit.issues);
      // In production: loop back to article writer with fix list
      // For now: log and continue if score > 60
      if (seoAudit.score < 60) {
        throw new Error(`SEO score too low (${seoAudit.score}). Issues: ${seoAudit.issues.join(", ")}`);
      }
    }

    // ─── Step 6: Generate images ───────────────────────────────────────────
    console.log("[Step 6] Generating images...");
    const images = await generateArticleImages({
      slug: draft.slug,
      featured_prompt: draft.featured_image_prompt,
      inline_prompts: draft.inline_image_prompts,
    });

    console.log(`[Step 6] Images: featured=${images.featured_url}, inline=${images.inline_urls.length}`);

    // ─── Step 7: Publish to Firestore ─────────────────────────────────────
    console.log("[Step 7] Publishing article...");
    const articleData = {
      slug: draft.slug,
      lang: "en",
      title: draft.title,
      meta_description: draft.meta_description,
      keyword_primary: keyword.keyword,
      keywords_secondary: keyword.keyword_secondary || [],
      pillar: keyword.pillar,
      content_mdx: humanized.content,
      content_html: humanized.content, // Process MDX → HTML in actual implementation
      featured_image_url: images.featured_url,
      inline_images: images.inline_urls,
      word_count: draft.word_count,
      seo_score: seoAudit.score,
      humanizer_score: humanized.scores.total,
      schema_faq: draft.schema_faq,
      status: "published",
      published_at: serverTimestamp(),
      gsc_submitted: false,
      lang_es_ready: false,
      author: "editorial-team",
      reading_time_min: draft.reading_time_min,
      pipeline_run_id: runId,
    };

    await setDoc(doc(db, "articles", draft.slug), articleData);

    // Update keyword status
    await updateDoc(doc(db, "keywords", keyword.id), {
      status: "published",
      assigned_to_article: draft.slug,
      published_at: serverTimestamp(),
    });

    // ─── Step 8: Submit to GSC ─────────────────────────────────────────────
    console.log("[Step 8] Submitting to Google Search Console...");
    const gscResult = await submitUrlToIndex(draft.slug, "en");

    // Update article with GSC submission status
    await updateDoc(doc(db, "articles", draft.slug), {
      gsc_submitted: gscResult.success,
      gsc_submitted_at: serverTimestamp(),
    });

    const duration = ((Date.now() - startTime) / 1000).toFixed(1);

    console.log(`[Pipeline Complete] "${draft.title}" published in ${duration}s`);

    return NextResponse.json({
      success: true,
      run_id: runId,
      article: {
        slug: draft.slug,
        title: draft.title,
        word_count: draft.word_count,
        seo_score: seoAudit.score,
        humanizer_score: humanized.scores.total,
        humanizer_passed: humanized.passed,
        gsc_submitted: gscResult.success,
        url: `https://yourvitalprime.com/en/blog/${draft.slug}`,
      },
      duration_seconds: duration,
    });
  } catch (error: any) {
    console.error(`[Pipeline Error] Run ${runId}:`, error);

    return NextResponse.json(
      {
        success: false,
        run_id: runId,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * Select the highest-opportunity keyword from the queue
 * Priority: Tier 3/4 first, highest opportunity_score
 */
async function selectTopKeyword() {
  const q = query(
    collection(db, "keywords"),
    where("status", "==", "queued"),
    where("lang", "==", "en"),
    orderBy("opportunity_score", "desc"),
    limit(1)
  );

  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as any;
}

/**
 * Get competitor analysis for keyword
 * Falls back to defaults if no analysis exists yet
 */
async function getCompetitorAnalysis(keyword: string) {
  // Try to get from Firestore (populated by competitor-spy agent)
  const q = query(
    collection(db, "competitor_analysis"),
    where("keyword", "==", keyword),
    limit(1)
  );

  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    return snapshot.docs[0].data() as any;
  }

  // Default fallback if no analysis available
  return {
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
}
