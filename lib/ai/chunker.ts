/**
 * Splits text into logical chunks using double newlines as primary separators.
 * Tries to maintain a max length of 800-1000 characters per chunk.
 * Removes chunks that are too short (less than 50 chars).
 */
export function chunkText(
  text: string,
  maxLength = 1000,
  minLength = 50,
): string[] {
  if (!text) return [];

  // Split by double newline (or more) to get natural paragraph breaks
  const paragraphs = text.split(/\n{2,}/);
  const chunks: string[] = [];
  let currentChunk = "";

  for (const para of paragraphs) {
    const cleanedPara = para.trim();
    if (!cleanedPara) continue;

    // If adding this paragraph exceeds maxLength, push current chunk and start new one
    if (
      currentChunk.length + cleanedPara.length + 2 > maxLength &&
      currentChunk.length >= minLength
    ) {
      chunks.push(currentChunk);
      currentChunk = cleanedPara;
    } else {
      // Append to current chunk
      currentChunk += (currentChunk ? "\n\n" : "") + cleanedPara;
    }
  }

  // Push the last chunk if it meets minimum length criteria
  if (currentChunk.length >= minLength) {
    chunks.push(currentChunk);
  }

  return chunks;
}
