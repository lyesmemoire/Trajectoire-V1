/**
 * Retention Analytics
 * Analytics for user retention
 * Tracks: Day 1, Day 7, Day 30 retention rates
 */

import { z } from "zod";

// User Activity Data
export interface UserActivity {
  userId: string;
  firstActivityDate: Date;
  lastActivityDate: Date;
  totalActivities: number;
  activitiesByDate: Map<string, number>; // date string -> count
  isDay1Active: boolean;
  isDay7Active: boolean;
  isDay30Active: boolean;
}

// Retention Metrics
export interface RetentionMetrics {
  totalUsers: number;
  day1Retention: number; // 0-1
  day7Retention: number; // 0-1
  day30Retention: number; // 0-1
  averageActivitiesPerUser: number;
  averageSessionDuration: number;
  retentionByCohort: Array<{
    cohortDate: string;
    cohortSize: number;
    day1Retention: number;
    day7Retention: number;
    day30Retention: number;
  }>;
  churnRate: number; // 0-1
  returningUsers: number;
  newUsers: number;
}

export class RetentionAnalytics {
  private static instance: RetentionAnalytics;
  private userActivities: Map<string, UserActivity> = new Map();

  private constructor() {}

  static getInstance(): RetentionAnalytics {
    if (!RetentionAnalytics.instance) {
      RetentionAnalytics.instance = new RetentionAnalytics();
    }
    return RetentionAnalytics.instance;
  }

  /**
   * Track user activity
   */
  trackActivity(userId: string, activityType: string): void {
    const today = new Date().toISOString().split('T')[0];
    
    let userActivity = this.userActivities.get(userId);
    
    if (!userActivity) {
      userActivity = {
        userId,
        firstActivityDate: new Date(),
        lastActivityDate: new Date(),
        totalActivities: 0,
        activitiesByDate: new Map(),
        isDay1Active: false,
        isDay7Active: false,
        isDay30Active: false,
      };
      this.userActivities.set(userId, userActivity);
    }

    userActivity.lastActivityDate = new Date();
    userActivity.totalActivities++;
    
    const todayCount = userActivity.activitiesByDate.get(today) || 0;
    userActivity.activitiesByDate.set(today, todayCount + 1);

    // Check retention milestones
    const daysSinceFirst = Math.floor(
      (new Date().getTime() - userActivity.firstActivityDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceFirst >= 1) {
      userActivity.isDay1Active = true;
    }
    if (daysSinceFirst >= 7) {
      userActivity.isDay7Active = true;
    }
    if (daysSinceFirst >= 30) {
      userActivity.isDay30Active = true;
    }
  }

  /**
   * Get user activity
   */
  getUserActivity(userId: string): UserActivity | null {
    return this.userActivities.get(userId) || null;
  }

  /**
   * Calculate retention metrics
   */
  calculateMetrics(): RetentionMetrics {
    const users = Array.from(this.userActivities.values());
    
    if (users.length === 0) {
      return {
        totalUsers: 0,
        day1Retention: 0,
        day7Retention: 0,
        day30Retention: 0,
        averageActivitiesPerUser: 0,
        averageSessionDuration: 0,
        retentionByCohort: [],
        churnRate: 0,
        returningUsers: 0,
        newUsers: 0,
      };
    }

    const totalUsers = users.length;
    const day1ActiveUsers = users.filter(u => u.isDay1Active).length;
    const day7ActiveUsers = users.filter(u => u.isDay7Active).length;
    const day30ActiveUsers = users.filter(u => u.isDay30Active).length;

    const day1Retention = day1ActiveUsers / totalUsers;
    const day7Retention = day7ActiveUsers / totalUsers;
    const day30Retention = day30ActiveUsers / totalUsers;

    const totalActivities = users.reduce((sum, u) => sum + u.totalActivities, 0);
    const averageActivitiesPerUser = totalActivities / totalUsers;

    // Calculate average session duration (mock - would come from session analytics)
    const averageSessionDuration = 300; // 5 minutes average

    // Retention by cohort (grouped by first activity date)
    const cohorts: Map<string, UserActivity[]> = new Map();
    users.forEach(user => {
      const cohortDate = user.firstActivityDate.toISOString().split('T')[0];
      if (!cohorts.has(cohortDate)) {
        cohorts.set(cohortDate, []);
      }
      cohorts.get(cohortDate)!.push(user);
    });

    const retentionByCohort = Array.from(cohorts.entries())
      .map(([cohortDate, cohortUsers]) => {
        const cohortSize = cohortUsers.length;
        const cohortDay1 = cohortUsers.filter(u => u.isDay1Active).length / cohortSize;
        const cohortDay7 = cohortUsers.filter(u => u.isDay7Active).length / cohortSize;
        const cohortDay30 = cohortUsers.filter(u => u.isDay30Active).length / cohortSize;

        return {
          cohortDate,
          cohortSize,
          day1Retention: cohortDay1,
          day7Retention: cohortDay7,
          day30Retention: cohortDay30,
        };
      })
      .sort((a, b) => b.cohortDate.localeCompare(a.cohortDate))
      .slice(0, 30); // Last 30 cohorts

    // Churn rate (users who haven't returned in 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const churnedUsers = users.filter(u => u.lastActivityDate < sevenDaysAgo).length;
    const churnRate = churnedUsers / totalUsers;

    // Returning users (users with more than 1 activity)
    const returningUsers = users.filter(u => u.totalActivities > 1).length;
    const newUsers = users.filter(u => u.totalActivities === 1).length;

    return {
      totalUsers,
      day1Retention,
      day7Retention,
      day30Retention,
      averageActivitiesPerUser,
      averageSessionDuration,
      retentionByCohort,
      churnRate,
      returningUsers,
      newUsers,
    };
  }

  /**
   * Get retention for specific user
   */
  getUserRetention(userId: string): {
    isDay1Active: boolean;
    isDay7Active: boolean;
    isDay30Active: boolean;
    daysSinceFirstActivity: number;
    totalActivities: number;
    lastActivityDaysAgo: number;
  } | null {
    const userActivity = this.userActivities.get(userId);
    if (!userActivity) return null;

    const daysSinceFirstActivity = Math.floor(
      (new Date().getTime() - userActivity.firstActivityDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    const lastActivityDaysAgo = Math.floor(
      (new Date().getTime() - userActivity.lastActivityDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    return {
      isDay1Active: userActivity.isDay1Active,
      isDay7Active: userActivity.isDay7Active,
      isDay30Active: userActivity.isDay30Active,
      daysSinceFirstActivity,
      totalActivities: userActivity.totalActivities,
      lastActivityDaysAgo,
    };
  }

  /**
   * Get users at risk of churn (inactive for 7+ days)
   */
  getUsersAtRisk(): Array<{
    userId: string;
    lastActivityDate: Date;
    daysInactive: number;
    totalActivities: number;
  }> {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return Array.from(this.userActivities.values())
      .filter(user => user.lastActivityDate < sevenDaysAgo)
      .map(user => ({
        userId: user.userId,
        lastActivityDate: user.lastActivityDate,
        daysInactive: Math.floor(
          (new Date().getTime() - user.lastActivityDate.getTime()) / (1000 * 60 * 60 * 24)
        ),
        totalActivities: user.totalActivities,
      }))
      .sort((a, b) => b.daysInactive - a.daysInactive);
  }

  /**
   * Clear user activity
   */
  clearUserActivity(userId: string): void {
    this.userActivities.delete(userId);
  }

  /**
   * Clear all user activities
   */
  clearAllActivities(): void {
    this.userActivities.clear();
  }
}

export const retentionAnalytics = RetentionAnalytics.getInstance();
