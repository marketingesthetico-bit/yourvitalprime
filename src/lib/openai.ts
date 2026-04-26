import OpenAI from "openai";

let client: OpenAI | null = null;

export const OPENAI_TEXT_MODEL = "gpt-4o-mini";
export const OPENAI_IMAGE_MODEL = "dall-e-3";

export function isOpenAIConfigured(): boolean {
  return !!process.env.OPENAI_API_KEY;
}

export function getOpenAI(): OpenAI {
  if (client) return client;
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY not set.");
  }
  client = new OpenAI({ apiKey });
  return client;
}
