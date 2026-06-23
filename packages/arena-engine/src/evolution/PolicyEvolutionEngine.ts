import { PolicyGenome, EvolutionConfig, FitnessResult } from "./types";
import { MultiWorldSimulator, SimulatedWorld } from "../../tests/helpers/MultiWorldSimulator";
import { FakeInfra, FakeRandom } from "../testing/FakeInfra";
import { IRandomProvider } from "../ports/IInfra";

export type WorldFactory = (id: number, infra: FakeInfra, genome: PolicyGenome) => SimulatedWorld;
export type FitnessExtractor = (world: SimulatedWorld) => { score: number; metrics: Record<string, number> };

function simpleHash(str: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

export class PolicyEvolutionEngine {
  constructor(
    private readonly random: IRandomProvider,
    private readonly simulator: MultiWorldSimulator,
    private readonly worldFactory: WorldFactory,
    private readonly fitnessExtractor: FitnessExtractor
  ) {}

  public evaluateGenomeBatch(
    genomes: PolicyGenome[],
    config: EvolutionConfig
  ): FitnessResult[] {
    // Nettoyer le simulateur pour un run propre
    this.simulator.worlds = [];
    this.simulator.stats.eventsProcessed = 0;
    this.simulator.stats.wallClockMs = 0;

    // Dériver une seed locale pour les mondes de cette génération
    // On utilise la config.seed de base, combinée pour éviter toute fuite.
    // Mais attendez, si on lance plusieurs générations, on veut que chaque génération 
    // utilise la même seed pour évaluer, ou une différente ? 
    // Le plus robuste pour la comparaison (élitisme) est d'utiliser la MÊME seed d'évaluation 
    // à chaque fois pour que la fitness soit purement déterministe et dépendante du génome seul.
    const evaluationSeed = config.seed; 

    const createdWorlds: SimulatedWorld[] = [];

    // 1. Fork snapshot N fois et inject genome
    for (let i = 0; i < genomes.length; i++) {
      const genome = genomes[i];
      const worldSeed = simpleHash(`${evaluationSeed}-world-${i}`);
      
      const infra = new FakeInfra(worldSeed);
      infra.clock.setTime(config.baseSnapshot.logicalTime);
      infra.random.setInternalState(config.baseSnapshot.randomState);
      
      const newWorld = this.worldFactory(i, infra, genome);

      if (typeof newWorld.restore === "function") {
        newWorld.restore(config.baseSnapshot);
      } else {
        if (newWorld.engine.stateStore) newWorld.engine.stateStore.restore(config.baseSnapshot.stateStore);
        if (newWorld.engine.controlPlane) newWorld.engine.controlPlane.restore(config.baseSnapshot.controlPlaneState);
      }

      if (typeof newWorld.rehydrate === "function") {
        newWorld.rehydrate();
      } else {
        if (newWorld.engine.controlPlane) newWorld.engine.controlPlane.rehydrate();
      }

      this.simulator.addWorld(newWorld);
      createdWorlds.push(newWorld);
    }

    // 2. Simulation Batch $O(E \log W)$
    this.simulator.runUntil(config.baseSnapshot.logicalTime + config.simulationDurationMs);

    // 3. Extraire FitnessResult
    const results: FitnessResult[] = [];
    for (let i = 0; i < genomes.length; i++) {
      const w = createdWorlds[i];
      const extracted = this.fitnessExtractor(w);
      results.push({
        genome: genomes[i],
        score: extracted.score,
        metrics: extracted.metrics,
      });
    }

    return results;
  }

  public run(config: EvolutionConfig, parameterBounds: Record<string, { min: number; max: number }>): PolicyGenome {
    let population = this.initializePopulation(config.populationSize, parameterBounds);
    
    // Le seed global pour l'évolution
    const evolutionSeed = simpleHash(config.seed + "evolution");
    const evoRandom = new FakeRandom(evolutionSeed);

    for (let gen = 0; gen < config.generations; gen++) {
      // 1. Évaluer
      const evaluated = this.evaluateGenomeBatch(population, config);

      // 2. Trier par score décroissant
      evaluated.sort((a, b) => b.score - a.score);
      
      console.log(`[Generation ${gen}] Best Score: ${evaluated[0].score.toFixed(4)}`);

      if (gen === config.generations - 1) {
        return evaluated[0].genome;
      }

      // 3. Sélection Élitiste
      const newPopulation: PolicyGenome[] = [];
      for (let i = 0; i < config.eliteCount; i++) {
        // Deep clone pour ne pas muter l'élite
        newPopulation.push(JSON.parse(JSON.stringify(evaluated[i].genome)));
      }

      // 4 & 5. Reproduction et Mutation
      while (newPopulation.length < config.populationSize) {
        const parentA = this.tournamentSelection(evaluated, 3, evoRandom).genome;
        const parentB = this.tournamentSelection(evaluated, 3, evoRandom).genome;
        
        let child = this.crossover(parentA, parentB, config.crossoverRate, evoRandom);
        child = this.mutate(child, parameterBounds, config.mutationRate, evoRandom);
        
        newPopulation.push(child);
      }

      population = newPopulation;
    }

    return population[0];
  }

  public initializePopulation(size: number, bounds: Record<string, { min: number; max: number }>): PolicyGenome[] {
    const pop: PolicyGenome[] = [];
    for (let i = 0; i < size; i++) {
      const parameters: Record<string, number> = {};
      for (const [key, bound] of Object.entries(bounds)) {
        // Init aléatoire contrôlé par le RandomProvider global de l'engine (ou on peut utiliser le FakeRandom d'évolution)
        // Wait, on utilise this.random pour la seed de départ
        parameters[key] = bound.min + this.random.next() * (bound.max - bound.min);
      }
      pop.push({ version: 1, parameters });
    }
    return pop;
  }

  public tournamentSelection(population: FitnessResult[], k: number, random: IRandomProvider): FitnessResult {
    let best: FitnessResult | null = null;
    for (let i = 0; i < k; i++) {
      const index = Math.floor(random.next() * population.length);
      const candidate = population[index];
      if (!best || candidate.score > best.score) {
        best = candidate;
      }
    }
    return best!;
  }

  public crossover(parentA: PolicyGenome, parentB: PolicyGenome, rate: number, random: IRandomProvider): PolicyGenome {
    if (random.next() > rate) return JSON.parse(JSON.stringify(parentA));

    const childParams: Record<string, number> = {};
    for (const key of Object.keys(parentA.parameters)) {
      // Uniform crossover
      childParams[key] = random.next() > 0.5 ? parentA.parameters[key] : parentB.parameters[key];
    }
    return { version: 1, parameters: childParams };
  }

  public mutate(
    genome: PolicyGenome,
    bounds: Record<string, { min: number; max: number }>,
    rate: number,
    random: IRandomProvider
  ): PolicyGenome {
    const newParams: Record<string, number> = {};
    for (const [key, value] of Object.entries(genome.parameters)) {
      if (random.next() < rate) {
        // Gaussian-like mutation (simple random walk)
        const range = bounds[key].max - bounds[key].min;
        const delta = (random.next() - 0.5) * range * 0.2; // max 20% shift
        let newVal = value + delta;
        if (newVal < bounds[key].min) newVal = bounds[key].min;
        if (newVal > bounds[key].max) newVal = bounds[key].max;
        newParams[key] = newVal;
      } else {
        newParams[key] = value;
      }
    }
    return { version: 1, parameters: newParams };
  }
}
