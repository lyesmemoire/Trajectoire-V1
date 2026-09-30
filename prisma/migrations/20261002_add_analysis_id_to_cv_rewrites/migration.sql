-- Relie une réécriture de CV à l'analyse dont elle est issue (optionnel).
-- Additive et idempotente : colonne nullable, aucune ligne existante modifiée.

ALTER TABLE "public"."cv_rewrites"
  ADD COLUMN IF NOT EXISTS "analysis_id" TEXT;

CREATE INDEX IF NOT EXISTS "cv_rewrites_analysis_id_idx"
  ON "public"."cv_rewrites"("analysis_id");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'cv_rewrites_analysis_id_fkey'
  ) THEN
    ALTER TABLE "public"."cv_rewrites"
      ADD CONSTRAINT "cv_rewrites_analysis_id_fkey"
      FOREIGN KEY ("analysis_id") REFERENCES "public"."CVAnalysis"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
