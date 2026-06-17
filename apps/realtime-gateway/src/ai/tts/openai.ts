import { TTSProvider } from "./provider";

/**
 * OpenAI TTS streaming implementation.
 * Uses the OpenAI Audio Speech endpoint with streaming PCM16 output.
 */
export class OpenAITTS implements TTSProvider {
  async *stream(text: string, signal?: AbortSignal): AsyncIterable<Uint8Array> {
    const response = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini-tts",
        voice: "alloy",
        input: text,
        response_format: "pcm",
      }),
      ...(signal && { signal }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`OpenAI TTS request failed: ${response.status} ${err}`);
    }

    const reader = response.body?.getReader();
    if (!reader) return;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) yield value;
    }
  }
}
