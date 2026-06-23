import { TermManager } from "./TermManager";
import { RequestVote, VoteResponse } from "./types";

export class LeaderElection {
  private votedFor: Map<number, string> = new Map();
  private votesReceived: Set<string> = new Set();
  private isLeader: boolean = false;

  constructor(private termManager: TermManager, private nodeId: string) {}

  /**
   * Process a vote request from a peer.
   * Returns a VoteResponse.
   */
  public requestVote(req: RequestVote): VoteResponse {
    const currentTerm = this.termManager.getTerm();
    
    // term conflict resolution (reject older terms)
    if (req.term < currentTerm) {
      return { type: "VoteResponse", nodeId: this.nodeId, term: currentTerm, granted: false };
    }

    if (req.term > currentTerm) {
      this.termManager.syncTerm(req.term);
      this.demote(); // Step down if we see a higher term
    }

    // If we haven't voted in this term, grant vote and record.
    if (!this.votedFor.has(req.term)) {
      this.votedFor.set(req.term, req.nodeId);
      return { type: "VoteResponse", nodeId: this.nodeId, term: req.term, granted: true };
    }

    // Already voted – allow only if voting for the same candidate.
    const granted = this.votedFor.get(req.term) === req.nodeId;
    return { type: "VoteResponse", nodeId: this.nodeId, term: req.term, granted };
  }

  /**
   * Handle incoming VoteResponse.
   * Checks for majority and promotes to leader if met.
   */
  public handleVoteResponse(res: VoteResponse, totalNodes: number): boolean {
    if (this.isLeader) return false; // already leader
    
    const currentTerm = this.termManager.getTerm();
    if (res.term > currentTerm) {
      this.termManager.syncTerm(res.term);
      this.demote();
      return false;
    }
    
    if (res.term === currentTerm && res.granted) {
      this.votesReceived.add(res.nodeId);
      
      // majority calculation
      const majority = Math.floor(totalNodes / 2) + 1;
      if (this.votesReceived.size >= majority) {
        this.promote();
        return true; // just became leader
      }
    }
    return false;
  }

  /**
   * Start a new election process for this node.
   */
  public startElection(): RequestVote {
    const newTerm = this.termManager.startNewElection();
    this.votedFor.set(newTerm, this.nodeId);
    this.votesReceived.clear();
    this.votesReceived.add(this.nodeId); // vote for self
    this.isLeader = false;
    
    return { type: "RequestVote", nodeId: this.nodeId, term: newTerm };
  }

  public promote() {
    console.info(`[LeaderElection] Node ${this.nodeId} promoted to LEADER for term ${this.termManager.getTerm()}`);
    this.isLeader = true;
  }

  public demote() {
    console.info(`[LeaderElection] Node ${this.nodeId} demoted from LEADER`);
    this.isLeader = false;
  }

  public getVotesReceivedCount(): number {
    return this.votesReceived.size;
  }



  public getIsLeader(): boolean {
    return this.isLeader;
  }
}



