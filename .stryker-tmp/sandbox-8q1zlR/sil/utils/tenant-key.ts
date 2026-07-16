// @ts-nocheck
export function buildTenantKey(tenantId: string, sessionId: string): string {
  if (!tenantId || !sessionId) {
    throw new Error(`Invalid tenant key components: tenantId=${tenantId}, sessionId=${sessionId}`);
  }
  return `${tenantId}:${sessionId}`;
}
