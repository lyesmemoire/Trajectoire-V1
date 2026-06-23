export interface MerkleLedgerReader {
  verifySession(
    tenantId: string,
    sessionId: string
  ): Promise<{
    valid: boolean;
    finalHash: string;
    batchCount: number;
  }>;
}
