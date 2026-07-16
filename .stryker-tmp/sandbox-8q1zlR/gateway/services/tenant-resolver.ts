// @ts-nocheck
export interface TenantResolver {
  resolveTenantId(tenantDid: string): Promise<string>;
}

export class MockTenantResolver implements TenantResolver {
  private map = new Map<string, string>();

  setMapping(tenantDid: string, tenantId: string) {
    this.map.set(tenantDid, tenantId);
  }

  async resolveTenantId(tenantDid: string): Promise<string> {
    const tenantId = this.map.get(tenantDid);
    if (!tenantId) {
      throw new Error(`Unknown tenant DID: ${tenantDid}`);
    }
    return tenantId;
  }
}
