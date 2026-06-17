import { EventEmitter } from "events";
import { assertValidTickTrace } from "../../common/traceValidation";

import type { NodeHealth, RestartVote } from "./types";
import { WeightedQuorum } from "./WeightedQuorum";
import { LeaseManager } from "./LeaseManager";
import { TermManager } from "./TermManager";
import { FaultGovernor } from "../../observability/FaultGovernor";
import { InterNodeComm } from "./InterNodeComm";
import { NodePruner } from "./NodePruner";
import { LeaderElection } from "./LeaderElection";



export interface FederatedWatchdogOptions {
  nodeId: string;
  listenPort: number;
  peers: string[];
  healthSource: EventEmitter; // emits "health" with NodeHealth[]
}

export class FederatedWatchdog extends EventEmitter {
  private opts: FederatedWatchdogOptions;
  private comm: InterNodeComm;
  private quorum: WeightedQuorum;
  private leaseMgr: LeaseManager;
  private termMgr: TermManager;
  private faultGov: FaultGovernor;
  private pruner: NodePruner;
  private leaderElection: LeaderElection;

  private healthCache: NodeHealth[] = [];
  // internal tick counter for observability only
  private tickCounter: number = 0;

  constructor(opts: FederatedWatchdogOptions) {
    super();
    this.opts = opts;
    this.comm = new InterNodeComm(
      opts.nodeId,
      opts.listenPort,
      opts.peers
    );
    this.quorum = new WeightedQuorum();
    this.leaseMgr = new LeaseManager(opts.nodeId, 30_000);
    this.termMgr = new TermManager();
    this.faultGov = new FaultGovernor();
    this.pruner = new NodePruner(30_000, this.faultGov);
    this.leaderElection = new LeaderElection(this.termMgr, opts.nodeId);

    opts.healthSource.on("health", (nodes: NodeHealth[]) => {
      this.healthCache = [...nodes]; // copy to avoid external mutation
    });

    this.comm.onMessage((msg) => this.handleMessage(msg));
  }

  start() {
    this.comm.start();
  }

  public tick(): void {
    // Increment internal tick counter for observability
    this.tickCounter++;
    const effectiveTickId = this.tickCounter;
    console.log("[TICK] collect start");
    let nodes = [...this.healthCache]; // work on a copy
    if (!nodes.length) return;
    console.log("[TICK] collect done", { nodeCount: nodes.length });

    console.log("[TICK] prune start");
    nodes = this.pruner.prune(nodes);
    console.log("[TICK] prune done", { nodeCount: nodes.length });

    const totalNodes = nodes.length;
    console.log("[TICK] fault score start");
    for (const n of nodes) {
      const telemetry = (globalThis as any).faultTelemetryMap?.[n.nodeId];
      if (telemetry) {
        this.faultGov.update(n.nodeId, telemetry, totalNodes);
      }
    }
    console.log("[TICK] fault score done", { overlays: this.faultGov.getOverlayStates() });

    const overlays = this.faultGov.getOverlayStates();

    if (overlays.some((o) => o.restartBlock)) {
      console.warn("[FederatedWatchdog] Restart blocked due to fault overlay.");
      return;
    }

    console.log("[TICK] quorum compute start");
    const { healthQuorum, actionQuorum } = this.quorum.compute(nodes, overlays);
    console.log("[TICK] quorum compute done", { healthQuorum, actionQuorum });

    console.log("[TICK] lease verify start");
    const currentLease = this.leaseMgr.getLease();
    if (currentLease) {
      const ownerOverlay = this.faultGov.getOverlay(currentLease.ownerId);
      if (ownerOverlay) {
        this.leaseMgr.revokeIfFaulty({
          leaseRisk: ownerOverlay.leaseRisk,
          criticalCount: ownerOverlay.criticalCount,
        });
      }
    }
    console.log("[TICK] lease verify done", { lease: currentLease });

    const currentTerm = this.termMgr.getTerm();
    const isLeaseValid = currentLease ? this.leaseMgr.isValid(currentTerm) : false;
    const leaseOwner = isLeaseValid && currentLease?.ownerId === this.opts.nodeId;

    console.log("[TICK] leader check start");
    const isLeader = this.leaderElection.getIsLeader();
    console.log("[TICK] leader check done", { isLeader });

    // Buffer the event before emitting to avoid loss on shutdown/restart
    const traceEvent = {
      tickId: effectiveTickId,
      ts: Date.now(),
      nodeId: this.opts.nodeId,
      isLeader: isLeader
    };
    // No buffering needed; emit directly for observability
    if (process.env.NODE_ENV !== "production") {
      assertValidTickTrace(traceEvent);
    }
    this.emit("tickTrace", traceEvent);

    console.info("[FederatedWatchdog] CONSENSUS_RESULT", {
      leaderId: isLeader ? this.opts.nodeId : "<none>",
      term: currentTerm,
      votes: this.leaderElection.getVotesReceivedCount(),
      leadersObserved: isLeader ? 1 : 0
    });

    const canRestart = healthQuorum && actionQuorum && leaseOwner && isLeader;

    if (canRestart) {
      const term = this.termMgr.startNewElection();
      const restartMsg: RestartVote = {
        type: "RestartVote",
        nodeId: this.opts.nodeId,
        term,
      };
      this.comm.broadcast(restartMsg);
      console.info("[FederatedWatchdog] RestartVote broadcast.", restartMsg);
    } else {
      console.info("[FederatedWatchdog] No restart – conditions not met.", {
        healthQuorum,
        actionQuorum,
        leaseOwner,
        isLeader
      });
    }
  }

  private handleMessage(msg: any) {
    switch (msg.type) {
      case "Heartbeat":
        break;
      case "RestartVote":
        console.log("[FederatedWatchdog] Received RestartVote:", msg);
        break;
      default:
        console.warn("[FederatedWatchdog] Unknown message type:", msg.type);
    }
  }

  public shutdown() {
    console.log("[FederatedWatchdog] Shutting down, releasing lease.");
    // No pending events buffer exists; just release lease
    this.leaseMgr.release();
    // comm shutdown could be added if InterNodeComm had a stop method
    // this.comm.stop(); 
  }
}
