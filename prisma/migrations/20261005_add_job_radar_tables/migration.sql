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
