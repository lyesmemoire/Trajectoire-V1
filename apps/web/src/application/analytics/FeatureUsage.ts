/**
 * Feature Usage Analytics
 * Analytics for feature usage tracking
 * Tracks: which features are used, how often, by whom
 */

import { z } from "zod";

// Feature Usage Data
export interface FeatureUsageData {
  featureName: string;
  userId: string;
  sessionId: string;
  timestamp: Date;
  duration?: number; // seconds
  metadata?: Record<string, any>;
}

// Feature Metrics
export interface FeatureMetrics {
  totalFeatureUses: number;
  featuresByUsage: Array<{
    featureName: string;
    usageCount: number;
    uniqueUsers: number;
    averageDuration: number;
    percentage: number;
  }>;
  featuresByUser: Record<string, number>; // userId -> feature count
  mostUsedFeatures: Array<{
    featureName: string;
    usageCount: number;
  }>;
  leastUsedFeatures: Array<{
    featureName: string;
    usageCount: number;
  }>;
  featureAdoptionRate: number; // 0-1
  averageFeaturesPerSession: number;
  featureUsageTrends: Array<{
    featureName: string;
    trend: "increasing" | "decreasing" | "stable";
    changePercentage: number;
  }>;
}

export class FeatureUsage {
  private static instance: FeatureUsage;
  private featureUsages: FeatureUsageData[] = [];

  private constructor() {}

  static getInstance(): FeatureUsage {
    if (!FeatureUsage.instance) {
      FeatureUsage.instance = new FeatureUsage();
    }
    return FeatureUsage.instance;
  }

  /**
   * Track feature usage
   */
  trackFeatureUsage(
    featureName: string,
    userId: string,
    sessionId: string,
    duration?: number,
    metadata?: Record<string, any>
  ): void {
    const usage: FeatureUsageData = {
      featureName,
      userId,
      sessionId,
      timestamp: new Date(),
      duration,
      metadata,
    };

    this.featureUsages.push(usage);
  }

  /**
   * Get feature usage for specific feature
   */
  getFeatureUsage(featureName: string): FeatureUsageData[] {
    return this.featureUsages.filter(u => u.featureName === featureName);
  }

  /**
   * Get feature usage for specific user
   */
  getUserFeatureUsage(userId: string): FeatureUsageData[] {
    return this.featureUsages.filter(u => u.userId === userId);
  }

  /**
   * Calculate feature metrics
   */
  calculateMetrics(): FeatureMetrics {
    const totalFeatureUses = this.featureUsages.length;

    // Features by usage
    const featureCounts: Map<string, { count: number; users: Set<string>; totalDuration: number }> = new Map();

    this.featureUsages.forEach(usage => {
      const existing = featureCounts.get(usage.featureName);
      if (existing) {
        existing.count++;
        existing.users.add(usage.userId);
        existing.totalDuration += usage.duration || 0;
      } else {
        featureCounts.set(usage.featureName, {
          count: 1,
          users: new Set([usage.userId]),
          totalDuration: usage.duration || 0,
        });
      }
    });

    const featuresByUsage = Array.from(featureCounts.entries())
      .map(([featureName, data]) => ({
        featureName,
        usageCount: data.count,
        uniqueUsers: data.users.size,
        averageDuration: data.count > 0 ? data.totalDuration / data.count : 0,
        percentage: totalFeatureUses > 0 ? (data.count / totalFeatureUses) * 100 : 0,
      }))
      .sort((a, b) => b.usageCount - a.usageCount);

    // Features by user
    const featuresByUser: Record<string, number> = {};
    this.featureUsages.forEach(usage => {
      featuresByUser[usage.userId] = (featuresByUser[usage.userId] || 0) + 1;
    });

    // Most used features
    const mostUsedFeatures = featuresByUsage
      .slice(0, 10)
      .map(f => ({
        featureName: f.featureName,
        usageCount: f.usageCount,
      }));

    // Least used features
    const leastUsedFeatures = featuresByUsage
      .slice(-10)
      .reverse()
      .map(f => ({
        featureName: f.featureName,
        usageCount: f.usageCount,
      }));

    // Feature adoption rate (percentage of users who used at least one feature)
    const uniqueUsers = new Set(this.featureUsages.map(u => u.userId)).size;
    const totalUsers = uniqueUsers; // This would come from user analytics
    const featureAdoptionRate = totalUsers > 0 ? uniqueUsers / totalUsers : 0;

    // Average features per session
    const sessions = new Set(this.featureUsages.map(u => u.sessionId)).size;
    const averageFeaturesPerSession = sessions > 0 ? totalFeatureUses / sessions : 0;

    // Feature usage trends (mock - would require historical data)
    const featureUsageTrends = featuresByUsage.slice(0, 5).map(f => ({
      featureName: f.featureName,
      trend: "stable" as const,
      changePercentage: 0,
    }));

    return {
      totalFeatureUses,
      featuresByUsage,
      featuresByUser,
      mostUsedFeatures,
      leastUsedFeatures,
      featureAdoptionRate,
      averageFeaturesPerSession,
      featureUsageTrends,
    };
  }

  /**
   * Get feature adoption for specific feature
   */
  getFeatureAdoption(featureName: string): {
    totalUsers: number;
    usersWhoUsedFeature: number;
    adoptionRate: number;
  } {
    const uniqueUsers = new Set(this.featureUsages.map(u => u.userId)).size;
    const featureUsers = new Set(
      this.featureUsages
        .filter(u => u.featureName === featureName)
        .map(u => u.userId)
    ).size;

    return {
      totalUsers: uniqueUsers,
      usersWhoUsedFeature: featureUsers,
      adoptionRate: uniqueUsers > 0 ? featureUsers / uniqueUsers : 0,
    };
  }

  /**
   * Get feature usage over time
   */
  getFeatureUsageOverTime(
    featureName: string,
    startDate: Date,
    endDate: Date
  ): Array<{
    date: string;
    usageCount: number;
  }> {
    const usageByDate: Record<string, number> = {};

    this.featureUsages
      .filter(u => 
        u.featureName === featureName &&
        u.timestamp >= startDate &&
        u.timestamp <= endDate
      )
      .forEach(usage => {
        const date = usage.timestamp.toISOString().split('T')[0];
        usageByDate[date] = (usageByDate[date] || 0) + 1;
      });

    return Object.entries(usageByDate)
      .map(([date, count]) => ({ date, usageCount: count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  /**
   * Clear feature usage data
   */
  clearFeatureUsage(): void {
    this.featureUsages = [];
  }
}

export const featureUsage = FeatureUsage.getInstance();
