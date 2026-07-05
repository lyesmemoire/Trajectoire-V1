import { Result } from "@/lib/core/result";

export interface UserExportPort {
  exportData(userId: string): Promise<Result<any>>;
}
