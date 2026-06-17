// src/watchdog/federation/TermManager.ts

import * as fs from "fs";
import * as path from "path";

/**
 * TermManager maintains the cluster‑wide Raft‑like term.
 *
 * - `currentTerm` is the term this node currently believes is the cluster term.
 * - `maxSeenTerm` tracks the highest term observed from any peer.
 * - Only the elected leader may call `startNewElection` which increments the term.
 * - Followers can only update their view via `syncTerm` or `observeTerm`.
 * - No wall‑clock timestamps are used; term progression is driven solely by messages.
 * - Term is persisted to `term.json` for crash safety.
 */
export class TermManager {
  private currentTerm: number = 0;
  private maxSeenTerm: number = 0;

  private readonly termFile: string = path.resolve(process.cwd(), "term.json");

  constructor() {
    this.load();
  }

  /** Return the term this node currently believes is valid. */
  public getTerm(): number {
    return this.currentTerm;
  }

  /** Record a term seen from a peer. Updates the maxSeenTerm. */
  public observeTerm(term: number): void {
    if (term > this.maxSeenTerm) {
      this.maxSeenTerm = term;
    }
  }

  /**
   * Called by the leader after winning an election.
   * Advances the term to `maxSeenTerm + 1` and returns the new term.
   */
  public startNewElection(): number {
    this.currentTerm = this.maxSeenTerm + 1;
    this.maxSeenTerm = this.currentTerm;
    this.save();
    return this.currentTerm;
  }

  /** Synchronise this node's term with a term received from the cluster. */
  public syncTerm(term: number): void {
    if (term > this.currentTerm) {
      this.currentTerm = term;
    }
    if (term > this.maxSeenTerm) {
      this.maxSeenTerm = term;
    }
    this.save();
  }

  /** Load persisted term if present. */
  private load(): void {
    try {
      if (fs.existsSync(this.termFile)) {
        const data = JSON.parse(fs.readFileSync(this.termFile, "utf8"));
        this.currentTerm = data.term ?? 0;
        this.maxSeenTerm = this.currentTerm;
      }
    } catch (_) {
      // ignore errors – start fresh
    }
  }

  /** Persist current term to disk. */
  private save(): void {
    try {
      fs.writeFileSync(
        this.termFile,
        JSON.stringify({ term: this.currentTerm, lastUpdated: Date.now() })
      );
    } catch (_) {
      // ignore write errors – best‑effort persistence
    }
  }
}
