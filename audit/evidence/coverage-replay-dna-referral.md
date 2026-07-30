# Coverage, Replay, Career DNA & Referral

> **Date d'audit**: 30 juillet 2026
> **Statut**: PARTIELLEMENT AUDITÉ

Ce document documente la couverture de tests, le replay, le Career DNA (EMA, déduplication, plafonnement) et le système de parrainage.

## 1. Couverture de Tests

### Tests Unitaires

| Module | Fichier | Couverture | Statut |
|--------|---------|------------|--------|
| Billing | `tests/billing/idempotence.test.ts` | Non mesurée | ✅ Tests existants |
| Idempotency | Non trouvé | N/A | ❌ MANQUANT |
| BillingService | Non trouvé | N/A | ❌ MANQUANT |
| Routes API | Non trouvé | N/A | ❌ MANQUANT |

### Tests d'Intégration

| Module | Fichier | Couverture | Statut |
|--------|---------|------------|--------|
| Architecture Invariant | `tests/architecture-invariant.test.ts` | Non mesurée | ✅ Tests existants |
| Certification | `certification/certify.cjs` | Non mesurée | ✅ Pipeline existant |

### Tests E2E

| Module | Fichier | Couverture | Statut |
|--------|---------|------------|--------|
| API Routes | `tests/e2e/` | Non mesurée | ✅ Tests existants |

### Configuration Vitest

```typescript
// vitest.runtime.config.ts
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    timeout: 30000,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './reports/runtime/coverage',
    },
  },
});
```

**Statut**: ✅ Configuration coverage présente mais non exécutée récemment

### Recommandations

1. **Exécuter les tests avec coverage** : `npx vitest run --coverage`
2. **Ajouter tests unitaires** pour `BillingService` et `IdempotencyService`
3. **Ajouter tests d'intégration** pour les routes API avec billing
4. **Viser 80%+ de coverage** pour le code critique (billing, idempotency)

## 2. Replay

### Idempotency comme Replay

**Statut**: ✅ IMPLÉMENTÉ

Le système d'idempotency permet le replay des opérations :

| Route | Mécanisme Replay | Statut |
|-------|------------------|--------|
| `api/cv/analyze` | IdempotencyService avec loadFn | ✅ OK |
| `api/cv/rewrite` | IdempotencyService avec loadFn (cv_rewrites) | ✅ OK |
| `api/simulation/message` | IdempotencyService avec loadFn | ✅ OK |
| `api/report/generate` | IdempotencyService avec loadFn | ✅ OK |

### Limitations Replay

1. **Pas de replay automatique** : L'utilisateur doit relancer manuellement
2. **Pas de queue de retry** : Les opérations échouées ne sont pas réessayées automatiquement
3. **Pas de replay côté serveur** : Pas de système de replay pour les webhooks échoués

### Recommandations

1. **Implémenter retry automatique** pour les opérations échouées transitoirement
2. **Ajouter queue de replay** pour les webhooks échoués
3. **Implémenter replay admin** pour corriger les erreurs manuellement

## 3. Career DNA (EMA, Déduplication, Plafonnement)

### EMA (Exponential Moving Average)

**Statut**: ❌ NON TROUVÉ

Aucun code lié à l'EMA pour le Career DNA n'a été trouvé dans le codebase.

**Recherche effectuée** :
- `find_by_name` pour "CareerProfile", "CareerDNA", "EMA"
- `grep_search` pour "exponential", "moving", "average"
- Résultat : Aucun code trouvé

### Déduplication

**Statut**: ❌ NON TROUVÉ

Aucun code de déduplication pour le Career DNA n'a été trouvé.

**Recherche effectuée** :
- `find_by_name` pour "dedup", "duplicate", "merge"
- `grep_search` pour "duplicate", "deduplicate"
- Résultat : Aucun code trouvé

### Plafonnement (Capping)

**Statut**: ✅ PARTIELLEMENT IMPLÉMENTÉ

Le plafonnement est implémenté via :

