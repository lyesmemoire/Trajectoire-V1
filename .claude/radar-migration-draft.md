# Radar des offres : brouillon de migration (NON APPLIQUÉ)

Statut : **brouillon à valider**. Rien n'est appliqué à la base, aucun fichier dans `prisma/migrations/`. Le SQL ci-dessous deviendra `prisma/migrations/20261005_add_job_radar_tables/migration.sql` après accord explicite.

## Décisions de conception

1. **Catalogue partagé** (`market_offers`) : une ligne par offre, quel que soit le nombre d'utilisateurs intéressés. Le suivi et le score sont par utilisateur (`radar_matches`). Évite de dupliquer les mêmes offres par compte (comme le fait `discovered_jobs`).
2. **Ingestion à la demande** : on ne synchronise que les offres correspondant aux recherches actives (`radar_searches`), jamais tout le catalogue de France Travail. Borne la taille de la base.
3. **Rétention** : les offres `CLOSED` depuis plus de 30 jours et sans `radar_matches` ni `Opportunity` liée sont purgées par la tâche planifiée.
4. **Texte, pas d'enum Postgres** pour `source` et les états : ajouter une source (ou un état) ne demande pas de migration d'enum ; validation par `CHECK` et par zod.
5. **Pas de `raw_payload`** : moins de volume et moins de données tierces conservées que nécessaire. Seuls les champs normalisés sont gardés.
6. **Recherche plein texte** française par colonne générée `search_vector` (`tsvector`, configuration `french`) + index GIN : pas d'extension à installer. Les embeddings (pgvector) ne sont **pas** dans cette migration ; ils viendraient dans une migration séparée si le matching par mots-clés ne suffit pas.
7. **RLS activée dans la même migration**, sans politique pour `anon` et `authenticated` (refus par défaut), comme `20261003_enable_rls_public_tables`. Sans cela, les droits par défaut de Supabase sur les nouvelles tables de `public` exposeraient les lignes via l'API REST. Prisma (`postgres`) et le client service ignorent la RLS. En plus, `REVOKE` explicite.
8. **Suppression de compte** : `radar_searches` et `radar_matches` ont une clé étrangère vers `users` avec `ON DELETE CASCADE` : `purge-user-data` les supprime avec l'utilisateur. `market_offers` et `radar_sync_runs` ne contiennent aucune donnée personnelle.

## SQL proposé

