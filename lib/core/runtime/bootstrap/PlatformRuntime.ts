import { Container } from "../container/Container";
import { Module } from "../module/Module";
import { Logger } from "../../observability/logger/Logger";

export class PlatformRuntime {
  public readonly container: Container;
  private readonly modules: Module[] = [];
  private readonly log: Logger;

  constructor(logger?: Logger) {
    this.container = new Container();
    this.log = logger || this.createDefaultLogger();
  }

  private createDefaultLogger(): Logger {
    // Fallback to a simple console logger if none provided
    const logger = {
      debug: (msg: string, ctx?: any) => console.log(`[DEBUG] ${msg}`, ctx),
      info: (msg: string, ctx?: any) => console.log(`[INFO] ${msg}`, ctx),
      warn: (msg: string, ctx?: any) => console.warn(`[WARN] ${msg}`, ctx),
      error: (msg: string, err?: any, ctx?: any) => console.error(`[ERROR] ${msg}`, err, ctx),
      setLevel: () => {},
      withContext: () => logger,
    };
    return logger;
  }

  addModule(module: Module): this {
    this.modules.push(module);
    return this;
  }

  async start(): Promise<void> {
    this.log.info("Starting Platform Runtime...");
    for (const mod of this.modules) {
      await mod.register(this.container);
    }
    this.log.info("Platform Runtime started successfully.");
  }

  async stop(): Promise<void> {
    this.log.info("Stopping Platform Runtime...");
    // Future: Graceful shutdown of services
    this.log.info("Platform Runtime stopped.");
  }

  async health(): Promise<boolean> {
    // Future: Connect to HealthCheckProvider
    return true;
  }
}
