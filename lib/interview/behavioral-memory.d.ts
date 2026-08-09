export interface BehavioralPattern {
    pattern: string;
    frequency: number;
    severity: number;
}
export declare function storePattern(userId: string, _pattern: string, _severity: number): Promise<void>;
export declare function getTopWeaknesses(userId: string): Promise<string[]>;
//# sourceMappingURL=behavioral-memory.d.ts.map