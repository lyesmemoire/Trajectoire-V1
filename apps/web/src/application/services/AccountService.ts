/**
 * AccountService
 * Application service for account management
 * Handles account deletion and data export
 */

import { SessionRepository, ReportRepository, MessageRepository, ProfileRepository } from "@/infrastructure/repositories";
import { IAuditService, ILogger } from "@/core/interfaces";
import { AppError, ErrorCode } from "@/core/errors";
import { createClient } from "@/lib/supabase/server";

export interface DeleteAccountCommand {
  userId: string;
}

export interface ExportAccountDataCommand {
  userId: string;
}

export interface AccountExportData {
  profile: any;
  sessions: any[];
  messages: any[];
  reports: any[];
}

export class AccountService {
  constructor(
    private readonly sessionRepository: SessionRepository,
    private readonly reportRepository: ReportRepository,
    private readonly messageRepository: MessageRepository,
    private readonly profileRepository: ProfileRepository,
    private readonly auditService: IAuditService,
    private readonly logger: ILogger
  ) {}

  /**
   * Delete user account and all associated data
   */
  async deleteAccount(command: DeleteAccountCommand): Promise<void> {
    this.logger.setUserContext(command.userId);

    // Get user's sessions
    const sessions = await this.sessionRepository.find({ user_id: command.userId });

    // Delete all messages for each session
    for (const session of sessions) {
      await this.messageRepository.deleteBySessionId(session.id);
    }

    // Delete all reports for each session
    for (const session of sessions) {
      const report = await this.reportRepository.getBySessionId(session.id);
      if (report) {
        await this.reportRepository.delete(report.id);
      }
    }

    // Delete all sessions
    for (const session of sessions) {
      await this.sessionRepository.delete(session.id);
    }

    // Delete profile
    const profile = await this.profileRepository.getByUserId(command.userId);
    if (profile) {
      await this.profileRepository.delete(profile.id);
    }

    // Delete user from Supabase Auth
    const supabase = await createClient();
    const { error: deleteError } = await supabase.auth.admin.deleteUser(command.userId);

    if (deleteError) {
      this.logger.error("Failed to delete user from auth", { error: deleteError });
      throw new AppError("Failed to delete user account", ErrorCode.INTERNAL_ERROR, 500);
    }

    // Audit log
    await this.auditService.log({
      userId: command.userId,
      action: "account_delete",
      resourceType: "account",
    });

    this.logger.info("Account deleted successfully", { userId: command.userId });
  }

  /**
   * Export all user data
   */
  async exportAccountData(command: ExportAccountDataCommand): Promise<AccountExportData> {
    this.logger.setUserContext(command.userId);

    // Get profile
    const profile = await this.profileRepository.getByUserId(command.userId);

    // Get sessions
    const sessions = await this.sessionRepository.find({ user_id: command.userId });

    // Get all messages for all sessions
    const messages: any[] = [];
    for (const session of sessions) {
      const sessionMessages = await this.messageRepository.getBySessionId(session.id);
      messages.push(...sessionMessages);
    }

    // Get all reports for all sessions
    const reports: any[] = [];
    for (const session of sessions) {
      const report = await this.reportRepository.getBySessionId(session.id);
      if (report) {
        reports.push(report);
      }
    }

    // Audit log
    await this.auditService.log({
      userId: command.userId,
      action: "account_export",
      resourceType: "account",
    });

    this.logger.info("Account data exported successfully", { userId: command.userId });

    return {
      profile,
      sessions,
      messages,
      reports,
    };
  }
}
