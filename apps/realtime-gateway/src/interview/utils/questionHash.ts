// apps/realtime-gateway/src/interview/utils/questionHash.ts

import * as crypto from "crypto";

/**
 * Generate a deterministic SHA‑256 hash for a question.
 * The input is first normalized (trim, lower‑case, collapse whitespace)
 * and then concatenated with the topic, difficulty and type.
 */
export function generateQuestionHash(params: {
  question: string;
  topic: string;
  difficulty: string;
  type: string;
}): string {
  const normalized = params.question.trim().toLowerCase().replace(/\s+/g, " ");
  const data = `${normalized}|${params.topic}|${params.difficulty}|${params.type}`;
  return crypto.createHash("sha256").update(data).digest("hex");
}
