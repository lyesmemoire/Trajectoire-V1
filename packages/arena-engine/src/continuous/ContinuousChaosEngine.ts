import { IRandomProvider } from "../ports/IInfra";

export class ContinuousChaosEngine {
  constructor(private readonly random: IRandomProvider) {}

  /**
   * Generate random chaotic injection rates for the current tick.
   * The rates are bounded to keep the system stable.
   */
  inject() {
    return {
      dropRate: this.random.next() * 0.05, // up to 5% drop
      reorderRate: this.random.next() * 0.03, // up to 3% reorder
      corruptionRate: this.random.next() * 0.01, // up to 1% payload corruption
    };
  }
}
