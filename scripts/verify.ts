// scripts/verify.ts
import type { TickTrace } from "../src/common/trace";
import * as fs from "fs";
import * as path from "path";

/**
 * Simple invariant verification - checks for split-brain by ensuring
 * no tick has more than one leader
 */
function verifyInvariant(trace: TickTrace[]): boolean {
  const leaderMap = new Map<number, string>();
  
  for (const event of trace) {
    if (event.isLeader) {
      const existingLeader = leaderMap.get(event.tickId);
      if (existingLeader && existingLeader !== event.nodeId) {
        // Split-brain detected: same tick has different leaders
        return false;
      }
      leaderMap.set(event.tickId, event.nodeId);
    }
  }
  
  return true;
}

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
    } catch (error) {
      console.error(`Failed to read trace file at ${filePath}:`, error);
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
    } catch (error) {
      console.error("Error reading from stdin:", error);
      process.exit(2);
    }
  }

  let trace: TickTrace[];
  try {
    trace = JSON.parse(raw) as TickTrace[];
  } catch (error) {
    console.error("Trace data is not valid JSON:", error);
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
