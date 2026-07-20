# PHASE 1 — Étape 8: Cartographie de la Dette Technique

## Objectif
Noter chaque dossier/domaine selon l'architecture et la dette technique.

---

## Méthodologie de Notation

### Architecture Score (1-10)
- **9-10**: Architecture excellente, bien structurée, DDD complet
- **7-8**: Architecture bonne, DDD partiel mais cohérent
- **5-6**: Architecture moyenne, DDD partiel, quelques problèmes
- **3-4**: Architecture faible, DDD minimal, problèmes significatifs
- **1-2**: Architecture très faible, pas de DDD, problèmes majeurs

### Dette Technique
- **Faible**: Code propre, bien documenté, tests présents
- **Moyenne**: Quelques problèmes, documentation partielle, tests limités
- **Élevée**: Problèmes significatifs, documentation manquante, tests absents
- **Énorme**: Code legacy, duplication, architecture parallèle, tests absents

---

## Notation par Domaine

### 1. Interview Domain (lib/interview/)
**Architecture**: 7/10
**Dette**: Moyenne

**Justification**:
- ✅ Domain layer bien représentée (engine, personas, question-bank)
- ✅ Application layer partielle (orchestration, use cases)
- ❌ Infrastructure layer manquante
- ❌ Presentation layer manquante
- ⚠️ Structure mixte (fichiers à la racine + dossiers)
- ⚠️ Tests limités

**Recommandation**: Restructurer en couches DDD explicites

---

### 2. ATS Domain (lib/ats/)
**Architecture**: 9/10
**Dette**: Faible

**Justification**:
- ✅ Domain layer excellente (contracts, schemas, scoring)
- ✅ Application layer excellente (orchestrator, use cases)
- ✅ Infrastructure layer implicite mais bien intégrée
- ✅ Structure claire et cohérente
- ✅ Séparation des responsabilités
- ⚠️ Presentation layer manquante (normal pour lib/)

**Recommandation**: Maintenir l'architecture actuelle

---

### 3. Security Domain (lib/security/)
**Architecture**: 8/10
**Dette**: Faible

**Justification**:
- ✅ Domain layer bien représentée (fraud-engine, integrity-engine)
- ✅ Application layer bien représentée (use cases)
- ✅ Infrastructure layer bien représentée (upstash-client, audit-log)
- ✅ Séparation des responsabilités claire
- ✅ 20 items bien organisés
- ⚠️ Presentation layer manquante (normal pour lib/)

**Recommandation**: Maintenir l'architecture actuelle

---

### 4. AI Domain (lib/ai/)
**Architecture**: 8/10
**Dette**: Faible

**Justification**:
- ✅ Domain layer bien représentée (model-router, RAG, career-memory)
- ✅ Application layer bien représentée (use cases)
- ✅ Infrastructure layer bien représentée (cache, streaming)
- ✅ Séparation des responsabilités claire
- ✅ Multi-provider support
- ⚠️ Presentation layer manquante (normal pour lib/)

**Recommandation**: Maintenir l'architecture actuelle

---

### 5. Analytics Domain (lib/analytics/)
**Architecture**: 7/10
**Dette**: Moyenne

**Justification**:
- ✅ Domain layer bien représentée (behavioral-analytics, cognitive-load)
- ✅ Application layer partielle (use cases)
- ❌ Infrastructure layer implicite (PostHog)
- ❌ Presentation layer manquante
- ⚠️ Structure mixte (fichiers à la racine + dossiers)
- ⚠️ Tests limités

**Recommandation**: Clarifier l'infrastructure et ajouter des tests

---

### 6. Voice Domain (lib/voice/)
**Architecture**: 6/10
**Dette**: Moyenne

**Justification**:
- ✅ Client voice bien implémenté (client.ts)
- ✅ Streaming support
- ❌ Structure minimale (1 fichier principal)
- ❌ Tests limités
- ❌ Documentation manquante
- ⚠️ Dépendances avec realtime/

**Recommandation**: Restructurer et documenter

---

### 7. Realtime Domain (lib/realtime/)
**Architecture**: 6/10
**Dette**: Moyenne

**Justification**:
- ✅ Structure claire (audio, microphone, websocket)
- ✅ Streaming support
- ❌ Tests limités
- ❌ Documentation manquante
- ⚠️ Dépendances avec voice/

**Recommandation**: Ajouter des tests et documenter

---

### 8. Authentication Domain (lib/auth/)
**Architecture**: 5/10
**Dette**: Moyenne

