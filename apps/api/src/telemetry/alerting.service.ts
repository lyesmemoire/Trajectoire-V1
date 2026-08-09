import { Injectable, Logger } from '@nestjs/common';
import { MeterProvider, Meter, Gauge } from '@opentelemetry/api';

export interface AlertRule {
  name: string;
  metric: string;
  threshold: number;
  operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte';
  severity: 'critical' | 'warning' | 'info';
  enabled: boolean;
}

export interface Alert {
  id: string;
  rule: string;
  severity: string;
  value: number;
  threshold: number;
  timestamp: Date;
  resolved: boolean;
}

@Injectable()
export class AlertingService {
  private readonly logger = new Logger(AlertingService.name);
  private meter: Meter | null = null;
  private rules: Map<string, AlertRule> = new Map();
  private activeAlerts: Map<string, Alert> = new Map();
  private alertHistory: Alert[] = [];

  constructor() {
    this.initializeDefaultRules();
  }

  setMeterProvider(meterProvider: MeterProvider) {
    this.meter = meterProvider.getMeter('alerting');
  }

  private initializeDefaultRules() {
    // CPU usage alert
    this.addRule({
      name: 'high_cpu_usage',
      metric: 'cpu_usage_percent',
      threshold: 80,
      operator: 'gt',
      severity: 'warning',
      enabled: true,
    });

    // Critical CPU usage alert
    this.addRule({
      name: 'critical_cpu_usage',
      metric: 'cpu_usage_percent',
      threshold: 95,
      operator: 'gt',
      severity: 'critical',
      enabled: true,
    });

    // Memory usage alert
    this.addRule({
      name: 'high_memory_usage',
      metric: 'memory_usage_percent',
      threshold: 85,
      operator: 'gt',
      severity: 'warning',
      enabled: true,
    });

    // Critical memory usage alert
    this.addRule({
      name: 'critical_memory_usage',
      metric: 'memory_usage_percent',
      threshold: 95,
      operator: 'gt',
      severity: 'critical',
      enabled: true,
    });

    // Error rate alert
    this.addRule({
      name: 'high_error_rate',
      metric: 'error_rate',
      threshold: 5,
      operator: 'gt',
      severity: 'warning',
      enabled: true,
    });

    // Critical error rate alert
    this.addRule({
      name: 'critical_error_rate',
      metric: 'error_rate',
      threshold: 10,
      operator: 'gt',
      severity: 'critical',
      enabled: true,
    });

    // Latency alert
    this.addRule({
      name: 'high_latency',
      metric: 'latency_p99',
      threshold: 1000,
      operator: 'gt',
      severity: 'warning',
      enabled: true,
    });

    // Disk usage alert
    this.addRule({
      name: 'high_disk_usage',
      metric: 'disk_usage_percent',
      threshold: 90,
      operator: 'gt',
      severity: 'warning',
      enabled: true,
    });
  }

  addRule(rule: AlertRule) {
    this.rules.set(rule.name, rule);
    this.logger.log(`Alert rule added: ${rule.name}`);
  }

  removeRule(name: string) {
    this.rules.delete(name);
    this.logger.log(`Alert rule removed: ${name}`);
  }

  enableRule(name: string) {
    const rule = this.rules.get(name);
    if (rule) {
      rule.enabled = true;
      this.logger.log(`Alert rule enabled: ${name}`);
    }
  }

  disableRule(name: string) {
    const rule = this.rules.get(name);
    if (rule) {
      rule.enabled = false;
      this.logger.log(`Alert rule disabled: ${name}`);
    }
  }

  evaluateRule(rule: AlertRule, value: number): boolean {
    if (!rule.enabled) return false;

    switch (rule.operator) {
      case 'gt':
        return value > rule.threshold;
      case 'lt':
        return value < rule.threshold;
      case 'eq':
        return value === rule.threshold;
      case 'gte':
        return value >= rule.threshold;
      case 'lte':
        return value <= rule.threshold;
      default:
        return false;
    }
  }

  checkMetric(metricName: string, value: number) {
    for (const [ruleName, rule] of this.rules.entries()) {
      if (rule.metric === metricName && this.evaluateRule(rule, value)) {
        this.triggerAlert(rule, value);
      } else if (rule.metric === metricName && !this.evaluateRule(rule, value)) {
        this.resolveAlert(ruleName);
      }
    }
  }

  private triggerAlert(rule: AlertRule, value: number) {
    const alertId = `${rule.name}-${Date.now()}`;
    const alert: Alert = {
      id: alertId,
      rule: rule.name,
      severity: rule.severity,
      value,
      threshold: rule.threshold,
      timestamp: new Date(),
      resolved: false,
    };

    this.activeAlerts.set(rule.name, alert);
    this.alertHistory.push(alert);

    this.logger.error(
      `ALERT TRIGGERED [${rule.severity.toUpperCase()}] ${rule.name}: Value ${value} ${rule.operator} threshold ${rule.threshold}`,
    );

    // In production, you would send notifications here (email, Slack, PagerDuty, etc.)
  }

  private resolveAlert(ruleName: string) {
    const alert = this.activeAlerts.get(ruleName);
    if (alert && !alert.resolved) {
      alert.resolved = true;
      this.logger.log(`ALERT RESOLVED: ${ruleName}`);
    }
  }

  getActiveAlerts(): Alert[] {
    return Array.from(this.activeAlerts.values()).filter((a) => !a.resolved);
  }

  getAlertHistory(limit: number = 100): Alert[] {
    return this.alertHistory.slice(-limit);
  }

  getAlertStats() {
    const active = this.getActiveAlerts();
    const history = this.getAlertHistory();

    return {
      active: active.length,
      critical: active.filter((a) => a.severity === 'critical').length,
      warning: active.filter((a) => a.severity === 'warning').length,
      info: active.filter((a) => a.severity === 'info').length,
      total: history.length,
    };
  }

  recordAlertMetric(severity: string) {
    if (!this.meter) return;
    const gauge = this.meter.createGauge('active_alerts', {
      description: 'Number of active alerts',
    });
    const stats = this.getAlertStats();
    gauge.record(stats.active, { severity });
  }
}
