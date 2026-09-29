-- 1) Enum Plan : FREE | PRO | EXPERT | STARTER  ->  FREE | PACK | PRO
--    PostgreSQL ne sait pas supprimer une valeur d'enum : on recrée le type.
--    Idempotent : ne fait rien si STARTER/EXPERT ont déjà disparu.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_enum e
    JOIN pg_type t ON t.oid = e.enumtypid
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE n.nspname = 'public' AND t.typname = 'Plan'
      AND e.enumlabel IN ('STARTER', 'EXPERT')
  ) THEN
    -- Garde-fou : on ne convertit pas silencieusement des abonnés existants.
    IF EXISTS (SELECT 1 FROM "public"."users"
               WHERE "plan"::text IN ('STARTER', 'EXPERT'))
       OR EXISTS (SELECT 1 FROM "public"."Subscription"
                  WHERE "plan"::text IN ('STARTER', 'EXPERT')) THEN
      RAISE EXCEPTION 'Des lignes utilisent encore Plan STARTER/EXPERT : migrer ces données avant de supprimer les valeurs.';
    END IF;

    ALTER TYPE "public"."Plan" RENAME TO "Plan_old";
    CREATE TYPE "public"."Plan" AS ENUM ('FREE', 'PACK', 'PRO');

    ALTER TABLE "public"."users" ALTER COLUMN "plan" DROP DEFAULT;
    ALTER TABLE "public"."users"
      ALTER COLUMN "plan" TYPE "public"."Plan" USING "plan"::text::"public"."Plan";
    ALTER TABLE "public"."users" ALTER COLUMN "plan" SET DEFAULT 'FREE';

    ALTER TABLE "public"."Subscription" ALTER COLUMN "plan" DROP DEFAULT;
    ALTER TABLE "public"."Subscription"
      ALTER COLUMN "plan" TYPE "public"."Plan" USING "plan"::text::"public"."Plan";
    ALTER TABLE "public"."Subscription" ALTER COLUMN "plan" SET DEFAULT 'FREE';

    DROP TYPE "public"."Plan_old";
  END IF;
END $$;

-- 2) Colonnes de quota sur users
ALTER TABLE "public"."users"
  ADD COLUMN IF NOT EXISTS "packExpiresAt"   TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "simulationsUsed" INTEGER NOT NULL DEFAULT 0;
