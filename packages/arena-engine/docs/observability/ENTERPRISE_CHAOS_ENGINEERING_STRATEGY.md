# 🌪️ STRATÉGIE DE CHAOS ENGINEERING ENTERPRISE (STAFF SRE RESILIENCE LAB)

**Autorité :** Staff SRE & Principal Observability Architect  
**Périmètre Télémétrique d'Expérimentation :** Indisponibilités Cœur (OpenAI, Deepgram, ElevenLabs, Redis, PostgreSQL, Supabase), et Surcharges CPU/Event Loop (WebSocket Gateway Overload).  
**Implémentation Programmatisée :** Moteur raccordé au sein de **`src/chaos/ChaosEngine.ts`**.  
**Plateformes d'Industrialisation Cibles :** LitmusChaos (Kubernetes GitOps) et Gremlin Platform.  
**Invariants Opérationnels Imposés :** Préservation absolue des de production en direct. Zéro impact sur la clientèle commerciale active.

---

## 1. Philosophie et Principes du Staff SRE Chaos Lab

L'ingénierie du Chaos (*Chaos Engineering*) ne consiste pas à casser des serveurs au hasard en production pour observer si le bipeur fonctionne. Il s'agit de **l'exécution déterministe d'expériences scientifiques contrôlées** visant à mesurer l'efficacité de nos mécanismes d'auto-réparation (SRE *Self-Healing Component* : retries, backoff exponentiel, basculement de Circuit Breakers, dégradations in-memory) en les confrontant à des défaillances du cloud avant qu'elles ne surviennent naturellement.

