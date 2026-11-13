import "dotenv/config";
import express, { Request, Response } from "express";
import multer from "multer";
import { PDFParse } from "pdf-parse";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { getEmbeddings } from "./lib/providers";
import { DeleteBySource, StoreChunks } from "./lib/Client";
import { UserQuery } from "./chat";

const CHUNK_SIZE = 1000;
const CHUNK_OVERLAP = 200;

const app = express();
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

async function IngestFunction(req: Request, res: Response) {
  try {
    if (!req.file) {
      return res.status(400).json({ ok: false, msg: "Client must first upload a file." });
    }

    // Extract text from PDF
    const parser = new PDFParse({ data: req.file.buffer });
    const { text } = await parser.getText();
    if (!text.trim()) {
      return res.status(400).json({ ok: false, msg: "File must contain readable text data." });
    }

    // Split text into chunks
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: CHUNK_SIZE,
      chunkOverlap: CHUNK_OVERLAP,
    });
    const chunks = await splitter.splitText(text);
    const source = String(req.file.originalname);

    // Delete old records & generate new embeddings concurrently
    const [, embeded] = await Promise.all([
      DeleteBySource(source),
      getEmbeddings(chunks),
    ]);

    const rows = chunks.map((r, idx) => ({
      content: r,
      metadata: { fileName: source },
      embedding: embeded[idx],
    }));

    // Store chunks in database
    await StoreChunks(rows);

    return res.status(200).json({
      ok: true,
      msg: "Document embedded and ingested successfully.",
      data: { source, chunksCount: rows.length },
    });
  } catch (err: unknown) {
    console.error("Ingestion error:", err);
    return res.status(500).json({ ok: false, msg: "Server error during ingestion process." });
  }
}

app.post("/ingest", upload.single("file"), IngestFunction);
app.post("/chat", UserQuery);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
