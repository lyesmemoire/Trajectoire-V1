/**
 * HIIOS v4 Enterprise — Observability
 *
 * OpenTelemetry-compatible metrics, tracing, logging.
 * Aucune donnée personnelle dans les traces.
 */

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export type MetricType = "counter" | "gauge" | "histogram";

export interface MetricDefinition {
  name:        string;
  type:        MetricType;
  description: string;
  unit:        string;
  labels:      string[];
}

export interface MetricSample {
  name:      string;
  value:     number;
  labels:    Record<string, string>;
  timestamp: Date;
}

export interface TraceSpan {
  traceId:     string;
  spanId:      string;
  parentSpanId?: string;
  name:        string;
  startTime:   Date;
  endTime?:    Date;
  status:      "OK" | "ERROR";
  attributes:  Record<string, string | number | boolean>;
  events:      SpanEvent[];
}

export interface SpanEvent {
  name:       string;
  timestamp:  Date;
  attributes: Record<string, string | number>;
}

export interface HealthStatus {
  status:      "healthy" | "degraded" | "unhealthy";
  version:     string;
  uptime:      number;
  checks:      HealthCheck[];
  timestamp:   Date;
}

export interface HealthCheck {
  name:     string;
  status:   "pass" | "warn" | "fail";
  latency?: number;
  message?: string;
}

// ─────────────────────────────────────────────
// REGISTRY DE MÉTRIQUES
// ─────────────────────────────────────────────

export const HIIOS_METRICS: MetricDefinition[] = [
  // Sessions
  {
    name:        "hiios_sessions_total",
    type:        "counter",
    description: "Nombre total de sessions d'entretien",
    unit:        "sessions",
    labels:      ["organization_id", "interview_type", "status"],
  },
  {
    name:        "hiios_session_duration_seconds",
    type:        "histogram",
    description: "Durée des sessions d'entretien",
    unit:        "seconds",
    labels:      ["organization_id", "interview_type"],
  },
  // LLM
  {
    name:        "hiios_llm_requests_total",
    type:        "counter",
    description: "Nombre d'appels LLM",
    unit:        "requests",
    labels:      ["provider", "model", "call_type", "status"],
  },
  {
    name:        "hiios_llm_latency_seconds",
    type:        "histogram",
    description: "Latence des appels LLM",
    unit:        "seconds",
    labels:      ["provider", "model"],
  },
  {
    name:        "hiios_llm_tokens_total",
    type:        "counter",
    description: "Tokens consommés",
    unit:        "tokens",
    labels:      ["provider", "model", "token_type"],
  },
  {
    name:        "hiios_llm_cost_total",
    type:        "counter",
    description: "Coût LLM total en USD",
    unit:        "usd",
    labels:      ["provider", "organization_id"],
  },
  // Qualité cognitive
  {
    name:        "hiios_evidence_collected_total",
    type:        "counter",
    description: "Preuves collectées",
    unit:        "evidences",
    labels:      ["level", "source"],
  },
  {
    name:        "hiios_hypotheses_active",
    type:        "gauge",
    description: "Hypothèses actives par session",
    unit:        "hypotheses",
    labels:      ["status"],
  },
  {
    name:        "hiios_contradictions_detected_total",
    type:        "counter",
    description: "Contradictions détectées",
    unit:        "contradictions",
    labels:      ["severity"],
  },
  {
    name:        "hiios_decisions_total",
    type:        "counter",
    description: "Décisions émises",
    unit:        "decisions",
    labels:      ["recommendation", "organization_id"],
  },
  // API
  {
    name:        "hiios_api_requests_total",
    type:        "counter",
    description: "Requêtes API",
    unit:        "requests",
    labels:      ["method", "path", "status_code"],
  },
  {
    name:        "hiios_api_latency_seconds",
    type:        "histogram",
    description: "Latence API",
    unit:        "seconds",
    labels:      ["method", "path"],
  },
  // Erreurs
  {
    name:        "hiios_errors_total",
    type:        "counter",
    description: "Erreurs système",
    unit:        "errors",
    labels:      ["type", "component", "severity"],
  },
];

// ─────────────────────────────────────────────
// COLLECTEUR DE MÉTRIQUES
// ─────────────────────────────────────────────

export class MetricsCollector {

  private samples:   MetricSample[]   = [];
  private spans:     TraceSpan[]      = [];
  private startTime: Date             = new Date();

  // ── Compteurs ──────────────────────────────

