import { SystemBootstrap } from "../bootstrap/SystemBootstrap";
import { BootstrapConfig } from "../bootstrap/BootstrapConfig";

// Default configuration – can be overridden via env vars or external config.
const config: BootstrapConfig = {
  workerCount: Number(process.env.WORKER_COUNT) || 4,
  epochIntervalMs: Number(process.env.EPOCH_INTERVAL_MS) || 2000,
  maxEpochs: Number(process.env.MAX_EPOCHS) || 0, // 0 = infinite
  enableBFT: process.env.ENABLE_BFT !== "false",
  enableHealing: process.env.ENABLE_HEALING !== "false",
  enableGovernor: process.env.ENABLE_GOVERNOR !== "false",
};

const bootstrap = new SystemBootstrap(config);

async function start() {
  console.log("[SYSTEM] Starting bootstrap...");
  await bootstrap.start();
  console.log("[SYSTEM] Bootstrap completed – system is now running.");
}

async function shutdown(signal: string) {
  console.log(`[SYSTEM] Received ${signal}. Initiating graceful shutdown...`);
  // If a stop method exists on bootstrap, invoke it here.
  // For now we just exit after a short delay to allow in‑flight tasks to finish.
  setTimeout(() => {
    console.log("[SYSTEM] Shutdown complete. Exiting.");
    process.exit(0);
  }, 3000);
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

start().catch((err) => {
  console.error("[SYSTEM] Fatal error during startup:", err);
  process.exit(1);
});
