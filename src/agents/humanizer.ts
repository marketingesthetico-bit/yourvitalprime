/**
 * YourVitalPrime — Agent 4: Humanizer
 * Model: Claude Sonnet 4.6
 * Applies Stop-Slop skill to remove AI writing patterns
 * Scores and revises until authenticity score >= 35/50
 */

import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export interface HumanizerResult {
  content: string;
  scores: HumanizerScores;
  passed: boolean;
  revision_count: number;
  issues_fixed: string[];
}

export interface HumanizerScores {
  directness: number;    // 1-10: Statements or announcements?
  rhythm: number;        // 1-10: Varied or metronomic?
  trust: number;         // 1-10: Respects reader intelligence?
  authenticity: number;  // 1-10: Sounds human?
  density: number;       // 1-10: Anything cuttable?
  total: number;         // Sum of above
}

const MAX_REVISIONS = 3;
const PASSING_SCORE = 35;

export async function humanizeArticle(
  content: string,
  keyword: string
): Promise<HumanizerResult> {
  let currentContent = content;
  let revisionCount = 0;
  let allIssuesFixed: string[] = [];

  while (revisionCount < MAX_REVISIONS) {
    const { scores, issues } = await scoreContent(currentContent, keyword);
    
    if (scores.total >= PASSING_SCORE) {
      return {
        content: currentContent,
        scores,
        passed: true,
        revision_count: revisionCount,
        issues_fixed: allIssuesFixed,
      };
    }

    // Score too low — identify and fix issues
    allIssuesFixed = [...allIssuesFixed, ...issues];
    currentContent = await reviseContent(currentContent, issues, keyword);
    revisionCount++;
  }

  // Final score after max revisions
  const { scores } = await scoreContent(currentContent, keyword);
  return {
    content: currentContent,
    scores,
    passed: scores.total >= PASSING_SCORE,
    revision_count: revisionCount,
    issues_fixed: allIssuesFixed,
  };
}

async function scoreContent(
  content: string,
  keyword: string
): Promise<{ scores: HumanizerScores; issues: string[] }> {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1000,
    system: `You are a writing quality auditor applying the Stop-Slop framework. 
Analyze the given article and score it. Return ONLY a JSON object, no other text.`,
    messages: [
      {
        role: "user",
        content: `Score this article about "${keyword}" on these 5 dimensions (1-10 each):

1. DIRECTNESS: Does it make statements or announcements? (10 = all direct statements, 1 = all setup/announcement)
2. RHYTHM: Is sentence length varied? (10 = excellent variation, 1 = metronomic same length)
3. TRUST: Does it respect reader intelligence or over-explain? (10 = trusts reader completely, 1 = constant hand-holding)
4. AUTHENTICITY: Does it sound human or AI-generated? (10 = fully human, 1 = obvious AI)
5. DENSITY: Is every sentence earning its place? (10 = zero filler, 1 = lots of padding)

Also list specific issues found (max 8):

Article:
${content.substring(0, 4000)}

Return this exact JSON:
{
  "directness": N,
  "rhythm": N,
  "trust": N,
  "authenticity": N,
  "density": N,
  "issues": [
    "specific issue description",
    ...
  ]
}`,
      },
    ],
  });

  const raw =
    response.content[0].type === "text" ? response.content[0].text : "{}";
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : {};

  const scores: HumanizerScores = {
    directness: parsed.directness || 5,
    rhythm: parsed.rhythm || 5,
    trust: parsed.trust || 5,
    authenticity: parsed.authenticity || 5,
    density: parsed.density || 5,
    total:
      (parsed.directness || 5) +
      (parsed.rhythm || 5) +
      (parsed.trust || 5) +
      (parsed.authenticity || 5) +
      (parsed.density || 5),
  };

  return { scores, issues: parsed.issues || [] };
}

async function reviseContent(
  content: string,
  issues: string[],
  keyword: string
): Promise<string> {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 8000,
    system: `You are a writing editor applying the Stop-Slop framework to health content for adults 50+.
Your job is to fix specific writing problems without changing the facts, structure, or SEO keywords.
Return ONLY the revised article content, no commentary.`,
    messages: [
      {
        role: "user",
        content: `Fix these specific issues in this article about "${keyword}":

ISSUES TO FIX:
${issues.map((i, n) => `${n + 1}. ${i}`).join("\n")}

STOP-SLOP RULES TO APPLY:
- Cut ALL filler openers ("In today's world...", "It's no secret...", "When it comes to...")
- Remove every adverb (significantly, essentially, remarkably, truly, really, etc.)
- Convert passive voice to active voice — find who is DOING the action and make them the subject
- Replace vague statements with specific facts or names
- Vary sentence length — no three consecutive sentences of similar length
- Replace "people" with "you" throughout
- Cut any sentence that doesn't add information or move the narrative forward
- Remove all em-dashes
- Remove pull-quote-style paragraph endings (profound single-sentence wrap-ups)
- If a sentence starts with "It", "There", or "This", restructure to lead with the real subject

Keep: All facts, citations, keyword mentions, headings structure, FAQ section, medical disclaimer.

ARTICLE:
${content}`,
      },
    ],
  });

  return response.content[0].type === "text"
    ? response.content[0].text
    : content;
}
