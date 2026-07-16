// @ts-nocheck
import { UnitOfWork } from "./UnitOfWork";
import { TransactionManager } from "../../database/TransactionManager";
import { createChildLogger } from "../../logger";

export class PrismaUnitOfWork implements UnitOfWork {
  private log = createChildLogger({ component: "UnitOfWork" });

  constructor(private readonly txManager: TransactionManager) {}

  async begin(): Promise<void> {
    this.log.debug("UnitOfWork begin");
    // Prisma manages transactions via closures (interactive transactions).
    // Native begin/commit/rollback is not supported unless raw SQL is used.
    // This is a placeholder for interface compliance. 
    // Actual transactional boundary is handled in `execute`.
  }

  async commit(): Promise<void> {
    this.log.debug("UnitOfWork commit");
  }

  async rollback(): Promise<void> {
    this.log.debug("UnitOfWork rollback");
  }

  async execute<T>(work: () => Promise<T>): Promise<T> {
    this.log.debug("UnitOfWork execute wrapper started");
    return this.txManager.execute(async () => {
      return await work();
    });
  }
}
