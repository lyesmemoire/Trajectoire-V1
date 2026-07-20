/**
 * AI Request Optimizer
 * Optimizes AI requests to reduce OpenAI costs by:
 * - Removing unnecessary whitespace
 * - Compacting prompts
 * - Removing unnecessary messages
 * - Intelligently truncating conversation history
 * - Summarizing old conversations
 */

export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface OptimizedRequest {
  messages: Message[];
  tokenCount: number;
  originalTokenCount: number;
  savings: number; // percentage
}

export interface OptimizationOptions {
  maxMessages?: number;
  maxTokens?: number;
  summarizeOldMessages?: boolean;
  removeWhitespace?: boolean;
  removeDuplicates?: boolean;
}

/**
 * Estimate token count (rough approximation: 1 token ≈ 4 characters)
 */
function estimateTokenCount(text: string): number {
  return Math.ceil(text.length / 4);
}

/**
 * Estimate token count for messages
 */
function estimateMessagesTokenCount(messages: Message[]): number {
  return messages.reduce((total, msg) => {
    return total + estimateTokenCount(msg.content) + 10; // +10 for role/metadata
  }, 0);
}

/**
 * Remove unnecessary whitespace from text
 */
function cleanWhitespace(text: string): string {
  return text
    .replace(/\s+/g, " ") // Replace multiple spaces with single space
    .replace(/\n\s*\n/g, "\n") // Remove empty lines
    .trim();
}

/**
 * Remove duplicate consecutive messages
 */
function removeDuplicateMessages(messages: Message[]): Message[] {
  const filtered: Message[] = [];
  
  for (const msg of messages) {
    // Skip if same role and content as previous message
    const prev = filtered[filtered.length - 1];
    if (prev && prev.role === msg.role && prev.content === msg.content) {
      continue;
    }
    filtered.push(msg);
  }
  
  return filtered;
}

/**
 * Truncate conversation history to last N messages
 */
function truncateMessages(messages: Message[], maxMessages: number): Message[] {
  // Keep system messages
  const systemMessages = messages.filter(m => m.role === "system");
  const otherMessages = messages.filter(m => m.role !== "system");
  
  // Keep last N non-system messages
  const truncatedOther = otherMessages.slice(-maxMessages);
  
  return [...systemMessages, ...truncatedOther];
}

/**
 * Summarize old messages (placeholder - would need AI integration)
 * For now, just keeps the last N messages
 */
function summarizeOldMessages(messages: Message[], maxMessages: number): Message[] {
  // In a real implementation, this would use AI to summarize old messages
  // For now, we just truncate
  return truncateMessages(messages, maxMessages);
}

/**
 * Optimize AI request
 */
export function optimizeAIRequest(
  messages: Message[],
  options: OptimizationOptions = {}
): OptimizedRequest {
  const {
    maxMessages = 20,
    maxTokens = 4000,
    summarizeOldMessages: shouldSummarize = true,
    removeWhitespace = true,
    removeDuplicates = true,
  } = options;

  let optimizedMessages = [...messages];
  const originalTokenCount = estimateMessagesTokenCount(optimizedMessages);

  // Remove duplicates
  if (removeDuplicates) {
    optimizedMessages = removeDuplicateMessages(optimizedMessages);
  }

  // Remove whitespace
  if (removeWhitespace) {
    optimizedMessages = optimizedMessages.map(msg => ({
      ...msg,
      content: cleanWhitespace(msg.content),
    }));
  }

  // Truncate or summarize old messages
  if (shouldSummarize && optimizedMessages.length > maxMessages) {
    optimizedMessages = summarizeOldMessages(optimizedMessages, maxMessages);
  } else if (optimizedMessages.length > maxMessages) {
    optimizedMessages = truncateMessages(optimizedMessages, maxMessages);
  }

  // Check token count and truncate if necessary
  const optimizedTokenCount = estimateMessagesTokenCount(optimizedMessages);
  if (optimizedTokenCount > maxTokens) {
    // Truncate from the beginning (keep recent messages)
    let currentCount = optimizedTokenCount;
    while (currentCount > maxTokens && optimizedMessages.length > 1) {
      optimizedMessages.shift(); // Remove oldest message
      currentCount = estimateMessagesTokenCount(optimizedMessages);
    }
  }

  const finalTokenCount = estimateMessagesTokenCount(optimizedMessages);
  const savings = originalTokenCount > 0 
    ? ((originalTokenCount - finalTokenCount) / originalTokenCount) * 100 
    : 0;

  return {
    messages: optimizedMessages,
    tokenCount: finalTokenCount,
    originalTokenCount,
    savings: Math.max(0, savings),
  };
}

/**
 * Compact a single prompt by removing unnecessary elements
 */
export function compactPrompt(prompt: string): string {
  return cleanWhitespace(prompt);
}

/**
 * Truncate prompt to max tokens
 */
export function truncatePrompt(prompt: string, maxTokens: number): string {
  const estimatedTokens = estimateTokenCount(prompt);
  if (estimatedTokens <= maxTokens) {
    return prompt;
  }

  // Truncate to max tokens (rough approximation)
  const maxLength = maxTokens * 4;
  return prompt.substring(0, maxLength);
}

/**
 * Get optimization statistics
 */
export function getOptimizationStats(original: Message[], optimized: Message[]): {
  messageCount: { original: number; optimized: number };
  tokenCount: { original: number; optimized: number };
  savings: { messages: number; tokens: number };
} {
  const originalMessages = original.length;
  const optimizedMessages = optimized.length;
  const originalTokens = estimateMessagesTokenCount(original);
  const optimizedTokens = estimateMessagesTokenCount(optimized);

  return {
    messageCount: {
      original: originalMessages,
      optimized: optimizedMessages,
    },
    tokenCount: {
      original: originalTokens,
      optimized: optimizedTokens,
    },
    savings: {
      messages: originalMessages > 0 
        ? ((originalMessages - optimizedMessages) / originalMessages) * 100 
        : 0,
      tokens: originalTokens > 0 
        ? ((originalTokens - optimizedTokens) / originalTokens) * 100 
        : 0,
    },
  };
}
