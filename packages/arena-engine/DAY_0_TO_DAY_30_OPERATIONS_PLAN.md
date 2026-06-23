# 📅 DAY 0 TO DAY 30 OPERATIONS PLAN

Ce document définit le plan de marche opérationnel strict pour les 30 premiers jours suivant la mise en production (Go Live). Il intègre les seuils critiques des métriques de survie et le calendrier de validation progressive.

---

## 🚦 SEUILS DE SURVIE ET PROPRIÉTÉ (SURVIVAL METRICS)

Pour qu'une métrique soit utile, elle doit avoir un seuil et un propriétaire.

### 1. Replay Divergence Rate
```yaml
metric: replay_divergence_rate
green: 0%
warning: >0%
critical: >0.01%
auto_action:
  - disable affected shard
  - stop replay promotion
owner:
  - platform_team
```

### 2. Margin Drift
```yaml
metric: margin_drift_24h
green: <5% drop
warning: >10% drop
critical: >15% drop
auto_action:
  - activate fallback LLM model
  - throttle non-critical background AI tasks
owner:
  - finops_team
```

### 3. Payment Failure Rate
```yaml
metric: payment_failure_rate
green: <0.5%
warning: >1.0%
critical: >1.5%
auto_action:
  - disable credit top-ups for flagged IPs
  - page on-call engineer
owner:
  - billing_team
```

### 4. AI Degradation Rate
```yaml
metric: ai_fallback_rate_1h
green: <1%
warning: >2%
critical: >5%
auto_action:
  - switch to secondary AI provider
  - flush semantic cache
owner:
  - ai_platform_team
```

### 5. Core Flow Conversion Drop
```yaml
metric: core_flow_drop
green: <5% variance
warning: >10% variance
critical: >20% variance
auto_action:
  - rollback latest UI deployment
owner:
  - product_team
```

---

## 🗓️ CALENDRIER DES 30 PREMIERS JOURS

La majorité des défaillances systémiques n'apparaissent pas le Jour 0, mais par accumulation de dette technique et d'usage asymétrique au fil du temps.

### Day 0 : Go Live (The Drop)
- Surveillance exclusive des métriques de base (CPU, Latence P99, Taux de succès requêtes).
- Validation du bon passage des premiers événements dans le SIL et l'Event Store.

### Day 1 : Validation Paiements (The Money Test)
- Rapprochement manuel des événements de crédit générés vs les paiements validés par Stripe.
- Vérification du taux d'échec des Webhooks.

### Day 3 : Validation Replay (The Truth Test)
- Audit du `replay_divergence_rate`.
- Tirage au sort de 5 sessions utilisateur : comparaison entre la projection en base et le résultat du replay des événements associés.

### Day 7 : Revue Coûts IA (The Burn Test)
- Analyse du coût LLM moyen par utilisateur actif.
- Analyse du ratio "Tokens générés vs Crédits consommés".
- Ajustement du `margin_drift` threshold.

### Day 14 : Revue Funnel (The Usage Test)
- Analyse des chemins UX réels (Où les utilisateurs abandonnent-ils ?).
- Évaluation de la "Surcharge cognitive" : les utilisateurs comprennent-ils les actions facturées en crédits ?

### Day 30 : Post-Mortem Préventif
- Réunion globale de l'équipe d'ingénierie.
- Analyse de l'écart entre le modèle architectural théorique et la réalité crue de l'usage.
- Décision : Continuer sur cette base ou simplifier le système en retirant les couches non utilisées.
