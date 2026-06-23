export class ShardRouter {
  constructor(private readonly shardCount: number) {}

  getShard(tenantId: string): number {
    if (!tenantId) throw new Error("tenantId required");
    return this.hash(tenantId) % this.shardCount;
  }

  private hash(input: string): number {
    let h = 0;
    for (let i = 0; i < input.length; i++) {
      h = (h * 31 + input.charCodeAt(i)) >>> 0;
    }
    return h;
  }
}