```sql
-- Radar des offres d'emploi : catalogue partagé, recherches et correspondances par utilisateur.
-- Additive et idempotente (IF NOT EXISTS). Aucune table existante modifiée.

-- 1. Catalogue partagé -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "public"."market_offers" (
  "id"             TEXT        NOT NULL,
  "source"         TEXT        NOT NULL,
  "external_id"    TEXT        NOT NULL,
  "title"          TEXT        NOT NULL,
  "company"        TEXT,
  "location_label" TEXT,
  "department"     TEXT,
  "latitude"       DOUBLE PRECISION,
  "longitude"      DOUBLE PRECISION,
  "contract_type"  TEXT,
  "rome_code"      TEXT,
  "experience"     TEXT,
  "salary_label"   TEXT,
  "description"    TEXT        NOT NULL,
  "source_url"     TEXT        NOT NULL,
  "apply_url"      TEXT,
  "fingerprint"    TEXT        NOT NULL,
  "status"         TEXT        NOT NULL DEFAULT 'LIVE',
  "published_at"   TIMESTAMP(3),
  "first_seen_at"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "last_seen_at"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "closed_at"      TIMESTAMP(3),
  "updated_at"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "search_vector"  tsvector GENERATED ALWAYS AS (
    to_tsvector('french',
      coalesce("title", '') || ' ' || coalesce("company", '') || ' ' || coalesce("description", ''))
  ) STORED,
  CONSTRAINT "market_offers_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "market_offers_source_check" CHECK ("source" IN ('FRANCE_TRAVAIL', 'LA_BONNE_ALTERNANCE')),
  CONSTRAINT "market_offers_status_check" CHECK ("status" IN ('LIVE', 'STALE', 'CLOSED'))
);

CREATE UNIQUE INDEX IF NOT EXISTS "market_offers_source_external_id_key" ON "public"."market_offers"("source", "external_id");
CREATE INDEX IF NOT EXISTS "market_offers_status_last_seen_idx" ON "public"."market_offers"("status", "last_seen_at" DESC);
CREATE INDEX IF NOT EXISTS "market_offers_fingerprint_idx"      ON "public"."market_offers"("fingerprint");
CREATE INDEX IF NOT EXISTS "market_offers_department_idx"       ON "public"."market_offers"("department");
CREATE INDEX IF NOT EXISTS "market_offers_rome_code_idx"        ON "public"."market_offers"("rome_code");
CREATE INDEX IF NOT EXISTS "market_offers_published_at_idx"     ON "public"."market_offers"("published_at" DESC);
CREATE INDEX IF NOT EXISTS "market_offers_search_vector_idx"    ON "public"."market_offers" USING GIN ("search_vector");

-- 2. Recherches sauvegardées (par utilisateur) -------------------------------------------------
CREATE TABLE IF NOT EXISTS "public"."radar_searches" (
  "id"             TEXT        NOT NULL,
  "user_id"        TEXT        NOT NULL,
  "name"           TEXT        NOT NULL,
  "keywords"       TEXT        NOT NULL,
  "rome_codes"     TEXT[]      NOT NULL DEFAULT ARRAY[]::TEXT[],
  "departments"    TEXT[]      NOT NULL DEFAULT ARRAY[]::TEXT[],
  "latitude"       DOUBLE PRECISION,
  "longitude"      DOUBLE PRECISION,
  "radius_km"      INTEGER,
  "contract_types" TEXT[]      NOT NULL DEFAULT ARRAY[]::TEXT[],
  "sources"        TEXT[]      NOT NULL DEFAULT ARRAY['FRANCE_TRAVAIL', 'LA_BONNE_ALTERNANCE']::TEXT[],
  "enabled"        BOOLEAN     NOT NULL DEFAULT true,
  "last_run_at"    TIMESTAMP(3),
  "last_run_error" TEXT,
  "created_at"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "radar_searches_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "radar_searches_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "radar_searches_radius_check" CHECK ("radius_km" IS NULL OR ("radius_km" BETWEEN 1 AND 200))
);

CREATE INDEX IF NOT EXISTS "radar_searches_user_id_idx"         ON "public"."radar_searches"("user_id");
CREATE INDEX IF NOT EXISTS "radar_searches_enabled_last_run_idx" ON "public"."radar_searches"("enabled", "last_run_at");

-- 3. Correspondances offre ↔ utilisateur (score et suivi) ---------------------------------------
CREATE TABLE IF NOT EXISTS "public"."radar_matches" (
  "id"             TEXT        NOT NULL,
  "user_id"        TEXT        NOT NULL,
  "offer_id"       TEXT        NOT NULL,
  "search_id"      TEXT,
  "opportunity_id" TEXT,
  "score"          INTEGER,
  "score_details"  JSONB,
  "state"          TEXT        NOT NULL DEFAULT 'NEW',
  "matched_at"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "radar_matches_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "radar_matches_user_id_fkey"        FOREIGN KEY ("user_id")        REFERENCES "public"."users"("id")           ON DELETE CASCADE  ON UPDATE CASCADE,
  CONSTRAINT "radar_matches_offer_id_fkey"       FOREIGN KEY ("offer_id")       REFERENCES "public"."market_offers"("id")  ON DELETE CASCADE  ON UPDATE CASCADE,
  CONSTRAINT "radar_matches_search_id_fkey"      FOREIGN KEY ("search_id")      REFERENCES "public"."radar_searches"("id") ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT "radar_matches_opportunity_id_fkey" FOREIGN KEY ("opportunity_id") REFERENCES "public"."opportunities"("id")    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT "radar_matches_state_check" CHECK ("state" IN ('NEW', 'SEEN', 'SAVED', 'DISMISSED')),
  CONSTRAINT "radar_matches_score_check" CHECK ("score" IS NULL OR ("score" BETWEEN 0 AND 100))
);

CREATE UNIQUE INDEX IF NOT EXISTS "radar_matches_user_offer_key" ON "public"."radar_matches"("user_id", "offer_id");
CREATE INDEX IF NOT EXISTS "radar_matches_user_state_score_idx"  ON "public"."radar_matches"("user_id", "state", "score" DESC);
CREATE INDEX IF NOT EXISTS "radar_matches_offer_id_idx"          ON "public"."radar_matches"("offer_id");
CREATE INDEX IF NOT EXISTS "radar_matches_search_id_idx"         ON "public"."radar_matches"("search_id");

-- 4. Journal des synchronisations (supervision de la tâche planifiée) ---------------------------
CREATE TABLE IF NOT EXISTS "public"."radar_sync_runs" (
  "id"          TEXT        NOT NULL,
  "source"      TEXT        NOT NULL,
  "status"      TEXT        NOT NULL,
  "fetched"     INTEGER     NOT NULL DEFAULT 0,
  "upserted"    INTEGER     NOT NULL DEFAULT 0,
  "closed"      INTEGER     NOT NULL DEFAULT 0,
  "error"       TEXT,
  "started_at"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "finished_at" TIMESTAMP(3),
  CONSTRAINT "radar_sync_runs_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "radar_sync_runs_status_check" CHECK ("status" IN ('RUNNING', 'OK', 'PARTIAL', 'FAILED'))
);

CREATE INDEX IF NOT EXISTS "radar_sync_runs_started_at_idx" ON "public"."radar_sync_runs"("started_at" DESC);

-- 5. Sécurité : RLS sans politique (refus par défaut) + retrait explicite des droits -------------
ALTER TABLE "public"."market_offers"   ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."radar_searches"  ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."radar_matches"   ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."radar_sync_runs" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON "public"."market_offers"   FROM anon, authenticated;
REVOKE ALL ON "public"."radar_searches"  FROM anon, authenticated;
REVOKE ALL ON "public"."radar_matches"   FROM anon, authenticated;
REVOKE ALL ON "public"."radar_sync_runs" FROM anon, authenticated;
```

