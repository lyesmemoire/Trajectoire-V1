// runtime/types/time.ts
import { Brand } from "./brand";

/** Branded epoch millisecond timestamp */
export type EpochMilliseconds = Brand<number, "EpochMilliseconds">;
