# 📊 FINOPS DASHBOARD ARCHITECTURE

Ce document détaille l'architecture du système d'observabilité financière en temps réel, conçu pour piloter la rentabilité de la plateforme SaaS IA.

---

## 1. OBJECTIFS CLES
- Connaître le coût temps-réel de chaque feature.
- Identifier le taux de consommation LLM (burn rate) de chaque module.
- Mesurer la rentabilité unitaire (Unit Economics) de chaque utilisateur.

---

## 2. MODÈLE DE DONNÉES (COST EVENT)
Chaque action SIL génère un événement normé converti instantanément en coût fiat (€/$) :
```ts
{
  userId,
  tenantId,
  feature,       // "ATS", "CV_OPTIMIZER", "INTERVIEW", "REPLAY"
  aiCost,        // tokens * model_rate
  dbCost,        // writes * unit_cost
  infraCost,     // compute_time * cpu_rate
  totalCost,
  timestamp
}
```

---

## 3. STREAM AGGREGATION PIPELINE
- **Data Source** : Events SIL.
- **Message Bus** : Kafka topic `cost-events`.
- **Processor** : Agrégation `user → session → feature → tenant` (Latence < 5s).
- **Storage** : Time-series DB (Postgres aggregations ou ClickHouse).

---

## 4. DASHBOARD ADMIN (UI)
- **Global Health** : Coût journalier, Revenu, Marge (%), Coût par utilisateur actif.
- **Feature Cost Map (Heatmap)** : Ventilation des coûts par fonctionnalité (ex: INTERVIEW = Très Élevé, REPLAY = Faible).
- **User Profiling** : `LTV - cost_per_user = margin` (Identification des utilisateurs rentables vs non-rentables).
- **Anomalies** : Détection de "retry storms", abus LLM, et dépassement de seuils critiques.

---

## 5. SYSTEME D'ALERTING FINOPS
- **CRITICAL** : `cost per user > revenue per user` (Perte sèche).
- **WARNING** : `LLM cost spike > +30% baseline`.
- **INFO** : `Feature cost drift detected` (dérive lente du coût unitaire).

---

## 6. OPTIMISATION LOOP
Les métriques doivent déclencher (manuellement ou automatiquement) des actions telles que :
- Downgrade de modèles LLM.
- Activation agressive de caching sémantique.
- Blocage temporaire de fonctionnalités non rentables (margin-based routing).

**Conclusion** : Le système passe du simple monitoring opérationnel à une **AI SaaS with real-time financial intelligence layer**.
