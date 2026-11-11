import "dotenv/config"
import express from "express"
import multer from "multer"
import { PDFParse } from "pdf-parse"
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters"
import  getEmbeded  from "./OpenAi"

const CHUNK_SIZE = 1000 
const CHUNK_OVERLAP=200 

const app = express()
const upload = multer({ storage: multer.memoryStorage() })
async function IngestFucntion(req: any,res:any) {
  try { 
    if (!req.file) { 
      return res.status(500).json("Client must first upload file ")
    }
    // get the text
    const parser = new PDFParse({ data: req.file.buffer })
    const { text } = await parser.getText()
    if (!text.trim()) { 
      return res.status(400).json("File must have text data ");
    }

    // splitter
    const splitter = new RecursiveCharacterTextSplitter({chunkSize:CHUNK_SIZE,chunkOverlap:CHUNK_OVERLAP})
    // chunking 
    const chunks = await splitter.splitText(text)
    // embeded
    const embeded = await getEmbeded(chunks);
    // store 
  } catch (err: unknown) { 
    console.log(err)
      return res.status(500).json("Server Error While Ingestion Process");

  }
}

app.post("/ingest", upload.single("file"), IngestFucntion)


app.listen(3000, () => { 
  console.log("Server is running in port 3000")
})