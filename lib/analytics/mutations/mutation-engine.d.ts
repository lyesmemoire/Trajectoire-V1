/**
 * Mutation Engine : Analyse les trajectoires pour extraire des récits de changement.
 */
export interface UserMutation {
    id: string;
    userRole: string;
    sessionNumber: number;
    mutation: string;
    turningPoint: string;
    trend: string;
    timestamp: string;
}
/**
 * Simule l'extraction d'une mutation narrative à partir d'une série de sessions.
 */
export declare function extractNarrativeMutation(user: unknown, sessions: unknown[]): UserMutation;
//# sourceMappingURL=mutation-engine.d.ts.map