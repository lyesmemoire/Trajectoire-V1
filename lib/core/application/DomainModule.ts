import { Module } from "../runtime/module/Module";
import { Container } from "../runtime/container/Container";

/**
 * Abstract base class for domain modules.
 * 
 * Standardizes the registration order across all domains:
 *   1. Repositories
 *   2. Gateways (external adapters)
 *   3. Use Cases
 *   4. Queries
 *   5. Presenters
 * 
 * Each domain module overrides only the relevant methods.
 * 
 * Example:
 * ```ts
 * class CareerModule extends DomainModule {
 *   protected registerRepositories(c: Container) {
 *     c.registerSingleton("CareerRepository", new PrismaCareerRepository());
 *   }
 *   protected registerUseCases(c: Container) {
 *     c.registerTransient("CreateCareerUseCase", () => new CreateCareerUseCase(
 *       c.resolve("CareerRepository"),
 *       c.resolve("DomainEventPublisher")
 *     ));
 *   }
 * }
 * ```
 */
export abstract class DomainModule implements Module {
  register(container: Container): void | Promise<void> {
    this.registerRepositories(container);
    this.registerGateways(container);
    this.registerUseCases(container);
    this.registerQueries(container);
    this.registerPresenters(container);
  }

  protected registerRepositories(container: Container): void {}
  protected registerGateways(container: Container): void {}
  protected registerUseCases(container: Container): void {}
  protected registerQueries(container: Container): void {}
  protected registerPresenters(container: Container): void {}
}
