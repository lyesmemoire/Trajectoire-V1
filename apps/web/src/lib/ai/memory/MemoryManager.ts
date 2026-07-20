/**
 * Memory Manager
 * Intelligent conversation memory with summarization and sliding window
 */

import { ConversationMemory } from "./ConversationMemory";
import { SummaryMemory } from "./SummaryMemory";
import AIClient from "../client";
import { AI_MODELS } from "../models";

export interface MemoryConfig {
  windowSize: number;
  summaryThreshold: number;
  maxSummaries: number;
}

export interface MemoryState {
  summary?: string;
  recentMessages: Array<{ role: string; content: string }>;
  totalMessageCount: number;
}

const DEFAULT_MEMORY_CONFIG: MemoryConfig = {
  windowSize: 10,
  summaryThreshold: 15,
  maxSummaries: 5,
};

export class MemoryManager {
  private conversationMemory: ConversationMemory;
  private summaryMemory: SummaryMemory;
  private config: MemoryConfig;

  constructor(config?: Partial<MemoryConfig>) {
    this.config = { ...DEFAULT_MEMORY_CONFIG, ...config };
    this.conversationMemory = new ConversationMemory(
      this.config.windowSize,
      this.config.summaryThreshold
    );
    this.summaryMemory = new SummaryMemory();
  }

  /**
   * Add a message to memory
   * @param role - Message role
   * @param content - Message content
   */
  public addMessage(role: "user" | "assistant", content: string): void {
    this.conversationMemory.addMessage(role, content);
  }

  /**
   * Get memory state
   * @returns Memory state
   */
  public getState(): MemoryState {
    const convState = this.conversationMemory.getState();
    const latestSummary = this.summaryMemory.getLatestSummary();

    return {
      summary: latestSummary?.text,
      recentMessages: convState.recentMessages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      totalMessageCount: convState.totalMessageCount,
    };
  }

  /**
   * Get formatted conversation for AI
   * @returns Formatted conversation string
   */
  public getFormattedConversation(): string {
    return this.conversationMemory.getFormattedConversation();
  }

  /**
   * Generate summary using AI
   * @param messages - Messages to summarize
   * @returns Summary
   */
  public async generateSummary(messages: Array<{ role: string; content: string }>): Promise<string> {
    const client = AIClient.getInstance();

    const conversation = messages
      .map((msg) => `${msg.role === "assistant" ? "Interviewer" : "Candidate"}: ${msg.content}`)
      .join("\n\n");

    try {
      const response = await client.chatCompletion({
        model: AI_MODELS.SUMMARY,
        messages: [
          {
            role: "system",
            content: "Summarize this interview conversation in 2-3 sentences, focusing on key topics discussed and the candidate's main responses.",
          },
          { role: "user", content: conversation },
        ],
        temperature: 0.3,
      });

      const summary = response.content;
      this.summaryMemory.addSummary(summary, messages.length);
      this.conversationMemory.setSummary(summary);

      return summary;
    } catch {
      // Fallback to simple summary if AI fails
      const fallbackSummary = `Conversation with ${messages.length} messages covering interview topics and candidate responses.`;
      this.summaryMemory.addSummary(fallbackSummary, messages.length);
      this.conversationMemory.setSummary(fallbackSummary);
      return fallbackSummary;
    }
  }

  /**
   * Compress conversation (summarize early messages)
   * @returns Summary if generated
   */
  public async compress(): Promise<string | undefined> {
    const state = this.conversationMemory.getState();

    if (state.totalMessageCount >= this.config.summaryThreshold) {
      const messagesToSummarize = state.recentMessages.slice(0, -this.config.windowSize);
      if (messagesToSummarize.length > 0) {
        return await this.generateSummary(messagesToSummarize);
      }
    }

    return undefined;
  }

  /**
   * Clear all memory
   */
  public clear(): void {
    this.conversationMemory.clear();
    this.summaryMemory.clear();
  }

  /**
   * Get total message count
   * @returns Total message count
   */
  public getTotalMessageCount(): number {
    return this.conversationMemory.getTotalMessageCount();
  }

  /**
   * Get all summaries
   * @returns All summaries
   */
  public getAllSummaries(): string {
    return this.summaryMemory.getCombinedSummary();
  }
}
