# SECURITY-FIX-002-DIAGNOSTIC

## ÉTAPE 0: INSPECTION COMPLÈTE - DIAGNOSTIC PRÉCIS

### ARCHITECTURE D'IDENTITÉ ACTUELLE

**Web (Next.js):**
- Source: Supabase Auth Session (`supabase.auth.getUser()`)
- Vérification: Présente sur la plupart des endpoints
- Middleware: `withAuthorization` disponible et utilisé sur certains endpoints
- Statut: PARTIELLEMENT SÉCURISÉ

**API (NestJS):**
- Source: AUCUNE - userId passé dans le body par le client
- Vérification: AUCUN AuthGuard, AUCUN middleware d'authentification
- JWT/Passport: NON CONFIGURÉ
- Statut: CRITIQUE - AUCUNE SÉCURITÉ

### CONTROLLERS API NESTJS - ANALYSE

| Controller | Endpoints | Auth Required | userId Source | Ownership Check | Risque |
|------------|-----------|---------------|--------------|----------------|--------|
| cv.controller.ts | /cv/upload, /cv/extract, /cv/normalize, /cv/build-graph, /cv/generate-profile | **NON** | Aucune | Aucune | CRITICAL |
| job.controller.ts | /job/upload, /job/extract, /job/normalize, /job/build-graph, /job/generate-profile | **NON** | Aucune | Aucune | CRITICAL |
| matching.controller.ts | /matching/calculate-score, /matching/explain, /matching/report | **NON** | Aucune | Aucune | CRITICAL |
| graph.controller.ts | /graph/* (toutes les opérations CRUD) | **NON** | Aucune | Aucune | CRITICAL |
| search.controller.ts | /search/* (toutes les opérations de recherche) | **NON** | Aucune | Aucune | CRITICAL |
| copilot.controller.ts | /copilot/message, /copilot/sessions, /copilot/history | **NON** | Body.userId | Partielle (service) | CRITICAL |

### ENDPOINTS WEB NEXT.JS - ANALYSE

| Endpoint | Auth Required | Auth Source | Ownership Check | Risque |
|----------|--------------|-------------|----------------|--------|
| /api/user/subscription | OUI | Supabase | OUI (userId: user.id) | LOW |
| /api/cv/upload | OUI | Supabase | OUI (userId: user.id) | LOW |
| /api/cv/analyze | OUI | Supabase | OUI (userId: user.id) | LOW |
| /api/cv/rewrite | OUI | Supabase | OUI (userId: user.id) | LOW |
| /api/interview/* | OUI | Supabase | OUI (userId: user.id) | LOW |
| /api/simulation/* | OUI | Supabase | OUI (userId: user.id) | LOW |
| /api/knowledge/nodes | OUI | Supabase | OUI (userId: user.id) | LOW |
| /api/matching/history | OUI | Supabase | OUI (userId: user.id) | LOW |
| /api/account/* | OUI | Supabase | OUI (userId: user.id) | LOW |
| /api/stripe/* | OUI | Supabase | OUI (userId: user.id) | LOW |

### SCHÉMA PRISMA - ANALYSE D'OWNERSHIP

| Modèle | userId Field | FK vers User | Index | Cascade | Statut |
|--------|--------------|--------------|-------|---------|--------|
| User | id (PK) | - | - | - | OK |
| CVAnalysis | userId | ✓ | ✓ | ✓ | OK |
| Subscription | userId | ✓ | ✓ | ✓ | OK |
| Session | userId | ✓ | ✓ | ✓ | OK |
| InterviewSession | userId | ✓ | ✓ | ✓ | OK |
| Graph | **AUCUN** | ✗ | ✗ | - | **CRITICAL** |
| GraphNode | graphId → Graph | ✗ (indirect) | ✓ | ✓ | **CRITICAL** |
| GraphEdge | graphId → Graph | ✗ (indirect) | ✓ | ✓ | **CRITICAL** |
| GraphVersion | graphId → Graph | ✗ (indirect) | ✓ | ✓ | **CRITICAL** |
| GraphSnapshot | graphId → Graph | ✗ (indirect) | ✓ | ✓ | **CRITICAL** |

### REPOSITORIES PRISMA - ANALYSE DE FILTRAGE

| Repository | Méthode | Filtrage userId | Risque |
|------------|---------|----------------|--------|
| GraphRepository.listGraphs() | findMany() | **NON** | CRITICAL |
| GraphRepository.getGraphById() | findUnique() | **NON** | CRITICAL |
| GraphRepository.createGraph() | create() | **NON** | CRITICAL |
| GraphRepository.updateGraph() | update() | **NON** | CRITICAL |
| GraphRepository.deleteGraph() | delete() | **NON** | CRITICAL |
| CopilotPersistenceService.getConversationHistory() | findMany() | OUI (userId) | LOW |
| CopilotPersistenceService.getAllSessions() | findMany() | OUI (userId) | LOW |
| CopilotContextService.loadCVWithOwnership() | findUnique() | OUI (vérification après) | MEDIUM |
| CopilotContextService.loadJobWithOwnership() | findUnique() | OUI (vérification après) | MEDIUM |

### VULNÉRABILITÉS IDENTIFIÉES

#### CRITICAL (5)

1. **API NestJS sans authentification**
   - Tous les controllers API acceptent des requêtes sans authentification
   - Aucun AuthGuard, AUCUN middleware
   - Aucune configuration JWT/Passport
   - Impact: N'importe qui peut appeler /cv/upload, /graph/*, /search/*, etc.

2. **Graph model sans userId**
   - Le modèle Graph n'a pas de champ userId
   - Aucune FK vers User
   - Aucune isolation DB possible
   - Impact: Data leak massif possible via GraphRepository

3. **GraphRepository sans filtrage utilisateur**
   - listGraphs() retourne TOUS les graphs de TOUS les utilisateurs
   - getGraphById() ne vérifie pas l'ownership
   - Impact: Cross-user data leak garanti

4. **CopilotController accepte userId client**
   - userId passé dans le body
   - Pas de vérification côté serveur
   - Impact: Impersonation possible

5. **Search/Matching/Job/CV endpoints sans auth**
   - Tous les endpoints de traitement acceptent des requêtes sans auth
   - Impact: Utilisation non autorisée des ressources

#### HIGH (2)

1. **CopilotContextService vérification d'ownership après query**
   - Charge d'abord la ressource, puis vérifie l'ownership
   - Pas optimal mais fonctionnel
   - Impact: Possibilité d'amélioration

2. **Authorization middleware non utilisé sur API NestJS**
   - Le middleware existe mais n'est pas appliqué aux controllers API
   - Impact: Aucune protection sur l'API

#### MEDIUM (1)

1. **Rate limiting décorateurs sans vérification d'implémentation**
   - Décorateurs présents mais implémentation non vérifiée
   - Impact: Possibilité de bypass

### CHEMINS D'IDENTITÉ ACTUELS

#### CORRECT (Web Next.js)
```
HTTP Request
    ↓
Supabase Session Cookie/Header
    ↓
supabase.auth.getUser()
    ↓
user.id (vérifié)
    ↓
Prisma query scoped to user.id
```

#### INCORRECT (API NestJS)
```
HTTP Request
    ↓
Body.userId (client-provided)
    ↓
Prisma query scoped to body.userId
    ↓
IMPACT: Client peut usurper n'importe quel userId
```

#### INCORRECT (API NestJS - sans userId)
```
HTTP Request
    ↓
Aucune vérification
    ↓
Prisma query sans filtre utilisateur
    ↓
IMPACT: Data leak massif
```

### ENDPOINTS VULNÉRABLES - LISTE COMPLÈTE

**API NestJS (Tous CRITICAL):**
- POST /cv/upload
- POST /cv/extract
- POST /cv/normalize
- POST /cv/build-graph
- POST /cv/generate-profile
- POST /job/upload
- POST /job/extract
- POST /job/normalize
- POST /job/build-graph
- POST /job/generate-profile
- POST /matching/calculate-score
- POST /matching/explain
- POST /matching/report
- POST /graph (create)
- GET /graph/:id
- PUT /graph/:id
- DELETE /graph/:id
- DELETE /graph/:id/hard
- POST /graph/:id/restore
- GET /graph (list)
- POST /graph/:id/nodes
- GET /graph/:id/nodes
- PUT /graph/nodes/:nodeId
- DELETE /graph/nodes/:nodeId
- POST /graph/:id/edges
- GET /graph/:id/edges
- PUT /graph/edges/:edgeId
- DELETE /graph/edges/:edgeId
- POST /graph/:id/versions
- GET /graph/:id/versions
- GET /graph/:id/versions/:version
- POST /graph/:id/versions/:version/rollback
- POST /graph/:id/snapshots
- GET /graph/:id/snapshots
- GET /graph/snapshots/:snapshotId
- POST /graph/snapshots/:snapshotId/restore
- POST /search/candidates
- POST /search/jobs
- POST /search/similar-candidates
- POST /search/similar-jobs
- POST /search/career-path
- POST /search/recruiter
- POST /copilot/message
- POST /copilot/sessions
- GET /copilot/history/:sessionId

### RECOMMANDATION ARCHITECTURE

**Option A: JWT Auth pour API NestJS**
- Avantages: Standard, testé, compatible avec Supabase JWT
- Inconvénients: Configuration requise
- Recommandation: OUI - utiliser Supabase JWT

**Option B: Supabase Auth côté serveur pour API**
- Avantages: Compatible avec Web, déjà utilisé
- Inconvénients: Dépendance à Supabase
- Recommandation: OUI - utiliser Supabase admin client

**Option C: API Key / Token custom**
- Avantages: Flexibilité
- Inconvénients: Complexité, maintenance
- Recommandation: NON - utiliser Supabase JWT existant

### ORDRE DE CORRECTION RECOMMANDÉ

1. **CRITICAL: Ajouter userId au modèle Graph** (migration DB)
2. **CRITICAL: Configurer JWT Auth pour API NestJS** (Supabase JWT)
3. **CRITICAL: Ajouter AuthGuard à tous les controllers API**
4. **CRITICAL: Mettre à jour GraphRepository avec filtrage userId**
5. **CRITICAL: Supprimer confiance au userId client dans CopilotController**
6. **HIGH: Vérifier et corriger tous les endpoints API restants**
7. **MEDIUM: Vérifier implémentation rate limiting**
8. **LOW: Tests de sécurité réels**

### BLOQUEURS IDENTIFIÉS

**AUCUN BLOQUEUR** - Toutes les corrections sont techniquement faisables.

### RISQUES DE MIGRATION

**Graph userId migration:**
- Données existantes: Graphs avec metadata.userId
- Backfill possible: OUI, depuis metadata.userId
- Graphs sans metadata: Devront être soft-deleted
- Impact: Aucune perte de données utilisateur

**JWT Auth configuration:**
- Breaking change: OUI pour les clients API
- Migration: Clients doivent envoyer JWT Bearer token
- Impact: Élevé mais nécessaire

### STATUT ACTUEL

**AUTHENTICATION API:** FAIL (aucune auth)
**AUTHORIZATION API:** FAIL (aucune auth)
**TENANT ISOLATION API:** FAIL (Graph sans userId)
**AUTHENTICATION WEB:** PASS (Supabase correct)
**AUTHORIZATION WEB:** PASS (middleware utilisé)
**TENANT ISOLATION WEB:** PASS (userId correct)

**CONCLUSION:** L'API NestJS est complètement non sécurisée et nécessite une refonte complète de l'authentification.
