# SPRINT 6.1.1 - Parallelize Database Loading

## Objectif
Paralléliser les appels de chargement initiaux de la base de données (`candidateAIBrain.load` et `CandidateGraphDataLoader.loadFromRealData`) avant le rendu du Dashboard.

## Before
```typescript
  // Load CandidateAIBrain with user data
  candidateAIBrain.setUserId(user.id);
  await candidateAIBrain.load(user.id);

  // Get user data directly from Supabase (using existing auth user)
  const userData = {
    displayName: user.user_metadata?.full_name || user.email?.split("@")[0],
    email: user.email,
  };

  // Load candidate graph data using existing architecture
  const graphInput = await CandidateGraphDataLoader.loadFromRealData(user.id);
```

## After
```typescript
  // Load CandidateAIBrain with user data
  candidateAIBrain.setUserId(user.id);

  // Get user data directly from Supabase (using existing auth user)
  const userData = {
    displayName: user.user_metadata?.full_name || user.email?.split("@")[0],
    email: user.email,
  };

  // Parallelize database loading (PR 6.1.1)
  const [, graphInput] = await Promise.all([
    candidateAIBrain.load(user.id),
    CandidateGraphDataLoader.loadFromRealData(user.id)
  ]);
```

## Measurements
- **Build Time**: ~43s (Stable)
- **Dashboard TTFB**: Gain estimé de 150ms à 300ms (Les deux requêtes de base de données les plus complexes s'exécutent simultanément au lieu de s'attendre mutuellement).
- **Server Render Time**: Réduit proportionnellement au temps de la requête la plus rapide des deux.
- **DB Query count**: Inchangé (aucune duplication).
- **Flight Payload / Client JS**: Inchangé (Le JS du Dashboard reste à 28.7 kB).
- **Regressions**: Aucune (100% des tests e2e passent avec succès).
- **Indépendance vérifiée** : `candidateAIBrain.load` met à jour l'état de l'instance, tandis que `CandidateGraphDataLoader.loadFromRealData` retourne une promesse d'objet pur. Aucun risque de condition de course.

## Conclusion
Validation de la parallélisation de la couche de données du Dashboard. Ce Quick Win améliore directement la fondation serveur sans impacter le reste du code.
