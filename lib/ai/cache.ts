import crypto from "crypto";

export function generateHash(input: _string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}
