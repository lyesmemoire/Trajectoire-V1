/**
 * Smart Notifications Interfaces
 * Intelligent notification engine
 */

import { z } from "zod";

// ============================================================================
// NOTIFICATION TYPE
// ============================================================================

export type NotificationType = 
  | "reminder"
  | "encouragement"
  | "milestone"
  | "warning"
  | "tip"
  | "update"
  | "achievement";

// ============================================================================
// NOTIFICATION CHANNEL
// ============================================================================

export type NotificationChannel = "email" | "push" | "in_app" | "sms";

// ============================================================================
// NOTIFICATION TONE
// ============================================================================

export type NotificationTone = "formal" | "friendly" | "motivational" | "urgent";

// ============================================================================
// SMART NOTIFICATION
// ============================================================================

export interface SmartNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  content: string;
  channel: NotificationChannel;
  tone: NotificationTone;
  relevanceScore: number; // 0-1
  priority: "low" | "medium" | "high";
  scheduledFor: Date;
  sentAt?: Date;
  readAt?: Date;
  dismissedAt?: Date;
  metadata: Record<string, any>;
  generatedBy: string[];
  timestamp: Date;
}

export const SmartNotificationSchema = z.object({
  id: z.string(),
  userId: z.string(),
  type: z.enum(["reminder", "encouragement", "milestone", "warning", "tip", "update", "achievement"]),
  title: z.string(),
  content: z.string(),
  channel: z.enum(["email", "push", "in_app", "sms"]),
  tone: z.enum(["formal", "friendly", "motivational", "urgent"]),
  relevanceScore: z.number(),
  priority: z.enum(["low", "medium", "high"]),
  scheduledFor: z.date(),
  sentAt: z.date().optional(),
  readAt: z.date().optional(),
  dismissedAt: z.date().optional(),
  metadata: z.record(z.string(), z.any()),
  generatedBy: z.array(z.string()),
  timestamp: z.date(),
});

// ============================================================================
// NOTIFICATION CONTEXT
// ============================================================================

export interface NotificationContext {
  userId: string;
  currentEngagement: number; // 0-1
  fatigue: number; // 0-1
  streak: number;
  lastActivity: Date;
  timeAvailable: number; // minutes
  objective: string;
  preferences: {
    preferredChannels: NotificationChannel[];
    preferredTone: NotificationTone;
    quietHours: { start: string; end: string };
    maxDailyNotifications: number;
  };
}

export const NotificationContextSchema = z.object({
  userId: z.string(),
  currentEngagement: z.number(),
  fatigue: z.number(),
  streak: z.number(),
  lastActivity: z.date(),
  timeAvailable: z.number(),
  objective: z.string(),
  preferences: z.object({
    preferredChannels: z.array(z.enum(["email", "push", "in_app", "sms"])),
    preferredTone: z.enum(["formal", "friendly", "motivational", "urgent"]),
    quietHours: z.object({
      start: z.string(),
      end: z.string(),
    }),
    maxDailyNotifications: z.number(),
  }),
});

// ============================================================================
// SMART NOTIFICATIONS CONFIG
// ============================================================================

export interface SmartNotificationsConfig {
  minRelevanceThreshold: number;
  maxDailyNotifications: number;
  minIntervalBetweenNotifications: number; // hours
  respectQuietHours: boolean;
  adaptiveFrequency: boolean;
  channelWeights: Record<NotificationChannel, number>;
  toneAdaptation: boolean;
}

export const SmartNotificationsConfigSchema = z.object({
  minRelevanceThreshold: z.number(),
  maxDailyNotifications: z.number(),
  minIntervalBetweenNotifications: z.number(),
  respectQuietHours: z.boolean(),
  adaptiveFrequency: z.boolean(),
  channelWeights: z.record(z.enum(["email", "push", "in_app", "sms"]), z.number()),
  toneAdaptation: z.boolean(),
});

export const defaultSmartNotificationsConfig: SmartNotificationsConfig = {
  minRelevanceThreshold: 0.6,
  maxDailyNotifications: 5,
  minIntervalBetweenNotifications: 2,
  respectQuietHours: true,
  adaptiveFrequency: true,
  channelWeights: {
    email: 0.2,
    push: 0.4,
    in_app: 0.35,
    sms: 0.05,
  },
  toneAdaptation: true,
};
