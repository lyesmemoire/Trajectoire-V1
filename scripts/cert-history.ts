import fs from "fs";
import path from "path";

interface HistoryEntry {
  runId: string;
  timestamp: number; // epoch ms
  metrics: Record<string, number>;
  evaluation: {
    B1: boolean;
    B2: boolean;
    B3: boolean;
    B4: boolean;
    B5: boolean;
  };
}

const historyPath = path.resolve("cert-history.json");
const snapshotPath = path.resolve("certification-snapshot.json");
const evalPath = path.resolve("certification-evaluation.json");

function loadJson<T>(p: string): T {
  if (!fs.existsSync(p)) {
    throw new Error(`File not found: ${p}`);
  }
  return JSON.parse(fs.readFileSync(p, "utf-8")) as T;
}

const snapshot = loadJson<unknown>(snapshotPath);
const evaluation = loadJson<unknown>(evalPath);

const entry: HistoryEntry = {
  runId: snapshot.runId ?? `run-${Date.now()}`,
  timestamp: Date.now(),
  metrics: snapshot.metrics?.parsed ?? {},
  evaluation: {
    B1: evaluation.B1,
    B2: evaluation.B2,
    B3: evaluation.B3,
    B4: evaluation.B4,
    B5: evaluation.B5,
  },
};

let history: HistoryEntry[] = [];
if (fs.existsSync(historyPath)) {
  history = loadJson<HistoryEntry[]>(historyPath);
}
history.push(entry);
fs.writeFileSync(historyPath, JSON.stringify(history, null, 2));
console.log(`✅ History updated – ${history.length} entries`);
