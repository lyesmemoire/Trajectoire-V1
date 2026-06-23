/**
 * Simple in-memory Prometheus-compatible counters.
 * Exposed via /api/metrics?format=prometheus (réseau interne uniquement).
 *
 * ⚠️  Labels à faible cardinalité uniquement : JAMAIS userId, email, cvId.
 */

type Labels = Record<string, string>;

interface CounterMetric {
  name: string;
  help: string;
  type: "counter";
  values: Map<string, number>;
  labelNames: string[];
}

const counters = new Map<string, CounterMetric>();

function labelsKey(labels: Labels): string {
  return JSON.stringify(labels);
}

function formatLabels(labels: Labels): string {
  const entries = Object.entries(labels);
  if (entries.length === 0) return "";
  return "{" + entries.map(([k, v]) => `${k}="${v}"`).join(",") + "}";
}

function getOrCreateCounter(
  name: string,
  help: string,
  labelNames: string[] = [],
): CounterMetric {
  if (!counters.has(name)) {
    counters.set(name, {
      name,
      help,
      type: "counter",
      values: new Map(),
      labelNames,
    });
  }
  return counters.get(name)!;
}

export function incrementCounter(
  name: string,
  labels: Labels = {},
  value = 1,
): void {
  const counter = getOrCreateCounter(name, `Total ${name}`);
  const key = labelsKey(labels);
  counter.values.set(key, (counter.values.get(key) || 0) + value);
}

export function getPrometheusFormat(): string {
  const lines: string[] = [];
  for (const [, metric] of counters) {
    lines.push(`# HELP ${metric.name} ${metric.help}`);
    lines.push(`# TYPE ${metric.name} counter`);
    for (const [key, value] of metric.values) {
      const labels = key !== "{}" ? JSON.parse(key) : {};
      lines.push(`${metric.name}${formatLabels(labels)} ${value}`);
    }
  }
  return lines.join("\n") + "\n";
}

// ── ATS-specific metric shortcuts ──────────────────────────────────

/**
 * Track failed ats_reports inserts.
 * ⚠️  Labels faiblement cardinalisées : reason (code d'erreur) + route.
 *     JAMAIS userId, email, cvId.
 */
export function recordATSReportInsertFailure(reason: string): void {
  incrementCounter("ats_report_insert_failure_total", { reason });
}

/**
 * Track successful ats_reports inserts.
 */
export function recordATSReportInsertSuccess(source: string = "api"): void {
  incrementCounter("ats_report_insert_success_total", { source });
}
