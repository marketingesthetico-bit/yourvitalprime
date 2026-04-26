const STABILITY_ENDPOINT =
  "https://api.stability.ai/v2beta/stable-image/generate/core";

export function isStabilityConfigured(): boolean {
  return !!process.env.STABILITY_API_KEY;
}

type GenerateOptions = {
  prompt: string;
  /** "16:9", "1:1", "5:4", etc. Defaults to 16:9. */
  aspectRatio?: string;
  /** Negative prompt — things to avoid in the image. */
  negativePrompt?: string;
  /** Output format. PNG is highest quality, JPEG is smaller. */
  outputFormat?: "png" | "jpeg" | "webp";
};

export type StabilityImage = {
  bytes: Buffer;
  contentType: string;
};

/**
 * Call Stability AI Stable Image Core to generate one image.
 * Returns the raw bytes; the caller is responsible for storing it.
 */
export async function generateStabilityImage(
  opts: GenerateOptions
): Promise<StabilityImage> {
  const apiKey = process.env.STABILITY_API_KEY;
  if (!apiKey) {
    throw new Error("STABILITY_API_KEY not set.");
  }

  const form = new FormData();
  form.append("prompt", opts.prompt);
  form.append("aspect_ratio", opts.aspectRatio ?? "16:9");
  form.append("output_format", opts.outputFormat ?? "jpeg");
  if (opts.negativePrompt) form.append("negative_prompt", opts.negativePrompt);

  const response = await fetch(STABILITY_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: "image/*",
    },
    body: form,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(
      `Stability AI ${response.status}: ${text.slice(0, 200) || response.statusText}`
    );
  }

  const buf = Buffer.from(await response.arrayBuffer());
  const contentType = response.headers.get("content-type") ?? "image/jpeg";
  return { bytes: buf, contentType };
}
