// @ts-nocheck
export interface TenantKeyManager {
  getActiveKey(tenantId: string): Promise<string | undefined>;
  getVerificationKeys(tenantId: string): Promise<string[]>;
}
