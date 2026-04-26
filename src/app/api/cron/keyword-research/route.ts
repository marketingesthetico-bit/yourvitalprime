import { NextRequest, NextResponse } from "next/server";
import { discoverKeywords } from "@/agents/keyword-researcher";
import { isOpenAIConfigured } from "@/lib/openai";
import { isFirebaseConfigured } from "@/lib/firebase";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

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
  if (!isOpenAIConfigured()) {
    return NextResponse.json(
      { success: false, error: "OPENAI_API_KEY not set." },
      { status: 503 }
    );
  }
  if (!isFirebaseConfigured()) {
    return NextResponse.json(
      { success: false, error: "Firebase not configured." },
      { status: 503 }
    );
  }

  const url = new URL(request.url);
  const countParam = url.searchParams.get("count");
  const count = countParam ? Math.min(20, Math.max(1, Number(countParam))) : 10;

  try {
    const result = await discoverKeywords({ count });
    return NextResponse.json({
      success: true,
      requested: count,
      ...result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, error: message },
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
