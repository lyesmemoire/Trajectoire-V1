# Coding Guidelines

- **Nommage**: 
  - Fichiers: `kebab-case` (`billing.service.ts`).
  - Classes: `PascalCase` (`BillingService`).
  - Fonctions/Variables: `camelCase`.
- **Dossiers**: Un domaine par dossier dans `lib/` (`lib/billing/`, `lib/users/`).
- **Imports**: Utiliser les alias (`@/lib/users`) plutôt que les chemins relatifs complexes (`../../../lib/users`).
- **Zod**: Toujours valider les inputs via Zod.
- **DTO**: Découpler l'Entity du DTO via des types dédiés (`UserDTO`).
