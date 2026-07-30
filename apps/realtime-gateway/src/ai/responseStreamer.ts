export const MAX_BUFFER_LENGTH = 300;

/**
 * Buffer incoming text chunks and emit when a sentence boundary is reached.
 * Uses a regex that matches after a period, exclamation mark, question mark or newline.
 * Also ensures the buffer never exceeds MAX_BUFFER_LENGTH to avoid memory bloat.
 */
export function bufferChunk(chunk: string, buffer: string, send: (data: string) => void,
): string {
  let newBuffer = buffer + chunk;
  // Split on sentence boundaries while keeping the delimiter.
  const parts = newBuffer.split(/(?<=[.!?])\s+/);
  // If we have more than one part, we can emit all but the last (which may be incomplete).
  if (parts.length > 1) {
    const toEmit = parts.slice(0, -1).join(" ");
    send(toEmit);
    newBuffer = parts[parts.length - 1] ?? "";
  }
  // Trim buffer if it grows too large without a boundary.
  if (newBuffer.length > MAX_BUFFER_LENGTH) {
    // Emit the first MAX_BUFFER_LENGTH characters and keep the rest.
    send(newBuffer.slice(0, MAX_BUFFER_LENGTH));
    newBuffer = newBuffer.slice(MAX_BUFFER_LENGTH);
  }
  return newBuffer;
}
