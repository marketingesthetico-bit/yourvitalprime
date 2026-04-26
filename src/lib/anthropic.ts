import Anthropic from "@anthropic-ai/sdk";

let client: Anthropic | null = null;

export const ANTHROPIC_MODEL = "claude-sonnet-4-6";

export function isAnthropicConfigured(): boolean {
  return !!process.env.ANTHROPIC_API_KEY;
}

export function getAnthropic(): Anthropic {
  if (client) return client;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY not set.");
  }
  client = new Anthropic({ apiKey });
  return client;
}

/**
 * Extract the first text block from a Messages API response.
 */
export function extractText(message: Anthropic.Message): string {
  const block = message.content.find((b) => b.type === "text");
  return block && block.type === "text" ? block.text : "";
}

/**
 * Extract the first JSON object from a string (LLMs often wrap with prose).
 * Returns null if no parsable JSON found.
 */
export function extractJson<T = unknown>(raw: string): T | null {
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]) as T;
  } catch {
    return null;
  }
}
