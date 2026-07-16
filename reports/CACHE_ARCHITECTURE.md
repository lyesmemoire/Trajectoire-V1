# Cache Architecture

## Strategie Actuelle
- **Dashboard** : `export const dynamic = "force-dynamic";`
- **Impact** : Desactive totalement le Data Cache de Next.js pour l'ensemble des fetches de la page. Les requetes de base de donnees et calculs IA se refont a chaque refresh.

## Strategie Recommandee
1. **unstable_cache** : L'utiliser pour le `CandidateGraphDataLoader`, avec des tags (`user-id-graph`).
2. **Revalidation a la volee** : Revalider le tag lors des mutations (ajout d'une experience, fin d'une interview).
3. **React.cache** : Mettre en cache la session d'authentification pour eviter les appels multiples a `supabase.auth.getUser()`.
4. **TTL (Time to Live)** : 3600 secondes pour les previsions a long terme (Forecast, Digital Twin).

*Niveau de confiance : 100%*
