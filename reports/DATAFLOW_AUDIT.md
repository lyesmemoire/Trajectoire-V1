# Data Flow Audit

## Cartographie du flux (Dashboard)

1. **Root Layout** -> Auth Check rapide.
2. **Dashboard Layout** -> Shell de l'application (Navigation).
3. **Dashboard Page** -> Mega composant asynchrone :
   - `await supabase.auth.getUser()` (Requete DB, bloquant)
   - `await candidateAIBrain.load(user.id)` (Requete DB, bloquant)
   - `await CandidateGraphDataLoader.loadFromRealData()` (Jointures DB multiples, bloquant)
   - 17 appels sequentiels aux Moteurs d'Intelligence (Traitements CPU intensifs et asynchrones, extremement bloquants)
4. **Widgets (RSC)** -> Recoivent les donnees prêtes, rendu synchrone ultra rapide.

**Bilan** : Le rendu du composant page complet depend du moteur le plus lent de la chaine. Aucun streaming possible actuellement, l'utilisateur a un ecran blanc ou un loader global jusqu'a la fin du 17eme moteur.
