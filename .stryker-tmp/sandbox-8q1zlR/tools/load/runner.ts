// @ts-nocheck
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { RuntimeOrchestrator } from "../../core/p6/orchestrator/runtime-orchestrator";
import { ExecutionFacade } from "../../core/p5/integration/execution-facade";
import { SessionGovernor, CandidateMessage } from "../../core/p6/types";
import { VoiceUXCalculator } from "../../core/p6/orchestrator/orchestrator-contract";
import { MindState } from "../../core/p5/execution-contract";
import { RuntimeDecision } from "../../core/p5/integration/integration-contract";
import { VoiceInput } from "../../core/p6/voice/voice-contract";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class StaticGovernor implements SessionGovernor {
  decide(msg: CandidateMessage, state: MindState): RuntimeDecision {
    return { trustDelta: 0.01, emotion: "neutral" };
  }
}

class StaticUXCalculator implements VoiceUXCalculator {
  calculateUX(state: MindState, decision: RuntimeDecision, message: CandidateMessage): VoiceInput {
    return {
      text: "Load test response",
      delayMs: 100,
      speechRate: 1.0,
      interruptionChance: 0,
      silenceProbability: 0
    };
  }
}

function runLoadTest(sessionCount: number, turnsPerSession: number) {
  const facade = new ExecutionFacade();
  const orchestrator = new RuntimeOrchestrator(facade, new StaticGovernor(), new StaticUXCalculator());

  const latencies: number[] = [];
  let journalSize = 0;
  
  const startTime = Date.now();

  for (let i = 0; i < sessionCount; i++) {
    const sessionId = `s_${i}`;
    orchestrator.initSession(sessionId, { trust: 0.5, suspicion: 0.5, pressure: 50, emotion: "neutral" }, Date.now());
    
    for (let t = 0; t < turnsPerSession; t++) {
      const startStep = performance.now();
      orchestrator.step({ sessionId, timestamp: Date.now() }, { text: "Hello" });
      const endStep = performance.now();
      latencies.push(endStep - startStep);
    }
    
    journalSize += facade.getSession(sessionId)?.journal?.length || 0;
  }
  
  const totalTime = Date.now() - startTime;
  
  latencies.sort((a, b) => a - b);
  const avgLatency = latencies.reduce((a, b) => a + b, 0) / latencies.length;
  const p95 = latencies[Math.floor(latencies.length * 0.95)];
  const p99 = latencies[Math.floor(latencies.length * 0.99)];

  return { sessionCount, avgLatency, p95, p99, totalTime, journalSize };
}

export function generateLoadReport() {
  const loadDir = join(__dirname);
  if (!existsSync(loadDir)) {
    mkdirSync(loadDir, { recursive: true });
  }

  const results = [
    runLoadTest(100, 10),
    runLoadTest(1000, 10),
    runLoadTest(10000, 10),
  ];

  let report = `# Load Campaign Report\n\n`;
  report += `| Sessions | Turns/Session | Avg Latency (ms) | P95 (ms) | P99 (ms) | Total Time (ms) | Total Journal Entries |\n`;
  report += `|----------|---------------|------------------|----------|----------|-----------------|-----------------------|\n`;
  
  for (const r of results) {
    report += `| ${r.sessionCount} | 10 | ${r.avgLatency.toFixed(3)} | ${r.p95.toFixed(3)} | ${r.p99.toFixed(3)} | ${r.totalTime} | ${r.journalSize} |\n`;
  }

  writeFileSync(join(loadDir, "load-report.md"), report);
  console.log("Load report generated at", join(loadDir, "load-report.md"));
}

generateLoadReport();
