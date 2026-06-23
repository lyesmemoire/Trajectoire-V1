// scripts/run-federation-smoke.ts
// Wrapper for federation smoke test using ts-node

import "ts-node/register"; // enable ts-node on the fly
import "./internode_audit.ts"; // execute the audit script

process.on("exit", (code) => {
  if (code !== 0) {
    console.error("[FATAL] Federation smoke test failed");
    process.exit(code);
  }
});
