export declare class CreditTransaction {
    /**
     * Réserve les crédits (Lock) avec protection anti-spam
     */
    static reserve(userId: string, amount: number, action: string, contentHash: string): Promise<{
        txId: string;
    } | {
        error: string;
    }>;
    /**
     * Commit (Succès) : Confirme l'utilisation, log les tokens
     */
    static commit(txId: string, metadata?: Record<string, unknown>): Promise<void>;
    /**
     * Rollback (Échec) : Rembourse les crédits à l'utilisateur
     */
    static rollback(txId: string, reason: string): Promise<void>;
}
//# sourceMappingURL=transactional.d.ts.map