## Retour arrière (seulement sur décision explicite)

```sql
DROP TABLE IF EXISTS "public"."radar_matches";
DROP TABLE IF EXISTS "public"."radar_searches";
DROP TABLE IF EXISTS "public"."radar_sync_runs";
DROP TABLE IF EXISTS "public"."market_offers";
```
Ces tables sont nouvelles et n'ont aucune dépendance entrante : le retour arrière ne touche aucune donnée existante.

## Modèles Prisma correspondants (à ajouter à `schema.prisma` au moment de l'application)

- `MarketOffer` (`@@map("market_offers")`), champs en `@map` snake_case, `searchVector Unsupported("tsvector")?` (comme `embedding` de `GraphNode`), relation `matches RadarMatch[]`.
- `RadarSearch` (`@@map("radar_searches")`), relation `user User`, `matches RadarMatch[]`.
- `RadarMatch` (`@@map("radar_matches")`), relations `user`, `offer`, `search?`, `opportunity?`.
- `RadarSyncRun` (`@@map("radar_sync_runs")`).
- Ajouter `radarSearches RadarSearch[]` et `radarMatches RadarMatch[]` à `User`, et `radarMatches RadarMatch[]` à `Opportunity`.
- Les tableaux `TEXT[]` se modélisent en `String[]`. La colonne générée n'est jamais écrite par Prisma (les champs `Unsupported` sont absents des entrées de création).

## Procédure d'application (chaque étape attend votre accord)

1. Vous validez ce SQL (ou demandez des changements).
2. Je crée le dossier de migration et j'exécute `prisma migrate status` (lecture seule sur la base distante) : doit afficher « à jour » avant toute chose.
3. Vous écrivez « OK appliquer » : j'exécute `prisma migrate deploy`.
4. Vérification par introspection : 4 tables, contraintes, index, RLS activée (`relrowsecurity`), aucun droit pour `anon` / `authenticated` (`has_table_privilege`).
5. J'ajoute les modèles au schéma, `prisma generate`, typecheck, tests. Le code du radar vient après, jamais avant la migration.

## Points d'attention

- **Colonne générée et Prisma** : `migrate deploy` exécute le SQL tel quel, mais un futur `migrate dev` peut signaler une dérive sur `search_vector` (Prisma ne connaît pas les colonnes générées). Conséquence : ne jamais utiliser `migrate dev` ni `db push` sur cette base (déjà la règle du projet).
- **Volume** : avec l'ingestion à la demande et la purge, la taille reste proportionnelle aux recherches actives. Une description pèse quelques ko ; quelques dizaines de milliers d'offres restent raisonnables. À surveiller dans Supabase : la limite de taille de base dépend de votre formule, que je n'ai pas vérifiée.
- **Données personnelles** : `radar_searches` contient des critères de recherche d'emploi (mots-clés, zone géographique) liés à un compte. La politique de confidentialité devra le mentionner ; le texte légal est à votre charge ou à celle d'un juriste, je ne l'invente pas.
- **Droits d'usage** des données des deux API : à vérifier avant de stocker un catalogue (le SQL suppose que c'est permis).