**Justification**:
- ✅ Session logic implémentée
- ❌ Structure minimale (1 fichier)
- ❌ Tests absents
- ❌ Documentation manquante
- ⚠️ Dépendance forte sur NextAuth

**Recommandation**: Restructurer et ajouter des tests

---

### 9. Billing Domain (domain/billing.contract.ts)
**Architecture**: 7/10
**Dette**: Faible

**Justification**:
- ✅ Contract bien défini
- ✅ Structure claire
- ❌ Implementation manquante (seulement contract)
- ⚠️ Dépendance forte sur Stripe

**Recommandation**: Implémenter l'application layer

---

### 10. Orchestration Domain (lib/orchestration/)
**Architecture**: 8/10
**Dette**: Faible

**Justification**:
- ✅ Domain layer bien représentée (consensus engine, signal router)
- ✅ Application layer bien représentée (agent evaluator)
- ✅ Infrastructure layer implicite (repository)
- ✅ Architecture sophistiquée
- ✅ Séparation des responsabilités claire
- ⚠️ Presentation layer manquante (normal pour lib/)

**Recommandation**: Maintenir l'architecture actuelle

---

### 11. Domain Contracts (domain/)
**Architecture**: 9/10
**Dette**: Faible

**Justification**:
- ✅ Contracts excellents (billing, decision-graph, fraud-kernel, interview, orchestration, user)
- ✅ Structure claire
- ✅ Documentation implicite via contracts
- ❌ Seulement Domain layer représenté
- ⚠️ Application/Infrastructure layers manquantes (normal pour contracts)

**Recommandation**: Maintenir l'architecture actuelle

---

### 12. CV Domain (lib/cv/)
**Architecture**: 2/10
**Dette**: Énorme

**Justification**:
- ❌ Dossier vide (sauf application/)
- ❌ Aucune logique métier
- ❌ Dépendance totale sur ATS
- ❌ Architecture inexistante
- ❌ Tests absents
- ❌ Documentation manquante

**Recommandation**: Supprimer ou clarifier (fusion avec ATS)

---

### 13. Credits Domain (lib/credits/)
**Architecture**: 5/10
**Dette**: Moyenne

**Justification**:
- ✅ Implementation basique (transactional.ts)
- ✅ Legacy support (legacy.ts)
- ❌ Structure minimale (3 fichiers)
- ❌ Tests absents
- ❌ Documentation manquante

**Recommandation**: Restructurer et ajouter des tests

---

### 14. Referral Domain (lib/referral/)
**Architecture**: 6/10
**Dette**: Faible

**Justification**:
- ✅ Moteur de parrainage implémenté
- ✅ Structure simple et claire
- ❌ Tests limités
- ❌ Documentation manquante

**Recommandation**: Ajouter des tests et documenter

---

### 15. Marketing Domain (lib/marketing/)
**Architecture**: 5/10
**Dette**: Moyenne

**Justification**:
- ✅ Structure simple
- ❌ Implementation minimale
- ❌ Tests absents
- ❌ Documentation manquante

**Recommandation**: Documenter et ajouter des tests

---

### 16. SEO Domain (lib/seo/)
**Architecture**: 5/10
**Dette**: Moyenne

**Justification**:
- ✅ Structure simple
- ❌ Implementation minimale
- ❌ Tests absents
- ❌ Documentation manquante

**Recommandation**: Documenter et ajouter des tests

---

### 17. Email Domain (lib/email.ts)
**Architecture**: 6/10
**Dette**: Faible

**Justification**:
- ✅ Implementation simple
- ✅ Fichier unique bien isolé
- ❌ Tests absents
- ❌ Documentation manquante

**Recommandation**: Ajouter des tests et documenter

---

### 18. PDF Domain (lib/pdf/)
**Architecture**: 6/10
**Dette**: Faible

**Justification**:
- ✅ Structure simple
- ✅ Implementation fonctionnelle
- ❌ Tests limités
- ❌ Documentation manquante

**Recommandation**: Ajouter des tests et documenter

---

### 19. Database Domain (lib/db/)
**Architecture**: 7/10
**Dette**: Faible

**Justification**:
- ✅ Utilitaires de base de données
- ✅ Prisma client intégré
- ✅ 14 items bien organisés
- ❌ Tests limités
- ⚠️ Infrastructure (normal pour db/)

**Recommandation**: Ajouter des tests

---

### 20. Queue/Jobs Domain (lib/jobs/, lib/queue/)
**Architecture**: 3/10
**Dette**: Élevée

