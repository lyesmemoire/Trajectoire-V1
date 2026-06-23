import { CertificationLocker } from "../locker/CertificationLocker";
import crypto from "crypto";
import { IClock } from "../ports/IInfra";

export interface ByzantineNodeResult {
  nodeId: string;
  rootHash: string;
  timestamp: number;
  success: boolean;
  mode: "honest" | "faulty" | "malicious";
}

/**
 * Simulates a node participating in the certification process.
 * - honest: runs the normal locker and returns the true rootHash.
 * - faulty: runs locker but flips a single character of the rootHash (simulating a corrupted but non‑malicious node).
 * - malicious: returns a completely random hash, ignoring the locker output.
 */
export class ByzantineNode {
  constructor(
    private readonly clock: IClock,
    private nodeId: string,
    private mode: "honest" | "faulty" | "malicious" = "honest"
  ) {}

  private tamperHash(hash: string): string {
    // Simple deterministic tamper: invert the first character.
    if (hash.length === 0) return hash;
    const first = hash[0];
    const flipped = first === "0" ? "f" : "0";
    return flipped + hash.slice(1);
  }

  run(): ByzantineNodeResult {
    const locker = new CertificationLocker();
    const locked = locker.lock();
    let rootHash = locked.rootHash;
    let success = true;

    if (this.mode === "faulty") {
      rootHash = this.tamperHash(rootHash);
      success = false; // indicate deviation
    } else if (this.mode === "malicious") {
      // Generate a pseudo‑random hash deterministic based on nodeId + clock time for reproducibility
      rootHash = crypto.createHash("sha256").update(this.nodeId + this.clock.now().toString()).digest("hex");
      success = false;
    }

    return {
      nodeId: this.nodeId,
      rootHash,
      timestamp: this.clock.now(),
      success,
      mode: this.mode,
    };
  }
}
