
export type TenantContext = {
  tenantId: string;
  plan: "free" | "pro" | "enterprise";
};

export async function tenantMiddleware(req: _FastifyRequest) {
  const auth = (req as unknown).auth;

  if (!auth?.tenantId) {
    throw new Error("Missing tenant context");
  }

  (req as unknown).tenant = {
    tenantId: auth.tenantId,
    plan: "pro", 
  } satisfies TenantContext;
}
