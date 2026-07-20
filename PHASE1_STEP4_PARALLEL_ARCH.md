# PHASE 1 — Étape 4: Identifier les Architectures Parallèles

## Objectif
Identifier les architectures parallèles, les générations multiples de code, et les doublons fonctionnels.

---

## Architectures Parallèles Critiques

### 1. packages/arena-engine/ vs Projet Principal
**Sévérité**: 🔴 Critique
**Taille**: 1546 items (copie complète)
**Emplacement**: `packages/arena-engine/` vs racine du projet

**Contenu de arena-engine/**:
- Copie complète de `app/` (143 items)
- Copie complète de `apps/` (276 items)
- Copie complète de `components/` (117 items)
- Copie complète de `core/` (122 items)
- Copie complète de `lib/` (307 items)
- Copie complète de `domain/` (6 items)
- Copie complète de `gateway/` (19 items)
- Copie complète de `services/` (5 items)
- Copie complète de `sil/` (108 items)
- Copie complète de `src/` (108 items)
- Copie complète de `tests/` (79 items)
- Toute la documentation (.md files)
- Toute la configuration

**Analyse**:
- Ce package est une copie quasi identique du projet principal
- Probablement créé par erreur ou comme backup
- Aucune justification documentée
- Crée une confusion majeure sur l'architecture

**Impact**:
- Confusion sur l'architecture réelle
- Maintenance dupliquée
- Taille du projet artificiellement augmentée
- Risque de divergence entre les deux copies

**Recommandation**:
- **Action**: Supprimer `packages/arena-engine/`
- **Priorité**: 🔴 Critique
- **Justification**: Copie inutile du projet principal

---

### 2. apps/web/ vs app/
**Sévérité**: 🟠 Élevée
**Taille**: apps/web/ (154 items) vs app/ (144 items)
**Emplacement**: `apps/web/` vs `app/`

**Analyse de apps/web/**:
- Application Next.js indépendante
- Structure: src/, public/, configuration
- Package.json séparé
- Configuration Next.js séparée

**Analyse de app/**:
- Application Next.js (App Router)
- Structure: marketing/, admin/, api/, auth/, cv/, etc.
- Intégrée au projet principal

**Hypothèses**:
1. apps/web/ est une ancienne version de l'application
2. apps/web/ est une version alternative de l'application
3. apps/web/ est un template ou scaffold non utilisé

**Impact**:
- Confusion sur l'application principale
- Maintenance dupliquée
- Risque de divergence

**Recommandation**:
- **Action**: Clarifier l'utilité de apps/web/
- **Priorité**: 🟠 Élevée
- **Justification**: Deux applications Next.js créent de la confusion

---

### 3. gateway/ vs apps/realtime-gateway/
**Sévérité**: 🟠 Élevée
**Taille**: gateway/ (19 items) vs apps/realtime-gateway/ (188 items)
**Emplacement**: `gateway/` vs `apps/realtime-gateway/`

**Analyse de gateway/**:
- Gateway WebSocket
- Services gateway
- Taille réduite (19 items)

**Analyse de apps/realtime-gateway/**:
- Gateway WebSocket complète
- Architecture documentée (ARCHITECTURE.md)
- Tests (9 items)
- Scripts (7 items)
- Apps internes (7 items)
- Taille importante (188 items)

**Hypothèses**:
1. gateway/ est une ancienne version de la gateway
2. gateway/ est une version simplifiée
3. gateway/ est un template ou scaffold

**Impact**:
- Confusion sur la gateway principale
- Maintenance dupliquée
- Risque de divergence

**Recommandation**:
- **Action**: Clarifier l'utilité de gateway/
- **Priorité**: 🟠 Élevée
- **Justification**: Deux gateways créent de la confusion

---

## Architectures Parallèles Mineures

### 4. components/marketing-old/ vs components/marketing/
**Sévérité**: 🟡 Moyenne
**Taille**: marketing-old/ (15 items) vs marketing/ (34 items)
**Emplacement**: `components/marketing-old/` vs `components/marketing/`

**Analyse**:
- marketing-old/ contient des anciens composants marketing
- marketing/ contient les composants marketing actuels
- marketing-old/ est probablement legacy

**Impact**:
- Code legacy non utilisé
- Encombrement du codebase
- Confusion sur les composants à utiliser

**Recommandation**:
- **Action**: Supprimer marketing-old/ si non utilisé
- **Priorité**: 🟡 Moyenne
- **Justification**: Code legacy à nettoyer

---

### 5. packages/voice-core/ (vide)
**Sévérité**: 🟢 Faible
**Taille**: 0 items
**Emplacement**: `packages/voice-core/`

**Analyse**:
- Package vide
- Probablement créé mais jamais implémenté

**Impact**:
- Encombrement mineur
- Confusion sur l'architecture

**Recommandation**:
- **Action**: Supprimer voice-core/
- **Priorité**: 🟢 Faible
- **Justification**: Package vide inutile

---

### 6. packages/voice-interview-client/ (vide)
**Sévérité**: 🟢 Faible
**Taille**: 0 items
**Emplacement**: `packages/voice-interview-client/`

**Analyse**:
- Package vide
- Probablement créé mais jamais implémenté

**Impact**:
- Encombrement mineur
- Confusion sur l'architecture

**Recommandation**:
- **Action**: Supprimer voice-interview-client/
- **Priorité**: 🟢 Faible
- **Justification**: Package vide inutile

---

## Générations Multiples Identifiées

### 1. Architecture v1 vs Architecture Actuelle
**Documents**:
- `architecture-v1.json`
- `architecture-v1.md`
- `RELEASE_NOTES_v1.md`

**Analyse**:
- Documents d'architecture v1 existent
- Architecture actuelle est différente
- Probablement une évolution de l'architecture

**Impact**:
- Documentation obsolète
- Confusion sur l'architecture actuelle
- Difficulté à comprendre l'évolution

**Recommandation**:
- **Action**: Mettre à jour ou archiver la documentation v1
- **Priorité**: 🟡 Moyenne
- **Justification**: Documentation à jour ou archivée

---

### 2. Supabase Patches v1 vs v2
**Documents**:
- `supabase/patches-v2.sql`

**Analyse**:
- Patches v2 existent
- Probablement des patches v1 existent ou ont existé
- Évolution des patches Supabase

**Impact**:
- Confusion sur les patches à appliquer
- Risque d'appliquer les mauvais patches

**Recommandation**:
- **Action**: Clarifier les patches v1 vs v2
- **Priorité**: 🟡 Moyenne
- **Justification**: Clarification des patches

---

## Doublons Fonctionnels Potentiels

### 1. Audio Processing
**Emplacements**:
- `lib/audio/`
- `core/audio/`
- `lib/realtime/audio/`
- `components/audio/`

**Analyse**:
- Audio processing est réparti sur plusieurs emplacements
- Probablement des couches différentes (UI, core, realtime)
- À vérifier pour les doublons fonctionnels

**Impact**:
- Potentiel de doublons
- Difficulté à localiser la logique audio

**Recommandation**:
- **Action**: Audit de la logique audio
- **Priorité**: 🟡 Moyenne
- **Justification**: Vérifier les doublons

---

### 2. Interview Logic
**Emplacements**:
- `lib/interview/`
- `core/interview-preparation/`
- `app/interview/`
- `apps/web/src/` (probablement)

**Analyse**:
- Interview logic est répartie sur plusieurs emplacements
- Probablement des couches différentes (UI, application, core)
- À vérifier pour les doublons fonctionnels

**Impact**:
- Potentiel de doublons
- Difficulté à localiser la logique interview

**Recommandation**:
- **Action**: Audit de la logique interview
- **Priorité**: 🟡 Moyenne
- **Justification**: Vérifier les doublons

---

### 3. CV Processing
**Emplacements**:
- `lib/cv/` (vide)
- `lib/ats/` (complet)
- `app/cv/`
- `components/cv/`

**Analyse**:
- CV core est vide
- ATS est complet
- Probablement une migration de CV vers ATS
- À vérifier pour les doublons

**Impact**:
- Confusion sur le traitement CV
- CV core vide mais ATS complet

**Recommandation**:
- **Action**: Clarifier CV vs ATS
- **Priorité**: 🟡 Moyenne
- **Justification**: Clarification de l'architecture

---

## Code Legacy vs Code Moderne

### 1. Marketing Components
**Legacy**: `components/marketing-old/`
**Moderne**: `components/marketing/`

**Analyse**:
- marketing-old/ contient des anciens composants
- marketing/ contient les composants actuels
- Probablement une migration en cours ou terminée

**Recommandation**:
- **Action**: Supprimer marketing-old/ si la migration est terminée
- **Priorité**: 🟡 Moyenne

---

### 2. Architecture Documentation
**Legacy**: `architecture-v1.md`, `architecture-v1.json`
**Moderne**: `ARCHITECTURE.md`, `ARCHITECTURE_MAP.md`

**Analyse**:
- Documentation v1 existe
- Documentation actuelle existe
- Probablement une évolution de l'architecture

**Recommandation**:
- **Action**: Archiver ou supprimer la documentation v1
- **Priorité**: 🟡 Moyenne

---

## Dossiers Non Documentés

### 1. src/
**Taille**: 86 items
**État**: Non documenté
**Hypothèse**: Source code alternatif ou ancien

**Recommandation**:
- **Action**: Clarifier l'utilité de src/
- **Priorité**: 🟡 Moyenne

---

### 2. sil/
**Taille**: 108 items
**État**: Non documenté
**Hypothèse**: System Integration Layer?

**Recommandation**:
- **Action**: Documenter ou supprimer sil/
- **Priorité**: 🟡 Moyenne

---

### 3. services/
**Taille**: 5 items
**État**: Non documenté
**Hypothèse**: Services backend

**Recommandation**:
- **Action**: Documenter services/
- **Priorité**: 🟡 Moyenne

---

### 4. runtime/
**Taille**: 1 item
**État**: Non documenté
**Hypothèse**: Runtime utilities

**Recommandation**:
- **Action**: Documenter runtime/
- **Priorité**: 🟢 Faible

---

## Synthèse des Architectures Parallèles

### Critiques (🔴)
1. **packages/arena-engine/** — Copie complète du projet (1546 items)

### Élevées (🟠)
2. **apps/web/ vs app/** — Deux applications Next.js
3. **gateway/ vs apps/realtime-gateway/** — Deux gateways

### Moyennes (🟡)
4. **components/marketing-old/** — Code legacy
5. **Architecture v1 docs** — Documentation obsolète
6. **Audio processing** — Réparti sur plusieurs emplacements
7. **Interview logic** — Réparti sur plusieurs emplacements
8. **CV vs ATS** — CV core vide, ATS complet
9. **src/** — Non documenté
10. **sil/** — Non documenté
11. **services/** — Non documenté

### Faibles (🟢)
12. **packages/voice-core/** — Vide
13. **packages/voice-interview-client/** — Vide
14. **runtime/** — Non documenté

---

## Plan d'Action Prioritaire

### Immédiat (🔴 Critique)
1. **Supprimer packages/arena-engine/**
   - Justification: Copie inutile du projet principal
   - Impact: Réduction de 1546 items

### Court Terme (🟠 Élevée)
2. **Clarifier apps/web/ vs app/**
   - Action: Déterminer l'application principale
   - Impact: Clarification de l'architecture

3. **Clarifier gateway/ vs apps/realtime-gateway/**
   - Action: Déterminer la gateway principale
   - Impact: Clarification de l'architecture

### Moyen Terme (🟡 Moyenne)
4. **Supprimer components/marketing-old/**
   - Action: Nettoyage du code legacy
   - Impact: Réduction de 15 items

5. **Archiver documentation v1**
   - Action: Archiver architecture-v1.md, architecture-v1.json
   - Impact: Documentation à jour

6. **Audit audio processing**
   - Action: Vérifier les doublons
   - Impact: Clarification de la logique audio

7. **Audit interview logic**
   - Action: Vérifier les doublons
   - Impact: Clarification de la logique interview

8. **Clarifier CV vs ATS**
   - Action: Documenter la migration
   - Impact: Clarification de l'architecture

9. **Documenter src/, sil/, services/**
   - Action: Documenter ou supprimer
   - Impact: Clarification de l'architecture

### Long Terme (🟢 Faible)
10. **Supprimer packages vides**
    - Action: Supprimer voice-core/, voice-interview-client/
    - Impact: Nettoyage mineur

---

## Conclusions de l'Étape 4

### Points Critiques
- ❌ **packages/arena-engine/**: Copie complète du projet (1546 items)
- ❌ **apps/web/ vs app/**: Deux applications Next.js
- ❌ **gateway/ vs apps/realtime-gateway/**: Deux gateways

### Points à Clarifier
- ⚠️ **src/**: Source code non documenté
- ⚠️ **sil/**: Acronyme non documenté
- ⚠️ **services/**: Services non documentés
- ⚠️ **Audio processing**: Réparti sur plusieurs emplacements
- ⚠️ **Interview logic**: Réparti sur plusieurs emplacements
- ⚠️ **CV vs ATS**: CV core vide, ATS complet

### Recommandations Principales
1. **Supprimer packages/arena-engine/** (🔴 Critique)
2. **Clarifier apps/web/ vs app/** (🟠 Élevée)
3. **Clarifier gateway/ vs apps/realtime-gateway/** (🟠 Élevée)
4. **Nettoyer le code legacy** (🟡 Moyenne)
5. **Documenter les dossiers non documentés** (🟡 Moyenne)

### Prochaine Étape
Étape 5: Cartographie IA (prompts, embeddings, mémoire, matching, scoring, reasoning, orchestration)
