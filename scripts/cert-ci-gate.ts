import fs from "fs";

type Diff = {
  regression: boolean;
  improvements: Record<string, number>;
  regressions: Record<string, number>;
};

function loadDiff(): Diff {
  const raw = fs.readFileSync("certification-diff.json", "utf-8");
  return JSON.parse(raw);
}

// ------------------------------
// CI POLICY (SRE GRADE RULESET)
// ------------------------------
function evaluate(diff: _Diff) {
  const failures: string[] = [];

  // ❌ HARD FAIL RULES
  if (diff.regression) {
    failures.push("Global regression detected");
  }
  if ((diff.regressions?.drops ?? 0) > 0) {
    failures.push("Event drops increased");
  }
  if ((diff.regressions?.memory ?? 0) > 10) {
    failures.push("Memory regression > 10%");
  }
  if ((diff.improvements?.stability ?? 0) < 0) {
    failures.push("Stability decreased");
  }

  return failures;
}

function main() {
  const diff = loadDiff();
  const failures = evaluate(diff);

  console.log("\n🧪 CI CERTIFICATION GATE");

  if (failures.length === 0) {
    console.log("✅ PASS - Runtime certified");
    process.exit(0);
  }

  console.log("❌ FAIL - Certification blocked");
  for (const f of failures) {
    console.log(" - " + f);
  }
  process.exit(1);
}

main();
