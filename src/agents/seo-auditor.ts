import { getOpenAI, OPENAI_TEXT_MODEL, isOpenAIConfigured } from "@/lib/openai";

export interface SeoAuditInput {
  content: string;
  title: string;
  meta_description: string;
  slug: string;
  keyword: string;
}

export interface SeoAuditResult {
  score: number; // 0-100
  passed: boolean;
  issues: string[];
  signals: SeoSignals;
}

export interface SeoSignals {
  keyword_in_title: boolean;
  keyword_in_h1: boolean;
  keyword_in_first_100_words: boolean;
  keyword_in_meta_description: boolean;
  keyword_in_at_least_2_subheadings: boolean;
  keyword_in_slug: boolean;
  meta_description_length_ok: boolean; // 140-165
  word_count_ok: boolean; // 2000-3500
  internal_links_count: number;
  external_authority_links_count: number;
  has_faq_block: boolean;
  heading_hierarchy_ok: boolean;
}

const PASSING_SCORE = 75;

/**
 * Pre-publish SEO audit. Mostly deterministic — we don't need an LLM for the
 * structural checks. We only call the LLM if score is borderline and we want
 * a copy-quality opinion. For Phase 2 we keep it deterministic.
 */
export async function auditArticleSEO(
  input: SeoAuditInput
): Promise<SeoAuditResult> {
  const signals = computeSignals(input);
  const score = scoreFromSignals(signals);
  const issues = listIssues(signals, input);

  return {
    score,
    passed: score >= PASSING_SCORE,
    issues,
    signals,
  };
}

/**
 * Optional LLM-based deep audit. Only used if you want a second opinion on
 * a borderline article. Costs ~$0.001 per call.
 */
export async function deepAudit(
  input: SeoAuditInput
): Promise<{ summary: string; suggestions: string[] }> {
  if (!isOpenAIConfigured()) {
    return { summary: "OpenAI not configured", suggestions: [] };
  }

  const completion = await getOpenAI().chat.completions.create({
    model: OPENAI_TEXT_MODEL,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          'You are an SEO editor for a health blog targeting adults 50+. Read the article and return JSON: { "summary": string, "suggestions": string[] } with up to 5 prioritised suggestions. Be specific and actionable.',
      },
      {
        role: "user",
        content: `Primary keyword: ${input.keyword}\nTitle: ${input.title}\nMeta: ${input.meta_description}\nSlug: ${input.slug}\n\nContent (truncated):\n${input.content.slice(0, 4000)}`,
      },
    ],
  });

  const raw = completion.choices[0]?.message?.content ?? "{}";
  try {
    const parsed = JSON.parse(raw) as {
      summary?: string;
      suggestions?: string[];
    };
    return {
      summary: parsed.summary ?? "",
      suggestions: parsed.suggestions ?? [],
    };
  } catch {
    return { summary: "Audit parse error", suggestions: [] };
  }
}

function computeSignals(input: SeoAuditInput): SeoSignals {
  const { content, title, meta_description, slug, keyword } = input;
  const lowerKw = keyword.toLowerCase();
  const lowerContent = content.toLowerCase();
  const first100Words = lowerContent.split(/\s+/).slice(0, 100).join(" ");

  const headings = extractHeadings(content);
  const subheadingMatches = headings
    .filter((h) => h.level >= 2)
    .filter((h) => h.text.toLowerCase().includes(lowerKw)).length;

  const wordCount = content
    .replace(/[#*`\[\]()]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;

  const internalLinks = countLinks(content, /\]\(\/[^)]*\)/g);
  const externalLinks = countLinks(content, /\]\(https?:\/\/[^)]*\)/g);
  const externalAuthority = countAuthorityLinks(content);

  return {
    keyword_in_title: title.toLowerCase().includes(lowerKw),
    keyword_in_h1: headings[0]?.text.toLowerCase().includes(lowerKw) ?? false,
    keyword_in_first_100_words: first100Words.includes(lowerKw),
    keyword_in_meta_description: meta_description.toLowerCase().includes(lowerKw),
    keyword_in_at_least_2_subheadings: subheadingMatches >= 2,
    keyword_in_slug: slug.toLowerCase().includes(slugify(lowerKw).slice(0, 20)),
    meta_description_length_ok:
      meta_description.length >= 140 && meta_description.length <= 165,
    word_count_ok: wordCount >= 2000 && wordCount <= 3500,
    internal_links_count: internalLinks,
    external_authority_links_count: externalAuthority,
    has_faq_block: /faq|frequently asked/i.test(content),
    heading_hierarchy_ok: validHeadingHierarchy(headings),
  };
}

