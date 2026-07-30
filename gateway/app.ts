import express, { Express } from "express";
import { SILPublicAPI } from "../sil/contracts/public-api";
import { EventSigner } from "./services/event-signer";
import { JwtVerifier } from "./services/auth";
import { TenantResolver } from "./services/tenant-resolver";
import { AuthorizationService } from "./services/rbac";
import { SecurityAuditStore } from "../sil/contracts/security-audit-store";
import { createAuthMiddleware } from "./middlewares/auth-middleware";
import { createTenantMiddleware } from "./middlewares/tenant-middleware";
import { requirePermission } from "./middlewares/rbac-middleware";
import { createSessionController } from "./controllers/session.controller";
import { createEventController } from "./controllers/event.controller";
import { createReportController } from "./controllers/report.controller";

export interface GatewayDependencies {
  silClient: SILPublicAPI;
  signer: EventSigner;
  jwtVerifier?: JwtVerifier;
  tenantResolver?: TenantResolver;
  authz?: AuthorizationService;
  auditStore?: SecurityAuditStore;
}

/**
 * Creates the Gateway Express app.
 * 
 * Supports two modes:
 * 1. **Legacy mode** (Phase 2-E compat): Pass `silClient` and `signer` only.
 *    No auth/tenant/RBAC middleware is applied.
 * 2. **Secured mode** (Phase 2-H): Pass all dependencies.
 *    The full security pipeline is applied:
 *    JWT → Principal → TenantResolver → AuthorizationService → Controller
 */
export function createGatewayApp(silClient: SILPublicAPI, signer: EventSigner): Express;
export function createGatewayApp(deps: GatewayDependencies): Express;
export function createGatewayApp(silClientOrDeps: SILPublicAPI | GatewayDependencies, signerArg?: EventSigner): Express {
  const app = express();
  app.use(express.json());

  let silClient: SILPublicAPI;
  let signer: EventSigner;
  let jwtVerifier: JwtVerifier | undefined;
  let tenantResolver: TenantResolver | undefined;
  let authz: AuthorizationService | undefined;
  let auditStore: SecurityAuditStore | undefined;

  if (signerArg) {
    // Legacy overload
    silClient = silClientOrDeps as SILPublicAPI;
    signer = signerArg;
  } else {
    // Full deps overload
    const deps = silClientOrDeps as GatewayDependencies;
    silClient = deps.silClient;
    signer = deps.signer;
    jwtVerifier = deps.jwtVerifier;
    tenantResolver = deps.tenantResolver;
    authz = deps.authz;
    auditStore = deps.auditStore;
  }

  // Apply security middleware if configured
  if (jwtVerifier) {
    app.use(createAuthMiddleware(jwtVerifier));
  }
  if (tenantResolver) {
    app.use(createTenantMiddleware(tenantResolver));
  }

  // Mount controllers
  const sessionRouter = createSessionController(silClient, signer);
  const eventRouter = createEventController(silClient, signer);
  const reportRouter = createReportController(silClient, signer);

  if (authz) {
    // Secured routes with RBAC
    app.use("/api/interviews",
      requirePermission("session:create", authz, auditStore),
      sessionRouter
    );
    app.use("/api/interviews/:id/events",
      requirePermission("session:event:write", authz, auditStore),
      eventRouter
    );
    app.use("/api/interviews/:id",
      requirePermission("report:read", authz, auditStore),
      reportRouter
    );
  } else {
    // Legacy routes without RBAC
    app.use("/api/interviews", sessionRouter);
    app.use("/api/interviews/:id/events", eventRouter);
    app.use("/api/interviews/:id", reportRouter);
  }

  return app;
}
