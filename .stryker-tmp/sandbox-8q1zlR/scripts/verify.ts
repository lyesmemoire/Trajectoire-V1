// @ts-nocheck
// scripts/verify.ts
import { verifyInvariant } from "@verifier/invariant";
import type { TickTrace } from "@common/trace";
import * as fs from "fs";
import * as path from "path";

/**
 * Reads the entire stdin stream as a string.
 */
function readStdin(): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = "";
    process.stdin.setEncoding("utf-8");
    process.stdin.on("data", (chunk) => (data += chunk));
    process.stdin.on("end", () => resolve(data));
    process.stdin.on("error", (err) => reject(err));
  });
}

async function main() {
  const args = process.argv.slice(2);
  let raw: string;

  if (args.length > 0) {
    const filePath = path.resolve(process.cwd(), args[0]);
    try {
      raw = fs.readFileSync(filePath, "utf-8");
    } catch (err) {
      console.error(`Failed to read trace file at ${filePath}:`, err);
      process.exit(2);
    }
  } else {
    // No file argument – read trace JSON from stdin
    try {
      raw = await readStdin();
      if (!raw) {
        console.error("No trace data received from stdin");
        process.exit(2);
      }
    } catch (err) {
      console.error("Error reading from stdin:", err);
      process.exit(2);
    }
  }

  let trace: TickTrace[];
  try {
    trace = JSON.parse(raw) as TickTrace[];
  } catch (err) {
    console.error("Trace data is not valid JSON:", err);
    process.exit(2);
  }

  const ok = verifyInvariant(trace);
  if (!ok) {
    console.error("❌ Invariant failed: split‑brain detected");
    process.exit(1);
  }

  // Success path – write message and set exit code
  process.stdout.write("✅ Invariant holds\n");
  process.exitCode = 0;
  return;
}

main();
