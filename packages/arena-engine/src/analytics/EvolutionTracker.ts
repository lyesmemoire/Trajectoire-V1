import * as fs from "fs";
import * as path from "path";
import { PolicyGenome, ChaosGenome } from "../evolution/types";

export interface GenerationMetrics {
  generation: number;
  
  // Policy Metrics
  policyBestScore: number;
  policyAvgScore: number;
  policyScoreVariance: number;
  policyCentroid: Record<string, number>;
  
  // Chaos Metrics
  chaosBestScore: number;
  chaosAvgScore: number;
  chaosScoreVariance: number;
  chaosAvgCost: number;
  chaosCentroid: Record<string, number>;
}

export class EvolutionTracker {
  private fileDescriptor: number | null = null;
  private filePath: string;

  constructor(experimentName: string) {
    const dir = path.join(process.cwd(), "artifacts", "analytics");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Create a unique file based on experiment name and timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    this.filePath = path.join(dir, `${experimentName}_${timestamp}.jsonl`);
    this.fileDescriptor = fs.openSync(this.filePath, "w");
  }

  public recordGeneration(metrics: GenerationMetrics) {
    if (this.fileDescriptor !== null) {
      fs.writeSync(this.fileDescriptor, JSON.stringify(metrics) + "\n");
    }
  }

  public close() {
    if (this.fileDescriptor !== null) {
      fs.closeSync(this.fileDescriptor);
      this.fileDescriptor = null;
    }
  }

  public getFilePath(): string {
    return this.filePath;
  }
}

// Utility to calculate centroid of a population's parameters
export function calculateCentroid(population: { parameters: Record<string, number> }[]): Record<string, number> {
  const centroid: Record<string, number> = {};
  if (population.length === 0) return centroid;
  
  const keys = Object.keys(population[0].parameters);
  for (const key of keys) {
    centroid[key] = 0;
  }
  
  for (const ind of population) {
    for (const key of keys) {
      centroid[key] += ind.parameters[key];
    }
  }
  
  for (const key of keys) {
    centroid[key] /= population.length;
  }
  
  return centroid;
}

export function calculateVariance(scores: number[], mean: number): number {
  if (scores.length === 0) return 0;
  return scores.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / scores.length;
}
