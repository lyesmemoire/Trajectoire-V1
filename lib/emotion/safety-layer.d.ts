/**
 * Emotional Safety Layer: Prevents AI from crossing ethical boundaries
 * or inflicting psychological harm under pressure.
 */
export interface SafetyCheck {
    isSafe: boolean;
    reason?: string;
    adjustment?: string;
}
/**
 * Validates Victor's response before it reaches the user.
 */
export declare function validateAiResponse(response: string, pressureLevel: number): SafetyCheck;
/**
 * Ensures Replay advice remains constructive.
 */
export declare function sanitizeReplayCoaching(advice: string): string;
//# sourceMappingURL=safety-layer.d.ts.map