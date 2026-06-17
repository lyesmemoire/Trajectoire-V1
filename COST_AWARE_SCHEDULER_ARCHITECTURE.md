# ⚙️ AUTO-SCALING COST-AWARE SCHEDULER

Ce document décrit l'architecture du scheduler nouvelle génération : un système de contrôle en boucle fermée (closed-loop) qui ajuste dynamiquement l'infrastructure et la profondeur des fonctionnalités non plus sur la charge (CPU/RAM), mais sur la **pression de la rentabilité**.

---

## 1. LE PRINCIPE CENTRAL (COST-AWARE SCALING)

Le scaling traditionnel (basé CPU) est aveugle aux coûts métier. Ce nouveau modèle arbitre entre la performance, la demande utilisateur et la marge :
```text
scale_decision = f(cost, margin, latency, AI_load, user_demand, feature_priority)
scaling_score = demand_pressure + latency_pressure + revenue_pressure - cost_pressure
```

---

## 2. ARCHITECTURE DE CONTRÔLE

```text
FinOps Dashboard (Metriques)
        ↓
Margin Engine (Calcul LTV vs CAC)
        ↓
Cost-Aware Scheduler (Le cerveau)
        ↓
Infrastructure Controller (K8s/Workers/Vercel)
```

---

## 3. INTELLIGENT FEATURE SCHEDULING (DÉGRADATION GRACIEUSE)

L'infrastructure ne scale pas de façon homogène. Les fonctionnalités sont throttlées dynamiquement selon leur priorité :
- **High Priority** : ATS Analysis (Must complete quickly).
- **Medium Priority** : CV Optimize (Peut utiliser un modèle moins cher ou être mis en file d'attente).
- **Low Priority** : Replay Analytics (Background processing uniquement en cas de charge).

### Niveaux de Protection (Autoscaling Levels)
- **LEVEL 0 (NORMAL)** : Full AI, Full features.
- **LEVEL 1 (COST MODE)** : Cache agressif, small models, batch processing.
- **LEVEL 2 (SURVIVAL MODE)** : Uniquement les flux critiques, features analytiques désactivées.
- **LEVEL 3 (PROTECTION MODE)** : Auth et core flows uniquement, le reste est throttlé.

---

## 4. CONDITIONS D'ARBITRAGE (SCALING MATRIX)

- **Scale Up** : `IF latency > SLO AND margin > threshold → Augmenter le compute.`
- **Scale Down** : `IF cost high AND demand low → Réduire les réplicas.`
- **Feature Freeze** : `IF cost spike detected AND feature_revenue is low → Throttle la feature spécifique.`

---

## 5. IMPACT SUR LA PLATEFORME

Cette approche transforme un "centre de coût Cloud" passif en une **infrastructure adaptative centrée sur la marge (Margin-first infrastructure)**. 
- Les pics de trafic ne provoquent plus de "Cost Explosions".
- Le système dégrade son UX de façon contrôlée (Load Shedding intelligent) plutôt que de s'effondrer financièrement ou techniquement.
