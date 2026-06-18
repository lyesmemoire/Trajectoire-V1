export interface VoiceMetrics {
  sessionId: string;
  sttStart?: number;
  sttEnd?: number;
  llmStart?: number;
  llmEnd?: number;
  ttsStart?: number;
  ttsEnd?: number;
}

export const pilotCommandsCount = {
  repeat: 0,
  slower: 0,
  clarify: 0,
  next: 0,
  stop: 0,
};

export function now(): number {
  return Date.now();
}

export function logMetrics(m: VoiceMetrics) {
  const sttMs = m.sttEnd && m.sttStart ? m.sttEnd - m.sttStart : undefined;
  const llmMs = m.llmEnd && m.llmStart ? m.llmEnd - m.llmStart : undefined;
  const ttsMs = m.ttsEnd && m.ttsStart ? m.ttsEnd - m.ttsStart : undefined;

  const totalMs =
    m.sttStart && m.ttsEnd ? m.ttsEnd - m.sttStart : undefined;

  console.log(
    JSON.stringify({
      event: "voice_pipeline_metrics",
      sessionId: m.sessionId,
      sttMs,
      llmMs,
      ttsMs,
      totalMs,
    }),
  );
}
