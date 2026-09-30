/**
 * AccountService
 * Application service for account management
 * Handles account deletion and data export
 */

import { SessionRepository, ReportRepository, MessageRepository, ProfileRepository } from "@/infrastructure/repositories";
import { IAuditService, ILogger } from "@/core/interfaces";
import { AppError, ErrorCode } from "@/core/errors";
import { createAdminClient } from "@/lib/supabase/service";
import { cancelUserSubscription } from "@/lib/billing/cancel-user-subscription";
import { getAccountDeletionBlocker, purgeUserData } from "@/lib/account/purge-user-data";

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

    // Refus éventuel AVANT toute action irréversible (sinon l'abonnement serait annulé pour un compte
    // qui reste) : compte administrateur, dont l'historique d'audit est conservé.
    const blocker = await getAccountDeletionBlocker(command.userId);
    if (blocker) {
      throw new AppError(blocker, ErrorCode.CONFLICT, 409);
    }

    // Annuler l'abonnement Stripe AVANT toute suppression : si l'annulation échoue,
    // on interrompt tout (le compte reste intact) plutôt que de laisser un
    // abonnement actif facturer un compte qui n'existe plus.
    try {
      await cancelUserSubscription(command.userId);
    } catch (error) {
      this.logger.error("Failed to cancel Stripe subscription", { error });
      throw new AppError(
        "Impossible d'annuler votre abonnement : la suppression du compte a été interrompue. Réessayez ou contactez le support.",
        ErrorCode.INTERNAL_ERROR,
        500
      );
    }

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

    // Données applicatives (`public.users` et dépendances) : avant la suppression Auth, pour
    // qu'un échec de celle-ci laisse un compte sans données (réessayable) plutôt que des
    // données sans compte. Une erreur ici interrompt la suppression.
    try {
      await purgeUserData(command.userId);
    } catch (error) {
      this.logger.error("Failed to purge user data", { error });
      throw new AppError(
        "La suppression de vos données a échoué : le compte n'a pas été supprimé. Réessayez ou contactez le support.",
        ErrorCode.INTERNAL_ERROR,
        500
      );
    }

    // Delete user from Supabase Auth
    const supabase = createAdminClient();
    const { error: deleteError } = await supabase.auth.admin.deleteUser(command.userId);

    if (deleteError) {
      this.logger.error("Failed to delete user from auth", { error: deleteError });
      throw new AppError("Failed to delete user account", ErrorCode.INTERNAL_ERROR, 500);
    }

    // Pas de ligne d'audit ici : `AdminAuditLog.adminId` référence l'utilisateur, qui n'existe plus
    // (l'insertion échouait après la suppression et faisait répondre 500 à un compte déjà supprimé).
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