  increment(name: string, labels: Record<string, string> = {}, value = 1): void {
    this.samples.push({
      name,
      value,
      labels,
      timestamp: new Date(),
    });
  }

  // ── Jauges ─────────────────────────────────

  set(name: string, value: number, labels: Record<string, string> = {}): void {
    this.samples.push({ name, value, labels, timestamp: new Date() });
  }

  // ── Histogramme ────────────────────────────

  observe(name: string, value: number, labels: Record<string, string> = {}): void {
    this.samples.push({ name, value, labels, timestamp: new Date() });
  }

  // ── Tracing ────────────────────────────────

  startSpan(name: string, parentSpanId?: string): TraceSpan {
    const span: TraceSpan = {
      traceId:     this.generateId(),
      spanId:      this.generateId(),
      parentSpanId,
      name,
      startTime:   new Date(),
      status:      "OK",
      attributes:  {},
      events:      [],
    };
    this.spans.push(span);
    return span;
  }

  endSpan(span: TraceSpan, status: "OK" | "ERROR" = "OK"): void {
    span.endTime = new Date();
    span.status  = status;

    // Enregistrer la durée comme métrique
    const durationMs = span.endTime.getTime() - span.startTime.getTime();
    this.observe(
      "hiios_span_duration_seconds",
      durationMs / 1000,
      { span_name: span.name }
    );
  }

  addSpanEvent(span: TraceSpan, name: string, attributes: Record<string, string | number> = {}): void {
    span.events.push({ name, timestamp: new Date(), attributes });
  }

  // ── Helper d'instrumentation ───────────────

  async instrument<T>(
    name:    string,
    fn:      (span: TraceSpan) => Promise<T>,
    labels?: Record<string, string>
  ): Promise<T> {
    const span  = this.startSpan(name);
    const start = Date.now();

    try {
      const result = await fn(span);
      this.endSpan(span, "OK");
      this.observe(name + "_duration_seconds", (Date.now() - start) / 1000, labels ?? {});
      return result;
    } catch (error) {
      this.endSpan(span, "ERROR");
      this.increment("hiios_errors_total", {
        type:      "runtime",
        component: name,
        severity:  "error",
      });
      throw error;
    }
  }

  // ── Export ─────────────────────────────────

  getMetrics(): MetricSample[] {
    return [...this.samples];
  }

  getRecentMetrics(windowMs = 60000): MetricSample[] {
    const cutoff = new Date(Date.now() - windowMs);
    return this.samples.filter(s => s.timestamp >= cutoff);
  }

  exportPrometheus(): string {
    const lines: string[] = [];
    const byName          = new Map<string, MetricSample[]>();

    for (const sample of this.samples) {
      if (!byName.has(sample.name)) byName.set(sample.name, []);
      byName.get(sample.name)!.push(sample);
    }

    for (const [name, samples] of byName) {
      const def = HIIOS_METRICS.find(m => m.name === name);
      if (def) {
        lines.push(`# HELP ${name} ${def.description}`);
        lines.push(`# TYPE ${name} ${def.type}`);
      }

      for (const sample of samples.slice(-100)) { // Dernières 100 valeurs
        const labelStr = Object.entries(sample.labels)
          .map(([k, v]) => `${k}="${v}"`)
          .join(",");
        const labelPart = labelStr ? `{${labelStr}}` : "";
        lines.push(`${name}${labelPart} ${sample.value} ${sample.timestamp.getTime()}`);
      }
    }

    return lines.join("\n");
  }

  // ── Health ─────────────────────────────────

  async checkHealth(checks: HealthChecker[]): Promise<HealthStatus> {
    const results: HealthCheck[] = [];

    for (const check of checks) {
      const start = Date.now();
      try {
        const result  = await check.check();
        results.push({
          name:    check.name,
          status:  result.status,
          latency: Date.now() - start,
          message: result.message,
        });
      } catch (error) {
        results.push({
          name:    check.name,
          status:  "fail",
          latency: Date.now() - start,
          message: String(error),
        });
      }
    }

    const hasFailure = results.some(r => r.status === "fail");
    const hasWarning = results.some(r => r.status === "warn");

    return {
      status:    hasFailure ? "unhealthy" : hasWarning ? "degraded" : "healthy",
      version:   "4.0.0",
      uptime:    (Date.now() - this.startTime.getTime()) / 1000,
      checks:    results,
      timestamp: new Date(),
    };
  }

  private generateId(): string {
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
  }
}

export interface HealthChecker {
  name:  string;
  check: () => Promise<{ status: "pass" | "warn" | "fail"; message?: string }>;
}
