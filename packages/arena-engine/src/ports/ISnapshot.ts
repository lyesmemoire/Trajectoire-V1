export interface SerializedStateStore {
  // To be defined based on GlobalStateStore
  activeNodes: number;
  deadNodes: number;
  queuedTasks: number;
}

export interface SerializedControlPlane {
  // To be defined based on RuntimeControlPlane
  state: number; // ControlPlaneState enum
  lastGovernorAction?: string;
}

import { InterWorldMessage } from "../distributed/network/types";

export interface WorldSnapshot {
  logicalTime: number;
  randomState: number;
  stateStore: SerializedStateStore;
  controlPlaneState: SerializedControlPlane;
  networkInFlightMessages?: InterWorldMessage[];
  networkBacklog?: any[]; // Array of BackloggedMessage
  partitions?: number[][] | null;
}

export interface Rehydratable<TData> {
  serialize(): TData;
  restore(data: TData): void;
  rehydrate(): void;
}
