// src/watchdog/federation/LeaseManager.ts

import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { IClock } from "../../ports/IInfra";

/**
 * Lease information – bound to a cluster term and monotonic epoch counter.
 * No wall‑clock timestamps are used to avoid clock‑skew issues.
 */
export interface Lease {
  ownerId: string; // UUID of the node that holds the lease
  term: number; // cluster‑wide term this lease is valid for
  epoch: number; // monotonic counter incremented on each renewal
}

/**
 * LeaseManager persists lease state to a file in the OS temp directory so that
 * a restarted watchdog can re‑load its latest known lease (if any). The file is
 * written atomically using the `wx` flag to avoid race conditions.
 */
export class LeaseManager {
  private leaseFile: string;
  private currentLease: Lease | null = null;
  private atRisk = false;
  private riskTicks = 0;
  private riskStart = 0;
  private nodeId: string;
  private leaseTtlMs: number;

  constructor(private readonly clock: IClock, nodeId: string, leaseTtlMs: number) {
    this.nodeId = nodeId;
    this.leaseTtlMs = leaseTtlMs;
    // lease file is per‑node to avoid cross‑node contention
    this.leaseFile = path.join(os.tmpdir(), `lease-${this.nodeId}.json`);
    this.loadLease();
  }

  /** Load persisted lease if it exists – used on restart */
  private loadLease() {
    try {
      if (fs.existsSync(this.leaseFile)) {
        const data = fs.readFileSync(this.leaseFile, { encoding: "utf-8" });
        this.currentLease = JSON.parse(data) as Lease;
      }
    } catch (_) {
      // Corrupted file – treat as no lease
      this.currentLease = null;
    }
  }

  /** Persist the current lease atomically */
  private persistLease() {
    if (!this.currentLease) return;
    const tmpFile = `${this.leaseFile}.tmp`;
    fs.writeFileSync(tmpFile, JSON.stringify(this.currentLease), { flag: "w" });
    // atomic rename replaces the old file
    fs.renameSync(tmpFile, this.leaseFile);
  }

  /** Acquire lease for the given term – only succeeds if there is no valid lease */
  public acquire(term: number): boolean {
    if (this.currentLease && this.isValid(term)) {
      // another node already holds a valid lease (or this node did previously)
      return false;
    }
    this.currentLease = { ownerId: this.nodeId, term, epoch: 1 };
    this.persistLease();
    return true;
  }

  /** Renew the lease – increments epoch and persists. Returns false if term mismatch. */
  public renew(term: number): boolean {
    if (!this.currentLease) return false;
    if (this.currentLease.term !== term) return false; // term bound check
    this.currentLease.epoch += 1;
    this.persistLease();
    return true;
  }

  /** Release lease – removes persisted file */
  public release() {
    this.currentLease = null;
    try {
      if (fs.existsSync(this.leaseFile)) fs.unlinkSync(this.leaseFile);
    } catch (_) { /* ignore */ }
    // reset revocation state as well
    this.atRisk = false;
    this.riskTicks = 0;
    this.riskStart = 0;
  }

  /** Validate a lease against the current cluster term */
  public isValid(currentTerm: number): boolean {
    if (!this.currentLease) return false;
    return this.currentLease.ownerId === this.nodeId && 
           this.currentLease.epoch > 0 &&
           this.currentLease.term === currentTerm;
  }

  /** Expose current lease for external checks */
  public getLease(): Lease | null {
    return this.currentLease;
  }

  /**
   * Two‑phase revocation based on fault overlay.
   * overlay: { leaseRisk: number; criticalCount: number }
   */
  public revokeIfFaulty(overlay: { leaseRisk: number; criticalCount: number }) {
    if (overlay.leaseRisk > 0.75 && overlay.criticalCount >= 2) {
      if (!this.atRisk) {
        this.atRisk = true;
        this.riskStart = this.clock.now();
      }
      this.riskTicks++;
    }

    if (
      this.atRisk &&
      (overlay.leaseRisk > 0.9 || this.riskTicks >= 5)
    ) {
      this.release();
    }
  }
}
