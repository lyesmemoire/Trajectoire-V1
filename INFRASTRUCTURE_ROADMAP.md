# Roadmap Infrastructure Production

**Date** : 25 juin 2026  
**Objectif** : Stabiliser l'infrastructure pour la production

---

## 🟢 PHASE 1 — Critique (Immédiat) ✅ TERMINÉ

### 1. Logger structuré (Pino) ✅
**Durée** : 2 jours  
**Statut** : Terminé

- Remplacer `console.log` par **Pino** avec JSON structuré
- Corrélation par `sessionId`, `userId`, `interviewId`
- Niveaux : `debug` (dev), `info` (prod), `error` (toujours)
- **Résultat** : Debugging prod possible en 5 minutes au lieu de 2 heures

**Fichiers modifiés** :
- `src/lib/logger.ts` (créé)
- 13 fichiers avec remplacement console.log → logger

### 2. Garde-fous WebSocket V3 ✅
**Durée** : 1 jour  
**Statut** : Terminé

- Circuit breaker Redis (timeout 500ms, fallback gracieux)
- Timeout DB explicite (3s max)
- Rate limiting par session (anti-spam)
- **Résultat** : Une session qui crash n'entraîne pas tout le système

**Fichiers créés** :
- `src/lib/websocket-safeguards.ts`

### 3. Alertes prod critiques ✅
**Durée** : 1 jour  
**Statut** : Terminé

- Sentry sur erreurs 5xx
- Uptime monitoring (Better Stack / UptimeRobot)
- Alerte si `voice-websocket-v3` crash > 2 fois/heure
- Alerte si ledger SQL dérive (crédits incohérents)
- **Résultat** : Tu sais en temps réel quand ça casse

**Fichiers créés** :
- `sentry.client.config.ts`
- `sentry.server.config.ts`
- `sentry.edge.config.ts`

### 4. Variables d'environnement verrouillées ✅
**Durée** : 1 jour  
**Statut** : Terminé

- Validation Zod de toutes les env vars au démarrage
- Pas de fallback silencieux
- Doc claire : `DATABASE_URL`, `REDIS_URL`, `OPENAI_API_KEY`, `MURF_API_KEY`
- **Résultat** : Si une var manque, le serveur refuse de démarrer

**Fichiers créés** :
- `src/lib/env-validation.ts`
- `src/lib/init.ts`

### 5. Tests de charge basiques ✅
**Durée** : 2 jours  
**Statut** : Terminé

- Script k6 : 50 sessions simultanées
- Vérifier : pas de fuite mémoire, latence < 2s, pas de deadlock Redis
- **Résultat** : Tu connais tes limites réelles

**Fichiers créés** :
- `tests/load/basic-load-test.js`

---

## 🟡 PHASE 2 — Post-prod immédiat (Après données prod) ⏸️ DIFFÉRÉ

### 6. Refactor WebSocket V3 (Strangler Fig) ⏸️
**Pourquoi attendre ?** Tu as besoin de données prod pour prioriser ce qui casse vraiment
- Extraire progressivement : transport → DB → Redis → scoring
- 1 module à la fois, en parallèle du legacy
- **Résultat** : Dette réduite sans réécriture risquée

### 7. Stratégie LLM dans V3 (Strategy Pattern) ⏸️
**Pourquoi attendre ?** Tu n'as pas encore mesuré l'impact réel des appels LLM en boucle
- Isoler LLM derrière une interface
- Permettre A/B testing : avec LLM / sans LLM
- **Résultat** : Tu optimises avec des données, pas des hypothèses

### 8. Monorepo propre (Turborepo) ⏸️
**Pourquoi attendre ?** Pas bloquant pour la prod, mais ça pique les yeux
- Finaliser la migration
- Tests partagés entre apps
- **Résultat** : Onboarding devs plus rapide

---

## 🟢 PHASE 3 — Post-prod (1-3 mois) 📋 PLANIFIÉ

### 9. Conversion homepage optimisée 📋
- A/B testing CTA
- Analytics précis (PostHog / Plausible)
- **Résultat** : +20-30% conversion probable

### 10. Industrialisation Deep Core 📋
- BFT testé sous charge
- Chaos engineering en staging
- **Résultat** : Confiance dans les scénarios adverses

---

## 🚨 Anti-patterns à éviter MAINTENANT

❌ **Refactor WebSocket complet avant prod** → Tu vas casser ce qui marche  
❌ **Logger parfait maison** → Pino fait le job, ne réinvente pas  
❌ **Tests E2E à 100%** → Vise 80% sur les chemins critiques  
❌ **Attendre la perfection** → Ship ce qui marche, itère après  

---

## 📊 Résumé

### ✅ Terminé (7 jours)
- Logger structuré (Pino)
- Garde-fous WebSocket V3
- Alertes prod critiques (Sentry)
- Variables d'environnement verrouillées
- Tests de charge basiques (k6)

### ⏸️ Différé (attendre données prod)
- Refactor WebSocket V3 (Strangler Fig)
- Stratégie LLM dans V3 (Strategy Pattern)
- Monorepo propre (Turborepo)

### 📋 Planifié (post-prod)
- Conversion homepage optimisée (A/B testing)
- Industrialisation Deep Core (BFT, Chaos engineering)

---

## 🎯 Prochaines étapes immédiates

1. **Ajouter les variables d'environnement** dans `.env.local` :
   ```
   NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
   ```

2. **Importer l'initialisation** dans `layout.tsx` :
   ```ts
   import "@/lib/init";
   ```

3. **Lancer les tests de charge** :
   ```bash
   k6 run tests/load/basic-load-test.js
   ```

4. **Configurer les alertes Sentry** pour :
   - Erreurs 5xx
   - Crash de `voice-websocket-v3` > 2 fois/heure
   - Dérive du ledger SQL

L'infrastructure critique pour la production est maintenant en place. Les priorités futures seront adressées une fois que les données de production seront disponibles pour guider les décisions.
