import { Controller, Get } from '@nestjs/common';
import { AlertingService } from './alerting.service';
import { CircuitBreakerService } from '../resilience/circuit-breaker.service';

@Controller('dashboard')
export class HealthDashboardController {
  constructor(
    private readonly alerting: AlertingService,
    private readonly circuitBreaker: CircuitBreakerService,
  ) {}

  @Get()
  getDashboard() {
    return {
      timestamp: new Date().toISOString(),
      status: this.getOverallStatus(),
      metrics: {
        red: this.getRedMetrics(),
        use: this.getUseMetrics(),
        business: this.getBusinessMetrics(),
      },
      alerts: this.alerting.getAlertStats(),
      circuitBreakers: this.getCircuitBreakerStatus(),
    };
  }

  @Get('alerts')
  getAlerts() {
    return {
      active: this.alerting.getActiveAlerts(),
      history: this.alerting.getAlertHistory(50),
      stats: this.alerting.getAlertStats(),
    };
  }

  @Get('circuit-breakers')
  getCircuitBreakers() {
    return this.getCircuitBreakerStatus();
  }

  @Get('metrics')
  getMetrics() {
    return {
      red: this.getRedMetrics(),
      use: this.getUseMetrics(),
      business: this.getBusinessMetrics(),
    };
  }

  private getOverallStatus(): 'healthy' | 'degraded' | 'unhealthy' {
    const activeAlerts = this.alerting.getActiveAlerts();
    const criticalAlerts = activeAlerts.filter((a) => a.severity === 'critical');
    const warningAlerts = activeAlerts.filter((a) => a.severity === 'warning');

    if (criticalAlerts.length > 0) {
      return 'unhealthy';
    }

    if (warningAlerts.length > 2) {
      return 'degraded';
    }

    return 'healthy';
  }

  private getRedMetrics() {
    // Return summary of RED metrics
    return {
      status: 'operational',
      description: 'Rate, Errors, Duration metrics are collected via Prometheus',
      endpoint: '/metrics',
    };
  }

  private getUseMetrics() {
    // Return summary of USE metrics
    return {
      status: 'operational',
      description: 'Utilization, Saturation, Errors metrics are collected via Prometheus',
      endpoint: '/metrics',
    };
  }

  private getBusinessMetrics() {
    // Return summary of business metrics
    return {
      status: 'operational',
      description: 'Business metrics are collected via Prometheus',
      endpoint: '/metrics',
    };
  }

  private getCircuitBreakerStatus() {
    const circuits = ['redis', 'database', 'openai', 'graph', 'search', 'matching', 'copilot'];
    const status: Record<string, any> = {};

    circuits.forEach((name) => {
      status[name] = {
        state: this.circuitBreaker.getCircuitState(name),
      };
    });

    return status;
  }
}
