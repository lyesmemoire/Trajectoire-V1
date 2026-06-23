# 👁️ VISIBILITÉ TEMPS RÉEL GRAFANA + PROMETHEUS + TEMPO + LOKI

**Rôle :** Principal Observability Engineer & Staff SRE  
**Objectif :** Conception et spécification canonique de l'écosystème de tableaux de bord de production Grafana pour le monorepo **Trajectoire**. Offre une observabilité temps réel de niveau **Enterprise Grade** sur les WebSockets, les Route Handlers Next.js, les fournisseurs d'IA (OpenAI, Deepgram, TwelveLabs), les bases de données (PostgreSQL, Redis) et les moteurs FSM.

---

## 1. Topologie de l'Écosystème de Supervision (LGTM Stack)

L'observabilité de Trajectoire est propulsée par la pile industrielle **LGTM (Loki, Grafana, Tempo, Prometheus)** connectée à nos noyaux de télémétrie internes (`telemetry-hub.ts`, `ws-payload-screener.ts`, `ws-message-throttler.ts`, `finops-firewall.ts`, `db-pool-optimizer.ts`).

```
[ Nœuds Node.js / Fastify / Next.js Vercel ]
  │
  ├─ Télémétrie Canons (prom-client)    ──▶ [ PROMETHEUS ] (Metrics & Jauges 5s Refresh)
  ├─ Logs JSON Pino (createChildLogger) ──▶ [ LOKI ]       (Logs Indexés par EventId/Tenant)
  ├─ Traces Spans Otel (@opentelemetry) ──▶ [ TEMPO ]      (Traces Distribuées & Latence P95)
  └─ Alertes & Sentry Scope Scope       ──▶ [ SENTRY ]     (Breadcrumbs Fatals & SRE Scope)
                                                  │
                                                  ▼
                                       [ GRAFANA ENTERPRISE ]
                                  ( 7 Master Dashboards Temps Réel )
```

---

## 2. Spécification des 7 Master Dashboards de Production

### 📊 Dashboard 1 : API Performance (`Next.js Serverless & Fastify Core`)
- **Objectif :** Analyser le comportement des terminaux de l'application Web et des API d'ingestion sous charge et en fuzzing.
- **Panneaux & PromQL Cibles :**
  - **Latency Distribution :** Affiche inconditionnellement les percentiles **p50**, **p95**, et **p99** calculés par la fonction `histogram_quantile()` sur la métrique canonique `trajectoire_p95_execution_latency_ms_bucket`.
  - **Success vs. Error Rate :** Suivi du débit HTTP (`http_requests_total`) ventilé par cibles `status=~"2.."` (Success Rate) vs `status=~"4..|5.."` (Error Rate).
  - **Payload Size Screening :** Histogramme des Body entrants surveillé par `trajectoire_ws_payload_size_bytes` (128B à 64KB).

---

### 📊 Dashboard 2 : WebSocket Realtime (`Realtime Gateway Fastify`)
- **Objectif :** Superviser le cluster de streaming audio bi-directionnel à ultra-basse latence (`/api/voice`, `/api/signal`, `/ws`).
- **Panneaux & PromQL Cibles :**
  - **Active Realtime Sessions :** Jauge en direct de la métrique `trajectoire_ws_connections` (surfaçant les sessions conversationnelles et WebRTC de pilotage).
  - **Message Flood Rate Breaches :** Suivi d'interceptions par seaux à jetons (`ws-message-throttler.ts`) via `increase(trajectoire_ws_message_flooding_rejected_total[1h])`.
  - **Upstash Sliding Rate Limits :** Mesure des interceptions de poignées de main brutes HTTP Upgrade via `trajectoire_ws_rate_limit_hits`.
  - **TCP Saturation Index :** Ventilation des fermetures protocoires autoritaires en Code **1008** et **1009** (`trajectoire_ws_message_flood`).

---

### 📊 Dashboard 3 : AI Providers (`OpenAI Core, Deepgram ASR & TwelveLabs TTS`)
- **Objectif :** Télémétrie opérationnelle sur l'immersion cognitive, les minuteurs de tours verbaux et le streaming d'I/O.
- **Panneaux & PromQL Cibles :**
  - **Provider Error Rate Screener :** Suivi des erreurs consécutives (`trackProviderErrorRate`) par `increase(trajectoire_finops_circuit_breaker_trips_total[1h])` et mise en lien avec Tempo pour tracer l'horodatage d'indisponibilité.
  - **TTS Synthesis Throughput & Breakers :** Calcul du nombre de trames ElevenLabs synthétisées en millisecondes et suivi des basculements de secours (`ChainTTSAdapter` fallback sur silence binaire WAV en mémoire).
  - **ASR Latency Streaming :** Mesure du décodage PCM d'ASR Deepgram par horodatage (`LiveTranscriptionEvents`).

