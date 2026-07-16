import { UseCase, Result } from "@/lib/core";
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
