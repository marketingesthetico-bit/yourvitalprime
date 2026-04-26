import { getOpenAI, OPENAI_IMAGE_MODEL, isOpenAIConfigured } from "@/lib/openai";
import { generateStabilityImage, isStabilityConfigured } from "@/lib/stability";
import { getBucket, isFirebaseConfigured } from "@/lib/firebase";

export interface ImageGenInput {
  slug: string;
  featured_prompt: string;
  inline_prompts: [string, string];
}

export interface ImageGenResult {
  featured_url: string;
  inline_urls: string[];
}

const FEATURED_SUFFIX =
  ". Warm editorial photography. Natural light. Authentic, not stock-photo. No text, no watermarks. 16:9 aspect ratio.";
const INLINE_SUFFIX =
  ". Editorial illustration style, brand palette of deep navy, warm amber, sage green and cream. No text. 16:10 aspect ratio.";

/**
 * Generate the 3 article images and upload them to Firebase Storage.
 * - Featured image via DALL-E 3 (1792x1024)
 * - Inline images via Stability AI (cheaper for volume)
 *
 * Falls back gracefully if any provider is misconfigured: returns empty
 * URLs for that slot rather than failing the whole pipeline.
 */
export async function generateArticleImages(
  input: ImageGenInput
): Promise<ImageGenResult> {
  const featuredUrl = await generateAndStoreFeatured(
    input.slug,
    input.featured_prompt
  );

  const inlineUrls: string[] = [];
  for (let i = 0; i < input.inline_prompts.length; i += 1) {
    const url = await generateAndStoreInline(
      input.slug,
      i,
      input.inline_prompts[i]
    );
    if (url) inlineUrls.push(url);
  }

  return { featured_url: featuredUrl, inline_urls: inlineUrls };
}

async function generateAndStoreFeatured(
  slug: string,
  prompt: string
): Promise<string> {
  if (!isOpenAIConfigured()) {
    console.warn("[image-gen] OpenAI not configured, skipping featured image.");
    return "";
  }
  if (!isFirebaseConfigured()) {
    console.warn("[image-gen] Firebase Storage not configured.");
    return "";
  }

  try {
    const response = await getOpenAI().images.generate({
      model: OPENAI_IMAGE_MODEL,
      prompt: prompt + FEATURED_SUFFIX,
      size: "1792x1024",
      quality: "standard",
      n: 1,
      response_format: "b64_json",
    });

    const b64 = response.data?.[0]?.b64_json;
    if (!b64) throw new Error("No image data returned by OpenAI.");
    const bytes = Buffer.from(b64, "base64");
    return await uploadToStorage(
      `articles/${slug}/featured.png`,
      bytes,
      "image/png"
    );
  } catch (error) {
    console.error("[image-gen] Featured image failed:", error);
    return "";
  }
}

async function generateAndStoreInline(
  slug: string,
  index: number,
  prompt: string
): Promise<string> {
  // Prefer Stability AI for inline (cheaper); fall back to OpenAI if not configured.
  const provider = isStabilityConfigured()
    ? "stability"
    : isOpenAIConfigured()
      ? "openai"
      : null;

  if (!provider) {
    console.warn(
      `[image-gen] No image provider configured for inline image ${index}.`
    );
    return "";
  }
  if (!isFirebaseConfigured()) {
    console.warn("[image-gen] Firebase Storage not configured.");
    return "";
  }

  try {
    let bytes: Buffer;
    let contentType: string;

    if (provider === "stability") {
      const result = await generateStabilityImage({
        prompt: prompt + INLINE_SUFFIX,
        aspectRatio: "16:9",
        outputFormat: "jpeg",
        negativePrompt: "text, watermark, logo, low quality, blurry",
      });
      bytes = result.bytes;
      contentType = result.contentType;
    } else {
      const response = await getOpenAI().images.generate({
        model: OPENAI_IMAGE_MODEL,
        prompt: prompt + INLINE_SUFFIX,
        size: "1792x1024",
        quality: "standard",
        n: 1,
        response_format: "b64_json",
      });
      const b64 = response.data?.[0]?.b64_json;
      if (!b64) throw new Error("No image data returned by OpenAI.");
      bytes = Buffer.from(b64, "base64");
      contentType = "image/png";
    }

    const ext = contentType.endsWith("png") ? "png" : "jpg";
    return await uploadToStorage(
      `articles/${slug}/inline-${index + 1}.${ext}`,
      bytes,
      contentType
    );
  } catch (error) {
    console.error(`[image-gen] Inline ${index} failed:`, error);
    return "";
  }
}

async function uploadToStorage(
  path: string,
  bytes: Buffer,
  contentType: string
): Promise<string> {
  const bucket = getBucket();
  const file = bucket.file(path);
  await file.save(bytes, {
    metadata: { contentType, cacheControl: "public, max-age=31536000, immutable" },
    resumable: false,
  });
  // Make public for direct CDN serving via Firebase
  await file.makePublic();
  return `https://storage.googleapis.com/${bucket.name}/${path}`;
}
