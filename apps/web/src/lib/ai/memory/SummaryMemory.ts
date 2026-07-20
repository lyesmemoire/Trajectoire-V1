/**
 * Summary Memory
 * Manages conversation summaries for memory optimization
 */

export interface Summary {
  text: string;
  createdAt: number;
  messageCount: number;
}

export class SummaryMemory {
  private summaries: Summary[] = [];
  private maxSummaries: number = 5;

  /**
   * Add a summary
   * @param text - Summary text
   * @param messageCount - Number of messages summarized
   */
  public addSummary(text: string, messageCount: number): void {
    this.summaries.push({
      text,
      createdAt: Date.now(),
      messageCount,
    });

    // Keep only the most recent summaries
    if (this.summaries.length > this.maxSummaries) {
      this.summaries = this.summaries.slice(-this.maxSummaries);
    }
  }

  /**
   * Get the latest summary
   * @returns Latest summary or undefined
   */
  public getLatestSummary(): Summary | undefined {
    return this.summaries[this.summaries.length - 1];
  }

  /**
   * Get all summaries
   * @returns All summaries
   */
  public getAllSummaries(): Summary[] {
    return [...this.summaries];
  }

  /**
   * Get combined summary text
   * @returns Combined summary of all summaries
   */
  public getCombinedSummary(): string {
    if (this.summaries.length === 0) {
      return "";
    }

    return this.summaries
      .map((s, i) => `Part ${i + 1}: ${s.text}`)
      .join("\n\n");
  }

  /**
   * Clear all summaries
   */
  public clear(): void {
    this.summaries = [];
  }

  /**
   * Get total message count across all summaries
   * @returns Total message count
   */
  public getTotalMessageCount(): number {
    return this.summaries.reduce((total, s) => total + s.messageCount, 0);
  }
}
