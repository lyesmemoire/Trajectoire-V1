import { Logger, LogLevel, LogContext } from "./Logger";
import { ConsoleLogger } from "./ConsoleLogger";
import { PinoLogger } from "./PinoLogger";
import { RequestContext } from "../../runtime/context/RequestContext";

export class LoggerProvider {
  private static instance: Logger;
  private static level: LogLevel = LogLevel.INFO;

  static initialize(level?: LogLevel, usePino: boolean = false): void {
    if (level) {
      LoggerProvider.level = level;
    }

    if (usePino) {
      LoggerProvider.instance = new PinoLogger(LoggerProvider.level);
    } else {
      LoggerProvider.instance = new ConsoleLogger(LoggerProvider.level);
    }
  }

  static getLogger(): Logger {
    if (!LoggerProvider.instance) {
      LoggerProvider.initialize();
    }
    
    // Wrap the logger to automatically include RequestContext
    const context = RequestContext.current();
    if (context) {
      return LoggerProvider.instance.withContext({
        correlationId: context.correlationId,
        requestId: context.requestId,
        userId: context.userId,
      });
    }
    
    return LoggerProvider.instance;
  }

  static getLoggerWithContext(context: LogContext): Logger {
    if (!LoggerProvider.instance) {
      LoggerProvider.initialize();
    }
    return LoggerProvider.instance.withContext(context);
  }

  static setLevel(level: LogLevel): void {
    LoggerProvider.level = level;
    if (LoggerProvider.instance) {
      LoggerProvider.instance.setLevel(level);
    }
  }
}
