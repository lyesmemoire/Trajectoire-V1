/**
 * Blueprint DSL CPR Consensus Engine
 * 
 * Implements distributed consensus algorithms.
 */

import { ClusterManager, NodeStatus } from './cluster-manager';

export interface ConsensusState {
  term: number;
  leader: string | null;
  votedFor: string | null;
  votes: Set<string>;
  log: ConsensusEntry[];
  commitIndex: number;
  lastApplied: number;
}

export interface ConsensusEntry {
  index: number;
  term: number;
  command: unknown;
  committed: boolean;
}

export enum ConsensusRole {
  FOLLOWER = 'FOLLOWER',
  CANDIDATE = 'CANDIDATE',
  LEADER = 'LEADER',
}

export interface ConsensusMessage {
  type: MessageType;
  term: number;
  from: string;
  to: string;
  data?: unknown;
}

export enum MessageType {
  REQUEST_VOTE = 'REQUEST_VOTE',
  VOTE = 'VOTE',
  APPEND_ENTRIES = 'APPEND_ENTRIES',
  APPEND_RESPONSE = 'APPEND_RESPONSE',
  HEARTBEAT = 'HEARTBEAT',
}

export class ConsensusEngine {
  private clusterManager: ClusterManager;
  private currentNodeId: string;
  private state: ConsensusState;
  private role: ConsensusRole = ConsensusRole.FOLLOWER;
  private electionTimeout: number;
  private heartbeatInterval: number;
  private electionTimer: NodeJS.Timeout | null = null;
  private heartbeatTimer: NodeJS.Timeout | null = null;

  constructor(clusterManager: ClusterManager, currentNodeId: string, options: { electionTimeout?: number; heartbeatInterval?: number } = {}) {
    this.clusterManager = clusterManager;
    this.currentNodeId = currentNodeId;
    this.electionTimeout = options.electionTimeout || 5000;
    this.heartbeatInterval = options.heartbeatInterval || 1000;

    this.state = {
      term: 0,
      leader: null,
      votedFor: null,
      votes: new Set(),
      log: [],
      commitIndex: 0,
      lastApplied: 0,
    };
  }

  /**
   * Start consensus engine
   */
  public start(): void {
    this.resetElectionTimer();
  }

