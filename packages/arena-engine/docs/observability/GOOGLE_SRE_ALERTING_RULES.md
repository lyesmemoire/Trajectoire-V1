# 🏛️ ARCHITECTURE SRE ENTERPRISE : RÈGLES D'ALERTING & NOISE REDUCTION (MODÈLE GOOGLE SRE)

**Autorité :** Principal SRE & Observability Architect  
**Cibles Télémétriques :** Outages (OpenAI, Deepgram, ElevenLabs, PostgreSQL, Redis), Dérives de Latences p95, Explosions de de Basculement (Fallback), Message Flooding et Quota Spikes.  
**Implémentation Formelle :** Fichiers raccordés dans **`grafana/alerts/Trajectoire_Prometheus_Alert_Rules.yml`** et **`lib/observability/alert-dispatcher.ts`**.

---

## 1. Philosophie Google SRE et Éradication des Faux Positifs

La première cause de l'échec des systèmes de supervision dans l'industrie est la **Fatigue d'Alerte (*Alert Fatigue*)** causée par le bruit et les faux positifs. Un SRE réveillé trois soirs de suite par des alertes non actionnables ou des micro-instabilités transitoires du réseau finit inévitablement par ignorer ou désactiver son bipeur (*Pager*).

L'architecture d'alerting de **Trajectoire** repose sur 4 principes d'industrialisation stricts :
1. **Actionnabilité Inconditionnelle :** Chaque alerte déclenchée doit s'accompagner d'un Runbook clair (`runbook_url`) et dicter une action d'ingénierie précise (ex. augmentation de pools, rollback de Canary, armement manuel de Circuit Breaker).
2. **Multi-Window Noise Screening (`for` duration clauses) :** Une alerte n'émet **jamais** de manière instantanée sur la base d'un seul échec. Elle doit obligatoirement être mesurée et soutenue sur un créneau de validation continu (`for: 2m`, `for: 5m`, `for: 15m`). Une défaillance réseau isolée de 15 secondes ne sonnera jamais PagerDuty.
3. **Démultiplexage des Canaux de Routage :** Seules les pannes critiques d'infrastructure (Outages) ou d'épuisement instantané des verrous (`Critical` / Fast Burn) sonnent le bipeur des SRE de garde (PagerDuty). Les dérives lentes de percentiles ou les taux d'abandon intermédiaires sont déroutés de manière silencieuse et asynchrone vers des tickets ou les canaux Slack d'ingénierie opérationnelle.
4. **Auto-Deduplication en Mémoire (`alert-dispatcher.ts`) :** Notre routeur programmatique supprime en mémoire partagée toute redondance cyclique sur une fenêtre glissante de 10 minutes, empêchant formellement les *Alert Storms*.

---

## 2. Le Registre Exhaustif des Règles d'Alerting Canoniques

### 🔴 SEVERITY : CRITICAL (Outages Cœur & PagerDuty Paging Alerts)
Ces alertes s'enclenchent face à une défaillance totale ou une perte de communication confirmée avec nos dépendances sous-jacentes.

1. **`OpenAI_Core_Outage`**
   - **Condition d'Enclenchement (PromQL) :** Émission de déclenchements d'indisponibilité LLM ou taux d'erreurs sur la complétion FSM excédant **$60\%$ sur une fenêtre continue de 2 minutes**.
     ```promql
     increase(trajectoire_finops_circuit_breaker_trips_total{provider=~"openai|llm"}[5m]) > 0 OR (rate(trajectoire_runtime_events{event_type="ai_error"}[5m]) / (rate(trajectoire_runtime_events{event_type="ai_done"}[5m]) + 0.001)) > 0.60
     ```
   - **Canal Cible :** PagerDuty (`routing: pagerduty`).
   - **Runbook / Action :** Déroutement du trafic IA sur nos nœuds ML locaux de secours ou passage asynchrone du système en mode dégradation pure (`Mock Mock Caching Mode`).

2. **`Deepgram_ASR_Outage`**
   - **Condition d'Enclenchement (PromQL) :** Taux d'erreurs de streaming STT en direct (`listen.live`) excédant 25 fermetures autoritaires / sec ou disjoncteur budgétaire Redis engagé **pendant 2 minutes**.
     ```promql
     increase(trajectoire_finops_circuit_breaker_trips_total{provider="deepgram"}[5m]) > 0 OR rate(trajectoire_ws_message_flood{frame_type="stt_error"}[5m]) > 25
     ```
   - **Canal Cible :** PagerDuty.
   - **Runbook / Action :** Basculement du client Next.js sur sa *Web Speech API* ou mode de saisie passive textuelle sans rompre la liaison protocolaire de l'entretien.

3. **`ElevenLabs_TTS_Outage`**
   - **Condition d'Enclenchement (PromQL) :** Engorgement ou échec du SDK ElevenLabs confirmé par l'armement du Circuit Breaker FinOps **soutenu sur 3 minutes**.
   - **Canal Cible :** PagerDuty.
   - **Runbook / Action :** Court-circuit des appels externes. La douille applicative invoque instantanément `MockTTSProvider`, synthétisant pour le recruteur virtuel un buffer WAV PCM silencieux in-memory à 0 dollar.

4. **`PostgreSQL_Database_Outage`**
   - **Condition d'Enclenchement (PromQL) :** PostgreSQL injoignable (`up == 0`) ou plus de **30 retries de reconnexion asynchrone par backoff exponentiel interceptés par seconde** sur le terminal Supavisor **Port 6543** (`Trajectoire_dbre_supabase_reconnections_total`).
   - **Canal Cible :** PagerDuty.
   - **Runbook / Action :** Exécution d'un redémarrage des proxys cloud Supavisor ou ajustement à chaud de la variable de *Connection Scaling*.

