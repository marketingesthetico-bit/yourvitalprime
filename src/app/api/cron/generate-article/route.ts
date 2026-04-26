import { NextRequest, NextResponse } from "next/server";

/**
 * Phase 1 stub. The full pipeline (keyword pick → writer → humanizer → SEO
 * audit → image gen → publish → GSC index) lands in Phase 2 alongside the
 * Firebase, Anthropic, OpenAI and Google API integrations. The Phase 2 source
 * is preserved at route.phase2.ts.bak in this folder.
 */

export const dynamic = "force-dynamic";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function notImplemented() {
  return NextResponse.json(
    {
      status: "not_implemented",
      phase: 1,
      message:
        "Article generation pipeline is not active yet. See Phase 2 in CLAUDE.md.",
    },
    { status: 501 }
  );
}

export async function POST(request: NextRequest) {
  const auth = request.headers.get("authorization");
  const secret = process.env.CRON_SECRET;
  if (secret && auth !== `Bearer ${secret}`) return unauthorized();
  return notImplemented();
}

export async function GET(request: NextRequest) {
  const auth = request.headers.get("authorization");
  const secret = process.env.CRON_SECRET;
  if (secret && auth !== `Bearer ${secret}`) return unauthorized();
  return notImplemented();
}
