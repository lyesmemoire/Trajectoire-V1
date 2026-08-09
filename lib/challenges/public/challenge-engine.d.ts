/**
 * Challenge Engine - Core Logic for Public Events
 */
export declare function getActiveChallenges(): Promise<any>;
export declare function joinChallenge(userId: string, challengeId: string): Promise<any>;
export declare function updateChallengeProgress(sessionId: string, score: number, pressure: number, interruptions: number): Promise<void>;
export declare function getChallengeLeaderboard(challengeId: string): Promise<any>;
//# sourceMappingURL=challenge-engine.d.ts.map