import OpenAI from "openai";

const OpenAIEmbeddings = new OpenAI({
  apiKey: process.env.OPEN_API_SECTET_KEY,
});

const EMBDED_MODEL = "text-embedding-3-small";
const CHAT_MODEL="gpt-4o-mini"

async function getEmbeded(text: string[]):Promise < number[][]> {
  const {data} = await OpenAIEmbeddings.embeddings.create({
    model: EMBDED_MODEL,
    input: text,
  });
  return data.map(item => item.embedding)
}
export default getEmbeded;
