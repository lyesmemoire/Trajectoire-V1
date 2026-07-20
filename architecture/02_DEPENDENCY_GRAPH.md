# DEPENDENCY_GRAPH.md

> Graphe des dépendances du projet Trajectoire.
> Basé sur des preuves réelles (imports analysés via grep).

---

## Graphe Global

```
                    Platform (Infrastructure)
                    │
                    ├─ lib/prisma (8 dépendants)
                    ├─ lib/mistral (3 dépendants)
                    ├─ lib/supabase (4 dépendants)
                    ├─ lib/redis (1 dépendant)
                    └─ lib/stripe (0 dépendant)
                    │
     ┌──────────────┼──────────────┬──────────────┐
     │              │              │              │
   Web           API          Gateway      @trajectoire/arena-engine
     │              │              │              │
     │              │              │              │
     └─ Interview   (orphelin)     (orphelin)      │
         │                                      │
         ├─ AI                                  │
         │   │                                  │
         │   └─ Mistral                          │
         │                                      │
         ├─ Emotional Safety                    │
         │                                      │
         └─ Prisma                              │
                                              │
                                          Prisma
```

---

## Graphe des Domaines Métier

```
                    Interview
                    │
                    ├─ AI
                    │   │
                    │   └─ Mistral
                    │
                    ├─ Emotional Safety
                    │
                    └─ Prisma

                    ATS
                    │
                    ├─ AI
                    │   │
                    │   └─ Mistral
                    │
                    └─ (pas de dépendance DB)

                    Security
                    │
                    ├─ Fraud
                    │
                    ├─ Prisma
                    │
                    └─ Redis

                    Orchestration
                    │
                    ├─ Fraud
                    │
                    └─ Prisma

                    Analytics
                    │
                    └─ Prisma

                    Voice
                    │
                    └─ (pas de dépendance)

                    Auth
                    │
                    └─ Supabase

                    Credits
                    │
                    ├─ Prisma
                    │
                    └─ Supabase

                    Referral
                    │
                    └─ Prisma
```

---

## Graphe des Contexts Transversaux

```
                    Behavior
                    │
                    └─ Prisma

                    Emotion
                    │
                    └─ (pas de dépendance)

                    Engagement
                    │
                    └─ Prisma

                    Emotional Safety
                    │
                    └─ (pas de dépendance)

                    Cognitive Load
                    │
                    └─ (pas de dépendance)

                    Fraud
                    │
                    └─ (pas de dépendance)

                    Insights
                    │
                    └─ (pas de dépendance)

                    Prediction
                    │
                    └─ (pas de dépendance)

                    Signals
                    │
                    └─ (pas de dépendance)
```

---

## Graphe des Applications

```
                    apps/web
                    │
                    ├─ Interview
                    │   ├─ AI
                    │   │   └─ Mistral
                    │   ├─ Emotional Safety
                    │   └─ Prisma
                    │
                    ├─ ATS
                    │   ├─ AI
                    │   │   └─ Mistral
                    │   └─ (pas de dépendance DB)
                    │
                    ├─ Security
                    │   ├─ Fraud
                    │   ├─ Prisma
                    │   └─ Redis
                    │
                    ├─ Orchestration
                    │   ├─ Fraud
                    │   └─ Prisma
                    │
                    ├─ Analytics
                    │   └─ Prisma
                    │
                    ├─ Voice
                    │   └─ (pas de dépendance)
                    │
                    ├─ Auth
                    │   └─ Supabase
                    │
                    ├─ Credits
                    │   ├─ Prisma
                    │   └─ Supabase
                    │
                    ├─ Referral
                    │   └─ Prisma
                    │
                    ├─ Behavior
                    │   └─ Prisma
                    │
                    ├─ Emotion
                    │   └─ (pas de dépendance)
                    │
                    ├─ Engagement
                    │   └─ Prisma
                    │
                    └─ @trajectoire/arena-engine
                        └─ Prisma

                    apps/api
                    │
                    └─ (pas de dépendance interne)

                    apps/realtime-gateway
                    │
                    └─ (pas de dépendance interne)
```

---

## Graphe des Cycles

```
                    AUCUN CYCLE PROUVÉ
```

**Note**: Aucun cycle prouvé entre domaines métier

---

## Graphe des God Modules

```
                    lib/prisma (God Module)
                    │
                    ├─ Interview
                    ├─ Security
                    ├─ Orchestration
                    ├─ Analytics
                    ├─ Credits
                    ├─ Referral
                    ├─ Behavior
                    └─ Engagement

                    lib/mistral (God Module)
                    │
                    ├─ Interview
                    ├─ ATS
                    └─ AI

                    lib/supabase (God Module)
                    │
                    ├─ Interview
                    ├─ Security
                    ├─ Auth
                    └─ Credits
```

**Note**: God Modules sont des infrastructures, acceptable

---

## Graphe des Modules Orphelins

```
                    apps/api (Orphelin)
                    │
                    └─ (pas de dépendants)

                    apps/realtime-gateway (Orphelin)
                    │
                    └─ (pas de dépendants)

                    voice-core (Orphelin et vide)
                    │
                    └─ (pas de dépendants)

                    voice-interview-client (Orphelin et vide)
                    │
                    └─ (pas de dépendants)
```

---

## Graphe des Modules Morts

```
                    voice-core (Mort)
                    │
                    ├─ (pas de dépendants)
                    └─ (pas de dépendances)

                    voice-interview-client (Mort)
                    │
                    ├─ (pas de dépendants)
                    └─ (pas de dépendances)

                    beta-notes (Mort)
                    │
                    ├─ (pas de dépendants)
                    └─ (pas de dépendances)

                    artifacts (Mort)
                    │
                    ├─ (pas de dépendants)
                    └─ (pas de dépendances)

                    reports (Mort)
                    │
                    ├─ (pas de dépendants)
                    └─ (pas de dépendances)

                    metrics (Mort)
                    │
                    ├─ (pas de dépendants)
                    └─ (pas de dépendances)

                    coverage (Mort)
                    │
                    ├─ (pas de dépendants)
                    └─ (pas de dépendances)
```

---

## Conclusions

### Architecture Actuelle
- **Platform**: Infrastructure bien isolée (Prisma, Mistral, Supabase, Redis, Stripe)
- **Applications**: Web (couplé à tous les domaines), API (orphelin), Gateway (orphelin)
- **Domaines**: Séparation propre, aucun cycle prouvé
- **Contexts Transversaux**: Bien isolés, couplage faible

### Points Positifs
- ✅ **Aucun cycle prouvé** entre domaines métier
- ✅ **Aucun God Module métier** identifié
- ✅ **Couplage faible** entre domaines
- ✅ **Infrastructure bien isolée**

### Points à Surveiller
- ⚠️ **apps/api**: Orphelin (actif mais non intégré)
- ⚠️ **apps/realtime-gateway**: Orphelin (actif mais non intégré)
- ⚠️ **apps/web**: Couplage critique (10 dépendances)

### Actions Recommandées
1. **Clarifier apps/api** (intégration ou suppression)
2. **Clarifier apps/realtime-gateway** (intégration ou suppression)
3. **Supprimer packages vides** (voice-core, voice-interview-client)
4. **Supprimer dossiers vides** (beta-notes, artifacts, reports, metrics, coverage)

---

## Document de Référence

Ce document est la **source de vérité** pour le graphe des dépendances du projet Trajectoire.

**Version**: Sprint 2
**Date**: 2026-07-16
**Basé sur**: Preuves réelles (imports analysés via grep)
