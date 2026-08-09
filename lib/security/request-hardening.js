import { createHmac, randomBytes } from "crypto";
import { getRedisClient } from "@/lib/redis";
/**
 * Hardened Request Signer with Nonce support.
 */
export const RequestHardening = {
    /**
     * Generates a one-time nonce for a sensitive request.
     */
    generateNonce: async (userId) => {
        const redis = getRedisClient();
        const nonce = randomBytes(16).toString("hex");
        if (redis) {
            await redis.set(`nonce:${userId}:${nonce}`, true, { ex: 300 }); // Valid for 5 min
        }
        return nonce;
    },
    /**
     * Verifies the signature and ensures the nonce hasn't been used.
     */
    verifyRequest: async (userId, signature, payload, nonce) => {
        const isProduction = process.env.NODE_ENV === "production";
        const secret = process.env.API_SIGNING_SECRET;
        if (isProduction && !secret) {
            console.error("CRITICAL: API_SIGNING_SECRET is not set in production");
            return false; // Fail securely
        }
        const signingKey = secret || "internal-secret";
        // 1. Check Nonce existence and consume it
        const redis = getRedisClient();
        if (redis) {
            const isValidNonce = await redis.get(`nonce:${userId}:${nonce}`);
            if (!isValidNonce)
                return false;
            await redis.del(`nonce:${userId}:${nonce}`);
        }
        else {
            // If redis is down, we must fail closed in production
            if (isProduction)
                return false;
        }
        // 2. Validate HMAC Signature
        const expected = createHmac("sha256", signingKey)
            .update(`${payload}:${nonce}`)
            .digest("hex");
        return signature === expected;
    },
};
//# sourceMappingURL=request-hardening.js.map