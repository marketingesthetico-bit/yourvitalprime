import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getDb, isFirebaseConfigured } from "@/lib/firebase";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  if (!isFirebaseConfigured()) {
    return NextResponse.json(
      { success: false, error: "Newsletter storage not configured." },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body." },
      { status: 400 }
    );
  }

  const { email, lang } = (body ?? {}) as Record<string, unknown>;
  if (typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json(
      { success: false, error: "Invalid email." },
      { status: 400 }
    );
  }

  const normalized = email.trim().toLowerCase().slice(0, 200);

  try {
    // Doc ID = email so re-subscribing is idempotent rather than duplicating.
    await getDb()
      .collection("newsletter_subscribers")
      .doc(normalized)
      .set(
        {
          email: normalized,
          lang: lang === "es" ? "es" : "en",
          status: "subscribed",
          subscribed_at: FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
    return NextResponse.json({ success: true });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[newsletter] failed to store subscriber:", msg);
    return NextResponse.json(
      { success: false, error: "Could not save your subscription." },
      { status: 500 }
    );
  }
}
