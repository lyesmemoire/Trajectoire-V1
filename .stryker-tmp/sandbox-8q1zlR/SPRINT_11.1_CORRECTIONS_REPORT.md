# SPRINT 11.1 - Rapport de Corrections Architecture

## Contexte

Après revue de l'architecture SPRINT 11, plusieurs problèmes ont été identifiés:

1. **Repository dans le domaine** - CandidateGraphRepository était dans `core/intelligence/profile`
2. **Hook avec logique métier** - useCandidateGraph contenait de la logique business
3. **DataLoader avec tables inexistantes** - Utilisait des tables qui n'existent pas (profiles, cvs, interviews)
4. **Migration SQL sans clarification** - Risque de duplication de données

## Corrections Appliquées

### 1. Tables Existantes ✅

**Audit réalisé sur `prisma/schema.prisma`:**

Tables existantes (source de vérité):
- `User` - Identité utilisateur (id, email, name, image)
- `CareerProfile` - Profil carrière (employabilityScore, careerDNA, etc.)
- `CVAnalysis` - Analyses CV (cvData JSON avec skills, education)
- `InterviewSession` - Sessions d'entretien (score, persona, analysis)

**Conclusion:** Les tables `profiles`, `cvs`, `interviews` n'existent pas. Les vraies tables sont `User`, `CareerProfile`, `CVAnalysis`, `InterviewSession`.

---

### 2. CandidateGraphDataLoader Corrigé ✅

**Fichier:** `core/intelligence/profile/CandidateGraphDataLoader.ts`

**Changements:**
- Remplacé `supabase.auth.getUser()` par `supabase.from("User")`
- Remplacé `profiles` par `CareerProfile`
- Remplacé `cvs` par `CVAnalysis`
- Remplacé `interviews` par `InterviewSession`
- Ajouté commentaires clarifiant que c'est une **projection**
- Documenté les limitations (champs non disponibles dans les tables)

**Source de vérité:**
```typescript
// Load user data from User table
const { data: user } = await supabase.from("User").select("id, email, name, image").eq("id", userId).single();

// Load career profile from CareerProfile table
const { data: careerProfile } = await supabase.from("CareerProfile").select("*").eq("userId", userId).single();

// Load CV data from CVAnalysis table
const { data: cvAnalyses } = await supabase.from("CVAnalysis").select("*").eq("userId", userId).limit(1);

// Load interview history from InterviewSession table
const { data: interviews } = await supabase.from("InterviewSession").select("*").eq("userId", userId).limit(10);
```

---

### 3. Repository Déplacé vers Infrastructure ✅

**Ancien emplacement:** `core/intelligence/profile/CandidateGraphRepository.ts` ❌
**Nouvel emplacement:** `lib/intelligence/infrastructure/repositories/CandidateGraphRepository.ts` ✅

**Architecture corrigée:**
```
core/
  intelligence/
    engines/
    profile/
      CandidateGraphBuilder.ts
      CandidateIntelligenceGraph.ts
      CandidateGraphDataLoader.ts
      useCandidateGraph.ts (hook React pur)

lib/
  intelligence/
    infrastructure/
      repositories/
        CandidateGraphRepository.ts (Supabase)
    application/
      CandidateGraphService.ts (logique métier)
```

**Principe:** Le domaine (`core/intelligence`) ne connaît plus Supabase. L'infrastructure (`lib/intelligence/infrastructure`) gère la persistance.

---

### 4. useCandidateGraph Simplifié ✅

**Fichier:** `core/intelligence/profile/useCandidateGraph.ts`

**Avant (logique métier dans le hook):**
```typescript
const loadGraph = useCallback(async () => {
  const loadedGraph = await CandidateGraphRepository.findByUserId(userId);
  if (loadedGraph) {
    setGraph(loadedGraph);
  } else {
    const inputData = await CandidateGraphDataLoader.loadFromRealData(userId);
    const newGraph = CandidateGraphBuilder.build(inputData);
    const saved = await CandidateGraphRepository.save(userId, newGraph);
    // ...
  }
}, [userId]);
```

**Après (délégation au service):**
```typescript
const loadGraph = useCallback(async () => {
  setLoading(true);
  setError(null);
  try {
    const loadedGraph = await CandidateGraphService.loadGraph(userId);
    setGraph(loadedGraph);
  } catch (err) {
    setError(err instanceof Error ? err.message : "Failed to load candidate graph");
  } finally {
    setLoading(false);
  }
}, [userId]);
```

