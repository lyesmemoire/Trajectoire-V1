# SECURITY-FIX-001-AUDIT

## PHASE 1: ARCHITECTURE ACTUELLE

### Type d'Isolation
**USER-LEVEL ISOLATION** (pas de tenant-level)

L'application utilise `userId` comme frontière d'isolation principale.

### Source d'Identité
- **Web**: Supabase Auth Session (`supabase.auth.getUser()`)
- **API**: userId passé dans le corps de la requête (VULNÉRABLE)

### Frontières d'Ownership
| Modèle | Chambre d'Ownership | FK vers User | Index | Cascade |
|--------|---------------------|--------------|-------|---------|
| User | id | - | - | - |
| CVAnalysis | userId | ✓ | ✓ | ✓ |
| Subscription | userId | ✓ | ✓ | ✓ |
| Session | userId | ✓ | ✓ | ✓ |
| InterviewSession | userId | ✓ | ✓ | ✓ |
| Graph | **AUCUNE** | ✗ | ✗ | - |
| GraphNode | graphId → Graph | ✗ | ✓ | ✓ |
| GraphEdge | graphId → Graph | ✗ | ✓ | ✓ |
| GraphVersion | graphId → Graph | ✗ | ✓ | ✓ |
| GraphSnapshot | graphId → Graph | ✗ | ✓ | ✓ |

## PHASE 2: ENDPOINTS VULNÉRABLES

