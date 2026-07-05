import { UseCase, Result, fail, ok } from "@/lib/core";
import { UserRepositoryPort } from "../../ports/user-repository.port";
import { UserExportPort } from "../../ports/user-export.port";

export interface ExportUserDataInput {
  userId: string;
}

export class ExportUserDataUseCase extends UseCase<ExportUserDataInput, any> {
  constructor(
    private userExportPort: UserExportPort
  ) {
    super();
  }

  protected async beforeExecute(): Promise<void> {}

  protected async run(input: ExportUserDataInput): Promise<Result<any>> {
    return this.userExportPort.exportData(input.userId);
  }

  protected async afterExecute(): Promise<void> {}
}