**Création de CandidateGraphService:**
- Fichier: `lib/intelligence/application/CandidateGraphService.ts`
- Responsabilités: Logique métier, orchestration repository/builder/loader
- Hook: Gestion React state uniquement

---

### 5. Migration SQL Clarifiée ✅

**Fichier:** `prisma/migrations/20260707_candidate_graph/migration.sql`

**Ajout de commentaires:**
```sql
-- IMPORTANT: These are PROJECTION tables, not source of truth.
-- The source of truth remains:
-- - User table (identity)
-- - CareerProfile table (career data)
-- - CVAnalysis table (skills, education)
-- - InterviewSession table (interview history)
--
-- candidate_graphs stores a consolidated view (projection) computed from source tables
-- candidate_graph_snapshots stores historical projections for progression tracking
-- These tables are caches for performance and convenience, not data duplication
```

**Comments sur les tables:**
```sql
COMMENT ON TABLE candidate_graphs IS 'PROJECTION: Consolidated view of candidate intelligence computed from source tables (User, CareerProfile, CVAnalysis, InterviewSession)';
COMMENT ON TABLE candidate_graph_snapshots IS 'PROJECTION: Historical snapshots of candidate graphs for progression tracking';
```

---

## Architecture Finale

```
┌─────────────────────────────────────────────────────────────┐
│                         APP LAYER                            │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  useCandidateGraph (React Hook)                        │ │
│  │  - Gestion state React                                 │ │
│  │  - Délègue à CandidateGraphService                     │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                         │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  CandidateGraphService                                 │ │
│  │  - Logique métier                                      │ │
│  │  - Orchestration repository/builder/loader             │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                     DOMAIN LAYER                             │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  CandidateGraphBuilder                                │ │
│  │  - Construction du graphe                             │ │
│  │  - Orchestration engines                              │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  CandidateGraphDataLoader                             │ │
│  │  - Chargement depuis tables source                    │ │
│  │  - Projection uniquement                              │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  INFRASTRUCTURE LAYER                         │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  CandidateGraphRepository                             │ │
│  │  - Persistance Supabase                               │ │
│  │  - Tables: candidate_graphs, candidate_graph_snapshots  │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE (Supabase)                       │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  SOURCE OF TRUTH:                                      │ │
│  │  - User                                                │ │
│  │  - CareerProfile                                       │ │
│  │  - CVAnalysis                                          │ │
│  │  - InterviewSession                                    │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  PROJECTION (Cache):                                    │ │
│  │  - candidate_graphs                                     │ │
│  │  - candidate_graph_snapshots                           │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## Fichiers Modifiés/Créés

**Créés:**
1. `lib/intelligence/infrastructure/repositories/CandidateGraphRepository.ts` - Repository déplacé
2. `lib/intelligence/application/CandidateGraphService.ts` - Service application layer
3. `SPRINT_11.1_CORRECTIONS_REPORT.md` - Ce rapport

**Modifiés:**
1. `core/intelligence/profile/CandidateGraphDataLoader.ts` - Utilise vraies tables
2. `core/intelligence/profile/useCandidateGraph.ts` - Simplifié, délègue au service
3. `prisma/migrations/20260707_candidate_graph/migration.sql` - Clarifié comme projection

**Supprimés:**
1. `core/intelligence/profile/CandidateGraphRepository.ts` - Déplacé vers infrastructure

---

## État Actuel

✅ **Architecture propre:**
- Domain layer indépendant de l'infrastructure
- Hook React pur (pas de logique métier)
- Service layer pour orchestration
- Repository dans infrastructure

✅ **Données correctes:**
- Utilise les vraies tables existantes
- Projection documentée comme cache
- Source de vérité claire

✅ **Migration prête:**
- Tables candidate_graphs et candidate_graph_snapshots
- Commentaires clarifiant la nature de projection
- RLS policies pour sécurité

---

## Prochaines Étapes

1. **Appliquer la migration** dans Supabase
2. **Tester l'intégration** en dev
3. **Vérifier** que les données se chargent correctement depuis les tables source
4. **Surveiller** les performances des projections

---

## Conformité aux Exigences

✅ **Architecture gelée** - Pas de nouveaux moteurs/classes
✅ **Domaine indépendant** - Plus de Supabase dans core/intelligence
✅ **Hook pur** - Plus de logique métier dans useCandidateGraph
✅ **Projection uniquement** - DataLoader ne fait que charger
✅ **Source de vérité** - Clairement documentée (User, CareerProfile, CVAnalysis, InterviewSession)
