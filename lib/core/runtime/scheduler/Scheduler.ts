import { createChildLogger } from "../../logger";

export interface ScheduledTask {
  name: string;
  intervalMs: number;
  execute(): Promise<void>;
}

/**
 * Lightweight scheduler that replaces raw cron/setTimeout/setInterval.
 * Each task is a named, interval-driven job.
 * Can be extended with cron expressions later.
 */
export class Scheduler {
  private log = createChildLogger({ component: "Scheduler" });
  private timers = new Map<string, NodeJS.Timeout>();
  private running = false;

  start(): void {
    this.running = true;
    this.log.info("Scheduler started.");
  }

  stop(): void {
    this.running = false;
    for (const [name, timer] of this.timers.entries()) {
      clearInterval(timer);
      this.log.debug(`Stopped scheduled task: ${name}`);
    }
    this.timers.clear();
    this.log.info("Scheduler stopped.");
  }

  schedule(task: ScheduledTask): void {
    if (this.timers.has(task.name)) {
      throw new Error(`Task "${task.name}" is already scheduled.`);
    }

    const timer = setInterval(async () => {
      if (!this.running) return;
      try {
        await task.execute();
      } catch (error: any) {
        this.log.error({ error }, `Scheduled task "${task.name}" failed`);
      }
    }, task.intervalMs);

    this.timers.set(task.name, timer);
    this.log.info(`Scheduled task "${task.name}" every ${task.intervalMs}ms`);
  }

  unschedule(name: string): void {
    const timer = this.timers.get(name);
    if (timer) {
      clearInterval(timer);
      this.timers.delete(name);
      this.log.debug(`Unscheduled task: ${name}`);
    }
  }
}
