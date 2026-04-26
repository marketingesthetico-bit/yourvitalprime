import { getAnthropic, ANTHROPIC_MODEL, extractText, extractJson } from "@/lib/anthropic";

export interface HumanizerScores {
  directness: number;
  rhythm: number;
  trust: number;
  authenticity: number;
  density: number;
  total: number;
}

export interface HumanizerResult {
  content: string;
  scores: HumanizerScores;
  passed: boolean;
  revision_count: number;
  issues_fixed: string[];
}

const MAX_REVISIONS = 3;
const PASSING_SCORE = 35;

export async function humanizeArticle(
  content: string,
  keyword: string
): Promise<HumanizerResult> {
  let current = content;
  let revisions = 0;
  const issuesFixed: string[] = [];

  while (revisions < MAX_REVISIONS) {
    const { scores, issues } = await scoreContent(current, keyword);
    if (scores.total >= PASSING_SCORE) {
      return {
        content: current,
        scores,
        passed: true,
        revision_count: revisions,
        issues_fixed: issuesFixed,
      };
    }
    issuesFixed.push(...issues);
    current = await reviseContent(current, issues, keyword);
    revisions += 1;
  }

  const { scores } = await scoreContent(current, keyword);
  return {
    content: current,
    scores,
    passed: scores.total >= PASSING_SCORE,
    revision_count: revisions,
    issues_fixed: issuesFixed,
  };
}

type ScorePayload = Partial<HumanizerScores> & { issues?: string[] };

async function scoreContent(
  content: string,
  keyword: string
): Promise<{ scores: HumanizerScores; issues: string[] }> {
  const message = await getAnthropic().messages.create({
    model: ANTHROPIC_MODEL,
    max_tokens: 1000,
    system:
      "You are a writing-quality auditor applying the Stop-Slop framework. Return ONLY a JSON object, no other text.",
    messages: [
      {
        role: "user",
        content: `Score this article about "${keyword}" on these 5 dimensions (1-10 each):

1. DIRECTNESS: Does it make statements or just announce? (10 = all direct, 1 = all setup)
2. RHYTHM: Is sentence length varied? (10 = excellent, 1 = metronomic)
3. TRUST: Does it respect reader intelligence? (10 = trusts, 1 = hand-holding)
4. AUTHENTICITY: Does it sound human or AI? (10 = fully human, 1 = obvious AI)
5. DENSITY: Is every sentence earning its place? (10 = no filler, 1 = padded)

Also list specific issues found (max 8).

Article (truncated):
${content.slice(0, 4000)}

Return this exact JSON:
{
  "directness": N,
  "rhythm": N,
  "trust": N,
  "authenticity": N,
  "density": N,
  "issues": [
    "specific issue description"
  ]
}`,
      },
    ],
  });

  const raw = extractText(message);
  const parsed = extractJson<ScorePayload>(raw) ?? {};

  const directness = parsed.directness ?? 5;
  const rhythm = parsed.rhythm ?? 5;
  const trust = parsed.trust ?? 5;
  const authenticity = parsed.authenticity ?? 5;
  const density = parsed.density ?? 5;

  return {
    scores: {
      directness,
      rhythm,
      trust,
      authenticity,
      density,
      total: directness + rhythm + trust + authenticity + density,
    },
    issues: parsed.issues ?? [],
  };
}

async function reviseContent(
  content: string,
  issues: string[],
  keyword: string
): Promise<string> {
  const message = await getAnthropic().messages.create({
    model: ANTHROPIC_MODEL,
    max_tokens: 8000,
    system:
      "You are a writing editor applying the Stop-Slop framework to health content for adults 50+. Fix the listed problems without changing facts, structure, or SEO keywords. Return ONLY the revised article — no commentary, no preamble.",
    messages: [
      {
        role: "user",
        content: `Fix these specific issues in this article about "${keyword}":

ISSUES TO FIX:
${issues.map((issue, n) => `${n + 1}. ${issue}`).join("\n")}

STOP-SLOP RULES TO APPLY:
- Cut ALL filler openers ("In today's world...", "It's no secret...", "When it comes to...")
- Remove every adverb (significantly, essentially, remarkably, truly, really, etc.)
- Convert passive to active voice — find who is DOING the action
- Replace vague statements with specific facts or names
- Vary sentence length — no three consecutive sentences of similar length
- Replace "people" with "you" throughout
- Cut any sentence that doesn't add information
- Remove all em-dashes
- Remove pull-quote-style paragraph endings
- If a sentence starts with "It", "There", or "This", restructure to lead with the real subject

Keep: All facts, citations, keyword mentions, headings, FAQ section, medical disclaimer.

ARTICLE:
${content}`,
      },
    ],
  });

  const raw = extractText(message);
  return raw.trim() || content;
}
