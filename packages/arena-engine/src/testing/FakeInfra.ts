import {
  ILogger,
  ILoggerFactory,
  IEnvProvider,
  IMetricsProvider,
  ITracer,
  IErrorReporter,
  ISpan,
  IChaosInfra,
  ICounter,
  IHistogram,
  IRandomProvider,
  IClock,
  ITimer,
  TimerHandle
} from "../ports/IInfra";

export class FakeLogger implements ILogger {
  public logs: { level: string; obj: any; msg?: string }[] = [];

  warn(obj: any, msg?: string) {
    this.logs.push({ level: "warn", obj, msg });
  }

  error(obj: any, msg?: string) {
    this.logs.push({ level: "error", obj, msg });
  }
}

export class FakeLoggerFactory implements ILoggerFactory {
  public defaultLogger = new FakeLogger();

  createChildLogger(context: Record<string, any>): ILogger {
    return this.defaultLogger;
  }
}

class FakeCounter implements ICounter {
  constructor(private state: Record<string, number>, private name: string) {}
  labels(...labels: string[]) {
    return {
      inc: () => {
        this.state[this.name] = (this.state[this.name] || 0) + 1;
      }
    };
  }
}

class FakeHistogram implements IHistogram {
  constructor(private state: Record<string, number[]>, private name: string) {}
  labels(...labels: string[]) {
    return {
      observe: (val: number) => {
        if (!this.state[this.name]) this.state[this.name] = [];
        this.state[this.name].push(val);
      }
    };
  }
}

export class FakeMetrics implements IMetricsProvider {
  public counters: Record<string, number> = {};
  public histograms: Record<string, number[]> = {};

  createCounter(options: any): ICounter {
    return new FakeCounter(this.counters, options.name);
  }

  createHistogram(options: any): IHistogram {
    return new FakeHistogram(this.histograms, options.name);
  }

  getCounter(name: string) {
    return this.counters[name] || 0;
  }
}

export class FakeTracer implements ITracer {
  public traces: string[] = [];

  async startActiveSpan<T>(name: string, fn: (span: ISpan) => Promise<T>): Promise<T> {
    this.traces.push(name);
    const fakeSpan: ISpan = {
      setAttribute: () => {},
      setStatus: () => {},
      end: () => {}
    };
    return await fn(fakeSpan);
  }
}

export class FakeEnv implements IEnvProvider {
  public NODE_ENV: string;
  private values: Record<string, string>;

  constructor(initialValues: Record<string, string> = {}) {
    this.values = initialValues;
    this.NODE_ENV = initialValues["NODE_ENV"] || "test";
  }

  get(key: string): string | undefined {
    return this.values[key];
  }
}

export class FakeErrorReporter implements IErrorReporter {
  public breadcrumbs: any[] = [];
  addBreadcrumb(breadcrumb: any) {
    this.breadcrumbs.push(breadcrumb);
  }
}

export class FakeRandom implements IRandomProvider {
  private seed: number;

  constructor(seed = 1) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 16807) % 2147483647;
    return this.seed / 2147483647;
  }

  getInternalState(): number {
    return this.seed;
  }

  setInternalState(state: number): void {
    this.seed = state;
  }
}

export class FakeClock implements IClock {
  public currentTime = 0;
  now(): number {
    return this.currentTime;
  }

  setTime(timeMs: number): void {
    this.currentTime = timeMs;
  }
}

export class FakeTimer implements ITimer {
  private tasks: { id: number; executeAt: number; callback: () => void; intervalMs?: number }[] = [];
  private nextId = 1;

  constructor(private clock: FakeClock) {}

  setTimeout(callback: () => void, ms: number): TimerHandle {
    const id = this.nextId++;
    this.tasks.push({ id, executeAt: this.clock.currentTime + ms, callback });
    return id;
  }

  setInterval(callback: () => void, ms: number): TimerHandle {
    const id = this.nextId++;
    this.tasks.push({ id, executeAt: this.clock.currentTime + ms, callback, intervalMs: ms });
    return id;
  }

  clearTimeout(handle: TimerHandle): void {
    this.tasks = this.tasks.filter((t) => t.id !== handle);
  }

  clearInterval(handle: TimerHandle): void {
    this.tasks = this.tasks.filter((t) => t.id !== handle);
  }

  peekNextExecutionTime(): number | null {
    if (this.tasks.length === 0) return null;
    let min = this.tasks[0].executeAt;
    for (let i = 1; i < this.tasks.length; i++) {
      if (this.tasks[i].executeAt < min) {
        min = this.tasks[i].executeAt;
      }
    }
    return min;
  }

  scheduleAtAbsolute(absoluteTime: number, callback: () => void): TimerHandle {
    const id = this.nextId++;
    this.tasks.push({ id, executeAt: absoluteTime, callback });
    return id;
  }

  advanceTo(timeMs: number) {
    if (timeMs >= this.clock.currentTime) {
      this.advanceBy(timeMs - this.clock.currentTime);
    }
  }

  advanceBy(ms: number) {
    const targetTime = this.clock.currentTime + ms;
    while (true) {
      const dueTasks = this.tasks.filter((t) => t.executeAt <= targetTime).sort((a, b) => {
        if (a.executeAt === b.executeAt) return a.id - b.id; // Stable tie-breaker
        return a.executeAt - b.executeAt;
      });
      if (dueTasks.length === 0) break;
      
      const task = dueTasks[0];
      this.clock.currentTime = task.executeAt;
      this.tasks = this.tasks.filter((t) => t.id !== task.id);
      
      task.callback();

      if (task.intervalMs !== undefined) {
        this.tasks.push({
          id: task.id,
          executeAt: this.clock.currentTime + task.intervalMs,
          callback: task.callback,
          intervalMs: task.intervalMs
        });
      }
    }
    this.clock.currentTime = targetTime;
  }

  runAll() {
    while (this.tasks.length > 0) {
      const nextTask = this.tasks.reduce((prev, curr) => (curr.executeAt < prev.executeAt ? curr : prev));
      if (nextTask.intervalMs !== undefined) {
        throw new Error("runAll cannot be used with intervals as they would run infinitely.");
      }
      this.advanceBy(nextTask.executeAt - this.clock.currentTime);
    }
  }
}

export class FakeInfra implements IChaosInfra {
  loggerFactory = new FakeLoggerFactory();
  metrics = new FakeMetrics();
  tracer = new FakeTracer();
  env = new FakeEnv();
  errorReporter = new FakeErrorReporter();
  random: FakeRandom;
  clock = new FakeClock();
  timer = new FakeTimer(this.clock);

  constructor(seed = 1) {
    this.random = new FakeRandom(seed);
  }

  get defaultLogger() {
    return this.loggerFactory.defaultLogger;
  }
}
