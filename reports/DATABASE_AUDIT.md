# Database Roundtrip Audit

## Constat
Le chargement de l'arbre global effectue les appels suivants au sein de la route `/dashboard` :
1. `getUser()`
2. `candidateAIBrain.load(user.id)` (Lecture depuis la DB via Supabase/Prisma)
3. `CandidateGraphDataLoader.loadFromRealData(user.id)` (Requete lourde DB)

## Optimisation Immediate
- `CandidateAIBrain.load` et `CandidateGraphDataLoader.load` n'ont aucune dependance commune au niveau des arguments, a l'exception du `user.id`.
- Ces deux appels subissent actuellement une latence additionnelle non necessaire en s'attendant mutuellement.
- **Action** : Les englober dans un `Promise.all()` permettra une execution DB simultanee, reduisant potentiellement la latence Data de moitie (gain estime a 100-200ms sur le roundtrip DB global).
