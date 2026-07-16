// @ts-nocheck
import fs from "fs";
import path from "path";
import { replayTrace } from "../src/replay/replayTrace";
import type { TickTrace } from "@common/trace";

// CLI args: optional trace file path and optional '--step' flag
const fileArg = process.argv[2] ?? "artifacts/trace.json";
const step = process.argv.includes("--step");

function waitForEnter(): Promise<void> {
  return new Promise((resolve) => {
    process.stdin.resume();
    process.stdout.write("\n⏸ Press Enter to continue... ");
    process.stdin.once("data", () => {
      process.stdin.pause();
      resolve();
    });
  });
}

async function main() {
  const raw = fs.readFileSync(path.resolve(process.cwd(), fileArg), "utf-8");
  const trace: TickTrace[] = JSON.parse(raw);

  const replay = replayTrace(trace);

  console.log("\n🧭 TRACE REPLAY\n");

  for (const [tickId, events] of replay.entries()) {
    const leaders = events.filter((e) => e.isLeader);
    const leader = leaders.length > 0 ? leaders[0].nodeId : "NONE";
    const leaderCount = leaders.length;

    console.log(
      `Tick ${tickId} | leader: ${leader} | events: ${events.length} | leaders: ${leaderCount}`
    );

    if (step) {
      await waitForEnter();
    }
  }

  console.log("\n✅ Replay complete\n");
}

main();
