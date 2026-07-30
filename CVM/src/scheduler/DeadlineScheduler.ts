/**
 * Deadline Scheduler Implementation
 * Manages tasks with deadlines and detects deadline violations
 */

import { CognitiveTask, TaskStatus, DeadlineTask, DeadlineMetrics, DeadlineViolation } from './types';
import { BinaryHeap } from './BinaryHeap';

export class DeadlineScheduler {
  private deadlineQueue: BinaryHeap<DeadlineTask> = new BinaryHeap<DeadlineTask>((a, b) => {
    return a.deadline - b.deadline;
  });
  private checkInterval: number = 1000; // Check every second
  private checkTimer?: NodeJS.Timeout;
  private metrics: DeadlineMetrics = {
    missedDeadlines: 0,
    nearMisses: 0,
    averageSlack: 0
  };

  constructor() {
    this.startDeadlineChecker();
  }

  /**
   * Enqueue a task with a deadline
   */
  async enqueue(task: CognitiveTask): Promise<void> {
    if (!task.deadline) {
      return;
    }
    
    const now = Date.now();
    const slack = task.deadline - now - (task.latencyBudget || 0);
    
    this.deadlineQueue.enqueue({
      task,
      deadline: task.deadline,
      slack
    });
  }

  /**
   * Dequeue the most urgent task (closest deadline)
   */
  async dequeue(): Promise<CognitiveTask | null> {
    const deadlineTask = this.deadlineQueue.dequeue();
    return deadlineTask ? deadlineTask.task : null;
  }

  /**
   * Check for deadline violations
   */
  async checkDeadlines(): Promise<DeadlineViolation[]> {
    const violations: DeadlineViolation[] = [];
    const now = Date.now();
    const tasks: DeadlineTask[] = [];
    
    while (!this.deadlineQueue.isEmpty()) {
      const deadlineTask = this.deadlineQueue.peek()!;
      
      if (deadlineTask.deadline > now + this.checkInterval) {
        break;
      }
      
      tasks.push(this.deadlineQueue.dequeue()!);
    }
    
    for (const { task, deadline } of tasks) {
      if (task.status === TaskStatus.COMPLETED) {
        if (task.completedAt && task.completedAt > deadline) {
          violations.push({
            taskId: task.id,
            deadline,
            actualCompletion: task.completedAt,
            violationDuration: task.completedAt - deadline
          });
          this.metrics.missedDeadlines++;
        }
      } else if (task.status === TaskStatus.RUNNING && now > deadline) {
        violations.push({
          taskId: task.id,
          deadline,
          actualCompletion: now,
          violationDuration: now - deadline
        });
        this.metrics.missedDeadlines++;
      }
      
      // Re-enqueue if not completed
      if (task.status !== TaskStatus.COMPLETED) {
        const slack = deadline - now - (task.latencyBudget || 0);
        this.deadlineQueue.enqueue({ task, deadline, slack });
      }
    }
    
    return violations;
  }

  /**
   * Get deadline scheduler metrics
   */
  getMetrics(): DeadlineMetrics {
    const tasks = this.deadlineQueue.toArray();
    const now = Date.now();
    
    let nearMisses = 0;
    let totalSlack = 0;
    
    for (const { deadline, slack } of tasks) {
      if (now > deadline) {
        // Already missed
      } else if (slack < 1000) { // Less than 1 second slack
        nearMisses++;
      }
      totalSlack += Math.max(0, slack);
    }
    
    this.metrics.nearMisses = nearMisses;
    this.metrics.averageSlack = tasks.length > 0 ? totalSlack / tasks.length : 0;
    
    return { ...this.metrics };
  }

  /**
   * Get the number of tasks with deadlines
   */
  size(): number {
    return this.deadlineQueue.size();
  }

  /**
   * Clear all deadline tasks
   */
  clear(): void {
    this.deadlineQueue.clear();
  }

  private startDeadlineChecker(): void {
    this.checkTimer = setInterval(async () => {
      await this.checkDeadlines();
    }, this.checkInterval);
  }

  /**
   * Shutdown the deadline scheduler
   */
  shutdown(): void {
    if (this.checkTimer) {
      clearInterval(this.checkTimer);
    }
  }
}
