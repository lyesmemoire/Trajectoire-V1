/**
 * Splits text into logical chunks using double newlines as primary separators.
 * Tries to maintain a max length of 800-1000 characters per chunk.
 * Removes chunks that are too short (less than 50 chars).
 */
export declare function chunkText(text: string, maxLength?: number, minLength?: number): string[];
//# sourceMappingURL=chunker.d.ts.map