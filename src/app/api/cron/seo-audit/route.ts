import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Phase 4 stub. Will pull GSC performance data daily, flag articles with
 * low CTR or borderline position, and write seo_reports docs to Firestore.
 */

function authorized(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const auth = request.headers.get("authorization");
  if (auth === `Bearer ${secret}`) return true;
  const url = new URL(request.url);
  return url.searchParams.get("secret") === secret;
}

async function handle(request: NextRequest) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(
    {
      status: "not_implemented",
      phase: 4,
      message:
        "Post-publish SEO monitoring lands in Phase 4 with GSC Search Analytics API.",
    },
    { status: 501 }
  );
}

export async function POST(request: NextRequest) {
  return handle(request);
}

export async function GET(request: NextRequest) {
  return handle(request);
}
