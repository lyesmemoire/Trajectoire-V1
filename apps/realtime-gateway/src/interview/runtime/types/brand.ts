// runtime/types/brand.ts
/** Reusable branding utility for nominal typing */
export type Brand<T, B extends string> = T & { readonly __brand: B };
