import { PolicyGenome, ChaosGenome, AdversarialEvolutionConfig, FitnessResult } from "./types";
import { MultiWorldSimulator } from "../../tests/helpers/MultiWorldSimulator";
import { FakeRandom } from "../testing/FakeInfra";
import { IRandomProvider } from "../ports/IInfra";
import { PolicyEvolutionEngine, WorldFactory, FitnessExtractor } from "./PolicyEvolutionEngine";
import { aggregateRisk } from "./RobustEvolutionEngine";

export type AdversarialSimulatorFactory = (seed: number, chaos: ChaosGenome) => MultiWorldSimulator;

export interface ChaosFitnessResult {
  genome: ChaosGenome;
  score: number;
}

export class AdversarialEvolutionEngine {
  constructor(
    private readonly baseEngine: PolicyEvolutionEngine,
    private readonly simulatorFactory: AdversarialSimulatorFactory,
    private readonly random: IRandomProvider,
    private readonly worldFactoryBuilder: (simulator: MultiWorldSimulator) => WorldFactory,
    private readonly fitnessExtractor: FitnessExtractor
  ) {}

  public calculateChaosCost(chaos: ChaosGenome): number {
    const { dropRate, reorderRate, duplicationRate, maxJitterMs, partitionDurationRatio } = chaos.parameters;
    
    // Normalize jitter assuming max possible is ~200ms
    const normalizedJitter = Math.min(1.0, maxJitterMs / 200.0);
    
    // Quadratic cost penalizes extreme brute-force intensity
    // but allows combinations of fine-grained attacks
    return (
      Math.pow(dropRate, 2) +
      Math.pow(reorderRate, 2) +
      Math.pow(duplicationRate, 2) +
      Math.pow(partitionDurationRatio, 2) +
      Math.pow(normalizedJitter, 2)
    );
  }

  public run(
    config: AdversarialEvolutionConfig,
    policyBounds: Record<string, { min: number; max: number }>,
    chaosBounds: Record<string, { min: number; max: number }>,
    tracker?: any // EvolutionTracker type
  ): { bestPolicy: PolicyGenome; bestChaos: ChaosGenome } {
    
    // 1. Initialize populations
    let policyPopulation = this.baseEngine.initializePopulation(config.populationSize, policyBounds);
    let chaosPopulation = this.initChaosPopulation(config.chaosPopulationSize, chaosBounds);
    
    const evolutionSeed = this.simpleHash(config.seed + "adversarial");
    const evoRandom = new FakeRandom(evolutionSeed);

    for (let gen = 0; gen < config.generations; gen++) {
      // Scores matrix: rows = policies, cols = chaos
      const policyScores: number[][] = Array.from({ length: config.populationSize }, () => []);
      const chaosScores: number[][] = Array.from({ length: config.chaosPopulationSize }, () => []);

      const baseMaxScore = 1000; // Expected max score for baseline normalization of impact

      // 2. Cross-Evaluation (Bipartite NxM Tournament)
      for (let c = 0; c < config.chaosPopulationSize; c++) {
        const chaos = chaosPopulation[c];
        const chaosCost = this.calculateChaosCost(chaos);

        // Run the entire policy batch against this specific chaos genome
        const envSeed = this.simpleHash(`${config.seed}-gen${gen}-chaos${c}`);
        const sim = this.simulatorFactory(envSeed, chaos);
        
        const batchEngine = new PolicyEvolutionEngine(
          this.random,
          sim,
          this.worldFactoryBuilder(sim),
          this.fitnessExtractor
        );

        const results = batchEngine.evaluateGenomeBatch(policyPopulation, config);

        // Record results
        for (let p = 0; p < config.populationSize; p++) {
          const policyScore = results[p].score;
          policyScores[p].push(policyScore);
          
          // Adversarial Chaos Fitness: Damage done minus budget cost
          // Damage is (MaxPossibleScore - PolicyScore) -> we want to maximize this damage
          const damage = Math.max(0, baseMaxScore - policyScore);
          const rawChaosFitness = damage - config.chaosCostLambda * baseMaxScore * chaosCost;
          chaosScores[c].push(rawChaosFitness);
        }
      }

      // 3. Aggregate Fitness
      const policyFitness = policyPopulation.map((g, p) => ({
        genome: g,
        score: aggregateRisk(policyScores[p], config.riskStrategy ?? "CVAR_30"),
      }));

      const chaosFitness = chaosPopulation.map((g, c) => ({
        genome: g,
        // Chaos aggregates its expected value (average damage across all policies)
        score: chaosScores[c].reduce((a, b) => a + b, 0) / chaosScores[c].length,
      }));

      // Sort both
      policyFitness.sort((a, b) => b.score - a.score);
      chaosFitness.sort((a, b) => b.score - a.score);

      const bestP = policyFitness[0];
      const bestC = chaosFitness[0];

      console.log(`[Gen ${gen}] Best Policy Score: ${bestP.score.toFixed(2)} | Best Chaos Score: ${bestC.score.toFixed(2)} (Cost: ${this.calculateChaosCost(bestC.genome).toFixed(3)})`);

      if (tracker) {
        const pScores = policyFitness.map(p => p.score);
        const cScores = chaosFitness.map(c => c.score);
        
        // Compute centroids dynamically (we don't have calculateCentroid imported here, so we do it inline)
        const pCentroid: any = {};
        if (policyPopulation.length > 0) {
          const keys = Object.keys(policyPopulation[0].parameters);
          for (const k of keys) pCentroid[k] = 0;
          for (const p of policyPopulation) {
            for (const k of keys) pCentroid[k] += p.parameters[k];
          }
          for (const k of keys) pCentroid[k] /= policyPopulation.length;
        }
        
        const cCentroid: any = {};
        if (chaosPopulation.length > 0) {
          const keys = Object.keys(chaosPopulation[0].parameters);
          for (const k of keys) cCentroid[k] = 0;
          for (const c of chaosPopulation) {
            for (const k of keys) cCentroid[k] += (c.parameters as any)[k];
          }
          for (const k of keys) cCentroid[k] /= chaosPopulation.length;
        }

        const avgPC = pScores.reduce((a, b) => a + b, 0) / pScores.length;
        const avgCC = cScores.reduce((a, b) => a + b, 0) / cScores.length;
        const varPC = pScores.reduce((a, b) => a + Math.pow(b - avgPC, 2), 0) / pScores.length;
        const varCC = cScores.reduce((a, b) => a + Math.pow(b - avgCC, 2), 0) / cScores.length;

        tracker.recordGeneration({
          generation: gen,
          policyBestScore: bestP.score,
          policyAvgScore: avgPC,
          policyScoreVariance: varPC,
          policyCentroid: pCentroid,
          chaosBestScore: bestC.score,
          chaosAvgScore: avgCC,
          chaosScoreVariance: varCC,
          chaosAvgCost: this.calculateChaosCost(bestC.genome), // For simplicity we track the cost of the best chaos
          chaosCentroid: cCentroid
        });
      }

      if (gen === config.generations - 1) {
        return { bestPolicy: bestP.genome, bestChaos: bestC.genome };
      }

      // 4. Evolve Populations
      policyPopulation = this.evolvePopulation(
        policyFitness, 
        config.populationSize, 
        config.eliteCount, 
        config.crossoverRate, 
        config.mutationRate, 
        policyBounds, 
        evoRandom
      );

      chaosPopulation = this.evolveChaosPopulation(
        chaosFitness,
        config.chaosPopulationSize,
        config.chaosEliteCount,
        config.chaosCrossoverRate,
        config.chaosMutationRate,
        chaosBounds,
        evoRandom
      );
    }

    return { bestPolicy: policyPopulation[0], bestChaos: chaosPopulation[0] };
  }

