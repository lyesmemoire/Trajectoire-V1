# MVP-007 — ATS Preview Persistence

**Date :** 5 août 2026  
**Objectif :** Permettre aux visiteurs de tester l'analyse ATS gratuitement et de récupérer leur analyse après inscription

---

## Contexte

Le moteur RH est terminé (Matching Engine, CV Intelligence, Job Intelligence, Search, Copilot). Le prochain chantier consiste à améliorer le parcours candidat en évitant la perte des analyses preview lors de l'inscription.

**Problème résolu :** Auparavant, un visiteur pouvait tester l'analyse ATS gratuitement, mais s'il s'inscrivait ensuite, son analyse était perdue et il devait recommencer.

---

## Objectif

Un visiteur doit pouvoir :
1. Déposer son CV
2. Coller une annonce
3. Obtenir son analyse ATS gratuitement
4. Créer ensuite son compte
5. Retrouver automatiquement son analyse

**Aucune analyse ne doit être perdue.**

---

## Architecture

### Backend

#### Table Prisma : PreviewAnalysis

```prisma
model PreviewAnalysis {
  id           String   @id @default(cuid())
  token        String   @unique
  createdAt    DateTime @default(now())
  expiresAt    DateTime
  ipHash       String
  fingerprint  String
  atsResult    Json
  candidateData Json
  jobData      Json
  consumed     Boolean  @default(false)
  consumedAt   DateTime?
  claimedBy    String?

  @@index([token])
  @@index([expiresAt])
  @@index([consumed])
  @@index([claimedBy])
}
```

**Champs :**
- `id` : ID unique de la preview
- `token` : UUID v4 pour accéder à l'analyse (non devinable)
- `createdAt` : Date de création
- `expiresAt` : Date d'expiration (TTL 24h)
- `ipHash` : Hash de l'IP pour rate limiting
- `fingerprint` : Fingerprint du navigateur pour sécurité
- `atsResult` : Résultat de l'analyse ATS (JSON)
- `candidateData` : Données du candidat extraites du CV (JSON)
- `jobData` : Données de l'annonce de poste (JSON)
- `consumed` : Si l'analyse a été claimée (consommation unique)
- `consumedAt` : Date de consommation
- `claimedBy` : ID de l'utilisateur qui a claimé l'analyse

#### Services

**PreviewStorageService** (`apps/web/src/lib/preview/PreviewStorageService.ts`)
- `savePreview()` : Sauvegarde une analyse preview avec token UUID
- `getPreviewByToken()` : Récupère une analyse par son token (vérifie expiration et consommation)
- `markAsConsumed()` : Marque une analyse comme consommée (anti-replay)
- `deletePreview()` : Supprime une analyse
- `isTokenValid()` : Vérifie si un token est valide

**PreviewCleanupService** (`apps/web/src/lib/preview/PreviewCleanupService.ts`)
- `cleanupExpiredPreviews()` : Supprime les previews expirées
- `cleanupConsumedPreviews()` : Supprime les previews consommées (optionnel)
- `cleanupAllPreviews()` : Supprime toutes les previews (DANGEREUX)
- `getPreviewStats()` : Statistiques sur les previews

**PreviewTransferService** (`apps/web/src/lib/preview/PreviewTransferService.ts`)
- `transferPreviewToUser()` : Transfère une preview vers le compte utilisateur
  - Marque comme consommée
  - Crée une CVAnalysis dans le compte utilisateur
  - Met à jour le profil utilisateur si nécessaire
  - Supprime la preview après transfert

#### Endpoints API

**POST /api/public/preview/save**
- Sauvegarde une analyse preview
- Rate limiting : 5/heure par IP
- Payload : `{ atsResult, candidateData, jobData }`
- Réponse : `{ token, expiresAt }`

**GET /api/public/preview/:token**
- Récupère une analyse preview par son token
- Rate limiting : 10/heure par token
- Vérifie expiration et consommation
- Réponse : PreviewAnalysis complète

**POST /api/public/preview/claim**
- Claim une analyse preview et la transfère vers le compte utilisateur
- Nécessite authentification
- Payload : `{ token }`
- Réponse : `{ success, analysisId?, error? }`

---

### Frontend

#### Hook React : usePreviewStorage

**Fichier :** `apps/web/src/hooks/usePreviewStorage.ts`

**Fonctions :**
- `savePreview(payload)` : Sauvegarde une analyse preview
- `getPreview(token?)` : Récupère une analyse par son token
- `claimPreview(token?)` : Claim une analyse vers le compte utilisateur
- `clearToken()` : Supprime le token du storage
- `hasToken()` : Vérifie si un token est disponible

**Storage :**
- Token stocké dans `sessionStorage` (clé : `preview_token`)
- Persisté pendant la session du navigateur

#### Intégration dans /analyze

**Fichier :** `apps/web/src/app/analyze/page.tsx`

**Modifications :**
- Import de `usePreviewStorage` et des types
- Après l'analyse, sauvegarde automatiquement la preview
- Token stocké dans sessionStorage

```tsx
const { savePreview } = usePreviewStorage()

// Après l'analyse
const payload: SavePreviewPayload = {
  atsResult: analysisResult,
  candidateData: { /* ... */ },
  jobData: { /* ... */ },
}
await savePreview(payload)
```

#### Intégration auto-claim après signup

**Fichier :** `apps/web/src/app/signup/page.tsx`

**Modifications :**
- Import de `usePreviewStorage`
- Après signup réussi, auto-claim de la preview si token existe
- Token supprimé après claim réussi

```tsx
const { claimPreview, hasToken } = usePreviewStorage()

// Après signup réussi
if (hasToken()) {
  await claimPreview()
}
```

