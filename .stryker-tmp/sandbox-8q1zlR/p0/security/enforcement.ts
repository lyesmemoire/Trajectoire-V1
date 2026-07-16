// @ts-nocheck
import { FastifyRequest, FastifyReply } from "fastify";
import { verifySignedEvent, SignedEvent } from "./signed-event";
import { createPolicyEngine, PolicyInput } from "./policy-engine";

const policyEngine = createPolicyEngine();

// --- Kafka Interceptor: Signed Event Verification ---

/**
 * Verify an incoming signed event before it reaches any consumer.
 * This is the Kafka consumer-side interceptor.
 *
 * Rejects:
 * - tampered payloads (hash mismatch)
 * - forged signatures
 * - broken chain links
 */
export function kafkaEventInterceptor(
  event: SignedEvent,
  publicKeyHex: string,
  expectedPreviousHash?: string
): { accepted: boolean; reason?: string } {
  const result = verifySignedEvent(event, publicKeyHex, expectedPreviousHash);

  if (!result.valid) {
    console.error(`[SECURITY] Event REJECTED: ${result.reason}`, {
      eventId: event.eventId,
      sessionId: event.sessionId,
      tenantDid: event.tenantDid,
    });
    return { accepted: false, reason: result.reason };
  }

  return { accepted: true };
}

// --- OPA Middleware for Fastify ---

/**
 * Fastify pre-handler that enforces OPA policies on every request.
 * Extracts the auth context from the request and evaluates all rules.
 */
export async function policyMiddleware(
  req: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const auth = (req as any).auth;
  if (!auth) {
    reply.code(401).send({ error: "UNAUTHORIZED", message: "Missing auth context" });
    return;
  }

  // Determine the action from the route
  const action = resolveAction(req.method, req.url);

  // Build policy input
  const input: PolicyInput = {
    action,
    tenantId: auth.tenantId,
    role: auth.role,
    jwt: {
      tenantId: auth.tenantId,
      did: `did:deds:${auth.tenantId}`,
      role: auth.role,
    },
    resource: extractResourceContext(req),
  };

  const result = policyEngine.evaluate(input);

  if (result.decision === "DENY") {
    console.warn(`[POLICY] DENIED: action=${action} tenant=${auth.tenantId} rule=${result.deniedBy}`);
    reply.code(403).send({
      error: "FORBIDDEN",
      message: `Policy violation: ${result.deniedBy}`,
    });
    return;
  }
}

// --- Helpers ---

function resolveAction(method: string, url: string): string {
  if (url.includes("/sessions")) {
    if (method === "POST") return "session.create";
    if (method === "DELETE") return "session.delete";
    return "session.read";
  }
  if (url.includes("/reports")) return "report.read";
  if (url.includes("/evaluations")) return "evaluation.read";
  if (url.includes("/rankings")) return "ranking.read";
  return "unknown";
}

function extractResourceContext(req: FastifyRequest): { tenantId: string; sessionId?: string } | undefined {
  const auth = (req as any).auth;
  const params = req.params as any;

  return {
    tenantId: auth?.tenantId || "",
    sessionId: params?.sessionId || params?.id,
  };
}
