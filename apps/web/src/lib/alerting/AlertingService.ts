/**
 * Alerting Service
 * Sends alerts to Slack, Discord, Email, Webhook for incidents
 * Supports multiple alert channels and severity levels
 */

import { logger } from "@/lib/logger/Logger";

export interface Alert {
  severity: "info" | "warning" | "error" | "critical";
  title: string;
  message: string;
  metadata?: Record<string, unknown>;
  timestamp: Date;
}

export interface AlertChannel {
  type: "slack" | "discord" | "email" | "webhook";
  enabled: boolean;
  config: Record<string, unknown>;
}

export class AlertingService {
  private static instance: AlertingService;
  private channels: AlertChannel[] = [];

  private constructor() {
    this.initializeChannels();
  }

  static getInstance(): AlertingService {
    if (!AlertingService.instance) {
      AlertingService.instance = new AlertingService();
    }
    return AlertingService.instance;
  }

  /**
   * Initialize alert channels from environment variables
   */
  private initializeChannels(): void {
    // Slack
    if (process.env.SLACK_WEBHOOK_URL) {
      this.channels.push({
        type: "slack",
        enabled: true,
        config: {
          webhookUrl: process.env.SLACK_WEBHOOK_URL,
          channel: process.env.SLACK_CHANNEL || "#alerts",
        },
      });
    }

    // Discord
    if (process.env.DISCORD_WEBHOOK_URL) {
      this.channels.push({
        type: "discord",
        enabled: true,
        config: {
          webhookUrl: process.env.DISCORD_WEBHOOK_URL,
        },
      });
    }

    // Email
    if (process.env.ALERT_EMAIL_TO) {
      this.channels.push({
        type: "email",
        enabled: true,
        config: {
          to: process.env.ALERT_EMAIL_TO.split(","),
          from: process.env.ALERT_EMAIL_FROM || "alerts@trajectoire.com",
        },
      });
    }

    // Webhook
    if (process.env.ALERT_WEBHOOK_URL) {
      this.channels.push({
        type: "webhook",
        enabled: true,
        config: {
          url: process.env.ALERT_WEBHOOK_URL,
        },
      });
    }
  }

  /**
   * Send an alert
   */
  async sendAlert(alert: Alert): Promise<void> {
    logger.info(`[${alert.severity.toUpperCase()}] ${alert.title}: ${alert.message}`, { 
      severity: alert.severity,
      metadata: alert.metadata 
    });

    for (const channel of this.channels) {
      if (!channel.enabled) continue;

      try {
        await this.sendToChannel(channel, alert);
      } catch (error) {
        logger.error(`Failed to send alert to ${channel.type}`, { error, channelType: channel.type });
      }
    }
  }

  /**
   * Send alert to specific channel
   */
  private async sendToChannel(channel: AlertChannel, alert: Alert): Promise<void> {
    switch (channel.type) {
      case "slack":
        await this.sendSlackAlert(channel.config, alert);
        break;
      case "discord":
        await this.sendDiscordAlert(channel.config, alert);
        break;
      case "email":
        await this.sendEmailAlert(channel.config, alert);
        break;
      case "webhook":
        await this.sendWebhookAlert(channel.config, alert);
        break;
    }
  }

