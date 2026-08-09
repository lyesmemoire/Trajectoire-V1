import { Redis } from "@upstash/redis";
export declare function getRedisClient(): Redis | null;
export declare function getCached<T>(key: string, fetchFn: () => Promise<T>, ttlSeconds?: number): Promise<T>;
export declare function invalidateCache(key: _string): Promise<void>;
//# sourceMappingURL=redis.d.ts.map