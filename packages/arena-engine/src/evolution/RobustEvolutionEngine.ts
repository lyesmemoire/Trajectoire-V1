import { PolicyGenome, EvolutionConfig, FitnessResult, RiskStrategyType } from "./types";
import { MultiWorldSimulator } from "../../tests/helpers/MultiWorldSimulator";
import { FakeRandom } from "../testing/FakeInfra";
import { IRandomProvider } from "../ports/IInfra";
import { PolicyEvolutionEngine, WorldFactory, FitnessExtractor } from "./PolicyEvolutionEngine";

export type EnvironmentSetup = (simulator: MultiWorldSimulator) => void;
export type SimulatorFactory = (seed: number) => MultiWorldSimulator;
export type RobustWorldFactory = (simulator: MultiWorldSimulator) => WorldFactory;

function simpleHash(str: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

export function aggregateRisk(scores: number[], strategy: RiskStrategyType): number {
  if (scores.length === 0) return 0;
  const sorted = [...scores].sort((a, b) => a - b); // Ascending (worst to best)
  
  if (strategy === "WORST_CASE") return sorted[0];
  if (strategy === "EXPECTED_VALUE") return sorted.reduce((a, b) => a + b, 0) / sorted.length;
  
  if (strategy.startsWith("CVAR_")) {
    const percent = parseInt(strategy.split("_")[1], 10) / 100;
    let count = Math.floor(sorted.length * percent);
    if (count < 1) count = 1;
    const worst = sorted.slice(0, count);
    return worst.reduce((a, b) => a + b, 0) / count;
  }
  
  return sorted[0];
}

/**
 * RobustEvolutionEngine — Extension of the GA for Risk-Sensitive Optimization.
 * It evaluates each genome against multiple adversarial environments
 * and aggregates the fitness distribution using a specified risk strategy (e.g. CVaR).
 */
export class RobustEvolutionEngine {
  constructor(
    private readonly baseEngine: PolicyEvolutionEngine,
    private readonly simulatorFactory: SimulatorFactory,
    private readonly environments: EnvironmentSetup[],
    private readonly random: IRandomProvider,
    private readonly worldFactoryBuilder: RobustWorldFactory,
    private readonly fitnessExtractor: FitnessExtractor
  ) {}

  public evaluateRobustGenomeBatch(
    genomes: PolicyGenome[],
    config: EvolutionConfig
  ): FitnessResult[] {
    const allScores: number[][] = Array.from({ length: genomes.length }, () => []);
    const envMetrics: Record<string, number>[][] = Array.from({ length: genomes.length }, () => []);

    for (let envIndex = 0; envIndex < this.environments.length; envIndex++) {
      const setup = this.environments[envIndex];
      
      // 1. Independent clean simulator for this specific environment/chaos profile
      const envSeed = simpleHash(`${config.seed}-env-${envIndex}`);
      const envSimulator = this.simulatorFactory(envSeed);
      setup(envSimulator);

      // 2. Temporary base engine just for batch evaluation in this simulator
      const batchEngine = new PolicyEvolutionEngine(
        this.random,
        envSimulator,
        this.worldFactoryBuilder(envSimulator),
        this.fitnessExtractor
      );

      // 3. Evaluate the entire batch under this environment
      const results = batchEngine.evaluateGenomeBatch(genomes, config);

      // 4. Record fitness and metrics
      for (let i = 0; i < genomes.length; i++) {
        allScores[i].push(results[i].score);
        envMetrics[i].push(results[i].metrics);
      }
    }

    const strategy = config.riskStrategy ?? "WORST_CASE";

    return genomes.map((g, i) => {
      const riskAdjustedScore = aggregateRisk(allScores[i], strategy);
      
      // Find a representative metric from the worst runs for standard reporting,
      // but expose everything in _envMetrics for deep analysis.
      // We just take the metrics of the absolute worst case as base metrics for simplicity.
      const worstIndex = allScores[i].indexOf(Math.min(...allScores[i]));
      const repMetrics = envMetrics[i][worstIndex] ?? {};

      return {
        genome: g,
        score: riskAdjustedScore,
        metrics: {
          ...repMetrics,
          _envMetrics: envMetrics[i] as any,
          _allScores: allScores[i] as any,
        }
      };
    });
  }

  public run(config: EvolutionConfig, parameterBounds: Record<string, { min: number; max: number }>): PolicyGenome {
    let population = this.baseEngine.initializePopulation(config.populationSize, parameterBounds);
    
    // Global seed for evolution operators
    const evolutionSeed = simpleHash(config.seed + "robust-evolution");
    const evoRandom = new FakeRandom(evolutionSeed);
    const strategy = config.riskStrategy ?? "WORST_CASE";

    for (let gen = 0; gen < config.generations; gen++) {
      // 1. Evaluate robustly across all environments with Risk Strategy
      const evaluated = this.evaluateRobustGenomeBatch(population, config);

      // 2. Sort by risk-adjusted score descending
      evaluated.sort((a, b) => b.score - a.score);
      
      console.log(`[Robust Gen ${gen} | ${strategy}] Best Risk-Adjusted Score: ${evaluated[0].score.toFixed(4)}`);

      if (gen === config.generations - 1) {
        return evaluated[0].genome;
      }

      // 3. Elitism
      const newPopulation: PolicyGenome[] = [];
      for (let i = 0; i < config.eliteCount; i++) {
        newPopulation.push(JSON.parse(JSON.stringify(evaluated[i].genome)));
      }

      // 4 & 5. Crossover and Mutation
      while (newPopulation.length < config.populationSize) {
        const parentA = this.baseEngine.tournamentSelection(evaluated, 3, evoRandom).genome;
        const parentB = this.baseEngine.tournamentSelection(evaluated, 3, evoRandom).genome;
        
        let child = this.baseEngine.crossover(parentA, parentB, config.crossoverRate, evoRandom);
        child = this.baseEngine.mutate(child, parameterBounds, config.mutationRate, evoRandom);
        
        newPopulation.push(child);
      }

      population = newPopulation;
    }

    return population[0];
  }
}
