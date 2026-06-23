import { describe, it, expect } from "vitest";
import { PolicyEvolutionEngine, WorldFactory, FitnessExtractor } from "../../src/evolution/PolicyEvolutionEngine";
import { MultiWorldSimulator, SimulatedWorld } from "../helpers/MultiWorldSimulator";
import { EvolutionConfig, PolicyGenome } from "../../src/evolution/types";
import { FakeInfra, FakeRandom } from "../../src/testing/FakeInfra";

// Mock Engine for Genetic Evaluation
class GeneticMockEngine {
  public ticks = 0;
  public stateScore = 0;

  constructor(private infra: FakeInfra, private genome: PolicyGenome) {}

  start() {
    this.infra.timer.setInterval(() => {
      this.ticks++;
      // The fitness changes depending on the genome parameters and chaotic entropy!
      const entropy = this.infra.random.next(); // Use world entropy
      
      const threshold = this.genome.parameters['threshold'];
      const weight = this.genome.parameters['weight'];

      if (entropy > threshold) {
        this.stateScore += weight;
      } else {
        this.stateScore -= weight * 0.5;
      }
    }, 100);
  }

  serialize(): any { return { ticks: this.ticks, stateScore: this.stateScore }; }
  restore(s: any): void { this.ticks = s.ticks; this.stateScore = s.stateScore; }
  rehydrate(): void {
    const now = this.infra.clock.now();
    let offset = 100 - (now % 100);
    if (offset === 0) offset = 100;
    this.infra.timer.setTimeout(() => {
      this.ticks++;
      const entropy = this.infra.random.next();
      const threshold = this.genome.parameters['threshold'];
      const weight = this.genome.parameters['weight'];
      if (entropy > threshold) this.stateScore += weight;
      else this.stateScore -= weight * 0.5;
      this.start();
    }, offset);
  }
}

describe("Policy Evolution Engine", () => {
  const baseConfig: EvolutionConfig = {
    populationSize: 50,
    generations: 5,
    mutationRate: 0.1,
    crossoverRate: 0.7,
    eliteCount: 2,
    baseSnapshot: {
      logicalTime: 1000,
      randomState: 1337,
      stateStore: { ticks: 0, stateScore: 0 },
      controlPlaneState: {}
    },
    simulationDurationMs: 5000, // 5 seconds = 50 ticks
    seed: 42
  };

  const bounds = {
    threshold: { min: 0, max: 1 },
    weight: { min: 1, max: 10 }
  };

  const worldFactory: WorldFactory = (id: number, infra: FakeInfra, genome: PolicyGenome): SimulatedWorld => {
    const engine = new GeneticMockEngine(infra, genome);
    return {
      id,
      infra,
      engine,
      nextExecutionTime: null,
      serialize() {
        return {
          logicalTime: this.infra.clock.now(),
          randomState: this.infra.random.getInternalState(),
          stateStore: this.engine.serialize(),
          controlPlaneState: {}
        };
      },
      restore(s) { this.engine.restore(s.stateStore); },
      rehydrate() { this.engine.rehydrate(); }
    };
  };

  const fitnessExtractor: FitnessExtractor = (world: SimulatedWorld) => {
    return {
      score: world.engine.stateScore,
      metrics: { ticks: world.engine.ticks }
    };
  };

  it("produces identical evolution with same seed", () => {
    const engine1 = new PolicyEvolutionEngine(new FakeRandom(100), new MultiWorldSimulator(), worldFactory, fitnessExtractor);
    const engine2 = new PolicyEvolutionEngine(new FakeRandom(100), new MultiWorldSimulator(), worldFactory, fitnessExtractor);

    const result1 = engine1.run({ ...baseConfig }, bounds);
    const result2 = engine2.run({ ...baseConfig }, bounds);

    expect(result1.parameters).toEqual(result2.parameters);
  });

  it("produces different result with different seed", () => {
    const engine1 = new PolicyEvolutionEngine(new FakeRandom(100), new MultiWorldSimulator(), worldFactory, fitnessExtractor);
    const engine2 = new PolicyEvolutionEngine(new FakeRandom(999), new MultiWorldSimulator(), worldFactory, fitnessExtractor);

    const result1 = engine1.run({ ...baseConfig, seed: 100 }, bounds);
    const result2 = engine2.run({ ...baseConfig, seed: 999 }, bounds);

    expect(result1.parameters).not.toEqual(result2.parameters);
  });

  it("evaluation order does not change results", () => {
    const engine = new PolicyEvolutionEngine(new FakeRandom(100), new MultiWorldSimulator(), worldFactory, fitnessExtractor);
    
    // Evaluate 5 random genomes
    const genomes: PolicyGenome[] = Array.from({length: 5}, (_, i) => ({ version: 1, parameters: { threshold: i * 0.2, weight: i * 2 } }));
    
    // Evaluate ordered
    const resultsOrdered = engine.evaluateGenomeBatch(genomes, baseConfig);
    
    // Evaluate shuffled
    const shuffledGenomes = [...genomes].reverse();
    const resultsShuffled = engine.evaluateGenomeBatch(shuffledGenomes, baseConfig);

    // Sort both by score
    resultsOrdered.sort((a, b) => b.score - a.score);
    resultsShuffled.sort((a, b) => b.score - a.score);

    for (let i = 0; i < genomes.length; i++) {
      expect(resultsOrdered[i].score).toBe(resultsShuffled[i].score);
      expect(resultsOrdered[i].genome.parameters).toEqual(resultsShuffled[i].genome.parameters);
    }
  });

  it("scales to 1000 individuals over 10 generations (Performance)", () => {
    const perfConfig: EvolutionConfig = {
      ...baseConfig,
      populationSize: 1000,
      generations: 10,
    };
    
    const simulator = new MultiWorldSimulator();
    const engine = new PolicyEvolutionEngine(new FakeRandom(42), simulator, worldFactory, fitnessExtractor);
    
    const start = performance.now();
    const bestGenome = engine.run(perfConfig, bounds);
    const wallMs = performance.now() - start;

    console.log(`[1000 pop x 10 gen] WallMs: ${wallMs.toFixed(2)}ms, Total Simulated Events: ${simulator.stats.eventsProcessed}`);
    
    expect(wallMs).toBeLessThan(10000); // Should be very fast (usually ~1-2 sec)
    expect(bestGenome).toBeDefined();
    
    // On 10 generations, total evaluations = 10 * 1000 = 10000. 
    // Each evaluateGenomeBatch resets simulator events.
    // However, the test proves it completes in a few seconds.
  });
});
