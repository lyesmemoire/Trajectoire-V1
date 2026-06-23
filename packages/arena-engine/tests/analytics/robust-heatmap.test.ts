import { describe, it } from "vitest";
import * as fs from "fs";
import * as path from "path";
import { MultiWorldSimulator } from "../helpers/MultiWorldSimulator";
import { FakeInfra } from "../../src/testing/FakeInfra";
import { PolicyGenome } from "../../src/evolution/types";
import { createAdaptiveWorld } from "../evolution/topology-adaptation.test";

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

describe("Phase 9: Robust Phase Space Analysis", () => {
  it("Should map the stability region with robust multi-seed protocol", () => {
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
        backpressureThreshold: 1,
        rerouteTriggerThreshold: 1,
        rerouteCooldownTicks: 0,
        rerouteExplorationRate: 0.0,
        rerouteDampingFactor: 0.0
      }
    };

    const simDuration = 3000;
    const measurementDuration = 2000;
    const dt = 50;
    const measurementTicks = Math.floor(measurementDuration / dt);

    const csvData: string[] = ["numNodes,explorationRate,dampingFactor,meanStability,stdStability,crashRate,meanVq,meanAosc,meanTstab,isStableRegion"];

    const explorationSteps: number[] = [];
    for (let i = 0; i <= 20; i++) explorationSteps.push(i * 0.05);
    
    const dampingSteps = [0.0, 0.05, 0.1, 0.2, 0.4, 0.7, 1.0];
    const clusterSizes = [10, 20, 40];
    const numSeeds = 10;

    for (const numNodes of clusterSizes) {
      for (const expRate of explorationSteps) {
        for (const damping of dampingSteps) {
          
          let stabilityScores: number[] = [];
          let crashes = 0;
          let sumVq = 0;
          let sumAosc = 0;
          let sumTstab = 0;

          for (let seed = 0; seed < numSeeds; seed++) {
            const genome = structuredClone(baseGenome);
            genome.parameters.rerouteExplorationRate = expRate;
            genome.parameters.rerouteDampingFactor = damping;
            genome.parameters.rerouteCooldownTicks = 0; // Fixé à 0 pour voir purement l'effet dissipatif

            const sim = new MultiWorldSimulator(seed);
            sim.router.setConfig({ dropRate: 0, duplicationRate: 0, reorderRate: 0, maxJitterMs: 0 });

            // 20% of seeds use 5 hotspots instead of 3 to test structural robustness
            const numHotspots = (seed < 2) ? 5 : 3;

            // Create worlds
            let timeSeriesQ: number[] = [];
            for (let i = 0; i < numNodes; i++) {
              sim.addWorld(createAdaptiveWorld(i, new FakeInfra(seed + i), genome, sim, numNodes, numHotspots));
            }

            let t = 0;
            while (t < simDuration) {
              sim.runUntil(t + dt);
              let totalQ = 0;
              for (const w of sim.worlds) totalQ += (w.inFlightMessages?.length ?? 0);
              timeSeriesQ.push(totalQ / numNodes);
              t += dt;
            }

            // --- 1. S = SurvivalRatio ---
            let aliveNodes = 0;
            let nodeQs: number[] = [];
            for (let i = 0; i < numNodes; i++) {
              const state = sim.worlds[i].engine.state;
              if (!state.crashed) aliveNodes++;
              nodeQs.push(sim.worlds[i].inFlightMessages?.length ?? 0);
            }
            const S = aliveNodes / numNodes;
            if (S < 1.0) crashes++;

            // --- 2. Vq = NormalizedQueueVariance ---
            const meanNodeQ = nodeQs.reduce((a, b) => a + b, 0) / numNodes;
            const nodeQVar = nodeQs.reduce((a, b) => a + Math.pow(b - meanNodeQ, 2), 0) / numNodes;
            const Vq = clamp(nodeQVar / (Math.pow(meanNodeQ, 2) + 0.1), 0, 1);

            // --- 3. Aosc = OscillationAmplitude ---
            const validSeries = timeSeriesQ.slice(-measurementTicks); // last 2000 ticks
            let Aosc = 0;
            if (validSeries.length > 0) {
              const maxQ = Math.max(...validSeries);
              const minQ = Math.min(...validSeries);
              const meanQ = validSeries.reduce((a,b)=>a+b,0) / validSeries.length;
              
              const diffs = [];
              for(let k=1; k<validSeries.length; k++) diffs.push(validSeries[k] - validSeries[k-1]);
              let diffVar = 0;
              if (diffs.length > 0) {
                const diffMean = diffs.reduce((a,b)=>a+b,0) / diffs.length;
                diffVar = diffs.reduce((a,b)=>a+Math.pow(b-diffMean, 2), 0) / diffs.length;
              }
              
              // Robust Amplitude calculation
              const amp = (maxQ - minQ) / (meanQ + 0.1);
              Aosc = clamp(0.5 * amp + 0.5 * diffVar, 0, 1);
            }

            // --- 4. Tstab = NormalizedStabilizationTime ---
            let stabilizationTick = timeSeriesQ.length;
            for (let i = 0; i < timeSeriesQ.length - 10; i++) {
              const window = timeSeriesQ.slice(i);
              const wMax = Math.max(...window);
              const wMin = Math.min(...window);
              const wMean = window.reduce((a,b)=>a+b,0) / window.length;
              if ((wMax - wMin) / (wMean + 0.1) < 0.2) {
                stabilizationTick = i;
                break;
              }
            }
            const Tstab = clamp(stabilizationTick / timeSeriesQ.length, 0, 1);

            // --- StabilityScore ---
            const stability = 1.0 * S - 0.5 * Vq - 0.7 * Aosc - 0.3 * Tstab;
            
            stabilityScores.push(stability);
            sumVq += Vq;
            sumAosc += Aosc;
            sumTstab += Tstab;
          }

          // Aggregation
          const meanStability = stabilityScores.reduce((a,b)=>a+b,0) / numSeeds;
          const stdStability = Math.sqrt(stabilityScores.reduce((a,b)=>a+Math.pow(b-meanStability,2),0) / numSeeds);
          const crashRate = crashes / numSeeds;
          
          // Stable Region Criteria
          const isStableRegion = (meanStability > 0.6 && crashRate < 0.1 && stdStability < 0.1) ? 1 : 0;

          csvData.push(`${numNodes},${expRate.toFixed(2)},${damping.toFixed(2)},${meanStability.toFixed(4)},${stdStability.toFixed(4)},${crashRate.toFixed(2)},${(sumVq/numSeeds).toFixed(4)},${(sumAosc/numSeeds).toFixed(4)},${(sumTstab/numSeeds).toFixed(4)},${isStableRegion}`);
        }
      }
    }

    const outPath = path.join(__dirname, "../../../artifacts/analytics/robust_stability_map.csv");
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, csvData.join("\n"), "utf-8");
    console.log(`Successfully generated robust stability data to: ${outPath}`);
  }, 300000); // 5 min timeout
});
