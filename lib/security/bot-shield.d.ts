import { NextRequest } from 'next/server';
/**
 * Advanced Bot Shielding Logic
 */
export declare function evaluateRequestSafety(request: NextRequest): {
    safe: boolean;
    action: string;
    reason: string;
} | {
    safe: boolean;
    action?: undefined;
    reason?: undefined;
};
/**
 * Tarpitting: Artificial delay to slow down scrapers
 */
export declare function applyTarpit(): Promise<void>;
//# sourceMappingURL=bot-shield.d.ts.map