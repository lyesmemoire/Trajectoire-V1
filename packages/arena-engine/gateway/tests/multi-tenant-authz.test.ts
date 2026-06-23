import { describe, it, expect, beforeEach } from "vitest";
import { MockAuthorizationService, Principal } from "../services/rbac";

describe("Gateway Phase 2-H.2/H.3 — Multi-tenant Authorization", () => {
  let authz: MockAuthorizationService;

  beforeEach(() => {
    authz = new MockAuthorizationService();
  });

  it("Should allow Tenant A to read Tenant A's report", async () => {
    const principal: Principal = {
      subjectId: "user_1",
      tenantDid: "did:A",
      issuer: "auth0",
      issuedAt: Date.now(),
      expiresAt: Date.now() + 3600,
      tenantId: "tenant-A", // Resolved internally
      roles: ["recruiter"]
    };

    const isAuthorized = await authz.authorize(principal, "report:read", {
      tenantId: "tenant-A",
      reportId: "rep_1"
    });

    expect(isAuthorized).toBe(true);
  });

  it("Should deny Tenant A from reading Tenant B's report", async () => {
    const principal: Principal = {
      subjectId: "user_1",
      tenantDid: "did:A",
      issuer: "auth0",
      issuedAt: Date.now(),
      expiresAt: Date.now() + 3600,
      tenantId: "tenant-A",
      roles: ["tenant_admin"] // Even as admin!
    };

    const isAuthorized = await authz.authorize(principal, "report:read", {
      tenantId: "tenant-B",
      reportId: "rep_2"
    });

    expect(isAuthorized).toBe(false);
  });
});
