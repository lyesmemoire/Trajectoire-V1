export declare function evaluateFraud({ userId, ip, fingerprint, _ }: {
    userId: string;
    ip: string;
    fingerprint?: string;
}): Promise<{
    risk: number;
    fraudFlag: boolean;
}>;
//# sourceMappingURL=fraud-engine.d.ts.map