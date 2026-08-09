import crypto from "crypto";
export function generateHash(input) {
    return crypto.createHash("sha256").update(input).digest("hex");
}
//# sourceMappingURL=cache.js.map