---

### 📊 Dashboard 4 : Database Reliability (`PostgreSQL Core & DBRE Keep-Alive Hub`)
- **Objectif :** Télémétrie sur la santé des pools base de données, la santé des descripteurs de sockets et l'élimination des rejets `max_connections`.
- **Panneaux & PromQL Cibles :**
  - **Active Prisma Pool Singletons :** Jauge comptant les singletons d'ORM actifs sur les workers Fastify et Next.js via `trajectoire_dbre_prisma_connections_active`.
  - **Supavisor Multiplexing Gauge :** Ventilation des transactions streamées sur le **Port Transactionnel 6543** (`pgbouncer=true`) via `trajectoire_db_pool_usage`.
  - **Exponential Backoff Reconnections :** Taux de rattrapages asynchrones réussis face aux chutes de TCP sockets mesuré par `increase(trajectoire_dbre_supabase_reconnections_total[5m])`.
  - **Transaction Query Execution Latency :** Ventilation par tranches des millisecondes BDD sur l'histogramme `trajectoire_dbre_query_latency_ms`.

---

### 📊 Dashboard 5 : FinOps Governance (`Real-Time Costs & System Ledgers`)
- **Objectif :** Piloter l'économie de la startup en direct en évitant toute fuite budgétaire ou attaque de **Financial DoS**.
- **Panneaux & PromQL Cibles :**
  - **Realtime Estimated Cost ($ USD) :** Suivi comptable asynchrone des dépenses cumulées d'IA et de voix (`trajectoire_finops_cost`) converties au taux exact ($0.18/1k chars pour ElevenLabs, $0.0043/min pour Deepgram, et tokens In/Out pour OpenAI).
  - **Master System Budget Saturation :** Jauge de danger calculant en direct le pourcentage d'épuisement du budget de **$250.00 USD / jour** ancré sur `trajectoire_finops_active_budget_gauge_usd`.
  - **Redis Circuit Breaker Trips :** Comptage des fermetures automatiques d'API coûteuses en mode `OPEN` ou `HALF_OPEN`.

---

### 📊 Dashboard 6 : System Reliability & Core Execution (`Distributed P0 SIL Bus`)
- **Objectif :** Visibilité sur la santé FSM, le journal d'exécution distribuée et l'intégrité de l'orchestration P0 (`GET /v1/runtime/:sessionId`).
- **Panneaux & PromQL Cibles :**
  - **Runtime Command Verified Throughput :** Ventilation des commandes canoniques publiées sur le bus d'orchestration distribué via `trajectoire_runtime_events`.
  - **SLO Error Budget Burn Rate :** Alerting Prometheus mesurant le taux de consommation du budget d'erreur sur nos objectifs de disponibilité à 99.95% (`ENTERPRISE_PRODUCTION_SLO_DEFINITIONS`).
  - **SIL Distributed Hash Integrity :** Mesure de validité des signatures et de l'enchaînement des hash du *Merkle Hash Ledger* (`signed-event.ts`).

---

### 📊 Dashboard 7 : Application Security & Enterprise Edge Shield
- **Objectif :** Bastion d'inspection des tirs applicatifs L7, de subversion de prompts et d'attaques multi-locataires.
- **Panneaux & PromQL Cibles :**
  - **AI Prompt Override Breaches :** Suivi d'incidents déclenchés en cas de détection d'instructions hostiles (`"Ignore all previous instructions"`) isolées inconditionnellement par nos balises XML étanches (`<candidate_structural_cv>`, `<job_description>`).
  - **Session Spoofing Mitigation (Cross-Tenant Attacks) :** Compteur en direct surveillant la jauge de rejets autoritaires sur `/v1/runtime` (`trajectoire_runtime_ws_policy_violations_total{violation_type="CROSS_TENANT_SPOOFING_ATTACK"}`).
  - **Sentry Fatal Security Integration :** Retransmission sur Grafana des journaux chiffrés d'observabilité de catégorie `security.dos` et `security.finops`.

---

## 3. Déploiement et Fichier JSON Canonical

Le dashboard consolidé complet d'observabilité de production est d'ores et déjà codé et commité dans l'arborescence :
```
Trajectoire/grafana/dashboards/Trajectoire_Master_Production_Dashboard.json
```
Ce fichier est prêt à être importé dans n'importe quelle instance Grafana (v10.x+) disposant d'une source de données Prometheus. Il instancie inconditionnellement l'exhaustivité de ces 7 macro-domaines en 5 secondes de rafraîchissement continu, hisser Trajectoire au standard d'élite **Observability Enterprise Grade**.
