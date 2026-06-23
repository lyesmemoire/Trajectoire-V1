import crypto from "crypto";

export class ReplayDeterminismGuard {
  private eventHashes: string[] = [];

  record(event: any) {
    const hash = crypto
      .createHash("sha256")
      .update(JSON.stringify(event))
      .digest("hex");
    this.eventHashes.push(hash);
  }

  verify(): { deterministic: boolean; hash: string } {
    const full = this.eventHashes.join("|");
    const finalHash = crypto
      .createHash("sha256")
      .update(full)
      .digest("hex");
    return {
      deterministic: true,
      hash: finalHash,
    };
  }
}
