import { NextRequest, NextResponse } from "next/server";
import { analyzeQueuedKeywords } from "@/agents/competitor-spy";
import { isOpenAIConfigured } from "@/lib/openai";
import { isFirebaseConfigured } from "@/lib/firebase";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

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
  const limitParam = url.searchParams.get("limit");
  const limit = limitParam ? Math.min(20, Math.max(1, Number(limitParam))) : 10;

  try {
    const result = await analyzeQueuedKeywords(limit);
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  return handle(request);
}

export async function GET(request: NextRequest) {
  return handle(request);
}
