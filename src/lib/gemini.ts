import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI();

const EMBED_MODEL = "gemini-embedding-001";
const CHAT_MODEL = "gemini-3.5-flash-lite";

export async function geminiEmbeddings(input: string | string[]): Promise<number[] | number[][]> {
  if (Array.isArray(input) && input.length === 0) return [];

  const response = await ai.models.embedContent({
    model: EMBED_MODEL,
    contents: input,
    config: { outputDimensionality: 1536 },
  });

  const embeddings = response.embeddings ?? [];
  return Array.isArray(input)
    ? embeddings.map((item) => item.values ?? [])
    : (embeddings[0]?.values ?? []);
}

export async function geminiAnswer(
  chunks: string[],
  prompt: string,
  question: string,
): Promise<string> {
  const context = chunks.length > 0 ? chunks.join("\n\n") : "No matching passages were found";

  const response = await ai.models.generateContent({
    model: CHAT_MODEL,
    contents: `Context:\n${context}\n\nQuestion: ${question}`,
    config: { systemInstruction: prompt, temperature: 0.2 },
  });

  return response.text ?? "";
}
