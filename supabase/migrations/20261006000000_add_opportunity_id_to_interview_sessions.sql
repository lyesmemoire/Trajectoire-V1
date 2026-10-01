-- Lie une séance d'entretien à l'opportunité dont elle est issue (optionnel).
--
-- Contexte : la migration Prisma 20260915215555_add_opportunity_id_to_interview_session a ajouté
-- "opportunityId" à l'ANCIENNE table public."InterviewSession". La table réellement utilisée par l'application
-- (simulation/create, entretien texte et vocal) est public.interview_sessions : elle n'a pas cette colonne, donc
-- le lien séance ↔ opportunité (risques sémantiques de l'offre dans l'entretien) n'a jamais pu s'enregistrer.
--
-- Additive et idempotente : colonne nullable, aucune ligne existante modifiée.
-- ON DELETE SET NULL : supprimer une opportunité ne supprime ni ne casse les séances passées.
--
-- Retour arrière (seulement sur décision explicite) :
--   DROP INDEX IF EXISTS public."interview_sessions_opportunityId_idx";
--   ALTER TABLE public.interview_sessions DROP CONSTRAINT IF EXISTS "interview_sessions_opportunityId_fkey";
--   ALTER TABLE public.interview_sessions DROP COLUMN IF EXISTS "opportunityId";

ALTER TABLE "public"."interview_sessions"
  ADD COLUMN IF NOT EXISTS "opportunityId" TEXT;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'interview_sessions_opportunityId_fkey'
  ) THEN
    ALTER TABLE "public"."interview_sessions"
      ADD CONSTRAINT "interview_sessions_opportunityId_fkey"
      FOREIGN KEY ("opportunityId")
      REFERENCES "public"."opportunities"("id")
      ON DELETE SET NULL
      ON UPDATE CASCADE;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS "interview_sessions_opportunityId_idx"
  ON "public"."interview_sessions"("opportunityId");
