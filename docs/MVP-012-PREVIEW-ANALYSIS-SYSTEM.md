# MVP-012 — Preview Analysis System

**Date :** 5 août 2026  
**Objectif :** Implémenter un système complet de sauvegarde temporaire des analyses ATS réalisées sans authentification

---

## Contexte

Les utilisateurs peuvent arriver sur la homepage, analyser leur CV sans être connectés, puis créer un compte. Sans ce système, ils perdraient leur analyse et devraient la refaire.

**Problème résolu :** Permettre aux utilisateurs de conserver leur analyse ATS entre la visite anonyme et la création de compte, sans réanalyse.

---

## Objectif

L'utilisateur doit pouvoir :
- Arriver sur la homepage
- Déposer son CV
- Coller l'annonce
- Lancer une analyse ATS
- Voir immédiatement le résultat
- Créer un compte ensuite
- Retrouver automatiquement cette analyse dans son espace

**Aucune réanalyse ne doit être nécessaire.**

---

## Architecture

### Base de données

**Table PreviewAnalysis** (`prisma/schema.prisma`)

```prisma
model PreviewAnalysis {
  id               String   @id @default(cuid())
  token            String   @unique
  createdAt        DateTime @default(now())
  expiresAt        DateTime
  ipHash           String
  fingerprint      String
  cvExtract        Json?
  jobExtract       Json?
  analysisResult   Json?
  atsScore         Int?
  strengths        Json?
  weaknesses       Json?
  recommendations  Json?
  rawPayload       Json?
  status           String   @default("pending")
  consumed         Boolean  @default(false)
  consumedAt       DateTime?
  claimedByUserId  String?
  claimedAt        DateTime?

  @@index([token])
  @@index([expiresAt])
  @@index([consumed])
  @@index([claimedByUserId])
  @@index([claimedByUserId, consumed])
}
```

**TTL = 24h** pour les tokens non revendiqués.

---

## Workflow

### 1. Analyse anonyme

**Endpoint :** `POST /api/public/analyze-preview`

**Flow :**
1. Réception CV + Job (optionnel)
2. Rate limiting (3/heure par IP)
3. Validation
4. Calcul ATS
5. Sauvegarde dans `PreviewAnalysis` avec token UUID
6. Retour `{ previewToken, analysis }`
7. Set cookie `preview_token` (24h TTL)

### 2. Homepage

**Fichier :** `apps/web/src/app/page.tsx`

**Gestion du token :**
- Sauvegarde dans `sessionStorage` via `PreviewTokenManager`
- Cookie automatique via API response
- Survit à la navigation

### 3. Signup

**Fichier :** `apps/web/src/app/signup-conversion/page.tsx`

**Flow :**
1. Création du compte Supabase
2. Récupération du `previewToken` depuis sessionStorage
3. Appel `POST /api/auth/claim-preview`
4. Association `PreviewAnalysis` → `User`
5. Création `CandidateProfile`
6. Création `CVAnalysis` permanente
7. Alimentation Knowledge Graph
8. Suppression du token

### 4. Dashboard

**Fichier :** `apps/web/src/app/dashboard/page.tsx`

**Affichage :**
- Si `PreviewAnalysis` revendiquée existe
- Afficher "Nous avons retrouvé votre analyse ATS."
- Intégrer les données (score, compétences, recommandations)
- Fusion avec les données existantes

---

## Sécurité

### Token
- **UUID aléatoire** : Impossible à deviner
- **Expiration automatique** : 24h TTL
- **Usage unique** : Un token ne peut être revendiqué qu'une seule fois
- **Consommation** : Marqué comme `consumed` après revendication

### Rate Limiting
- **3 analyses/heure** par IP via Upstash Redis
- Prévention des abus

### Validation
- Validation CV (taille, type)
- Validation job description (optionnel)
- Fingerprinting pour traçabilité

---

## Composants

### Repository

**Fichier :** `apps/web/src/lib/preview-analysis/PreviewAnalysisRepository.ts`

**Méthodes :**
- `create()` : Créer une nouvelle preview
- `findByToken()` : Récupérer par token
- `findByUserId()` : Récupérer par utilisateur (revendiquée)
- `markAsConsumed()` : Marquer comme consommée
- `claimForUser()` : Revendiquer pour un utilisateur
- `deleteExpired()` : Supprimer les tokens expirés
- `cleanupOldUnclaimed()` : Nettoyer les anciens non revendiqués
- `isValidToken()` : Vérifier validité

### Service

**Fichier :** `apps/web/src/lib/preview-analysis/PreviewAnalysisService.ts`

**Méthodes :**
- `analyzePreview()` : Analyser et sauvegarder
- `claimPreview()` : Revendiquer pour un utilisateur
- `getPreviewAnalysis()` : Récupérer une preview
- `getUserClaimedPreview()` : Récupérer la preview revendiquée
- `cleanupExpired()` : Nettoyer les expirés
- `simulateATSAnalysis()` : Simulation (à remplacer par vrai service)
- `createCandidateProfile()` : Créer le profil carrière
- `createPermanentAnalysis()` : Créer l'analyse permanente
- `feedKnowledgeGraph()` : Alimenter le Knowledge Graph

### Token Manager

**Fichier :** `apps/web/src/lib/preview-analysis/previewTokenManager.ts`

