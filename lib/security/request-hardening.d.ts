/**
 * Hardened Request Signer with Nonce support.
 */
export declare const RequestHardening: {
    /**
     * Generates a one-time nonce for a sensitive request.
     */
    generateNonce: (userId: string) => Promise<string>;
    /**
     * Verifies the signature and ensures the nonce hasn't been used.
     */
    verifyRequest: (userId: string, signature: string, payload: string, nonce: string) => Promise<boolean>;
};
//# sourceMappingURL=request-hardening.d.ts.map