**Justification**:
- ❌ Structure minimale (queue: 1 fichier, jobs: 3 fichiers)
- ❌ Implementation très limitée
- ❌ Tests absents
- ❌ Documentation manquante
- ❌ Architecture inexistante

**Recommandation**: Restructurer et implémenter correctement

---

### 21. Core Domain (core/)
**Architecture**: 8/10
**Dette**: Faible

**Justification**:
- ✅ Core business logic bien isolée
- ✅ Phased implementation (P5, P6, P7)
- ✅ Audio core bien structuré
- ✅ Interview preparation bien structuré
- ❌ Tests limités
- ⚠️ Documentation partielle

**Recommandation**: Ajouter des tests et documenter

---

### 22. Packages (packages/)
**Architecture**: 1/10
**Dette**: Énorme

**Justification**:
- ❌ packages/arena-engine/ est une copie complète du projet (1546 items)
- ❌ packages/voice-core/ vide
- ❌ packages/voice-interview-client/ vide
- ❌ Architecture inexistante
- ❌ Duplication massive
- ❌ Confusion majeure

**Recommandation**: Supprimer arena-engine et les packages vides (CRITIQUE)

---

### 23. Apps (apps/)
**Architecture**: 5/10
**Dette**: Élevée

**Justification**:
- ✅ apps/api/ bien structuré (NestJS)
- ✅ apps/realtime-gateway/ bien structuré
- ❌ apps/web/ vs app/ confusion
- ❌ Deux applications Next.js
- ❌ Architecture parallèle

**Recommandation**: Clarifier apps/web/ vs app/ (CRITIQUE)

---

### 24. Gateway (gateway/)
**Architecture**: 3/10
**Dette**: Élevée

**Justification**:
- ❌ Gateway alternative (19 items)
- ❌ Confusion avec apps/realtime-gateway/
- ❌ Deux gateways
- ❌ Architecture parallèle

**Recommandation**: Clarifier gateway/ vs apps/realtime-gateway/ (CRITIQUE)

---

### 25. Components (components/)
**Architecture**: 7/10
**Dette**: Moyenne

**Justification**:
- ✅ Structure claire (ui, interview, marketing, admin)
- ✅ 115 items bien organisés
- ❌ components/marketing-old/ (15 items legacy)
- ❌ Tests limités
- ⚠️ Doublons potentiels

**Recommandation**: Supprimer marketing-old et ajouter des tests

---

### 26. App Layer (app/)
**Architecture**: 8/10
**Dette**: Faible

**Justification**:
- ✅ Structure Next.js standard
- ✅ 144 items bien organisés
- ✅ Séparation claire (marketing, admin, api, auth, cv, etc.)
- ✅ Layouts bien structurés
- ⚠️ Tests limités

**Recommandation**: Ajouter des tests

---

### 27. Infrastructure Transverse (lib/env, lib/errors, lib/logger, lib/resilience)
**Architecture**: 7/10
**Dette**: Faible

**Justification**:
- ✅ Infrastructure bien isolée
- ✅ Configuration environnement claire
- ✅ Gestion des erreurs
- ✅ Logging
- ✅ Résilience
- ❌ Tests limités

**Recommandation**: Ajouter des tests

---

### 28. Behavior Transverse (lib/behavior, lib/emotion, lib/engagement)
**Architecture**: 7/10
**Dette**: Faible

**Justification**:
- ✅ Domaines transversaux bien isolés
- ✅ Utilisés par plusieurs contextes
- ✅ Structure claire
- ❌ Tests limités
- ❌ Documentation manquante

**Recommandation**: Ajouter des tests et documenter

---

### 29. Emotional Safety (lib/emotional-safety, lib/emotional-balancing, lib/cognitive-load)
**Architecture**: 7/10
**Dette**: Faible

**Justification**:
- ✅ Sécurité émotionnelle bien implémentée
- ✅ Structure claire
- ✅ Utilisé par plusieurs domaines
- ❌ Tests limités
- ❌ Documentation manquante

**Recommandation**: Ajouter des tests et documenter

---

### 30. Dossiers Non Documentés (src/, sil/, services/, runtime/)
**Architecture**: 2/10
**Dette**: Élevée

**Justification**:
- ❌ src/ non documenté (86 items)
- ❌ sil/ non documenté (108 items)
- ❌ services/ non documenté (5 items)
- ❌ runtime/ non documenté (1 item)
- ❌ Utilité inconnue
- ❌ Architecture inexistante

**Recommandation**: Documenter ou supprimer (HAUTE)

---

## Synthèse de la Dette Technique