**Méthodes :**
- `setSessionToken()` : Sauvegarder dans sessionStorage
- `getSessionToken()` : Récupérer depuis sessionStorage
- `clearSessionToken()` : Supprimer de sessionStorage
- `hasToken()` : Vérifier existence

### Cleanup Job

**Fichier :** `apps/web/src/lib/preview-analysis/previewCleanupJob.ts`

**Jobs :**
- `previewCleanupJob()` : Nettoyer les tokens expirés (24h)
- `previewOldCleanupJob()` : Nettoyer les non revendiqués après 7 jours

**API Admin :** `POST /api/admin/cleanup-previews`

---

## API Endpoints

### POST /api/public/analyze-preview

**Request :**
```typescript
{
  cv: File,
  jobDescription?: string
}
```

**Response :**
```typescript
{
  previewToken: string,
  score: number,
  gapToOptimal: number,
  percentile: number,
  strengths: string[],
  weakness: string,
  radarDimensions: object,
  message: string
}
```

**Cookie :** `preview_token` (httpOnly, secure, sameSite=lax, 24h)

### POST /api/auth/claim-preview

**Request :**
```typescript
{
  previewToken?: string
}
```

**Response :**
```typescript
{
  success: true,
  message: "Preview analysis revendiquée avec succès"
}
```

**Cookie :** Suppression de `preview_token`

### POST /api/admin/cleanup-previews

**Request :**
```typescript
{
  type?: 'old' // pour cleanup des anciens non revendiqués
}
```

**Response :**
```typescript
{
  success: true,
  deletedCount: number
}
```

---

## Intégration

### Homepage

```typescript
const handleAnalyze = async () => {
  const formData = new FormData()
  formData.append('cv', file)
  if (job) formData.append('jobDescription', job)

  const response = await fetch('/api/public/analyze-preview', {
    method: 'POST',
    body: formData,
  })

  const data = await response.json()
  PreviewTokenManager.setSessionToken(data.previewToken)
  window.location.href = `/analyze?preview=${data.previewToken}`
}
```

### Signup

```typescript
const previewToken = PreviewTokenManager.getSessionToken()
if (previewToken) {
  await fetch('/api/auth/claim-preview', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ previewToken }),
  })
  PreviewTokenManager.clearSessionToken()
}
```

### Dashboard

```typescript
const claimedPreview = await previewAnalysisService.getUserClaimedPreview(user.id)

const score: DashboardScore = {
  currentScore: lastAnalysis?.atsScoreAfter || claimedPreview?.atsScore || 0,
  // ...
}
```

---

## Cleanup Automatique

### Cron Job

Recommandé : Exécuter `previewCleanupJob()` toutes les heures via cron.

**Exemple Vercel Cron :**
```
0 * * * * https://your-domain.com/api/admin/cleanup-previews
```

### Cleanup des anciens

Exécuter `previewOldCleanupJob()` une fois par jour pour nettoyer les previews non revendiquées après 7 jours.

---

## Tests

### Tests unitaires (à implémenter)

1. **Repository Tests**
   - Test création preview
   - Test récupération par token
   - Test revendication
   - Test expiration
   - Test cleanup

2. **Service Tests**
   - Test analyse preview
   - Test claim preview
   - Test création profil
   - Test création analyse permanente

3. **API Tests**
   - Test POST /api/public/analyze-preview
   - Test POST /api/auth/claim-preview
   - Test rate limiting
   - Test validation

4. **Integration Tests**
   - Test flow complet (homepage → signup → dashboard)
   - Test persistance token
   - Test cleanup automatique

---

## Limitations

1. **Simulation ATS** : Le service utilise une simulation pour l'instant. À remplacer par le vrai service ATS.
2. **Knowledge Graph** : L'alimentation du Knowledge Graph est un placeholder pour l'instant.
3. **OAuth** : Le flow OAuth ne gère pas encore le claim automatique (à implémenter).
4. **Tests** : Les tests unitaires ne sont pas encore implémentés.

---

## Améliorations futures

1. **OAuth Claim** : Intégrer le claim automatique pour Google/Github OAuth
2. **Vrai Service ATS** : Remplacer la simulation par le vrai service ATS
3. **Knowledge Graph** : Implémenter l'alimentation réelle du Knowledge Graph
4. **Analytics** : Tracker les conversions preview → signup
5. **Email** : Envoyer un email avec le lien de récupération si l'utilisateur ne crée pas de compte
6. **Multi-device** : Permettre la récupération sur un autre appareil (via email)

---

## Sécurité & Privacy

- **Données temporaires** : Les previews non revendiquées sont supprimées après 24h
- **Anonymat** : Les previews anonymes ne sont pas liées à un utilisateur
- **Consentement** : L'utilisateur consent implicitement en utilisant le service
- **GDPR** : Les données sont supprimées automatiquement après expiration

---

## Monitoring

### Métriques à surveiller
- Nombre de previews créées
- Taux de conversion preview → signup
- Taux de claim réussi
- Nombre de previews expirées
- Nombre de previews nettoyées

### Logs
- Création preview
- Claim preview
- Erreurs de claim
- Cleanup results

---

## Conclusion

Le système de Preview Analysis est maintenant opérationnel. Les utilisateurs peuvent analyser leur CV anonymement, créer un compte, et retrouver leur analyse sans réanalyse.

**Prochaines étapes :**
1. Monitoring des conversions
2. Implémentation du vrai service ATS
3. Intégration OAuth claim
4. Tests unitaires complets
