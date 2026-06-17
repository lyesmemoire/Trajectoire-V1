// runtime/question-engine/RecoveryStrategy.ts
/**
 * String‑literal union describing how the interview engine should recover
 * from a problematic selector or decision state.
 */
export type RecoveryStrategy =
  | "simplify"
  | "pivot"
  | "encourage"
  | "revalidate"
  | "challenge";
