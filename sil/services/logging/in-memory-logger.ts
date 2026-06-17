import { StructuredLogger, LogEntry } from "../../contracts/structured-logger";

export class InMemoryLogger implements StructuredLogger {
  readonly entries: LogEntry[] = [];

  async log(entry: LogEntry): Promise<void> {
    this.entries.push(entry);
  }
}
