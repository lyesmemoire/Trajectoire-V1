import OpenAI from "openai";

import {
  logError,
} from "@/lib/logger/Logger";

function getConfiguredOpenAI():
  | OpenAI
  | null {
  const apiKey =
    process.env
      .OPENAI_API_KEY
      ?.trim();

  if (!apiKey) {
    return null;
  }

  const normalized =
    apiKey.toLowerCase();

  const isPlaceholder =
    normalized === "dummy" ||
    normalized === "sk-dummy" ||
    normalized === "test" ||
    normalized === "sk-test" ||
    normalized.includes(
      "placeholder",
    ) ||
    normalized.includes(
      "your-openai",
    );

  if (isPlaceholder) {
    return null;
  }

  const baseURL =
    process.env
      .OPENAI_BASE_URL
      ?.trim();

  return new OpenAI({
    apiKey,
    baseURL:
      baseURL || undefined,
  });
}

export async function getRelevantCVSections({
  supabaseAdmin,
  cvId,
  jobDescription,
  topK = 5,
}: {
  supabaseAdmin: any;
  cvId: string;
  jobDescription: string;
  topK?: number;
}): Promise<string> {
  try {
    const ai =
      getConfiguredOpenAI();

    if (!ai) {
      return "";
    }

    const normalizedJobDescription =
      jobDescription
        .trim();

    if (!normalizedJobDescription) {
      return "";
    }

    const embeddingResponse =
      await ai.embeddings.create({
        model:
          "text-embedding-3-small",

        input:
          normalizedJobDescription,
      });

    const jobEmbedding =
      embeddingResponse
        .data[0]
        ?.embedding;

    if (
      !jobEmbedding ||
      jobEmbedding.length === 0
    ) {
      return "";
    }

    const {
      data,
      error,
    } =
      await supabaseAdmin.rpc(
        "match_cv_sections",
        {
          query_embedding:
            jobEmbedding,

          match_cv_id:
            cvId,

          match_count:
            topK,
        },
      );

    if (
      error ||
      !Array.isArray(data) ||
      data.length === 0
    ) {
      return "";
    }

    const combined =
      data
        .map(
          (row: any) =>
            typeof row
              ?.section_text ===
              "string"
              ? row.section_text
                  .trim()
              : "",
        )
        .filter(Boolean)
        .join("\n\n");

    return combined;
  } catch (error) {
    logError(
      "RAG Error",
      error,
    );

    return "";
  }
}