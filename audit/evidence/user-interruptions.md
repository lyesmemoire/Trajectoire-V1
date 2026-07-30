# User Interruptions & Cancellation

> **Date d'audit**: 30 juillet 2026
> **Statut**: PARTIELLEMENT IMPLÉMENTÉ

Ce document documente la gestion des interruptions utilisateur (fermeture onglet, annulation requête, déconnexion réseau).

## 1. Scénarios d'Interruption

| Scénario | Impact | Gestion Actuelle | Statut |
|----------|--------|------------------|--------|
| Fermeture onglet pendant LLM | Crédits réservés mais non consommés | Rollback via timeout cleanup | ✅ PARTIEL |
| Annulation requête (AbortSignal) | Crédits réservés mais non consommés | Pas de rollback explicite | ❌ MANQUANT |
| Déconnexion réseau pendant LLM | Crédits réservés mais non consommés | Rollback via timeout cleanup | ✅ PARTIEL |
| Crash serveur pendant transaction | État incohérent | PostgreSQL atomicité | ✅ OK |

## 2. Timeout Cleanup (pg_cron)

**Implémentation**: `cleanup_expired_transactions` toutes les 5 minutes

```sql
-- consolidated-migration.sql L608-L636
CREATE OR REPLACE FUNCTION public.cleanup_expired_transactions(
  p_minutes_old INTEGER DEFAULT 5
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_record RECORD;
  v_count INTEGER := 0;
BEGIN
  FOR v_record IN 
    SELECT id 
    FROM public.credit_transactions 
    WHERE state = 'reserved' 
      AND created_at < NOW() - (p_minutes_old || ' minutes')::interval
  LOOP
    BEGIN
      PERFORM public.rollback_credits_atomic(v_record.id, 'expired_timeout');
      UPDATE public.credit_transactions SET state = 'expired' WHERE id = v_record.id;
      v_count := v_count + 1;
    EXCEPTION WHEN OTHERS THEN
      RAISE WARNING 'Failed to cleanup transaction %: %', v_record.id, SQLERRM;
    END;
  END LOOP;

  RETURN v_count;
END;
$$;
```

**Statut**: ✅ Implémenté mais dépend de pg_cron

**Limitation**: Si pg_cron n'est pas disponible, le cleanup ne s'exécute pas automatiquement.

## 3. AbortSignal Support

**Statut**: ❌ NON IMPLÉMENTÉ

Aucune des routes ne supporte l'annulation explicite via `AbortSignal` du client.

### Recommandation

```typescript
// Exemple d'implémentation recommandée
export async function POST(request: NextRequest) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  // Support cancellation from client
  request.signal.addEventListener('abort', () => {
    controller.abort();
  });

  try {
    const result = await idempotencyService.execute(
      idempotencyKey,
      userId,
      operation,
      requestParams,
      async () => {
        const txId = await BillingService.reserveCredits({...});
        try {
          const llmResult = await callLLM({ signal: controller.signal });
          await BillingService.commitCredits(txId, 0);
          return { resultRef: idempotencyKey, data: llmResult };
        } catch (error) {
          await BillingService.rollbackCredits(txId, 'User cancelled');
          throw error;
        }
      }
    );
  } catch (error) {
    if (error.name === 'AbortError') {
      return NextResponse.json({ error: 'Request cancelled' }, { status: 499 });
    }
  }
}
```

## 4. Idempotency pour Reprise

**Statut**: ✅ IMPLÉMENTÉ

Les routes supportent la reprise après interruption via idempotency :

| Route | Idempotence Key | Reprise après interruption | Statut |
|-------|----------------|---------------------------|--------|
| `api/cv/analyze` | Header `Idempotency-Key` ou auto-généré | ✅ Oui | ✅ OK |
| `api/cv/rewrite` | Hash SHA-256 du contenu | ✅ Oui | ✅ OK |
| `api/simulation/message` | Header `Idempotency-Key` ou auto-généré | ✅ Oui | ✅ OK |
| `api/report/generate` | Header `Idempotency-Key` ou auto-généré | ✅ Oui | ✅ OK |

### Comportement Reprise

1. **Si l'utilisateur interrompt pendant la réservation** :
   - Transaction reste en état `reserved`
   - Cleanup après 5 minutes rollback les crédits
   - Utilisateur peut relancer avec même clé → idempotence détecte et retourne résultat si déjà complété

2. **Si l'utilisateur interrompt pendant l'appel LLM** :
   - Transaction reste en état `reserved`
   - LLM peut continuer en arrière-plan (pas d'annulation)
   - Cleanup après 5 minutes rollback les crédits
   - Utilisateur peut relancer → nouvelle réservation

3. **Si l'utilisateur interrompt après commit mais avant réponse** :
   - Transaction en état `completed`
   - Résultat sauvegardé dans DB
   - Utilisateur peut relancer → idempotence retourne résultat depuis DB

## 5. États Intermédiaires

### États Transaction

| État | Signification | Durée max | Cleanup |
|------|---------------|-----------|---------|
| `reserved` | Crédits réservés, LLM en cours | 5 min | ✅ Rollback automatique |
| `completed` | Transaction réussie | Permanent | ❌ Pas de cleanup |
| `failed` | Transaction échouée, crédits restaurés | Permanent | ❌ Pas de cleanup |
| `expired` | Transaction expirée par timeout | Permanent | ❌ Pas de cleanup |

### États Idempotency

| État | Signification | Durée max | Cleanup |
|------|---------------|-----------|---------|
| `pending` | Opération en cours | 24h | ✅ Cleanup automatique |
| `completed` | Opération réussie, résultat disponible | 24h | ✅ Cleanup après expiry |
| `failed` | Opération échouée | 24h | ✅ Cleanup après expiry |

## 6. Recommandations

### Critique (Haute Priorité)

1. **Implémenter AbortSignal** pour annulation explicite côté client
2. **Ajouter rollback explicite** sur AbortError
3. **Vérifier pg_cron** est activé sur Supabase production

### Important (Moyenne Priorité)

4. **Réduire timeout cleanup** à 2 minutes pour libérer les crédits plus vite
5. **Ajouter monitoring** des transactions expirées
6. **Implémenter webhook notification** quand une transaction expire

### Nice to Have (Basse Priorité)

7. **Ajouter UI feedback** pendant l'attente LLM
8. **Implémenter reprise automatique** pour les transactions expirées
9. **Ajouter historique** des transactions pour l'utilisateur

## 7. Conclusion

**La gestion des interruptions utilisateur est PARTIELLEMENT implémentée** :

✅ **Points forts** :
- Timeout cleanup automatique via pg_cron
- Idempotency pour reprise après interruption
- États transaction clairs et documentés

❌ **Points faibles** :
- Pas de support AbortSignal pour annulation explicite
- Pas de rollback explicite sur annulation
- Timeout cleanup relativement long (5 minutes)
- Dépendance à pg_cron (non vérifié)

**Actions prioritaires** :
1. Implémenter AbortSignal pour annulation explicite
2. Ajouter rollback explicite sur AbortError
3. Vérifier pg_cron est activé en production
4. Réduire timeout cleanup à 2 minutes