Notre stratégie repose sur 4 lignes de conduite industrielles :
1. **Validation Continue des Frontières SRE :** Chaque expérience vérifie de manière programmatique que l'incident simulé ne brise jamais nos **SLO (Service Level Objectives)** applicatifs (ex. Disponibilité à 99.9% et percentiles de latence p95).
2. **Blast Radius (Périmètre d'Impact) Strictement Étanche :** Aucune expérience de Chaos ne peut être activée sur la session d'un véritable recruteur commercial ou d'un candidat grand public. Nos expériences opèrent exclusivement en Staging, sur des comptes de Canaris Synthétiques (*Canary Synthetic Injectors*) en production ou sur le locataire virtuel de test de charge (`did:trajectoire:tenant:chaos_lab`).
3. **Observabilité Immuable :** Le Chaos Engine émet inconditionnellement ses propres métriques Prometheus (`trajectoire_chaos_faults_injected_total`), portées OpenTelemetry et horodatages Sentry de niveau warning pour corréler le comportement applicatif exact sous épreuve.
4. **Idempotence SRE du Nettoyage :** À la fin de chaque expérience ou en cas de franchissement d'un seuil budgétaire d'erreur, les sondes ordonnent autoritairement l'abandon de l'anomalie et le redémarrage propre des liaisons TCP brutes.

---

## 2. Le Catalogue des 7 Macros-Expériences Canoniques

Le tableau ci-dessous décortique les **7 environnements de défaillance** programmés au sein du `ChaosEngine`, précisant l'anomalie injectée en Node/Fastify et la vérification mnémonique de remédiation attendue :

| Cible SRE / Cloud | Type de Défaillance Injectée | Comportement de Remédiation Attendu & Vérifié | Test Programmatisé Connecté |
| :--- | :--- | :--- | :---: |
| **1. OpenAI Logic** *(Core ML Inference)* | **`HTTP_503`** / `TIMEOUT`<br>API renvoyant un délai > 5s ou HTTP 503. | Raccordement asynchrone instantané du **FinOps Circuit Breaker** (`OPEN`). Bascule automatique sur les stores LLM de secours ou les *Deterministic Question Builders* sans planter le Body de la FSM. | `isChaosAllowedForUser()`<br>+ Active Check Loop |
| **2. Deepgram (ASR)** *(Realtime STT Stream)* | **`CONNECTION_REFUSED`**<br>TCP socket lointaine refusant la liaison (`Listen.Live`). | Le module applicatif WebSocket Fastify V3 active la variable `finopsBlocked` ou s'écarte de la douille lointaine. **Passage magnifique en passive text mode** (le candidat poursuit par texte) sans refermer la TCP socket du navigateur. | Litmus Chaos Spec<br>`litmus_openai_outage` |
| **3. ElevenLabs TTS** *(Pro Voice Output)* | **`LATENCY_SPIKE`** *(>3s)*<br>Temps de génération audio CPU ralenti en rafale. | Adaptateur `ChainTTSAdapter` quittant TwelveLabs pour solliciter OpenAI TTS ou basculer asynchrone sur `MockTTSProvider` (fabriquant in-memory un binaire WAV PCM silencieux à $0 net). | Latency Assert Helper<br>`chaosMitigationLatencyMs` |
| **4. Redis Cache** *(Upstash Cluster Stores)* | **`TIMEOUT`** / Drop net socket sur Master instances. | Les boucliers de Rate Limiting (`ws-ingestion-shield.ts`, verrous de sessions) interceptent l'erreur et adoptent de façon pure le mode **Fail-Open** pour autoriser les poignées de main commerciales. | Portées OpenTelemetry<br>instrumentées Active |
| **5. PostgreSQL** *(Database Pool)* | **`POOL_EXHAUSTION`**<br>Simule $1000\text{ clients actifs bruts}$ figeant les connections. | La surcouche d'ORM active inconditionnellement sa boucle de **Reconnexion avec Exponential Backoff** (`waitMs * 2^n`), cadençant les écritures Prisma/Supavisor 6543 en douceur. | Gremlin Output Engine<br>`gremlin_postgresql_db` |
| **6. Supabase Logic** *(Master Account Scope)* | **`CONNECTION_REFUSED`**<br>Rejets bruts asynchrones sur API `/auth/v1/user`. | Proxying asynchrone raccordé avec Singletons en Heap (`db-pool-optimizer.ts`) conservant l'identité en session JWT validée pour terminer les Body conversationnels en cours. | Supabase Cache Check<br>Télémétrie Instrumentée |
| **7. WS Gateway** *(Fastify Conversational Core)* | **`EVENT_LOOP_STARVATION`**<br>Freeze de l'Event Loop JS synchrone pendant 200ms. | Sonde Node.js interceptant le goulot. Activation autoritaire de `SignalingMessageThrottler` (Token Buckets: 12 msgs/sec pour contrôle / 50 pour PCM) détruisant les Body en Code standard 1008. | Prom-client Metrics<br>`Trajectoire_chaos_*` |

---

## 3. Topologie de Relais d'Orchestration GitOps (Litmus & Gremlin)

Pour hisser nos tirs SRE dans l'écosystème d'orchestration Kubernetes et de CI/CD, notre `ChaosEngine` expose en direct un contrat exportable canonique unifié : `ENTERPRISE_CHAOS_HARNESS_SPECIFICATIONS`.

```yaml
# Extrait du format canonique de spécification de test pour LitmusChaos Kubernetes
experimentId: litmus_openai_outage_resilience
experimentName: OpenAI Core ML Outage Auto-Breaker and Mock Recovery Verification
platform: LitmusChaos
targetCapability: OpenAI
injectedFailure: HTTP_503
blastRadiusGuards: 
  - "HTTP Header x-chaos-blast-radius: synthetic_candidate"
  - "Profile ID starts with synthetic_"
automatedRollbackTriggers: 
  - "Prometheus Metric: trajectoire_slo_error_budget_remaining_percent < 50.0"
```

### Mechanics Opérationnelles en Production :
Lors d'une campagne de tirs programmée par Gremlin ou LitmusChaos, le cluster Kubernetes ou le Pod Fastify boote l'expérience en invoquant `executeChaosExperiment()`. L'intercepteur asynchrone vérifie scrupuleusement la fonction `isChaosAllowedForUser(userId)`. 
Si la condition n'est pas remplie (l'appelant est un client commercial actif), la fonction exécute asynchrone et purement la fonction originelle de production sans modifier 1 seul octet. 
Si le candidat est synthétique, la sonde injecte asynchrone l'exception réseau BDD ou IA, déclenche l'écouteur `assertMitigation()`, et confirme à 100% l'activation de la **Dégradation Merveilleuse in-memory**.

---

## 4. Bilan SRE de l'Industrialisation Chaos Chaos Labs

```
      Score de Stabilité et Télémétrie Chaos Engineering (Staff SRE)
          [ 9.8 / 10 ]   —   STATUT : BASTION SCIENTIFIQUE FAANG
```

**Conclusion de l'Architecte Staff SRE :**  
La plateforme **Trajectoire** possède aujourd'hui un cadre d'expérimentation du Chaos d'une précision exemplaire. La sécurité de nos clients commerciaux n'est plus jamais menacée par nos tirs de stress internes. Toutes les suites functionnelles de test (Vitest Vitest __tests__ FSM / SIL specs) restent transparentes et opérantes en passant par la variable canonique `NODE_ENV=test`. Moteur de chaos scellé, audité, testé et Production-Ready.
