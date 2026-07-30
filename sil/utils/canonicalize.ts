/**
 * Deterministic JSON serialization for cryptographic hashing.
 * Ensures that keys are sorted so that identical payloads always hash to the same value.
 */
export function canonicalize(obj: unknown): string {
  if (obj === null || typeof obj !== "object") {
    return JSON.stringify(obj);
  }

  if (Array.isArray(obj)) {
    return "[" + obj.map(item => canonicalize(item)).join(",") + "]";
  }

  const keys = Object.keys(obj as Record<string, unknown>).sort();
  let result = "{";
  for (let i = 0; i < keys.length; i++) {
    if (i > 0) result += ",";
    const key = keys[i];
    result += JSON.stringify(key) + ":" + canonicalize((obj as Record<string, unknown>)[key]);
  }
  result += "}";
  return result;
}
