# Stripe & Credits Flow Audit

## Payment Flow
**Status: OK**
Le flux d'achat est très robuste. L'initiation côté client (`/api/stripe/checkout`) ne fait pas confiance au frontend pour le prix : il valide contre une liste stricte (`VALID_PRICE_IDS`) et injecte le `user_id` et le `pack_name` directement dans les métadonnées signées de la session Stripe.

## Webhook Safety
**Status: OK**
Le webhook (`/api/stripe/webhook/route.ts`) valide d'abord la signature cryptographique de Stripe.
L'idempotence est garantie au niveau de la base de données : la fonction `process_stripe_payment` insère le `event.id` dans la table `stripe_events` avec une contrainte `UNIQUE`. Si Stripe retry le même event, l'exception `unique_violation` est capturée silencieusement sans recréditer l'utilisateur. En cas de crash du serveur pendant le traitement, la transaction SQL entière (y compris l'insert du lock event_id) est annulée, permettant au retry suivant de réussir.

## Credit Consistency
**Status: PARTIAL**
La source de vérité absolue est `profiles.credits`. Les crédits ne sont jamais lus ou calculés depuis le frontend.
**Cependant, il existe une fragmentation de l'audit trail (log)** :
- Les achats Stripe inscrivent un log dans `credit_usage`.
- La consommation IA (via `014_audit_fixes.sql`) inscrit un log dans `credit_ledger` (et `organization_credit_ledger` pour le multi-tenant).
Le solde global est exact, mais la traçabilité est scindée dans deux tables différentes.

## Race Condition Safety
**Status: OK**
La concurrence est gérée au niveau ligne de la base de données de façon stricte.
La déduction (`reserve_credits_atomic`) utilise `SELECT ... FOR UPDATE` pour verrouiller la ligne du profil, garantissant qu'aucun autre processus ne peut lire un solde périmé pendant la transaction. Le crédit Stripe fait un `UPDATE profiles SET credits = credits + X`, ce qui pose implicitement un verrou exclusif sur la ligne et évite l'écrasement de valeurs. 

## Critical Risks
1. **Risque de perte de crédit (Sans création de monnaie)** : L'implémentation de `014_audit_fixes.sql` débite le solde *avant* l'appel à l'IA Mistral (débit immédiat). Si le serveur Next.js crash (ex: OOM, timeout Vercel) ou redémarre pendant l'attente de la réponse du LLM, la fonction `rollback_credits_atomic` ne sera jamais appelée. Le crédit est perdu pour l'utilisateur sans qu'il ait eu le résultat. *Note: Cela protège la plateforme (pas de faille d'argent gratuit), mais dégrade l'expérience utilisateur.*
2. **Fragmentation Ledger vs Usage** : La présence de `credit_usage`, `credit_ledger`, et `credit_transactions` complexifie la maintenance. Le système transactionnel à 2 phases (lock, commit) de la phase V3 a été écrasé par le système V4/V5 de déduction immédiate.

## Recommendations
1. **Implémenter une sécurité anti-crash (2-Phase Commit réel ou Queue)** : Pour l'instant, on utilise une déduction immédiate + compensation manuelle. L'idéal serait de réactiver un système de `PENDING` state (comme `tx_state = reserved` vu dans les anciennes migrations) avec un Cron de cleanup pour rembourser les jobs bloqués plus de 5 minutes.
2. **Unification des Logs** : Déplacer le log de `process_stripe_payment` pour qu'il écrive lui aussi dans `credit_ledger` afin d'avoir une source unique d'historique (achats + consommation).
