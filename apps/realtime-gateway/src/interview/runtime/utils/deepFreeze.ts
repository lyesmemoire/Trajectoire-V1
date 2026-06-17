// runtime/utils/deepFreeze.ts
/**
 * Recursively freezes an object graph, handling cycles safely.
 * Arrays and plain objects are frozen; primitives are returned unchanged.
 * Objects already frozen are skipped to avoid redundant work.
 */
export function deepFreeze<T>(obj: T): Readonly<T> {
  const seen = new WeakSet<object>();

  function recurse(o: any): any {
    // Primitive values or null are returned as‑is
    if (o === null || typeof o !== "object") return o;
    // Skip if already frozen or already processed (cycle guard)
    if (Object.isFrozen(o) || seen.has(o)) return o;
    seen.add(o);
    // Freeze all own property keys (including symbols and non‑enumerable) first
    const keys = Reflect.ownKeys(o);
    for (const key of keys) {
      const desc = Object.getOwnPropertyDescriptor(o, key);
      if (desc && (desc.get || desc.set)) {
        // Accessor properties: freeze the underlying value if possible
        // No direct recursion needed for getters/setters
      } else {
        const value = (o as any)[key];
        recurse(value);
      }
    }
    return Object.freeze(o);
  }

  return recurse(obj) as Readonly<T>;
}
