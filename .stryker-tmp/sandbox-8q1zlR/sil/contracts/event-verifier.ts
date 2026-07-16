// @ts-nocheck
import { IncomingSILEvent } from "./sil-events";

export type VerificationResult =
  | { isValid: true }
  | { isValid: false; reason: string };

export interface EventVerifier {
  verifySignature(event: IncomingSILEvent): Promise<VerificationResult>;
  verifyTenant(event: IncomingSILEvent): Promise<VerificationResult>;
  verifyTimestamp(event: IncomingSILEvent): Promise<VerificationResult>;
}
