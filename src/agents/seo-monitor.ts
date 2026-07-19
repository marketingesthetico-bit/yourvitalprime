import { google } from "googleapis";
import { FieldValue } from "firebase-admin/firestore";
import { getDb, isFirebaseConfigured } from "@/lib/firebase";
import { isGscConfigured } from "@/agents/gsc-indexer";

const SITE_URL = process.env.GSC_SITE_URL || "https://yourvitalprime.com";
const LOW_CTR_THRESHOLD = 0.02;
const LOW_CTR_MIN_IMPRESSIONS = 500;
const EXPANSION_POSITION_MIN = 11;
const EXPANSION_POSITION_MAX = 20;

export interface ArticlePerformance {
  slug: string;
  url: string;
  impressions: number;
  clicks: number;
  ctr: number;
  position: number;
  flags: ("low_ctr" | "content_expansion_candidate")[];
}

export interface SeoAuditReport {
  skipped?: "not_configured";
  checked: number;
  flagged: number;
  articles: ArticlePerformance[];
}

/**
 * Post-publish SEO monitoring. Pulls 28-day Search Analytics performance
 * per page from GSC, flags underperformers, and writes a report to
 * Firestore `seo_reports`. Requires the same GOOGLE_SERVICE_ACCOUNT_KEY as
 * gsc-indexer.ts, but with the webmasters.readonly scope requested fresh
 * per call (a service account key isn't scope-locked at rest).
 */
export async function runSeoAudit(): Promise<SeoAuditReport> {
  if (!isGscConfigured()) {
    const report: SeoAuditReport = { skipped: "not_configured", checked: 0, flagged: 0, articles: [] };
    await logReport(report);
    return report;
  }

  const auth = getSearchAnalyticsAuth();
  const searchconsole = google.searchconsole({ version: "v1", auth });

  const endDate = new Date();
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - 28);
  const fmt = (d: Date) => d.toISOString().slice(0, 10);

  const response = await searchconsole.searchanalytics.query({
    siteUrl: SITE_URL,
    requestBody: {
      startDate: fmt(startDate),
      endDate: fmt(endDate),
      dimensions: ["page"],
      rowLimit: 1000,
    },
  });

  const rows = response.data.rows ?? [];
  const bySlug = new Map<string, ArticlePerformance>();

  for (const row of rows) {
    const pageUrl = row.keys?.[0];
    if (!pageUrl) continue;
    const match = pageUrl.match(/\/blog\/([^/]+)\/?$/);
    if (!match) continue;
    const slug = match[1];

    const impressions = row.impressions ?? 0;
    const clicks = row.clicks ?? 0;
    const ctr = row.ctr ?? 0;
    const position = row.position ?? 0;

    const flags: ArticlePerformance["flags"] = [];
    if (impressions >= LOW_CTR_MIN_IMPRESSIONS && ctr < LOW_CTR_THRESHOLD) {
      flags.push("low_ctr");
    }
    if (position >= EXPANSION_POSITION_MIN && position <= EXPANSION_POSITION_MAX) {
      flags.push("content_expansion_candidate");
    }

    bySlug.set(slug, { slug, url: pageUrl, impressions, clicks, ctr, position, flags });
  }

  const articles = Array.from(bySlug.values()).sort(
    (a, b) => b.impressions - a.impressions
  );
  const report: SeoAuditReport = {
    checked: articles.length,
    flagged: articles.filter((a) => a.flags.length > 0).length,
    articles,
  };

  await logReport(report);
  return report;
}

function getSearchAnalyticsAuth() {
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY || "{}");
  return new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
  });
}

async function logReport(report: SeoAuditReport): Promise<void> {
  if (!isFirebaseConfigured()) return;
  const db = getDb();
  await db
    .collection("seo_reports")
    .doc(`report_${Date.now()}`)
    .set({
      ...report,
      generated_at: FieldValue.serverTimestamp(),
    })
    .catch((error) => console.error("[seo-monitor] failed to log report:", error));
}