  /**
   * Stop consensus engine
   */
  public stop(): void {
    if (this.electionTimer) {
      clearTimeout(this.electionTimer);
      this.electionTimer = null;
    }

    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
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
   * Start election
   */
  private startElection(): void {
    this.role = ConsensusRole.CANDIDATE;
    this.state.term++;
    this.state.votedFor = this.currentNodeId;
    this.state.votes = new Set([this.currentNodeId]);

    // Request votes from other nodes
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
        this.sendMessage({
          type: MessageType.REQUEST_VOTE,
          term: this.state.term,
          from: this.currentNodeId,
          to: node.id,
          data: {
            lastLogIndex: this.state.log.length - 1,
            lastLogTerm: this.state.log.length > 0 ? this.state.log[this.state.log.length - 1].term : 0,
          },
        });
      }
    }
  }

  /**
   * Handle consensus message
   */
  public handleMessage(message: ConsensusMessage): void {
    if (message.term > this.state.term) {
      this.state.term = message.term;
      this.role = ConsensusRole.FOLLOWER;
      this.state.votedFor = null;
      this.state.leader = message.from;
      this.resetElectionTimer();
    }

    switch (message.type) {
      case MessageType.REQUEST_VOTE:
        this.handleRequestVote(message);
        break;

      case MessageType.VOTE:
        this.handleVote(message);
        break;

      case MessageType.APPEND_ENTRIES:
      case MessageType.HEARTBEAT:
        this.handleAppendEntries(message);
        break;

      case MessageType.APPEND_RESPONSE:
        this.handleAppendResponse(message);
        break;
    }
  }

  /**
   * Handle request vote
   */
  private handleRequestVote(message: ConsensusMessage): void {
    const voteGranted = this.state.votedFor === null || this.state.votedFor === message.from;

    this.sendMessage({
      type: MessageType.VOTE,
      term: this.state.term,
      from: this.currentNodeId,
      to: message.from,
      data: { voteGranted },
    });

    if (voteGranted) {
      this.state.votedFor = message.from;
      this.resetElectionTimer();
    }
  }

  /**
   * Handle vote
   */
  private handleVote(message: ConsensusMessage): void {
    if (this.role !== ConsensusRole.CANDIDATE || message.term !== this.state.term) {
      return;
    }

    if (message.data?.voteGranted) {
      this.state.votes.add(message.from);

      const nodes = this.clusterManager.getNodesByStatus(NodeStatus.ACTIVE);
      const majority = Math.floor(nodes.length / 2) + 1;

      if (this.state.votes.size >= majority) {
        this.becomeLeader();
      }
    }
  }

  /**
   * Become leader
   */
  private becomeLeader(): void {
    this.role = ConsensusRole.LEADER;
    this.state.leader = this.currentNodeId;

    if (this.electionTimer) {
      clearTimeout(this.electionTimer);
      this.electionTimer = null;
    }

    this.startHeartbeat();
  }

  /**
   * Start heartbeat
   */
  private startHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
    }

    this.heartbeatTimer = setInterval(() => {
      this.sendHeartbeat();
    }, this.heartbeatInterval);
  }

  /**
   * Send heartbeat
   */
  private sendHeartbeat(): void {
    const nodes = this.clusterManager.getNodesByStatus(NodeStatus.ACTIVE);

    for (const node of nodes) {
      if (node.id !== this.currentNodeId) {
        this.sendMessage({
          type: MessageType.HEARTBEAT,
          term: this.state.term,
          from: this.currentNodeId,
          to: node.id,
          data: {
            commitIndex: this.state.commitIndex,
          },
        });
      }
    }
  }

  /**
   * Handle append entries
   */
  private handleAppendEntries(message: ConsensusMessage): void {
    this.state.leader = message.from;
    this.resetElectionTimer();

    // In a real implementation, this would append entries to the log
    this.sendMessage({
      type: MessageType.APPEND_RESPONSE,
      term: this.state.term,
      from: this.currentNodeId,
      to: message.from,
      data: { success: true },
    });
  }

  /**
   * Handle append response
   */
  private handleAppendResponse(message: ConsensusMessage): void {
    if (this.role !== ConsensusRole.LEADER) {
      return;
    }

    // In a real implementation, this would handle response and update commit index
  }

  /**
   * Propose command
   */
  public propose(command: unknown): void {
    if (this.role !== ConsensusRole.LEADER) {
      throw new Error('Not leader');
    }

    const entry: ConsensusEntry = {
      index: this.state.log.length,
      term: this.state.term,
      command,
      committed: false,
    };

    this.state.log.push(entry);
  }

  /**
   * Send message (simulated)
   */
  private sendMessage(message: ConsensusMessage): void {
    // In a real implementation, this would send the message over the network
    console.log(`Sending message: ${JSON.stringify(message)}`);
  }

  /**
   * Get consensus state
   */
  public getState(): ConsensusState {
    return {
      term: this.state.term,
      leader: this.state.leader,
      votedFor: this.state.votedFor,
      votes: new Set(this.state.votes),
      log: [...this.state.log],
      commitIndex: this.state.commitIndex,
      lastApplied: this.state.lastApplied,
    };
  }

  /**
   * Get current role
   */
  public getRole(): ConsensusRole {
    return this.role;
  }

  /**
   * Get current term
   */
  public getTerm(): number {
    return this.state.term;
  }

  /**
   * Get leader
   */
  public getLeader(): string | null {
    return this.state.leader;
  }

  /**
   * Validate consensus state
   */
  public validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (this.state.term < 0) {
      errors.push('Invalid term');
    }

    if (this.state.commitIndex < 0) {
      errors.push('Invalid commit index');
    }

    if (this.state.lastApplied < 0) {
      errors.push('Invalid last applied');
    }

    if (this.state.commitIndex > this.state.log.length) {
      errors.push('Commit index exceeds log length');
    }

    if (this.state.lastApplied > this.state.commitIndex) {
      errors.push('Last applied exceeds commit index');
    }

    for (let i = 0; i < this.state.log.length; i++) {
      const entry = this.state.log[i];
      if (entry.index !== i) {
        errors.push(`Log entry index mismatch at ${i}`);
      }

      if (entry.term < 0) {
        errors.push(`Invalid term in log entry ${i}`);
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
    role: ConsensusRole;
    leader: string | null;
    logLength: number;
    commitIndex: number;
    lastApplied: number;
  } {
    return {
      term: this.state.term,
      role: this.role,
      leader: this.state.leader,
      logLength: this.state.log.length,
      commitIndex: this.state.commitIndex,
      lastApplied: this.state.lastApplied,
    };
  }

  /**
   * Set cluster manager
   */
  public setClusterManager(clusterManager: ClusterManager): void {
    this.clusterManager = clusterManager;
  }
}
