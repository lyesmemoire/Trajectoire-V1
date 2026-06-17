-- Création de la table pour stocker les CVs optimisés
CREATE TABLE IF NOT EXISTS optimized_cvs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    cv_id UUID NOT NULL REFERENCES cvs(id) ON DELETE CASCADE,
    job_description TEXT,
    job_hash TEXT,
    improved_summary TEXT,
    improved_bullets JSONB,
    keywords_added TEXT[],
    general_advice TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sécurité RLS
ALTER TABLE optimized_cvs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Les utilisateurs peuvent voir leurs propres CVs optimisés"
    ON optimized_cvs FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Les utilisateurs peuvent insérer leurs propres CVs optimisés"
    ON optimized_cvs FOR INSERT
    WITH CHECK (auth.uid() = user_id);
