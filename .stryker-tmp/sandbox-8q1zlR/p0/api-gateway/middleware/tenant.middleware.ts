// @ts-nocheck
import { FastifyRequest } from "fastify";

export type TenantContext = {
  tenantId: string;
  plan: "free" | "pro" | "enterprise";
};

export async function tenantMiddleware(req: FastifyRequest) {
  const auth = (req as any).auth;

  if (!auth?.tenantId) {
    throw new Error("Missing tenant context");
  }

  (req as any).tenant = {
    tenantId: auth.tenantId,
    plan: "pro", // MOCK logic (would fetch from TenantResolver)
  } satisfies TenantContext;
}
