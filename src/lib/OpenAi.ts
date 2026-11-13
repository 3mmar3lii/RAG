import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const EMBED_MODEL = "text-embedding-3-small";
const CHAT_MODEL = "gpt-4o-mini";

export async function getEmbeddings(input: string, model?: string): Promise<number[]>;
export async function getEmbeddings(input: string[], model?: string): Promise<number[][]>;

export async function getEmbeddings(
  input: string | string[],
  model: string = EMBED_MODEL,
): Promise<number[] | number[][]> {
  if (Array.isArray(input) && input.length === 0) {
    return [];
  }

  const { data } = await openai.embeddings.create({
    model,
    input,
  });

  if (Array.isArray(input)) {
    return data.map((item) => item.embedding);
  }

  return data[0].embedding;
}
