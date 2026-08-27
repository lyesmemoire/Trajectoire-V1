import { z } from "zod";

const WebSocketMessageSchema = z
  .object({
    type: z.string(),
    text: z.string().optional(),
  })
  .passthrough();

export interface VoiceV3TextMessageDeps {
  nodeEnv: string | undefined;
  sessionId: string;
  userId?: string;
  sttCallbacks?: {
    onFinalTranscript: (text: string) => void;
  };
  send: (payload: Record<string, unknown>) => void;
  warn: (payload: Record<string, unknown>) => void;
}

export function handleVoiceV3TextMessage(
  data: string,
  deps: VoiceV3TextMessageDeps,
): boolean {
  let message: unknown;

  try {
    message = JSON.parse(data);
  } catch {
    return false;
  }

  const parsed = WebSocketMessageSchema.safeParse(message);

  if (!parsed.success) {
    return false;
  }

  if (parsed.data.type === "end_speech") {
    return true;
  }

  if (parsed.data.type !== "mock_transcript") {
    return false;
  }

  if (deps.nodeEnv === "production") {
    deps.warn({
      event: "mock_transcript_rejected",
      sessionId: deps.sessionId,
      userId: deps.userId,
    });

    deps.send({
      type: "error",
      message: "Unsupported message type.",
    });

    return true;
  }

  if (
    deps.sttCallbacks &&
    typeof parsed.data.text === "string"
  ) {
    deps.sttCallbacks.onFinalTranscript(parsed.data.text);
  }

  return true;
}
