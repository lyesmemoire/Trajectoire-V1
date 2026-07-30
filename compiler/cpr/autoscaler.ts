/**
 * Blueprint DSL CPR Autoscaler
 * 
 * Manages automatic scaling of cluster resources.
 */

import { ClusterManager, Node, NodeStatus } from './cluster-manager';
import { RuntimeManager, RuntimeInstance, InstanceStatus } from './runtime-manager';

export interface ScalingPolicy {
  name: string;
  minNodes: number;
  maxNodes: number;
  targetCpuUtilization: number;
  targetMemoryUtilization: number;
  scaleUpCooldown: number;
  scaleDownCooldown: number;
}

export interface ScalingEvent {
  id: string;
  timestamp: number;
  type: ScalingEventType;
  nodeId?: string;
  count: number;
  reason: string;
}

export enum ScalingEventType {
  SCALE_UP = 'SCALE_UP',
  SCALE_DOWN = 'SCALE_DOWN',
  ADD_NODE = 'ADD_NODE',
  REMOVE_NODE = 'REMOVE_NODE',
}

export class Autoscaler {
  private clusterManager: ClusterManager;
  private runtimeManager: RuntimeManager;
  private policies: Map<string, ScalingPolicy> = new Map();
  private events: ScalingEvent[] = [];
  private eventCounter: number = 0;
  private lastScaleUp: number = 0;
  private lastScaleDown: number = 0;

  constructor(clusterManager: ClusterManager, runtimeManager: RuntimeManager) {
    this.clusterManager = clusterManager;
    this.runtimeManager = runtimeManager;
    this.initializePolicies();
  }

  /**
   * Initialize scaling policies
   */
  private initializePolicies(): void {
    this.policies.set('default', {
      name: 'default',
      minNodes: 3,
      maxNodes: 10,
      targetCpuUtilization: 0.7,
      targetMemoryUtilization: 0.8,
      scaleUpCooldown: 300000, // 5 minutes
      scaleDownCooldown: 600000, // 10 minutes
    });

    this.policies.set('aggressive', {
      name: 'aggressive',
      minNodes: 5,
      maxNodes: 20,
      targetCpuUtilization: 0.5,
      targetMemoryUtilization: 0.6,
      scaleUpCooldown: 60000, // 1 minute
      scaleDownCooldown: 300000, // 5 minutes
    });

    this.policies.set('conservative', {
      name: 'conservative',
      minNodes: 2,
      maxNodes: 5,
      targetCpuUtilization: 0.8,
      targetMemoryUtilization: 0.9,
      scaleUpCooldown: 600000, // 10 minutes
      scaleDownCooldown: 1200000, // 20 minutes
    });
  }

  /**
   * Evaluate scaling needs
   */
  public evaluateScaling(policy: string = 'default'): ScalingEvent[] {
    const scalingPolicy = this.policies.get(policy) || this.policies.get('default');

    if (!scalingPolicy) {
      return [];
    }

    const events: ScalingEvent[] = [];
    const now = Date.now();
    const activeNodes = this.clusterManager.getNodesByStatus(NodeStatus.ACTIVE);
    const runningInstances = this.runtimeManager.getInstancesByStatus(InstanceStatus.RUNNING);

    // Calculate utilization
    const cpuUtilization = this.calculateCpuUtilization(activeNodes, runningInstances);
    const memoryUtilization = this.calculateMemoryUtilization(activeNodes, runningInstances);

    // Check if we need to scale up
    if (cpuUtilization > scalingPolicy.targetCpuUtilization || memoryUtilization > scalingPolicy.targetMemoryUtilization) {
      if (now - this.lastScaleUp > scalingPolicy.scaleUpCooldown && activeNodes.length < scalingPolicy.maxNodes) {
        const scaleUpCount = Math.min(2, scalingPolicy.maxNodes - activeNodes.length);
        events.push(this.createEvent(ScalingEventType.SCALE_UP, scaleUpCount, `High utilization: CPU ${cpuUtilization.toFixed(2)}, Memory ${memoryUtilization.toFixed(2)}`));
        this.lastScaleUp = now;
      }
    }

    // Check if we need to scale down
    if (cpuUtilization < scalingPolicy.targetCpuUtilization * 0.5 && memoryUtilization < scalingPolicy.targetMemoryUtilization * 0.5) {
      if (now - this.lastScaleDown > scalingPolicy.scaleDownCooldown && activeNodes.length > scalingPolicy.minNodes) {
        const scaleDownCount = Math.min(1, activeNodes.length - scalingPolicy.minNodes);
        events.push(this.createEvent(ScalingEventType.SCALE_DOWN, scaleDownCount, `Low utilization: CPU ${cpuUtilization.toFixed(2)}, Memory ${memoryUtilization.toFixed(2)}`));
        this.lastScaleDown = now;
      }
    }

    return events;
  }

  /**
   * Calculate CPU utilization
   */
  private calculateCpuUtilization(nodes: Node[], instances: RuntimeInstance[]): number {
    if (nodes.length === 0) {
      return 0;
    }

    // Simple calculation: instances per node
    const instancesPerNode = instances.length / nodes.length;
    return Math.min(instancesPerNode / 10, 1.0); // Assume 10 instances per node is 100%
  }

