import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getDb, isFirebaseConfigured } from "@/lib/firebase";

export const dynamic = "force-dynamic";

const VALID_TOPICS = new Set([
  "general",
  "correction",
  "topic",
  "press",
  "privacy",
]);

export async function POST(request: NextRequest) {
  if (!isFirebaseConfigured()) {
    return NextResponse.json(
      { success: false, error: "Contact storage not configured." },
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

  const { name, email, topic, message, lang } = (body ?? {}) as Record<
    string,
    unknown
  >;

  if (
    typeof name !== "string" ||
    !name.trim() ||
    typeof email !== "string" ||
    !email.includes("@") ||
    typeof message !== "string" ||
    message.trim().length < 10
  ) {
    return NextResponse.json(
      { success: false, error: "Missing or invalid fields." },
      { status: 400 }
    );
  }

  const safeTopic =
    typeof topic === "string" && VALID_TOPICS.has(topic) ? topic : "general";

  try {
    await getDb()
      .collection("contact_submissions")
      .add({
        name: name.trim().slice(0, 200),
        email: email.trim().slice(0, 200),
        topic: safeTopic,
        message: message.trim().slice(0, 5000),
        lang: lang === "es" ? "es" : "en",
        status: "new",
        submitted_at: FieldValue.serverTimestamp(),
      });
    return NextResponse.json({ success: true });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[contact] failed to store submission:", msg);
    return NextResponse.json(
      { success: false, error: "Could not save your message." },
      { status: 500 }
    );
  }
}
