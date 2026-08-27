import { OpenAI } from "openai";
import type { ChatCompletionMessageParam, ChatCompletion } from "openai/resources/chat/completions";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

/**
 * Stream a chat completion using the OpenAI SDK.
 * @param messages   Chat messages (system/user/assistant) to send.
 * @param onChunk    Callback invoked for each content chunk.
 * @param onDone     Callback invoked when the stream finishes.
 * @param signal?    Optional AbortSignal to cancel the request.
 */
export async function streamChat(messages: ChatCompletionMessageParam[], onChunk: (chunk: string) => void,
  onDone: () => void,
  signal?: AbortSignal,
): Promise<void> {
  const startTime = Date.now();
  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
    stream: true,
    // The SDK forwards the AbortSignal directly.
    ...(signal && { signal }),
  });

  // First token timing – we could expose it later via a callback.
  let firstTokenSent = false;

  for await (const part of completion) {
    const delta = part.choices[0]?.delta?.content;
    if (delta) {
      if (!firstTokenSent) {
        // You could send the latency (Date.now() - startTime) to a monitor here.
        firstTokenSent = true;
      }
      onChunk(delta);
    }
  }
  onDone();
}

/**
 * Get a JSON chat completion using the OpenAI SDK.
 * Used for structured outputs with JSON mode.
 * @param messages   Chat messages (system/user/assistant) to send.
 * @param signal?    Optional AbortSignal to cancel the request.
 */
export async function getJsonCompletion(
  messages: ChatCompletionMessageParam[],
  signal?: AbortSignal,
): Promise<ChatCompletion> {
  return await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
    temperature: 0,
    response_format: { type: "json_object" },
    ...(signal && { signal }),
  });
}