  /**
   * Calculate memory utilization
   */
  private calculateMemoryUtilization(nodes: Node[], instances: RuntimeInstance[]): number {
    if (nodes.length === 0) {
      return 0;
    }

    // Simple calculation: assume each instance uses 10% of node memory
    const instancesPerNode = instances.length / nodes.length;
    return Math.min(instancesPerNode * 0.1, 1.0);
  }

  /**
   * Create scaling event
   */
  private createEvent(type: ScalingEventType, count: number, reason: string): ScalingEvent {
    const event: ScalingEvent = {
      id: `event_${this.eventCounter++}`,
      timestamp: Date.now(),
      type,
      count,
      reason,
    };

    this.events.push(event);
    return event;
  }

  /**
   * Scale up cluster
   */
  public scaleUp(count: number = 1): void {
    for (let i = 0; i < count; i++) {
      const nodeId = `node_${Date.now()}_${i}`;
      this.clusterManager.addNode({
        id: nodeId,
        address: 'localhost',
        port: 0,
        status: NodeStatus.JOINING,
        lastHeartbeat: Date.now(),
        metadata: {},
      });

      this.createEvent(ScalingEventType.ADD_NODE, 1, `Added node ${nodeId}`);
    }
  }

  /**
   * Scale down cluster
   */
  public scaleDown(count: number = 1): void {
    const activeNodes = this.clusterManager.getNodesByStatus(NodeStatus.ACTIVE);

    for (let i = 0; i < count && i < activeNodes.length; i++) {
      const node = activeNodes[i];
      this.clusterManager.removeNode(node.id);
      this.createEvent(ScalingEventType.REMOVE_NODE, 1, `Removed node ${node.id}`);
    }
  }

  /**
   * Get scaling events
   */
  public getEvents(): ScalingEvent[] {
    return [...this.events];
  }

  /**
   * Get events in time range
   */
  public getEventsInRange(start: number, end: number): ScalingEvent[] {
    return this.events.filter(e => e.timestamp >= start && e.timestamp <= end);
  }

  /**
   * Add scaling policy
   */
  public addPolicy(policy: ScalingPolicy): void {
    this.policies.set(policy.name, policy);
  }

  /**
   * Get scaling policy
   */
  public getPolicy(name: string): ScalingPolicy | null {
    return this.policies.get(name) || null;
  }

  /**
   * Get all policies
   */
  public getAllPolicies(): ScalingPolicy[] {
    return Array.from(this.policies.values());
  }

  /**
   * Clear events
   */
  public clearEvents(): void {
    this.events = [];
    this.eventCounter = 0;
  }

  /**
   * Get autoscaler statistics
   */
  public getStatistics(): {
    totalEvents: number;
    scaleUpEvents: number;
    scaleDownEvents: number;
    addNodeEvents: number;
    removeNodeEvents: number;
    lastScaleUp: number;
    lastScaleDown: number;
  } {
    const scaleUp = this.events.filter(e => e.type === ScalingEventType.SCALE_UP).length;
    const scaleDown = this.events.filter(e => e.type === ScalingEventType.SCALE_DOWN).length;
    const addNode = this.events.filter(e => e.type === ScalingEventType.ADD_NODE).length;
    const removeNode = this.events.filter(e => e.type === ScalingEventType.REMOVE_NODE).length;

    return {
      totalEvents: this.events.length,
      scaleUpEvents: scaleUp,
      scaleDownEvents: scaleDown,
      addNodeEvents: addNode,
      removeNodeEvents: removeNode,
      lastScaleUp: this.lastScaleUp,
      lastScaleDown: this.lastScaleDown,
    };
  }

  /**
   * Validate autoscaler state
   */
  public validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    for (const [name, policy] of this.policies) {
      if (policy.name !== name) {
        errors.push(`Policy name mismatch at ${name}`);
      }

      if (policy.minNodes < 0) {
        errors.push(`Invalid min nodes in policy ${name}`);
      }

      if (policy.maxNodes < policy.minNodes) {
        errors.push(`Max nodes less than min nodes in policy ${name}`);
      }

      if (policy.targetCpuUtilization < 0 || policy.targetCpuUtilization > 1) {
        errors.push(`Invalid CPU utilization target in policy ${name}`);
      }

      if (policy.targetMemoryUtilization < 0 || policy.targetMemoryUtilization > 1) {
        errors.push(`Invalid memory utilization target in policy ${name}`);
      }
    }

    for (const event of this.events) {
      if (event.timestamp < 0) {
        errors.push(`Invalid timestamp in event ${event.id}`);
      }

      if (event.count < 0) {
        errors.push(`Invalid count in event ${event.id}`);
      }

      if (event.nodeId && !this.clusterManager.getNode(event.nodeId)) {
        errors.push(`Event ${event.id} references non-existent node ${event.nodeId}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Set cluster manager
   */
  public setClusterManager(clusterManager: ClusterManager): void {
    this.clusterManager = clusterManager;
  }

  /**
   * Set runtime manager
   */
  public setRuntimeManager(runtimeManager: RuntimeManager): void {
    this.runtimeManager = runtimeManager;
  }
}