  // Helper for Policy evolution (extracting logic from existing engine)
  private evolvePopulation(
    population: FitnessResult[],
    size: number,
    eliteCount: number,
    crossoverRate: number,
    mutationRate: number,
    bounds: Record<string, { min: number; max: number }>,
    random: IRandomProvider
  ): PolicyGenome[] {
    const newPop: PolicyGenome[] = [];
    for (let i = 0; i < eliteCount; i++) {
      newPop.push(JSON.parse(JSON.stringify(population[i].genome)));
    }
    while (newPop.length < size) {
      const parentA = this.baseEngine.tournamentSelection(population, 3, random).genome;
      const parentB = this.baseEngine.tournamentSelection(population, 3, random).genome;
      let child = this.baseEngine.crossover(parentA, parentB, crossoverRate, random);
      child = this.baseEngine.mutate(child, bounds, mutationRate, random);
      newPop.push(child);
    }
    return newPop;
  }

  private initChaosPopulation(size: number, bounds: Record<string, { min: number; max: number }>): ChaosGenome[] {
    const pop: ChaosGenome[] = [];
    for (let i = 0; i < size; i++) {
      const params: any = {};
      for (const [key, b] of Object.entries(bounds)) {
        params[key] = b.min + this.random.next() * (b.max - b.min);
      }
      pop.push({ version: 1, parameters: params });
    }
    return pop;
  }

  private evolveChaosPopulation(
    population: ChaosFitnessResult[],
    size: number,
    eliteCount: number,
    crossoverRate: number,
    mutationRate: number,
    bounds: Record<string, { min: number; max: number }>,
    random: IRandomProvider
  ): ChaosGenome[] {
    const newPop: ChaosGenome[] = [];
    for (let i = 0; i < eliteCount; i++) {
      newPop.push(JSON.parse(JSON.stringify(population[i].genome)));
    }
    while (newPop.length < size) {
      const parentA = this.tournamentSelectionChaos(population, 3, random).genome;
      const parentB = this.tournamentSelectionChaos(population, 3, random).genome;
      
      let childParams: any = {};
      for (const key of Object.keys(parentA.parameters)) {
        childParams[key] = random.next() > 0.5 ? (parentA.parameters as any)[key] : (parentB.parameters as any)[key];
      }
      
      let mutatedParams: any = {};
      for (const [key, value] of Object.entries(childParams)) {
        if (random.next() < mutationRate) {
          const range = bounds[key].max - bounds[key].min;
          const delta = (random.next() - 0.5) * range * 0.2;
          let newVal = (value as number) + delta;
          if (newVal < bounds[key].min) newVal = bounds[key].min;
          if (newVal > bounds[key].max) newVal = bounds[key].max;
          mutatedParams[key] = newVal;
        } else {
          mutatedParams[key] = value;
        }
      }
      newPop.push({ version: 1, parameters: mutatedParams });
    }
    return newPop;
  }

  private tournamentSelectionChaos(population: ChaosFitnessResult[], k: number, random: IRandomProvider): ChaosFitnessResult {
    let best: ChaosFitnessResult | null = null;
    for (let i = 0; i < k; i++) {
      const idx = Math.floor(random.next() * population.length);
      const candidate = population[idx];
      if (!best || candidate.score > best.score) best = candidate;
    }
    return best!;
  }

  private simpleHash(str: string): number {
    let h = 0x811c9dc5;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
    return h >>> 0;
  }
}