| Type | Implémentation | Statut |
|------|----------------|--------|
| Crédits | `profiles.credits` avec check solde suffisant | ✅ OK |
| Messages | Limite 50 messages par session (ConversationService L123) | ✅ OK |
| Rate Limiting | `IRateLimiter` avec règles par endpoint | ✅ OK |
| Quota | `IQuotaService` avec limites par ressource | ✅ OK |

### Détails Plafonnement

```typescript
// ConversationService L122-L125
const messageCount = await this.messageRepository.count({ session_id: command.sessionId });
if (messageCount >= 50) {
  throw new AppError("Maximum message count reached", ErrorCode.QUOTA_EXCEEDED, 429);
}
```

### Recommandations

1. **Implémenter EMA** pour le Career DNA si requis
2. **Implémenter déduplication** pour éviter les doublons dans les analyses CV
3. **Documenter les limites** de plafonnement actuelles
4. **Ajouter monitoring** des limites atteintes

## 4. Système de Parrainage (Referral)

### Implémentation Actuelle

**Statut**: ✅ PARTIELLEMENT IMPLÉMENTÉ

| Composant | Fichier | Statut |
|-----------|---------|--------|
| Code de parrainage | `User.referralCode` (Prisma) | ✅ OK |
| Attribution crédits | Stripe webhook `checkout.session.completed` | ✅ OK |
| Tracking parrain | Non trouvé | ❌ MANQUANT |
| Limite parrainage | Non trouvé | ❌ MANQUANT |

### Détails Attribution Crédits

```typescript
// webhook/route.ts L54-L72
if (metadata?.referralCode) {
  const { data: referrer } = await supabase
    .from('User')
    .select('*')
    .eq('referralCode', metadata.referralCode)
    .single();

  if (referrer) {
    await BillingService.refundCredits({
      userId: referrer.id,
      amount: 10, // 10 crédits pour le parrain
      action: 'referral_reward',
      operationId: event.id,
    });
  }
}
```

### Limitations

1. **Pas de tracking** : Impossible de savoir qui a été parrainé par qui
2. **Pas de limite** : Un utilisateur peut parrainer un nombre illimité de personnes
3. **Pas de validation** : Pas de vérification que le parrainé est un nouvel utilisateur
4. **Pas d'anti-abus** : Risque de création de faux comptes pour obtenir des crédits

### Recommandations

1. **Ajouter table `referrals`** pour tracker les relations parrain-parrainé
2. **Implémenter limite** de parrainage (ex: max 10 parrainages par utilisateur)
3. **Ajouter validation** pour vérifier que le parrainé est un nouvel utilisateur
4. **Implémenter anti-abus** (détection de patterns suspects)
5. **Ajouter monitoring** des activités de parrainage

### Schéma Recommandé

```sql
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES profiles(id),
  referred_id UUID NOT NULL REFERENCES profiles(id),
  referral_code TEXT NOT NULL,
  credits_awarded INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'fraud')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  UNIQUE(referrer_id, referred_id)
);

CREATE INDEX idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX idx_referrals_referred ON referrals(referred_id);
```

## 5. Conclusion

**Le système de coverage, replay, Career DNA et referral est PARTIELLEMENT implémenté** :

✅ **Points forts** :
- Configuration coverage Vitest présente
- Idempotency permet le replay manuel
- Plafonnement implémenté pour crédits, messages, rate limiting
- Système de parrainage basique fonctionnel

❌ **Points faibles** :
- Coverage non exécutée récemment
- Tests unitaires manquants pour services critiques
- Career DNA (EMA, déduplication) non implémenté
- Système de parrainage sans tracking ni limites
- Pas de replay automatique

**Actions prioritaires** :
1. Exécuter les tests avec coverage et viser 80%+
2. Ajouter tests unitaires pour BillingService et IdempotencyService
3. Implémenter tracking et limites pour le parrainage
4. Implémenter Career DNA si requis par les spécifications
5. Ajouter monitoring pour les limites et activités suspectes
