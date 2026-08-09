import { Injectable } from '@nestjs/common';
import { MeterProvider, Meter } from '@opentelemetry/api';

@Injectable()
export class BusinessMetricsService {
  private meter: Meter | null = null;

  constructor() {
    // This will be initialized with the OpenTelemetry meter
  }

  setMeterProvider(meterProvider: MeterProvider) {
    this.meter = meterProvider.getMeter('business-metrics');
    this.initializeMetrics();
  }

  private initializeMetrics() {
    if (!this.meter) return;
    // Business metrics are created on demand
  }

  // User-related metrics
  recordUserRegistration(_userId: string, method: string) {
    if (!this.meter) return;
    const counter = this.meter.createCounter('user_registrations_total', {
      description: 'Total user registrations',
    });
    counter.add(1, { method });
  }

  recordUserLogin(_userId: string, method: string, success: boolean) {
    if (!this.meter) return;
    const counter = this.meter.createCounter('user_logins_total', {
      description: 'Total user logins',
    });
    counter.add(1, { method, success: success.toString() });
  }

  recordUserLogout(_userId: string) {
    if (!this.meter) return;
    const counter = this.meter.createCounter('user_logouts_total', {
      description: 'Total user logouts',
    });
    counter.add(1);
  }

  // Interview-related metrics
  recordInterviewCreated(_interviewId: string, type: string) {
    if (!this.meter) return;
    const counter = this.meter.createCounter('interviews_created_total', {
      description: 'Total interviews created',
    });
    counter.add(1, { type });
  }

  recordInterviewCompleted(_interviewId: string, duration: number, score: number) {
    if (!this.meter) return;
    const counter = this.meter.createCounter('interviews_completed_total', {
      description: 'Total interviews completed',
    });
    counter.add(1);

    const histogram = this.meter.createHistogram('interview_duration_seconds', {
      description: 'Interview duration in seconds',
      unit: 's',
    });
    histogram.record(duration);

    const gauge = this.meter.createGauge('interview_score', {
      description: 'Interview score',
    });
    gauge.record(score);
  }

  recordInterviewAbandoned(_interviewId: string, stage: string) {
    if (!this.meter) return;
    const counter = this.meter.createCounter('interviews_abandoned_total', {
      description: 'Total interviews abandoned',
    });
    counter.add(1, { stage });
  }

  // Graph-related metrics
  recordGraphCreated(_graphId: string, nodeCount: number, edgeCount: number) {
    if (!this.meter) return;
    const counter = this.meter.createCounter('graphs_created_total', {
      description: 'Total graphs created',
    });
    counter.add(1);

    const gauge = this.meter.createGauge('graph_node_count', {
      description: 'Number of nodes in graph',
    });
    gauge.record(nodeCount);

    const edgeGauge = this.meter.createGauge('graph_edge_count', {
      description: 'Number of edges in graph',
    });
    edgeGauge.record(edgeCount);
  }

  recordGraphQuery(_graphId: string, queryType: string, duration: number, resultCount: number) {
    if (!this.meter) return;
    const counter = this.meter.createCounter('graph_queries_total', {
      description: 'Total graph queries',
    });
    counter.add(1, { query_type: queryType });

    const histogram = this.meter.createHistogram('graph_query_duration_ms', {
      description: 'Graph query duration in milliseconds',
      unit: 'ms',
    });
    histogram.record(duration);

    const resultGauge = this.meter.createGauge('graph_query_result_count', {
      description: 'Number of results from graph query',
    });
    resultGauge.record(resultCount);
  }

  // Search-related metrics
  recordSearchPerformed(_query: string, index: string, resultCount: number, duration: number) {
    if (!this.meter) return;
    const counter = this.meter.createCounter('searches_performed_total', {
      description: 'Total searches performed',
    });
    counter.add(1, { index });

    const histogram = this.meter.createHistogram('search_duration_ms', {
      description: 'Search duration in milliseconds',
      unit: 'ms',
    });
    histogram.record(duration);

    const resultGauge = this.meter.createGauge('search_result_count', {
      description: 'Number of search results',
    });
    resultGauge.record(resultCount);
  }