### API Endpoints (NestJS)
| Endpoint | Méthode | Identité Source | Ownership Check | Tenant Filter | Risque |
|----------|---------|----------------|----------------|--------------|--------|
| /cv/upload | POST | Aucune | ✗ | ✗ | CRITICAL |
| /cv/extract | POST | Aucune | ✗ | ✗ | CRITICAL |
| /cv/normalize | POST | Aucune | ✗ | ✗ | CRITICAL |
| /cv/build-graph | POST | Aucune | ✗ | ✗ | CRITICAL |
| /copilot/message | POST | Body.userId | ✓ (service) | ✗ | HIGH |
| /copilot/sessions | POST | Body.userId | ✗ | ✗ | CRITICAL |
| /copilot/history/:sessionId | GET | Body.userId | ✗ | ✗ | CRITICAL |
| /graph/* | * | Aucune | ✗ | ✗ | CRITICAL |

### Web Endpoints (Next.js)
| Endpoint | Méthode | Identité Source | Ownership Check | Tenant Filter | Risque |
|----------|---------|----------------|----------------|--------------|--------|
| /api/user/subscription | GET | Supabase Session | ✓ | ✓ | LOW |
| /api/cv/upload | POST | Supabase Session | ✓ | ✓ | LOW |
| /api/interview/* | * | Supabase Session | ✓ | ✓ | LOW |
| /api/stripe/* | * | Supabase Session | ✓ | ✓ | LOW |

## PHASE 3: MODÈLES VULNÉRABLES

### CRITICAL: Graph Model
```prisma
model Graph {
  id          String       @id @default(cuid())
  name        String
  description String?
  version     Int          @default(1)
  isActive    Boolean      @default(true)
  source      String       @default("MANUAL")
  metadata    Json?        @default("{}")
  deletedAt   DateTime?    @map("deleted_at")
  createdAt   DateTime     @default(now()) @map("created_at")
  updatedAt   DateTime     @updatedAt @map("updated_at")
  
  // MANQUE: userId field
  // MANQUE: FK vers User
  // MANQUE: Index sur userId
}
```

**Impact**: 
- Aucune isolation au niveau DB
- GraphRepository.listGraphs() retourne tous les graphs
- GraphRepository.getGraphById() ne vérifie pas l'ownership
- GraphNode, GraphEdge, GraphVersion, GraphSnapshot héritent de cette vulnérabilité

### HIGH: Copilot Service
```typescript
// copilot.controller.ts
async processMessage(@Body() body: { 
  sessionId: string; 
  message: string; 
  userId?: string;  // ← Client-provided, non vérifié
  cvId?: string; 
  jobId?: string 
})
```

**Impact**:
- Le client peut envoyer n'importe quel userId
- Pas de garde d'authentification NestJS
- Dépend du service pour vérifier l'ownership

### HIGH: Graph Repository
```typescript
// graph-repository.service.ts
async listGraphs(filter: GraphFilter = {}): Promise<Graph[]> {
  const prismaGraphs = await this.prisma.graph.findMany({
    where: this.buildGraphWhere(filter),  // ← Pas de userId dans where
    skip,
    take,
    orderBy: { createdAt: 'desc' },
  });
  return prismaGraphs.map((g) => this.mapPrismaGraphToGraph(g));
}
```

**Impact**:
- listGraphs() retourne tous les graphs de tous les utilisateurs
- Aucun filtrage par utilisateur
- Potentiel de data leak massif

## PHASE 4: ANALYSE DES SERVICES

### CopilotContextService - PARTIELLEMENT SÉCURISÉ
```typescript
private async loadCVWithOwnership(userId: string, cvId: string) {
  const cv = await this.prisma.cVAnalysis.findUnique({
    where: { id: cvId },
  });

  if (!cv) {
    throw new NotFoundException(`CV not found: ${cvId}`);
  }

  if (cv.userId !== userId) {  // ← Vérification d'ownership
    throw new ForbiddenException(`Access denied to CV: ${cvId}`);
  }

  return cv;
}
```

**Statut**: ✓ Ownership check présent pour CV et Job
**Problème**: Le userId vient du client, pas de l'authentification serveur

### AuthorizationMiddleware - PRÉSENT MAIS NON UTILISÉ
```typescript
// authorization-middleware.ts
export function withAuthorization<T extends (...args: any[]) => Promise<NextResponse>>(
  handler: T,
  options: AuthorizationOptions = {}
): T {
  // Crée AuthContext depuis Supabase Session
  // Vérifie access level
  // Attache x-user-id header
}
```

**Statut**: ✓ Middleware existe et est correct
**Problème**: Non utilisé sur les endpoints API NestJS
**Problème**: Non utilisé sur tous les endpoints Web Next.js

## PHASE 5: PLAN DE CORRECTION

### Correction 1: Ajouter userId au modèle Graph
```prisma
model Graph {
  id          String       @id @default(cuid())
  userId      String       @map("user_id")
  name        String
  description String?
  version     Int          @default(1)
  isActive    Boolean      @default(true)
  source      String       @default("MANUAL")
  metadata    Json?        @default("{}")
  deletedAt   DateTime?    @map("deleted_at")
  createdAt   DateTime     @default(now()) @map("created_at")
  updatedAt   DateTime     @updatedAt @map("updated_at")
  
  user        User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  nodes       GraphNode[]
  edges       GraphEdge[]
  versions    GraphVersion[]
  snapshots   GraphSnapshot[]

  @@index([userId])
  @@index([isActive])
  @@index([deletedAt])
  @@index([source])
  @@index([createdAt])
  @@index([isActive, source])
  @@index([userId, isActive])
  @@map("graphs")
  @@schema("public")
}
```

### Correction 2: Migrer les données existantes
```sql
-- Backfill userId depuis metadata.userId
UPDATE graphs 
SET user_id = (metadata->>'userId')::text 
WHERE metadata->>'userId' IS NOT NULL 
AND user_id IS NULL;

-- Marquer les graphs sans userId comme orphelins
UPDATE graphs 
SET deleted_at = NOW(), 
    is_active = false 
WHERE user_id IS NULL 
AND deleted_at IS NULL;
```

### Correction 3: Mettre à jour GraphRepository
```typescript
async listGraphs(
  filter: GraphFilter = {},
  userId?: string,  // ← Ajouter userId
  skip = 0,
  take = 50,
): Promise<Graph[]> {
  const where = this.buildGraphWhere(filter);
  
  // Ajouter filtrage par utilisateur
  if (userId) {
    where.userId = userId;
  }
  
  const prismaGraphs = await this.prisma.graph.findMany({
    where,
    skip,
    take,
    orderBy: { createdAt: 'desc' },
  });

  return prismaGraphs.map((g) => this.mapPrismaGraphToGraph(g));
}

async getGraphById(
  id: string,
  userId?: string,  // ← Ajouter userId
  filter: GraphFilter = {},
): Promise<Graph | null> {
  const where = { id, ...this.buildGraphWhere(filter) };
  
  // Ajouter vérification d'ownership
  if (userId) {
    where.userId = userId;
  }
  
  const prismaGraph = await this.prisma.graph.findUnique({
    where,
    include: {
      nodes: {
        where: this.buildNodeWhere(filter),
      },
      edges: {
        where: this.buildEdgeWhere(filter),
      },
    },
  });

  if (!prismaGraph) {
    return null;
  }

  if (!filter.includeDeleted && prismaGraph.deletedAt) {
    return null;
  }

  const graph = this.mapPrismaGraphToGraph(prismaGraph);

  await this.cacheService.set(cacheKey, graph, 3600);
  return graph;
}
```

### Correction 4: Ajouter AuthGuard aux endpoints API NestJS
```typescript
// Créer JwtAuthGuard
@Injectable()
export class JwtAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    
    if (!token) {
      throw new UnauthorizedException();
    }
    
    try {
      const payload = await this.jwtService.verifyAsync(token);
      request.user = payload;  // ← Attacher user authentifié
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}

// Appliquer aux controllers
@Controller('copilot')
export class CopilotController {
  @UseGuards(JwtAuthGuard)
  @Post('message')
  async processMessage(
    @Request() req,  // ← User authentifié
    @Body() body: { sessionId: string; message: string; cvId?: string; jobId?: string }
  ) {
    const userId = req.user.id;  // ← Utiliser l'identité authentifiée
    // ...
  }
}
```

### Correction 5: Appliquer withAuthorization aux endpoints Web
```typescript
// apps/web/src/app/api/user/subscription/route.ts
import { withAuthAccess } from '@/lib/security/authorization-middleware';

export const GET = withAuthAccess(async (request: NextRequest) => {
  const authContext = await getAuthContext(request);
  const userId = authContext.userId;  // ← Utiliser l'identité authentifiée
  
  const result = await checkUserSubscription(userId);
  return NextResponse.json(result);
});
```

## PHASE 6: MIGRATIONS NÉCESSAIRES

### Migration 1: Ajouter userId à Graph
```sql
-- Ajouter la colonne userId
ALTER TABLE graphs 
ADD COLUMN user_id TEXT;

-- Ajouter la FK
ALTER TABLE graphs 
ADD CONSTRAINT graphs_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES "User"(id) 
ON DELETE CASCADE;

-- Ajouter l'index
CREATE INDEX graphs_user_id_idx ON graphs(user_id);
CREATE INDEX graphs_user_id_is_active_idx ON graphs(user_id, is_active);
```

### Migration 2: Backfill userId
```sql
-- Migrer les données existantes depuis metadata
UPDATE graphs 
SET user_id = (metadata->>'userId')::text 
WHERE metadata->>'userId' IS NOT NULL 
AND user_id IS NULL;
```

### Migration 3: Marquer les orphelins
```sql
-- Soft delete des graphs sans userId
UPDATE graphs 
SET deleted_at = NOW(), 
    is_active = false 
WHERE user_id IS NULL 
AND deleted_at IS NULL;
```

### Migration 4: Rendre userId NOT NULL (après backfill)
```sql
ALTER TABLE graphs 
ALTER COLUMN user_id SET NOT NULL;
```

## PHASE 7: RISQUES DE RÉGRESSION

### Risque 1: Données Graph orphelines
- **Impact**: Graphs existants sans userId seront soft-deleted
- **Mitigation**: Backfill depuis metadata.userId avant migration
- **Rollback**: Restaurer depuis backup si nécessaire

### Risque 2: Breaking change API
- **Impact**: GraphRepository.listGraphs() nécessite maintenant userId
- **Mitigation**: Ajouter userId comme paramètre optionnel avec défaut
- **Rollback**: Revert schema change

### Risque 3: Performance
- **Impact**: Index supplémentaire sur userId
- **Mitigation**: Index déjà nécessaire pour isolation
- **Rollback**: Drop index si problème de performance

## PHASE 8: STRATÉGIE DE TEST

### Test avec deux utilisateurs réels
1. Créer USER_A et USER_B
2. Créer CV_A pour USER_A, CV_B pour USER_B
3. Créer Graph_A pour USER_A, Graph_B pour USER_B
4. Authentifier en tant que USER_A
5. Tenter d'accéder à Graph_B → doit échouer (403/404)
6. Tenter listGraphs() → doit retourner seulement Graph_A
7. Répéter avec USER_B

### Test des endpoints API
1. Sans token → 401
2. Avec token USER_A → accès aux données USER_A
3. Avec token USER_A + userId USER_B dans body → 403 (userId ignoré, token utilisé)
4. Avec token invalide → 401

## PHASE 9: ORDRE D'EXÉCUTION

1. Créer la migration SQL
2. Appliquer la migration
3. Mettre à jour schema.prisma
4. Regénérer Prisma Client
5. Mettre à jour GraphRepository
6. Mettre à jour CopilotController
7. Ajouter JwtAuthGuard
8. Appliquer withAuthorization aux endpoints Web
9. Exécuter les tests de régression
10. Tester avec deux utilisateurs réels
11. Cleanup des données de test

## STATUT ACTUEL

**CRITICAL VULNERABILITIES**: 3
1. Graph model sans userId (DB-level isolation impossible)
2. API endpoints trust client-provided userId (impersonation possible)
3. GraphRepository sans filtrage par utilisateur (data leak possible)

**HIGH VULNERABILITIES**: 2
1. Copilot service sans auth guard
2. Authorization middleware non utilisé sur tous les endpoints

**RECOMMANDATION**: NO-GO jusqu'à correction des vulnérabilités CRITICAL
