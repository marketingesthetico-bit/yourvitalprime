import { google } from "googleapis";
import { FieldValue } from "firebase-admin/firestore";
import { getDb, isFirebaseConfigured } from "@/lib/firebase";

const SITE_URL = process.env.GSC_SITE_URL || "https://yourvitalprime.com";
const SITEMAP_URL = `${SITE_URL}/sitemap.xml`;

export interface IndexingResult {
  url: string;
  success: boolean;
  type: "URL_UPDATED" | "URL_DELETED";
  skipped?: "not_configured";
  error?: string;
  notified_at?: string;
}

export function isGscConfigured(): boolean {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!raw) return false;
  try {
    const parsed = JSON.parse(raw);
    return !!parsed.client_email && !!parsed.private_key;
  } catch {
    return false;
  }
}

/**
 * Submit one article URL to the GSC Indexing API.
 * If the service account key is missing (we parked it while GSC fixes the
 * "user not found" bug), this no-ops with success=true and skipped="not_configured".
 */
export async function submitUrlToIndex(
  slug: string,
  lang: "en" | "es" = "en"
): Promise<IndexingResult> {
  const articleUrl = `${SITE_URL}/${lang}/blog/${slug}`;

  if (!isGscConfigured()) {
    const result: IndexingResult = {
      url: articleUrl,
      success: true,
      type: "URL_UPDATED",
      skipped: "not_configured",
    };
    await logSubmission(slug, result).catch(() => undefined);
    return result;
  }

  try {
    const auth = getGoogleAuth();
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
      notified_at:
        response.data.urlNotificationMetadata?.latestUpdate?.notifyTime ||
        new Date().toISOString(),
    };

    await logSubmission(slug, result);
    await pingSitemap();
    return result;
  } catch (error) {
    const result: IndexingResult = {
      url: articleUrl,
      success: false,
      type: "URL_UPDATED",
      error: error instanceof Error ? error.message : "Unknown GSC error",
    };
    await logSubmission(slug, result).catch(() => undefined);
    return result;
  }
}

async function pingSitemap(): Promise<void> {
  try {
    const url = `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`;
    await fetch(url);
  } catch (error) {
    console.error("Sitemap ping failed:", error);
  }
}

function getGoogleAuth() {
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY || "{}");
  return new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/indexing"],
  });
}

async function logSubmission(
  slug: string,
  result: IndexingResult
): Promise<void> {
  if (!isFirebaseConfigured()) return;
  const db = getDb();
  await db
    .collection("gsc_submissions")
    .doc(`${slug}_${Date.now()}`)
    .set({
      slug,
      url: result.url,
      success: result.success,
      skipped: result.skipped ?? null,
      error: result.error ?? null,
      submitted_at: FieldValue.serverTimestamp(),
      notified_at: result.notified_at ?? null,
    });
}
