import "dotenv/config";
import { finalOpenAiClientAnswer, getEmbeddings } from "./lib/OpenAi";
import { matchDoucments } from "./lib/Client";

const SYSTEM_PROMPT = `You are a helpful assistant. 
Answer the user's question based strictly on the provided context.
 If the answer is not in the context, say you don't know.`;

export async function UserQuery(req: any, res: any) {
  try {
    const userQueryMsg =
      typeof req.body === "string"
        ? req.body
        : req.body?.message || req.body?.query;

    if (
      !userQueryMsg ||
      typeof userQueryMsg !== "string" ||
      !userQueryMsg.trim()
    ) {
      return res.status(400).json({ error: "Send a valid message!" });
    }

    // 2. Embed the message into a vector
    const embededResult = await getEmbeddings(userQueryMsg);

    // 3. Get matching chunks from the database
    const docs = await matchDoucments(embededResult);

    // 4. Send the message and chunks to OpenAI with a valid system prompt
    const finalAnswer = await finalOpenAiClientAnswer({
      chunks: docs,
      prompt: SYSTEM_PROMPT,
      question: userQueryMsg,
    });

    // 5. Send the actual answer back to the user
    return res.status(200).json({ answer: finalAnswer });
  } catch (err) {
    console.error("Server Error:", err);
    return res.status(500).json({ error: "Error in User Query Message" });
  }
}
