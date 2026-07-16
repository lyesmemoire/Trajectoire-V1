// @ts-nocheck
export interface NodeHealth {
  nodeId: string;
  health: number;
  lastSeen: number;
  isLeader?: boolean;
  replayLag?: number;
  ledgerDrift?: number;
  eventLagMs?: number;
  weight?: number;
}

export type FederationMessageType = 
  | "Heartbeat" 
  | "RequestVote" 
  | "VoteResponse" 
  | "RestartVote" 
  | "LeaseRenew";

export interface BaseFederationMessage {
  type: FederationMessageType;
  nodeId: string;
}

export interface Heartbeat extends BaseFederationMessage {
  type: "Heartbeat";
  term: number;
  health: NodeHealth;
}

export interface RequestVote extends BaseFederationMessage {
  type: "RequestVote";
  term: number;
}

export interface VoteResponse extends BaseFederationMessage {
  type: "VoteResponse";
  term: number;
  granted: boolean;
}

export interface RestartVote extends BaseFederationMessage {
  type: "RestartVote";
  term: number;
  reason?: string;
}

export interface LeaseRenew extends BaseFederationMessage {
  type: "LeaseRenew";
  term: number;
  epoch: number;
}

export type FederationMessage = 
  | Heartbeat 
  | RequestVote 
  | VoteResponse 
  | RestartVote 
  | LeaseRenew;
