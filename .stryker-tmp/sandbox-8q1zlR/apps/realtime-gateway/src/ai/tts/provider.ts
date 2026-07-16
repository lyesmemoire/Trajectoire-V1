// @ts-nocheck
export interface TTSProvider {
  /**
   * Stream the given text as PCM16 audio.
   * @param text   The text to synthesize.
   * @param signal Optional AbortSignal to cancel the request.
   * @returns Async iterable yielding Uint8Array PCM16 chunks.
   */
  stream(text: string, signal?: AbortSignal): AsyncIterable<Uint8Array>;
}
