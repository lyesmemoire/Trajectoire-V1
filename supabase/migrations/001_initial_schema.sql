-- 001_initial_schema.sql

-- Activer l'extension pgcrypto pour générer des UUIDs si besoin
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TABLE: profiles
-- ============================================================================
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  credits INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Active le Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Les utilisateurs peuvent voir leur propre profil
CREATE POLICY "Users can view own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

-- Les utilisateurs peuvent modifier leur propre profil
CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Fonction pour créer automatiquement un profil à l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, credits)
  VALUES (new.id, 2); -- 2 crédits offerts à l'inscription
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger sur la création d'un utilisateur dans auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- ============================================================================
-- TABLE: transactions
-- ============================================================================
CREATE TABLE public.transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  amount INTEGER NOT NULL, -- Positif pour les achats/bonus, négatif pour l'utilisation
  type TEXT NOT NULL CHECK (type IN ('purchase', 'usage', 'bonus')),
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Les utilisateurs peuvent voir leurs propres transactions
CREATE POLICY "Users can view own transactions" 
  ON public.transactions FOR SELECT 
  USING (auth.uid() = user_id);

-- Seul le backend (service_role) peut insérer des transactions
CREATE POLICY "Service role can insert transactions"
  ON public.transactions FOR INSERT
  WITH CHECK (true);


-- ============================================================================
-- TABLE: resumes (CVs uploadés)
-- ============================================================================
CREATE TABLE public.resumes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  file_name TEXT NOT NULL,
  storage_path TEXT NOT NULL, -- Chemin dans le Storage Supabase
  parsed_content TEXT, -- Contenu texte extrait du CV
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own resumes" 
  ON public.resumes FOR ALL 
  USING (auth.uid() = user_id);


-- ============================================================================
-- TABLE: ats_analyses
-- ============================================================================
CREATE TABLE public.ats_analyses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  resume_id UUID REFERENCES public.resumes(id) ON DELETE SET NULL,
  job_description TEXT NOT NULL,
  score INTEGER,
  result_json JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.ats_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own ATS analyses" 
  ON public.ats_analyses FOR ALL 
  USING (auth.uid() = user_id);


-- ============================================================================
-- TABLE: interview_sessions
-- ============================================================================
CREATE TABLE public.interview_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  persona TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  score_overall NUMERIC(3,1),
  feedback_json JSONB,
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.interview_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own interviews" 
  ON public.interview_sessions FOR ALL 
  USING (auth.uid() = user_id);


-- ============================================================================
-- BUCKET STORAGE: resumes
-- ============================================================================
-- Si vous utilisez Supabase localement ou via SQL Editor pour créer le bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('resumes', 'resumes', false)
ON CONFLICT (id) DO NOTHING;

-- RLS sur le bucket storage
CREATE POLICY "Users can upload resumes" 
  ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'resumes' AND auth.uid() = owner);

CREATE POLICY "Users can view own resumes" 
  ON storage.objects FOR SELECT 
  USING (bucket_id = 'resumes' AND auth.uid() = owner);

CREATE POLICY "Users can delete own resumes" 
  ON storage.objects FOR DELETE 
  USING (bucket_id = 'resumes' AND auth.uid() = owner);