  recordSearchClick(_resultId: string, position: number) {
    if (!this.meter) return;
    const counter = this.meter.createCounter('search_clicks_total', {
      description: 'Total search result clicks',
    });
    counter.add(1, { position: position.toString() });
  }

  // Matching-related metrics
  recordMatchingPerformed(_candidateId: string, _jobId: string, score: number, duration: number) {
    if (!this.meter) return;
    const counter = this.meter.createCounter('matchings_performed_total', {
      description: 'Total matchings performed',
    });
    counter.add(1);

    const histogram = this.meter.createHistogram('matching_duration_ms', {
      description: 'Matching duration in milliseconds',
      unit: 'ms',
    });
    histogram.record(duration);

    const scoreGauge = this.meter.createGauge('matching_score', {
      description: 'Matching score',
    });
    scoreGauge.record(score);
  }

  recordMatchAccepted(_matchId: string) {
    if (!this.meter) return;
    const counter = this.meter.createCounter('matches_accepted_total', {
      description: 'Total matches accepted',
    });
    counter.add(1);
  }

  recordMatchRejected(_matchId: string, reason: string) {
    if (!this.meter) return;
    const counter = this.meter.createCounter('matches_rejected_total', {
      description: 'Total matches rejected',
    });
    counter.add(1, { reason });
  }

  // Copilot-related metrics
  recordCopilotQuery(_sessionId: string, queryType: string, duration: number, tokensUsed: number) {
    if (!this.meter) return;
    const counter = this.meter.createCounter('copilot_queries_total', {
      description: 'Total copilot queries',
    });
    counter.add(1, { query_type: queryType });

    const histogram = this.meter.createHistogram('copilot_query_duration_ms', {
      description: 'Copilot query duration in milliseconds',
      unit: 'ms',
    });
    histogram.record(duration);

    const tokenGauge = this.meter.createGauge('copilot_tokens_used', {
      description: 'Tokens used in copilot query',
    });
    tokenGauge.record(tokensUsed);
  }

  recordCopilotFeedback(_sessionId: string, rating: number, helpful: boolean) {
    if (!this.meter) return;
    const counter = this.meter.createCounter('copilot_feedback_total', {
      description: 'Total copilot feedback',
    });
    counter.add(1, { helpful: helpful.toString() });

    const ratingGauge = this.meter.createGauge('copilot_rating', {
      description: 'Copilot rating',
    });
    ratingGauge.record(rating);
  }

  // Revenue-related metrics
  recordSubscriptionCreated(_userId: string, plan: string, amount: number) {
    if (!this.meter) return;
    const counter = this.meter.createCounter('subscriptions_created_total', {
      description: 'Total subscriptions created',
    });
    counter.add(1, { plan });

    const revenueGauge = this.meter.createGauge('revenue', {
      description: 'Revenue generated',
      unit: 'USD',
    });
    revenueGauge.record(amount, { type: 'subscription' });
  }

  recordPaymentReceived(_userId: string, amount: number, currency: string) {
    if (!this.meter) return;
    const counter = this.meter.createCounter('payments_received_total', {
      description: 'Total payments received',
    });
    counter.add(1, { currency });

    const revenueGauge = this.meter.createGauge('revenue', {
      description: 'Revenue generated',
      unit: currency,
    });
    revenueGauge.record(amount, { type: 'payment' });
  }

  // Custom business metrics
  recordCustomMetric(name: string, value: number, attributes: Record<string, string> = {}) {
    if (!this.meter) return;
    const gauge = this.meter.createGauge(name, {
      description: `Custom metric: ${name}`,
    });
    gauge.record(value, attributes);
  }

  incrementCustomCounter(name: string, attributes: Record<string, string> = {}) {
    if (!this.meter) return;
    const counter = this.meter.createCounter(name, {
      description: `Custom counter: ${name}`,
    });
    counter.add(1, attributes);
  }
}
