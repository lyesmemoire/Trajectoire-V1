-- 013_sync_schema_cvs_and_ats.sql

-- 1. Migration for resumes -> cvs
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'resumes') THEN
    ALTER TABLE public.resumes RENAME TO cvs;
    ALTER TABLE public.cvs RENAME COLUMN parsed_content TO extracted_text;
    ALTER TABLE public.cvs ADD COLUMN IF NOT EXISTS word_count INTEGER DEFAULT 0;
    ALTER TABLE public.cvs ADD COLUMN IF NOT EXISTS page_count INTEGER DEFAULT 0;
    ALTER TABLE public.cvs ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());
  ELSE
    CREATE TABLE IF NOT EXISTS public.cvs (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
      file_name TEXT NOT NULL,
      storage_path TEXT NOT NULL,
      extracted_text TEXT,
      word_count INTEGER DEFAULT 0,
      page_count INTEGER DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
    );
  END IF;
END $$;

-- 2. Migration for ats_analyses -> ats_reports
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'ats_analyses') THEN
    ALTER TABLE public.ats_analyses RENAME TO ats_reports;
    ALTER TABLE public.ats_reports RENAME COLUMN resume_id TO cv_id;
    ALTER TABLE public.ats_reports DROP COLUMN IF EXISTS result_json;
    ALTER TABLE public.ats_reports ADD COLUMN IF NOT EXISTS matched_keywords TEXT[] DEFAULT '{}';
    ALTER TABLE public.ats_reports ADD COLUMN IF NOT EXISTS missing_keywords TEXT[] DEFAULT '{}';
    ALTER TABLE public.ats_reports ADD COLUMN IF NOT EXISTS suggestions TEXT[] DEFAULT '{}';
    ALTER TABLE public.ats_reports ADD COLUMN IF NOT EXISTS strengths TEXT[] DEFAULT '{}';
    ALTER TABLE public.ats_reports ADD COLUMN IF NOT EXISTS weaknesses TEXT[] DEFAULT '{}';
    ALTER TABLE public.ats_reports ADD COLUMN IF NOT EXISTS total_keywords INTEGER DEFAULT 0;
  ELSE
    CREATE TABLE IF NOT EXISTS public.ats_reports (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
      cv_id UUID REFERENCES public.cvs(id) ON DELETE SET NULL,
      job_description TEXT,
      score INTEGER,
      matched_keywords TEXT[] DEFAULT '{}',
      missing_keywords TEXT[] DEFAULT '{}',
      suggestions TEXT[] DEFAULT '{}',
      strengths TEXT[] DEFAULT '{}',
      weaknesses TEXT[] DEFAULT '{}',
      total_keywords INTEGER DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
    );
  END IF;
END $$;

-- 3. AI Cache and Usage Stats tables
CREATE TABLE IF NOT EXISTS public.ai_cache (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  hash TEXT UNIQUE NOT NULL,
  endpoint TEXT NOT NULL,
  model TEXT NOT NULL,
  response JSONB NOT NULL,
  token_cost INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.ai_usage_stats (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  endpoint TEXT NOT NULL,
  model TEXT NOT NULL,
  tokens INTEGER DEFAULT 0,
  estimated_cost NUMERIC(10, 6) DEFAULT 0,
  cached BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. User Risk Scores table
CREATE TABLE IF NOT EXISTS public.user_risk_scores (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  fraud_flag BOOLEAN DEFAULT false,
  risk_score INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Update RLS policies for cvs
ALTER TABLE public.cvs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own cvs" ON public.cvs;
CREATE POLICY "Users can manage own cvs" ON public.cvs FOR ALL USING (auth.uid() = user_id);

-- 5. Force refresh of the PostgREST schema cache
NOTIFY pgrst, 'reload schema';
