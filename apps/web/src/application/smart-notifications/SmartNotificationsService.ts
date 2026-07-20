/**
 * Smart Notifications Service
 * Intelligent notification engine
 */

import {
  NotificationType,
  NotificationChannel,
  NotificationTone,
  SmartNotification,
  NotificationContext,
  SmartNotificationsConfig,
  defaultSmartNotificationsConfig,
} from "./interfaces/ISmartNotifications";
import { userPersonalizationEngine } from "../adaptive-intelligence/UserPersonalizationEngine";

// ============================================================================
// SMART NOTIFICATIONS SERVICE CLASS
// ============================================================================

export class SmartNotificationsService {
  private static instance: SmartNotificationsService;
  private config: SmartNotificationsConfig;
  private notificationQueue: SmartNotification[] = [];
  private sentNotifications: Map<string, SmartNotification[]> = new Map();
  private dailyCounts: Map<string, number> = new Map();

  private constructor() {
    this.config = defaultSmartNotificationsConfig;
  }

  static getInstance(): SmartNotificationsService {
    if (!SmartNotificationsService.instance) {
      SmartNotificationsService.instance = new SmartNotificationsService();
    }
    return SmartNotificationsService.instance;
  }

  /**
   * Set configuration
   */
  setConfig(config: Partial<SmartNotificationsConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Generate notifications for user
   */
  async generateNotifications(context: NotificationContext): Promise<SmartNotification[]> {
    const notifications: SmartNotification[] = [];

    // Check if user is in quiet hours
    if (this.config.respectQuietHours && this.isInQuietHours(context)) {
      return notifications;
    }

    // Check daily limit
    const today = new Date().toDateString();
    const dailyCount = this.dailyCounts.get(today) || 0;
    if (dailyCount >= this.config.maxDailyNotifications) {
      return notifications;
    }

    // Generate relevant notifications
    notifications.push(...await this.generateReminderNotifications(context));
    notifications.push(...await this.generateEncouragementNotifications(context));
    notifications.push(...await this.generateMilestoneNotifications(context));
    notifications.push(...await this.generateWarningNotifications(context));
    notifications.push(...await this.generateTipNotifications(context));

    // Filter by relevance
    const relevantNotifications = notifications.filter(
      n => n.relevanceScore >= this.config.minRelevanceThreshold
    );

    // Sort by relevance
    const sortedNotifications = relevantNotifications.sort((a, b) => b.relevanceScore - a.relevanceScore);

    // Limit to remaining daily quota
    const remainingQuota = this.config.maxDailyNotifications - dailyCount;
    const limitedNotifications = sortedNotifications.slice(0, remainingQuota);

    // Schedule notifications
    limitedNotifications.forEach(notification => {
      notification.scheduledFor = this.calculateOptimalSendTime(context, notification);
    });

    // Update daily count
    this.dailyCounts.set(today, dailyCount + limitedNotifications.length);

    return limitedNotifications;
  }

  /**
   * Check if user is in quiet hours
   */
  private isInQuietHours(context: NotificationContext): boolean {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const [startHour, startMin] = context.preferences.quietHours.start.split(':').map(Number);
    const [endHour, endMin] = context.preferences.quietHours.end.split(':').map(Number);
    
    const startTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;

    return currentTime >= startTime && currentTime <= endTime;
  }

  /**
   * Generate reminder notifications
   */
  private async generateReminderNotifications(context: NotificationContext): Promise<SmartNotification[]> {
    const notifications: SmartNotification[] = [];

    // Practice reminder
    if (context.timeAvailable > 15 && context.currentEngagement > 0.5) {
      notifications.push({
        id: `notif_reminder_${Date.now()}_practice`,
        userId: context.userId,
        type: "reminder",
        title: "Pratique recommandée",
        content: "Vous avez du temps disponible. Une courte session pourrait être bénéfique.",
        channel: this.selectChannel(context),
        tone: this.selectTone(context),
        relevanceScore: this.calculateRelevance(context, "practice"),
        priority: "medium",
        scheduledFor: new Date(),
        metadata: { reason: "time_available" },
        generatedBy: ["SmartNotificationsService"],
        timestamp: new Date(),
      });
    }

    // Streak reminder
    if (context.streak > 0 && context.streak % 3 === 0) {
      notifications.push({
        id: `notif_reminder_${Date.now()}_streak`,
        userId: context.userId,
        type: "reminder",
        title: "Continuez votre série !",
        content: `Vous avez ${context.streak} jours consécutifs. Continuez à pratiquer.`,
        channel: this.selectChannel(context),
        tone: "motivational",
        relevanceScore: this.calculateRelevance(context, "streak"),
        priority: "high",
        scheduledFor: new Date(),
        metadata: { streak: context.streak },
        generatedBy: ["SmartNotificationsService"],
        timestamp: new Date(),
      });
    }

    return notifications;
  }

  /**
   * Generate encouragement notifications
   */
  private async generateEncouragementNotifications(context: NotificationContext): Promise<SmartNotification[]> {
    const notifications: SmartNotification[] = [];

    // Low engagement encouragement
    if (context.currentEngagement < 0.4) {
      notifications.push({
        id: `notif_encouragement_${Date.now()}_engagement`,
        userId: context.userId,
        type: "encouragement",
        title: "On vous manque !",
        content: "Ça fait un moment. Une petite session pour vous remettre en forme ?",
        channel: this.selectChannel(context),
        tone: "friendly",
        relevanceScore: this.calculateRelevance(context, "engagement"),
        priority: "medium",
        scheduledFor: new Date(),
        metadata: { reason: "low_engagement" },
        generatedBy: ["SmartNotificationsService"],
        timestamp: new Date(),
      });
    }

    // After achievement
    if (context.streak >= 7) {
      notifications.push({
        id: `notif_encouragement_${Date.now()}_achievement`,
        userId: context.userId,
        type: "achievement",
        title: "Incroyable !",
        content: `7 jours consécutifs ! Vous êtes sur la bonne voie.`,
        channel: this.selectChannel(context),
        tone: "motivational",
        relevanceScore: this.calculateRelevance(context, "achievement"),
        priority: "high",
        scheduledFor: new Date(),
        metadata: { streak: context.streak },
        generatedBy: ["SmartNotificationsService"],
        timestamp: new Date(),
      });
    }

    return notifications;
  }

  /**
   * Generate milestone notifications
   */
  private async generateMilestoneNotifications(context: NotificationContext): Promise<SmartNotification[]> {
    const notifications: SmartNotification[] = [];

    // Milestone based on streak
    if (context.streak === 10 || context.streak === 30 || context.streak === 100) {
      notifications.push({
        id: `notif_milestone_${Date.now()}_${context.streak}`,
        userId: context.userId,
        type: "milestone",
        title: `Milestone: ${context.streak} jours !`,
        content: `Félicitations ! Vous avez atteint ${context.streak} jours de pratique.`,
        channel: this.selectChannel(context),
        tone: "motivational",
        relevanceScore: 0.95,
        priority: "high",
        scheduledFor: new Date(),
        metadata: { milestone: context.streak },
        generatedBy: ["SmartNotificationsService"],
        timestamp: new Date(),
      });
    }

    return notifications;
  }

  /**
   * Generate warning notifications
   */
  private async generateWarningNotifications(context: NotificationContext): Promise<SmartNotification[]> {
    const notifications: SmartNotification[] = [];

    // Fatigue warning
    if (context.fatigue > 0.7) {
      notifications.push({
        id: `notif_warning_${Date.now()}_fatigue`,
        userId: context.userId,
        type: "warning",
        title: "Prenez soin de vous",
        content: "Vous semblez fatigué. Le repos est important pour votre progression.",
        channel: "in_app",
        tone: "friendly",
        relevanceScore: this.calculateRelevance(context, "fatigue"),
        priority: "medium",
        scheduledFor: new Date(),
        metadata: { reason: "high_fatigue" },
        generatedBy: ["SmartNotificationsService"],
        timestamp: new Date(),
      });
    }

    // Low engagement warning
    if (context.currentEngagement < 0.2) {
      notifications.push({
        id: `notif_warning_${Date.now()}_disengagement`,
        userId: context.userId,
        type: "warning",
        title: "N'abandonnez pas",
        content: "Votre progression attend. Revenez quand vous serez prêt.",
        channel: this.selectChannel(context),
        tone: "motivational",
        relevanceScore: this.calculateRelevance(context, "disengagement"),
        priority: "high",
        scheduledFor: new Date(),
        metadata: { reason: "low_engagement" },
        generatedBy: ["SmartNotificationsService"],
        timestamp: new Date(),
      });
    }

    return notifications;
  }

  /**
   * Generate tip notifications
   */
  private async generateTipNotifications(context: NotificationContext): Promise<SmartNotification[]> {
    const notifications: SmartNotification[] = [];

    const tips = [
      "Pratiquez la méthode STAR pour structurer vos réponses.",
      "Respirez profondément avant chaque question.",
      "Soyez honnête sur vos points faibles.",
      "Préparez des exemples concrets pour vos compétences.",
      "Écoutez attentivement la question avant de répondre.",
    ];

    if (context.currentEngagement > 0.6) {
      notifications.push({
        id: `notif_tip_${Date.now()}`,
        userId: context.userId,
        type: "tip",
        title: "Conseil du jour",
        content: tips[Math.floor(Math.random() * tips.length)],
        channel: "in_app",
        tone: "friendly",
        relevanceScore: 0.5,
        priority: "low",
        scheduledFor: new Date(),
        metadata: {},
        generatedBy: ["SmartNotificationsService"],
        timestamp: new Date(),
      });
    }

    return notifications;
  }

  /**
   * Select optimal channel
   */
  private selectChannel(context: NotificationContext): NotificationChannel {
    const preferredChannels = context.preferences.preferredChannels;
    if (preferredChannels.length > 0) {
      return preferredChannels[0];
    }

    // Default to in_app
    return "in_app";
  }

  /**
   * Select optimal tone
   */
  private selectTone(context: NotificationContext): NotificationTone {
    if (this.config.toneAdaptation) {
      if (context.currentEngagement < 0.3) return "motivational";
      if (context.fatigue > 0.6) return "friendly";
      return context.preferences.preferredTone;
    }

    return context.preferences.preferredTone;
  }

  /**
   * Calculate relevance score
   */
  private calculateRelevance(context: NotificationContext, reason: string): number {
    let relevance = 0.5;

    switch (reason) {
      case "practice":
        relevance += context.timeAvailable > 30 ? 0.2 : 0.1;
        relevance += context.currentEngagement * 0.2;
        break;
      case "streak":
        relevance += context.streak * 0.05;
        break;
      case "engagement":
        relevance += (1 - context.currentEngagement) * 0.3;
        break;
      case "achievement":
        relevance += 0.3;
        break;
      case "fatigue":
        relevance += context.fatigue * 0.3;
        break;
      case "disengagement":
        relevance += (1 - context.currentEngagement) * 0.4;
        break;
    }

    return Math.min(1, relevance);
  }

  /**
   * Calculate optimal send time
   */
  private calculateOptimalSendTime(context: NotificationContext, notification: SmartNotification): Date {
    const now = new Date();
    
    // If urgent, send immediately
    if (notification.priority === "high" && notification.type === "warning") {
      return now;
    }

    // If in quiet hours, schedule for after quiet hours
    if (this.config.respectQuietHours && this.isInQuietHours(context)) {
      const [endHour, endMin] = context.preferences.quietHours.end.split(':').map(Number);
      const sendTime = new Date(now);
      sendTime.setHours(endHour, endMin, 0, 0);
      return sendTime;
    }

    // Otherwise, send now
    return now;
  }

  /**
   * Send notification
   */
  async sendNotification(notification: SmartNotification): Promise<void> {
    notification.sentAt = new Date();

    const userNotifications = this.sentNotifications.get(notification.userId) || [];
    userNotifications.push(notification);
    this.sentNotifications.set(notification.userId, userNotifications);

    // In a real implementation, this would actually send the notification
    // via the appropriate channel (email, push, in_app, sms)
  }

  /**
   * Mark notification as read
   */
  markAsRead(userId: string, notificationId: string): void {
    const userNotifications = this.sentNotifications.get(userId);
    if (!userNotifications) return;

    const notification = userNotifications.find(n => n.id === notificationId);
    if (notification) {
      notification.readAt = new Date();
    }

    this.sentNotifications.set(userId, userNotifications);
  }

  /**
   * Dismiss notification
   */
  dismissNotification(userId: string, notificationId: string): void {
    const userNotifications = this.sentNotifications.get(userId);
    if (!userNotifications) return;

    const notification = userNotifications.find(n => n.id === notificationId);
    if (notification) {
      notification.dismissedAt = new Date();
    }

    this.sentNotifications.set(userId, userNotifications);
  }

  /**
   * Get user notifications
   */
  getUserNotifications(userId: string): SmartNotification[] {
    return this.sentNotifications.get(userId) || [];
  }

  /**
   * Get unread notifications
   */
  getUnreadNotifications(userId: string): SmartNotification[] {
    const userNotifications = this.sentNotifications.get(userId) || [];
    return userNotifications.filter(n => !n.readAt && !n.dismissedAt);
  }

  /**
   * Clear daily counts
   */
  clearDailyCounts(): void {
    this.dailyCounts.clear();
  }

  /**
   * Get statistics
   */
  getStatistics(): {
    totalNotifications: number;
    notificationsByType: Record<string, number>;
    notificationsByChannel: Record<string, number>;
    averageRelevance: number;
    readRate: number;
  } {
    const allNotifications = Array.from(this.sentNotifications.values()).flat();
    const totalNotifications = allNotifications.length;

    const notificationsByType: Record<string, number> = {};
    const notificationsByChannel: Record<string, number> = {};

    allNotifications.forEach(notification => {
      notificationsByType[notification.type] = (notificationsByType[notification.type] || 0) + 1;
      notificationsByChannel[notification.channel] = (notificationsByChannel[notification.channel] || 0) + 1;
    });

    const averageRelevance = totalNotifications > 0
      ? allNotifications.reduce((sum, n) => sum + n.relevanceScore, 0) / totalNotifications
      : 0;

    const readNotifications = allNotifications.filter(n => n.readAt).length;
    const readRate = totalNotifications > 0 ? readNotifications / totalNotifications : 0;

    return {
      totalNotifications,
      notificationsByType,
      notificationsByChannel,
      averageRelevance,
      readRate,
    };
  }
}

export const smartNotificationsService = SmartNotificationsService.getInstance();
