import { SignedEvent } from "./signed-event";

// --- Hash Chain Session Builder ---

export interface HashChainState {
  readonly sessionId: string;
  readonly tenantDid: string;
  readonly events: readonly SignedEvent[];
  readonly headHash: string;
  readonly length: number;
}

/**
 * Create an empty hash chain for a new session.
 */
export function createHashChain(sessionId: string, tenantDid: string): HashChainState {
  return {
    sessionId,
    tenantDid,
    events: [],
    headHash: "0", // Genesis sentinel
    length: 0,
  };
}

/**
 * Append a signed event to the chain.
 * Validates that the event's previousEventHash matches the current head.
 */
export function appendToChain(chain: HashChainState, event: SignedEvent): HashChainState {
  if (event.previousEventHash !== chain.headHash) {
    throw new Error(
      `CHAIN_INTEGRITY_VIOLATION: event.previousEventHash (${event.previousEventHash}) ` +
      `does not match chain head (${chain.headHash})`
    );
  }

  if (event.sessionId !== chain.sessionId) {
    throw new Error(
      `SESSION_MISMATCH: event belongs to session ${event.sessionId}, ` +
      `chain belongs to session ${chain.sessionId}`
    );
  }

  if (event.tenantDid !== chain.tenantDid) {
    throw new Error(
      `TENANT_MISMATCH: event belongs to tenant ${event.tenantDid}, ` +
      `chain belongs to tenant ${chain.tenantDid}`
    );
  }

  return {
    sessionId: chain.sessionId,
    tenantDid: chain.tenantDid,
    events: [...chain.events, event],
    headHash: event.hash,
    length: chain.length + 1,
  };
}

/**
 * Validate the entire chain from genesis to head.
 * Returns the first broken link if any, or null if chain is valid.
 */
export function validateChain(chain: HashChainState): {
  valid: boolean;
  brokenAt?: number;
  reason?: string;
} {
  let expectedPrevious = "0";

  for (let i = 0; i < chain.events.length; i++) {
    const event = chain.events[i];

    if (event.previousEventHash !== expectedPrevious) {
      return {
        valid: false,
        brokenAt: i,
        reason: `Event ${i} has previousEventHash=${event.previousEventHash} but expected ${expectedPrevious}`,
      };
    }

    if (event.sessionId !== chain.sessionId) {
      return {
        valid: false,
        brokenAt: i,
        reason: `Event ${i} belongs to wrong session ${event.sessionId}`,
      };
    }

    expectedPrevious = event.hash;
  }

  if (chain.headHash !== expectedPrevious) {
    return {
      valid: false,
      reason: `Chain headHash (${chain.headHash}) does not match last event hash (${expectedPrevious})`,
    };
  }

  return { valid: true };
}
