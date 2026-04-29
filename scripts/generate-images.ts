/**
 * YourVitalPrime — Image Generation Script
 * Run: npm run gen:images
 *
 * Generates the editorial site images (hero, section banners, OG default)
 * via OpenAI DALL-E 3 and saves them to public/images/.
 *
 * Cost: ~$0.04-0.08 per image. Total run: ~$0.40 for the 8 images below.
 *
 * Re-run anytime to regenerate. To skip already-generated images, pass
 * SKIP_EXISTING=1.
 */

import * as fs from "node:fs";
import * as path from "node:path";

const OUTPUT_DIR = path.resolve(process.cwd(), "public", "images");

type Spec = {
  name: string;
  /** DALL-E 3 size. Wide = 1792x1024, square = 1024x1024, portrait = 1024x1792 */
  size: "1792x1024" | "1024x1024" | "1024x1792";
  /** "hd" doubles cost but is sharper for hero/large displays. */
  quality: "standard" | "hd";
  prompt: string;
};

/**
 * House style — a single shared description that gives every image the same
 * visual language (warm, editorial, real adults 50+, never stock-photo-y).
 */
const HOUSE_STYLE = `
Warm editorial photography, magazine-quality. Soft natural light, golden-hour or
soft window light. Authentic, real-looking adults aged 55 to 70 — diverse but never
celebrity-perfect. Slightly imperfect: a hand on a coffee cup, a gentle smile lines,
a lived-in setting. Muted earth-tone palette: terracotta, cream, deep olive, warm
grey, soft amber. Shallow depth of field where appropriate. NEVER stock-photo
flatness. NEVER bright clinical hospital lighting. NEVER text or logos in the image.
NEVER gym-bro aesthetic. NEVER perfect Instagram-ready faces. Aspirational but
grounded — like a Sunday-supplement editorial about people you'd actually want to
talk to.`.trim();

const specs: Spec[] = [
  {
    name: "hero-home.jpg",
    size: "1792x1024",
    quality: "hd",
    prompt: `Cover image for a health publication for adults 50+. Wide composition.
A man and a woman both in their early 60s, side by side at a sunlit kitchen counter
in a warm Mediterranean home. They are sharing morning coffee and looking at an open
notebook together — relaxed, mid-conversation. Through a window behind them: soft
out-of-focus garden greens. Cream linen curtains. The framing leaves the LEFT THIRD
of the image quieter and less detailed (for headline overlay). ${HOUSE_STYLE}`,
  },
  {
    name: "letter-section.jpg",
    size: "1024x1024",
    quality: "standard",
    prompt: `Editorial still life. An open hardcover notebook on a warm wooden desk,
a fountain pen resting on the page, a pair of reading glasses to the side, a small
ceramic cup of black coffee. Warm window light from the right, soft long shadows.
Slightly overhead 3/4 angle. Quiet, contemplative — the desk of someone who reads
medical research for a living. ${HOUSE_STYLE}`,
  },
  {
    name: "pillars-banner.jpg",
    size: "1792x1024",
    quality: "standard",
    prompt: `Wide editorial scene. A 60-something woman in soft daylight, walking
through a Madrid park or quiet urban street, mid-stride, looking ahead. She wears
warm-toned everyday clothing (terracotta scarf, olive coat). Buildings warm and
low-saturation behind. The composition has wide negative space on the LEFT and
RIGHT. She is not the centerpiece — the scene is. ${HOUSE_STYLE}`,
  },
  {
    name: "newsletter-bg.jpg",
    size: "1792x1024",
    quality: "standard",
    prompt: `Wide overhead view of a wooden table, warm Sunday morning. A folded
newspaper, a half-finished coffee, a pair of reading glasses, a pen, a hand-written
letter on cream paper. Soft golden window light streaming from the upper-left.
Quiet, slow, intimate. Warm earth tones — cream paper, dark coffee, terracotta
ceramic. No text visible on the letter. ${HOUSE_STYLE}`,
  },
  {
    name: "about-detail.jpg",
    size: "1024x1024",
    quality: "standard",
    prompt: `A small Madrid editorial workspace. A worn leather-bound research
journal lying open on a wooden table, with a hand-drawn marginal note in pencil.
A small ceramic cup of cortado coffee, slightly out of focus. Warm window light.
The image conveys: someone has been carefully reading and thinking here. ${HOUSE_STYLE}`,
  },
  {
    name: "og-default.jpg",
    size: "1792x1024",
    quality: "standard",
    prompt: `Editorial cover image for a longevity and health publication. A 60-year-old
person's hands cradling a warm mug, soft morning light, blurred terracotta linen
in the background. Calm, intimate, grounded. Wide composition. Brand-appropriate
warm palette: cream, terracotta, deep navy. ${HOUSE_STYLE}`,
  },
];

async function generateOne(spec: Spec): Promise<void> {
  const outPath = path.join(OUTPUT_DIR, spec.name);
  if (process.env.SKIP_EXISTING === "1" && fs.existsSync(outPath)) {
    console.log(`[skip] ${spec.name} (already exists)`);
    return;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not set in env.");

  console.log(`[generating] ${spec.name} (${spec.size}, ${spec.quality})`);
  const start = Date.now();

  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "dall-e-3",
      prompt: spec.prompt,
      size: spec.size,
      quality: spec.quality,
      n: 1,
      response_format: "b64_json",
    }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`OpenAI ${response.status}: ${text.slice(0, 300)}`);
  }

  const json = (await response.json()) as {
    data: { b64_json?: string; revised_prompt?: string }[];
  };
  const b64 = json.data[0]?.b64_json;
  if (!b64) throw new Error("No image data returned by OpenAI.");

  fs.writeFileSync(outPath, Buffer.from(b64, "base64"));
  const duration = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`[done]       ${spec.name} in ${duration}s`);
}

async function main() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log(
    `Generating ${specs.length} images to ${path.relative(process.cwd(), OUTPUT_DIR)}/\n`
  );

  for (const spec of specs) {
    try {
      await generateOne(spec);
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error(`[error]      ${spec.name}: ${msg}`);
    }
  }

  console.log(
    "\nDone. Commit the generated images so they ship with the next deploy."
  );
}

main();
