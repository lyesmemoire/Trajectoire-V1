import { Pool } from "pg";
import * as crypto from "crypto";
import { MerkleLedgerReader } from "./merkle-ledger-reader";

export class PostgresMerkleLedgerReader implements MerkleLedgerReader {
  constructor(private pool: Pool) {}

  async verifySession(tenantId: string, sessionId: string) {
    const res = await this.pool.query(
      `SELECT root_hash FROM ledger_batches
       WHERE tenant_id = $1 AND session_id = $2
       ORDER BY start_sequence ASC`
      , [tenantId, sessionId]
    );

    let hash = "";

    for (const row of res.rows) {
      hash = this.hashPair(hash, row.root_hash);
    }

    return {
      valid: true,
      finalHash: hash,
      batchCount: res.rowCount
    };
  }

  private hashPair(a: string, b: string) {
    return crypto.createHash("sha256").update(a + b).digest("hex");
  }
}
