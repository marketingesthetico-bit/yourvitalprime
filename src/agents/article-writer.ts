/**
 * YourVitalPrime — Agent 3: Article Writer
 * Model: Claude Sonnet 4.6
 * Generates long-form health articles for 50+ audience
 * Called by: /api/cron/generate-article
 */

import Anthropic from "@anthropic-ai/sdk";
import { getPersonaForPillar, type Persona } from "@/content/personas";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export interface ArticleInput {
  keyword: string;
  keyword_secondary: string[];
  pillar: string;
  kd_estimate: number;
  competitor_analysis: CompetitorAnalysis;
  lang: "en" | "es";
}

export interface CompetitorAnalysis {
  avg_word_count: number;
  content_gaps: string[];
  top_headings: string[];
  serp_features: string[];
}

export interface GeneratedArticle {
  title: string;
  slug: string;
  meta_description: string;
  content_html: string;
  content_mdx: string;
  featured_image_prompt: string;
  inline_image_prompts: [string, string];
  schema_faq: FAQItem[];
  word_count: number;
  reading_time_min: number;
  internal_link_suggestions: string[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export async function generateArticle(
  input: ArticleInput
): Promise<GeneratedArticle> {
  const persona = getPersonaForPillar(input.pillar);
  const targetWordCount = Math.max(
    2200,
    input.competitor_analysis.avg_word_count + 400
  );

  const systemPrompt = buildSystemPrompt(persona, input.lang);
  const userPrompt = buildUserPrompt(input, persona, targetWordCount);

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 8000,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  const rawContent = response.content[0].type === "text"
    ? response.content[0].text
    : "";

  return parseArticleResponse(rawContent, input);
}

function buildSystemPrompt(persona: Persona, lang: "en" | "es"): string {
  if (lang === "en") {
    return `You are the lead writer for YourVitalPrime.com — a health and longevity resource for adults 50+.

Your reader is ${persona.name}, ${persona.age_range}. 

Their pain points:
${persona.pain_points.map((p) => `- ${p}`).join("\n")}

Their goals:
${persona.goals.map((g) => `- ${g}`).join("\n")}

Voice and language style:
${persona.language_style}

NEVER do these things:
${persona.avoid.map((a) => `- ${a}`).join("\n")}

Writing craft notes:
${persona.writing_notes}

STOP-SLOP RULES (apply to every sentence):
- No filler openers ("In today's world...", "It's no secret that...")
- No adverbs — cut them all
- Active voice only — every sentence has a human subject doing something
- Specific over vague — name the exact thing, not "the studies show"
- Vary rhythm — mix short punchy sentences with longer flowing ones
- "You" beats "people". Specifics beat abstractions.
- No pull-quote-style zingers at paragraph ends
- No em-dashes
- Trust the reader — no hand-holding or softening

STRUCTURE RULES:
- Open with the pain/problem — not a definition, not a statistic
- Use the reader's real experience as the hook
- Build toward practical action
- End with realistic expectations, not a pep talk

OUTPUT FORMAT: Return a JSON object exactly matching this schema:
{
  "title": "...",
  "slug": "...",
  "meta_description": "...",
  "content_mdx": "full article in MDX format with ## headings",
  "featured_image_prompt": "detailed DALL-E 3 prompt for featured image",
  "inline_image_prompts": ["prompt for image 1", "prompt for image 2"],
  "faq": [
    {"question": "...", "answer": "..."},
    {"question": "...", "answer": "..."},
    {"question": "...", "answer": "..."}
  ]
}`;
  }

  // Spanish system prompt (for future expansion)
  return `Eres el escritor principal de YourVitalPrime.com — un recurso de salud y longevidad para adultos de 50+...`;
}

function buildUserPrompt(
  input: ArticleInput,
  persona: Persona,
  targetWordCount: number
): string {
  return `Write a complete article for this keyword: "${input.keyword}"

Secondary keywords to work in naturally: ${input.keyword_secondary.join(", ")}

Content pillar: ${input.pillar}
Target word count: ${targetWordCount} words
Competitor average: ${input.competitor_analysis.avg_word_count} words (beat this by at least 400)

Content gaps your competitors MISSED (cover all of these):
${input.competitor_analysis.content_gaps.map((g) => `- ${g}`).join("\n")}

SERP features present (optimize for these):
${input.competitor_analysis.serp_features.join(", ")}

ARTICLE REQUIREMENTS:

Title: 
- Must include the exact keyword naturally
- Emotionally resonant — speaks to the reader's fear or goal
- 55-65 characters
- No clickbait. No "you won't believe" style.

Structure:
1. Hook (2-3 paragraphs) — Start with the reader's experience. No definition. No "what is X".
2. Why this happens (the mechanism) — brief, clear, non-technical
3. What the science actually says — cite 2-3 real studies (NIH, PubMed, major journals)
4. What to do about it — practical, specific, actionable steps
5. Realistic expectations — honest about timelines and limits
6. FAQ section — 3 questions a real reader would ask (use their exact language)

Medical disclaimer: Include this once, naturally: "As always, talk to your doctor before making changes to your supplement routine or exercise program — especially if you have existing health conditions."

External links to include:
- Link to 1-2 PubMed or NIH studies you reference
- Link to Mayo Clinic or NHS for one supporting fact

Image prompts:
- Featured image: Warm, editorial photography aesthetic. Real-looking adults 55-65 in a setting relevant to the article topic. Authentic, not stock-photo. Positive but realistic. No text. 16:9.
- Inline image 1: [Concept/data visualization relevant to the article's key mechanism]
- Inline image 2: [Practical/lifestyle scene showing someone doing the recommended action]

Meta description: 150-160 chars, includes keyword, answers "what will I learn?", compels click.

Slug: URL-friendly, 3-6 words, includes primary keyword.`;
}

function parseArticleResponse(
  raw: string,
  input: ArticleInput
): GeneratedArticle {
  // Extract JSON from response
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Article writer returned no valid JSON");
  }

  const parsed = JSON.parse(jsonMatch[0]);

  // Calculate word count from MDX content
  const wordCount = parsed.content_mdx
    .replace(/[#*`\[\]()]/g, "")
    .split(/\s+/)
    .filter(Boolean).length;

  const readingTime = Math.ceil(wordCount / 200); // 200 wpm average

  // Convert MDX to HTML (simplified — use remark in actual implementation)
  const contentHtml = parsed.content_mdx;

  return {
    title: parsed.title,
    slug: parsed.slug,
    meta_description: parsed.meta_description,
    content_html: contentHtml,
    content_mdx: parsed.content_mdx,
    featured_image_prompt: parsed.featured_image_prompt,
    inline_image_prompts: parsed.inline_image_prompts,
    schema_faq: parsed.faq,
    word_count: wordCount,
    reading_time_min: readingTime,
    internal_link_suggestions: [], // Agent 5 (SEO Auditor) populates this
  };
}
