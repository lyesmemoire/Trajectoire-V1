import { describe, it, expect, beforeEach } from 'vitest';
import { BranchPredictor, Prediction } from '../../../compiler/cvm/branch-predictor';
import { ExecutionContext } from '../../../compiler/cvm/execution-context';

describe('BranchPredictor', () => {
  let predictor: BranchPredictor;
  let context: ExecutionContext;

  beforeEach(() => {
    context = new ExecutionContext();
    predictor = new BranchPredictor(context);
  });

  describe('creation', () => {
    it('should create branch predictor', () => {
      expect(predictor).toBeDefined();
    });

    it('should initialize with empty history', () => {
      const history = predictor.getHistory();
      expect(history.size).toBe(0);
    });

    it('should initialize with empty statistics', () => {
      const stats = predictor.getStatistics();
      expect(stats.totalBranches).toBe(0);
      expect(stats.correctPredictions).toBe(0);
      expect(stats.incorrectPredictions).toBe(0);
      expect(stats.accuracy).toBe(0);
    });

    it('should initialize with default saturation counter', () => {
      expect(predictor.getSaturationCounter()).toBe(2);
    });
  });

  describe('prediction', () => {
    it('should predict NOT_TAKEN for unknown address', () => {
      const prediction = predictor.predict(100);
      expect(prediction).toBe(Prediction.NOT_TAKEN);
    });

    it('should predict based on history', () => {
      predictor.update(100, true);
      const prediction = predictor.predict(100);
      expect(prediction).toBe(Prediction.TAKEN);
    });

    it('should predict NOT_TAKEN after false branch', () => {
      predictor.update(100, false);
      const prediction = predictor.predict(100);
      expect(prediction).toBe(Prediction.NOT_TAKEN);
    });

    it('should handle multiple addresses', () => {
      predictor.update(100, true);
      predictor.update(200, false);
      expect(predictor.predict(100)).toBe(Prediction.TAKEN);
      expect(predictor.predict(200)).toBe(Prediction.NOT_TAKEN);
    });
  });

  describe('update', () => {
    it('should update statistics on correct prediction', () => {
      predictor.update(100, false);
      const stats = predictor.getStatistics();
      expect(stats.totalBranches).toBe(1);
      expect(stats.correctPredictions).toBe(1);
      expect(stats.incorrectPredictions).toBe(0);
    });

    it('should update statistics on incorrect prediction', () => {
      predictor.update(100, true);
      predictor.update(100, false);
      const stats = predictor.getStatistics();
      expect(stats.totalBranches).toBe(2);
      // First prediction (NOT_TAKEN) was incorrect for true, second was incorrect for false
      expect(stats.correctPredictions).toBe(0);
      expect(stats.incorrectPredictions).toBe(2);
    });

    it('should update accuracy', () => {
      predictor.update(100, true);
      predictor.update(100, true);
      const stats = predictor.getStatistics();
      // First prediction was incorrect (NOT_TAKEN vs TAKEN), second was correct
      expect(stats.accuracy).toBe(0.5);
    });

    it('should update history', () => {
      predictor.update(100, true);
      const history = predictor.getHistory();
      expect(history.has(100)).toBe(true);
      expect(history.get(100)?.prediction).toBe(Prediction.TAKEN);
    });

    it('should increase confidence on correct prediction', () => {
      predictor.update(100, true);
      predictor.update(100, true);
      const confidence = predictor.getConfidence(100);
      expect(confidence).toBeGreaterThan(0);
    });

    it('should decrease confidence on incorrect prediction', () => {
      predictor.update(100, true);
      predictor.update(100, false);
      const confidence = predictor.getConfidence(100);
      expect(confidence).toBeLessThan(2);
    });

    it('should flip prediction when confidence reaches zero', () => {
      predictor.setSaturationCounter(1);
      predictor.update(100, true);
      predictor.update(100, false);
      const prediction = predictor.predict(100);
      expect(prediction).toBe(Prediction.NOT_TAKEN);
    });
  });

  describe('confidence', () => {
    it('should get confidence for known address', () => {
      predictor.update(100, true);
      predictor.update(100, true);
      const confidence = predictor.getConfidence(100);
      // Confidence increases after correct predictions
      expect(confidence).toBeGreaterThan(0);
    });

    it('should return 0 for unknown address', () => {
      const confidence = predictor.getConfidence(100);
      expect(confidence).toBe(0);
    });

    it('should saturate at maximum confidence', () => {
      predictor.setSaturationCounter(3);
      predictor.update(100, true);
      predictor.update(100, true);
      predictor.update(100, true);
      predictor.update(100, true);
      const confidence = predictor.getConfidence(100);
      expect(confidence).toBe(3);
    });

    it('should not go below zero', () => {
      predictor.update(100, true);
      predictor.update(100, false);
      predictor.update(100, false);
      const confidence = predictor.getConfidence(100);
      expect(confidence).toBeGreaterThanOrEqual(0);
    });
  });

  describe('saturation counter', () => {
    it('should set saturation counter', () => {
      predictor.setSaturationCounter(5);
      expect(predictor.getSaturationCounter()).toBe(5);
    });

    it('should get saturation counter', () => {
      const counter = predictor.getSaturationCounter();
      expect(counter).toBe(2);
    });

    it('should respect saturation counter in confidence', () => {
      predictor.setSaturationCounter(1);
      predictor.update(100, true);
      predictor.update(100, true);
      const confidence = predictor.getConfidence(100);
      expect(confidence).toBe(1);
    });
  });

  describe('history', () => {
    it('should clear history', () => {
      predictor.update(100, true);
      predictor.clearHistory();
      const history = predictor.getHistory();
      expect(history.size).toBe(0);
    });

    it('should reset statistics on clear', () => {
      predictor.update(100, true);
      predictor.clearHistory();
      const stats = predictor.getStatistics();
      expect(stats.totalBranches).toBe(0);
    });

    it('should return copy of history', () => {
      predictor.update(100, true);
      const history1 = predictor.getHistory();
      const history2 = predictor.getHistory();
      expect(history1).not.toBe(history2);
      expect(history1.size).toBe(history2.size);
    });
  });

  describe('statistics', () => {
    it('should return copy of statistics', () => {
      predictor.update(100, true);
      const stats1 = predictor.getStatistics();
      const stats2 = predictor.getStatistics();
      expect(stats1).not.toBe(stats2);
      expect(stats1).toEqual(stats2);
    });

    it('should calculate accuracy correctly', () => {
      predictor.update(100, true);
      predictor.update(100, true);
      predictor.update(100, false);
      const stats = predictor.getStatistics();
      // First was incorrect (NOT_TAKEN vs TAKEN), second was correct, third was incorrect
      expect(stats.accuracy).toBeCloseTo(0.333, 2);
    });

    it('should handle zero branches', () => {
      const stats = predictor.getStatistics();
      expect(stats.accuracy).toBe(0);
    });
  });

  describe('validation', () => {
    it('should validate valid state', () => {
      const validation = predictor.validate();
      expect(validation.valid).toBe(true);
      expect(validation.errors).toEqual([]);
    });

    it('should detect address mismatch', () => {
      predictor.update(100, true);
      (predictor as any).history.get(100).address = 200;
      const validation = predictor.validate();
      expect(validation.valid).toBe(false);
      expect(validation.errors).toContain('History entry address mismatch at 100');
    });

    it('should detect invalid confidence', () => {
      predictor.update(100, true);
      (predictor as any).history.get(100).confidence = 10;
      const validation = predictor.validate();
      expect(validation.valid).toBe(false);
      expect(validation.errors).toContain('Invalid confidence at 100');
    });

    it('should detect negative confidence', () => {
      predictor.update(100, true);
      (predictor as any).history.get(100).confidence = -1;
      const validation = predictor.validate();
      expect(validation.valid).toBe(false);
    });

    it('should detect statistics inconsistency', () => {
      (predictor as any).statistics.correctPredictions = 10;
      (predictor as any).statistics.totalBranches = 5;
      const validation = predictor.validate();
      expect(validation.valid).toBe(false);
      expect(validation.errors).toContain('Statistics inconsistency');
    });
  });

  describe('context management', () => {
    it('should set context', () => {
      const newContext = new ExecutionContext();
      predictor.setContext(newContext);
      expect(predictor.getContext()).toBe(newContext);
    });

    it('should get context', () => {
      const retrieved = predictor.getContext();
      expect(retrieved).toBe(context);
    });
  });

  describe('cleanup', () => {
    it('should clean up after operations', () => {
      predictor.update(100, true);
      predictor.update(200, false);
      predictor.clearHistory();
      expect(predictor.getHistory().size).toBe(0);
      const validation = predictor.validate();
      expect(validation.valid).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle same address multiple times', () => {
      predictor.update(100, true);
      predictor.update(100, true);
      predictor.update(100, true);
      const stats = predictor.getStatistics();
      expect(stats.totalBranches).toBe(3);
    });

    it('should handle alternating predictions', () => {
      predictor.update(100, true);
      predictor.update(100, false);
      predictor.update(100, true);
      predictor.update(100, false);
      const stats = predictor.getStatistics();
      expect(stats.totalBranches).toBe(4);
    });

    it('should handle address 0', () => {
      predictor.update(0, true);
      const prediction = predictor.predict(0);
      expect(prediction).toBe(Prediction.TAKEN);
    });

    it('should handle large addresses', () => {
      predictor.update(999999, true);
      const prediction = predictor.predict(999999);
      expect(prediction).toBe(Prediction.TAKEN);
    });
  });
});
