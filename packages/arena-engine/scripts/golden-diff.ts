// scripts/golden-diff.ts

import fs from "fs";
import path from "path";

import { runReplayPipeline } from "../src/replay/ReplayPipeline";
import { loadGoldens } from "../src/replay/goldenLoader";
import { compareFingerprints } from "../src/replay/goldenCompare";
import { clusterDiffs, DriftCluster } from "../src/replay/clusterDiffs";

type Mode = "strict" | "warn";

type GoldenReport = {
  passed: boolean;
  results: {
    goldenName: string;
    passed: boolean;
    violations: {
      metric: string;
      actual: number;
      expected: number;
      threshold: number;
    }[];
  }[];
};

function readTrace(filePath: string): any {
  const resolved = path.resolve(filePath);
  const raw = fs.readFileSync(resolved, "utf-8");
  return JSON.parse(raw);
}

function parseMode(args: string[]): Mode {
  const modeArg = args.find((a) => a.startsWith("--mode"));
  if (modeArg) {
    const [, val] = modeArg.split("=");
    return val === "warn" ? "warn" : "strict";
  }
  return "strict";
}

function buildClusterSummary(clusters: DriftCluster[]): string {
  if (clusters.length === 0) return "";
  let md = "## Drift Clusters Summary\n\n";
  for (const c of clusters) {
    md += `- **${c.type}** – ${c.count} tick(s), severity ${c.severity}\n`;
    md += `  - ticks: ${c.ticks.join(", ")}\n`;
  }
  md += "\n---\n\n";
  return md;
}

function buildMarkdown(report: GoldenReport, clusters: DriftCluster[]): string {
  const marker = "<!-- golden-ci-bot -->";
  let md = `${marker}\n# Golden CI Report\n\n`;

  // Insert cluster summary before per‑golden sections
  md += buildClusterSummary(clusters);

  for (const r of report.results) {
    md += `## ${r.goldenName}\n`;
    md += r.passed ? "✅ PASS\n" : "❌ FAIL\n";
    if (r.violations.length > 0) {
      md += "**Violations:**\n";
      for (const v of r.violations) {
        md += `- ${v.metric}: actual=${v.actual}, threshold=${v.threshold}\n`;
      }
    }
    md += "\n";
  }
  md += "---\n";
  md += `Overall passed: ${report.passed}\n`;
  md += `Goldens checked: ${report.results.length}\n`;
  return md;
}

function main() {
  const args = process.argv.slice(2);
  const oldPath = args[0];
  const newPath = args[1];
  const mode: Mode = parseMode(args);

  if (!oldPath || !newPath) {
    console.error("Usage: node golden-diff.ts <oldTrace> <newTrace> [--mode=warn]");
    process.exit(1);
  }

  const oldTrace = readTrace(oldPath);
  const newTrace = readTrace(newPath);

  const pipeline = runReplayPipeline(oldTrace, newTrace);
  const goldens = loadGoldens();

  const results = goldens.map((g) => {
    const comp = compareFingerprints(pipeline.fingerprint, g.fingerprint, g.thresholds!);
    return {
      goldenName: g.name,
      passed: comp.passed,
      violations: comp.violations,
    };
  });

  const report: GoldenReport = {
    passed: results.every((r) => r.passed),
    results,
  };

  // ---- Drift clustering (interpretation layer) ----
  const clusters = clusterDiffs(pipeline.diffs);

  const markdown = buildMarkdown(report, clusters);

  // Ensure deterministic artifact directory
  const artifactDir = path.resolve("golden-artifacts");
  if (!fs.existsSync(artifactDir)) {
    fs.mkdirSync(artifactDir);
  }
  const jsonPath = path.join(artifactDir, "report.json");
  const mdPath = path.join(artifactDir, "report.md");
  fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2));
  fs.writeFileSync(mdPath, markdown);

  // Export env vars for downstream steps (CI automatically expands env vars)
  process.env.GOLDEN_REPORT_PATH = jsonPath;
  process.env.GOLDEN_REPORT_MD = mdPath;

  console.log(markdown);

  if (mode === "strict" && !report.passed) {
    process.exit(1);
  }
}

main();
