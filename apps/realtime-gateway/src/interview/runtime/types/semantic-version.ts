// runtime/types/semantic-version.ts
import { Brand } from "./brand";

/** Branded semantic version string */
export type SemanticVersion = Brand<string, "SemanticVersion">;
