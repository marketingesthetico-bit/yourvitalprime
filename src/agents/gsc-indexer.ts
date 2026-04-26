/**
 * YourVitalPrime — Agent 7: GSC Indexer
 * No LLM — pure Google API integration
 * Auto-submits new article URLs to Google Search Console Indexing API
 * Also pings Google sitemap on every new publish
 */

import { google } from "googleapis";
import { db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

const SITE_URL = process.env.GSC_SITE_URL || "https://yourvitalprime.com";
const SITEMAP_URL = `${SITE_URL}/sitemap.xml`;

interface IndexingResult {
  url: string;
  success: boolean;
  type: "URL_UPDATED" | "URL_DELETED";
  error?: string;
  notified_at?: string;
}

/**
 * Submit a single article URL to GSC Indexing API
 */
export async function submitUrlToIndex(slug: string, lang: "en" | "es" = "en"): Promise<IndexingResult> {
  const articleUrl = `${SITE_URL}/${lang}/blog/${slug}`;
  
  try {
    const auth = await getGoogleAuth();
    const indexing = google.indexing({ version: "v3", auth });

    const response = await indexing.urlNotifications.publish({
      requestBody: {
        url: articleUrl,
        type: "URL_UPDATED",
      },
    });

    const result: IndexingResult = {
      url: articleUrl,
      success: true,
      type: "URL_UPDATED",
      notified_at: response.data.urlNotificationMetadata?.latestUpdate?.notifyTime || new Date().toISOString(),
    };

    // Log to Firestore
    await logSubmission(slug, result);

    // Also ping sitemap
    await pingSitemap();

    return result;
  } catch (error: any) {
    const result: IndexingResult = {
      url: articleUrl,
      success: false,
      type: "URL_UPDATED",
      error: error.message || "Unknown GSC error",
    };

    await logSubmission(slug, result);
    return result;
  }
}

/**
 * Submit all unindexed articles (for bulk catchup)
 */
export async function submitPendingUrls(): Promise<IndexingResult[]> {
  // Fetch articles where gsc_submitted = false from Firestore
  // Implement with Firestore query in actual code
  const pendingArticles: Array<{ slug: string; lang: "en" | "es" }> = [];
  
  const results: IndexingResult[] = [];
  
  for (const article of pendingArticles) {
    const result = await submitUrlToIndex(article.slug, article.lang);
    results.push(result);
    
    // GSC Indexing API rate limit: 200 requests/day — pace requests
    await sleep(500);
  }
  
  return results;
}

/**
 * Ping Google with updated sitemap
 * https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap#notify-google
 */
async function pingSitemap(): Promise<void> {
  try {
    const pingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`;
    await fetch(pingUrl);
  } catch (error) {
    console.error("Sitemap ping failed:", error);
  }
}

/**
 * Get Google Auth using service account
 * Requires GOOGLE_SERVICE_ACCOUNT_KEY env var (JSON string)
 */
async function getGoogleAuth() {
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY || "{}");
  
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/indexing"],
  });
  
  return auth;
}

/**
 * Log submission result to Firestore for monitoring
 */
async function logSubmission(slug: string, result: IndexingResult): Promise<void> {
  const submissionRef = doc(db, "gsc_submissions", `${slug}_${Date.now()}`);
  await setDoc(submissionRef, {
    slug,
    url: result.url,
    success: result.success,
    error: result.error || null,
    submitted_at: serverTimestamp(),
    notified_at: result.notified_at || null,
  });
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
