/**
 * Blueprint DSL CVM Branch Predictor
 * 
 * Predicts branch directions for improved performance.
 */

import { ExecutionContext } from './execution-context';

export enum Prediction {
  TAKEN = 'TAKEN',
  NOT_TAKEN = 'NOT_TAKEN',
}

export interface BranchPrediction {
  address: number;
  prediction: Prediction;
  confidence: number;
}

export interface BranchStatistics {
  totalBranches: number;
  correctPredictions: number;
  incorrectPredictions: number;
  accuracy: number;
}

export class BranchPredictor {
  private context: ExecutionContext;
  private history: Map<number, BranchPrediction> = new Map();
  private statistics: BranchStatistics;
  private saturationCounter: number = 2;

  constructor(context: ExecutionContext) {
    this.context = context;
    this.statistics = this.initializeStatistics();
  }

  /**
   * Initialize statistics
   */
  private initializeStatistics(): BranchStatistics {
    return {
      totalBranches: 0,
      correctPredictions: 0,
      incorrectPredictions: 0,
      accuracy: 0,
    };
  }

  /**
   * Predict branch direction
   */
  public predict(address: number): Prediction {
    const historyEntry = this.history.get(address);

    if (!historyEntry) {
      // Default prediction: not taken
      return Prediction.NOT_TAKEN;
    }

    return historyEntry.prediction;
  }

  /**
   * Update prediction based on actual outcome
   */
  public update(address: number, taken: boolean): void {
    const actual = taken ? Prediction.TAKEN : Prediction.NOT_TAKEN;
    const predicted = this.predict(address);

    this.statistics.totalBranches++;

    if (predicted === actual) {
      this.statistics.correctPredictions++;
      this.increaseConfidence(address);
    } else {
      this.statistics.incorrectPredictions++;
      this.decreaseConfidence(address);
    }

    // Update history
    const historyEntry: BranchPrediction = {
      address,
      prediction: actual,
      confidence: this.history.get(address)?.confidence || 0,
    };

    this.history.set(address, historyEntry);

    // Update accuracy
    this.statistics.accuracy = this.statistics.correctPredictions / this.statistics.totalBranches;
  }

  /**
   * Increase confidence for prediction
   */
  private increaseConfidence(address: number): void {
    const entry = this.history.get(address);

    if (!entry) {
      this.history.set(address, {
        address,
        prediction: Prediction.NOT_TAKEN,
        confidence: 1,
      });
      return;
    }

    entry.confidence = Math.min(entry.confidence + 1, this.saturationCounter);
  }

  /**
   * Decrease confidence for prediction
   */
  private decreaseConfidence(address: number): void {
    const entry = this.history.get(address);

    if (!entry) {
      return;
    }

    entry.confidence = Math.max(entry.confidence - 1, 0);

    // Flip prediction if confidence is low
    if (entry.confidence === 0) {
      entry.prediction = entry.prediction === Prediction.TAKEN ? Prediction.NOT_TAKEN : Prediction.TAKEN;
      entry.confidence = 1;
    }
  }

  /**
   * Get prediction confidence
   */
  public getConfidence(address: number): number {
    const entry = this.history.get(address);
    return entry ? entry.confidence : 0;
  }

  /**
   * Get branch statistics
   */
  public getStatistics(): BranchStatistics {
    return { ...this.statistics };
  }

  /**
   * Clear prediction history
   */
  public clearHistory(): void {
    this.history.clear();
    this.statistics = this.initializeStatistics();
  }

  /**
   * Get prediction history
   */
  public getHistory(): Map<number, BranchPrediction> {
    return new Map(this.history);
  }

  /**
   * Set saturation counter
   */
  public setSaturationCounter(value: number): void {
    this.saturationCounter = value;
  }

  /**
   * Get saturation counter
   */
  public getSaturationCounter(): number {
    return this.saturationCounter;
  }

  /**
   * Validate predictor state
   */
  public validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    for (const [address, entry] of this.history) {
      if (entry.address !== address) {
        errors.push(`History entry address mismatch at ${address}`);
      }

      if (entry.confidence < 0 || entry.confidence > this.saturationCounter) {
        errors.push(`Invalid confidence at ${address}`);
      }
    }

    if (this.statistics.totalBranches < this.statistics.correctPredictions + this.statistics.incorrectPredictions) {
      errors.push('Statistics inconsistency');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Set execution context
   */
  public setContext(context: ExecutionContext): void {
    this.context = context;
  }

  /**
   * Get execution context
   */
  public getContext(): ExecutionContext {
    return this.context;
  }
}
