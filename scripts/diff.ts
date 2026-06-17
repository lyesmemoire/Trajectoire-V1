// src/scripts/diff.ts

import fs from "fs";
import path from "path";
import { diffTraces } from "../src/replay/diffTrace";
import { buildDiffContext } from "../src/replay/buildDiffContext";
import { makeFingerprint } from "../src/replay/fingerprint";

// ------------------------------------------------------------
// Argument handling
// ------------------------------------------------------------
// Usage:
//   npm run diff -- <old> <new> [--fingerprint] [--threshold '{...}']
// Flags may appear in any order after the two file arguments.
const rawArgs = process.argv.slice(2);
const fileArgs = rawArgs.filter((arg) => !arg.startsWith("--")).slice(0, 2);
const [oldPathInput, newPathInput] = fileArgs;

if (!oldPathInput || !newPathInput) {
  console.error(
    "Usage: npm run diff -- <oldTrace> <newTrace> [--fingerprint] [--threshold '{...}']"
  );
  process.exit(2);
}

const fingerprintFlag = rawArgs.includes("--fingerprint");
const thresholdIdx = rawArgs.findIndex((arg) => arg === "--threshold");
let threshold: { leaderChanges?: number; eventDrift?: number } | null = null;
if (thresholdIdx !== -1) {
  const jsonStr = rawArgs[thresholdIdx + 1];
  if (!jsonStr) {
    console.error("--threshold requires a JSON string argument");
    process.exit(2);
  }
  try {
    threshold = JSON.parse(jsonStr);
  } catch (e) {
    console.error("Failed to parse threshold JSON:", e);
    process.exit(2);
  }
}
// When a threshold is provided we always emit the fingerprint JSON.
const emitFingerprint = fingerprintFlag || threshold !== null;

// ------------------------------------------------------------
// Load traces
// ------------------------------------------------------------
const resolve = (p: string) => path.resolve(process.cwd(), p);
const oldRaw = fs.readFileSync(resolve(oldPathInput), "utf-8");
const newRaw = fs.readFileSync(resolve(newPathInput), "utf-8");

const oldTrace = JSON.parse(oldRaw) as any[]; // TickTrace[]
const newTrace = JSON.parse(newRaw) as any[]; // TickTrace[]

// ------------------------------------------------------------
// Compute diffs and context
// ------------------------------------------------------------
const diffs = diffTraces(oldTrace, newTrace);
const { totalOldEvents } = buildDiffContext(oldTrace, newTrace);

// ------------------------------------------------------------
// Human‑readable diff (default mode)
// ------------------------------------------------------------
if (!emitFingerprint) {
  for (const d of diffs) {
    console.log(`Tick ${d.tickId}`);
    if (d.missing) {
      console.log(`  ⚠ missing in ${d.missing === "old" ? "old" : "new"} trace`);
      continue;
    }
    if (d.leaderChange) {
      console.log(`  - leader: ${d.leaderChange.old} → + leader: ${d.leaderChange.new}`);
    }
    if (d.eventCountChange) {
      console.log(`  - events: ${d.eventCountChange.old} → + events: ${d.eventCountChange.new}`);
    }
  }
  console.log("\n✅ Diff complete\n");
  process.exit(0);
}

// ------------------------------------------------------------
// Fingerprint generation (JSON output)
// ------------------------------------------------------------
const fingerprint = makeFingerprint(diffs, totalOldEvents);
console.log(JSON.stringify(fingerprint, null, 2));

// ------------------------------------------------------------
// Threshold enforcement (CI guardrail)
// ------------------------------------------------------------
if (threshold) {
  const breaches: string[] = [];
  if (
    typeof threshold.leaderChanges === "number" &&
    fingerprint.leaderChanges > threshold.leaderChanges
  ) {
    breaches.push(
      `leaderChanges (${fingerprint.leaderChanges}) exceeds threshold (${threshold.leaderChanges})`
    );
  }
  if (
    typeof threshold.eventDrift === "number" &&
    fingerprint.eventDrift > threshold.eventDrift
  ) {
    breaches.push(
      `eventDrift (${fingerprint.eventDrift}) exceeds threshold (${threshold.eventDrift})`
    );
  }
  if (breaches.length > 0) {
    console.error(
      "Threshold breach detected:\n" + breaches.map((b) => `- ${b}`).join("\n")
    );
    process.exit(1);
  }
}

process.exit(0);
