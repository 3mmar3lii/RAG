import { geminiEmbeddings, geminiAnswer } from "./gemini";
import { openaiEmbeddings, openaiAnswer } from "./openai";

type Provider = "gemini" | "openai";

function getProvider(): Provider {
  const val = (process.env.AI_PROVIDER ?? "gemini").toLowerCase();
  if (val !== "gemini" && val !== "openai") {
    throw new Error(`Unknown AI_PROVIDER="${val}". Choose "gemini" or "openai".`);
  }
  return val as Provider;
}

// Overloads for type safety
export async function getEmbeddings(input: string): Promise<number[]>;
export async function getEmbeddings(input: string[]): Promise<number[][]>;
export async function getEmbeddings(input: string | string[]): Promise<number[] | number[][]> {
  const provider = getProvider();
  return provider === "openai"
    ? openaiEmbeddings(input)
    : geminiEmbeddings(input);
}

export async function getFinalAnswer({
  chunks,
  prompt,
  question,
}: {
  chunks: string[];
  prompt: string;
  question: string;
}): Promise<string> {
  if (!chunks || !prompt || !question) {
    throw new Error("Cannot complete this process without chunks, prompt, or question provided");
  }
  const provider = getProvider();
  return provider === "openai"
    ? openaiAnswer(chunks, prompt, question)
    : geminiAnswer(chunks, prompt, question);
}
