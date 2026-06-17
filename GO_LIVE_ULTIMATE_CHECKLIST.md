# 🏁 GO LIVE ULTIMATE CHECKLIST (FULL EXECUTION)

Zéro poésie. Zéro théorie. Voici les 10 points absolus pour passer le système en production réelle.

---

### 1. 🗄️ EVENT STORE (Postgres)
- [ ] Base de données Postgres de production instanciée (PG 15+).
- [ ] PgBouncer actif (Connection Pooling).
- [ ] Index exclusifs posés sur `tenantId`, `sessionId`, `timestamp`.
- [ ] Constraints `NOT NULL` et contraintes d'unicité vérifiées.

### 2. 🛡️ LEDGER (Intégrité)
- [ ] Arbre de Merkle fonctionnel (Batching activé à 100 events).
- [ ] Job cron ou worker d'audit Ledger configuré pour tourner toutes les heures.
- [ ] Impossible d'insérer un événement sans trigger le hash précédent.

### 3. 💳 BILLING (Stripe)
- [ ] Idempotence activée sur toutes les requêtes d'API Stripe.
- [ ] Unique constraint (`stripe_event_id`) sur la table des webhooks pour éviter le double-traitement.
- [ ] Logique `FOR UPDATE` sur les incréments/décréments de crédits (atomicity).

### 4. 🤖 AI LAYER (Coût et Sécurité)
- [ ] Fallback/Circuit Breaker configuré : si Mistral/OpenAI timeout > 5s, retour au cache ou erreur propre.
- [ ] Tokens cappés par user/jour (Rate limiting IA activé).
- [ ] Caching sémantique branché sur le flow (Hash CV + Prompt = Cache Hit).

### 5. 🧯 SAFETY LAYER (Le Kill Switch)
- [ ] Variable d'environnement ou feature flag `MAINTENANCE_MODE` implémenté.
- [ ] Mode `READ_ONLY` testé (bloque l'ingestion d'événements, autorise le replay).

### 6. 🔐 ADMIN & SECURITY
- [ ] RLS (Row Level Security) activé ou Middleware strict sur `/api/admin/*`.
- [ ] Chaque action admin (Ban, Restore Credits) écrit dans la table `audit_logs` (non-spoofable).

### 7. 📊 OBSERVABILITY (Golden Signals)
- [ ] Tracing End-to-End (`request → ingest → DB → ledger → response`) instrumenté.
- [ ] Alerte configurée si la latence P95 du Replay dépasse 500ms.
- [ ] Dashboard temps réel : Stripe Revenue / LLM Burn Rate / Errors.

### 8. 🔄 REPLAY ENGINE (Déterminisme)
- [ ] Les snapshots (matérialisations d'état) sont opérationnels pour éviter de rejouer l'historique complet à chaque chargement.
- [ ] Les fonctions aléatoires (Random, Time) sont injectées via les événements, jamais calculées au runtime du Replay.

### 9. 🚦 CI/CD & DEPLOYMENT
- [ ] Déploiement bloqué si les migrations de BDD ne sont pas *Safe* (Schema Drift Check).
- [ ] Pas de déploiement en production le vendredi soir.
- [ ] Plan de rollback documenté et testé.

### 10. 📝 AXIOM LAYER (Alignement Humain)
- [ ] SLA définis contractuellement (Disponibilité > 99.9%, Latence < 1s).
- [ ] Équipe d'astreinte désignée avec accès au Runbook (Incident Playbook).
