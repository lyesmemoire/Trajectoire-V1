-- Vérifier les tables des migrations restantes
SELECT tablename FROM pg_tables WHERE tablename IN ('StorageFile', 'candidate_graphs', 'candidate_graph_snapshots');

-- Vérifier les fonctions RLS helper
SELECT routine_name FROM information_schema.routines WHERE routine_schema = 'public' AND routine_name IN ('is_admin', 'is_owner', 'current_user_id');
