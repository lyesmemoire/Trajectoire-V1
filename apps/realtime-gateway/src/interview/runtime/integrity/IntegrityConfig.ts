export type IntegrityMode = "off" | "dev" | "ci" | "strict";

export interface IntegrityConfig {
  mode: IntegrityMode;
  verifyPlayback: boolean;
  verifySnapshots: boolean;
  verifyRenderer: boolean;
}

export const defaultIntegrityConfig: IntegrityConfig = {
  mode: "dev",
  verifyPlayback: true,
  verifySnapshots: true,
  verifyRenderer: false,
};
