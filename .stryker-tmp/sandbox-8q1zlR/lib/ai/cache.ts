// @ts-nocheck
import crypto from "crypto";

export function generateHash(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}
