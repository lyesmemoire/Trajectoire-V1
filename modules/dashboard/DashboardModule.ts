import { DomainModule } from "../../lib/core/application/DomainModule";
import { Container } from "../../lib/core/runtime/container/Container";
import { GetDashboardDataQuery } from "./application/queries/get-dashboard-data.query";
import { GetDashboardDataQueryImpl } from "./infrastructure/queries/get-dashboard-data.query.impl";

export class DashboardModule extends DomainModule {
  protected registerRepositories(container: Container): void {
    // No repositories needed for now
  }

  protected registerGateways(container: Container): void {
    // No gateways needed for now
  }

  protected registerUseCases(container: Container): void {
    // No use cases needed for now
  }

  protected registerQueries(container: Container): void {
    container.registerSingleton(
      "GetDashboardDataQuery",
      () => new GetDashboardDataQueryImpl()
    );
  }

  protected registerPresenters(container: Container): void {
    // No presenters needed for now
  }
}