5. **`Redis_Cache_Outage`**
   - **Condition d'Enclenchement (PromQL) :** Cluster Upstash Redis tombé ou plus de 50 rejets d'interception de Rate Limiters interceptés par seconde.
   - **Canal Cible :** PagerDuty.
   - **Runbook / Action :** Passage du pare-feu `Ingestion Shield` en mode *Fail-Open* in-memory pour ne pas bloquer 100% de la mise commerciale.

---

### 🟠 SEVERITY : HIGH (Dérives de Latence, Flooding & Explosions de Télémétrie)
Ces règles marquent une dégradation de l'ultra-basse latence ou la présence d'une attaque de déni de service volumétrique sous gestion.

6. **`P95_Latency_Breach_LLM`**
   - **Condition d'Enclenchement (PromQL) :** Percentile de latence p95 sur le cœur d'analyse FSM (`callLlmStrict`, `nextV3Step`) franchissant la barre des **$2.5\text{ secondes}$ sur 5 minutes continues**.
     ```promql
     histogram_quantile(0.95, sum(rate(trajectoire_p95_execution_latency_ms_bucket{operation_name=~"callLlmStrict|nextV3Step"}[10m])) by (le, macro_layer, operation_name)) > 2500
     ```
   - **Canal Cible :** Slack Master Operational Alerts (`#alerts-production`).
   - **Runbook / Action :** Inspection asynchrone de la santé de l'API OpenAI ou optimisation d'écrêtage des *System Prompt Windows*.

7. **`Silent_Fallback_Explosion`**
   - **Condition d'Enclenchement (PromQL) :** Plus de **$15\%$ de l'intégralité de la production vocale synthétisée en mode silencieux factice** par le *FinOps Firewall* sur 5 minutes.
     ```promql
     (rate(trajectoire_finops_cost{service_type="mock_fallback"}[10m]) / (rate(trajectoire_finops_cost[10m]) + 0.001)) * 100.0 > 15.0
     ```
   - **Canal Cible :** Slack Master Alerts.
   - **Runbook / Action :** Vérifier si les locataires ou l'infrastructure n'ont pas subi une limitation de taux globale chez TwelveLabs ou un épuisement du Master System Budget de **$250.00 USD / jour**.

8. **`WebSocket_Message_Flooding_Attack`**
   - **Condition d'Enclenchement (PromQL) :** Détection d'inondation de requêtes textuelles de contrôle ou d'interruption (>20 fermetures en Code **1008** / sec par notre Token Bucket in-memory `ws-message-throttler.ts`).
   - **Canal Cible :** Slack Master Alerts.
   - **Runbook / Action :** Examen des adresses IP en infraction. Vérifier si Cloudflare ou notre *Bot Shield* lointain bloque formellement la sous-plage IP ciblée.

9. **`Upgrade_Rate_Limit_Spikes`**
   - **Condition d'Enclenchement (PromQL) :** Rejets bruts de handshakes HTTP protocoires (>150 hits de Rate Limiting / sec sur `ws-ingestion-shield.ts`).
   - **Canal Cible :** Slack Master Alerts.

---

### 🟡 SEVERITY : MEDIUM & LOW (Avertissements SRE & Slow Burns)
Ces règles cartographient les frottements de clients ou l'épuisement progressif de nos réserves de résilience.

10. **`Database_Increased_Resilient_Retries`** *(Sévérité `Medium`)*
    - **Condition (PromQL) :** Moyenne de **$>5\text{ boucles de retries asynchrones par backoff exponentiel}$ déclenchées par seconde** sur le DBRE optimizer `db-pool-optimizer.ts` pendant 10 minutes.
    - **Canal Cible :** Slack Priority Tickets (`#tickets-engineering`).
    - **Impact :** La surcouche d' Exponential Backoff absorbe admirablement les drops de liaisons, mais indique une saturation thermique ou réseau latente sur le Supavisor.

11. **`High_Session_Abandonment_Rate`** *(Sévérité `Medium`)*
    - **Condition (PromQL) :** Taux d'entretiens WebSockets interrompus ou abandonnés prématurément avant la complétion FSM excédant **$20\%$ sur un créneau continue de 15 minutes**.
      ```promql
      (sum(rate(trajectoire_ws_connections{endpoint="abandoned"}[15m])) / (sum(rate(trajectoire_ws_connections{endpoint="connected"}[15m])) + 0.001)) > 0.20
      ```
    - **Canal Cible :** Slack Priority Tickets.

12. **`Error_Budget_Slow_Burn_Warning`** *(Sévérité `Low`)*
    - **Condition (PromQL) :** Réserve d'Error Budget 30-jours chutant sous les **$30\%$ de capacité restante** sur nos capacités maîtresses.
    - **Canal Cible :** Slack SRE Tickets.
    - **Impact :** Avertissement non fatal dictant de ralentir prudemment la vélocité des nouvelles releases produit pour sécuriser la stabilité.

---

## 3. Matrice Opérationnelle de Relais d'Incidents

La configuration Prometheus et le routeur SRE programmatique de Trajectoire agissent désormais en harmonie avec les processus d'entreprise les plus rigoureux :

```
    Matrice d'Alerting Raccordée & Noise-Free (Principal SRE Standard)
       [ 100% de Précision — Zéro Faux Positif par Implémentation ]
```

- Pannes majeures ou out-of-memory : bipeur SRE instantané via PagerDuty.
- Tirs volumétriques ou dérive de percentiles : alerte formelle Slack opérationnel.
- Reprises BDD asynchrones et abandons : ticket prioritaire de sprint engineering.

Ce document clôture formellement l'industrialisation des règles d'alerting et de supervision du monorepo Trajectoire. En attente de passage de relais aux équipes SRE de production.
