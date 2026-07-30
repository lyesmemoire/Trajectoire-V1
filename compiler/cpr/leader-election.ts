/**
 * Blueprint DSL CPR Leader Election
 * 
 * Implements leader election algorithm.
 */

import { ClusterManager, NodeStatus } from './cluster-manager';

export interface ElectionState {
  currentLeader: string | null;
  term: number;
  votedFor: string | null;
  votes: Map<string, string>;
}

export interface ElectionResult {
  leader: string | null;
  term: number;
  success: boolean;
}

export class LeaderElection {
  private clusterManager: ClusterManager;
  private currentNodeId: string;
  private state: ElectionState;
  private electionTimeout: number;
  private electionTimer: NodeJS.Timeout | null = null;

  constructor(clusterManager: ClusterManager, currentNodeId: string, electionTimeout: number = 5000) {
    this.clusterManager = clusterManager;
    this.currentNodeId = currentNodeId;
    this.electionTimeout = electionTimeout;

    this.state = {
      currentLeader: null,
      term: 0,
      votedFor: null,
      votes: new Map(),
    };
  }

  /**
   * Start election
   */
  public startElection(): void {
    this.state.term++;
    this.state.votedFor = this.currentNodeId;
    this.state.votes = new Map();
    this.state.votes.set(this.currentNodeId, this.currentNodeId);

    this.requestVotes();
    this.resetElectionTimer();
  }

  /**
   * Request votes from other nodes
   */
  private requestVotes(): void {
    const nodes = this.clusterManager.getNodesByStatus(NodeStatus.ACTIVE);

    for (const node of nodes) {
      if (node.id !== this.currentNodeId) {
        this.sendVoteRequest(node.id);
      }
    }
  }

  /**
   * Send vote request to node
   */
  private sendVoteRequest(nodeId: string): void {
    // In a real implementation, this would send a message over the network
    console.log(`Sending vote request to ${nodeId}`);
  }

  /**
   * Handle vote request
   */
  public handleVoteRequest(candidateId: string, term: number): string {
    if (term < this.state.term) {
      return this.state.currentLeader || '';
    }

    if (this.state.votedFor === null) {
      this.state.votedFor = candidateId;
      this.state.votes.set(candidateId, this.currentNodeId);
      this.resetElectionTimer();
      return this.currentNodeId;
    }

    return '';
  }

  /**
   * Handle vote
   */
  public handleVote(voterId: string, term: number): void {
    if (term !== this.state.term) {
      return;
    }

    this.state.votes.set(voterId, voterId);

    const nodes = this.clusterManager.getNodesByStatus(NodeStatus.ACTIVE);
    const majority = Math.floor(nodes.length / 2) + 1;

    if (this.state.votes.size >= majority) {
      this.becomeLeader();
    }
  }

  /**
   * Become leader
   */
  private becomeLeader(): void {
    this.state.currentLeader = this.currentNodeId;

    if (this.electionTimer) {
      clearTimeout(this.electionTimer);
      this.electionTimer = null;
    }

    this.announceLeadership();
  }

  /**
   * Announce leadership
   */
  private announceLeadership(): void {
    const nodes = this.clusterManager.getNodesByStatus(NodeStatus.ACTIVE);

    for (const node of nodes) {
      if (node.id !== this.currentNodeId) {
        this.sendLeadershipAnnouncement(node.id);
      }
    }
  }

  /**
   * Send leadership announcement
   */
  private sendLeadershipAnnouncement(nodeId: string): void {
    // In a real implementation, this would send a message over the network
    console.log(`Sending leadership announcement to ${nodeId}`);
  }

  /**
   * Handle leadership announcement
   */
  public handleLeadershipAnnouncement(leaderId: string, term: number): void {
    if (term >= this.state.term) {
      this.state.term = term;
      this.state.currentLeader = leaderId;
      this.state.votedFor = null;
      this.state.votes.clear();

      if (this.electionTimer) {
        clearTimeout(this.electionTimer);
        this.electionTimer = null;
      }
    }
  }

  /**
   * Reset election timer
   */
  private resetElectionTimer(): void {
    if (this.electionTimer) {
      clearTimeout(this.electionTimer);
    }

    this.electionTimer = setTimeout(() => {
      this.startElection();
    }, this.electionTimeout + Math.random() * this.electionTimeout);
  }

  /**
   * Stop election
   */
  public stop(): void {
    if (this.electionTimer) {
      clearTimeout(this.electionTimer);
      this.electionTimer = null;
    }
  }

  /**
   * Get current leader
   */
  public getCurrentLeader(): string | null {
    return this.state.currentLeader;
  }

  /**
   * Get current term
   */
  public getCurrentTerm(): number {
    return this.state.term;
  }

  /**
   * Get election state
   */
  public getState(): ElectionState {
    return {
      currentLeader: this.state.currentLeader,
      term: this.state.term,
      votedFor: this.state.votedFor,
      votes: new Map(this.state.votes),
    };
  }

  /**
   * Check if current node is leader
   */
  public isLeader(): boolean {
    return this.state.currentLeader === this.currentNodeId;
  }

  /**
   * Validate election state
   */
  public validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (this.state.term < 0) {
      errors.push('Invalid term');
    }

    if (this.state.currentLeader && !this.clusterManager.getNode(this.state.currentLeader)) {
      errors.push('Leader node does not exist');
    }

    if (this.state.votedFor && !this.clusterManager.getNode(this.state.votedFor)) {
      errors.push('Voted for node does not exist');
    }

    for (const [voter, candidate] of this.state.votes) {
      if (!this.clusterManager.getNode(voter)) {
        errors.push(`Voter ${voter} does not exist`);
      }

      if (!this.clusterManager.getNode(candidate)) {
        errors.push(`Candidate ${candidate} does not exist`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get statistics
   */
  public getStatistics(): {
    term: number;
    leader: string | null;
    votedFor: string | null;
    voteCount: number;
    isLeader: boolean;
  } {
    return {
      term: this.state.term,
      leader: this.state.currentLeader,
      votedFor: this.state.votedFor,
      voteCount: this.state.votes.size,
      isLeader: this.isLeader(),
    };
  }

  /**
   * Set cluster manager
   */
  public setClusterManager(clusterManager: ClusterManager): void {
    this.clusterManager = clusterManager;
  }
}
