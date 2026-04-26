import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Phase 4 stub. Will pull SerpAPI / DataForSEO data for queued keywords and
 * write competitor_analysis docs to Firestore.
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
        "Competitor analysis lands in Phase 4 with SerpAPI/DataForSEO integration.",
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
