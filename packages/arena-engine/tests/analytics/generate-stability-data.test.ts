import { describe, it } from "vitest";
import * as fs from "fs";
import * as path from "path";
import { MultiWorldSimulator } from "../helpers/MultiWorldSimulator";
import { FakeInfra } from "../../src/testing/FakeInfra";
import { PolicyGenome } from "../../src/evolution/types";
import { createAdaptiveWorld } from "../evolution/topology-adaptation.test";

function extractTopologyFitness(world: any) {
  const state = world.engine.state;
  let score = state.messagesProcessed * 10;
  if (state.crashed) score = 0; 
  else { 
    score -= state.defensiveCount * 2; 
    score -= state.cascadeCount * 5; 
  }
  return { 
    score: Math.max(0, score), 
    metrics: { queueSize: world.inFlightMessages?.length ?? 0 } 
  };
}

describe("Phase 9: Generating Stability Phase Space Data", () => {
  it("Should map the stability region based on Exploration vs Cooldown", () => {
    // The fixed best baseline genome (from Phase 8C)
    const baseGenome: PolicyGenome = {
      version: 1,
      parameters: {
        criticalThreshold: 14.0,
        degradeThreshold: 24.0,
        maxAllowedLamportGap: 35.0,
        lamportPenaltyFactor: 0.39,
        ignoreStaleProbability: 0,
        burstDetectionThreshold: 21.9,
        burstToleranceMultiplier: 0.3,
        backpressureThreshold: 1, // Aggressive rejection
        rerouteTriggerThreshold: 1, // Instant reroute
        // To be varied:
        rerouteCooldownTicks: 0,
        rerouteExplorationRate: 0.0
      }
    };

    const numNodes = 20;
    const simDuration = 2000;
    const csvData: string[] = ["explorationRate,cooldownTicks,avgScore,queueVariance"];

    // Phase space resolution
    const explorationSteps = [0.0, 0.1, 0.2, 0.5, 0.8, 1.0];
    const cooldownSteps = [0, 5, 10, 20, 50];

    console.log(`Mapping ${explorationSteps.length * cooldownSteps.length} configurations...`);

    for (const expRate of explorationSteps) {
      for (const cooldown of cooldownSteps) {
        
        // Setup Genome for this point
        const genome = structuredClone(baseGenome);
        genome.parameters.rerouteExplorationRate = expRate;
        genome.parameters.rerouteCooldownTicks = cooldown;

        // Run simulation
        const sim = new MultiWorldSimulator(42);
        sim.router.setConfig({ dropRate: 0, duplicationRate: 0, reorderRate: 0, maxJitterMs: 0 }); 

        for(let i=0; i<numNodes; i++) {
          sim.addWorld(createAdaptiveWorld(i, new FakeInfra(42 + i), genome, sim, numNodes));
        }

        sim.runUntil(simDuration);

        let totalScore = 0;
        const queueSizes: number[] = [];
        
        for(let i=0; i<numNodes; i++) {
          const w = sim.worlds.find(world => world.id === i)!;
          const res = extractTopologyFitness(w);
          totalScore += res.score;
          queueSizes.push(res.metrics.queueSize);
        }

        const avgScore = totalScore / numNodes;
        const avgQueue = queueSizes.reduce((a, b) => a + b, 0) / numNodes;
        const queueVariance = queueSizes.reduce((a, b) => a + Math.pow(b - avgQueue, 2), 0) / numNodes;

        csvData.push(`${expRate},${cooldown},${avgScore.toFixed(2)},${queueVariance.toFixed(2)}`);
      }
    }

    const outPath = path.join(__dirname, "../../../artifacts/analytics/stability_map.csv");
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, csvData.join("\n"), "utf-8");
    
    console.log(`Successfully generated stability data to: ${outPath}`);
  });
});