### Dette Énorme 🔴
1. **packages/** (1/10) — Copie complète du projet (1546 items)
2. **lib/cv/** (2/10) — Dossier vide, architecture inexistante
3. **lib/jobs/, lib/queue/** (3/10) — Implementation très limitée
4. **src/, sil/, services/, runtime/** (2/10) — Non documentés

### Dette Élevée 🟠
5. **gateway/** (3/10) — Architecture parallèle
6. **apps/** (5/10) — Confusion apps/web/ vs app/

### Dette Moyenne 🟡
7. **lib/interview/** (7/10) — DDD partiel
8. **lib/analytics/** (7/10) — DDD partiel
9. **lib/voice/** (6/10) — Structure minimale
10. **lib/realtime/** (6/10) — Structure minimale
11. **lib/auth/** (5/10) — Structure minimale
12. **lib/credits/** (5/10) — Structure minimale
13. **lib/marketing/** (5/10) — Implementation minimale
14. **lib/seo/** (5/10) — Implementation minimale
15. **components/** (7/10) — marketing-old legacy

### Dette Faible 🟢
16. **lib/ats/** (9/10) — Architecture excellente
17. **lib/security/** (8/10) — Architecture bonne
18. **lib/ai/** (8/10) — Architecture bonne
19. **lib/orchestration/** (8/10) — Architecture bonne
20. **domain/** (9/10) — Contracts excellents
21. **lib/referral/** (6/10) — Structure simple
22. **lib/email.ts** (6/10) — Fichier simple
23. **lib/pdf/** (6/10) — Structure simple
24. **lib/db/** (7/10) — Infrastructure bonne
25. **core/** (8/10) — Core business logic bonne
26. **app/** (8/10) — Structure Next.js bonne
27. **Infrastructure transverse** (7/10) — Infrastructure bonne
28. **Behavior transverse** (7/10) — Domaines transversaux bons
29. **Emotional safety** (7/10) — Sécurité bonne
30. **lib/billing** (7/10) — Contract bon

---

## Priorités de Refactorisation

### Critique 🔴
1. **Supprimer packages/arena-engine/** — Copie complète (1546 items)
2. **Clarifier apps/web/ vs app/** — Deux applications Next.js
3. **Clarifier gateway/ vs apps/realtime-gateway/** — Deux gateways
4. **Documenter ou supprimer src/, sil/, services/, runtime/** — Non documentés

### Haute 🟠
5. **Restructurer lib/cv/** — Dossier vide ou fusion avec ATS
6. **Implémenter lib/jobs/, lib/queue/** — Implementation très limitée
7. **Supprimer components/marketing-old/** — Code legacy

### Moyenne 🟡
8. **Restructurer lib/interview/** — DDD partiel
9. **Restructurer lib/analytics/** — DDD partiel
10. **Restructurer lib/voice/** — Structure minimale
11. **Restructurer lib/realtime/** — Structure minimale
12. **Restructurer lib/auth/** — Structure minimale
13. **Ajouter des tests** — Tests limités dans la plupart des domaines

### Faible 🟢
14. **Documenter les domaines** — Documentation manquante
15. **Ajouter des tests** — Tests limités

---

## Conclusions de l'Étape 8

### Points Positifs
- ✅ **ATS, Security, AI, Orchestration**: Architecture excellente (8-9/10)
- ✅ **Domain Contracts**: Contracts excellents (9/10)
- ✅ **Core, App, Infrastructure**: Architecture bonne (7-8/10)
- ✅ **Majorité des domaines**: Dette faible à moyenne

### Points Critiques
- ❌ **packages/**: Dette énorme (copie complète du projet)
- ❌ **lib/cv/**: Dette énorme (dossier vide)
- ❌ **lib/jobs/, lib/queue/**: Dette élevée (implementation limitée)
- ❌ **src/, sil/, services/, runtime/**: Dette élevée (non documentés)
- ❌ **gateway/**: Dette élevée (architecture parallèle)
- ❌ **apps/**: Dette élevée (confusion apps/web/ vs app/)

### Recommandations Principales
1. **Supprimer packages/arena-engine/** (🔴 Critique)
2. **Clarifier apps/web/ vs app/** (🔴 Critique)
3. **Clarifier gateway/ vs apps/realtime-gateway/** (🔴 Critique)
4. **Documenter ou supprimer src/, sil/, services/, runtime/** (🔴 Critique)
5. **Restructurer lib/cv/** (🟠 Haute)
6. **Implémenter lib/jobs/, lib/queue/** (🟠 Haute)

### Prochaine Étape
Étape 9: Détecter les doublons et composants obsolètes
