/**
 * Conversation Memory
 * Manages conversation context with sliding window and summarization
 */

export interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface MemoryState {
  summary?: string;
  recentMessages: Message[];
  totalMessageCount: number;
}

export class ConversationMemory {
  private summary?: string;
  private messages: Message[] = [];
  private windowSize: number;
  private summaryThreshold: number;

  constructor(windowSize: number = 10, summaryThreshold: number = 15) {
    this.windowSize = windowSize;
    this.summaryThreshold = summaryThreshold;
  }

  /**
   * Add a message to memory
   * @param role - Message role
   * @param content - Message content
   */
  public addMessage(role: "user" | "assistant", content: string): void {
    this.messages.push({
      role,
      content,
      timestamp: Date.now(),
    });

    // Check if we need to summarize
    if (this.messages.length >= this.summaryThreshold) {
      this.summarizeEarlyMessages();
    }
  }

  /**
   * Get current memory state
   * @returns Memory state
   */
  public getState(): MemoryState {
    return {
      summary: this.summary,
      recentMessages: this.getRecentMessages(),
      totalMessageCount: this.messages.length,
    };
  }

  /**
   * Get recent messages (sliding window)
   * @returns Recent messages
   */
  public getRecentMessages(): Message[] {
    return this.messages.slice(-this.windowSize);
  }

  /**
   * Get formatted conversation for AI
   * @returns Formatted conversation string
   */
  public getFormattedConversation(): string {
    const parts: string[] = [];

    if (this.summary) {
      parts.push(`--- CONVERSATION SUMMARY ---\n${this.summary}`);
    }

    const recentMessages = this.getRecentMessages();
    if (recentMessages.length > 0) {
      parts.push(
        `--- RECENT MESSAGES ---\n${recentMessages
          .map((msg) => `${msg.role === "assistant" ? "Interviewer" : "Candidate"}: ${msg.content}`)
          .join("\n\n")}`
      );
    }

    return parts.join("\n\n");
  }

  /**
   * Summarize early messages (to be implemented with AI)
   * This is a placeholder - actual summarization will use AI
   */
  private summarizeEarlyMessages(): void {
    // In a real implementation, this would call an AI service
    // to summarize the first (total - windowSize) messages
    const messagesToSummarize = this.messages.slice(0, -this.windowSize);
    
    if (messagesToSummarize.length > 0) {
      // Placeholder summary - will be replaced with AI-generated summary
      this.summary = `Conversation started with ${messagesToSummarize.length} messages covering initial introductions and background information.`;
      
      // Keep only recent messages
      this.messages = this.messages.slice(-this.windowSize);
    }
  }

  /**
   * Set summary manually (for AI-generated summaries)
   * @param summary - Summary text
   */
  public setSummary(summary: string): void {
    this.summary = summary;
  }

  /**
   * Clear all memory
   */
  public clear(): void {
    this.summary = undefined;
    this.messages = [];
  }

  /**
   * Get total message count
   * @returns Total number of messages
   */
  public getTotalMessageCount(): number {
    return this.messages.length;
  }
}
