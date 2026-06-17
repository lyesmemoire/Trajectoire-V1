import { RestartVote } from "./types";

export class RestartCoordinator {
  private votes: Map<string, { term: number; timestamp: number }> = new Map();
  
  constructor(
    private totalNodes: number,
    private voteExpiryMs: number = 10000
  ) {}

  /**
   * Register a RestartVote from a peer.
   */
  public registerVote(vote: RestartVote): void {
    this.votes.set(vote.nodeId, {
      term: vote.term,
      timestamp: Date.now(),
    });
  }

  /**
   * Check if we have achieved a restart consensus.
   * Consensus means a majority of nodes have voted for the current term within the expiry window.
   */
  public hasConsensus(currentTerm: number): boolean {
    this.cleanupExpiredVotes();

    let validVotes = 0;
    for (const [nodeId, voteData] of Array.from(this.votes.entries())) {
      if (voteData.term === currentTerm) {
        validVotes++;
      }
    }

    const majority = Math.floor(this.totalNodes / 2) + 1;
    return validVotes >= majority;
  }

  /**
   * Remove votes that have expired.
   */
  private cleanupExpiredVotes(): void {
    const now = Date.now();
    for (const [nodeId, voteData] of Array.from(this.votes.entries())) {
      if (now - voteData.timestamp > this.voteExpiryMs) {
        this.votes.delete(nodeId);
      }
    }
  }

  /**
   * Clear all votes (e.g. after a successful restart or term change).
   */
  public clear(): void {
    this.votes.clear();
  }
}
