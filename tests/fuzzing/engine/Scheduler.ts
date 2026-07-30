import { CorpusEntry } from './CorpusManager';
import { FuzzResult } from './interfaces';

interface ScheduledEntry extends CorpusEntry {
  score: number;
  useCount: number;
  age: number;
}

export class Scheduler {
  private queue: ScheduledEntry[] = [];
  private totalRuns = 0;

  addEntry(entry: CorpusEntry, initialScore = 100) {
    this.queue.push({ ...entry, score: initialScore, useCount: 0, age: this.totalRuns });
  }

  next(): Uint8Array | null {
    if (this.queue.length === 0) return null;
    this.totalRuns++;
    
    // Sort by score (Coverage-Aware)
    // Score increases if it recently produced new coverage
    // Size penalty to prefer smaller inputs
    this.queue.sort((a, b) => {
      const scoreA = a.score - (a.size * 0.1) - (a.useCount * 0.5);
      const scoreB = b.score - (b.size * 0.1) - (b.useCount * 0.5);
      return scoreB - scoreA;
    });

    const selected = this.queue[0];
    selected.useCount++;
    return selected.data;
  }

  feedback(hash: string, result: FuzzResult, newCoverage: boolean) {
    const entry = this.queue.find(q => q.hash === hash);
    if (!entry) return;

    if (newCoverage) {
      entry.score += 50;
    } else {
      entry.score = Math.max(1, entry.score - 1);
    }
  }

  getQueueSize(): number {
    return this.queue.length;
  }
}
