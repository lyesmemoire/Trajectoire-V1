# 6. Observabilité via OpenTelemetry

Date: 2026-07-11

## Status

Accepted

## Context

Un moteur vocal distribué avec des LLM nécessite une observabilité extrême (latences, timeouts, traces). Utiliser un SDK propriétaire comme Datadog ou Sentry directement dans l'infrastructure lierait fortement le projet à ce fournisseur.

## Decision

Nous adoptons une architecture basée sur **OpenTelemetry (OTel)**.
1. Le code métier (Application) déclare des métriques via un `TelemetryPort` abstrait.
2. L'Infrastructure implémente `OpenTelemetryAdapter` pour capturer ces appels.
3. Les données (traces, métriques, logs) sont exportées via `OTLP Exporter` vers n'importe quel backend (Prometheus, Grafana, Jaeger, etc.).
4. Propagation automatique du `traceId` via le `CorrelationIdMiddleware`.

## Consequences

- Agnosticité vis-à-vis des outils de monitoring.
- Standardisation des données (Logs structurés, Traces distribuées).
- Légère surcharge de l'empreinte mémoire pour faire tourner le SDK OTel en node.js.