function scoreFromSignals(s: SeoSignals): number {
  let score = 0;
  if (s.keyword_in_title) score += 12;
  if (s.keyword_in_h1) score += 8;
  if (s.keyword_in_first_100_words) score += 8;
  if (s.keyword_in_meta_description) score += 8;
  if (s.keyword_in_at_least_2_subheadings) score += 8;
  if (s.keyword_in_slug) score += 8;
  if (s.meta_description_length_ok) score += 8;
  if (s.word_count_ok) score += 12;
  if (s.internal_links_count >= 2) score += 8;
  if (s.external_authority_links_count >= 2) score += 8;
  if (s.has_faq_block) score += 6;
  if (s.heading_hierarchy_ok) score += 6;
  return Math.min(100, score);
}

function listIssues(s: SeoSignals, input: SeoAuditInput): string[] {
  const issues: string[] = [];
  if (!s.keyword_in_title) issues.push("Primary keyword missing from title.");
  if (!s.keyword_in_h1) issues.push("Primary keyword missing from H1.");
  if (!s.keyword_in_first_100_words)
    issues.push("Primary keyword missing from first 100 words.");
  if (!s.keyword_in_meta_description)
    issues.push("Primary keyword missing from meta description.");
  if (!s.keyword_in_at_least_2_subheadings)
    issues.push("Primary keyword appears in fewer than 2 subheadings.");
  if (!s.keyword_in_slug) issues.push("Primary keyword missing from slug.");
  if (!s.meta_description_length_ok)
    issues.push(
      `Meta description length is ${input.meta_description.length} (target 140-165).`
    );
  if (!s.word_count_ok)
    issues.push("Word count outside 2000-3500 target band.");
  if (s.internal_links_count < 2)
    issues.push(`Only ${s.internal_links_count} internal link(s) (target 2-4).`);
  if (s.external_authority_links_count < 2)
    issues.push(
      `Only ${s.external_authority_links_count} external authority link(s) (target 2-3 to NIH/Mayo/PubMed/NHS).`
    );
  if (!s.has_faq_block) issues.push("FAQ block not detected.");
  if (!s.heading_hierarchy_ok)
    issues.push("Heading hierarchy skips levels (H2 → H4 etc).");
  return issues;
}

function extractHeadings(mdx: string): { level: number; text: string }[] {
  const out: { level: number; text: string }[] = [];
  const lines = mdx.split("\n");
  for (const line of lines) {
    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      out.push({ level: match[1].length, text: match[2].trim() });
    }
  }
  return out;
}

function validHeadingHierarchy(headings: { level: number }[]): boolean {
  for (let i = 1; i < headings.length; i += 1) {
    const jump = headings[i].level - headings[i - 1].level;
    if (jump > 1) return false;
  }
  return true;
}

function countLinks(content: string, pattern: RegExp): number {
  return (content.match(pattern) ?? []).length;
}

const AUTHORITY_DOMAINS = [
  "nih.gov",
  "pubmed.ncbi.nlm.nih.gov",
  "mayoclinic.org",
  "nhs.uk",
  "who.int",
  "cdc.gov",
  "cochrane.org",
  "harvard.edu",
  "jamanetwork.com",
  "thelancet.com",
  "nejm.org",
];

function countAuthorityLinks(content: string): number {
  let count = 0;
  for (const domain of AUTHORITY_DOMAINS) {
    const re = new RegExp(`https?://[^)\\s]*${domain.replace(/\./g, "\\.")}`, "g");
    count += (content.match(re) ?? []).length;
  }
  return count;
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}
