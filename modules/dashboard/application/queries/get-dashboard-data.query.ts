import { Result, ok, fail } from "../../../../lib/core/result";
import { InfrastructureError } from "../../../../lib/core/result/errors";
import { DashboardData } from "../../domain/entities/dashboard.entity";

export interface GetDashboardDataQueryParams {
  userId: string;
}

export class GetDashboardDataQuery {
  async execute(params: GetDashboardDataQueryParams): Promise<Result<DashboardData>> {
    // This will be implemented by the infrastructure layer
    // For now, return a failure to indicate it needs implementation
    return fail(new InfrastructureError("GetDashboardDataQuery not implemented"));
  }
}
