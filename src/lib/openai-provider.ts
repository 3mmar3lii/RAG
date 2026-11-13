import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const EMBED_MODEL = "text-embedding-3-small";
const CHAT_MODEL = "gpt-4o-mini";

export async function openaiEmbeddings(input: string | string[]): Promise<number[] | number[][]> {
  if (Array.isArray(input) && input.length === 0) return [];

  const { data } = await openai.embeddings.create({
    model: EMBED_MODEL,
    input: input as string | string[],
  });

  return Array.isArray(input)
    ? data.map((item) => item.embedding)
    : data[0].embedding;
}

export async function openaiAnswer(
  chunks: string[],
  prompt: string,
  question: string,
): Promise<string> {
  const context = chunks.length > 0 ? chunks.join("\n\n") : "No matching passages were found";

  const { choices } = await openai.chat.completions.create({
    model: CHAT_MODEL,
    messages: [
      { role: "system", content: prompt },
      { role: "user", content: `Context:\n${context}\n\nQuestion: ${question}` },
    ],
    temperature: 0.2,
  });

  return choices[0]?.message?.content ?? "";
}