---

## Sécurité

### Token UUID v4
- Non devinable (122 bits d'entropie)
- Généré avec `uuid` library
- Unique par preview

### Expiration
- TTL 24 heures par défaut
- Vérification à chaque accès
- Suppression automatique des expirées

### Consommation unique
- Marqueur `consumed` pour anti-replay
- Vérification avant claim
- Une preview ne peut être claimée qu'une seule fois

### Rate limiting
- 5/heure pour sauvegarde (par IP)
- 10/heure pour récupération (par token)
- Implémenté avec Upstash Redis

### Anti bruteforce
- Fingerprint du navigateur
- Hash de l'IP
- Rate limiting strict

---

## Flux Utilisateur

### Scénario 1 : Visiteur → Analyse → Inscription → Récupération

```
1. Visiteur arrive sur homepage
   ↓
2. Upload CV + description poste
   ↓
3. Clic "Analyser" → /analyze
   ↓
4. Analyse ATS générée
   ↓
5. Preview sauvegardée automatiquement (token stocké)
   ↓
6. Visiteur voit le résultat
   ↓
7. Visiteur clique "Créer un compte"
   ↓
8. Inscription (email + password)
   ↓
9. Auto-claim de la preview (sans intervention)
   ↓
10. Preview transférée vers CVAnalysis
   ↓
11. Visiteur redirigé vers dashboard
   ↓
12. Analyse disponible dans l'historique
```

### Scénario 2 : Visiteur → Analyse → Quitte → Retour → Inscription

```
1. Visiteur analyse son CV
   ↓
2. Token stocké dans sessionStorage
   ↓
3. Visiteur quitte le site
   ↓
4. Session expirée (token perdu)
   ↓
5. Visiteur revient → doit refaire l'analyse
```

**Note :** Le token est stocké dans sessionStorage, donc perdu si la session expire. Pour une persistance plus longue, on pourrait utiliser localStorage avec une date d'expiration.

---

## Nettoyage Automatique

### Job de nettoyage (à implémenter)

```typescript
// Exemple avec Vercel Cron Jobs
export const config = {
  runtime: 'edge',
}

export default async function handler(req: NextRequest) {
  // Nettoyer les previews expirées toutes les heures
  await PreviewCleanupService.cleanupExpiredPreviews()
  
  // Nettoyer les previews consommées après 24h
  await PreviewCleanupService.cleanupConsumedPreviews(24)
  
  return NextResponse.json({ success: true })
}
```

---

## Tests

### Tests unitaires (à implémenter)

**PreviewStorageService.test.ts**
- Test sauvegarde preview
- Test récupération par token
- Test expiration
- Test consommation unique
- Test suppression

**PreviewCleanupService.test.ts**
- Test nettoyage expirées
- Test nettoyage consommées
- Test statistiques

**PreviewTransferService.test.ts**
- Test transfert vers utilisateur
- Test mise à jour profil
- Test anti-replay

### Tests d'intégration (à implémenter)

**API Endpoints.test.ts**
- Test POST /api/public/preview/save
- Test GET /api/public/preview/:token
- Test POST /api/public/preview/claim
- Test rate limiting

### Tests E2E (à implémenter)

**Parcours utilisateur.test.ts**
- Test analyse → sauvegarde → inscription → claim
- Test expiration
- Test consommation unique

---

## Monitoring

### Métriques à suivre

- Nombre de previews créées/jour
- Taux de conversion preview → signup
- Taux de claim réussi
- Nombre de previews expirées
- Nombre de previews consommées
- Temps moyen entre création et claim

### Logs

- Création preview (token, ipHash)
- Récupération preview (token)
- Claim preview (token, userId)
- Erreurs (token invalide, expiré, déjà consommé)
- Nettoyage (nombre supprimé)

---

## Limitations

1. **SessionStorage** : Token perdu si session expire
   - Solution : localStorage avec expiration

2. **Pas de retry** : Si claim échoue, l'utilisateur doit refaire l'analyse
   - Solution : Queue de retry ou notification

3. **Pas de preview multiple** : Un seul token stocké à la fois
   - Solution : Array de tokens dans storage

4. **Pas de preview anonyme** : Pas de lien de partage direct
   - Solution : Générer un lien partageable avec token

---

## Améliorations futures

1. **LocalStorage avec expiration** : Persister le token plus longtemps
2. **Queue de retry** : Réessayer le claim automatiquement
3. **Preview multiple** : Permettre plusieurs previews
4. **Lien partageable** : Permettre de partager une preview
5. **Email de rappel** : Envoyer un email si preview non claimée
6. **Analytics avancés** : Suivre le parcours preview → signup
7. **A/B testing** : Tester différents CTA pour l'inscription

---

## Déploiement

### Migration Prisma

```bash
npx prisma db push
```

### Variables d'environnement

Aucune nouvelle variable requise. Utilise les variables existantes :
- `DATABASE_URL` (Supabase)
- `UPSTASH_REDIS_REST_URL` (rate limiting)
- `UPSTASH_REDIS_REST_TOKEN` (rate limiting)

### Vérification

1. Tester la sauvegarde preview
2. Tester la récupération par token
3. Tester le claim après signup
4. Tester l'expiration (attendre 24h ou modifier TTL)
5. Tester la consommation unique
6. Tester le rate limiting

---

## Conclusion

Le système de persistance temporaire des analyses preview est maintenant opérationnel. Les visiteurs peuvent tester l'analyse ATS gratuitement et récupérer leur analyse après inscription sans friction.

**Prochaines étapes :**
1. Implémenter les tests
2. Ajouter le job de nettoyage automatique
3. Configurer le monitoring
4. Tester en production
