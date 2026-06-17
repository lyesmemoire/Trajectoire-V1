import { describe, it, expect, beforeEach } from "vitest";
import { MockAuthorizationService, Principal } from "../services/rbac";

describe("Gateway Phase 2-H.3 — Role-Based Access Control", () => {
  let authz: MockAuthorizationService;
  const TENANT = "tenant-X";

  beforeEach(() => {
    authz = new MockAuthorizationService();
  });

  function createPrincipal(roles: any[]): Principal {
    return {
      subjectId: "u1",
      tenantDid: "did:X",
      issuer: "auth0",
      issuedAt: Date.now(),
      expiresAt: Date.now() + 3600,
      tenantId: TENANT,
      roles
    };
  }

  it("Should allow Recruiter to read report", async () => {
    const isAuthorized = await authz.authorize(
      createPrincipal(["recruiter"]),
      "report:read",
      { tenantId: TENANT }
    );
    expect(isAuthorized).toBe(true);
  });

  it("Should deny Recruiter from deleting a tenant", async () => {
    const isAuthorized = await authz.authorize(
      createPrincipal(["recruiter"]),
      "tenant:manage",
      { tenantId: TENANT }
    );
    expect(isAuthorized).toBe(false);
  });

  it("Should allow TenantAdmin to manage a tenant", async () => {
    const isAuthorized = await authz.authorize(
      createPrincipal(["tenant_admin"]),
      "tenant:manage",
      { tenantId: TENANT }
    );
    expect(isAuthorized).toBe(true);
  });

  it("Should allow Candidate to write events but not read report", async () => {
    const p = createPrincipal(["candidate"]);
    
    expect(await authz.authorize(p, "session:event:write", { tenantId: TENANT })).toBe(true);
    expect(await authz.authorize(p, "report:read", { tenantId: TENANT })).toBe(false);
  });
});
