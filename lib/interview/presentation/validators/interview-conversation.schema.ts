import { z } from "zod";
import type { InterviewInput } from "../../domain/contracts/interview.dto";

const textPartSchema = z.object({
  type: z.string(),
  text: z.string().optional(),
});

const uiMessageSchema = z.object({
  id: z.string().min(1),
  role: z.enum(["user", "assistant"]),
  parts: z.array(textPartSchema),
});

export const interviewChatRequestSchema = z.object({
  sessionId: z.string().min(1),
  messages: z.array(uiMessageSchema).min(1).max(51),
  contextOverrides: z.object({
    mode: z.enum(["behavioral", "technical", "case-study", "mixed"]).optional(),
    level: z.enum(["intern", "junior", "mid", "senior", "staff", "executive"]).optional(),
    language: z.enum(["fr", "en"]).optional(),
    personaId: z.enum(["recruiter", "hiring-manager", "executive"]).optional(),
    targetCompetencies: z.array(z.string().min(1)).max(20).optional(),
    questionLimit: z.number().int().min(1).max(20).optional(),
    responseMaxChars: z.number().int().min(1).max(10000).optional(),
  }).optional(),
});

export function parseInterviewChatInput(data: unknown): InterviewInput {
  const request = interviewChatRequestSchema.parse(data);
  const lastMessage = request.messages[request.messages.length - 1];

  if (!lastMessage) {
    throw new Error("A message is required");
  }

  const content = lastMessage.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text ?? "")
    .join("")
    .trim();

  return {
    sessionId: request.sessionId,
    message: content,
    history: request.messages.slice(0, -1).map((message) => ({
      id: message.id,
      role: message.role,
      content: message.parts
        .filter((part) => part.type === "text")
        .map((part) => part.text ?? "")
        .join(""),
      createdAtIso: new Date().toISOString(),
    })),
    contextOverrides: request.contextOverrides,
  };
}

