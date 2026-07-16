# Supabase Audit

## Requetes Identifiees
1. `supabase.auth.getUser()` -> Appele de facon redondante s'il l'est aussi dans le layout.
2. `CandidateAIBrain.load()` -> Effectue un SELECT asynchrone des derniers evenements.
3. `CandidateGraphDataLoader.loadFromRealData()` -> Combine plusieurs SELECT et JOIN pour construire le graphe du candidat (Profil, Competences, Experiences).

## Recommandations
- **Paralleles** : `CandidateAIBrain.load` et `CandidateGraphDataLoader` n'ont aucune dependance l'un envers l'autre. Ils peuvent (et doivent) etre lances en `Promise.all`.
- **Deduplication** : Si le layout appele `getUser()`, injecter le user ID dans les headers ou utiliser `cache()` pour dedupliquer l'appel base de donnees dans la page.
- **Cache Hit** : La frequence de mise a jour du graphe du candidat etant faible hors-interview, une politique de cache edge ou de cache data est particulierement pertinente.
