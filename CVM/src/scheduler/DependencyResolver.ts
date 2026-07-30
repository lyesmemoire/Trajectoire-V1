/**
 * Dependency Resolver Implementation
 * Manages task dependencies and determines when tasks are ready to execute
 */

import {
  CognitiveTask,
  TaskStatus,
  DependencyResolution,
  DependencyGraph
} from './types';

export class DependencyResolver {
  private dependencyGraph: DependencyGraph = {
    nodes: new Map(),
    edges: new Map()
  };
  private taskMap: Map<string, CognitiveTask> = new Map();

  /**
   * Resolve task dependencies and determine if task is ready
   */
  async resolve(task: CognitiveTask): Promise<DependencyResolution> {
    // Add task to graph
    this.dependencyGraph.nodes.set(task.id, {
      taskId: task.id,
      status: task.status,
      dependencies: task.dependencies,
      dependents: []
    });
    
    this.taskMap.set(task.id, task);
    
    // Add edges
    for (const depId of task.dependencies) {
      this.dependencyGraph.edges.set(`${depId}->${task.id}`, {
        from: depId,
        to: task.id
      });
      
      // Update dependents of dependency
      const depNode = this.dependencyGraph.nodes.get(depId);
      if (depNode) {
        depNode.dependents.push(task.id);
      }
    }
    
    // Check if ready
    const ready = await this.checkDependencies(task);
    
    if (ready) {
      return {
        ready: true,
        blockedBy: [],
        estimatedReadyTime: Date.now()
      };
    }
    
    const blockedBy = this.getBlockingDependencies(task);
    const estimatedReadyTime = this.estimateReadyTime(blockedBy);
    
    return {
      ready: false,
      blockedBy,
      estimatedReadyTime
    };
  }

  /**
   * Check if all dependencies are satisfied
   */
  async checkDependencies(task: CognitiveTask): Promise<boolean> {
    for (const depId of task.dependencies) {
      const depNode = this.dependencyGraph.nodes.get(depId);
      
      if (!depNode) {
        // Dependency doesn't exist yet
        return false;
      }
      
      if (depNode.status !== TaskStatus.COMPLETED) {
        return false;
      }
    }
    
    return true;
  }

  /**
   * Get the current dependency graph
   */
  getDependencyGraph(): DependencyGraph {
    return {
      nodes: new Map(this.dependencyGraph.nodes),
      edges: new Map(this.dependencyGraph.edges)
    };
  }

  /**
   * Update task status and notify dependents
   */
  updateTaskStatus(taskId: string, status: TaskStatus): void {
    const node = this.dependencyGraph.nodes.get(taskId);
    if (node) {
      node.status = status;
      
      // Check if any dependents are now ready
      for (const depId of node.dependents) {
        const depNode = this.dependencyGraph.nodes.get(depId);
        if (depNode) {
          const task = this.taskMap.get(depId);
          if (task) {
            this.checkDependencies(task);
          }
        }
      }
    }
  }

  /**
   * Remove a task from the dependency graph
   */
  removeTask(taskId: string): void {
    this.dependencyGraph.nodes.delete(taskId);
    this.taskMap.delete(taskId);
    
    // Remove edges
    const edgesToRemove: string[] = [];
    for (const [edgeId, edge] of this.dependencyGraph.edges.entries()) {
      if (edge.from === taskId || edge.to === taskId) {
        edgesToRemove.push(edgeId);
      }
    }
    
    for (const edgeId of edgesToRemove) {
      this.dependencyGraph.edges.delete(edgeId);
    }
  }

  /**
   * Clear all dependencies
   */
  clear(): void {
    this.dependencyGraph.nodes.clear();
    this.dependencyGraph.edges.clear();
    this.taskMap.clear();
  }

  private getBlockingDependencies(task: CognitiveTask): string[] {
    const blockedBy: string[] = [];
    
    for (const depId of task.dependencies) {
      const depNode = this.dependencyGraph.nodes.get(depId);
      
      if (!depNode || depNode.status !== TaskStatus.COMPLETED) {
        blockedBy.push(depId);
      }
    }
    
    return blockedBy;
  }

  private estimateReadyTime(blockedBy: string[]): number {
    const now = Date.now();
    const estimatedTimePerDep = 1000; // 1 second per dependency
    return now + (blockedBy.length * estimatedTimePerDep);
  }
}
