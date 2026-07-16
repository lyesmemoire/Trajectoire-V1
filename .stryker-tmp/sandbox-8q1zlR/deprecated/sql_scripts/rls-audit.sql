-- 🛡️ AUDIT RLS - STUDIOENTRETIEN
-- Objectif : Zéro fuite de données comportementales ou identitaires.

-- 1. Réinitialisation des permissions
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cvs ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_insights ENABLE ROW LEVEL SECURITY;

-- 2. POLICIES : PROFILES
-- Lecture par le propriétaire uniquement
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Mise à jour des données non critiques (nom, avatar)
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 3. POLICIES : CVS
CREATE POLICY "Users can manage own CVs" ON cvs
  FOR ALL USING (auth.uid() = user_id);

-- 4. POLICIES : INTERVIEW SESSIONS (REPLAYS)
-- Anti-énumération : Même le SELECT est interdit si on n'est pas le proprio
CREATE POLICY "Users can manage own sessions" ON interview_sessions
  FOR ALL USING (auth.uid() = user_id);

-- 5. POLICIES : CAREER DATA (DNA)
CREATE POLICY "Users can read own career profile" ON career_profiles
  FOR SELECT USING (auth.uid() = userId);

CREATE POLICY "Users can read own insights" ON career_insights
  FOR SELECT USING (auth.uid() = userId);

-- ⚠️ RÈGLE D'OR : Aucune politique ne doit utiliser "TO PUBLIC" ou "ALL" sans filtre UID.
