/**
 * Affinity Manager Implementation
 * Manages CPU, GPU, and provider affinity for tasks and workers
 */

import {
  CognitiveTask,
  EngineAffinity,
  AffinityMetrics,
  Worker
} from './types';

export class AffinityManager {
  private workerAffinities: Map<number, EngineAffinity> = new Map();
  private providerAffinities: Map<string, number> = new Map();
  private metrics: AffinityMetrics = {
    affinityHits: 0,
    affinityMisses: 0,
    loadBalance: 1.0
  };
  private workerLoads: Map<number, number> = new Map();

  /**
   * Assign affinity to a task
   */
  async assignAffinity(task: CognitiveTask): Promise<EngineAffinity> {
    // If task already has affinity, respect it
    if (task.affinity) {
      return task.affinity;
    }
    
    // Assign based on provider affinity
    const providerId = this.selectProvider(task);
    
    // Assign CPU affinity for load balancing
    const cpuAffinity = this.selectCPUAffinity();
    
    // Assign GPU affinity if needed
    const gpuAffinity = this.selectGPUAffinity();
    
    const affinity: EngineAffinity = {
      providerAffinity: providerId ? [providerId] : undefined,
      cpuAffinity,
      gpuAffinity
    };
    
    return affinity;
  }

  /**
   * Check if a worker respects the task's affinity requirements
   */
  respectAffinity(task: CognitiveTask, worker: Worker): boolean {
    if (!task.affinity) {
      return true;
    }
    
    let respects = true;
    
    // Check CPU affinity
    if (task.affinity.cpuAffinity && task.affinity.cpuAffinity.length > 0) {
      const workerHasCPU = task.affinity.cpuAffinity.some(cpu => 
        worker.cpuAffinity.includes(cpu)
      );
      if (!workerHasCPU) {
        respects = false;
      }
    }
    
    // Check GPU affinity
    if (task.affinity.gpuAffinity && task.affinity.gpuAffinity.length > 0) {
      const workerHasGPU = task.affinity.gpuAffinity.some(gpu => 
        worker.gpuAffinity.includes(gpu)
      );
      if (!workerHasGPU) {
        respects = false;
      }
    }
    
    // Check provider affinity
    if (task.affinity.providerAffinity && task.affinity.providerAffinity.length > 0) {
      const workerHasProvider = task.affinity.providerAffinity.some(provider =>
        worker.providerAffinity.includes(provider)
      );
      if (!workerHasProvider) {
        respects = false;
      }
    }
    
    if (respects) {
      this.metrics.affinityHits++;
    } else {
      this.metrics.affinityMisses++;
    }
    
    return respects;
  }

  /**
   * Get affinity metrics
   */
  getAffinityMetrics(): AffinityMetrics {
    this.updateLoadBalance();
    return { ...this.metrics };
  }

  /**
   * Register a worker with its affinities
   */
  registerWorker(worker: Worker): void {
    this.workerAffinities.set(worker.id, {
      cpuAffinity: worker.cpuAffinity,
      gpuAffinity: worker.gpuAffinity,
      providerAffinity: worker.providerAffinity
    });
    this.workerLoads.set(worker.id, 0);
  }

  /**
   * Update worker load
   */
  updateWorkerLoad(workerId: number, delta: number): void {
    const currentLoad = this.workerLoads.get(workerId) || 0;
    this.workerLoads.set(workerId, currentLoad + delta);
  }

  /**
   * Update provider load
   */
  updateProviderLoad(providerId: string, delta: number): void {
    const currentLoad = this.providerAffinities.get(providerId) || 0;
    this.providerAffinities.set(providerId, currentLoad + delta);
  }

  /**
   * Unregister a worker
   */
  unregisterWorker(workerId: number): void {
    this.workerAffinities.delete(workerId);
    this.workerLoads.delete(workerId);
  }

  private selectProvider(task: CognitiveTask): string | null {
    const providers = Array.from(this.providerAffinities.keys());
    if (providers.length === 0) {
      return null;
    }
    
    const minLoadProvider = providers.reduce((min, provider) => {
      const load = this.providerAffinities.get(provider) || 0;
      const minLoad = this.providerAffinities.get(min) || Infinity;
      return load < minLoad ? provider : min;
    });
    
    return minLoadProvider;
  }

  private selectCPUAffinity(): number[] {
    return [0, 1, 2, 3];
  }

  private selectGPUAffinity(): number[] {
    return [0];
  }

  private updateLoadBalance(): void {
    const loads = Array.from(this.workerLoads.values());
    if (loads.length === 0) {
      this.metrics.loadBalance = 1.0;
      return;
    }
    
    const sum = loads.reduce((a, b) => a + b, 0);
    const average = sum / loads.length;
    
    const variance = loads.reduce((acc, load) => {
      return acc + Math.pow(load - average, 2);
    }, 0) / loads.length;
    
    const stdDev = Math.sqrt(variance);
    
    this.metrics.loadBalance = average > 0 ? 1 - (stdDev / average) : 1.0;
  }
}