  /**
   * Send Slack alert
   */
  private async sendSlackAlert(config: Record<string, unknown>, alert: Alert): Promise<void> {
    const color = this.getSeverityColor(alert.severity);
    
    const payload = {
      channel: config.channel,
      attachments: [
        {
          color,
          title: alert.title,
          text: alert.message,
          fields: alert.metadata ? Object.entries(alert.metadata).map(([key, value]) => ({
            title: key,
            value: String(value),
            short: true,
          })) : undefined,
          footer: `Trajectoire Alerts • ${alert.timestamp.toISOString()}`,
        },
      ],
    };

    const response = await fetch(config.webhookUrl as string, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Slack webhook failed: ${response.statusText}`);
    }
  }

  /**
   * Send Discord alert
   */
  private async sendDiscordAlert(config: Record<string, unknown>, alert: Alert): Promise<void> {
    const color = this.getSeverityColor(alert.severity);
    
    const payload = {
      embeds: [
        {
          title: alert.title,
          description: alert.message,
          color: this.hexToColorCode(color),
          fields: alert.metadata ? Object.entries(alert.metadata).map(([key, value]) => ({
            name: key,
            value: String(value),
            inline: true,
          })) : undefined,
          timestamp: alert.timestamp.toISOString(),
        },
      ],
    };

    const response = await fetch(config.webhookUrl as string, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Discord webhook failed: ${response.statusText}`);
    }
  }

  /**
   * Send email alert
   */
  private async sendEmailAlert(config: Record<string, unknown>, alert: Alert): Promise<void> {
    // Placeholder for email sending
    // In production, use a service like SendGrid, AWS SES, or Resend
    logger.debug(`Email alert to ${(config.to as string[]).join(", ")}: ${alert.title}`, { 
      to: (config.to as string[]), 
      title: alert.title 
    });
  }

  /**
   * Send webhook alert
   */
  private async sendWebhookAlert(config: Record<string, unknown>, alert: Alert): Promise<void> {
    const payload = {
      severity: alert.severity,
      title: alert.title,
      message: alert.message,
      metadata: alert.metadata,
      timestamp: alert.timestamp.toISOString(),
    };

    const response = await fetch(config.url as string, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Webhook failed: ${response.statusText}`);
    }
  }

  /**
   * Get severity color for Slack
   */
  private getSeverityColor(severity: Alert["severity"]): string {
    const colors = {
      info: "#36a64f", // green
      warning: "#ff9900", // orange
      error: "#ff0000", // red
      critical: "#000000", // black
    };
    return colors[severity];
  }

  /**
   * Convert hex color to Discord color code
   */
  private hexToColorCode(hex: string): number {
    return parseInt(hex.replace("#", ""), 16);
  }

  /**
   * Convenience method for info alerts
   */
  async info(title: string, message: string, metadata?: Record<string, unknown>): Promise<void> {
    await this.sendAlert({
      severity: "info",
      title,
      message,
      metadata,
      timestamp: new Date(),
    });
  }

  /**
   * Convenience method for warning alerts
   */
  async warning(title: string, message: string, metadata?: Record<string, unknown>): Promise<void> {
    await this.sendAlert({
      severity: "warning",
      title,
      message,
      metadata,
      timestamp: new Date(),
    });
  }

  /**
   * Convenience method for error alerts
   */
  async error(title: string, message: string, metadata?: Record<string, unknown>): Promise<void> {
    await this.sendAlert({
      severity: "error",
      title,
      message,
      metadata,
      timestamp: new Date(),
    });
  }

  /**
   * Convenience method for critical alerts
   */
  async critical(title: string, message: string, metadata?: Record<string, unknown>): Promise<void> {
    await this.sendAlert({
      severity: "critical",
      title,
      message,
      metadata,
      timestamp: new Date(),
    });
  }

  /**
   * Alert condition helpers
   */
  async alertIf(condition: boolean, alert: Alert): Promise<void> {
    if (condition) {
      await this.sendAlert(alert);
    }
  }

  async alertIfErrorRate(errorRate: number, threshold: number = 0.05): Promise<void> {
    if (errorRate > threshold) {
      await this.error(
        "High Error Rate",
        `Error rate is ${(errorRate * 100).toFixed(2)}% (threshold: ${(threshold * 100).toFixed(2)}%)`,
        { errorRate, threshold }
      );
    }
  }

  async alertIfTimeoutRate(timeoutRate: number, threshold: number = 0.01): Promise<void> {
    if (timeoutRate > threshold) {
      await this.warning(
        "High Timeout Rate",
        `Timeout rate is ${(timeoutRate * 100).toFixed(2)}% (threshold: ${(threshold * 100).toFixed(2)}%)`,
        { timeoutRate, threshold }
      );
    }
  }

  async alertIfServiceDown(service: string, isDown: boolean): Promise<void> {
    if (isDown) {
      await this.critical(
        "Service Down",
        `${service} is down or unreachable`,
        { service, timestamp: new Date().toISOString() }
      );
    }
  }
}

// Export singleton instance
export const alertingService = AlertingService.getInstance();
