import OpenAI from "openai";
import { logError } from "@/lib/logger/Logger";

let openai: OpenAI;
function getOpenAI() {
  if (!openai) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "dummy" });
  }
  return openai;
}

export async function getRelevantCVSections({
  supabaseAdmin, cvId, jobDescription, topK = 5}: {
  supabaseAdmin: any;
  cvId: string;
  jobDescription: string;
  topK?: number;
}) {
  try {
    const ai = getOpenAI();
    const embeddingResponse = await ai.embeddings.create({
      model: "text-embedding-3-small",
      input: jobDescription,
    });

    const jobEmbedding = embeddingResponse.data[0]!.embedding;

    // ✅ Query pgvector RPC
    const { data, error } = await supabaseAdmin.rpc("match_cv_sections", {
      query_embedding: jobEmbedding,
      match_cv_id: cvId,
      match_count: topK,
    });

    if (error || !data || data.length === 0) return "";

    const combined = data.map((row: any) => row.section_text).join("\n\n");

    return combined;
  } catch (err) {
    logError("RAG Error", err);
    return "";
  }
}
