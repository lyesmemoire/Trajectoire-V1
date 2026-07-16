/**
 * Deterministic JSON serialization for cryptographic hashing.
 * Ensures that keys are sorted so that identical payloads always hash to the same value.
 */
// @ts-nocheck

export function canonicalize(obj: any): string {
  if (obj === null || typeof obj !== "object") {
    return JSON.stringify(obj);
  }

  if (Array.isArray(obj)) {
    return "[" + obj.map(item => canonicalize(item)).join(",") + "]";
  }

  const keys = Object.keys(obj).sort();
  let result = "{";
  for (let i = 0; i < keys.length; i++) {
    if (i > 0) result += ",";
    const key = keys[i];
    result += JSON.stringify(key) + ":" + canonicalize(obj[key]);
  }
  result += "}";
  return result;
}
