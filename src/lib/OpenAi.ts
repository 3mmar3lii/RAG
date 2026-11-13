import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const EMBED_MODEL = "text-embedding-3-small";
const CHAT_MODEL = "gpt-4o-mini";

export async function getEmbeddings(
  input: string,
  model?: string,
): Promise<number[]>;
export async function getEmbeddings(
  input: string[],
  model?: string,
): Promise<number[][]>;

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

type FinalOpenAiClientAnswerType = {
  chunks: string[];
  prompt: string;
  question: string;
};

export async function finalOpenAiClientAnswer({
  chunks,
  prompt,
  question,
}: FinalOpenAiClientAnswerType) {
  if (!chunks || !prompt || !question) {
    throw new Error(
      "Cannot complete this process without chunks, prompt, or question provided",
    );
  }

  const context =
    chunks.length > 0 ? chunks.join("\n\n") : "No matching passages were found";

  const { choices } = await openai.chat.completions.create({
    model: CHAT_MODEL,
    messages: [
      { role: "system", content: prompt },
      {
        role: "user",
        content: `Context:\n${context}\n\nQuestion: ${question}`,
      },
    ],
    temperature: 0.2,
  });

  return choices[0]?.message?.content ?? "";
}

