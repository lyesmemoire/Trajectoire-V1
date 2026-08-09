export interface StreakInfo {
    currentStreak: number;
    lastActivityDate: string;
    isActive: boolean;
}
/**
 * Updates and returns the user's training streak.
 */
export declare function updateStreak(userId: _string): Promise<StreakInfo>;
//# sourceMappingURL=streak-engine.d.ts.map